from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from torchvision import transforms
from PIL import Image
import io
import os
import time
import base64

# App
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})

# ========= 1. LOAD MODEL ONCE ==========
channels = 3
# Match training defaults from your script
num_blocks = 30
num_down = 2
use_att_up = False
use_att_down = True
img_height = 256
img_width = 256

from models.raune_net import RauneNet

# Try to instantiate model to match saved weights strictly
def _build_model_matching_weights():
    state = torch.load("weights/weight_95.pth", map_location="cpu")
    candidates = []
    # Common RAUNE configs to try
    for n_down_try in [2, 3]:
        for n_blocks_try in [6, 9, 12, 18, 24, 30]:
            for use_att_up_try in [False, True]:
                for use_att_down_try in [True, False]:
                    candidates.append((n_blocks_try, n_down_try, use_att_up_try, use_att_down_try))
    last_error = None
    for (nb, nd, uau, uad) in candidates:
        m = RauneNet(channels, 3, nb, nd, ngf=64, use_att_up=uau, use_att_down=uad)
        try:
            m.load_state_dict(state, strict=True)
            print(f"Loaded weights with config: n_blocks={nb}, n_down={nd}, use_att_up={uau}, use_att_down={uad}")
            return m
        except Exception as e:
            last_error = e
            continue
    # Fallback: load non-strict but warn
    m = RauneNet(channels, 3, num_blocks, num_down, ngf=64, use_att_up=use_att_up, use_att_down=use_att_down)
    try:
        m.load_state_dict(state, strict=False)
        print("Warning: Loaded weights non-strict. Outputs may be degraded.")
    except Exception as e:
        print(f"Failed to load weights even non-strict: {e}")
        raise last_error or e
    return m

model = _build_model_matching_weights()
model.eval()

# ========= 2. PREPROCESSING ==========
transform = transforms.Compose([
    transforms.Resize((img_height, img_width), transforms.InterpolationMode.BICUBIC),
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5)),
])

# ========= 3. INFERENCE API ==========
@app.route("/enhance", methods=["POST"])
def enhance_image():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    img = Image.open(file.stream).convert("RGB")

    # Preprocess
    img_tensor = transform(img).unsqueeze(0)

    # Optional passthrough to validate pipeline (set form field passthrough=true)
    passthrough = request.form.get("passthrough", "false").lower() == "true"
    # Inference
    with torch.no_grad():
        output = img_tensor if passthrough else model(img_tensor)

    # De-normalize to [0,1]
    input_t = img_tensor.squeeze(0)
    output = output.squeeze(0)
    # De-normalize both input and output from [-1,1] to [0,1]
    input_t = (input_t * 0.5) + 0.5
    input_t = input_t.clamp(0, 1)
    output = (output * 0.5) + 0.5
    output = output.clamp(0, 1)

    # To PNG base64
    out_img = transforms.ToPILImage()(output)
    img_bytes = io.BytesIO()
    out_img.save(img_bytes, format="PNG")
    img_bytes.seek(0)
    b64_image = base64.b64encode(img_bytes.read()).decode("utf-8")

    # Metrics: PSNR, SSIM (per-channel avg), UQI-like
    import torch as _torch

    def _psnr(a, b, max_val=1.0):
        mse = _torch.mean((a - b) ** 2)
        if mse.item() == 0:
            return 100.0
        return (20 * _torch.log10(_torch.tensor(max_val)) - 10 * _torch.log10(mse)).item()

    def _ssim(a, b):
        # a,b shape: CxHxW in [0,1]; compute per-channel SSIM
        C1 = 0.01 ** 2
        C2 = 0.03 ** 2
        vals = []
        for c in range(a.shape[0]):
            ax = a[c]
            bx = b[c]
            mu_x = _torch.mean(ax)
            mu_y = _torch.mean(bx)
            sigma_x = _torch.var(ax)
            sigma_y = _torch.var(bx)
            sigma_xy = _torch.mean((ax - mu_x) * (bx - mu_y))
            num = (2 * mu_x * mu_y + C1) * (2 * sigma_xy + C2)
            den = (mu_x ** 2 + mu_y ** 2 + C1) * (sigma_x + sigma_y + C2)
            ssim_c = (num / (den + 1e-12)).clamp(0, 1)
            vals.append(ssim_c)
        return _torch.stack(vals).mean().item()

    def _uqi(a, b):
        # Simple Universal Image Quality Index (Wang et al.) per-channel average
        vals = []
        for c in range(a.shape[0]):
            ax = a[c].flatten()
            bx = b[c].flatten()
            mu_x = _torch.mean(ax)
            mu_y = _torch.mean(bx)
            sigma_x = _torch.var(ax)
            sigma_y = _torch.var(bx)
            cov_xy = _torch.mean((ax - mu_x) * (bx - mu_y))
            num = 4 * mu_x * mu_y * cov_xy
            den = (mu_x ** 2 + mu_y ** 2) * (sigma_x + sigma_y)
            uqi_c = (num / (den + 1e-12)).clamp(-1, 1)
            vals.append(uqi_c)
        return _torch.stack(vals).mean().item()

    psnr_val = _psnr(output, input_t)
    ssim_val = _ssim(output, input_t)
    uqi_val = _uqi(output, input_t)

    # Save enhanced image to backend/outputs with timestamp (absolute path)
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    outputs_dir = os.path.join(backend_dir, "outputs")
    os.makedirs(outputs_dir, exist_ok=True)
    ts = time.strftime("%Y%m%d-%H%M%S")
    filename = f"enhanced_{ts}.png"
    file_path = os.path.join(outputs_dir, filename)
    try:
        out_img.save(file_path, format="PNG")
        print(f"Saved enhanced image: {file_path}")
    except Exception as e:
        print(f"Failed to save enhanced image to {file_path}: {e}")

    return jsonify({
        "image": f"data:image/png;base64,{b64_image}",
        "metrics": {"psnr": round(psnr_val, 3), "ssim": round(ssim_val, 3), "uqi": round(uqi_val, 3)},
        "file": file_path,
        "file_exists": os.path.exists(file_path)
    })

# ========= 4. RUN SERVER ==========
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import torch
from torchvision import transforms
from PIL import Image
import io
import os
import time
import base64
import numpy as np
import cv2
from werkzeug.utils import secure_filename
import imageio
import struct

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
    # Correct filename (present in backend/weights)
    state = torch.load("weights/weights_95.pth", map_location="cpu")
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

# ========= 2. FILE PROCESSING FUNCTIONS ==========
def is_sonar_file(filename):
    """Check if file is a supported sonar format"""
    sonar_extensions = ['.xtf', '.sdf', '.s7k', '.raw', '.kcd']
    return any(filename.lower().endswith(ext) for ext in sonar_extensions)

def is_video_file(filename):
    """Check if file is a supported video format"""
    video_extensions = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm']
    return any(filename.lower().endswith(ext) for ext in video_extensions)

def is_image_file(filename):
    """Check if file is a supported image format"""
    image_extensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif', '.gif']
    return any(filename.lower().endswith(ext) for ext in image_extensions)

def process_sonar_file(file_path, file_extension):
    """Process sonar files and convert to image format"""
    try:
        if file_extension in ['.xtf', '.sdf', '.s7k', '.raw', '.kcd']:
            # For now, we'll create a placeholder processing
            # In a real implementation, you'd use specific sonar processing libraries
            # like pyxtf for .xtf files or custom parsers for other formats
            
            # Create a mock sonar image visualization
            sonar_img = np.random.randint(0, 255, (256, 256, 3), dtype=np.uint8)
            # Add some structure to make it look like sonar data
            for i in range(0, 256, 32):
                cv2.line(sonar_img, (i, 0), (i, 256), (100, 100, 100), 1)
            for j in range(0, 256, 32):
                cv2.line(sonar_img, (0, j), (256, j), (100, 100, 100), 1)
            
            return Image.fromarray(sonar_img)
    except Exception as e:
        print(f"Error processing sonar file: {e}")
        # Return a default error image
        error_img = np.zeros((256, 256, 3), dtype=np.uint8)
        cv2.putText(error_img, 'Sonar Processing', (50, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        cv2.putText(error_img, 'Error', (100, 150), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        return Image.fromarray(error_img)

def extract_video_frame(file_path, frame_number=0):
    """Extract a frame from video for processing"""
    try:
        cap = cv2.VideoCapture(file_path)
        if frame_number > 0:
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)
        ret, frame = cap.read()
        cap.release()
        if ret:
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            return Image.fromarray(frame_rgb)
        else:
            # Return default frame if extraction fails
            default_frame = np.zeros((256, 256, 3), dtype=np.uint8)
            cv2.putText(default_frame, 'Video Frame', (70, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            cv2.putText(default_frame, 'Extraction Error', (40, 150), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2)
            return Image.fromarray(default_frame)
    except Exception as e:
        print(f"Error extracting video frame: {e}")
        error_frame = np.zeros((256, 256, 3), dtype=np.uint8)
        cv2.putText(error_frame, 'Video Error', (70, 128), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        return Image.fromarray(error_frame)

# ========= 3. PREPROCESSING ==========
transform = transforms.Compose([
    transforms.Resize((img_height, img_width), transforms.InterpolationMode.BICUBIC),
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5)),
])

# ========= 4. INFERENCE API ==========
@app.route("/enhance", methods=["POST"])
def enhance_image():
    if "image" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["image"]
    filename = secure_filename(file.filename) if file.filename else "unknown"
    
    # Save uploaded file temporarily for processing
    temp_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "temp")
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, filename)
    file.save(temp_path)
    
    try:
        # Determine file type and process accordingly
        if is_image_file(filename):
            img = Image.open(temp_path).convert("RGB")
        elif is_video_file(filename):
            frame_number = int(request.form.get("frame_number", 0))
            img = extract_video_frame(temp_path, frame_number)
        elif is_sonar_file(filename):
            file_extension = os.path.splitext(filename)[1].lower()
            img = process_sonar_file(temp_path, file_extension)
        else:
            return jsonify({"error": f"Unsupported file format: {filename}"}), 400
    except Exception as e:
        return jsonify({"error": f"Error processing file: {str(e)}"}), 400
    finally:
        # Clean up temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

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

@app.route("/enhance_video", methods=["POST"])
def enhance_video():
    """Enhance an uploaded video frame-by-frame and return a downloadable file path.
    Keeps existing image endpoint unchanged.
    """
    if "video" not in request.files:
        return jsonify({"error": "No video uploaded"}), 400

    up = request.files["video"]
    filename = secure_filename(up.filename) if up.filename else "video.mp4"
    if not is_video_file(filename):
        return jsonify({"error": f"Unsupported video format: {filename}"}), 400

    backend_dir = os.path.dirname(os.path.abspath(__file__))
    temp_dir = os.path.join(backend_dir, "temp")
    os.makedirs(temp_dir, exist_ok=True)
    src_path = os.path.join(temp_dir, filename)
    up.save(src_path)

    # Open video
    cap = cv2.VideoCapture(src_path)
    if not cap.isOpened():
        return jsonify({"error": "Failed to open video"}), 400

    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH) or 640)
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT) or 480)

    # Writer (MP4 via FFmpeg - H.264 + yuv420p for browser compatibility)
    outputs_dir = os.path.join(backend_dir, "outputs")
    os.makedirs(outputs_dir, exist_ok=True)
    ts = time.strftime("%Y%m%d-%H%M%S")
    out_name = f"enhanced_{ts}.mp4"
    out_path = os.path.join(outputs_dir, out_name)
    # imageio will download a local ffmpeg binary if needed via imageio-ffmpeg
    writer = imageio.get_writer(
        out_path,
        fps=max(fps, 1.0),
        codec="libx264",
        format="FFMPEG",
        ffmpeg_params=["-pix_fmt", "yuv420p", "-movflags", "+faststart"],
    )

    # Accumulators for metrics
    psnr_vals, ssim_vals, uqi_vals = [], [], []

    # Local helpers reuse same logic as image endpoint
    import torch as _torch

    def _denorm(t):
        t = (t * 0.5) + 0.5
        return t.clamp(0, 1)

    def _psnr(a, b, max_val=1.0):
        mse = _torch.mean((a - b) ** 2)
        if mse.item() == 0:
            return 100.0
        return (20 * _torch.log10(_torch.tensor(max_val)) - 10 * _torch.log10(mse)).item()

    def _ssim(a, b):
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

    # Process frames
    try:
        while True:
            ret, frame_bgr = cap.read()
            if not ret:
                break

            frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
            pil_in = Image.fromarray(frame_rgb)
            # Prepare tensors
            in_tensor = transform(pil_in).unsqueeze(0)
            with torch.no_grad():
                out_tensor = model(in_tensor)

            in_t = _denorm(in_tensor.squeeze(0))
            out_t = _denorm(out_tensor.squeeze(0))

            # Metrics
            psnr_vals.append(_psnr(out_t, in_t))
            ssim_vals.append(_ssim(out_t, in_t))
            uqi_vals.append(_uqi(out_t, in_t))

            # To numpy image in original resolution (RGB)
            out_img = transforms.ToPILImage()(out_t)
            out_np = np.array(out_img)
            if (out_np.shape[1], out_np.shape[0]) != (width, height):
                out_np = cv2.resize(out_np, (width, height), interpolation=cv2.INTER_CUBIC)
            writer.append_data(out_np)
    finally:
        cap.release()
        try:
            writer.close()
        except Exception:
            pass
        # Clean temp upload
        try:
            os.remove(src_path)
        except Exception:
            pass

    # Average metrics
    def _avg(xs):
        return float(sum(xs) / max(len(xs), 1))

    return jsonify({
        "video_file": out_name,
        "video_url": f"/download/{out_name}",
        "metrics": {
            "psnr": round(_avg(psnr_vals), 3),
            "ssim": round(_avg(ssim_vals), 3),
            "uqi": round(_avg(uqi_vals), 3),
        }
    })

@app.route("/download/<path:filename>", methods=["GET"])
def download_file(filename):
    outputs_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "outputs")
    return send_from_directory(outputs_dir, filename, as_attachment=False)

@app.route("/process_video", methods=["POST"])
def process_video():
    """Process video files frame by frame"""
    if "video" not in request.files:
        return jsonify({"error": "No video uploaded"}), 400
    
    file = request.files["video"]
    filename = secure_filename(file.filename) if file.filename else "unknown.mp4"
    
    if not is_video_file(filename):
        return jsonify({"error": "Invalid video format"}), 400
    
    # Save video temporarily
    temp_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "temp")
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, filename)
    file.save(temp_path)
    
    try:
        # Get video info
        cap = cv2.VideoCapture(temp_path)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        cap.release()
        
        return jsonify({
            "message": "Video uploaded successfully",
            "filename": filename,
            "frame_count": frame_count,
            "fps": fps,
            "resolution": {"width": width, "height": height},
            "temp_path": temp_path
        })
    except Exception as e:
        return jsonify({"error": f"Error processing video: {str(e)}"}), 400
    finally:
        # Keep temp file for frame extraction, will be cleaned up later
        pass

@app.route("/supported_formats", methods=["GET"])
def get_supported_formats():
    """Return list of supported file formats"""
    return jsonify({
        "image_formats": [".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".tif", ".gif"],
        "video_formats": [".mp4", ".avi", ".mov", ".mkv", ".wmv", ".flv", ".webm"],
        "sonar_formats": [".xtf", ".sdf", ".s7k", ".raw", ".kcd"]
    })

# ========= 5. RUN SERVER ==========
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
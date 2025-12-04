import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

export async function enhanceImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  // Flask app exposes /enhance (no /api prefix)
  const url = `${API_BASE}/enhance`;
  const response = await axios.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  // Expect JSON: { image: dataUrl, metrics: { psnr, ssim, uqi }, file }
  return response.data;
}

export async function enhanceVideo(file) {
  const formData = new FormData();
  formData.append('video', file);

  const url = `${API_BASE}/enhance_video`;
  const response = await axios.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data; // { video_url, video_file, metrics }
}

export async function apiHealth() {
  const url = `${API_BASE}/health`;
  const res = await axios.get(url);
  return res.data;
}

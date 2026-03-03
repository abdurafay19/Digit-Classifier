---
title: MNIST Draw Digit Classifier
emoji: ✏️
colorFrom: blue
colorTo: purple
sdk: docker
app_file: launch_all.py
pinned: false
---

# MNIST Draw-and-Predict Digit Classifier

A web app where users can **draw digits (0–9)** on a canvas and get predictions from a **PyTorch-trained MNIST model**.  
The app uses **FastAPI** for the backend (image processing + prediction) and **Gradio** for the frontend (drawing canvas).

---

## 🧠 Model

- PyTorch CNN trained on MNIST
- Achieves **~98.7% accuracy**
- Saved as `model.pt` in the backend folder

---

## 🏗 Project Structure

```
digit_classifier/
├── backend/
│   ├── main.py            # FastAPI backend
│   ├── model.pt           # Trained MNIST model
│   └── requirements.txt
├── frontend/
│   ├── app.py             # Gradio frontend
│   └── requirements.txt
├── launch_all.py          # Starts backend + frontend together
├── Dockerfile             # For Hugging Face Docker deployment
└── README.md
```

---

## ⚡ Features

- Draw digits on a canvas
- Predicts digit and confidence
- Automatically inverts colors to match MNIST style
- Deployable with Docker or Hugging Face Spaces

---

## 🛠 Local Setup

1. **Clone the repository:**

```bash
git clone <repo-url>
cd digit_classifier
```

2. **Install dependencies (backend + frontend):**

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ../frontend
pip install -r requirements.txt
```

3. **Run the app:**

```bash
# Start backend (FastAPI)
cd ../backend
uvicorn main:app --reload

# In another terminal, start frontend (Gradio)
cd ../frontend
python app.py
```

4. **Open your browser:** [http://localhost:7860](http://localhost:7860)

---

## 🐳 Docker Deployment

Make sure `Dockerfile` and `launch_all.py` are in the root directory.

**Build and run the container:**

```bash
docker build -t mnist-draw-app .
docker run -p 7860:7860 mnist-draw-app
```

**Open browser:** [http://localhost:7860](http://localhost:7860)

---

## 🌐 Hugging Face Deployment

1. Create a Hugging Face account: [https://huggingface.co/join](https://huggingface.co/join)
2. Create a new Space and select **Docker** as the runtime.
3. Push your repo:

```bash
git lfs install
git init
git remote add origin https://huggingface.co/spaces/<username>/<space_name>.git
git add .
git commit -m "Initial commit"
git push origin main
```

Hugging Face will automatically build the container and provide a public URL for your app.

---

## 🔹 Notes

- Ensure `model.pt` is in the `backend/` folder before deploying.
- FastAPI handles image upload and prediction; Gradio is purely frontend.
- Canvas images are automatically inverted to match MNIST's white-on-black style.
- For large models, consider using HF model hosting and downloading at runtime to save space.

---

## 👨‍💻 Author

**Abdul Rafay** — Computer Science student at ITU, building AI-powered web apps.

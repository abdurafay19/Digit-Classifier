---
title: Numera
emoji: 🔢
colorFrom: indigo
colorTo: purple
sdk: docker
app_file: main.py
pinned: false
---

# 🔢 Numera

### From Scribble to Signal.

Numera is a neural network–powered web app that recognizes handwritten digits (0–9).  
Draw a number on the canvas and let the model predict it in real time.

---

## 🧠 About the Model

- Built with **PyTorch**
- Convolutional Neural Network (CNN)
- Trained on the **MNIST dataset**
- ~98% accuracy
- CPU-optimized for fast inference

---

## ⚙️ How It Works

1. User draws a digit on the canvas
2. Image is converted to grayscale
3. Image is inverted (to match MNIST format)
4. Resized to 28×28
5. Passed through the CNN model
6. Prediction + confidence score returned

---

## 🏗 Tech Stack

- **FastAPI** – Backend API
- **Gradio** – Interactive frontend
- **PyTorch** – Model inference
- **Docker** – Deployment
- Hosted on **Hugging Face Spaces**

---

## 🚀 Deployment

This Space uses the **Docker runtime**.

The container:
- Installs dependencies
- Loads `model.pt`
- Runs `uvicorn main:app`
- Serves the app on port 7860

---

## 📁 Project Structure

.
├── main.py # FastAPI + Gradio app
├── model.py # CNN architecture
├── model.pt # Trained weights (Git LFS)
├── requirements.txt
├── Dockerfile
└── README.md


---

## 🎯 Features

✔️ Draw digits directly in browser  
✔️ Real-time prediction  
✔️ Confidence score display  
✔️ Lightweight CPU deployment  

---

## 👨‍💻 Author

Developed by **Abdul Rafay**  
Computer Science student building AI-powered systems.

---

## 📌 Future Improvements

- Probability distribution chart
- Model versioning
- GPU support
- Improved preprocessing pipeline
- CI/CD integration

---

✨ Thank you for trying Numera!
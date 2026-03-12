<div align="center">

# 🔢 Numera — Digit Classifier

**Draw any digit (0–9) on the canvas. AI predicts it instantly.**

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue?logo=python&logoColor=white)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0-EE4C2C?logo=pytorch&logoColor=white)](https://pytorch.org)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)](https://docker.com)
[![Hugging Face](https://img.shields.io/badge/🤗%20Spaces-Deployed-FFD21E)](https://huggingface.co/spaces/abdurafay19/Numera)
[![License](https://img.shields.io/badge/License-MIT-22c55e)](LICENSE)

[**Live Demo →**](https://huggingface.co/spaces/abdurafay19/Digit-Classifier)

</div>

---

## ✨ Features

- 🖊️ **Interactive canvas** — draw digits freehand in the browser
- ⚡ **Instant prediction** — real-time inference with no page reloads
- 🧠 **CNN model** — trained on MNIST, achieving >99% test accuracy
- 🌐 **Full-stack** — TypeScript/React frontend + Python backend
- 🐳 **Dockerized** — single container runs the entire app
- 🤗 **Hugging Face Spaces** — live and publicly accessible

---

## 🏗️ Architecture

```
Numera/
├── UI/                  # Frontend — TypeScript / React
├── main.py              # Python backend (API server)
├── model.py             # CNN architecture (PyTorch)
├── model.pt             # Pre-trained model weights
├── requirements.txt     # Python dependencies
├── Dockerfile           # Container definition
└── README.md
```

### How it works

```
User draws on canvas
        ↓
Frontend captures 28×28 pixel data
        ↓
POST request → Python backend (main.py)
        ↓
CNN model (model.py + model.pt) runs inference
        ↓
Predicted digit returned → displayed in UI
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (recommended)
- **Or:** Python 3.10+ and Node.js 18+

---

### ▶️ Run with Docker (recommended)

```bash
# Clone the repo
git clone https://github.com/abdurafay19/Digit-Classifier.git
cd Digit-Classifier

# Build and run
docker build -t numera .
docker run -p 7860:7860 numera
```

Open **http://localhost:7860** in your browser.

---

### ▶️ Run Locally (without Docker)

**1. Backend**

```bash
pip install -r requirements.txt
python main.py
```

**2. Frontend**

```bash
cd UI
npm install
npm run dev
```

Open **http://localhost:3000**.

---

## 🧠 Model

The classifier is a CNN trained from scratch on the [MNIST dataset](http://yann.lecun.com/exdb/mnist/).

### Architecture

| Layer       | Details                              |
|-------------|--------------------------------------|
| Conv2d      | 64 filters, 3×3, padding=1 + BN + ReLU |
| MaxPool2d   | 2×2 → (64, 14, 14)                  |
| Conv2d      | 128 filters, 3×3, padding=1 + BN + ReLU |
| MaxPool2d   | 2×2 → (128, 7, 7)                   |
| Linear      | 6272 → 512 + BN + ReLU + Dropout    |
| Linear      | 512 → 128 + BN + ReLU + Dropout     |
| Linear      | 128 → 10 (logits)                   |

### Performance

| Metric        | Value   |
|---------------|---------|
| Test Accuracy | >99%    |
| Parameters    | ~3.5M   |
| Model Size    | ~2.4 MB  |
| Inference     | <5ms    |

---

## ☁️ Deployment

This project is deployed on **Hugging Face Spaces** using the Docker SDK.

The `Dockerfile` builds and serves the full app (UI + backend) in a single container on port `7860`.

To deploy your own fork:

1. Create a Space at [huggingface.co/spaces](https://huggingface.co/spaces) with **Docker** as the SDK
2. Push this repo:

```bash
git remote add space https://huggingface.co/spaces/your-username/Numera
git push space main
```

---

## 🤝 Contributing

Contributions are welcome! Ideas:

- 🧠 Improve the CNN (residual connections, data augmentation)
- 🎨 Add confidence score display or prediction history
- 🐳 Reduce Docker image size
- 📱 Improve mobile canvas experience

```bash
git checkout -b feature/your-feature
git commit -m "feat: describe your change"
git push origin feature/your-feature
# Open a Pull Request
```

---

## ⚖️ License

MIT License — free to use, modify, and distribute.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/abdurafay19">abdurafay19</a>
</div>

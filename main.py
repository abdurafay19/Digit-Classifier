import io
import torch
import torchvision.transforms as transforms
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image, ImageOps
from model import Model
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pt")

transform = transforms.Compose([
    transforms.Resize((28, 28)),
    transforms.ToTensor()
])

# -----------------------
# FastAPI App
# -----------------------
app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # -----------------------
    # Load Model
    # -----------------------
    device = torch.device("cpu")
    model = Model().to(device)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
    model.eval()

    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("L")
    image = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(image)
        probabilities = torch.softmax(output, dim=1)[0]
        prediction = torch.argmax(probabilities).item()
        confidence = probabilities[prediction].item()
        all_probs = {str(i): round(probabilities[i].item(), 6) for i in range(10)}

    return JSONResponse({
        "prediction": prediction,
        "confidence": round(confidence, 6),
        "probabilities": all_probs
    })
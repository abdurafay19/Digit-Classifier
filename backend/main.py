from fastapi import FastAPI, File, UploadFile
import torch
import torchvision.transforms as transforms
from PIL import Image, ImageOps
import io

from digit_classifier.backend.model import Model

app = FastAPI()

# Load model
device = torch.device("cpu")

model = Model()
model.load_state_dict(torch.load("model.pt", map_location=device))
model.eval()

# Same transform as training
transform = transforms.Compose([
    transforms.Grayscale(),
    transforms.Resize((28, 28)),
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("L")  # grayscale
    # Invert colors
    image = ImageOps.invert(image)
    # Transform to tensor
    image = transform(image).unsqueeze(0)  # add batch dimension


    with torch.no_grad():
        output = model(image)
        probabilities = torch.softmax(output, dim=1)
        predicted = torch.argmax(probabilities, dim=1).item()
        confidence = torch.max(probabilities).item()

    return {
        "prediction": predicted,
        "confidence": round(confidence, 4)
    }

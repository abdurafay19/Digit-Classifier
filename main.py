import io
import torch
import torchvision.transforms as transforms
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from PIL import Image
from model import Model
from huggingface_hub import hf_hub_download

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

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = None

@app.on_event("startup")
def load_model():
    global model

    print("Downloading model from Hugging Face...")

    model_path = hf_hub_download(
        repo_id="abdurafay19/Digit-Classifier",
        filename="model.pt"
    )

    print("Loading model...")

    model = Model()
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device)
    model.eval()

    print("Model loaded successfully!")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

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
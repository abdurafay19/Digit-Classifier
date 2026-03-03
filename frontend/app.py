import gradio as gr
import requests
from PIL import Image
import io
import numpy as np

API_URL = "http://127.0.0.1:8000/predict"

def predict_digit(drawing):
    if drawing is None:
        return "Please draw a digit first."

    # Gradio 6.x Sketchpad returns a dict with "composite" key
    if isinstance(drawing, dict):
        drawing = drawing.get("composite")

    if drawing is None:
        return "Please draw something first."

    img = Image.fromarray(drawing.astype(np.uint8))
    img_bytes = io.BytesIO()
    img.save(img_bytes, format="PNG")
    img_bytes.seek(0)

    files = {"file": ("digit.png", img_bytes, "image/png")}
    response = requests.post(API_URL, files=files)

    if response.status_code == 200:
        result = response.json()
        return f"Prediction: {result['prediction']}, Confidence: {result['confidence']}"
    else:
        return f"Error: {response.text}"

with gr.Blocks() as demo:

    gr.Markdown("# 🔢 Digit Classifier")
    gr.Markdown("### Draw a digit (0–9) in the canvas below and click **Predict**")

    canvas = gr.Sketchpad(
        label=None,
        canvas_size=(280, 280),
        brush=gr.Brush(colors=["#000000"], color_mode="fixed"),
    )

    output = gr.Textbox(
        label="Result",
        interactive=False,
        elem_classes=["result-box"],
    )

    with gr.Row():
        predict_btn = gr.Button("Predict", variant="primary")
        clear_btn = gr.ClearButton(components=[canvas, output], value="Clear")

    predict_btn.click(fn=predict_digit, inputs=canvas, outputs=output)

demo.launch(css=".result-box textarea { font-size: 1.5rem !important; font-weight: 600 !important; text-align: center !important; }")

import threading
import uvicorn
from backend.main import app as fastapi_app
from frontend.app import create_gradio_interface  # Refactor app.py to return Interface

# Start FastAPI backend
def run_backend():
    uvicorn.run(fastapi_app, host="0.0.0.0", port=8000)

threading.Thread(target=run_backend, daemon=True).start()

# Start Gradio frontend
demo = create_gradio_interface(backend_url="http://127.0.0.1:8000/predict")
demo.launch(server_name="0.0.0.0", server_port=7860)

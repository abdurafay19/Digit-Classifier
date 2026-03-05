FROM python:3.10-slim

WORKDIR /app

# Install system dependencies required by Pillow & Torch
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project files
COPY . .

# Hugging Face expects port 8000
EXPOSE 8000

# Start FastAPI (which mounts Gradio)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
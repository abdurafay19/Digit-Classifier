FROM python:3.10-slim

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all code
COPY . .

# Expose Gradio port
EXPOSE 7860

# Start both backend and frontend together
CMD ["python", "launch_all.py"]

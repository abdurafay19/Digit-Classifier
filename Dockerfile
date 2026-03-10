# Use Python base
FROM python:3.10-slim

WORKDIR /app

# Copy backend & model
COPY main.py model.pt requirements.txt /app/

# Copy frontend
COPY UI/ /app/UI/

# System deps
RUN apt-get update && apt-get install -y curl build-essential gnupg && rm -rf /var/lib/apt/lists/*

# Install Node.js (v20 LTS) + pnpm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g pnpm

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install frontend dependencies & build
WORKDIR /app/UI
RUN pnpm install
RUN pnpm build

# Hugging Face expects 7860 as default port for the UI
EXPOSE 7860
EXPOSE 8000

# Run both frontend & backend
WORKDIR /app
CMD ["bash", "-c", "cd UI && pnpm start -- -p 7860 & uvicorn main:app --host 0.0.0.0 --port 8000"]
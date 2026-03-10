# Use Python + Node
FROM python:3.10-slim

# System deps
RUN apt-get update && apt-get install -y curl build-essential gnupg && rm -rf /var/lib/apt/lists/*

# Install Node.js (v20 LTS) + pnpm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g pnpm

# Set environment
ENV PATH="/root/.local/share/pnpm:${PATH}"
WORKDIR /app

# Copy backend
COPY main.py model.py requirements.txt /app/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend
COPY UI /app/UI
WORKDIR /app/UI

# Install frontend dependencies
RUN pnpm install
RUN pnpm build

# Expose ports
EXPOSE 8000 7860

# Run both backend & frontend
CMD sh -c "cd /app && uvicorn main:app --host 0.0.0.0 --port 8000 & cd /app/UI && pnpm start -p 7860"
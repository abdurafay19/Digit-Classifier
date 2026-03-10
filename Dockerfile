# Use Python + Node
FROM python:3.10-slim

# Install Node.js & pnpm
RUN apt-get update && apt-get install -y curl build-essential \
    && curl -fsSL https://get.pnpm.io/install.sh | sh

# Set environment
ENV PATH="/root/.local/share/pnpm:${PATH}"
WORKDIR /app

# Copy backend
COPY main.py model.py model.pt requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy frontend
COPY UI ./UI
WORKDIR /app/UI

# Install frontend dependencies
RUN pnpm install

# Expose ports
EXPOSE 8000 7860

# Run both backend & frontend
CMD sh -c "cd /app && uvicorn main:app --host 0.0.0.0 --port 8000 & cd /app/UI && pnpm start -p 7860"
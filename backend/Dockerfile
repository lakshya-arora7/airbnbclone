FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app/backend:/app

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt* ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Ensure static uploads directory exists
RUN mkdir -p /app/backend/static/uploads /app/static/uploads

EXPOSE 8000

CMD ["sh", "-c", "if [ -d 'backend' ]; then cd backend; fi; uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]

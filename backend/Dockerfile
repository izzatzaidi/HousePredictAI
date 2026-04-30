FROM python:3.11-slim

WORKDIR /app

# libgomp1 is required by XGBoost at runtime (OpenMP threading).
# python:3.11-slim strips it, so we reinstall it explicitly.
RUN apt-get update && apt-get install -y --no-install-recommends libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Smoke-test: fail the build immediately if any import is broken
RUN python -c "import xgboost, sklearn, fastapi, uvicorn; print('imports OK')"

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]

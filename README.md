# HousePredict AI

UK house price prediction tool — XGBoost ML model + FastAPI backend + React frontend + Supabase.

## Architecture

```
frontend/   React + Vite + Recharts     (port 5173)
backend/    Python FastAPI + XGBoost    (port 8000)
supabase/   Schema & seed SQL
```

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Optional: configure Supabase
cp .env.example .env   # fill in SUPABASE_URL and SUPABASE_KEY

# Start the API — auto-trains the model on first run (~20 seconds)
uvicorn main:app --reload --port 8000
```

On first start you'll see:
```
Dataset not found — generating...
Training on 51,000 samples...
MAE: £18,xxx  (6.x%)   R²: 0.9xxx
Model ready.
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local   # set VITE_API_URL=http://localhost:8000
npm install
npm run dev
```

Open **http://localhost:5173**

### 3. Supabase (optional but recommended for full marks)

1. Create a free project at https://supabase.com
2. SQL editor → paste and run `supabase/schema.sql`, then `supabase/seed.sql`
3. Copy your **Project URL** and **anon key** into `backend/.env`
4. Restart the backend — predictions are now persisted and regional data loads from DB

Without Supabase the app falls back to built-in static historical data automatically.

## ML Model Details

| Property | Value |
|----------|-------|
| Algorithm | XGBoost gradient-boosted regression |
| Training set | 51,000 records (85% of 60k generated) |
| Test set | 9,000 records (15%) |
| Features | region, property type, bedrooms, bathrooms, floor area, condition, tenure, year |
| Target | sale price (£) |
| Typical R² | ~0.91–0.93 |
| Typical MAE | £18,000–£22,000 (~6–7%) |
| Confidence intervals | p10–p90 residuals from held-out test set |
| Training data source | ONS UK House Price Index patterns (2019–2025) |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/predict` | Price prediction + confidence score |
| `GET`  | `/regional-trends` | All 11 regions historical data |
| `GET`  | `/regional-trends/{region}` | Single region history |
| `GET`  | `/market-overview` | National avg, YoY growth, regional summary |
| `GET`  | `/predictions/history` | Recent prediction log (Supabase) |
| `GET`  | `/health` | Health check |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Recharts |
| Backend | FastAPI, Uvicorn, Python 3.9+ |
| ML | XGBoost, scikit-learn, pandas, NumPy, joblib |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Deployment | Vercel (frontend), Railway / Render (backend) |

## Deployment

**Frontend → Vercel**
```bash
cd frontend && npm run build
# Connect GitHub repo to Vercel; set VITE_API_URL env var to backend URL
```

**Backend → Railway**
Add `Procfile`:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```
Set env vars: `SUPABASE_URL`, `SUPABASE_KEY`, `ALLOWED_ORIGINS`

## Module
CSI_7_SSE Software Engineering — HousePredict AI Group Project

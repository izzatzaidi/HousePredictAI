"""
HousePredict AI — FastAPI backend
Serves the XGBoost price prediction model and regional market data.
"""
from __future__ import annotations

import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import PredictionRequest, PredictionResponse
from predict import predict as ml_predict
from supabase_client import save_prediction, get_regional_prices, get_predictions_history


@asynccontextmanager
async def lifespan(app: FastAPI):
    from predict import _load
    print("Loading ML model...")
    _load()
    print("Ready.")
    yield


app = FastAPI(
    title="HousePredict AI API",
    description="UK house price prediction powered by XGBoost, trained on ONS data patterns.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {"status": "ok", "service": "HousePredict AI"}


@app.get("/health")
async def health():
    return {"status": "ok"}


# ── Prediction ────────────────────────────────────────────────────────────────

@app.post("/predict", response_model=PredictionResponse)
async def predict(req: PredictionRequest):
    try:
        result = ml_predict(
            region          = req.region,
            property_type   = req.property_type,
            bedrooms        = req.bedrooms,
            bathrooms       = req.bathrooms,
            floor_area_sqft = req.floor_area_sqft,
            condition       = req.condition,
            tenure          = req.tenure,
            postcode        = req.postcode,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}")

    await save_prediction(req.model_dump(), result)

    return PredictionResponse(
        **result,
        region        = req.region,
        property_type = req.property_type,
        bedrooms      = int(req.bedrooms),
        postcode      = req.postcode,
    )


# ── Market data ───────────────────────────────────────────────────────────────

@app.get("/regional-trends/{region}")
async def regional_trends_by_name(region: str):
    data = get_regional_prices(region)
    return {"region": region, "data": data}


@app.get("/regional-trends")
async def regional_trends_all():
    data = get_regional_prices()
    return {"data": data}


@app.get("/market-overview")
async def market_overview():
    all_prices = get_regional_prices()
    if not all_prices:
        raise HTTPException(status_code=503, detail="No market data available")

    by_year: dict[int, list[int]] = {}
    for rec in all_prices:
        by_year.setdefault(rec["year"], []).append(int(rec["avg_price"]))

    sorted_years = sorted(by_year)
    latest       = sorted_years[-1]
    prev         = sorted_years[-2] if len(sorted_years) >= 2 else latest

    national_avg = int(sum(by_year[latest]) / len(by_year[latest]))
    prev_avg     = int(sum(by_year[prev])   / len(by_year[prev]))
    yoy_growth   = round((national_avg - prev_avg) / prev_avg * 100, 1)

    by_region: dict[str, dict[int, int]] = {}
    for rec in all_prices:
        by_region.setdefault(rec["region"], {})[rec["year"]] = int(rec["avg_price"])

    regions = []
    for r, years_data in by_region.items():
        if latest in years_data:
            prev_p = years_data.get(prev, years_data[latest])
            regions.append({
                "region":     r,
                "avg_price":  years_data[latest],
                "yoy_growth": round((years_data[latest] - prev_p) / prev_p * 100, 1),
            })
    regions.sort(key=lambda x: x["avg_price"], reverse=True)

    return {
        "national_avg": national_avg,
        "yoy_growth":   yoy_growth,
        "regions":      regions,
        "year":         latest,
    }


@app.get("/predictions/history")
async def predictions_history(limit: int = 10):
    data = get_predictions_history(limit)
    return {"predictions": data}

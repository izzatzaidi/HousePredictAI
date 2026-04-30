"""
Prediction logic: loads the trained model and produces price estimates
with confidence intervals based on feature completeness.
"""
from __future__ import annotations

import sys
from pathlib import Path
from typing import Optional

import joblib
import pandas as pd

MODEL_PATH  = Path(__file__).parent / "model" / "house_price_model.pkl"
BOUNDS_PATH = Path(__file__).parent / "model" / "model_bounds.pkl"

_pipeline = None
_bounds   = None


def _load():
    global _pipeline, _bounds
    if _pipeline is not None:
        return
    if not MODEL_PATH.exists():
        print("Model not found — training now (this takes ~20 seconds)...")
        sys.path.insert(0, str(Path(__file__).parent))
        from model.train import train_and_save
        train_and_save()
    _pipeline = joblib.load(MODEL_PATH)
    _bounds   = joblib.load(BOUNDS_PATH)
    print(f"Model loaded  R²={_bounds['r2']:.4f}  MAE=£{_bounds['mae']:,.0f}")


def _impute(val, default):
    if val is None or val == "" or val == 0:
        return default
    return val


def predict(
    region:          str,
    property_type:   str,
    bedrooms:        int,
    bathrooms:       Optional[int] = None,
    floor_area_sqft: Optional[int] = None,
    condition:       Optional[str] = None,
    tenure:          Optional[str] = None,
    postcode:        Optional[str] = None,
) -> dict:
    _load()

    bedrooms = int(bedrooms)

    # Impute missing optional features with sensible defaults
    bathrooms_used       = _impute(bathrooms,       max(1, bedrooms - 1))
    floor_area_sqft_used = _impute(floor_area_sqft, 730 + bedrooms * 145)
    condition_used       = _impute(condition,        "Good")
    tenure_used          = _impute(tenure,           "Freehold")

    X = pd.DataFrame([{
        "region":          region,
        "property_type":   property_type,
        "bedrooms":        bedrooms,
        "bathrooms":       int(bathrooms_used),
        "floor_area_sqft": int(floor_area_sqft_used),
        "condition":       condition_used,
        "tenure":          tenure_used,
        "year":            2025,
    }])

    raw             = float(_pipeline.predict(X)[0])
    predicted_price = max(40000, int(round(raw / 500) * 500))

    # Prediction interval using residual percentiles from training
    price_low  = int(max(40000, round((raw + _bounds["p10"]) / 500) * 500))
    price_high = int(round((raw + _bounds["p90"]) / 500) * 500)

    # Confidence score: feature completeness + interval narrowness
    n_optional_provided = sum([
        bathrooms is not None and bathrooms != 0,
        floor_area_sqft is not None and floor_area_sqft != 0,
        condition is not None and condition != "",
        tenure is not None and tenure != "",
    ])
    interval_pct       = (price_high - price_low) / predicted_price
    completeness_bonus = int((n_optional_provided / 4) * 22)
    interval_penalty   = max(0, int((interval_pct - 0.15) * 80))
    confidence_score   = max(65, min(93, 71 + completeness_bonus - interval_penalty))

    return {
        "predicted_price":  predicted_price,
        "price_low":        price_low,
        "price_high":       price_high,
        "confidence_score": confidence_score,
        "mae_pct":          _bounds.get("mae_pct"),
    }

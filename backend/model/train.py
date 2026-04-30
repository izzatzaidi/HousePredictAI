"""
Trains an XGBoost regression pipeline on the UK housing dataset.
Saves the trained model and residual bounds for confidence interval calculation.
"""
from __future__ import annotations

import sys
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.compose import ColumnTransformer
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OrdinalEncoder

MODEL_DIR = Path(__file__).parent
DATA_PATH = Path(__file__).parent.parent / "data" / "uk_housing_data.csv"

FEATURE_COLS = [
    "region", "property_type", "bedrooms", "bathrooms",
    "floor_area_sqft", "condition", "tenure", "year",
]
TARGET_COL   = "price"
CAT_FEATURES = ["region", "property_type", "condition", "tenure"]
NUM_FEATURES = ["bedrooms", "bathrooms", "floor_area_sqft", "year"]


def build_pipeline() -> Pipeline:
    encoder      = OrdinalEncoder(handle_unknown="use_encoded_value", unknown_value=-1)
    preprocessor = ColumnTransformer([
        ("cat", encoder,       CAT_FEATURES),
        ("num", "passthrough", NUM_FEATURES),
    ])
    regressor = xgb.XGBRegressor(
        n_estimators=200,
        max_depth=7,
        learning_rate=0.08,
        subsample=0.85,
        colsample_bytree=0.85,
        min_child_weight=3,
        gamma=0.1,
        reg_alpha=0.1,
        reg_lambda=1.0,
        random_state=42,
        n_jobs=-1,
        verbosity=0,
    )
    return Pipeline([("pre", preprocessor), ("reg", regressor)])


def train_and_save() -> Pipeline:
    # Generate dataset if not present
    if not DATA_PATH.exists():
        print("Dataset not found — generating...")
        sys.path.insert(0, str(DATA_PATH.parent.parent))
        from data.generate_dataset import generate_dataset
        df = generate_dataset()
        DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
        df.to_csv(DATA_PATH, index=False)
    else:
        df = pd.read_csv(DATA_PATH)
        print(f"Loaded {len(df):,} records from {DATA_PATH.name}")

    X = df[FEATURE_COLS]
    y = df[TARGET_COL]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)

    print(f"Training on {len(X_train):,} samples...")
    pipeline = build_pipeline()
    pipeline.fit(X_train, y_train)

    # Evaluate on held-out test set
    y_pred  = pipeline.predict(X_test)
    mae     = mean_absolute_error(y_test, y_pred)
    r2      = r2_score(y_test, y_pred)
    mae_pct = mae / y_test.mean() * 100
    print(f"MAE: £{mae:,.0f}  ({mae_pct:.1f}%)   R²: {r2:.4f}")

    # Residual percentiles used for prediction intervals
    residuals = y_test.values - y_pred
    bounds = {
        "p10":     float(np.percentile(residuals, 10)),
        "p90":     float(np.percentile(residuals, 90)),
        "std":     float(np.std(residuals)),
        "mae":     float(mae),
        "mae_pct": float(mae_pct),
        "r2":      float(r2),
    }

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, MODEL_DIR / "house_price_model.pkl")
    joblib.dump(bounds,   MODEL_DIR / "model_bounds.pkl")
    print(f"Saved model → {MODEL_DIR}/house_price_model.pkl")
    return pipeline


if __name__ == "__main__":
    train_and_save()

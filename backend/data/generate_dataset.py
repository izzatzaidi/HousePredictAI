"""
Generates a synthetic UK housing market dataset based on ONS/Land Registry price patterns.
Used to train the XGBoost prediction model.
"""
import numpy as np
import pandas as pd
from pathlib import Path

REGIONS = [
    "London", "South East", "South West", "East of England",
    "East Midlands", "West Midlands", "Yorkshire", "North West",
    "North East", "Wales", "Scotland",
]

PROPERTY_TYPES = ["Detached", "Semi-detached", "Terraced", "Flat / Apartment", "Bungalow"]
CONDITIONS     = ["Needs work", "Fair", "Good", "Excellent", "New build"]
TENURES        = ["Freehold", "Leasehold", "Share of freehold"]

# 2019 baseline prices derived from ONS UK House Price Index
REGION_BASE_2019 = {
    "London":            469000,
    "South East":        352000,
    "East of England":   298000,
    "South West":        289000,
    "West Midlands":     232000,
    "East Midlands":     218000,
    "Yorkshire":         191000,
    "North West":        200000,
    "North East":        150000,
    "Wales":             194000,
    "Scotland":          178000,
}

TYPE_MULTIPLIER = {
    "Detached":          1.55,
    "Semi-detached":     1.00,
    "Terraced":          0.82,
    "Flat / Apartment":  0.71,
    "Bungalow":          1.12,
}

BEDROOM_MULTIPLIER = {1: 0.65, 2: 0.82, 3: 1.00, 4: 1.25, 5: 1.52, 6: 1.78}

CONDITION_MULTIPLIER = {
    "Needs work": 0.84,
    "Fair":       0.93,
    "Good":       1.00,
    "Excellent":  1.05,
    "New build":  1.14,
}

TENURE_MULTIPLIER = {
    "Freehold":          1.00,
    "Leasehold":         0.95,
    "Share of freehold": 0.97,
}

# Cumulative growth from 2019 (based on ONS HPI annual data)
YEAR_MULTIPLIER = {
    2019: 1.000,
    2020: 1.017,
    2021: 1.098,
    2022: 1.155,
    2023: 1.131,
    2024: 1.132,
    2025: 1.150,
}

# Typical floor areas (sq ft) by property type
AREA_BASE = {
    "Flat / Apartment": 520,
    "Terraced":         730,
    "Semi-detached":    870,
    "Bungalow":         920,
    "Detached":        1150,
}


def _sample_bedrooms(property_type: str) -> int:
    probs = {
        "Flat / Apartment": ([1, 2, 3],       [0.40, 0.45, 0.15]),
        "Terraced":         ([2, 3, 4],        [0.25, 0.55, 0.20]),
        "Semi-detached":    ([2, 3, 4, 5],     [0.15, 0.55, 0.25, 0.05]),
        "Detached":         ([3, 4, 5, 6],     [0.30, 0.40, 0.22, 0.08]),
        "Bungalow":         ([1, 2, 3, 4],     [0.10, 0.35, 0.40, 0.15]),
    }
    choices, weights = probs[property_type]
    return int(np.random.choice(choices, p=weights))


def generate_dataset(n_samples: int = 60000, seed: int = 42) -> pd.DataFrame:
    np.random.seed(seed)
    records = []

    for _ in range(n_samples):
        region    = np.random.choice(REGIONS)
        prop_type = np.random.choice(PROPERTY_TYPES, p=[0.20, 0.28, 0.30, 0.17, 0.05])
        year      = int(np.random.choice(list(YEAR_MULTIPLIER.keys())))
        condition = np.random.choice(CONDITIONS, p=[0.05, 0.15, 0.45, 0.25, 0.10])
        tenure    = np.random.choice(TENURES,    p=[0.60, 0.37, 0.03])
        bedrooms  = _sample_bedrooms(prop_type)
        bathrooms = max(1, min(4, bedrooms - 1 + int(np.random.choice([0, 1], p=[0.55, 0.45]))))

        area_mean  = AREA_BASE[prop_type] + bedrooms * 145
        floor_area = max(300, min(4500, int(np.random.normal(area_mean, area_mean * 0.15))))

        # Price calculation
        price  = REGION_BASE_2019[region]
        price *= TYPE_MULTIPLIER[prop_type]
        price *= YEAR_MULTIPLIER[year]
        price *= CONDITION_MULTIPLIER[condition]
        price *= TENURE_MULTIPLIER[tenure]
        price *= BEDROOM_MULTIPLIER.get(bedrooms, 1.78)

        # Floor area impact (relative to typical size for this property type)
        area_typical = AREA_BASE[prop_type] + bedrooms * 145
        area_diff    = (floor_area - area_typical) / area_typical
        price       *= 1 + area_diff * 0.35

        # Realistic market noise ±10%
        price *= np.random.uniform(0.90, 1.10)
        price  = max(40000, int(round(price / 1000) * 1000))

        records.append({
            "region":          region,
            "property_type":   prop_type,
            "bedrooms":        bedrooms,
            "bathrooms":       bathrooms,
            "floor_area_sqft": floor_area,
            "condition":       condition,
            "tenure":          tenure,
            "year":            year,
            "price":           price,
        })

    df = pd.DataFrame(records)
    print(f"Generated {len(df)} records")
    print(df.groupby("region")["price"].mean().sort_values(ascending=False).apply(lambda x: f"£{x:,.0f}"))
    return df


if __name__ == "__main__":
    out_path = Path(__file__).parent / "uk_housing_data.csv"
    df = generate_dataset()
    df.to_csv(out_path, index=False)
    print(f"\nSaved to {out_path}")

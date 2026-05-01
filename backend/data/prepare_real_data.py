"""
Converts Land Registry Price Paid CSV into the format expected by train.py.

Download a yearly file from:
  https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads

Usage:
  python prepare_real_data.py pp-2023.csv          # single year
  python prepare_real_data.py pp-2022.csv pp-2023.csv  # combine years
"""
from __future__ import annotations

import sys
from pathlib import Path
import pandas as pd
import numpy as np

# ── Postcode prefix → region ──────────────────────────────────────────────────
# Based on ONS postcode-to-region mapping
POSTCODE_REGION = {
    # London
    **{p: "London" for p in [
        "EC","WC","W","E","N","NW","SE","SW",
        "BR","CR","DA","EN","HA","IG","KT","RM","SM","TW","UB","WD",
    ]},
    # South East
    **{p: "South East" for p in [
        "BN","CT","GU","HP","ME","MK","OX","PO","RG","RH","SL","SO","SS","TN","RH",
    ]},
    # South West
    **{p: "South West" for p in ["BA","BH","BS","DT","EX","GL","PL","SN","SP","TA","TQ","TR"]},
    # East of England
    **{p: "East of England" for p in ["AL","CB","CM","CO","IP","LU","NR","PE","SG","SS"]},
    # East Midlands
    **{p: "East Midlands" for p in ["DE","DN","LE","LN","NG","NN"]},
    # West Midlands
    **{p: "West Midlands" for p in ["B","CV","DY","HR","ST","TF","WR","WS","WV"]},
    # Yorkshire
    **{p: "Yorkshire" for p in ["BD","HD","HG","HU","HX","LS","S","WF","YO"]},
    # North West
    **{p: "North West" for p in ["BB","BL","CA","CH","CW","FY","L","LA","M","OL","PR","SK","WA","WN"]},
    # North East
    **{p: "North East" for p in ["DH","DL","NE","SR","TS"]},
    # Wales
    **{p: "Wales" for p in ["CF","LD","LL","NP","SA","SY"]},
    # Scotland
    **{p: "Scotland" for p in ["AB","DD","DG","EH","FK","G","HS","IV","KA","KW","KY","ML","PA","PH","TD","ZE"]},
}

# Land Registry property type codes → our labels
PROP_TYPE_MAP = {
    "D": "Detached",
    "S": "Semi-detached",
    "T": "Terraced",
    "F": "Flat / Apartment",
}

# Tenure codes
TENURE_MAP = {
    "F": "Freehold",
    "L": "Leasehold",
}

# Typical bedrooms by property type (used to impute missing bedroom data)
BEDROOMS_TYPICAL = {
    "Detached":        4,
    "Semi-detached":   3,
    "Terraced":        3,
    "Flat / Apartment":2,
}

# Typical floor area (sq ft) by property type
FLOOR_AREA_TYPICAL = {
    "Detached":        1350,
    "Semi-detached":    950,
    "Terraced":         800,
    "Flat / Apartment": 600,
}


def postcode_to_region(pc: str) -> str | None:
    if not isinstance(pc, str) or len(pc) < 2:
        return None
    pc = pc.strip().upper()
    # Try 2-char prefix first, then 1-char
    for length in (2, 1):
        prefix = pc[:length].rstrip("0123456789")
        if prefix in POSTCODE_REGION:
            return POSTCODE_REGION[prefix]
    return None


def load_price_paid(path: Path) -> pd.DataFrame:
    cols = [
        "id", "price", "date", "postcode", "property_type",
        "old_new", "tenure", "paon", "saon", "street",
        "locality", "town", "district", "county",
        "ppd_type", "record_status",
    ]
    df = pd.read_csv(path, header=None, names=cols, engine="python", on_bad_lines="skip")
    print(f"  Loaded {len(df):,} rows from {path.name}")
    return df


def prepare(input_paths: list[Path], output_path: Path, max_rows: int = 300_000):
    frames = [load_price_paid(p) for p in input_paths]
    raw = pd.concat(frames, ignore_index=True)

    # ── Filter to standard residential types only ─────────────────────────────
    raw = raw[raw["property_type"].isin(PROP_TYPE_MAP.keys())].copy()

    # ── Map categorical columns ───────────────────────────────────────────────
    raw["property_type"] = raw["property_type"].map(PROP_TYPE_MAP)
    raw["tenure"]        = raw["tenure"].map(TENURE_MAP)
    raw = raw.dropna(subset=["property_type", "tenure"])

    # ── Region from postcode ──────────────────────────────────────────────────
    raw["region"] = raw["postcode"].apply(postcode_to_region)
    raw = raw.dropna(subset=["region"])

    # ── Postcode sector (e.g. "SW1A 1", "M1 1") — high-res location ──────────
    raw["postcode_district"] = (
        raw["postcode"].str.strip().str.upper()
        .str.replace(r'[A-Z]{2}$', '', regex=True)  # strip last 2 unit chars
        .str.strip()
    )
    raw = raw.dropna(subset=["postcode_district"])
    raw = raw[raw["postcode_district"].str.len() >= 3]

    # ── Year from date ────────────────────────────────────────────────────────
    raw["year"] = pd.to_datetime(raw["date"], errors="coerce").dt.year
    raw = raw.dropna(subset=["year"])
    raw["year"] = raw["year"].astype(int)

    # ── Price: clean numeric, remove outliers ─────────────────────────────────
    raw["price"] = pd.to_numeric(raw["price"], errors="coerce")
    raw = raw.dropna(subset=["price"])
    raw = raw[(raw["price"] >= 40_000) & (raw["price"] <= 5_000_000)]

    # ── Impute missing features (not in Land Registry data) ───────────────────
    raw["bedrooms"]  = raw["property_type"].map(BEDROOMS_TYPICAL)
    raw["bathrooms"] = (raw["bedrooms"] - 1).clip(lower=1)

    base_area = raw["property_type"].map(FLOOR_AREA_TYPICAL)
    noise = np.random.normal(0, 0.12, size=len(raw))
    raw["floor_area_sqft"] = (base_area * (1 + noise)).clip(lower=300).round().astype(int)

    raw["condition"] = "Good"

    # ── Sample if too large ───────────────────────────────────────────────────
    if len(raw) > max_rows:
        raw = raw.sample(max_rows, random_state=42)
        print(f"  Sampled down to {max_rows:,} rows")

    # ── Select final columns ──────────────────────────────────────────────────
    out = raw[[
        "postcode_district", "region", "property_type", "bedrooms", "bathrooms",
        "floor_area_sqft", "condition", "tenure", "year", "price",
    ]].reset_index(drop=True)

    print(f"\nFinal dataset: {len(out):,} rows")
    print(out.groupby("region")["price"].mean().sort_values(ascending=False)
            .apply(lambda x: f"£{x:,.0f}").to_string())
    print(f"\nProperty type counts:\n{out['property_type'].value_counts().to_string()}")
    print(f"\nYear range: {out['year'].min()} – {out['year'].max()}")

    out.to_csv(output_path, index=False)
    print(f"\nSaved → {output_path}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python prepare_real_data.py pp-2023.csv [pp-2022.csv ...]")
        sys.exit(1)

    here = Path(__file__).parent
    inputs = [here / f for f in sys.argv[1:]]

    for p in inputs:
        if not p.exists():
            print(f"File not found: {p}")
            sys.exit(1)

    prepare(inputs, here / "uk_housing_data.csv")

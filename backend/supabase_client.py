"""
Optional Supabase integration.
Falls back to static data when SUPABASE_URL / SUPABASE_KEY are not set.
"""
from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Optional

try:
    from supabase import create_client
    _SUPABASE_LIB = True
except ImportError:
    _SUPABASE_LIB = False

_client = None


def _get_client():
    global _client
    if _client is not None:
        return _client
    url = os.getenv("SUPABASE_URL", "").strip()
    key = os.getenv("SUPABASE_KEY", "").strip()
    if url and key and _SUPABASE_LIB:
        _client = create_client(url, key)
    return _client


# ── Historical regional prices used as Supabase fallback ─────────────────────

_YEARS = [2019, 2020, 2021, 2022, 2023, 2024]

_REGIONAL_DATA: dict[str, list[int]] = {
    "London":            [469000, 484000, 516000, 545000, 527000, 532000],
    "South East":        [352000, 362000, 388000, 406000, 393000, 397000],
    "East of England":   [298000, 308000, 330000, 352000, 341000, 344000],
    "South West":        [289000, 303000, 325000, 347000, 334000, 337000],
    "West Midlands":     [232000, 242000, 261000, 278000, 266000, 268000],
    "East Midlands":     [218000, 227000, 244000, 260000, 249000, 251000],
    "Yorkshire":         [191000, 199000, 213000, 226000, 218000, 220000],
    "North West":        [200000, 208000, 225000, 239000, 231000, 233000],
    "North East":        [150000, 155000, 167000, 178000, 170000, 171000],
    "Wales":             [194000, 201000, 218000, 232000, 221000, 223000],
    "Scotland":          [178000, 185000, 199000, 211000, 202000, 204000],
}


def _fallback_regional_prices(region: Optional[str] = None) -> list[dict]:
    regions = [region] if (region and region in _REGIONAL_DATA) else list(_REGIONAL_DATA.keys())
    records = []
    for r in regions:
        for i, year in enumerate(_YEARS):
            records.append({
                "region":            r,
                "year":              year,
                "avg_price":         _REGIONAL_DATA[r][i],
                "property_type":     "All",
                "transaction_count": None,
            })
    return records


# ── Public functions ──────────────────────────────────────────────────────────

async def save_prediction(request_data: dict, result: dict) -> None:
    client = _get_client()
    if client is None:
        return
    try:
        record = {
            "postcode":         request_data.get("postcode") or None,
            "region":           request_data.get("region", ""),
            "property_type":    request_data.get("property_type", ""),
            "bedrooms":         request_data.get("bedrooms"),
            "bathrooms":        request_data.get("bathrooms"),
            "floor_area_sqft":  request_data.get("floor_area_sqft"),
            "condition":        request_data.get("condition"),
            "tenure":           request_data.get("tenure"),
            "predicted_price":  result["predicted_price"],
            "price_low":        result["price_low"],
            "price_high":       result["price_high"],
            "confidence_score": result["confidence_score"],
            "created_at":       datetime.now(timezone.utc).isoformat(),
        }
        client.table("predictions").insert(record).execute()
    except Exception as exc:
        print(f"[Supabase] save_prediction failed: {exc}")


def get_regional_prices(region: Optional[str] = None) -> list[dict]:
    client = _get_client()
    if client is None:
        return _fallback_regional_prices(region)
    try:
        query = client.table("regional_prices").select("*")
        if region:
            query = query.eq("region", region)
        result = query.order("year").execute()
        data   = result.data or []
        return data if data else _fallback_regional_prices(region)
    except Exception as exc:
        print(f"[Supabase] get_regional_prices failed: {exc}")
        return _fallback_regional_prices(region)


def get_predictions_history(limit: int = 10) -> list[dict]:
    client = _get_client()
    if client is None:
        return []
    try:
        result = (
            client.table("predictions")
            .select("*")
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return result.data or []
    except Exception as exc:
        print(f"[Supabase] get_predictions_history failed: {exc}")
        return []

"""
HousePredict AI — API Test Suite
Run with: cd backend && pytest tests/ -v
"""
import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from main import app

client = TestClient(app)


# ── Health endpoints ──────────────────────────────────────────────────────────

def test_root_health():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


# ── Prediction endpoint ───────────────────────────────────────────────────────

def test_predict_basic():
    """Minimum required fields should return a valid prediction."""
    response = client.post("/predict", json={
        "region": "London",
        "property_type": "Terraced",
        "bedrooms": 3,
    })
    assert response.status_code == 200
    data = response.json()
    assert "predicted_price" in data
    assert "price_low" in data
    assert "price_high" in data
    assert "confidence_score" in data
    assert data["predicted_price"] > 0
    assert data["price_low"] <= data["predicted_price"] <= data["price_high"]

def test_predict_full():
    """All optional fields provided should give a higher confidence score."""
    response = client.post("/predict", json={
        "region": "South East",
        "property_type": "Detached",
        "bedrooms": 4,
        "bathrooms": 2,
        "floor_area_sqft": 1500,
        "condition": "Excellent",
        "tenure": "Freehold",
        "postcode": "GU1 1AA",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["confidence_score"] >= 85

def test_predict_london_higher_than_north_east():
    """London should predict significantly higher than North East."""
    london = client.post("/predict", json={
        "region": "London", "property_type": "Terraced", "bedrooms": 3,
    }).json()
    north_east = client.post("/predict", json={
        "region": "North East", "property_type": "Terraced", "bedrooms": 3,
    }).json()
    assert london["predicted_price"] > north_east["predicted_price"]

def test_predict_more_bedrooms_higher_price():
    """5-bed should predict higher than 2-bed in same region."""
    two_bed = client.post("/predict", json={
        "region": "London", "property_type": "Terraced", "bedrooms": 2,
    }).json()
    five_bed = client.post("/predict", json={
        "region": "London", "property_type": "Terraced", "bedrooms": 5,
    }).json()
    assert five_bed["predicted_price"] > two_bed["predicted_price"]

def test_predict_missing_region_returns_error():
    """Missing required field should return 422."""
    response = client.post("/predict", json={
        "property_type": "Terraced",
        "bedrooms": 3,
    })
    assert response.status_code == 422

def test_predict_price_in_realistic_range():
    """UK house prices should be between £40k and £5M."""
    response = client.post("/predict", json={
        "region": "North East", "property_type": "Flat / Apartment", "bedrooms": 1,
    })
    data = response.json()
    assert 40_000 <= data["predicted_price"] <= 5_000_000


# ── Market data endpoints ─────────────────────────────────────────────────────

def test_regional_trends_all():
    response = client.get("/regional-trends")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert len(data["data"]) > 0

def test_regional_trends_by_region():
    response = client.get("/regional-trends/London")
    assert response.status_code == 200
    data = response.json()
    assert data["region"] == "London"
    assert len(data["data"]) > 0

def test_regional_trends_covers_all_years():
    """Should have data from 2019 to 2024."""
    response = client.get("/regional-trends/London")
    years = {r["year"] for r in response.json()["data"]}
    for year in [2019, 2020, 2021, 2022, 2023, 2024]:
        assert year in years

def test_market_overview():
    response = client.get("/market-overview")
    assert response.status_code == 200
    data = response.json()
    assert "national_avg" in data
    assert "yoy_growth" in data
    assert "regions" in data
    assert len(data["regions"]) == 11

def test_market_overview_london_highest():
    """London should always be the highest priced region."""
    data = client.get("/market-overview").json()
    regions_sorted = data["regions"]
    assert regions_sorted[0]["region"] == "London"

def test_predictions_history():
    response = client.get("/predictions/history")
    assert response.status_code == 200
    assert "predictions" in response.json()

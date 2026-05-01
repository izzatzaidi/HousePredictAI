from __future__ import annotations

from typing import Optional, Union
from pydantic import BaseModel, field_validator


class PredictionRequest(BaseModel):
    postcode:        Optional[str] = None
    region:          str
    property_type:   str
    bedrooms:        Union[int, str]
    bathrooms:       Optional[Union[int, str]] = None
    floor_area_sqft: Optional[Union[int, str]] = None
    condition:       Optional[str] = None
    tenure:          Optional[str] = None

    @field_validator("bedrooms", mode="before")
    @classmethod
    def parse_bedrooms(cls, v):
        return int(str(v).replace("+", "").strip())

    @field_validator("bathrooms", mode="before")
    @classmethod
    def parse_bathrooms(cls, v):
        if v is None or v == "":
            return None
        return int(str(v).replace("+", "").strip())

    @field_validator("floor_area_sqft", mode="before")
    @classmethod
    def parse_sqft(cls, v):
        if v is None or v == "":
            return None
        return int(float(str(v)))


class PredictionResponse(BaseModel):
    predicted_price:  int
    price_low:        int
    price_high:       int
    confidence_score: int
    region:           str
    property_type:    str
    bedrooms:         int
    postcode:         Optional[str] = None
    mae_pct:          Optional[float] = None

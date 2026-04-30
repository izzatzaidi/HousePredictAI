const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function getPrediction(formData) {
  const body = {
    postcode:        formData.postcode,
    region:          formData.region,
    property_type:   formData.propertyType,
    bedrooms:        parseInt(formData.bedrooms) || 3,
    bathrooms:       formData.bathrooms ? parseInt(formData.bathrooms) : null,
    floor_area_sqft: formData.sqft      ? parseInt(formData.sqft)      : null,
    condition:       formData.condition || null,
    tenure:          formData.tenure    || null,
  };

  const data = await request("/predict", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });

  return {
    price:        data.predicted_price,
    low:          data.price_low,
    high:         data.price_high,
    confidence:   data.confidence_score,
    maePct:       data.mae_pct,
    region:       data.region,
    propertyType: data.property_type,
    bedrooms:     String(data.bedrooms),
    postcode:     data.postcode,
    sqft:         formData.sqft,
    condition:    formData.condition,
    tenure:       formData.tenure,
    bathrooms:    formData.bathrooms,
  };
}

export async function getRegionalTrends(region) {
  const path = region
    ? `/regional-trends/${encodeURIComponent(region)}`
    : "/regional-trends";
  return request(path);
}

export async function getMarketOverview() {
  return request("/market-overview");
}

export async function getPredictionsHistory(limit = 5) {
  return request(`/predictions/history?limit=${limit}`);
}

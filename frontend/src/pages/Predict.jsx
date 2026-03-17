import { useState } from "react";
import { theme } from "../theme";

const regions = [
  "London", "South East", "South West", "East of England",
  "East Midlands", "West Midlands", "Yorkshire", "North West",
  "North East", "Wales", "Scotland",
];

export default function Predict({ setPage, setResults }) {
  const [form, setForm] = useState({
    postcode: "", propertyType: "", bedrooms: "", bathrooms: "",
    sqft: "", condition: "", tenure: "", region: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.postcode)     e.postcode     = "Required";
    if (!form.propertyType) e.propertyType = "Required";
    if (!form.bedrooms)     e.bedrooms     = "Required";
    if (!form.region)       e.region       = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    // TODO: replace setTimeout with real fetch() call to FastAPI backend
    setTimeout(() => {
      setResults({
        price: 342500, low: 318000, high: 367000, confidence: 87,
        region: form.region, propertyType: form.propertyType,
        bedrooms: form.bedrooms, postcode: form.postcode,
      });
      setLoading(false);
      setPage("results");
    }, 2000);
  };

  const inputStyle = (hasError) => ({
    padding: "12px 14px", borderRadius: 10,
    background: theme.bgInput,
    border: `1px solid ${hasError ? "#f87171" : theme.border}`,
    color: theme.text, fontSize: 15, fontFamily: "DM Sans",
    transition: "border-color 0.2s", width: "100%",
  });

  const Field = ({ label, error, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, color: theme.textMuted, fontWeight: 500 }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: 12, color: "#f87171" }}>{error}</span>}
    </div>
  );

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 2rem" }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 40 }}>
          <div style={{
            display: "inline-block", padding: "5px 14px", borderRadius: 20,
            background: theme.accentGlow, border: `1px solid ${theme.borderAccent}`,
            fontSize: 12, color: theme.accentLight, marginBottom: 16,
          }}>Step 1 of 1</div>
          <h1 style={{ fontFamily: "Syne", fontSize: 36, fontWeight: 800, marginBottom: 10 }}>
            Property details
          </h1>
          <p style={{ color: theme.textMuted, fontSize: 16 }}>
            Fill in what you know — we'll handle the rest.
          </p>
        </div>

        {/* Form card */}
        <div className="fade-up-1" style={{
          background: theme.bgCard, borderRadius: 20,
          border: `1px solid ${theme.border}`, padding: 32,
          display: "flex", flexDirection: "column", gap: 20,
        }}>

          {/* Row 1 — postcode + region */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Postcode *" error={errors.postcode}>
              <input
                style={inputStyle(errors.postcode)}
                placeholder="e.g. SW1A 1AA"
                value={form.postcode}
                onChange={e => set("postcode", e.target.value.toUpperCase())}
                onFocus={e  => e.target.style.borderColor = theme.accent}
                onBlur={e   => e.target.style.borderColor = errors.postcode ? "#f87171" : theme.border}
              />
            </Field>
            <Field label="Region *" error={errors.region}>
              <select
                style={{ ...inputStyle(errors.region), cursor: "pointer" }}
                value={form.region}
                onChange={e => set("region", e.target.value)}
                onFocus={e  => e.target.style.borderColor = theme.accent}
                onBlur={e   => e.target.style.borderColor = errors.region ? "#f87171" : theme.border}
              >
                <option value="">Select region</option>
                {regions.map(r => <option key={r}>{r}</option>)}
              </select>
            </Field>
          </div>

          {/* Row 2 — property type + tenure */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Property type *" error={errors.propertyType}>
              <select
                style={{ ...inputStyle(errors.propertyType), cursor: "pointer" }}
                value={form.propertyType}
                onChange={e => set("propertyType", e.target.value)}
                onFocus={e  => e.target.style.borderColor = theme.accent}
                onBlur={e   => e.target.style.borderColor = theme.border}
              >
                <option value="">Select type</option>
                <option>Detached</option>
                <option>Semi-detached</option>
                <option>Terraced</option>
                <option>Flat / Apartment</option>
                <option>Bungalow</option>
              </select>
            </Field>
            <Field label="Tenure">
              <select
                style={{ ...inputStyle(false), cursor: "pointer" }}
                value={form.tenure}
                onChange={e => set("tenure", e.target.value)}
                onFocus={e  => e.target.style.borderColor = theme.accent}
                onBlur={e   => e.target.style.borderColor = theme.border}
              >
                <option value="">Select tenure</option>
                <option>Freehold</option>
                <option>Leasehold</option>
                <option>Share of freehold</option>
              </select>
            </Field>
          </div>

          {/* Row 3 — bedrooms + bathrooms + sqft */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <Field label="Bedrooms *" error={errors.bedrooms}>
              <select
                style={{ ...inputStyle(errors.bedrooms), cursor: "pointer" }}
                value={form.bedrooms}
                onChange={e => set("bedrooms", e.target.value)}
                onFocus={e  => e.target.style.borderColor = theme.accent}
                onBlur={e   => e.target.style.borderColor = theme.border}
              >
                <option value="">Beds</option>
                {[1,2,3,4,5,"6+"].map(n => <option key={n}>{n}</option>)}
              </select>
            </Field>
            <Field label="Bathrooms">
              <select
                style={{ ...inputStyle(false), cursor: "pointer" }}
                value={form.bathrooms}
                onChange={e => set("bathrooms", e.target.value)}
                onFocus={e  => e.target.style.borderColor = theme.accent}
                onBlur={e   => e.target.style.borderColor = theme.border}
              >
                <option value="">Baths</option>
                {[1,2,3,4].map(n => <option key={n}>{n}</option>)}
              </select>
            </Field>
            <Field label="Floor area (sq ft)">
              <input
                style={inputStyle(false)}
                placeholder="e.g. 850"
                type="number"
                value={form.sqft}
                onChange={e => set("sqft", e.target.value)}
                onFocus={e  => e.target.style.borderColor = theme.accent}
                onBlur={e   => e.target.style.borderColor = theme.border}
              />
            </Field>
          </div>

          {/* Condition toggle buttons */}
          <Field label="Property condition">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["New build", "Excellent", "Good", "Fair", "Needs work"].map(c => (
                <button
                  key={c}
                  onClick={() => set("condition", c)}
                  style={{
                    padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                    fontSize: 14, fontFamily: "DM Sans", transition: "all 0.15s",
                    background: form.condition === c ? theme.accent : theme.bgInput,
                    border: `1px solid ${form.condition === c ? theme.accent : theme.border}`,
                    color: form.condition === c ? "white" : theme.textMuted,
                  }}
                >{c}</button>
              ))}
            </div>
          </Field>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              marginTop: 8, padding: "16px", borderRadius: 12, border: "none",
              background: loading
                ? theme.bgInput
                : `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
              color: loading ? theme.textMuted : "white",
              fontSize: 16, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "DM Sans",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "opacity 0.2s",
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%",
                  border: `2px solid ${theme.textMuted}`,
                  borderTopColor: theme.accent,
                  animation: "spin 0.8s linear infinite",
                }} />
                Analysing property data...
              </>
            ) : "Get price prediction →"}
          </button>
        </div>
      </div>
    </div>
  );
}

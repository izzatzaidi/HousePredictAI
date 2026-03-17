import { useState } from "react";

const theme = {
  bg: "#0a0f1e",
  bgCard: "#111827",
  bgInput: "#1a2235",
  accent: "#3b82f6",
  accentLight: "#60a5fa",
  accentGlow: "rgba(59,130,246,0.15)",
  green: "#10b981",
  greenGlow: "rgba(16,185,129,0.15)",
  amber: "#f59e0b",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  border: "rgba(255,255,255,0.08)",
  borderAccent: "rgba(59,130,246,0.4)",
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${theme.bg}; color: ${theme.text}; font-family: 'DM Sans', sans-serif; }
  input, select { outline: none; }
  ::selection { background: ${theme.accent}; color: white; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${theme.bg}; }
  ::-webkit-scrollbar-thumb { background: ${theme.accent}; border-radius: 3px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%,100% { opacity:0.6; transform: scale(1); }
    50%      { opacity:1;   transform: scale(1.04); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
  .fade-up { animation: fadeUp 0.5s ease both; }
  .fade-up-1 { animation: fadeUp 0.5s 0.1s ease both; }
  .fade-up-2 { animation: fadeUp 0.5s 0.2s ease both; }
  .fade-up-3 { animation: fadeUp 0.5s 0.3s ease both; }
  .fade-up-4 { animation: fadeUp 0.5s 0.4s ease both; }
`;

/* ─────────────────────────────────────────────
   NAV
───────────────────────────────────────────── */
function Nav({ page, setPage }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 2rem", height: 64,
      background: "rgba(10,15,30,0.85)",
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${theme.border}`,
    }}>
      <div
        onClick={() => setPage("home")}
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16,
        }}>🏠</div>
        <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 18 }}>
          House<span style={{ color: theme.accentLight }}>Predict</span>
        </span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {["home", "predict", "results"].map(p => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              padding: "6px 16px", borderRadius: 20, border: "none",
              cursor: "pointer", fontFamily: "DM Sans", fontSize: 14,
              background: page === p ? theme.accent : "transparent",
              color: page === p ? "white" : theme.textMuted,
              transition: "all 0.2s",
            }}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────── */
function HomePage({ setPage }) {
  const stats = [
    { label: "Properties analysed", value: "2.4M+" },
    { label: "UK regions covered", value: "48" },
    { label: "Prediction accuracy", value: "94%" },
    { label: "Years of data", value: "5+" },
  ];

  const features = [
    { icon: "🧠", title: "ML-powered predictions", desc: "XGBoost model trained on 5 years of UK market data" },
    { icon: "📊", title: "Historical trends", desc: "Visual price trends by region, property type and time" },
    { icon: "🎯", title: "Confidence scores", desc: "Every prediction includes a confidence interval range" },
    { icon: "🆓", title: "Free & transparent", desc: "No subscription. No black box. See exactly how it works." },
  ];

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", overflow: "hidden" }}>
      {/* Hero */}
      <div style={{
        position: "relative", textAlign: "center",
        padding: "100px 2rem 80px",
      }}>
        {/* Glow bg */}
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 400, borderRadius: "50%",
          background: `radial-gradient(ellipse, ${theme.accentGlow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        <div className="fade-up" style={{
          display: "inline-block", padding: "6px 16px", borderRadius: 20,
          background: theme.accentGlow, border: `1px solid ${theme.borderAccent}`,
          fontSize: 13, color: theme.accentLight, marginBottom: 24,
        }}>
          🇬🇧 UK Housing Market · AI-Powered · Free
        </div>

        <h1 className="fade-up-1" style={{
          fontFamily: "Syne", fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
          fontWeight: 800, lineHeight: 1.1, marginBottom: 24,
        }}>
          Predict UK house prices<br />
          <span style={{
            background: `linear-gradient(90deg, ${theme.accent}, #818cf8)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>with confidence</span>
        </h1>

        <p className="fade-up-2" style={{
          fontSize: 18, color: theme.textMuted, maxWidth: 560, margin: "0 auto 40px",
          lineHeight: 1.7,
        }}>
          The free alternative to £100/month tools. Trained on official UK data,
          powered by machine learning, built for buyers, sellers and investors.
        </p>

        <div className="fade-up-3" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => setPage("predict")}
            style={{
              padding: "14px 32px", borderRadius: 12, border: "none",
              background: `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
              color: "white", fontSize: 16, fontWeight: 600,
              cursor: "pointer", fontFamily: "DM Sans",
              boxShadow: `0 0 40px ${theme.accentGlow}`,
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
            onMouseLeave={e => e.target.style.transform = "scale(1)"}
          >
            Get a prediction →
          </button>
          <button
            onClick={() => setPage("results")}
            style={{
              padding: "14px 32px", borderRadius: 12,
              border: `1px solid ${theme.border}`,
              background: "transparent", color: theme.text,
              fontSize: 16, cursor: "pointer", fontFamily: "DM Sans",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={e => e.target.style.borderColor = theme.accent}
            onMouseLeave={e => e.target.style.borderColor = theme.border}
          >
            View sample results
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="fade-up-4" style={{
        display: "flex", justifyContent: "center", flexWrap: "wrap",
        gap: 0, maxWidth: 900, margin: "0 auto 80px",
        background: theme.bgCard, borderRadius: 16,
        border: `1px solid ${theme.border}`, overflow: "hidden",
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            flex: "1 1 180px", padding: "28px 24px", textAlign: "center",
            borderRight: i < stats.length - 1 ? `1px solid ${theme.border}` : "none",
          }}>
            <div style={{
              fontFamily: "Syne", fontSize: 32, fontWeight: 800,
              color: theme.accentLight, marginBottom: 4,
            }}>{s.value}</div>
            <div style={{ fontSize: 13, color: theme.textMuted }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div style={{ maxWidth: 900, margin: "0 auto 100px", padding: "0 2rem" }}>
        <h2 style={{
          fontFamily: "Syne", fontSize: 28, fontWeight: 700,
          textAlign: "center", marginBottom: 40,
        }}>Why HousePredict?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              padding: 24, borderRadius: 16,
              background: theme.bgCard, border: `1px solid ${theme.border}`,
              transition: "border-color 0.2s, transform 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = theme.borderAccent; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontFamily: "Syne", fontWeight: 600, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: theme.textMuted, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PREDICTION FORM
───────────────────────────────────────────── */
function PredictPage({ setPage, setResults }) {
  const [form, setForm] = useState({
    postcode: "", propertyType: "", bedrooms: "", bathrooms: "",
    sqft: "", condition: "", tenure: "", region: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const regions = [
    "London", "South East", "South West", "East of England",
    "East Midlands", "West Midlands", "Yorkshire", "North West",
    "North East", "Wales", "Scotland",
  ];

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.postcode) e.postcode = "Required";
    if (!form.propertyType) e.propertyType = "Required";
    if (!form.bedrooms) e.bedrooms = "Required";
    if (!form.region) e.region = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setResults({
        price: 342500,
        low: 318000,
        high: 367000,
        confidence: 87,
        region: form.region,
        propertyType: form.propertyType,
        bedrooms: form.bedrooms,
        postcode: form.postcode,
      });
      setLoading(false);
      setPage("results");
    }, 2000);
  };

  const Field = ({ label, id, children, error }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, color: theme.textMuted, fontWeight: 500 }}>{label}</label>
      {children}
      {error && <span style={{ fontSize: 12, color: "#f87171" }}>{error}</span>}
    </div>
  );

  const inputStyle = (hasError) => ({
    padding: "12px 14px", borderRadius: 10,
    background: theme.bgInput,
    border: `1px solid ${hasError ? "#f87171" : theme.border}`,
    color: theme.text, fontSize: 15, fontFamily: "DM Sans",
    transition: "border-color 0.2s",
    width: "100%",
  });

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 2rem" }}>

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

        <div className="fade-up-1" style={{
          background: theme.bgCard, borderRadius: 20,
          border: `1px solid ${theme.border}`, padding: 32,
          display: "flex", flexDirection: "column", gap: 20,
        }}>

          {/* Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Postcode *" error={errors.postcode}>
              <input
                style={inputStyle(errors.postcode)}
                placeholder="e.g. SW1A 1AA"
                value={form.postcode}
                onChange={e => set("postcode", e.target.value.toUpperCase())}
                onFocus={e => e.target.style.borderColor = theme.accent}
                onBlur={e => e.target.style.borderColor = errors.postcode ? "#f87171" : theme.border}
              />
            </Field>
            <Field label="Region *" error={errors.region}>
              <select
                style={{ ...inputStyle(errors.region), cursor: "pointer" }}
                value={form.region}
                onChange={e => set("region", e.target.value)}
                onFocus={e => e.target.style.borderColor = theme.accent}
                onBlur={e => e.target.style.borderColor = errors.region ? "#f87171" : theme.border}
              >
                <option value="">Select region</option>
                {regions.map(r => <option key={r}>{r}</option>)}
              </select>
            </Field>
          </div>

          {/* Row 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Property type *" error={errors.propertyType}>
              <select
                style={{ ...inputStyle(errors.propertyType), cursor: "pointer" }}
                value={form.propertyType}
                onChange={e => set("propertyType", e.target.value)}
                onFocus={e => e.target.style.borderColor = theme.accent}
                onBlur={e => e.target.style.borderColor = theme.border}
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
                onFocus={e => e.target.style.borderColor = theme.accent}
                onBlur={e => e.target.style.borderColor = theme.border}
              >
                <option value="">Select tenure</option>
                <option>Freehold</option>
                <option>Leasehold</option>
                <option>Share of freehold</option>
              </select>
            </Field>
          </div>

          {/* Row 3 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <Field label="Bedrooms *" error={errors.bedrooms}>
              <select
                style={{ ...inputStyle(errors.bedrooms), cursor: "pointer" }}
                value={form.bedrooms}
                onChange={e => set("bedrooms", e.target.value)}
                onFocus={e => e.target.style.borderColor = theme.accent}
                onBlur={e => e.target.style.borderColor = theme.border}
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
                onFocus={e => e.target.style.borderColor = theme.accent}
                onBlur={e => e.target.style.borderColor = theme.border}
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
                onFocus={e => e.target.style.borderColor = theme.accent}
                onBlur={e => e.target.style.borderColor = theme.border}
              />
            </Field>
          </div>

          {/* Condition */}
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
              background: loading ? theme.bgInput : `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
              color: loading ? theme.textMuted : "white",
              fontSize: 16, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "DM Sans", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 10, transition: "opacity 0.2s",
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

/* ─────────────────────────────────────────────
   RESULTS PAGE
───────────────────────────────────────────── */
function ResultsPage({ results, setPage }) {
  const r = results || {
    price: 342500, low: 318000, high: 367000, confidence: 87,
    region: "London", propertyType: "Terraced", bedrooms: "3", postcode: "SW1A 1AA",
  };

  const fmt = (n) => "£" + n.toLocaleString("en-GB");

  const chartData = [
    { year: "2020", price: 265000 },
    { year: "2021", price: 289000 },
    { year: "2022", price: 311000 },
    { year: "2023", price: 328000 },
    { year: "2024", price: 335000 },
    { year: "2025 (pred)", price: r.price },
  ];

  const maxPrice = Math.max(...chartData.map(d => d.price));
  const chartH = 160;

  const comparisons = [
    { label: "Region avg", value: 298000, diff: r.price - 298000 },
    { label: "Property type avg", value: 315000, diff: r.price - 315000 },
    { label: "National avg", value: 285000, diff: r.price - 285000 },
  ];

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 2rem" }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 32 }}>
          <button
            onClick={() => setPage("predict")}
            style={{
              background: "none", border: "none", color: theme.textMuted,
              cursor: "pointer", fontSize: 14, marginBottom: 20,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >← Back to form</button>
          <h1 style={{ fontFamily: "Syne", fontSize: 32, fontWeight: 800 }}>
            Prediction results
          </h1>
          <p style={{ color: theme.textMuted, marginTop: 6 }}>
            {r.bedrooms}-bed {r.propertyType} · {r.postcode} · {r.region}
          </p>
        </div>

        {/* Main price card */}
        <div className="fade-up-1" style={{
          background: `linear-gradient(135deg, #0f1f3d, #111827)`,
          border: `1px solid ${theme.borderAccent}`,
          borderRadius: 20, padding: 40, marginBottom: 20,
          position: "relative", overflow: "hidden",
          boxShadow: `0 0 60px ${theme.accentGlow}`,
        }}>
          <div style={{
            position: "absolute", top: -60, right: -60,
            width: 240, height: 240, borderRadius: "50%",
            background: `radial-gradient(${theme.accentGlow}, transparent 70%)`,
          }} />
          <div style={{ fontSize: 14, color: theme.accentLight, marginBottom: 8 }}>
            Estimated market value
          </div>
          <div style={{
            fontFamily: "Syne", fontSize: "clamp(2.5rem, 7vw, 4rem)",
            fontWeight: 800, marginBottom: 12,
          }}>
            {fmt(r.price)}
          </div>
          <div style={{ fontSize: 15, color: theme.textMuted, marginBottom: 24 }}>
            Range: <span style={{ color: theme.text }}>{fmt(r.low)} – {fmt(r.high)}</span>
          </div>

          {/* Confidence bar */}
          <div style={{ maxWidth: 320 }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontSize: 13, color: theme.textMuted, marginBottom: 8,
            }}>
              <span>Confidence score</span>
              <span style={{ color: theme.green, fontWeight: 600 }}>{r.confidence}%</span>
            </div>
            <div style={{
              height: 8, borderRadius: 4,
              background: "rgba(255,255,255,0.08)",
            }}>
              <div style={{
                height: "100%", borderRadius: 4, width: `${r.confidence}%`,
                background: `linear-gradient(90deg, ${theme.green}, ${theme.accent})`,
                transition: "width 1s ease",
              }} />
            </div>
          </div>
        </div>

        {/* Two columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

          {/* Price history chart */}
          <div className="fade-up-2" style={{
            background: theme.bgCard, borderRadius: 16,
            border: `1px solid ${theme.border}`, padding: 24,
          }}>
            <div style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 20, fontSize: 15 }}>
              Price history
            </div>
            <svg width="100%" height={chartH + 40} viewBox={`0 0 300 ${chartH + 40}`}>
              {chartData.map((d, i) => {
                const barH = (d.price / maxPrice) * chartH;
                const x = i * 50 + 10;
                const isLast = i === chartData.length - 1;
                return (
                  <g key={i}>
                    <rect
                      x={x} y={chartH - barH} width={32} height={barH}
                      rx={4}
                      fill={isLast
                        ? `url(#grad${i})`
                        : "rgba(59,130,246,0.25)"}
                    />
                    {isLast && (
                      <defs>
                        <linearGradient id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={theme.accent} />
                          <stop offset="100%" stopColor="#818cf8" />
                        </linearGradient>
                      </defs>
                    )}
                    <text
                      x={x + 16} y={chartH + 16}
                      textAnchor="middle" fontSize={9}
                      fill={theme.textMuted}
                    >{d.year}</text>
                    {isLast && (
                      <text
                        x={x + 16} y={chartH - barH - 6}
                        textAnchor="middle" fontSize={9}
                        fill={theme.accentLight} fontWeight="600"
                      >pred</text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Comparisons */}
          <div className="fade-up-2" style={{
            background: theme.bgCard, borderRadius: 16,
            border: `1px solid ${theme.border}`, padding: 24,
          }}>
            <div style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 20, fontSize: 15 }}>
              How it compares
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {comparisons.map((c, i) => (
                <div key={i}>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    fontSize: 13, marginBottom: 6,
                  }}>
                    <span style={{ color: theme.textMuted }}>{c.label}</span>
                    <span style={{ display: "flex", gap: 8 }}>
                      <span>{fmt(c.value)}</span>
                      <span style={{ color: c.diff > 0 ? "#f87171" : theme.green, fontWeight: 600 }}>
                        {c.diff > 0 ? "+" : ""}{fmt(c.diff)}
                      </span>
                    </span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.06)" }}>
                    <div style={{
                      height: "100%", borderRadius: 2,
                      width: `${(c.value / r.price) * 100}%`,
                      background: "rgba(59,130,246,0.5)",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key factors */}
        <div className="fade-up-3" style={{
          background: theme.bgCard, borderRadius: 16,
          border: `1px solid ${theme.border}`, padding: 24, marginBottom: 20,
        }}>
          <div style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 16, fontSize: 15 }}>
            Key price factors
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            {[
              { label: "Location", impact: 82, color: theme.accent },
              { label: "Property size", impact: 71, color: "#818cf8" },
              { label: "Property type", impact: 58, color: theme.green },
              { label: "Interest rates", impact: 44, color: theme.amber },
            ].map((f, i) => (
              <div key={i} style={{
                padding: 16, borderRadius: 12,
                background: theme.bgInput, border: `1px solid ${theme.border}`,
              }}>
                <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 8 }}>{f.label}</div>
                <div style={{ fontSize: 20, fontFamily: "Syne", fontWeight: 700, color: f.color }}>
                  {f.impact}%
                </div>
                <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.06)", marginTop: 8 }}>
                  <div style={{
                    height: "100%", borderRadius: 2,
                    width: `${f.impact}%`, background: f.color,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="fade-up-4" style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => setPage("predict")}
            style={{
              padding: "14px 28px", borderRadius: 12, border: "none",
              background: `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
              color: "white", fontSize: 15, fontWeight: 600,
              cursor: "pointer", fontFamily: "DM Sans",
            }}
          >Try another property</button>
          <button style={{
            padding: "14px 28px", borderRadius: 12,
            border: `1px solid ${theme.border}`,
            background: "transparent", color: theme.text,
            fontSize: 15, cursor: "pointer", fontFamily: "DM Sans",
          }}>Download report</button>
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   APP ROOT
───────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("home");
  const [results, setResults] = useState(null);

  return (
    <>
      <style>{globalStyles}</style>
      <Nav page={page} setPage={setPage} />
      {page === "home"    && <HomePage setPage={setPage} />}
      {page === "predict" && <PredictPage setPage={setPage} setResults={setResults} />}
      {page === "results" && <ResultsPage results={results} setPage={setPage} />}
    </>
  );
}

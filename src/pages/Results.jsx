import { theme } from "../theme";

export default function Results({ results, setPage }) {
  const r = results || {
    price: 342500, low: 318000, high: 367000, confidence: 87,
    region: "London", propertyType: "Terraced", bedrooms: "3", postcode: "SW1A 1AA",
  };

  const fmt = n => "£" + n.toLocaleString("en-GB");

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
    { label: "Region avg",        value: 298000, diff: r.price - 298000 },
    { label: "Property type avg", value: 315000, diff: r.price - 315000 },
    { label: "National avg",      value: 285000, diff: r.price - 285000 },
  ];

  const factors = [
    { label: "Location",       impact: 82, color: theme.accent   },
    { label: "Property size",  impact: 71, color: "#818cf8"      },
    { label: "Property type",  impact: 58, color: theme.green    },
    { label: "Interest rates", impact: 44, color: theme.amber    },
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

        {/* ── MAIN PRICE CARD ── */}
        <div className="fade-up-1" style={{
          background: "linear-gradient(135deg, #0f1f3d, #111827)",
          border: `1px solid ${theme.borderAccent}`,
          borderRadius: 20, padding: 40, marginBottom: 20,
          position: "relative", overflow: "hidden",
          boxShadow: `0 0 60px ${theme.accentGlow}`,
        }}>
          {/* glow orb */}
          <div style={{
            position: "absolute", top: -60, right: -60,
            width: 240, height: 240, borderRadius: "50%",
            background: `radial-gradient(${theme.accentGlow}, transparent 70%)`,
            pointerEvents: "none",
          }} />

          <div style={{ fontSize: 14, color: theme.accentLight, marginBottom: 8 }}>
            Estimated market value
          </div>

          {/* Price — clean DM Sans light weight */}
          <div style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(2.5rem, 7vw, 4rem)",
            fontWeight: 300, letterSpacing: "-2px", marginBottom: 12,
          }}>
            {fmt(r.price)}
          </div>

          <div style={{ fontSize: 15, color: theme.textMuted, marginBottom: 24 }}>
            Range:{" "}
            <span style={{ color: theme.text }}>{fmt(r.low)} – {fmt(r.high)}</span>
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
            <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.08)" }}>
              <div style={{
                height: "100%", borderRadius: 4,
                width: `${r.confidence}%`,
                background: `linear-gradient(90deg, ${theme.green}, ${theme.accent})`,
                transition: "width 1s ease",
              }} />
            </div>
          </div>
        </div>

        {/* ── TWO COLUMN ROW ── */}
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
                    {isLast && (
                      <defs>
                        <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={theme.accent} />
                          <stop offset="100%" stopColor="#818cf8" />
                        </linearGradient>
                      </defs>
                    )}
                    <rect
                      x={x} y={chartH - barH} width={32} height={barH} rx={4}
                      fill={isLast ? "url(#predGrad)" : "rgba(59,130,246,0.25)"}
                    />
                    <text
                      x={x + 16} y={chartH + 16}
                      textAnchor="middle" fontSize={9} fill={theme.textMuted}
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
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {comparisons.map((c, i) => (
                <div key={i}>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    fontSize: 13, marginBottom: 6,
                  }}>
                    <span style={{ color: theme.textMuted }}>{c.label}</span>
                    <span style={{ display: "flex", gap: 8 }}>
                      <span style={{ color: theme.text }}>{fmt(c.value)}</span>
                      <span style={{
                        color: c.diff > 0 ? "#f87171" : theme.green, fontWeight: 600,
                      }}>
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

        {/* ── KEY FACTORS ── */}
        <div className="fade-up-3" style={{
          background: theme.bgCard, borderRadius: 16,
          border: `1px solid ${theme.border}`, padding: 24, marginBottom: 20,
        }}>
          <div style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 16, fontSize: 15 }}>
            Key price factors
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            {factors.map((f, i) => (
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

        {/* ── CTA BUTTONS ── */}
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

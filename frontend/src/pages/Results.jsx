import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import { theme } from "../theme";
import { getRegionalTrends } from "../lib/api";

const fmt   = n => "£" + Number(n).toLocaleString("en-GB");
const fmtK  = v => `£${(v / 1000).toFixed(0)}k`;

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff", border: `1px solid ${theme.border}`,
      borderRadius: 8, padding: "8px 12px", fontSize: 13,
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    }}>
      <div style={{ color: theme.textMuted, marginBottom: 2 }}>{label}</div>
      <div style={{ color: theme.accent, fontWeight: 700 }}>{fmt(payload[0].value)}</div>
    </div>
  );
};

const Chip = ({ label, value }) => (
  <div style={{
    display: "flex", flexDirection: "column", gap: 2,
    padding: "10px 14px", borderRadius: 10,
    background: theme.bgInput, border: `1px solid ${theme.border}`,
    minWidth: 0,
  }}>
    <span style={{ fontSize: 11, color: theme.textMuted, whiteSpace: "nowrap" }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 600, color: theme.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>
  </div>
);

export default function Results({ results, setPage }) {
  const r = results || {
    price: 342500, low: 318000, high: 367000, confidence: 87,
    region: "London", propertyType: "Terraced", bedrooms: "3",
    postcode: "SW1A 1AA", maePct: null,
  };

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    getRegionalTrends(r.region)
      .then(res => {
        const rows = (res.data || [])
          .filter(d => d.property_type === "All" || !d.property_type)
          .sort((a, b) => a.year - b.year)
          .slice(-7)
          .map(d => ({ year: String(d.year), price: Math.round(d.avg_price) }));
        if (rows.length) setChartData(rows);
      })
      .catch(() => {});
  }, [r.region]);

  const displayChart = chartData
    ? [...chartData, { year: "2025 (est.)", price: r.price }]
    : [
        { year: "2019", price: 265000 },
        { year: "2020", price: 280000 },
        { year: "2021", price: 305000 },
        { year: "2022", price: 328000 },
        { year: "2023", price: 318000 },
        { year: "2024", price: 330000 },
        { year: "2025 (est.)", price: r.price },
      ];

  const regionBase = chartData ? Math.round(chartData[chartData.length - 1]?.price) : 298000;
  const comparisons = [
    { label: `${r.region} avg`,    value: regionBase || 298000 },
    { label: "National average",   value: 283000 },
    { label: "England & Wales",    value: 295000 },
  ];
  const maxVal = Math.max(r.price, ...comparisons.map(c => c.value));

  const confidenceColor =
    r.confidence >= 80 ? theme.green :
    r.confidence >= 60 ? theme.amber :
    "#f87171";

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", background: theme.bg }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 1.5rem 80px" }}>

        {/* Back */}
        <button
          onClick={() => setPage("predict")}
          style={{
            background: "none", border: "none", color: theme.textMuted,
            cursor: "pointer", fontSize: 14, marginBottom: 24,
            display: "flex", alignItems: "center", gap: 6, padding: 0,
          }}
        >← New prediction</button>

        {/* ── Hero price card ─────────────────────────────────────────── */}
        <div className="fade-up" style={{
          background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
          border: `1px solid ${theme.borderAccent}`,
          borderRadius: 20, padding: "36px 32px", marginBottom: 16,
          boxShadow: `0 4px 24px ${theme.accentGlow}`,
        }}>
          <div style={{ fontSize: 13, color: theme.accentLight, marginBottom: 6, fontWeight: 500 }}>
            Estimated market value
          </div>
          <div style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(2.2rem, 8vw, 3.6rem)",
            fontWeight: 300, letterSpacing: "-2px", color: theme.text, marginBottom: 8,
          }}>
            {fmt(r.price)}
          </div>

          {/* Range bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 8 }}>
              Likely range: <strong style={{ color: theme.text }}>{fmt(r.low)}</strong>
              {" "}–{" "}<strong style={{ color: theme.text }}>{fmt(r.high)}</strong>
            </div>
            <div style={{ position: "relative", height: 8, borderRadius: 4, background: "rgba(59,130,246,0.15)" }}>
              {/* filled range */}
              <div style={{
                position: "absolute", top: 0, height: "100%", borderRadius: 4,
                background: `linear-gradient(90deg, ${theme.accent}55, ${theme.accent})`,
                left:  `${((r.low  - r.low * 0.9) / (r.high * 1.1 - r.low * 0.9)) * 100}%`,
                right: `${100 - ((r.high - r.low * 0.9) / (r.high * 1.1 - r.low * 0.9)) * 100}%`,
              }} />
              {/* predicted marker */}
              <div style={{
                position: "absolute", top: -3, width: 14, height: 14,
                borderRadius: "50%", background: theme.accent,
                border: "2px solid white", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                left: `calc(${((r.price - r.low * 0.9) / (r.high * 1.1 - r.low * 0.9)) * 100}% - 7px)`,
              }} />
            </div>
          </div>

          {/* Confidence */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 12, color: theme.textMuted, marginBottom: 5,
              }}>
                <span>Confidence</span>
                <span style={{ color: confidenceColor, fontWeight: 700 }}>{r.confidence}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: "rgba(0,0,0,0.08)" }}>
                <div style={{
                  height: "100%", borderRadius: 3, width: `${r.confidence}%`,
                  background: `linear-gradient(90deg, ${confidenceColor}88, ${confidenceColor})`,
                  transition: "width 1.2s ease",
                }} />
              </div>
            </div>
            {r.maePct && (
              <div style={{
                fontSize: 11, color: theme.textMuted,
                background: "rgba(0,0,0,0.05)", borderRadius: 6, padding: "4px 8px",
                whiteSpace: "nowrap",
              }}>
                MAE {r.maePct.toFixed(1)}%
              </div>
            )}
          </div>
        </div>

        {/* ── Property at a glance ─────────────────────────────────────── */}
        <div className="fade-up-1" style={{
          background: theme.bgCard, borderRadius: 16,
          border: `1px solid ${theme.border}`, padding: "20px 20px",
          marginBottom: 16,
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, fontFamily: "'Plus Jakarta Sans'" }}>
            Property at a glance
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: 8,
          }}>
            {r.postcode   && <Chip label="Postcode"      value={r.postcode} />}
            <Chip label="Region"        value={r.region} />
            <Chip label="Type"          value={r.propertyType} />
            <Chip label="Bedrooms"      value={`${r.bedrooms} bed`} />
            {r.bathrooms  && <Chip label="Bathrooms"     value={`${r.bathrooms} bath`} />}
            {r.sqft       && <Chip label="Floor area"    value={`${r.sqft} sq ft`} />}
            <Chip label="Condition"     value={r.condition  || "Not specified"} />
            <Chip label="Tenure"        value={r.tenure     || "Not specified"} />
          </div>
        </div>

        {/* ── Price history chart ──────────────────────────────────────── */}
        <div className="fade-up-2" style={{
          background: theme.bgCard, borderRadius: 16,
          border: `1px solid ${theme.border}`, padding: "24px 20px",
          marginBottom: 16,
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2, fontFamily: "'Plus Jakarta Sans'" }}>
            {r.region} — price history
          </div>
          <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 20 }}>
            Average sale price · all property types
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={displayChart} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={theme.accent} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={theme.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: theme.textMuted, fontSize: 11 }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fill: theme.textMuted, fontSize: 11 }}
                axisLine={false} tickLine={false}
                tickFormatter={fmtK} width={52}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone" dataKey="price"
                stroke={theme.accent} strokeWidth={2}
                fill="url(#priceGrad)"
                dot={(props) => {
                  const last = props.index === displayChart.length - 1;
                  return last
                    ? <circle key={props.index} cx={props.cx} cy={props.cy} r={5} fill={theme.accent} stroke="white" strokeWidth={2} />
                    : <circle key={props.index} cx={props.cx} cy={props.cy} r={3} fill={theme.accent} fillOpacity={0.5} stroke="none" />;
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Market comparison ────────────────────────────────────────── */}
        <div className="fade-up-2" style={{
          background: theme.bgCard, borderRadius: 16,
          border: `1px solid ${theme.border}`, padding: "24px 20px",
          marginBottom: 24,
        }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2, fontFamily: "'Plus Jakarta Sans'" }}>
            How it compares
          </div>
          <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 20 }}>
            Your predicted price vs. market averages
          </div>

          {/* Your property row */}
          <div style={{ marginBottom: 20, padding: "14px 16px", borderRadius: 12, background: theme.accentGlow, border: `1px solid ${theme.borderAccent}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>Your property</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: theme.accent }}>{fmt(r.price)}</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "rgba(59,130,246,0.12)" }}>
              <div style={{
                height: "100%", borderRadius: 3,
                width: `${(r.price / maxVal) * 100}%`,
                background: theme.accent,
              }} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {comparisons.map((c, i) => {
              const diff = r.price - c.value;
              const above = diff >= 0;
              return (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: theme.textMuted }}>{c.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, color: theme.text }}>{fmt(c.value)}</span>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 20,
                        background: above ? "rgba(248,113,113,0.1)" : "rgba(52,211,153,0.1)",
                        color: above ? "#f87171" : theme.green,
                      }}>
                        {above ? "+" : ""}{fmt(Math.abs(diff))}
                      </span>
                    </div>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: "rgba(0,0,0,0.06)" }}>
                    <div style={{
                      height: "100%", borderRadius: 2,
                      width: `${(c.value / maxVal) * 100}%`,
                      background: "rgba(100,116,139,0.3)",
                      transition: "width 0.8s ease",
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CTAs ─────────────────────────────────────────────────────── */}
        <div className="fade-up-3" style={{
          display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center",
        }}>
          <button
            onClick={() => setPage("predict")}
            style={{
              padding: "13px 24px", borderRadius: 12, border: "none",
              background: `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
              color: "white", fontSize: 14, fontWeight: 600,
              cursor: "pointer", fontFamily: "Inter",
            }}
          >Try another property</button>
          <button
            onClick={() => setPage("trends")}
            style={{
              padding: "13px 24px", borderRadius: 12,
              border: `1px solid ${theme.border}`,
              background: "transparent", color: theme.text,
              fontSize: 14, cursor: "pointer", fontFamily: "Inter",
            }}
          >View market trends</button>
          <button
            onClick={() => window.print()}
            style={{
              padding: "13px 24px", borderRadius: 12,
              border: `1px solid ${theme.border}`,
              background: "transparent", color: theme.textMuted,
              fontSize: 14, cursor: "pointer", fontFamily: "Inter",
            }}
          >Print / save</button>
        </div>

      </div>
    </div>
  );
}

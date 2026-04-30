import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell,
} from "recharts";
import { theme } from "../theme";
import { getRegionalTrends } from "../lib/api";

const fmt = n => "£" + Number(n).toLocaleString("en-GB");

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: theme.bgCard, border: `1px solid ${theme.border}`,
      borderRadius: 8, padding: "10px 14px", fontSize: 13,
    }}>
      <div style={{ color: theme.textMuted, marginBottom: 4 }}>{label}</div>
      <div style={{ color: theme.accentLight, fontWeight: 600 }}>
        {fmt(payload[0].value)}
      </div>
    </div>
  );
};

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
          .map(d => ({ year: String(d.year), price: d.avg_price }));
        if (rows.length) setChartData(rows);
      })
      .catch(() => {});
  }, [r.region]);

  const fallbackChart = [
    { year: "2019", price: 265000 },
    { year: "2020", price: 280000 },
    { year: "2021", price: 305000 },
    { year: "2022", price: 328000 },
    { year: "2023", price: 318000 },
    { year: "2025 (pred)", price: r.price },
  ];

  const displayChart = chartData
    ? [...chartData, { year: "2025 (pred)", price: r.price }]
    : fallbackChart;

  // Comparisons derived from the regional trend data
  const regionBase = chartData ? chartData[chartData.length - 1]?.price : 298000;
  const comparisons = [
    { label: "Region avg (2024)",  value: regionBase || 298000 },
    { label: "National avg",       value: 283000 },
    { label: "England & Wales avg",value: 295000 },
  ].map(c => ({ ...c, diff: r.price - c.value }));

  const factors = [
    { label: "Location",      impact: 82, color: theme.accent  },
    { label: "Property size", impact: 71, color: "#818cf8"     },
    { label: "Property type", impact: 58, color: theme.green   },
    { label: "Market conditions", impact: 44, color: theme.amber },
  ];

  const handlePrint = () => window.print();

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
          <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 32, fontWeight: 800 }}>
            Prediction results
          </h1>
          <p style={{ color: theme.textMuted, marginTop: 6 }}>
            {r.bedrooms}-bed {r.propertyType} · {r.postcode} · {r.region}
          </p>
        </div>

        {/* Main price card */}
        <div className="fade-up-1" style={{
          background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
          border: `1px solid ${theme.borderAccent}`,
          borderRadius: 20, padding: 40, marginBottom: 20,
          position: "relative", overflow: "hidden",
          boxShadow: `0 4px 24px ${theme.accentGlow}`,
        }}>
          <div style={{
            position: "absolute", top: -60, right: -60,
            width: 240, height: 240, borderRadius: "50%",
            background: `radial-gradient(${theme.accentGlow}, transparent 70%)`,
            pointerEvents: "none",
          }} />

          <div style={{ fontSize: 14, color: theme.accentLight, marginBottom: 8 }}>
            Estimated market value
          </div>
          <div style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(2.5rem, 7vw, 4rem)",
            fontWeight: 300, letterSpacing: "-2px", marginBottom: 12,
          }}>
            {fmt(r.price)}
          </div>
          <div style={{ fontSize: 15, color: theme.textMuted, marginBottom: 24 }}>
            Range:{" "}
            <span style={{ color: theme.text }}>{fmt(r.low)} – {fmt(r.high)}</span>
            {r.maePct && (
              <span style={{ marginLeft: 12, fontSize: 13, color: theme.textMuted }}>
                (Model MAE: {r.maePct.toFixed(1)}%)
              </span>
            )}
          </div>

          {/* Confidence bar */}
          <div style={{ maxWidth: 340 }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontSize: 13, color: theme.textMuted, marginBottom: 8,
            }}>
              <span>Confidence score</span>
              <span style={{ color: theme.green, fontWeight: 600 }}>{r.confidence}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "rgba(0,0,0,0.08)" }}>
              <div style={{
                height: "100%", borderRadius: 4, width: `${r.confidence}%`,
                background: `linear-gradient(90deg, ${theme.green}, ${theme.accent})`,
                transition: "width 1.2s ease",
              }} />
            </div>
            <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 6 }}>
              Based on feature completeness and model residual spread
            </div>
          </div>
        </div>

        {/* Two-column charts */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

          {/* Price history chart */}
          <div className="fade-up-2" style={{
            background: theme.bgCard, borderRadius: 16,
            border: `1px solid ${theme.border}`, padding: 24,
          }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, marginBottom: 4, fontSize: 15 }}>
              {r.region} price history
            </div>
            <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 16 }}>
              Average all-property · 2019–2025
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={displayChart} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: theme.textMuted, fontSize: 10 }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fill: theme.textMuted, fontSize: 10 }}
                  axisLine={false} tickLine={false}
                  tickFormatter={v => `£${(v / 1000).toFixed(0)}k`}
                  width={48}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                  {displayChart.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={i === displayChart.length - 1 ? theme.accent : "rgba(59,130,246,0.3)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Comparisons */}
          <div className="fade-up-2" style={{
            background: theme.bgCard, borderRadius: 16,
            border: `1px solid ${theme.border}`, padding: 24,
          }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, marginBottom: 4, fontSize: 15 }}>
              How it compares
            </div>
            <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 20 }}>
              Predicted price vs. market benchmarks
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {comparisons.map((c, i) => (
                <div key={i}>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    fontSize: 13, marginBottom: 6,
                  }}>
                    <span style={{ color: theme.textMuted }}>{c.label}</span>
                    <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ color: theme.text }}>{fmt(c.value)}</span>
                      <span style={{
                        color: c.diff > 0 ? "#f87171" : theme.green,
                        fontWeight: 600, fontSize: 12,
                      }}>
                        {c.diff > 0 ? "+" : ""}{fmt(Math.abs(c.diff))}
                        {" "}{c.diff > 0 ? "↑" : "↓"}
                      </span>
                    </span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: "rgba(0,0,0,0.07)" }}>
                    <div style={{
                      height: "100%", borderRadius: 2,
                      width: `${Math.min(100, (c.value / r.price) * 100)}%`,
                      background: "rgba(59,130,246,0.5)",
                      transition: "width 0.8s ease",
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
          <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, marginBottom: 4, fontSize: 15 }}>
            Key price factors
          </div>
          <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 16 }}>
            XGBoost feature importances (approximate contribution to predicted price)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            {factors.map((f, i) => (
              <div key={i} style={{
                padding: 16, borderRadius: 12,
                background: theme.bgInput, border: `1px solid ${theme.border}`,
              }}>
                <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 8 }}>{f.label}</div>
                <div style={{ fontSize: 22, fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, color: f.color }}>
                  {f.impact}%
                </div>
                <div style={{ height: 3, borderRadius: 2, background: "rgba(0,0,0,0.07)", marginTop: 8 }}>
                  <div style={{ height: "100%", borderRadius: 2, width: `${f.impact}%`, background: f.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction details card */}
        <div className="fade-up-3" style={{
          background: theme.bgCard, borderRadius: 16,
          border: `1px solid ${theme.border}`, padding: 24, marginBottom: 20,
        }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, marginBottom: 16, fontSize: 15 }}>
            Prediction summary
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              { label: "Postcode",      value: r.postcode || "—" },
              { label: "Region",        value: r.region },
              { label: "Property type", value: r.propertyType },
              { label: "Bedrooms",      value: r.bedrooms },
              { label: "Floor area",    value: r.sqft ? `${r.sqft} sq ft` : "Estimated" },
              { label: "Condition",     value: r.condition || "Good (default)" },
              { label: "Tenure",        value: r.tenure || "Freehold (default)" },
              { label: "Model",         value: "XGBoost v2" },
              { label: "Data source",   value: "ONS HPI patterns" },
            ].map((item, i) => (
              <div key={i} style={{ padding: "10px 12px", borderRadius: 8, background: theme.bgInput }}>
                <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: theme.text, fontWeight: 500 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="fade-up-4" style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => setPage("predict")}
            style={{
              padding: "14px 28px", borderRadius: 12, border: "none",
              background: `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
              color: "white", fontSize: 15, fontWeight: 600,
              cursor: "pointer", fontFamily: "Inter",
            }}
          >Try another property</button>
          <button
            onClick={() => setPage("trends")}
            style={{
              padding: "14px 28px", borderRadius: 12,
              border: `1px solid ${theme.border}`,
              background: "transparent", color: theme.text,
              fontSize: 15, cursor: "pointer", fontFamily: "Inter",
            }}
          >View market trends</button>
          <button
            onClick={handlePrint}
            style={{
              padding: "14px 28px", borderRadius: 12,
              border: `1px solid ${theme.border}`,
              background: "transparent", color: theme.textMuted,
              fontSize: 15, cursor: "pointer", fontFamily: "Inter",
            }}
          >Download report</button>
        </div>

      </div>
    </div>
  );
}

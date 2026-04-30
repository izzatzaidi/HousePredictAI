import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, BarChart, Bar, Cell,
} from "recharts";
import { theme } from "../theme";
import { getRegionalTrends, getMarketOverview } from "../lib/api";

const fmt    = n  => "£" + Number(n).toLocaleString("en-GB");
const fmtK   = n  => `£${(n / 1000).toFixed(0)}k`;
const YEARS  = [2019, 2020, 2021, 2022, 2023, 2024];

const REGION_COLORS = [
  "#3b82f6", "#818cf8", "#10b981", "#f59e0b",
  "#ef4444", "#06b6d4", "#8b5cf6", "#f97316",
  "#ec4899", "#84cc16", "#14b8a6",
];

const MARKET_INDICATORS = [
  { year: "2019", rate: 0.75, growth: 1.3  },
  { year: "2020", rate: 0.10, growth: 8.5  },
  { year: "2021", rate: 0.25, growth: 10.0 },
  { year: "2022", rate: 3.50, growth: 9.8  },
  { year: "2023", rate: 5.25, growth: -1.8 },
  { year: "2024", rate: 4.75, growth: 0.8  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: theme.bgCard, border: `1px solid ${theme.border}`,
      borderRadius: 8, padding: "10px 14px", fontSize: 12,
    }}>
      <div style={{ color: theme.textMuted, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: {p.name === "BoE Rate" ? `${p.value}%` : fmt(p.value)}
        </div>
      ))}
    </div>
  );
};

export default function Trends({ setPage }) {
  const [allData,   setAllData]   = useState(null);
  const [overview,  setOverview]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [selected,  setSelected]  = useState(new Set(["London", "South East", "North West"]));

  useEffect(() => {
    Promise.all([getRegionalTrends(), getMarketOverview()])
      .then(([trends, ov]) => {
        setAllData(trends.data || []);
        setOverview(ov);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Build year × region grid for line chart
  const regions = allData
    ? [...new Set(allData.map(d => d.region))].sort()
    : [];

  const lineChartData = YEARS.map(year => {
    const row = { year: String(year) };
    regions.forEach(r => {
      const entry = (allData || []).find(d => d.region === r && d.year === year);
      if (entry) row[r] = entry.avg_price;
    });
    return row;
  });

  // Latest year comparison bar chart
  const barData = (overview?.regions || [])
    .map(r => ({ region: r.region.replace(" of England", ""), price: r.avg_price, growth: r.yoy_growth }))
    .sort((a, b) => b.price - a.price);

  const toggleRegion = r => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(r) ? next.delete(r) : next.add(r);
      return next;
    });
  };

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 2rem" }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 40 }}>
          <div style={{
            display: "inline-block", padding: "5px 14px", borderRadius: 20,
            background: theme.accentGlow, border: `1px solid ${theme.borderAccent}`,
            fontSize: 12, color: theme.accentLight, marginBottom: 16,
          }}>ONS Data · 2019–2024 · 11 Regions</div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 36, fontWeight: 800, marginBottom: 10 }}>
            UK Market Trends
          </h1>
          <p style={{ color: theme.textMuted, fontSize: 16 }}>
            Regional price history, year-on-year growth and Bank of England rate correlation.
          </p>
        </div>

        {/* Overview stats */}
        {overview && (
          <div className="fade-up-1" style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12, marginBottom: 32,
          }}>
            {[
              { label: "National avg (2024)", value: fmt(overview.national_avg), color: theme.accent },
              { label: "Year-on-year growth",  value: `${overview.yoy_growth > 0 ? "+" : ""}${overview.yoy_growth}%`, color: overview.yoy_growth >= 0 ? theme.green : "#f87171" },
              { label: "Highest region",       value: overview.regions[0]?.region || "—",  color: theme.accentLight },
              { label: "Highest avg price",    value: fmt(overview.regions[0]?.avg_price || 0), color: theme.accentLight },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "20px 24px", borderRadius: 14,
                background: theme.bgCard, border: `1px solid ${theme.border}`,
              }}>
                <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 22, fontWeight: 700, color: s.color }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: "center", color: theme.textMuted, padding: 60 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              border: `2px solid ${theme.border}`, borderTopColor: theme.accent,
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }} />
            Loading market data...
          </div>
        )}

        {!loading && (
          <>
            {/* Regional price comparison bar chart */}
            <div className="fade-up-2" style={{
              background: theme.bgCard, borderRadius: 16,
              border: `1px solid ${theme.border}`, padding: 24, marginBottom: 20,
            }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, marginBottom: 4, fontSize: 15 }}>
                Regional average prices (2024)
              </div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 20 }}>
                Average all-property price across all UK regions
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData} layout="vertical" margin={{ left: 90, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                  <XAxis
                    type="number"
                    tick={{ fill: theme.textMuted, fontSize: 10 }}
                    axisLine={false} tickLine={false}
                    tickFormatter={fmtK}
                  />
                  <YAxis
                    type="category" dataKey="region"
                    tick={{ fill: theme.textMuted, fontSize: 11 }}
                    axisLine={false} tickLine={false} width={85}
                  />
                  <Tooltip
                    formatter={v => [fmt(v), "Avg price"]}
                    contentStyle={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 8 }}
                    labelStyle={{ color: theme.textMuted }}
                  />
                  <Bar dataKey="price" radius={[0, 4, 4, 0]}>
                    {barData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={i === 0 ? theme.accent : `rgba(59,130,246,${0.6 - i * 0.04})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line chart — price history by region */}
            <div className="fade-up-2" style={{
              background: theme.bgCard, borderRadius: 16,
              border: `1px solid ${theme.border}`, padding: 24, marginBottom: 20,
            }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, marginBottom: 4, fontSize: 15 }}>
                Price history by region (2019–2024)
              </div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 16 }}>
                Select regions to compare
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {regions.map((r, i) => (
                  <button
                    key={r}
                    onClick={() => toggleRegion(r)}
                    style={{
                      padding: "5px 12px", borderRadius: 20, cursor: "pointer",
                      fontSize: 12, fontFamily: "Inter", transition: "all 0.15s",
                      background: selected.has(r) ? REGION_COLORS[i % REGION_COLORS.length] + "33" : "transparent",
                      border: `1px solid ${selected.has(r) ? REGION_COLORS[i % REGION_COLORS.length] : theme.border}`,
                      color: selected.has(r) ? REGION_COLORS[i % REGION_COLORS.length] : theme.textMuted,
                    }}
                  >{r}</button>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={lineChartData} margin={{ top: 4, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: theme.textMuted, fontSize: 11 }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: theme.textMuted, fontSize: 10 }}
                    axisLine={false} tickLine={false}
                    tickFormatter={fmtK} width={48}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {regions.filter(r => selected.has(r)).map((r, i) => (
                    <Line
                      key={r}
                      type="monotone"
                      dataKey={r}
                      name={r}
                      stroke={REGION_COLORS[regions.indexOf(r) % REGION_COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bank of England rate + growth correlation */}
            <div className="fade-up-3" style={{
              background: theme.bgCard, borderRadius: 16,
              border: `1px solid ${theme.border}`, padding: 24, marginBottom: 32,
            }}>
              <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, marginBottom: 4, fontSize: 15 }}>
                Interest rates vs. price growth
              </div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 20 }}>
                Bank of England base rate vs. UK house price annual growth (%)
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={MARKET_INDICATORS} margin={{ top: 4, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: theme.textMuted, fontSize: 11 }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: theme.textMuted, fontSize: 10 }}
                    axisLine={false} tickLine={false}
                    tickFormatter={v => `${v}%`} width={36}
                  />
                  <Tooltip
                    formatter={(v, name) => [`${v}%`, name]}
                    contentStyle={{ background: theme.bgCard, border: `1px solid ${theme.border}`, borderRadius: 8 }}
                    labelStyle={{ color: theme.textMuted }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 12, color: theme.textMuted }}
                  />
                  <Line
                    type="monotone" dataKey="rate" name="BoE Rate"
                    stroke={theme.amber} strokeWidth={2} dot={{ r: 3 }}
                  />
                  <Line
                    type="monotone" dataKey="growth" name="Price Growth"
                    stroke={theme.green} strokeWidth={2} dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* CTA */}
        <div className="fade-up-4" style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => setPage("predict")}
            style={{
              padding: "14px 28px", borderRadius: 12, border: "none",
              background: `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
              color: "white", fontSize: 15, fontWeight: 600,
              cursor: "pointer", fontFamily: "Inter",
            }}
          >Get a prediction →</button>
          <button
            onClick={() => setPage("home")}
            style={{
              padding: "14px 28px", borderRadius: 12,
              border: `1px solid ${theme.border}`,
              background: "transparent", color: theme.text,
              fontSize: 15, cursor: "pointer", fontFamily: "Inter",
            }}
          >Back to home</button>
        </div>

      </div>
    </div>
  );
}

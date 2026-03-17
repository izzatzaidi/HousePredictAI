import { theme } from "../theme";

export default function Home({ setPage }) {
  const stats = [
    { label: "Properties analysed", value: "2.4M+" },
    { label: "UK regions covered",  value: "48"    },
    { label: "Prediction accuracy", value: "94%"   },
    { label: "Years of data",       value: "5+"    },
  ];

  const features = [
    { icon: "🧠", title: "ML-powered predictions",  desc: "XGBoost model trained onq 5 years of UK market data" },
    { icon: "📊", title: "Historical trends",        desc: "Visual price trends by region, property type and time" },
    { icon: "🎯", title: "Confidence scores",        desc: "Every prediction includes a confidence interval range" },
    { icon: "🆓", title: "Free & transparent",       desc: "No subscription. No black box. See exactly how it works." },
  ];

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh", overflow: "hidden" }}>

      {/* ── HERO ── */}
      <div style={{ position: "relative", textAlign: "center", padding: "100px 2rem 80px" }}>
        {/* glow */}
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
          fontSize: 18, color: theme.textMuted, maxWidth: 560,
          margin: "0 auto 40px", lineHeight: 1.7,
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

      {/* ── STATS BAR ── */}
      <div className="fade-up-4" style={{
        display: "flex", justifyContent: "center", flexWrap: "wrap",
        maxWidth: 900, margin: "0 auto 80px",
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

      {/* ── FEATURES ── */}
      <div style={{ maxWidth: 900, margin: "0 auto 100px", padding: "0 2rem" }}>
        <h2 style={{
          fontFamily: "Syne", fontSize: 28, fontWeight: 700,
          textAlign: "center", marginBottom: 40,
        }}>Why HousePredict?</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                padding: 24, borderRadius: 16,
                background: theme.bgCard, border: `1px solid ${theme.border}`,
                transition: "border-color 0.2s, transform 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = theme.borderAccent;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = theme.border;
                e.currentTarget.style.transform = "translateY(0)";
              }}
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

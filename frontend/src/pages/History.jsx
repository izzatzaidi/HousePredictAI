import { useState, useEffect } from "react";
import { theme } from "../theme";
import { getPredictionsHistory } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const fmt = n => "£" + Number(n).toLocaleString("en-GB");
const fmtDate = iso => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const confidence_color = score =>
  score >= 85 ? theme.green :
  score >= 75 ? theme.amber : "#94a3b8";

export default function History({ setPage }) {
  const { user } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getPredictionsHistory(20)
      .then(data => setPredictions(data.predictions || []))
      .catch(() => setError("Could not load prediction history."))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: theme.bg, padding: "2rem",
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, border: `1px solid ${theme.border}`,
        padding: "48px 32px", maxWidth: 420, width: "100%", textAlign: "center",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 22, marginBottom: 10 }}>
          Sign in to view history
        </h2>
        <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
          Your prediction history is saved to your account. Sign in to access it.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={() => setPage("login")}
            style={{
              padding: "12px 24px", borderRadius: 12, border: "none",
              background: `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
              color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}
          >Sign in</button>
          <button
            onClick={() => setPage("signup")}
            style={{
              padding: "12px 24px", borderRadius: 12,
              border: `1px solid ${theme.border}`,
              background: "transparent", color: theme.text,
              fontSize: 14, cursor: "pointer",
            }}
          >Create account</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 2rem" }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 40 }}>
          <div style={{
            display: "inline-block", padding: "5px 14px", borderRadius: 20,
            background: theme.accentGlow, border: `1px solid ${theme.borderAccent}`,
            fontSize: 12, color: theme.accentLight, marginBottom: 16,
          }}>Supabase · Live Data · Last 20 predictions</div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 36, fontWeight: 800, marginBottom: 10 }}>
            Prediction History
          </h1>
          <p style={{ color: theme.textMuted, fontSize: 16 }}>
            All predictions saved to the database, most recent first.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", color: theme.textMuted, padding: 60 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              border: `2px solid rgba(0,0,0,0.12)`, borderTopColor: theme.accent,
              animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
            }} />
            Loading history...
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            padding: "20px 24px", borderRadius: 12, background: "#fef2f2",
            border: "1px solid #fecaca", color: "#dc2626", marginBottom: 24,
          }}>{error}</div>
        )}

        {/* Empty state */}
        {!loading && !error && predictions.length === 0 && (
          <div style={{
            textAlign: "center", padding: "60px 24px",
            background: theme.bgCard, borderRadius: 16, border: `1px solid ${theme.border}`,
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🏠</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, marginBottom: 8 }}>No predictions yet</div>
            <div style={{ color: theme.textMuted, marginBottom: 24 }}>Make your first prediction to see it here.</div>
            <button
              onClick={() => setPage("predict")}
              style={{
                padding: "12px 24px", borderRadius: 10, border: "none",
                background: `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
                color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}
            >Get a prediction →</button>
          </div>
        )}

        {/* Predictions list */}
        {!loading && predictions.length > 0 && (
          <div className="fade-up-1" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {predictions.map((p, i) => (
              <div key={p.id || i} style={{
                background: theme.bgCard, borderRadius: 14,
                border: `1px solid ${theme.border}`,
                padding: "20px 24px",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "12px 24px",
                alignItems: "center",
              }}>
                {/* Left: property details */}
                <div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: 20, fontSize: 12,
                      background: theme.accentGlow, color: theme.accent,
                      border: `1px solid ${theme.borderAccent}`,
                    }}>{p.region}</span>
                    <span style={{
                      padding: "3px 10px", borderRadius: 20, fontSize: 12,
                      background: "#f1f5f9", color: theme.textMuted,
                    }}>{p.property_type}</span>
                    <span style={{
                      padding: "3px 10px", borderRadius: 20, fontSize: 12,
                      background: "#f1f5f9", color: theme.textMuted,
                    }}>{p.bedrooms} bed{p.bedrooms !== 1 ? "s" : ""}</span>
                    {p.postcode && (
                      <span style={{
                        padding: "3px 10px", borderRadius: 20, fontSize: 12,
                        background: "#f1f5f9", color: theme.textMuted,
                      }}>{p.postcode}</span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <span style={{
                      fontFamily: "'Plus Jakarta Sans'", fontWeight: 800,
                      fontSize: 24, color: theme.accent,
                    }}>{fmt(p.predicted_price)}</span>
                    <span style={{ fontSize: 13, color: theme.textMuted }}>
                      {fmt(p.price_low)} – {fmt(p.price_high)}
                    </span>
                  </div>
                </div>

                {/* Right: confidence + date */}
                <div style={{ textAlign: "right" }}>
                  <div style={{
                    fontFamily: "'Plus Jakarta Sans'", fontWeight: 700,
                    fontSize: 22, color: confidence_color(p.confidence_score),
                    marginBottom: 4,
                  }}>{p.confidence_score}%</div>
                  <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 8 }}>confidence</div>
                  <div style={{ fontSize: 12, color: theme.textMuted }}>{fmtDate(p.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        {!loading && (
          <div className="fade-up-4" style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 40 }}>
            <button
              onClick={() => setPage("predict")}
              style={{
                padding: "14px 28px", borderRadius: 12, border: "none",
                background: `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
                color: "white", fontSize: 15, fontWeight: 600,
                cursor: "pointer", fontFamily: "Inter",
              }}
            >New prediction →</button>
            <button
              onClick={() => setPage("home")}
              style={{
                padding: "14px 28px", borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.18)",
                background: "transparent", color: theme.text,
                fontSize: 15, cursor: "pointer", fontFamily: "Inter",
              }}
            >Back to home</button>
          </div>
        )}

      </div>
    </div>
  );
}

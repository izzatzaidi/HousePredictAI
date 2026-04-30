import { theme } from "../theme";

const PAGES = ["home", "predict", "trends", "results"];

export default function Nav({ page, setPage }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 2rem", height: 64,
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${theme.border}`,
      boxShadow: "0 1px 0 rgba(0,0,0,0.06)",
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
          <span style={{ fontSize: 11, color: theme.textMuted, marginLeft: 6, fontFamily: "DM Sans", fontWeight: 400 }}>AI</span>
        </span>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {PAGES.map(p => (
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
            {p === "home"    ? "Home"    :
             p === "predict" ? "Predict" :
             p === "trends"  ? "Trends"  : "Results"}
          </button>
        ))}
      </div>
    </nav>
  );
}

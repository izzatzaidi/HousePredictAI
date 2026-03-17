import { theme } from "../theme";

export default function Nav({ page, setPage }) {
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

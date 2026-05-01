import { useState } from "react";
import { theme } from "../theme";

const PAGES = [
  { id: "home",    label: "Home"    },
  { id: "predict", label: "Predict" },
  { id: "trends",  label: "Trends"  },
  { id: "history", label: "History" },
];

export default function Nav({ page, setPage }) {
  const [menuOpen, setMenuOpen] = useState(false);

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
      {/* Logo */}
      <div
        onClick={() => { setPage("home"); setMenuOpen(false); }}
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16,
        }}>🏠</div>
        <span style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 18 }}>
          House<span style={{ color: theme.accentLight }}>Predict</span>
          <span style={{ fontSize: 11, color: theme.textMuted, marginLeft: 6, fontFamily: "Inter", fontWeight: 400 }}>AI</span>
        </span>
      </div>

      {/* Desktop nav links */}
      <div style={{ display: "flex", gap: 6, "@media (max-width: 600px)": { display: "none" } }}
           className="nav-desktop">
        {PAGES.map(p => (
          <button
            key={p.id}
            onClick={() => setPage(p.id)}
            style={{
              padding: "6px 16px", borderRadius: 20, border: "none",
              cursor: "pointer", fontFamily: "Inter", fontSize: 14,
              background: page === p.id ? theme.accent : "transparent",
              color: page === p.id ? "white" : theme.textMuted,
              transition: "all 0.2s",
            }}
          >{p.label}</button>
        ))}
      </div>

      {/* Mobile hamburger */}
      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen(o => !o)}
        style={{
          display: "none", background: "none", border: "none",
          cursor: "pointer", padding: 8, color: theme.text, fontSize: 22,
        }}
      >{menuOpen ? "✕" : "☰"}</button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0,
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${theme.border}`,
          padding: "12px 1.5rem 16px",
          display: "flex", flexDirection: "column", gap: 6,
          zIndex: 99,
        }}
        className="nav-mobile-menu">
          {PAGES.map(p => (
            <button
              key={p.id}
              onClick={() => { setPage(p.id); setMenuOpen(false); }}
              style={{
                padding: "10px 16px", borderRadius: 10, border: "none",
                cursor: "pointer", fontFamily: "Inter", fontSize: 15,
                textAlign: "left",
                background: page === p.id ? theme.accent : "#f1f5f9",
                color: page === p.id ? "white" : theme.text,
                transition: "all 0.15s",
              }}
            >{p.label}</button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

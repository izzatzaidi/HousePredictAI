import { useState, useEffect, useRef } from "react";
import { theme } from "../theme";
import { useAuth } from "../context/AuthContext";

const PAGES = [
  { id: "home",    label: "Home"    },
  { id: "predict", label: "Predict" },
  { id: "trends",  label: "Trends"  },
  { id: "history", label: "History" },
];

export default function Nav({ page, setPage }) {
  const { user, profile, signOut } = useAuth();
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const go = p => { setPage(p); setMenuOpen(false); setUserDropdown(false); };

  useEffect(() => {
    if (!userDropdown) return;
    const handleClick = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setUserDropdown(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [userDropdown]);

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "?";

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
      <div onClick={() => go("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
        }}>🏠</div>
        <span style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 18 }}>
          House<span style={{ color: theme.accentLight }}>Predict</span>
          <span style={{ fontSize: 11, color: theme.textMuted, marginLeft: 6, fontFamily: "Inter", fontWeight: 400 }}>AI</span>
        </span>
      </div>

      {/* Desktop nav */}
      <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {PAGES.map(p => (
          <button key={p.id} onClick={() => go(p.id)} style={{
            padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer",
            fontFamily: "Inter", fontSize: 14,
            background: page === p.id ? theme.accent : "transparent",
            color: page === p.id ? "white" : theme.textMuted,
            transition: "all 0.2s",
          }}>{p.label}</button>
        ))}

        <div style={{ width: 1, height: 24, background: theme.border, margin: "0 8px" }} />

        {user ? (
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              onClick={() => setUserDropdown(o => !o)}
              title={profile?.full_name || user.email}
              style={{
                width: 36, height: 36, borderRadius: "50%", border: "none", cursor: "pointer",
                background: `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
                color: "white", fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 13,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >{initials}</button>
            {userDropdown && (
              <div style={{
                position: "absolute", right: 0, top: 44, minWidth: 180,
                background: "#fff", border: `1px solid ${theme.border}`,
                borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                padding: "8px 0", zIndex: 200,
              }}>
                <div style={{ padding: "8px 16px 10px", borderBottom: `1px solid ${theme.border}` }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{profile?.full_name || "Account"}</div>
                  <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{user.email}</div>
                </div>
                <button
                  onClick={async () => { setUserDropdown(false); await signOut(); go("home"); }}
                  style={{
                    width: "100%", padding: "10px 16px", border: "none", background: "none",
                    textAlign: "left", cursor: "pointer", fontSize: 14, color: "#ef4444",
                    fontFamily: "Inter",
                  }}
                >Sign out</button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => go("login")} style={{
              padding: "7px 16px", borderRadius: 20, border: `1px solid ${theme.border}`,
              background: "#fff", color: theme.text, fontSize: 14, cursor: "pointer",
            }}>Sign in</button>
            <button onClick={() => go("signup")} style={{
              padding: "7px 16px", borderRadius: 20, border: "none",
              background: `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
              color: "white", fontSize: 14, cursor: "pointer", fontWeight: 600,
            }}>Sign up</button>
          </div>
        )}
      </div>

      {/* Mobile hamburger */}
      <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} style={{
        display: "none", background: "none", border: "none",
        cursor: "pointer", padding: 8, color: theme.text, fontSize: 22,
      }}>{menuOpen ? "✕" : "☰"}</button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="nav-mobile-menu" style={{
          position: "fixed", top: 64, left: 0, right: 0,
          background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${theme.border}`,
          padding: "12px 1.5rem 16px",
          display: "flex", flexDirection: "column", gap: 6, zIndex: 99,
        }}>
          {PAGES.map(p => (
            <button key={p.id} onClick={() => go(p.id)} style={{
              padding: "10px 16px", borderRadius: 10, border: "none",
              cursor: "pointer", fontFamily: "Inter", fontSize: 15, textAlign: "left",
              background: page === p.id ? theme.accent : "#f1f5f9",
              color: page === p.id ? "white" : theme.text,
            }}>{p.label}</button>
          ))}
          <div style={{ height: 1, background: theme.border, margin: "4px 0" }} />
          {user ? (
            <>
              <div style={{ padding: "8px 16px", fontSize: 13, color: theme.textMuted }}>
                {profile?.full_name || user.email}
              </div>
              <button onClick={async () => { await signOut(); go("home"); }} style={{
                padding: "10px 16px", borderRadius: 10, border: "none",
                cursor: "pointer", fontFamily: "Inter", fontSize: 15, textAlign: "left",
                background: "#fef2f2", color: "#ef4444",
              }}>Sign out</button>
            </>
          ) : (
            <>
              <button onClick={() => go("login")} style={{
                padding: "10px 16px", borderRadius: 10, border: "none",
                background: "#f1f5f9", color: theme.text, fontSize: 15, cursor: "pointer", textAlign: "left",
              }}>Sign in</button>
              <button onClick={() => go("signup")} style={{
                padding: "10px 16px", borderRadius: 10, border: "none",
                background: `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
                color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer", textAlign: "left",
              }}>Sign up free</button>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 700px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

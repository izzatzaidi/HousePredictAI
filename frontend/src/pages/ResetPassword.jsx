import { useState } from "react";
import { theme } from "../theme";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword({ setPage }) {
  const { updatePassword } = useAuth();
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [done,      setDone]      = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      await updatePassword(password);
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: "13px 14px", borderRadius: 10, width: "100%",
    background: "#fff", border: "1.5px solid #e2e8f0",
    color: theme.text, fontSize: 15, fontFamily: "Inter",
    transition: "border-color 0.2s", outline: "none",
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: theme.bg, padding: "2rem",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{
          background: "#fff", borderRadius: 20, border: `1px solid ${theme.border}`,
          padding: "36px 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}>
          {done ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 24, marginBottom: 12 }}>
                Password updated
              </h2>
              <p style={{ color: theme.textMuted, marginBottom: 28 }}>
                Your password has been changed successfully.
              </p>
              <button
                onClick={() => setPage("home")}
                style={{
                  padding: "13px 28px", borderRadius: 12, border: "none",
                  background: `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
                  color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer",
                }}
              >Go to home</button>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 26, marginBottom: 6 }}>
                Set new password
              </h2>
              <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 28 }}>
                Choose a new password for your account.
              </p>

              {error && (
                <div style={{
                  padding: "12px 14px", borderRadius: 10, marginBottom: 20,
                  background: "#fef2f2", border: "1px solid #fecaca",
                  color: "#dc2626", fontSize: 14,
                }}>{error}</div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: theme.textMuted, display: "block", marginBottom: 6 }}>New password</label>
                  <input
                    type="password" placeholder="Min. 6 characters"
                    value={password} onChange={e => setPassword(e.target.value)}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = theme.accent}
                    onBlur={e  => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: theme.textMuted, display: "block", marginBottom: 6 }}>Confirm new password</label>
                  <input
                    type="password" placeholder="••••••••"
                    value={confirm} onChange={e => setConfirm(e.target.value)}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = theme.accent}
                    onBlur={e  => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
                <button
                  type="submit" disabled={loading}
                  style={{
                    padding: "14px", borderRadius: 12, border: "none",
                    background: loading ? "#cbd5e1" : `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
                    color: "white", fontSize: 15, fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter", marginTop: 8,
                  }}
                >{loading ? "Updating..." : "Update password"}</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

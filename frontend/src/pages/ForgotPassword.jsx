import { useState } from "react";
import { theme } from "../theme";
import { useAuth } from "../context/AuthContext";

const inputStyle = {
  padding: "13px 14px", borderRadius: 10, width: "100%",
  background: "#fff", border: "1.5px solid #e2e8f0",
  color: theme.text, fontSize: 15, fontFamily: "Inter",
  transition: "border-color 0.2s", outline: "none",
};

export default function ForgotPassword({ setPage }) {
  const { resetPassword } = useAuth();
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Please enter your email address."); return; }
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: theme.bg, padding: "2rem",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div
          onClick={() => setPage("home")}
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 36, justifyContent: "center" }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>🏠</div>
          <span style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 22 }}>
            House<span style={{ color: theme.accentLight }}>Predict</span>
            <span style={{ fontSize: 12, color: theme.textMuted, marginLeft: 6, fontFamily: "Inter", fontWeight: 400 }}>AI</span>
          </span>
        </div>

        <div style={{
          background: "#fff", borderRadius: 20, border: `1px solid ${theme.border}`,
          padding: "36px 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}>
          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📨</div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 24, marginBottom: 12 }}>
                Reset link sent
              </h2>
              <p style={{ color: theme.textMuted, lineHeight: 1.7, marginBottom: 28 }}>
                We've emailed a password reset link to <strong>{email}</strong>.
                Check your inbox and follow the link to reset your password.
              </p>
              <button
                onClick={() => setPage("login")}
                style={{
                  padding: "13px 28px", borderRadius: 12, border: "none",
                  background: `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
                  color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer",
                }}
              >Back to sign in</button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setPage("login")}
                style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", fontSize: 13, padding: 0, marginBottom: 20, display: "flex", alignItems: "center", gap: 4 }}
              >← Back to sign in</button>

              <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 26, marginBottom: 6 }}>
                Forgot password?
              </h2>
              <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
                No worries. Enter your email and we'll send you a reset link.
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
                  <label style={{ fontSize: 13, fontWeight: 500, color: theme.textMuted, display: "block", marginBottom: 6 }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = theme.accent}
                    onBlur={e  => e.target.style.borderColor = "#e2e8f0"}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "14px", borderRadius: 12, border: "none",
                    background: loading ? "#cbd5e1" : `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
                    color: "white", fontSize: 15, fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter",
                  }}
                >{loading ? "Sending..." : "Send reset link"}</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

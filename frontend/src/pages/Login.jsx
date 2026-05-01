import { useState } from "react";
import { theme } from "../theme";
import { useAuth } from "../context/AuthContext";

const inputStyle = (err) => ({
  padding: "13px 14px", borderRadius: 10, width: "100%",
  background: "#fff", border: `1.5px solid ${err ? "#f87171" : "#e2e8f0"}`,
  color: theme.text, fontSize: 15, fontFamily: "Inter",
  transition: "border-color 0.2s", outline: "none",
});

export default function Login({ setPage }) {
  const { signIn } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      await signIn(email, password);
      setPage("home");
    } catch (err) {
      setError(err.message === "Invalid login credentials"
        ? "Incorrect email or password."
        : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: theme.bg,
      padding: "calc(64px + 2rem) 2rem 2rem",
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
          background: "#fff", borderRadius: 20,
          border: `1px solid ${theme.border}`,
          padding: "36px 32px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 26, marginBottom: 6 }}>
            Welcome back
          </h2>
          <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 28 }}>
            Sign in to your HousePredict account
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
                style={inputStyle(false)}
                onFocus={e => e.target.style.borderColor = theme.accent}
                onBlur={e  => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: theme.textMuted }}>Password</label>
                <button
                  type="button"
                  onClick={() => setPage("forgot-password")}
                  style={{ background: "none", border: "none", color: theme.accent, fontSize: 13, cursor: "pointer", padding: 0 }}
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle(false)}
                onFocus={e => e.target.style.borderColor = theme.accent}
                onBlur={e  => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8, padding: "14px", borderRadius: 12, border: "none",
                background: loading ? "#cbd5e1" : `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
                color: "white", fontSize: 15, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter",
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: theme.textMuted }}>
            Don't have an account?{" "}
            <button
              onClick={() => setPage("signup")}
              style={{ background: "none", border: "none", color: theme.accent, fontWeight: 600, cursor: "pointer", fontSize: 14 }}
            >
              Sign up free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { theme } from "../theme";
import { useAuth } from "../context/AuthContext";

const inputStyle = (err) => ({
  padding: "13px 14px", borderRadius: 10, width: "100%",
  background: "#fff", border: `1.5px solid ${err ? "#f87171" : "#e2e8f0"}`,
  color: theme.text, fontSize: 15, fontFamily: "Inter",
  transition: "border-color 0.2s", outline: "none",
});

export default function SignUp({ setPage }) {
  const { signUp } = useAuth();
  const [fullName,  setFullName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [confirm,   setConfirm]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [done,      setDone]      = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    if (!fullName.trim())     { setError("Please enter your full name."); return; }
    if (!email.trim())        { setError("Please enter your email."); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm)  { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      await signUp(email, password, fullName.trim());
      setDone(true);
    } catch (err) {
      if (err.message?.toLowerCase().includes("already registered"))
        setError("An account with this email already exists. Sign in instead.");
      else
        setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: theme.bg,
      padding: "calc(64px + 2rem) 2rem 2rem",
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, border: `1px solid ${theme.border}`,
        padding: "48px 32px", maxWidth: 420, width: "100%", textAlign: "center",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 24, marginBottom: 12 }}>
          Check your email
        </h2>
        <p style={{ color: theme.textMuted, lineHeight: 1.7, marginBottom: 28 }}>
          We've sent a confirmation link to <strong>{email}</strong>.
          Click the link to activate your account.
        </p>
        <button
          onClick={() => setPage("login")}
          style={{
            padding: "13px 28px", borderRadius: 12, border: "none",
            background: `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
            color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer",
          }}
        >Go to sign in</button>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: theme.bg,
      padding: "calc(64px + 2rem) 2rem 2rem",
    }}>
      <div style={{ width: "100%", maxWidth: 480 }}>

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
          <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 26, marginBottom: 6 }}>
            Create your account
          </h2>
          <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 24 }}>
            Sign up to save predictions and track the market.
          </p>

          {error && (
            <div style={{
              padding: "12px 14px", borderRadius: 10, marginBottom: 20,
              background: "#fef2f2", border: "1px solid #fecaca",
              color: "#dc2626", fontSize: 14,
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: theme.textMuted, display: "block", marginBottom: 6 }}>Full name</label>
              <input
                type="text" placeholder="Jane Smith" value={fullName}
                onChange={e => setFullName(e.target.value)}
                style={inputStyle(false)}
                onFocus={e => e.target.style.borderColor = theme.accent}
                onBlur={e  => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: theme.textMuted, display: "block", marginBottom: 6 }}>Email address</label>
              <input
                type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle(false)}
                onFocus={e => e.target.style.borderColor = theme.accent}
                onBlur={e  => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: theme.textMuted, display: "block", marginBottom: 6 }}>Password</label>
              <input
                type="password" placeholder="Min. 6 characters" value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle(false)}
                onFocus={e => e.target.style.borderColor = theme.accent}
                onBlur={e  => e.target.style.borderColor = "#e2e8f0"}
              />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: theme.textMuted, display: "block", marginBottom: 6 }}>Confirm password</label>
              <input
                type="password" placeholder="••••••••" value={confirm}
                onChange={e => setConfirm(e.target.value)}
                style={inputStyle(password && confirm && password !== confirm)}
                onFocus={e => e.target.style.borderColor = theme.accent}
                onBlur={e  => e.target.style.borderColor = (password && confirm && password !== confirm) ? "#f87171" : "#e2e8f0"}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8, padding: "13px", borderRadius: 12, border: "none",
                background: loading ? "#cbd5e1" : `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
                color: "white", fontSize: 15, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter",
              }}
            >{loading ? "Creating account..." : "Create account"}</button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: theme.textMuted }}>
            Already have an account?{" "}
            <button
              onClick={() => setPage("login")}
              style={{ background: "none", border: "none", color: theme.accent, fontWeight: 600, cursor: "pointer", fontSize: 14 }}
            >Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}

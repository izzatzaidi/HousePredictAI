import { useState } from "react";
import { theme } from "../theme";
import { useAuth } from "../context/AuthContext";

const inputStyle = (err) => ({
  padding: "13px 14px", borderRadius: 10, width: "100%",
  background: "#fff", border: `1.5px solid ${err ? "#f87171" : "#e2e8f0"}`,
  color: theme.text, fontSize: 15, fontFamily: "Inter",
  transition: "border-color 0.2s", outline: "none",
});

const RoleCard = ({ role, selected, onClick, icon, title, desc }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      flex: 1, padding: "20px 16px", borderRadius: 14, cursor: "pointer",
      border: `2px solid ${selected ? theme.accent : "#e2e8f0"}`,
      background: selected ? theme.accentGlow : "#fff",
      textAlign: "left", transition: "all 0.2s",
      display: "flex", flexDirection: "column", gap: 8,
    }}
  >
    <span style={{ fontSize: 28 }}>{icon}</span>
    <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 15, color: theme.text }}>{title}</div>
    <div style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.5 }}>{desc}</div>
    {selected && (
      <div style={{
        marginTop: 4, display: "inline-flex", alignItems: "center", gap: 4,
        color: theme.accent, fontSize: 12, fontWeight: 600,
      }}>✓ Selected</div>
    )}
  </button>
);

export default function SignUp({ setPage }) {
  const { signUp } = useAuth();
  const [step,      setStep]      = useState(1);
  const [role,      setRole]      = useState("");
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
    if (!fullName.trim())          { setError("Please enter your full name."); return; }
    if (!email.trim())             { setError("Please enter your email."); return; }
    if (password.length < 6)       { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm)      { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      await signUp(email, password, role, fullName.trim());
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
      justifyContent: "center", background: theme.bg, padding: "2rem",
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
      justifyContent: "center", background: theme.bg, padding: "2rem",
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

          {/* Step indicator */}
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            {[1, 2].map(s => (
              <div key={s} style={{
                height: 4, flex: 1, borderRadius: 2,
                background: step >= s ? theme.accent : "#e2e8f0",
                transition: "background 0.3s",
              }} />
            ))}
          </div>

          {step === 1 && (
            <>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 26, marginBottom: 6 }}>
                I am a...
              </h2>
              <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 24 }}>
                Choose your profile type to get started
              </p>
              <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
                <RoleCard
                  role="buyer"
                  selected={role === "buyer"}
                  onClick={() => setRole("buyer")}
                  icon="🔍"
                  title="Home Buyer"
                  desc="Search properties, get AI price predictions, and track the market."
                />
                <RoleCard
                  role="seller"
                  selected={role === "seller"}
                  onClick={() => setRole("seller")}
                  icon="🏷️"
                  title="Home Seller"
                  desc="Value your property, see market trends, and attract buyers."
                />
              </div>
              <button
                onClick={() => { if (role) setStep(2); }}
                disabled={!role}
                style={{
                  width: "100%", padding: "14px", borderRadius: 12, border: "none",
                  background: role ? `linear-gradient(135deg, ${theme.accent}, #818cf8)` : "#e2e8f0",
                  color: role ? "white" : theme.textMuted, fontSize: 15, fontWeight: 600,
                  cursor: role ? "pointer" : "not-allowed", fontFamily: "Inter",
                }}
              >Continue →</button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 26, marginBottom: 6 }}>
                Create your account
              </h2>
              <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 24 }}>
                Signing up as a{" "}
                <span style={{ color: theme.accent, fontWeight: 600 }}>
                  {role === "buyer" ? "Home Buyer" : "Home Seller"}
                </span>
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

                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(""); }}
                    style={{
                      flex: 1, padding: "13px", borderRadius: 12,
                      border: "1.5px solid #e2e8f0", background: "#fff",
                      color: theme.text, fontSize: 15, cursor: "pointer", fontFamily: "Inter",
                    }}
                  >← Back</button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 2, padding: "13px", borderRadius: 12, border: "none",
                      background: loading ? "#cbd5e1" : `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
                      color: "white", fontSize: 15, fontWeight: 600,
                      cursor: loading ? "not-allowed" : "pointer", fontFamily: "Inter",
                    }}
                  >{loading ? "Creating account..." : "Create account"}</button>
                </div>
              </form>
            </>
          )}

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

import { useState } from "react";
import { theme } from "../theme";
import { useAuth } from "../context/AuthContext";

const fmt = n => "£" + Number(n).toLocaleString("en-GB");

const REGIONS = [
  "London", "South East", "South West", "East of England",
  "East Midlands", "West Midlands", "Yorkshire", "North West",
  "North East", "Wales", "Scotland",
];

const REGIONAL_AVG = {
  "London": 532000, "South East": 397000, "East of England": 344000,
  "South West": 337000, "West Midlands": 268000, "East Midlands": 251000,
  "North West": 233000, "Wales": 223000, "Yorkshire": 220000,
  "Scotland": 204000, "North East": 171000,
};

function BuyerProfile({ profile, updateProfile, setPage }) {
  const [editing,    setEditing]    = useState(false);
  const [region,     setRegion]     = useState(profile?.preferred_region || "");
  const [budgetMin,  setBudgetMin]  = useState(profile?.budget_min || "");
  const [budgetMax,  setBudgetMax]  = useState(profile?.budget_max || "");
  const [propType,   setPropType]   = useState(profile?.property_type_pref || "");
  const [saving,     setSaving]     = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        preferred_region:    region || null,
        budget_min:          budgetMin ? parseInt(budgetMin) : null,
        budget_max:          budgetMax ? parseInt(budgetMax) : null,
        property_type_pref:  propType || null,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const inputSt = {
    padding: "10px 12px", borderRadius: 8, width: "100%",
    border: "1.5px solid #e2e8f0", background: "#fff",
    color: theme.text, fontSize: 14, fontFamily: "Inter", outline: "none",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        {[
          { icon: "🔍", label: "Get a prediction", action: () => setPage("predict"), color: theme.accent },
          { icon: "📊", label: "Market trends",    action: () => setPage("trends"),  color: "#8b5cf6" },
          { icon: "🕐", label: "My history",       action: () => setPage("history"), color: theme.green },
        ].map(a => (
          <button key={a.label} onClick={a.action} style={{
            padding: "20px 16px", borderRadius: 14, border: "none", cursor: "pointer",
            background: a.color + "12", textAlign: "left", transition: "all 0.15s",
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{a.icon}</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 14, color: a.color }}>{a.label}</div>
          </button>
        ))}
      </div>

      {/* Search preferences */}
      <div style={{
        background: "#fff", borderRadius: 16, border: `1px solid ${theme.border}`, padding: 24,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 16, marginBottom: 2 }}>
              Search preferences
            </div>
            <div style={{ fontSize: 13, color: theme.textMuted }}>Personalise your property search</div>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} style={{
              padding: "8px 16px", borderRadius: 8, border: `1px solid ${theme.border}`,
              background: "#fff", color: theme.text, fontSize: 13, cursor: "pointer",
            }}>Edit</button>
          )}
        </div>

        {editing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, color: theme.textMuted, display: "block", marginBottom: 6 }}>Preferred region</label>
              <select value={region} onChange={e => setRegion(e.target.value)} style={inputSt}>
                <option value="">Any region</option>
                {REGIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, color: theme.textMuted, display: "block", marginBottom: 6 }}>Min budget (£)</label>
                <input type="number" placeholder="e.g. 200000" value={budgetMin}
                  onChange={e => setBudgetMin(e.target.value)} style={inputSt} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: theme.textMuted, display: "block", marginBottom: 6 }}>Max budget (£)</label>
                <input type="number" placeholder="e.g. 500000" value={budgetMax}
                  onChange={e => setBudgetMax(e.target.value)} style={inputSt} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: 13, color: theme.textMuted, display: "block", marginBottom: 6 }}>Property type</label>
              <select value={propType} onChange={e => setPropType(e.target.value)} style={inputSt}>
                <option value="">Any type</option>
                <option>Detached</option><option>Semi-detached</option>
                <option>Terraced</option><option>Flat / Apartment</option><option>Bungalow</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setEditing(false)} style={{
                flex: 1, padding: "11px", borderRadius: 10, border: "1.5px solid #e2e8f0",
                background: "#fff", color: theme.text, fontSize: 14, cursor: "pointer",
              }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{
                flex: 2, padding: "11px", borderRadius: 10, border: "none",
                background: `linear-gradient(135deg, ${theme.accent}, #818cf8)`,
                color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>{saving ? "Saving..." : "Save preferences"}</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 16 }}>
            {[
              { label: "Preferred region", value: profile?.preferred_region || "Any" },
              { label: "Min budget",       value: profile?.budget_min ? fmt(profile.budget_min) : "Not set" },
              { label: "Max budget",       value: profile?.budget_max ? fmt(profile.budget_max) : "Not set" },
              { label: "Property type",    value: profile?.property_type_pref || "Any" },
            ].map(p => (
              <div key={p.label}>
                <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 4 }}>{p.label}</div>
                <div style={{ fontWeight: 600, fontSize: 15, color: theme.text }}>{p.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Market tip */}
      {profile?.preferred_region && REGIONAL_AVG[profile.preferred_region] && (
        <div style={{
          padding: "16px 20px", borderRadius: 14,
          background: theme.accentGlow, border: `1px solid ${theme.borderAccent}`,
        }}>
          <div style={{ fontSize: 13, color: theme.accent, fontWeight: 600, marginBottom: 4 }}>
            Market insight for {profile.preferred_region}
          </div>
          <div style={{ fontSize: 14, color: theme.text }}>
            Average house price is <strong>{fmt(REGIONAL_AVG[profile.preferred_region])}</strong> (2024).
            {profile.budget_max && REGIONAL_AVG[profile.preferred_region] > profile.budget_max
              ? " Your budget may be below the regional average — consider nearby regions."
              : " Your budget is well positioned for this region."}
          </div>
        </div>
      )}
    </div>
  );
}

function SellerProfile({ profile, updateProfile, setPage }) {
  const [editing,   setEditing]   = useState(false);
  const [region,    setRegion]    = useState(profile?.preferred_region || "");
  const [propType,  setPropType]  = useState(profile?.property_type_pref || "");
  const [saving,    setSaving]    = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        preferred_region:   region || null,
        property_type_pref: propType || null,
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const inputSt = {
    padding: "10px 12px", borderRadius: 8, width: "100%",
    border: "1.5px solid #e2e8f0", background: "#fff",
    color: theme.text, fontSize: 14, fontFamily: "Inter", outline: "none",
  };

  const avg = profile?.preferred_region ? REGIONAL_AVG[profile.preferred_region] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        {[
          { icon: "🏷️", label: "Value my property", action: () => setPage("predict"), color: theme.green },
          { icon: "📈", label: "Market trends",      action: () => setPage("trends"),  color: theme.accent },
          { icon: "🕐", label: "Past valuations",    action: () => setPage("history"), color: "#8b5cf6" },
        ].map(a => (
          <button key={a.label} onClick={a.action} style={{
            padding: "20px 16px", borderRadius: 14, border: "none", cursor: "pointer",
            background: a.color + "12", textAlign: "left",
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{a.icon}</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 14, color: a.color }}>{a.label}</div>
          </button>
        ))}
      </div>

      {/* Property details */}
      <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${theme.border}`, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 700, fontSize: 16, marginBottom: 2 }}>My property</div>
            <div style={{ fontSize: 13, color: theme.textMuted }}>Your property details for valuation</div>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} style={{
              padding: "8px 16px", borderRadius: 8, border: `1px solid ${theme.border}`,
              background: "#fff", color: theme.text, fontSize: 13, cursor: "pointer",
            }}>Edit</button>
          )}
        </div>

        {editing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 13, color: theme.textMuted, display: "block", marginBottom: 6 }}>Region</label>
              <select value={region} onChange={e => setRegion(e.target.value)} style={inputSt}>
                <option value="">Select region</option>
                {REGIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, color: theme.textMuted, display: "block", marginBottom: 6 }}>Property type</label>
              <select value={propType} onChange={e => setPropType(e.target.value)} style={inputSt}>
                <option value="">Select type</option>
                <option>Detached</option><option>Semi-detached</option>
                <option>Terraced</option><option>Flat / Apartment</option><option>Bungalow</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setEditing(false)} style={{
                flex: 1, padding: "11px", borderRadius: 10, border: "1.5px solid #e2e8f0",
                background: "#fff", color: theme.text, fontSize: 14, cursor: "pointer",
              }}>Cancel</button>
              <button onClick={handleSave} disabled={saving} style={{
                flex: 2, padding: "11px", borderRadius: 10, border: "none",
                background: `linear-gradient(135deg, ${theme.green}, #34d399)`,
                color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>{saving ? "Saving..." : "Save"}</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 4 }}>Region</div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{profile?.preferred_region || "Not set"}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginBottom: 4 }}>Property type</div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{profile?.property_type_pref || "Not set"}</div>
            </div>
          </div>
        )}
      </div>

      {/* Market insight */}
      {avg && (
        <div style={{
          padding: "16px 20px", borderRadius: 14,
          background: theme.greenGlow, border: "1px solid rgba(5,150,105,0.2)",
        }}>
          <div style={{ fontSize: 13, color: theme.green, fontWeight: 600, marginBottom: 4 }}>
            Regional market — {profile.preferred_region}
          </div>
          <div style={{ fontSize: 14, color: theme.text }}>
            The average property price in this region is <strong>{fmt(avg)}</strong> (2024).
            Use the valuation tool to get an AI-powered estimate for your specific property.
          </div>
        </div>
      )}
    </div>
  );
}

export default function Profile({ setPage }) {
  const { user, profile, updateProfile, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setPage("home");
  };

  if (!user || !profile) return (
    <div style={{ paddingTop: 64, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, color: theme.textMuted }}>Loading profile...</div>
      </div>
    </div>
  );

  const isBuyer  = profile.role === "buyer";
  const roleColor = isBuyer ? theme.accent : theme.green;
  const roleLabel = isBuyer ? "Home Buyer" : "Home Seller";
  const roleIcon  = isBuyer ? "🔍" : "🏷️";

  return (
    <div style={{ paddingTop: 64, minHeight: "100vh" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "48px 2rem" }}>

        {/* Profile header */}
        <div className="fade-up" style={{
          background: "#fff", borderRadius: 20, border: `1px solid ${theme.border}`,
          padding: "28px 32px", marginBottom: 24,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, flexShrink: 0,
            }}>{roleIcon}</div>
            <div>
              <div style={{ fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 22, marginBottom: 4 }}>
                {profile.full_name || "My Profile"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: theme.textMuted }}>{user.email}</span>
                <span style={{
                  padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                  background: roleColor + "15", color: roleColor,
                  border: `1px solid ${roleColor}30`,
                }}>{roleIcon} {roleLabel}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            style={{
              padding: "10px 20px", borderRadius: 10,
              border: "1.5px solid #e2e8f0", background: "#fff",
              color: "#ef4444", fontSize: 14, cursor: "pointer", fontFamily: "Inter",
            }}
          >{signingOut ? "Signing out..." : "Sign out"}</button>
        </div>

        {/* Role-specific content */}
        <div className="fade-up-1">
          {isBuyer
            ? <BuyerProfile  profile={profile} updateProfile={updateProfile} setPage={setPage} />
            : <SellerProfile profile={profile} updateProfile={updateProfile} setPage={setPage} />
          }
        </div>

      </div>
    </div>
  );
}

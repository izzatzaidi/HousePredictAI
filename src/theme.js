export const theme = {
  bg: "#0a0f1e",
  bgCard: "#111827",
  bgInput: "#1a2235",
  accent: "#3b82f6",
  accentLight: "#60a5fa",
  accentGlow: "rgba(59,130,246,0.15)",
  green: "#10b981",
  greenGlow: "rgba(16,185,129,0.15)",
  amber: "#f59e0b",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  border: "rgba(255,255,255,0.08)",
  borderAccent: "rgba(59,130,246,0.4)",
};

export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${theme.bg}; color: ${theme.text}; font-family: 'DM Sans', sans-serif; }
  input, select { outline: none; }
  ::selection { background: ${theme.accent}; color: white; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${theme.bg}; }
  ::-webkit-scrollbar-thumb { background: ${theme.accent}; border-radius: 3px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .fade-up   { animation: fadeUp 0.5s ease both; }
  .fade-up-1 { animation: fadeUp 0.5s 0.1s ease both; }
  .fade-up-2 { animation: fadeUp 0.5s 0.2s ease both; }
  .fade-up-3 { animation: fadeUp 0.5s 0.3s ease both; }
  .fade-up-4 { animation: fadeUp 0.5s 0.4s ease both; }
`;

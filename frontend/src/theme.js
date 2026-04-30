export const theme = {
  bg:           "#f0f4f8",
  bgCard:       "#ffffff",
  bgInput:      "#f8fafc",
  accent:       "#2563eb",
  accentLight:  "#3b82f6",
  accentGlow:   "rgba(37,99,235,0.10)",
  green:        "#059669",
  greenGlow:    "rgba(5,150,105,0.10)",
  amber:        "#d97706",
  text:         "#0f172a",
  textMuted:    "#64748b",
  border:       "rgba(0,0,0,0.09)",
  borderAccent: "rgba(37,99,235,0.35)",
};

export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${theme.bg}; color: ${theme.text}; font-family: 'DM Sans', sans-serif; }
  input, select { outline: none; }
  ::selection { background: ${theme.accent}; color: white; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${theme.bg}; }
  ::-webkit-scrollbar-thumb { background: ${theme.accentLight}; border-radius: 3px; }

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

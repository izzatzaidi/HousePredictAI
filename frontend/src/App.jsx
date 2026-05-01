import { useState } from "react";
import { globalStyles } from "./theme";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Nav            from "./components/Nav";
import Home           from "./pages/Home";
import Predict        from "./pages/Predict";
import Results        from "./pages/Results";
import Trends         from "./pages/Trends";
import History        from "./pages/History";
import Login          from "./pages/Login";
import SignUp         from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword  from "./pages/ResetPassword";
function AppInner() {
  const { resetMode, loading } = useAuth();
  const [page,    setPage]    = useState("home");
  const [results, setResults] = useState(null);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        border: "2px solid rgba(0,0,0,0.12)", borderTopColor: "#2563eb",
        animation: "spin 0.8s linear infinite",
      }} />
    </div>
  );

  if (resetMode) return <ResetPassword setPage={setPage} />;

  return (
    <>
      <Nav page={page} setPage={setPage} />
      {page === "home"           && <Home           setPage={setPage} />}
      {page === "predict"        && <Predict        setPage={setPage} setResults={setResults} />}
      {page === "results"        && <Results        results={results} setPage={setPage} />}
      {page === "trends"         && <Trends         setPage={setPage} />}
      {page === "history"        && <History        setPage={setPage} />}
      {page === "login"          && <Login          setPage={setPage} />}
      {page === "signup"         && <SignUp         setPage={setPage} />}
      {page === "forgot-password"&& <ForgotPassword setPage={setPage} />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <style>{globalStyles}</style>
      <AppInner />
    </AuthProvider>
  );
}

import { useState } from "react";
import { globalStyles } from "./theme";
import Nav     from "./components/Nav";
import Home    from "./pages/Home";
import Predict from "./pages/Predict";
import Results from "./pages/Results";
import Trends  from "./pages/Trends";

export default function App() {
  const [page,    setPage]    = useState("home");
  const [results, setResults] = useState(null);

  return (
    <>
      <style>{globalStyles}</style>
      <Nav page={page} setPage={setPage} />
      {page === "home"    && <Home    setPage={setPage} />}
      {page === "predict" && <Predict setPage={setPage} setResults={setResults} />}
      {page === "results" && <Results results={results} setPage={setPage} />}
      {page === "trends"  && <Trends  setPage={setPage} />}
    </>
  );
}

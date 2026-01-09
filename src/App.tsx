import { useState } from "react";
import Favorites from "./Favorites";
import Search from "./Search";
import "./App.css";

type View = "favorites" | "search";

function App() {
  const [view, setView] = useState<View>("favorites");

  return (
    <div className="page">
      {/* Top navigation */}
      <nav className="nav">
        <button
          className={`nav-button ${view === "favorites" ? "active" : ""}`}
          onClick={() => setView("favorites")}
        >
          Moja Lista FIDE
        </button>

        <button
          className={`nav-button ${view === "search" ? "active" : ""}`}
          onClick={() => setView("search")}
        >
          Wyszukiwanie
        </button>
      </nav>

      {/* Content */}
      <main className="content">
        {view === "favorites" && <Favorites />}
        {view === "search" && <Search />}
      </main>
    </div>
  );
}

export default App;

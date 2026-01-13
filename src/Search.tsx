import { useState } from "react";
import type { LichessPlayer } from "./LichessPlayer";
import "./Search.css";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LichessPlayer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8080/lichess/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) throw new Error();

      const data: LichessPlayer[] = await response.json();
      setResults(data);
    } catch {
      setError("Nie udało się pobrać danych");
    }
  };

  const handleAddPlayer = async (player: LichessPlayer) => {
    try {
      await fetch("http://localhost:8080/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(player),
      });
    } catch {
      alert("Błąd zapisu");
    }
  };

  return (
    <div className="search">
      <h2>Wyszukiwanie zawodników</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Wpisz nazwisko..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Wyszukaj</button>
      </div>

      {error && <p className="error">{error}</p>}

      {(
        <div className="table-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                <th>Kraj</th>
                <th>Tyt.</th>
                <th>Imię i nazwisko</th>
                <th>Rok</th>
                <th>Std.</th>
                <th>Rapid</th>
                <th>Blitz</th>
                <th>Dodaj</th>
              </tr>
            </thead>
            <tbody>
              {results.map((player) => (
                <tr key={player.id}>
                  <td>{player.federation}</td>
                  <td>{player.title}</td>
                  <td className="name">{player.name}</td>
                  <td>{player.year}</td>
                  <td>{player.standard}</td>
                  <td>{player.rapid}</td>
                  <td>{player.blitz}</td>
                  <td>
                    <button className="add-button" onClick={() => handleAddPlayer(player)}>
                      +
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Search;

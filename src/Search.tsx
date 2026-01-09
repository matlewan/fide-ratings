import { useState } from "react";
import type { LichessPlayer } from "./LichessPlayer";
import "./Search.css";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LichessPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
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
    } finally {
      setLoading(false);
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

      {loading && <p className="info">Ładowanie...</p>}
      {error && <p className="error">{error}</p>}

      {results.length > 0 && (
        <div className="table-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Kraj</th>
                <th>Tytuł</th>
                <th>Imię i nazwisko</th>
                <th>Rok ur.</th>
                <th>Standard</th>
                <th>Rapid</th>
                <th>Blitz</th>
                <th>Akcja</th>
              </tr>
            </thead>
            <tbody>
              {results.map((player) => (
                <tr key={player.id}>
                  <td>{player.id}</td>
                  <td>{player.federation}</td>
                  <td>{player.title}</td>
                  <td>{player.name}</td>
                  <td>{player.year}</td>
                  <td>{player.standard}</td>
                  <td>{player.rapid}</td>
                  <td>{player.blitz}</td>
                  <td>
                    <button
                      className="add-button"
                      onClick={() => handleAddPlayer(player)}
                    >
                      Dodaj
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

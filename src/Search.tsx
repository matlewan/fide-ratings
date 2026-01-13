import { useState } from "react";
import type { LichessPlayer } from "./LichessPlayer";
import "./Search.css";

function Search({ addPlayer }: { addPlayer: any }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LichessPlayer[]>([]);

  const handleSearch = async () => {
    const response = await fetch(
      `https://lichess.org/api/fide/player?q=${encodeURIComponent(query)}`
    );
    const data: LichessPlayer[] = await response.json();
    setResults(data);
  };

  return (
    <div className="search">
      <h2>Wyszukiwanie zawodników</h2>
      <div className="search-bar">
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} >
          <input type="text" placeholder="Wpisz nazwisko..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="submit">Wyszukaj</button>
        </form>
      </div>
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
                    <button className="add-button" onClick={() => addPlayer(player)}>
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

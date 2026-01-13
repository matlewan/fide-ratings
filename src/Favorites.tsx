import { useEffect, useState } from "react";
import type { LichessPlayer } from "./LichessPlayer";
import "./Favorites.css";

function Favorites() {
  const [players, setPlayers] = useState<LichessPlayer[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = async () => {
    try {
      const response = await fetch("http://localhost:8080/players");

      if (!response.ok) {
        throw new Error("Błąd podczas pobierania danych");
      }

      const data: LichessPlayer[] = await response.json();
      setPlayers(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Nieznany błąd");
      }
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  if (error) return <p>Błąd: {error}</p>;

  async function remove(id: number): Promise<void> {
    await fetch(`http://localhost:8080/players/${id}`, { method: "DELETE" });
    await fetchPlayers();
  }

  return (
    <div className="favorites-container">
      <h2>Moja Lista FIDE</h2>

      <div className="favorites-table-wrapper">
        <table className="favorites-table">
          <thead>
            <tr>
              <th></th>
              <th>Imię i nazwisko</th>
              <th>Rok</th>
              <th>Std.</th>
              <th>Rapid</th>
              <th>Blitz</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player.id}>
                <td><small>{player.title}</small></td>
                <td className="name">{player.name}</td>
                <td>{player.year}</td>
                <td><b>{player.standard}</b></td>
                <td><b>{player.rapid}</b></td>
                <td><b>{player.blitz}</b></td>
                <td className="remove" onClick={() => remove(player.id)}>❌</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
}

export default Favorites;

import "./Favorites.css";
import type { LichessPlayer } from "./LichessPlayer";

function Favorites({ players, removePlayer } : { players : LichessPlayer[], removePlayer : any }) {
  function fix(rating: number) { return rating || 1000 };
  const sortedPlayers = players.sort((a,b) => fix(b.standard) - fix(a.standard))
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
            {sortedPlayers.map((player) => (
              <tr key={player.id}>
                <td><small>{player.title}</small></td>
                <td className="name">{player.name}</td>
                <td>{player.year}</td>
                <td><b>{player.standard}</b></td>
                <td><b>{player.rapid}</b></td>
                <td><b>{player.blitz}</b></td>
                <td className="remove" onClick={() => removePlayer(player.id)}>❌</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
}

export default Favorites;

import Favorites from "./Favorites";
import Search from "./Search";
import "./App.css";
import { useEffect, useState } from "react";
import type { LichessPlayer } from "./LichessPlayer";
import { IndexedDb } from "./indexedDb";

function App() {

  const [players, setPlayers] = useState<LichessPlayer[]>([]);
  const db = new IndexedDb();

  async function fetchPlayers() {
    db.getPlayers().then(data => setPlayers(data));
  }
  async function removePlayer(id: number) {
    db.removePlayer(id);
    await fetchPlayers();
  }
  async function savePlayer(player: LichessPlayer) {
    db.savePlayer(player);
    await fetchPlayers();
  }
  async function refresh() {
    async function getPlayerFromLichessApi(id: number): Promise<LichessPlayer> {
      const response = await fetch(`https://lichess.org/api/fide/player/${id}`);
      if (!response.ok) throw new Error(`Error while update player with id: ${id}`);
      return await response.json();
    }
    const players = await db.getPlayers();
    for (let player of players) {
      const playerFromLichess = await getPlayerFromLichessApi(player.id);
      await savePlayer(playerFromLichess);
      console.log(`Player updated: ${player.name} ${player.standard} -> ${playerFromLichess.standard}`)
    }
    console.log("Refresh view")
    await fetchPlayers();
  }

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <main>
      <Favorites players={players} removePlayer={removePlayer} refresh={refresh} />
      <Search addPlayer={savePlayer} />
    </main>
  );
}

export default App;

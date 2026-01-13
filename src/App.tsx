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
  async function removePlayer(id : number) {
    db.removePlayer(id);
    await fetchPlayers();
  }
  async function addPlayer(player: LichessPlayer) {
    db.addPlayer(player);
    await fetchPlayers();
  }

  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <main>
      <Favorites players={players} removePlayer={removePlayer} />
      <Search addPlayer={addPlayer} />
    </main>
  );
}

export default App;

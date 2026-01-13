import type { LichessPlayer } from "./LichessPlayer";

export class IndexedDb {
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open("appDB", 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        db.createObjectStore("players", { keyPath: "id" });
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addPlayer(player: LichessPlayer): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction("players", "readwrite");
    tx.objectStore("players").put(player);
  }

  async removePlayer(id: number): Promise<void> {
    const db = await this.dbPromise;
    const tx = db.transaction("players", "readwrite");
    tx.objectStore("players").delete(id);
  }

  async getPlayers(): Promise<LichessPlayer[]> {
    const db = await this.dbPromise;
    const tx = db.transaction("players", "readonly");
    const store = tx.objectStore("players");

    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as LichessPlayer[]);
      req.onerror = () => reject(req.error);
    });
  }
}

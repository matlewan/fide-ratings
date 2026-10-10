<script lang="ts">
	import type { LichessPlayer } from '#lib/model/LichessPlayer';
	import { IndexedDb } from '#lib/model/indexedDb';
	import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let players = $state<LichessPlayer[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	const db = new IndexedDb();

	// Pobieranie graczy z IndexedDB przy załadowaniu strony
	async function loadPlayers() {
		try {
			loading = true;
			players = await db.getPlayers();
		} catch (err) {
			error = 'Nie udało się pobrać zapisanych graczy.';
			console.error(err);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadPlayers();
	});

	// Usunięcie gracza
	async function removePlayer(id: number) {
		try {
			await db.removePlayer(id);
			// Aktualizujemy stan lokalnie, żeby natychmiast zniknął z tabeli
			players = players.filter((p) => p.id !== id);
		} catch (err) {
			error = 'Nie udało się usunąć gracza.';
			console.error(err);
		}
	}

	async function addPlayer() {
		await goto(resolve('/search'));
	}

	// Odświeżanie rankingów (miejsce na Twoją logikę pobierania z API)
	async function refresh() {
		await loadPlayers();
		// Tutaj w przyszłości możesz dodać pętlę aktualizującą graczy z Lichess API
	}

	// Pomocnicza funkcja do sortowania (zabezpieczenie przed brakiem rankingu)
	function fix(rating?: number) { 
		return rating || 1000; 
	}

	// Sortujemy graczy przy użyciu toSorted(), aby nie mutować bezpośrednio stanu Svelte
	let sortedPlayers = $derived(
		[...players].sort((a, b) => fix(b.standard) - fix(a.standard))
	);
</script>

<div class="favorites-container">

	{#if error}
		<p class="alert error">{error}</p>
	{/if}

	{#if loading}
		<p class="loading">Ładowanie zapisanych zawodników...</p>
	{:else if players.length === 0}
		<div class="empty-state">
			<p>Brak zapisanych zawodników w bazie lokalnej.</p>
			<a href={resolve("/search")} class="search-link">Wyszukaj zawodników i dodaj ich tutaj</a>
		</div>
	{:else}
		<div class="actions">
			<button class="refresh-btn" onclick={addPlayer}>Dodaj zawodnika</button>
			<button class="refresh-btn" onclick={refresh}>Odśwież wszystkie rankingi</button>
		</div>
		<div class="favorites-table-wrapper">
			<table class="favorites-table">
				<thead>
					<tr>
						<th>Tyt.</th>
						<th>Imię i nazwisko</th>
						<th>Rok</th>
						<th>Std.</th>
						<th>Rapid</th>
						<th>Blitz</th>
						<th>Akcja</th>
					</tr>
				</thead>
				<tbody>
					{#each sortedPlayers as player (player.id)}
						<tr>
							<td><span class="title-badge">{player.title || '-'}</span></td>
							<td class="name">{player.name}</td>
							<td>{player.year || '-'}</td>
							<td><b>{player.standard || '-'}</b></td>
							<td><b>{player.rapid || '-'}</b></td>
							<td><b>{player.blitz || '-'}</b></td>
							<td>
								<button class="remove-btn" onclick={() => removePlayer(player.id)} title="Usuń z listy">
									Usuń
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

	{/if}
</div>

<style>
	.favorites-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.alert.error {
		padding: 10px 16px;
		background-color: #fee2e2;
		color: #991b1b;
		border-radius: 6px;
		margin-bottom: 16px;
		font-size: 0.9rem;
	}

	.loading, .empty-state {
		text-align: center;
		padding: 40px;
		color: #6b7280;
	}

	.search-link {
		display: inline-block;
		margin-top: 12px;
		color: #2563eb;
		text-decoration: none;
		font-weight: 500;
	}

	.search-link:hover {
		text-decoration: underline;
	}

	.favorites-table-wrapper {
		overflow-x: auto;
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		margin-bottom: 20px;
	}

	.favorites-table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
		font-size: 0.92rem;
	}

	.favorites-table th {
		background-color: #f9fafb;
		color: #374151;
		font-weight: 600;
		padding: 12px 16px;
		border-bottom: 1px solid #e5e7eb;
	}

	.favorites-table td {
		padding: 12px 16px;
		border-bottom: 1px solid #f3f4f6;
		color: #4b5563;
	}

	.favorites-table tr:hover {
		background-color: #fcfcfc;
	}

	.favorites-table tr:last-child td {
		border-bottom: none;
	}

	.name {
		font-weight: 500;
		color: #111827;
	}

	.title-badge {
		color: #d97706;
		font-weight: 600;
		font-size: 0.85rem;
	}

	.remove-btn {
		background-color: white;
		color: red;
		border: 0;
		padding: 0;
		border-radius: 6px;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.remove-btn:hover {
		text-decoration: underline;
	}

	.actions {
        margin-bottom: 10px;
		display: flex;
        gap: 10px;
		justify-content: flex-end;
	}

	.refresh-btn {
		padding: 10px 20px;
		background-color: #f3f4f6;
		color: #374151;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.refresh-btn:hover {
		background-color: #e5e7eb;
		color: #111827;
	}
</style>
<script lang="ts">
	import type { LichessPlayer } from '#lib/model/LichessPlayer';
	import { IndexedDb } from '#lib/model/indexedDb';
    import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	// Stan w Svelte 5 za pomocą runy $state
	let query = $state('');
	let results = $state<LichessPlayer[]>([]);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let successMessage = $state<string | null>(null);

	// Inicjalizacja naszej bazy IndexedDB
	const db = new IndexedDb();

	async function handleSearch(e: Event) {
		e.preventDefault();
		if (!query.trim()) return;

		loading = true;
		error = null;
		successMessage = null;

		try {
			const response = await fetch(
				`https://lichess.org/api/fide/player?q=${encodeURIComponent(query)}`
			);
			if (!response.ok) throw new Error('Błąd podczas pobierania danych z Lichess');
			
			results = await response.json();
		} catch (err) {
			error = 'Nie udało się pobrać wyników. Spróbuj ponownie.';
			results = [];
		} finally {
			loading = false;
		}
	}

	async function addPlayer(player: LichessPlayer) {
		try {
			const cleanPlayer = JSON.parse(JSON.stringify(player));
			await db.savePlayer(cleanPlayer);
			await goto(resolve("/"));
		} catch (err) {
			console.error(err);
			error = 'Nie udało się zapisać gracza w bazie.';
		}
	}
</script>

<div class="search-container">
	<form class="search-bar" onsubmit={handleSearch}>
		<input 
			type="text" 
			placeholder="Wpisz nazwisko lub imię..." 
			bind:value={query} 
		/>
		<button type="submit" disabled={loading}>
			{loading ? 'Szukanie...' : 'Wyszukaj'}
		</button>
	</form>

	<!-- Komunikaty o błędach / sukcesie -->
	{#if error}
		<p class="alert error">{error}</p>
	{/if}
	{#if successMessage}
		<p class="alert success">{successMessage}</p>
	{/if}

	<!-- Tabela wyników (pokazana tylko, gdy coś wyszukano) -->
	{#if results.length > 0}
		<div class="table-wrapper">
			<table class="results-table">
				<thead>
					<tr>
						<th>Kraj</th>
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
					{#each results as player (player.id)}
						<tr>
							<td><span class="badge">{player.federation}</span></td>
							<td><span class="title-badge">{player.title || '-'}</span></td>
							<td class="name">{player.name}</td>
							<td>{player.year || '-'}</td>
							<td>{player.standard || '-'}</td>
							<td>{player.rapid || '-'}</td>
							<td>{player.blitz || '-'}</td>
							<td>
								<button class="add-button" onclick={() => addPlayer(player)} title="Dodaj do ulubionych">
									Dodaj
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else if !loading && query}
		<p class="no-results">Brak wyników dla podanego zapytania.</p>
	{/if}
</div>

<style>
	.search-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.search-bar {
		display: flex;
		gap: 12px;
		margin-bottom: 24px;
	}

	.search-bar input {
		flex: 1;
		padding: 10px 16px;
		font-size: 1rem;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		outline: none;
		transition: border-color 0.2s, box-shadow 0.2s;
	}

	.search-bar input:focus {
		border-color: #2563eb;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}

	.search-bar button {
		padding: 10px 24px;
		background-color: #2563eb;
		color: white;
		font-weight: 500;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.search-bar button:hover:not(:disabled) {
		background-color: #1d4ed8;
	}

	.search-bar button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Alerty */
	.alert {
		padding: 10px 16px;
		border-radius: 6px;
		margin-bottom: 16px;
		font-size: 0.9rem;
	}
	.alert.error { background-color: #fee2e2; color: #991b1b; }
	.alert.success { background-color: #d1fae5; color: #065f46; }

	.no-results {
		color: #6b7280;
		font-style: italic;
		text-align: center;
		padding: 30px;
	}

	/* Stylowanie tabeli */
	.table-wrapper {
		overflow-x: auto;
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.results-table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
		font-size: 0.92rem;
	}

	.results-table th {
		background-color: #f9fafb;
		color: #374151;
		font-weight: 600;
		padding: 12px 16px;
		border-bottom: 1px solid #e5e7eb;
	}

	.results-table td {
		padding: 12px 16px;
		border-bottom: 1px solid #f3f4f6;
		color: #4b5563;
	}

	.results-table tr:hover {
		background-color: #fcfcfc;
	}

	.results-table tr:last-child td {
		border-bottom: none;
	}

	.name {
		font-weight: 500;
		color: #111827;
	}

	/* Badges i przyciski akcji */
	.badge {
		background-color: #f3f4f6;
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: 600;
	}

	.title-badge {
		color: #d97706;
		font-weight: 600;
	}

	.add-button {
		background-color: white;
		color: darkgreen;
		border: 0;
		padding: 0;
		border-radius: 6px;
		font-size: 0.85rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.add-button:hover {
		text-decoration: underline;
	}
</style>
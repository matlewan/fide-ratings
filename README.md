# FIDE Ratings

Aplikacja służąca do przeglądania i śledzenia oficjalnych rankingów szachowych FIDE (szachy klasyczne, szybkie i błyskawiczne).

**Główne funkcje:**
* **Wyszukiwanie zawodników** – wyszukiwanie szachistów po nazwisku
* **Zapisywanie ulubionych** – możliwość dodania wybranych graczy do listy, aby mieć do nich szybki dostęp.
* **Podgląd rankingów** – sprawdzanie aktualnych rankingów dla kategorii Standard, Rapid i Blitz.
* **Działanie offline (IndexedDB)** – wyszukani gracze i lista ulubionych zapisują się lokalnie w przeglądarce, dzięki czemu są dostępne również bez dostępu do sieci.

## Wersja produkcyjna
Aplikacja jest opublikowana pod adresem:  
**[https://matlewan.github.io/fide-ratings/](https://matlewan.github.io/fide-ratings/)**

---

## Stos technologiczny i architektura

* **Framework:** [Svelte 5](https://svelte.dev/) (z wykorzystaniem mechanizmu **Runes**) & [SvelteKit](https://sveltekit.dev/).
* **Routing i budowanie:** Adapter statyczny (`@sveltejs/adapter-static`) ze skonfigurowanym mechanizmem fallback (`404.html`) do obsługi routingu SPA na GitHub Pages.
* **Przechowywanie danych:** Dedykowany serwis **IndexedDB** z obsługą lazy-loadingu oraz zabezpieczeniami przed uruchamianiem w środowisku SSR.
* **Hosting:** GitHub Pages wspierane przez pakiet `gh-pages` oraz plik `.nojekyll` z flagą `--dotfiles`.

---

## Struktura projektu

* `src/routes/` – Widoki oraz ścieżki nawigacji po stronie klienta.
* `src/lib/` – Komponenty, serwisy bazodanowe (IndexedDB) oraz moduły pomocnicze.
* `static/` – Zasoby statyczne (w tym `.nojekyll` zapobiegający ignorowaniu folderu `_app` przez serwery GitHub Pages).

---

## Uruchomienie lokalne

### Wymagania
* **Node.js** (wersja 18 lub wyższa)

### Instrukcja krok po kroku

1. **Sklonuj repozytorium:**
   ```bash
   git clone https://github.com/matlewan/fide-ratings.git
   cd fide-ratings
   ```

2. **Zainstaluj zależności:**
   ```bash
   npm install
   ```

3. **Uruchom tryb deweloperski:**
   ```bash
   npm run dev
   ```
   Aplikacja będzie dostępna pod adresem `http://localhost:5173`.

---

## Budowanie i wdrożenie (Deploy)

### Podgląd wersji produkcyjnej
Aby zbudować projekt i przetestować zachowanie ze ścieżką `base` (`/fide-ratings/`) lokalnie:
```bash
npm run build
npm run preview
```

### Publikacja na GitHub Pages
Automatyczne zbudowanie oraz wysłanie plików produkcyjnych na gałąź `gh-pages`:
```bash
npm run deploy
```

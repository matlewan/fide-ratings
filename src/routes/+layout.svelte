<script lang="ts">
	import favicon from '#lib/assets/favicon.svg';
	import '#lib/styles/global.css';
	import type { LayoutProps } from './$types';
	import { page } from '$app/state';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header>
	<nav>
		<a href="/" class:active={page.url.pathname === '/'}>Lista</a>
		<a href="/search" class:active={page.url.pathname === '/search'}>Wyszukaj</a>
	</nav>
</header>
<main>
	{@render children()}
</main>

<style>
	header {
		padding: 0 20px;
		background-color: #ffffff;
		border-bottom: 1px solid #e5e7eb;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	nav {
		display: flex;
		gap: 24px;
		max-width: 1200px;
		margin: 0 auto;
		height: 40px;
		align-items: center;
	}

	nav a {
		color: #4b5563;
		text-decoration: none;
		font-weight: 500;
		font-size: 0.95rem;
		transition: color 0.2s ease;
	}

	nav a.active {
		color: #2563eb;
		font-weight: 550;
	}

	nav a:hover {
		color: #2563eb; /* Przyjemny niebieski kolor przy najechaniu */
	}

	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 10px 20px;
	}
</style>
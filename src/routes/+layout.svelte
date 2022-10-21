<script lang="ts">
	import { page } from '$app/stores'
</script>

<svelte:head>
	<title> SvelteKit Authentication</title>
</svelte:head>

<nav>
	{#if $page.data.user}
	  <!-- <a href="/admin">Admin</a> -->

		<form action="/logout" method="POST">
			<button type="submit">Log out</button>
		</form>
	{:else}
		<a href="/login">Log in</a>
		<a href="/register">Register</a>
	{/if}
</nav>

<main>
	<slot />
</main>
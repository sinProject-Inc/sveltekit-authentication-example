<script lang="ts">
	import { page } from '$app/stores'
</script>

<svelte:head>
	<title>SvelteKit Authentication</title>
</svelte:head>

<h1>Welcome to SvelteKit Authentication</h1>
<p>
	Visit <a href="https://github.com/sinProject-Inc/sveltekit_authentication">GitHub Repository</a> to
	read the documentation
</p>

{#if $page.data.user}
	<a href="/main">Main</a>

	<form action="/sign_out" method="POST">
		<button type="submit">Log out</button>
	</form>
{:else}
	<a href="/sign_in">Sign in / Sign up</a>
{/if}

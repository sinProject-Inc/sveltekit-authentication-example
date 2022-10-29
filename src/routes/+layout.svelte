<script lang="ts">
	import { page } from '$app/stores'
</script>

<svelte:head>
	<title>SvelteKit Authentication</title>
</svelte:head>

<!-- <nav>
	{#if $page.data.user}
	  <a href="/main">Main</a>

		<form action="/sign_out" method="POST">
			<button type="submit">Sign out</button>
		</form>
	{:else}
		<a href="/sign_in">Sign in</a>
		<a href="/register">Register</a>
	{/if}
</nav> -->



{#if $page.url.pathname != '/sign_in' && !$page.data.user}
	<script src="https://accounts.google.com/gsi/client" async defer></script>
	<div
		id="g_id_onload"
		data-client_id="417364210012-9h5sc3ccdt8gsi2e4o2n01j55bcg0grn.apps.googleusercontent.com"
		data-login_uri="/pin_code?/google"
		data-auto_select="false"
		data-redirect_url={$page.url.pathname}
	/>
{/if}

<main>
	<slot />
</main>

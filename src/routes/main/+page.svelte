<script lang="ts">
	import { page } from '$app/stores'
</script>

<svelte:head>
	<title>Main page</title>
</svelte:head>

{#if $page.data.user}
	<h1>Welcome {$page.data.user.username}</h1>
	Role: {$page.data.user.role}
{:else}
	<h1>Welcome</h1>
{/if}
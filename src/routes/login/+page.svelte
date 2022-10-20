<script lang="ts">
	import { onMount } from 'svelte'
	import type { ActionData } from './$types'

	export let form: ActionData

	let username_element: HTMLInputElement

	onMount(() => {
		document.onfocus = (event) => {
			if (event.target instanceof HTMLInputElement) event.target.select()
		}

		username_element.select()
	})
</script>

<h1>Log in</h1>

<form method="POST">
	<input
		type="text"
		name="username"
		placeholder="Username"
		required
		value={form?.username ?? ''}
		bind:this={username_element}
	/>
	<input type="password" name="password" placeholder="Password" required />

	{#if form?.missing}<p class="error">Username and password is required.</p>{/if}
	{#if form?.credentials}<p class="error">You have entered the wrong credentials.</p>{/if}

	<button type="submit">Log in</button>
</form>

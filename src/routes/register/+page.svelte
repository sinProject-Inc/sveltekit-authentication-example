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

<h1>Register</h1>

<form method="POST">
	<input
		type="text"
		name="username"
		placeholder="Username"
		required
		value={form?.username ?? ''}
		bind:this={username_element}
	/>
	<input type="email" name="email" placeholder="email" required value={form?.email ?? ''} />
	<input type="password" name="password" placeholder="Password" required />

	{#if form?.missing}<p class="error">Username, email and password is required.</p>{/if}
	{#if form?.user_exists}<p class="error">Username or email is used.</p>{/if}

	<button type="submit">Register</button>
</form>

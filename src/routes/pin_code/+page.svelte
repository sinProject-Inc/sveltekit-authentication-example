<script lang="ts">
	import { enhance } from '$app/forms'
	import { onMount } from 'svelte'
	import type { ActionData } from './$types'

	export let form: ActionData

	let first_element: HTMLInputElement


	onMount(() => {
	if (!form) location.href = '/login'
	
		document.onfocus = (event) => {
			if (event.target instanceof HTMLInputElement) event.target.select()
		}

		first_element.select()
	})
</script>

<h1>Enter pin code</h1>

We’ve sent a 6-character code to {form?.email}. The code expires shortly, so please enter it soon.

<form method="POST" action="?/submit" use:enhance>
	<input type="hidden" name="email" value={form?.email} />
	<input type="text" name="pin_code" placeholder="Pin code" required bind:this={first_element} />

	{#if form?.missing}<p class="error">Pin code is required.</p>{/if}
	{#if form?.credentials}<p class="error">You have entered the wrong credentials.</p>{/if}

	<button type="submit">Submit</button>
</form>

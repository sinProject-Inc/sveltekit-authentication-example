<script lang="ts">
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	
	let first_element: HTMLInputElement

	const redirect_url = $page.url.searchParams.get('redirect_url') ?? ''
	const encoded_redirect_url = encodeURIComponent(redirect_url)

	onMount(() => {
		document.onfocus = (event) => {
			if (event.target instanceof HTMLInputElement) event.target.select()
		}

		first_element.select()
	})
</script>

<h1>Log in / Register</h1>

<form method="POST" action="/pin_code?/login&redirect_url={encoded_redirect_url}">
	<input type="email" name="email" placeholder="Email" required bind:this={first_element} />

	<button type="submit">Log in</button>
</form>

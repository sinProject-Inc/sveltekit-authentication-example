<script lang="ts">
	import { browser } from '$app/environment'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'

	let first_element: HTMLInputElement

	const redirect_url = $page.url.searchParams.get('redirect_url') ?? ''
	const encoded_redirect_url = encodeURIComponent(redirect_url)

	// // NOTE: https://oc-technote.com/javascript/javascript-post-params-move-to-page/
	// // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-function-return-type
	// function post(params: any) {
	// 	const form = document.createElement('form')
	// 	form.method = 'post'
	// 	form.action = '/pin_code?/google'

	// 	for (const key in params) {
	// 		// eslint-disable-next-line no-prototype-builtins
	// 		if (params.hasOwnProperty(key)) {
	// 			const hiddenField = document.createElement('input')
	// 			hiddenField.type = 'hidden'
	// 			hiddenField.name = key
	// 			hiddenField.value = params[key]

	// 			form.appendChild(hiddenField)
	// 		}
	// 	}

	// 	document.body.appendChild(form)
	// 	form.submit()
	// }

	// function handleCredentialResponse(response: any): void {
	// 	post({ credential: response.credential })
	// }

	onMount(() => {
		document.onfocus = (event): void => {
			if (event.target instanceof HTMLInputElement) event.target.select()
		}

		first_element.select()

		// google.accounts.id.initialize({
		// 	client_id: '417364210012-9h5sc3ccdt8gsi2e4o2n01j55bcg0grn.apps.googleusercontent.com',
		// 	callback: handleCredentialResponse,
		// 	// auto_select: true
		// })

		// google.accounts.id.renderButton(
		// 	document.getElementById('buttonDiv'),
		// 	{ theme: 'outline', size: 'large', width: '240' } // customization attributes
		// )

		// google.accounts.id.prompt() // also display the One Tap dialog
	})
</script>

<h1>Log in / Register</h1>
{#if browser}
	<script src="https://accounts.google.com/gsi/client" async defer></script>
{/if}

<div
	id="g_id_onload"
	data-client_id="417364210012-9h5sc3ccdt8gsi2e4o2n01j55bcg0grn.apps.googleusercontent.com"
	data-login_uri="/pin_code?/google"
	data-auto_prompt="true"
	data-auto_select="true"
/>
<div
	class="g_id_signin"
	data-width="240"
	data-type="standard"
	data-size="large"
	data-theme="outline"
	data-text="sign_in_with"
	data-shape="rectangular"
	data-logo_alignment="left"
/>

<!-- <div id="buttonDiv" style="max-width:400" /> -->
<br />
<form method="POST" action="/pin_code?/login&redirect_url={encoded_redirect_url}">
	<input type="email" name="email" placeholder="Email" required bind:this={first_element} />

	<button type="submit">Log in</button>
</form>

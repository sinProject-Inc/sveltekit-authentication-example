<script lang="ts">
	import { browser } from '$app/environment'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'

	// const client = new Client("MY-BEARER-TOKEN");

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

	function signInTwitter(): void {
		const form_element = document.getElementById('sign_in_twitter')

		if (form_element instanceof HTMLFormElement) {
			form_element.submit()
		}
	}

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

<h1>Sign in / Sign up</h1>
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

<div class="flex_column">
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

	<form method="POST" action="/sign_in_twitter" id="sign_in_twitter">
		<div class="sign_in_twitter" on:click={signInTwitter} on:keypress={signInTwitter}>
			<div class="flex_row_twitter roboto">
				<img src="./twitter_social_icon_circle_blue.svg" alt="" width="20px" />
				<div>Twitter でログイン</div>
			</div>
		</div>
	</form>

	<!-- <div id="buttonDiv" style="max-width:400" /> -->
	<form method="POST" action="/pin_code?/sign_in&redirect_url={encoded_redirect_url}">
		<input type="email" name="email" placeholder="Email" required bind:this={first_element} />

		<button type="submit">Sign in / Sign up</button>
	</form>
</div>

<style>
	.flex_column {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.sign_in_twitter {
		width: 238px;
		height: 40px;
		border: 1px solid #dadce0;
		border-radius: 4px;
		cursor: pointer;
	}

	.flex_row_twitter {
		height: 40px;
		display: flex;
		flex-direction: row;
		gap: 8px;
		align-items: center;
		padding: 0 8px;
	}

	.roboto {
		color: #3c4043;
		font-family: sans-serif;
		font-weight: 80;
		font-size: 12px;
	}
</style>

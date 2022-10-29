import { Auth } from '$lib/auth'
import { Database, db } from '$lib/database'
import { NodemailerManager as NodeMailerManager } from '$lib/nodemailer_manager'
import type { PageServerLoad } from '.svelte-kit/types/src/routes/$types'
import type { User } from '@prisma/client'
import { invalid, redirect, type Actions } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals, url, request }) => {
	if (locals.user) {
		const redirect_url = url.searchParams.get('redirect_url') || ' /'
		throw redirect(302, redirect_url)
	}

	if (request.method != 'POST') redirect(302, '/')
}

function createPinCode(length = 6): string {
	const pin_code_chars = '0123456789'

	let pin_code = ''

	while (pin_code.length < length) {
		pin_code += pin_code_chars[Math.floor(Math.random() * pin_code_chars.length)]
	}

	return pin_code
}

async function sendMail(user: User, pin_code: string): Promise<void> {
	const nodeMailerManager = new NodeMailerManager()

	try {
		await nodeMailerManager.sendMail(
			user.email,
			'SvelteKit Authentication\n',
			`PIN CODE: ${pin_code}`
		)
	} catch (error) {
		console.error(error)
	}
}

type GoogleCredential = {
	sub: string
	name: string
	given_name: string
	family_name: string
	picture: string
	email: string
}

function decodeJwtResponse(credential: string): GoogleCredential {
	const base64Url = credential.split('.')[1]
	const base64 = base64Url?.replace(/-/g, '+').replace(/_/g, '/') ?? ''
	const jsonPayload = decodeURIComponent(
		atob(base64)
			.split('')
			.map(function (c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
			})
			.join('')
	)
	return JSON.parse(jsonPayload) as GoogleCredential
}

export const actions: Actions = {
	sign_in: async ({ request }) => {
		const data = await request.formData()
		const email = data.get('email')?.toString() ?? ''

		if (!email) throw redirect(302, '/')

		const user = await Database.findUser(email, true)

		if (!user) return { credentials: true, email, missing: false, success: false }

		const pin_code = createPinCode()
		sendMail(user, pin_code)

		const user_id = user.id

		await db.authPin.upsert({
			where: { user_id },
			update: { pin_code },
			create: { user_id, pin_code },
		})

		return { success: true, email, missing: false, credentials: false }
	},
	submit: async ({ cookies, request }) => {
		const data = await request.formData()
		const email = data.get('email')?.toString() ?? ''
		const pin_code = data.get('pin_code')?.toString() ?? ''

		if (!email || !pin_code) return invalid(400, { missing: true, email })

		const auth_pin = await Auth.findAuthPin(email, pin_code)

		if (!auth_pin) return invalid(400, { credentials: true, email })

		await Auth.signIn(auth_pin.user_id, cookies, auth_pin.id)

		return { success: true, email }
	},
	google: async ({ cookies, request }) => {
		const data = await request.formData()
		const credential = data.get('credential')?.toString() ?? ''

		console.log('Encoded JWT ID token: ' + credential)

		if (!credential) return invalid(400, { message: 'Invalid credential' })

		const payload = decodeJwtResponse(credential)

		console.log('ID ' + payload.sub)
		console.log('Full Name: ' + payload.name)
		console.log('Given Name: ' + payload.given_name)
		console.log('Family Name: ' + payload.family_name)
		console.log('Image URL: ' + payload.picture)
		console.log('Email: ' + payload.email)

		const email = payload.email as string
		const user = await Database.findUser(email, true)

		if (!user) return { credentials: true, email, missing: false }

		await Auth.signIn(user.id, cookies)

		throw redirect(302, '/sign_in')
	},
}

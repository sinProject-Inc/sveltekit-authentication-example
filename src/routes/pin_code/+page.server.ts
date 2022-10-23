import { CookiesManager } from '$lib/cookies_manager'
import { db } from '$lib/database'
import { NodemailerManager as NodeMailerManager } from '$lib/nodemailer_manager'
import type { PageServerLoad } from '.svelte-kit/types/src/routes/$types'
import type { User } from '@prisma/client'
import { invalid, redirect, type Actions } from '@sveltejs/kit'

enum Roles {
	admin = 'admin',
	user = 'user',
}

export const load: PageServerLoad = async ({ locals, url, request }) => {
	if (locals.user) {
		const redirect_url = url.searchParams.get('redirect_url') || ' /'
		throw redirect(302, redirect_url)
	}

	if (request.method != 'POST') redirect(302, '/')
}

function createPinCode(length = 6) {
	const pin_code_chars = '0123456789'

	let pin_code = ''

	while (pin_code.length < length) {
		pin_code += pin_code_chars[Math.floor(Math.random() * pin_code_chars.length)]
	}

	return pin_code
}

async function sendMail(user: User, pin_code: string) {
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

async function findUser(email: string, canRegister = true) {
	const user = await db.user.findUnique({ where: { email } })

	if (user) return user;
	if (!canRegister) return undefined;

	try {
		return await db.user.create({
			data: {
				role: { connect: { name: Roles.user } },
				email,
			},
		})
	} catch (error) {
		console.error(error)
		return undefined
	}
}

async function login(request: Request, canRegister = true) {
	const data = await request.formData()
	const email = data.get('email')?.toString() ?? ''

	if (!email) throw redirect(302, '/')

	const user = await findUser(email, canRegister)

	if (!user) return { success: true, email, missing: false, credentials: false }

	const pin_code = createPinCode()
	console.log('sendmail')
	sendMail(user, pin_code)

	const user_id = user.id

	await db.authPin.upsert({
		where: { user_id },
		update: { pin_code },
		create: { user_id, pin_code },
	})

	return { success: true, email, missing: false, credentials: false }
}

export const actions: Actions = {
	login: async ({ request }) => {
		return await login(request)
	},
	submit: async ({ cookies, request }) => {
		const data = await request.formData()
		const email = data.get('email')?.toString() ?? ''
		const pin_code = data.get('pin_code')?.toString() ?? ''

		if (!email || !pin_code) return invalid(400, { missing: true, email })

		const limit_date = new Date()

		limit_date.setMinutes(limit_date.getMinutes() - 5)

		const auth_pin = await db.authPin.findFirst({
			where: {
				pin_code,
				updated_at: { gt: limit_date },
				user: {
					email,
				},
			},
		})

		if (!auth_pin) return invalid(400, { credentials: true, email })

		const user_id = auth_pin.user_id

		const [auth_token] = await db.$transaction([
			db.authToken.upsert({
				where: { user_id },
				update: { token: crypto.randomUUID() },
				create: { user_id, token: crypto.randomUUID() },
			}),
			db.authPin.delete({
				where: {
					id: auth_pin.id,
				},
			}),
		])

		new CookiesManager(cookies).setSessionId(auth_token.token)

		return { success: true, email }
	},
}

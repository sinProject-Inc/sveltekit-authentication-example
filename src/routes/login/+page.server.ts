import { CookiesManager } from '$lib/cookies_manager'
import { db } from '$lib/database'
import type { Actions, PageServerLoad } from '.svelte-kit/types/src/routes/register/$types'
import { invalid, redirect } from '@sveltejs/kit'
import bcrypt from 'bcrypt'

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) {
		const redirect_url = url.searchParams.get('redirect') || '/'
		throw redirect(302, redirect_url)
	}
}

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData()
		const username = data.get('username') as string
		const password = data.get('password') as string

		if (!username || !password) return invalid(404, { missing: true })

		const user = await db.user.findUnique({ where: { username } })

		if (!user) return invalid(400, { credentials: true })

		const password_valid = await bcrypt.compare(password, user.password)

		if (!password_valid) return invalid(400, { credentials: true })

		const auth_token = await db.authToken.upsert({
			where: { user_id: user.id },
			update: { token: crypto.randomUUID() },
			create: { user_id: user.id, token: crypto.randomUUID() },
		})

		new CookiesManager(cookies).setSessionId(auth_token.token);
	},
}

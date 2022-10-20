import { db } from '$lib/database'
import type { Actions, PageServerLoad } from '.svelte-kit/types/src/routes/register/$types'
import { invalid, redirect } from '@sveltejs/kit'
import bcrypt from 'bcrypt'

export const load: PageServerLoad = async () => {
	// todo
}

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData()
		const username = data.get('username') as string
		const password = data.get('password') as string

		if (!username || !password) return invalid(404, { missing: true, username })

		const user = await db.user.findUnique({ where: { username } })

		if (!user) return invalid(400, { credentials: true, username })

		const password_valid = await bcrypt.compare(password, user.password)

		if (!password_valid) return invalid(400, { credentials: true, username })

		await db.authToken.deleteMany({ where: { user_id: user.id } })

		const auth_token = await db.authToken.create({
			data: {
				user_id: user.id,
				token: crypto.randomUUID(),
			},
		})

		cookies.set('session_id', auth_token.token, {
			path: '/',
			maxAge: 60 * 60 * 24 * 30,
			sameSite: 'lax',
			secure: true,
			// secure: process.env.NODE_ENV === 'production',
			httpOnly: true,
		})

		throw redirect(302, '/')
	},
}

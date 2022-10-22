import { db } from '$lib/database'
import { invalid, redirect, type Actions } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import type { PageServerLoad } from './$types'

enum Roles {
	admin = 'admin',
	user = 'user',
}

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(302, '/')
}

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData()
		const username = data.get('username')?.toString() ?? ''
		const email = data.get('email')?.toString() ?? ''
		const password = data.get('password')?.toString() ?? ''
		const password_is_valid = password.length >= 8

		if (!username || !email || !password_is_valid) return invalid(404, { missing: true })

		try {
			await db.user.create({
				data: {
					username,
					email,
					password: await bcrypt.hash(password, 10),
					role: { connect: { name: Roles.user } },
				},
			})
		} catch (error) {
			console.error(error)
			return invalid(400, { user_exists: true })
		}

		throw redirect(303, '/login')
	},
}

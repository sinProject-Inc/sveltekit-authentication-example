import { db } from '$lib/database'
import { invalid, redirect, type Actions } from '@sveltejs/kit'
import bcrypt from 'bcrypt'
import type { PageServerLoad } from './$types'

enum Roles {
	admin = 'admin',
	user = 'user',
}

export const load: PageServerLoad = async () => {
	// todo
}

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData()
		const username = data.get('username') as string
		const email = data.get('email') as string
		const password = data.get('password') as string

		if (!username || !email || !password) return invalid(404, { missing: true })

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

		console.log('aaa')

		throw redirect(303, '/login')
	},
}


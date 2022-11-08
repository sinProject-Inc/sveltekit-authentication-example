import { Auth } from '$lib/auth'
import { redirect, type Actions } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	throw redirect(302, '/')
}

export const actions: Actions = {
	default: async ({ cookies }) => {
		await Auth.signOut(cookies)
		throw redirect(302, '/')
	},
}

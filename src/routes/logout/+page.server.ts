import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	throw redirect(302, "/")
}

export const actions: Actions = {
	default: async ({ cookies }) => {
		cookies.set('session_id', '', {
			path: '/',
			expires: new Date(0),
		})

		throw redirect(302, '/')
	}
}

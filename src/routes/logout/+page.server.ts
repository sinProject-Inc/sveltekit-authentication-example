import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	throw redirect(302, "/")
}

export const actions: Actions = {
	default: async ({ cookies }) => {
		cookies.delete('session_id')
		throw redirect(302, '/')
	}
}

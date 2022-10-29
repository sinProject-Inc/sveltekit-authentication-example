import type { PageServerLoad } from '.svelte-kit/types/src/routes/$types'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(302, '/')
}

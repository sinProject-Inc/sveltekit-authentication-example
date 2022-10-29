import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// NOTE: https://github.com/sveltejs/kit/issues/3912

export const load: PageServerLoad = async ({ locals, url }) => {
	const redirect_url = new URL(url.origin)

	redirect_url.pathname = '/sign_in'
	redirect_url.searchParams.set('redirect_url', url.pathname)

	if (!locals.user) throw redirect(302, redirect_url.toString())
}
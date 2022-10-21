import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

// NOTE: https://github.com/sveltejs/kit/issues/3912

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user) throw redirect(302, `/login?redirect=${url.pathname}`)
}
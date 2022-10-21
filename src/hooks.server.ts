import { CookiesManager } from '$lib/cookies_manager'
import { db } from '$lib/database'
import type { Handle } from '@sveltejs/kit'

// export const handle: Handle = async ({ event, resolve }) => resolve(event)

export const handle: Handle = async ({ event, resolve }) => {
	const session_id = event.cookies.get('session_id')

	if (!session_id) return await resolve(event)

	const auth_token = await db.authToken.findUnique({
		where: { token: session_id },
		include: {
			user: {
				include: {
					role: true,
				},
			},
		},
	})

	if (!auth_token) return await resolve(event)

	event.locals.user = {
		username: auth_token.user.username,
		role: auth_token.user.role.name,
	}

	new CookiesManager(event.cookies).setSessionId(auth_token.token);

	return await resolve(event)

	// console.log('🍌')

	// if (event.url.pathname === '/') {
	// 	return new Response('🍌')
	// }

	// return await resolve(event);
}

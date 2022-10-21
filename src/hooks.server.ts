import { db } from '$lib/database'
import type { Handle } from '@sveltejs/kit'

// export const handle: Handle = async ({ event, resolve }) => resolve(event)

export const handle: Handle = async ({ event, resolve }) => {
	const session_id = event.cookies.get('session_id')

	if (!session_id) return await resolve(event)

	const authToken = await db.authToken.findUnique({
		where: { token: session_id },
		include: {
			user: {
				include: {
					role: true,
				},
			},
		},
	})

	if (!authToken) return await resolve(event)

	event.locals.user = {
		username: authToken.user.username,
		role: authToken.user.role.name,
	}

	return await resolve(event)

	// console.log('🍌')

	// if (event.url.pathname === '/') {
	// 	return new Response('🍌')
	// }

	// return await resolve(event);
}

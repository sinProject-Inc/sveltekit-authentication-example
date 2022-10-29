import { db } from '$lib/database'
import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async () => {
	try {
		await db.role.create({ data: { name: 'admin' } })
		await db.role.create({ data: { name: 'user' } })

		await db.appSetting.create({ data: { key: 'session_lifetime_sec', value: '600' } })
		await db.appSetting.create({ data: { key: 'pin_code_lifetime_sec', value: '300' } })

		return new Response('Success')
	} catch (error) {
		console.error(error)
		return new Response('Error')
	}
}

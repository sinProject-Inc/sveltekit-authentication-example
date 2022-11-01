import type { AuthPin, AuthToken, Role, User } from '@prisma/client'
import type { Cookies } from '@sveltejs/kit'
import { CookiesManager } from './cookies_manager'
import { Database, db } from './database'

export class Auth {
	public static async getSessionLifetimeSec(): Promise<number> {
		return await Database.getAppSettingInt('session_lifetime_sec')
	}

	public static async getPinCodeLifetimeSec(): Promise<number> {
		return await Database.getAppSettingInt('pin_code_lifetime_sec')
	}

	public static getLimit(lifetime_sec: number): Date {
		const limit = new Date()

		if (lifetime_sec == 0) console.warn('lifetime_sec is 0')

		limit.setSeconds(limit.getSeconds() - lifetime_sec)

		return limit
	}

	public static async createAuthToken(
		user_id: number,
		session_lifetime_sec: number
	): Promise<AuthToken> {
		const session_limit = await Auth.getLimit(session_lifetime_sec)

		const [auth_token] = await db.$transaction([
			db.authToken.create({
				data: { user_id, token: crypto.randomUUID() },
			}),
			db.authToken.deleteMany({
				where: { updated_at: { lt: session_limit } },
			}),
		])

		return auth_token
	}

	public static async updateAuthToken(auth_token_id: number): Promise<AuthToken> {
		const auth_token = await db.authToken.update({
			where: { id: auth_token_id },
			data: { updated_at: new Date() },
		})

		return auth_token
	}

	public static async findAuthPin(email: string, pin_code: string): Promise<AuthPin | null> {
		const pin_lifetime_sec = await Auth.getPinCodeLifetimeSec()
		const pin_limit = Auth.getLimit(pin_lifetime_sec)

		const auth_pin = await db.authPin.findFirst({
			where: {
				updated_at: { gte: pin_limit },
				pin_code,
				user: {
					email,
				},
			},
		})

		return auth_pin
	}

	public static async signIn(
		user_id: number,
		cookies: Cookies,
		pin_code_id?: number
	): Promise<void> {
		const session_lifetime_sec = await Auth.getSessionLifetimeSec()

		const auth_token = await Auth.createAuthToken(user_id, session_lifetime_sec)

		new CookiesManager(cookies).setSessionId(auth_token.token)

		if (pin_code_id) {
			await db.authPin.delete({ where: { id: pin_code_id } })
		}
	}

	public static async signOut(cookies: Cookies): Promise<void> {
		const cookiesManager = new CookiesManager(cookies)

		await db.authToken.delete({ where: { token: cookiesManager.session_id } })
		cookiesManager.deleteSessionId()
	}

	public static async accessValid(auth_token_id: number, cookies?: Cookies): Promise<void> {
		const auth_token = await Auth.updateAuthToken(auth_token_id)
		const session_lifetime_sec = await Auth.getSessionLifetimeSec()

		if (cookies) {
			new CookiesManager(cookies).setSessionId(auth_token.token, session_lifetime_sec)
		}
	}

	public static async findAuthToken(session_id: string): Promise<
		| (AuthToken & {
				user: User & {
					role: Role
				}
		  })
		| null
	> {
		const session_lifetime_sec = await Auth.getSessionLifetimeSec()
		const session_limit = Auth.getLimit(session_lifetime_sec)

		const auth_token = await db.authToken.findFirst({
			where: {
				updated_at: { gte: session_limit },
				token: session_id,
			},
			include: {
				user: {
					include: {
						role: true,
					},
				},
			},
		})

		return auth_token
	}
}

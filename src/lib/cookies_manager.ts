import type { Cookies } from "@sveltejs/kit";

export class CookiesManager {
	public constructor(private readonly _cookies: Cookies) {}

	public setSessionId(session_id: string): void {
		this._cookies.set('session_id', session_id, {
			path: '/',
			maxAge: 60 * 60 * 24 * 30,
			sameSite: 'lax',
			secure: true,
			// secure: process.env.NODE_ENV === 'production',
			httpOnly: true,
		})
	}
}

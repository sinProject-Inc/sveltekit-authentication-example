import { Auth } from '$lib/auth'
import { Database } from '$lib/database'
import { redirect, type RequestHandler } from '@sveltejs/kit'
import Client, { auth } from 'twitter-api-sdk'
// import { TwitterApi } from 'twitter-api-v2'

const authClient = new auth.OAuth2User({
	client_id: process.env.TWITTER_CLIENT_ID as string,
	client_secret: process.env.TWITTER_CLIENT_SECRET as string,
	callback: 'http://localhost:5173/signin_twitter',
	scopes: ['tweet.read', 'users.read', 'tweet.write'],
})

const client = new Client(authClient)
const STATE = 'my-state-sveltekit-authentication'

export const POST: RequestHandler = async () => {
	const authUrl = authClient.generateAuthURL({
		state: STATE,
		code_challenge_method: 's256',
	})

	throw redirect(302, authUrl)
}

export const GET: RequestHandler = async ({ cookies, url }) => {
	const state = url.searchParams.get('state')
	const code = url.searchParams.get('code') ?? ''

	if (state !== STATE) return new Response("State isn't matching", { status: 500 })

	try {
		const access_token = await authClient.requestAccessToken(code)

		console.log(access_token)

		const token = access_token.token.access_token

		console.log(token)

		if (!token) return new Response('No token', { status: 500 })

		const twitter_user = await client.users.findMyUser()
		const id = twitter_user.data?.id ?? ''
		const username = twitter_user.data?.username ?? ''
		const user_key = `twitter:${id}:${username}`

		console.log(user_key)

		// const twitterClient = new TwitterApi(token)
		// const credentials = await twitterClient.v1.verifyCredentials()
		// const email = credentials.email

		// console.log(email)

		const user = await Database.findUser(user_key, true)

		if (!user) return new Response('No user', { status: 500 })

		await Auth.signIn(user.id, cookies)

		throw redirect(302, '/')

	} catch (error) {
		throw redirect(302, '/login')
	}

	// return new Response('Success')
}

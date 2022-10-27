import prisma, { type User } from '@prisma/client'

enum Roles {
	admin = 'admin',
	user = 'user',
}

export const db = new prisma.PrismaClient()

export async function findUser(email: string, can_register = true): Promise<User | undefined> {
	const user = await db.user.findUnique({ where: { email } })

	if (user) return user
	if (!can_register) return undefined

	try {
		return await db.user.create({
			data: {
				role: { connect: { name: Roles.user } },
				email,
			},
		})
	} catch (error) {
		console.error(error)
		return undefined
	}
}

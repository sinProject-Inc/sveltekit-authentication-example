import prisma, { type User } from '@prisma/client'

enum Roles {
	admin = 'admin',
	user = 'user',
}

export const db = new prisma.PrismaClient()

export class Database {
	public static async findUser(email: string, can_register = true): Promise<User | undefined> {
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

	public static async getAppSettingInt(key: string): Promise<number> {
		const appSetting = await db.appSetting.findUnique({ where: { key } })
		const number_value = Number(appSetting?.value)
		const number_value_not_nan = Number.isNaN(number_value) ? 0 : number_value

		return number_value_not_nan
	}
}

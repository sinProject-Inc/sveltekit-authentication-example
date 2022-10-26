import * as nodemailer from 'nodemailer';

export class NodemailerManager {
	private readonly _transporter: nodemailer.Transporter

	public constructor() {
		this._transporter = nodemailer.createTransport({
			service: 'gmail',
			port: 465,
			secure: true,
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_PASS,
			},
		})
	}

	public async sendMail(to: string, subject: string, text: string): Promise<unknown> {
		const from = process.env.GMAIL_USER

		return await this._transporter.sendMail({ from, to, subject, text })
	}
}
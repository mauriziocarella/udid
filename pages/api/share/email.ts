import {NextApiRequest, NextApiResponse} from 'next';
import {SMTPClient} from 'emailjs';
import fs from 'fs/promises';
import path from 'path';
import ejs from 'ejs';

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
	const {udid, email, name, product} = req.body;

	const client = new SMTPClient({
		user: process.env.SMTP_USER,
		password: process.env.SMTP_PASSWORD,
		host: process.env.SMTP_HOST,
		ssl: true,
	});

	const text = await fs.readFile(path.join(process.cwd(), 'email/register.html'), 'utf8');
	const html = ejs.compile(text)({
		name,
		email,
		udid,
		product,
	});

	const message = await client.sendAsync({
		from: process.env.SMTP_USER,
		to: email,
		subject: 'Nuovo dispositivo Apple registrato',
		attachment: [{data: html, alternative: true}],
	});

	res.json(message);
}

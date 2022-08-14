import fs from 'fs/promises';
import path from 'path';
import type {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
	let text = await fs.readFile(path.join(process.cwd(), 'data/enroll.mobileconfig'), 'utf-8');

	const regex = new RegExp(`(<key>URL<\\/key>[\\n|\\s]+?<string>)(.*)(<\\/string>)`);

	const parsed = regex.exec(text);

	if (parsed && parsed[2]) {
		const url = new URL(parsed[2]);

		Object.entries(req.query).forEach(([key, value]) => {
			if (value) {
				url.searchParams.set(key, String(value));
			}
		});

		text = text.replace(regex, `$1${url.toString()}$3`);
	}

	res.setHeader('Content-type', 'application/x-apple-aspen-config; charset=utf-8');
	res.setHeader('Content-Disposition', 'attachment; filename="enroll.mobileconfig"');
	res.send(text);
}

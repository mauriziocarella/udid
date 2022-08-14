// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next';

const extract = (body: string, key: string) => {
	const regex = new RegExp(`<key>${key}<\\/key>[\\n|\\s]+?<string>(.*)<\\/string>`);
	const parsed = regex.exec(body);

	if (parsed && parsed[1]) {
		return parsed[1];
	}

	return '';
};

export default function handler(req: NextApiRequest, res: NextApiResponse<{}>) {
	const body = req.body;

	const product = extract(body, 'PRODUCT');
	const udid = extract(body, 'UDID');

	const protocol = req.headers['x-forwarded-proto'];
	const host = req.headers['host'];

	const query = new URLSearchParams({
		...req.query,
		product,
		udid,
	});

	if (product && udid) {
		return res.redirect(301, `${protocol}://${host}/submit?${query.toString()}`);
	}

	return res.redirect(`${protocol}://${host}/error`);
}

import type {NextPage} from 'next';
import {useRouter} from 'next/router';
import {Button, IconButton} from '../components/Button';
import {Input} from '../components/Input';
import {Card} from '../components/Card';
import {ClipboardCopyIcon, ShareIcon} from '@heroicons/react/outline';
import {useForm} from 'react-hook-form';
import {get} from '../helper/utils';
import axios from "axios"

const share = async () => {
	const text = `Product: ${product}\nUDID: ${udid}`;
	const data = {
		text,
	};

	if (navigator.canShare(data)) {
		await navigator.share(data);
	} else {
		await copy(text);
	}
};

const copy = async (text: string) => {
	if (window.isSecureContext) {
		await navigator.clipboard.writeText(text);
	}
};

const Submit: NextPage = () => {
	const {query} = useRouter();
	const {product, udid} = query;

	return (
		<div className="flex-grow flex items-center justify-center m-2">
			<div className="flex-1 text-center m-2">
				<div className="mb-4">
					<h2>I dettagli del tuo dispositivo Apple</h2>
				</div>
				<Card className="text-left max-w-2xl mx-auto my-6 space-y-2">
					<Input id="product" label="Dispositivo" value={product || ''} readOnly />

					<Input
						id="udid"
						label="UDID"
						value={udid || ''}
						readOnly
						ActionComponent={<IconButton icon={<ClipboardCopyIcon />} onClick={() => copy(String(udid))} />}
					/>

					<Form />
				</Card>
			</div>
		</div>
	);
};

const Form = () => {
	const {query} = useRouter();
	const {product, udid, email} = query;

	const {
		formState: {isDirty, isValid, errors},
		...form
	} = useForm({
		mode: 'all',
	});

	const submit = form.handleSubmit((values) => {
		axios.post(`/api/share/email`, {
			product,
			udid,
			email,
			...values,
		});
	});

	if (!email)
		return (
			<Button color="primary" icon={<ShareIcon />} onClick={share} block>
				SHARE
			</Button>
		);

	return (
		<>
			<Input
				label="Name"
				invalid={get(errors, 'name.message')}
				{...form.register('name', {required: 'Name is required'})}
				autoFocus
			/>

			<Button color="primary" icon={<ShareIcon />} onClick={submit} block disabled={!isDirty || !isValid}>
				SHARE
			</Button>
		</>
	);
};

export default Submit;

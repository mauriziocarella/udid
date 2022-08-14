import type {NextPage} from 'next';
import {Button} from '../components/Button';
import {ChevronRightIcon, DocumentDownloadIcon} from '@heroicons/react/outline';
import {Link} from '../components/Link';
import {Card} from '../components/Card';
import {useRouter} from 'next/router';
import {useMemo} from 'react';

const Home: NextPage = () => {
	const {query} = useRouter();
	const {email} = query;

	const href = useMemo(() => {
		if (email) {
			const url = new URL('/api/profile', window.location.href);

			url.searchParams.set('email', String(email));

			return url.toString();
		}

		return '/api/profile';
	}, [email]);

	return (
		<div className="flex-grow flex items-center justify-center m-2">
			<div className="flex-1 text-center m-2">
				<div className="mb-4">
					<h2>Ottieni l&apos;UDID del tuo dispositivo Apple</h2>
				</div>
				<Card className="max-w-2xl mx-auto my-6 space-y-2">
					<ul className="text-left pl-3 list-disc space-y-2 mb-6 leading-8">
						<li>
							<Link href={href}>Scarica il profilo</Link>
						</li>
						<li>
							<div>
								Installa il profilo andando su{' '}
								<span className="bg-gray-700 text-white rounded-lg px-2 py-1">Impostazioni</span>{' '}
								<ChevronRightIcon className="inline w-4" />{' '}
								<span className="bg-gray-700 text-white rounded-lg px-2 py-1">Generali</span>{' '}
								<ChevronRightIcon className="inline w-4" />{' '}
								<span className="bg-gray-700 text-white rounded-lg px-2 py-1">Profili</span>{' '}
							</div>
							<div className="italic text-sm">(ti verrà chiesto di inserire il codice di sblocco del telefono)</div>
						</li>
						<li>Nella pagina che verrà aperta potrai condividere le informazioni ottenute</li>
					</ul>

					<Link href={href}>
						<Button icon={<DocumentDownloadIcon />} color="primary">
							PROFILE
						</Button>
					</Link>
				</Card>
			</div>
		</div>
	);
};

export default Home;

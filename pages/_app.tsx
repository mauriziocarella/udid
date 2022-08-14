import '../styles/globals.scss';
import type {AppProps} from 'next/app';
import {useEffect} from 'react';

const App = ({Component, pageProps}: AppProps) => {
	useEffect(() => {
		const html = document.documentElement;
		html.classList.add('bg-gray-100');

		const listener = () => {
			html.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
		};

		listener();

		window.addEventListener('resize', listener);

		return () => {
			window.removeEventListener('resize', listener);
		};
	}, []);

	return (
		<div className="h-full min-h-screen flex flex-col">
			<Component {...pageProps} />
		</div>
	);
};

export default App;

const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

/** @type {import("tailwindcss").Config} */
module.exports = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			keyframes: {
				flash: {
					'0%': {opacity: 0.2},
					'50%': {opacity: 1},
					'100%': {opacity: 0.2},
				},
			},
			animation: {
				spin: 'spin 1s ease-in-out infinite',
				flash: 'flash 1s linear infinite',
			},
			colors: {
				'default': {
					DEFAULT: '#FFFFFF',
					50: '#FFFFFF',
					100: '#FFFFFF',
					200: '#FFFFFF',
					300: '#FFFFFF',
					400: '#FFFFFF',
					500: '#FFFFFF',
					600: colors.gray['100'],
					700: colors.gray['300'],
					800: colors.gray['500'],
					900: colors.gray['700'],
				},
				'default-content': colors.gray['600'],
				'primary': {
					DEFAULT: '#3B82F6',
					50: '#EBF2FE',
					100: '#D7E6FD',
					200: '#B0CDFB',
					300: '#89B4FA',
					400: '#629BF8',
					500: '#3B82F6',
					600: '#0B61EE',
					700: '#084BB8',
					800: '#063583',
					900: '#041F4D',
				},
				'primary-content': '#ffffff',
				'secondary': {
					DEFAULT: '#0D9488',
					50: '#67F2E5',
					100: '#54F0E2',
					200: '#2FEDDC',
					300: '#14DFCD',
					400: '#10BAAA',
					500: '#0D9488',
					600: '#086059',
					700: '#042D29',
					800: '#000000',
					900: '#000000',
				},
				'secondary-content': '#ffffff',
				'accent': {
					DEFAULT: '#A21CAF',
					50: '#E695EE',
					100: '#E283EB',
					200: '#DA60E6',
					300: '#D13DE0',
					400: '#C322D2',
					500: '#A21CAF',
					600: '#75147F',
					700: '#480D4E',
					800: '#1C051E',
					900: '#000000',
				},
				'accent-content': '#ffffff',
				'neutral': {
					DEFAULT: '#44403C',
					50: '#A29C96',
					100: '#98928B',
					200: '#857D75',
					300: '#6F6962',
					400: '#5A544F',
					500: '#44403C',
					600: '#262422',
					700: '#080807',
					800: '#000000',
					900: '#000000',
				},
				'neutral-content': '#ffffff',
				'info': {
					DEFAULT: '#45A4F2',
					50: '#F1F8FE',
					100: '#DEEFFD',
					200: '#B7DCFA',
					300: '#91C9F7',
					400: '#6BB7F5',
					500: '#45A4F2',
					600: '#118AEE',
					700: '#0D6CBA',
					800: '#094D85',
					900: '#062F51',
				},
				'info-content': '#ffffff',
				'success': {
					DEFAULT: '#10B981',
					50: '#8CF5D2',
					100: '#79F3CB',
					200: '#53F0BC',
					300: '#2EEDAE',
					400: '#13DF9B',
					500: '#10B981',
					600: '#0C855D',
					700: '#075239',
					800: '#031E15',
					900: '#000000',
				},
				'success-content': '#ffffff',
				'warning': {
					DEFAULT: '#FCA431',
					50: '#FFF4E6',
					100: '#FEEBD2',
					200: '#FED9AA',
					300: '#FDC881',
					400: '#FDB659',
					500: '#FCA431',
					600: '#F18A04',
					700: '#BA6B03',
					800: '#834B02',
					900: '#4C2B01',
				},
				'warning-content': '#ffffff',
				'error': {
					DEFAULT: '#EF3C25',
					50: '#FCD5D0',
					100: '#FAC4BD',
					200: '#F7A297',
					300: '#F58071',
					400: '#F25E4B',
					500: '#EF3C25',
					600: '#CD250F',
					700: '#991B0B',
					800: '#641207',
					900: '#300904',
				},
				'error-content': '#ffffff',

				'muted': colors.slate['500'],
			},
			fontSize: {
				'2xs': '0.5rem',
			},
			aspectRatio: {
				auto: 'auto',
				square: '1 / 1',
				video: '16 / 9',
			},
			maxWidth: {
				screen: '100vw',
			},
			maxHeight: {
				screen: '100vh',
			},
			gridTemplateColumns: {
				16: 'repeat(16, minmax(0, 1fr))',
			},
		},
	},
	plugins: [
		plugin(function ({addVariant}) {
			addVariant('not-last', '&:not(:last-child)');
		}),
	],
};

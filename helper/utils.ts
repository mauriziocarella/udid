import React from 'react';

export const formatNumber = (num = 0, digits = 1) => {
	const lookup = [
		{value: 1, symbol: ''},
		{value: 1e3, symbol: 'k'},
		{value: 1e6, symbol: 'M'},
		{value: 1e9, symbol: 'G'},
		{value: 1e12, symbol: 'T'},
		{value: 1e15, symbol: 'P'},
		{value: 1e18, symbol: 'E'},
	];
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	const item = lookup
		.slice()
		.reverse()
		.find(function (item) {
			return num >= item.value;
		});
	return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : '0';
};

export const formatNumberWithCommas = (num = 0, decimals = 2) => {
	return num
		.toFixed(decimals)
		.toString()
		.replace('.', ',')
		.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatSize = (bytes: number, si = false, dp = 1) => {
	const thresh = si ? 1000 : 1024;

	if (Math.abs(bytes) < thresh) {
		return bytes + ' B';
	}

	const units = si
		? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
		: ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
	let u = -1;
	const r = 10 ** dp;

	do {
		bytes /= thresh;
		++u;
	} while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

	return bytes.toFixed(dp) + ' ' + units[u];
};

export const flatten = (obj: Record<string, any>) => {
	const result: Record<string, any> = {};

	for (const i in obj) {
		// We check the type of the i using
		// typeof() function and recursively
		// call the function again
		if (typeof obj[i] === 'object' && !Array.isArray(obj[i])) {
			const temp = flatten(obj[i]);
			for (const j in temp) {
				// Store temp in result
				result[i + '.' + j] = temp[j];
			}
		} else {
			result[i] = obj[i];
		}
	}
	return result;
};

export const get = (obj: Record<string, any>, path: string, defaultValue: any = undefined) => {
	const travel = (regexp: RegExp) =>
		String.prototype.split
			.call(path, regexp)
			.filter(Boolean)
			.reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
	const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
	return result === undefined || result === obj ? defaultValue : result;
};

export const uuid = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

export function mergeRefs<T = any>(refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>): React.RefCallback<T> {
	return (value) => {
		refs.forEach((ref) => {
			if (typeof ref === 'function') {
				ref(value);
			} else if (ref != null) {
				(ref as React.MutableRefObject<T | null>).current = value;
			}
		});
	};
}

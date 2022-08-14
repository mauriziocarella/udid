import {useState} from 'react';

type useArrayStateActions<T> = {
	set(data: Array<T>): void;
	add(item: T): void;
	update(item: T): void;
	remove(item: T): void;
}

function useArrayState<T extends {id: any}>(defaultValue: Array<T>): [Array<T>, useArrayStateActions<T>] {
	const [data, setData] = useState<Array<T>>(defaultValue);

	const actions = {
		set(data: Array<T>) {
			setData(data);
		},
		add(item: T) {
			setData((data) => data.concat([item]));
		},
		update(item: T) {
			setData((data) => data.map((d) => {
				if (d.id === item.id) {
					return item;
				}
				return d;
			}));
		},
		remove(item: T) {
			setData((data) => data.filter((d) => d.id !== item.id));
		},
	};

	return [
		data,
		actions,
	];
}

export {
	useArrayState,
};
export default useArrayState;

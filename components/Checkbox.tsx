import React, {forwardRef} from 'react';
import classNames from 'classnames';
import {uuid} from '../helper/utils';

type CheckboxProps = React.HTMLProps<HTMLInputElement>;
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({className, label, id = uuid(), ...props}, ref) => {
	return (
		<>
			<input
				ref={ref}
				id={id}
				type="checkbox"
				className={classNames('appearance-none w-4 h-4 align-middle bg-white border border-gray-300 rounded cursor-pointer transition-all checked:group-hover:border-white', className)}
				{...props}
			/>
			{label && <label htmlFor={id} className="ml-1 align-middle text-sm font-medium text-gray-700 select-none">{label}</label>}
		</>
	);
});

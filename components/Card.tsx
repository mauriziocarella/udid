import classNames from 'classnames';
import React, {HTMLProps} from 'react';

export type CardProps = React.HTMLProps<HTMLDivElement>;
export const Card = ({className, ...props}: CardProps) => {
	return (
		<div className={classNames('bg-white border border-gray-300 shadow-md rounded-lg p-6', className)} {...props} />
	);
};

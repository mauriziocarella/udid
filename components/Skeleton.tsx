import React from 'react';
import classNames from 'classnames';

export const Skeleton: React.VFC<React.HTMLProps<HTMLDivElement>> = ({className, ...props}) => {
	return (
		<div className={classNames('animate-pulse bg-slate-200 rounded-full min-h-6', className)} {...props}/>
	);
};

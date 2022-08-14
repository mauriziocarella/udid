import classNames from 'classnames';
import React, {ComponentProps} from 'react';

export type LinkProps = ComponentProps<'a'>;
export const Link = ({className, ...props}: LinkProps) => {
	return <a className={classNames('transition-all duration-100 hover:text-primary', className)} {...props} />;
};

export type LinkButtonProps = ComponentProps<'a'> & {
	label?: string;
	icon?: React.ReactElement;
};
export const LinkButton = ({className, label, icon, children, ...props}: LinkButtonProps) => {
	return (
		<a
			{...props}
			className={classNames(
				'inline-flex items-center text-primary text-sm font-medium space-x-1 px-2 py-2 transition-all rounded hover:bg-primary/20 active:bg-primary/30',
				className,
			)}>
			{label && <div>{label}</div>}
			{children}
			{icon &&
				React.cloneElement(icon, {
					className: 'w-4 h-4',
				})}
		</a>
	);
};

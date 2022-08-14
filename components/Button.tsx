import React, {forwardRef, useEffect, useMemo, useState} from 'react';
import classNames from 'classnames';
import {Tooltip, TooltipProps} from './Tooltip';
import {LoadingIcon} from './Loading';

export type ButtonHandler = {
	loading(loading: ButtonProps['loading']): void;
};

export type ButtonProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'onClick'> & {
	icon?: React.ReactElement | null;
	label?: React.ReactElement | string | null;
	active?: boolean;
	color?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'transparent';
	size?: 'sm' | 'md' | 'lg';
	square?: boolean;
	outline?: boolean;
	tooltip?: TooltipProps['text'];
	loading?: boolean;
	block?: boolean;
	onClick?(e: React.MouseEvent, button: ButtonHandler): void;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			icon,
			label,
			className,
			children,
			color = 'default',
			size = 'md',
			active,
			square,
			outline,
			block,
			loading: _loading,
			...props
		},
		ref,
	) => {
		const [loading, setLoading] = useState(_loading);
		const colorClasses = useMemo(() => {
			if (outline) {
				switch (color) {
					case 'primary':
						return [
							'border text-primary border-primary hover:bg-primary-600 hover:text-primary-content focus:bg-primary-600 focus:text-primary-content shadow-sm',
						];
					case 'success':
						return [
							'border text-success border-success hover:bg-success-600 hover:text-success-content focus:bg-success-600 focus:text-success-content shadow-sm',
						];
					case 'error':
						return [
							'border text-error border-error hover:bg-error-600 hover:text-error-content focus:bg-error-600 focus:text-error-content shadow-sm',
						];
					case 'transparent':
						return ['border border-transparent hover:border-gray-200'];
				}
			}
			switch (color) {
				case 'default':
					return [
						'font-medium border text-default-content bg-default border-default-700 shadow-sm hover:bg-default-600 active:bg-default-700 focus-visible:bg-default-600',
					];
				case 'primary':
					return [
						'font-medium border text-primary-content bg-primary border-primary shadow-sm hover:bg-primary-600 hover:border-primary-600 active:bg-primary-700 active:border-primary-700 focus-visible:bg-primary-600 focus-visible:border-primary-600',
					];
				case 'secondary':
					return [
						'font-medium border text-secondary-content bg-secondary border-secondary shadow-sm hover:bg-secondary-600 hover:border-secondary-600 active:bg-secondary-700 active:border-secondary-700 focus-visible:bg-secondary-600 focus-visible:border-secondary-600',
					];
				case 'success':
					return [
						'font-medium border text-success-content bg-success border-success shadow-sm hover:bg-success-600 hover:border-success-600 active:bg-success-700 active:border-success-700 focus-visible:bg-success-600 focus-visible:border-success-600',
					];
				case 'error':
					return [
						'font-medium border text-error-content bg-error border-error shadow-sm hover:bg-error-600 hover:border-error-600 active:bg-error-700 active:border-error-700 focus-visible:bg-error-600 focus-visible:border-error-600',
					];
				case 'transparent':
					return [
						'hover:bg-black/20 hover:shadow-sm active:bg-black/30 focus-visible:bg-black/20 focus-visible:shadow-sm',
					];
			}
		}, [color, outline]);
		const sizeClasses = useMemo(() => {
			switch (size) {
				case 'sm':
					return ['sm:text-sm min-h-[1.5rem] px-1 py-0.5', square ? 'min-w-[1.5rem]' : ''];

				default:
				case 'md':
					return ['sm:text-sm min-h-[2.5rem] py-1', square ? 'min-w-[2.5rem] px-0' : 'min-w-[5rem] px-4'];

				case 'lg':
					return ['sm:text-sm min-h-[3.5rem]', square ? 'min-w-[3.5rem]' : ''];
			}
		}, [size, square]);

		const disabled = props.disabled || loading;

		const onClick = (e: React.MouseEvent) => {
			if (typeof props.onClick === 'function')
				props.onClick(e, {
					loading: setLoading,
				});
		};

		useEffect(() => {
			setLoading(_loading);
		}, [_loading]);

		return (
			<Tooltip className={classNames(block && 'flex-grow')} text={props.tooltip}>
				<button
					ref={ref}
					type="button"
					className={classNames(
						'inline-flex items-center justify-center rounded-md text-base outline-none transition-all duration-200',
						colorClasses,
						sizeClasses,
						disabled || active === false ? 'opacity-60' : '',
						disabled && 'pointer-events-none',
						square && 'aspect-square p-0',
						block && 'w-full',
						className,
					)}
					{...props}
					onClick={onClick}
					disabled={disabled}>
					{loading ? (
						<>
							<LoadingIcon size={20} className={classNames(label && 'mr-2')} color={outline ? 'primary' : 'white'} />
						</>
					) : (
						<>
							{icon && (
								<span className={classNames((label || children) && 'mr-2')}>
									{React.cloneElement(icon, {
										className: classNames('h-5 w-5', icon.props.className),
									})}
								</span>
							)}
						</>
					)}
					{label}
					{children}
				</button>
			</Tooltip>
		);
	},
);

export type IconButtonProps = Omit<ButtonProps, 'square'> & {
	rounded?: boolean;
};
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
	({className, rounded = false, ...props}, ref) => {
		return (
			<Button
				ref={ref}
				className={classNames('flex items-center justify-center', rounded && 'rounded-full', className)}
				square={true}
				{...props}
			/>
		);
	},
);

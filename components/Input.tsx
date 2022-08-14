import React, {forwardRef, useEffect, useMemo, useRef, useState} from 'react';
import classNames from 'classnames';
import {EyeIcon, EyeOffIcon, XIcon} from '@heroicons/react/outline';
import {mergeRefs, uuid} from '../helper/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	invalid?: boolean | string;
	isClearable?: boolean;
	icon?: React.ReactElement;
	LeftComponent?: React.ReactNode;
	RightComponent?: React.ReactNode;
	ActionComponent?: React.ReactNode;
	inputProps?: React.ComponentProps<'input'>;
};
export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			label,
			id = uuid(),
			className,
			isClearable,
			LeftComponent: LeftComponent_,
			RightComponent: RightComponent_,
			ActionComponent,
			icon,
			...props
		},
		ref,
	) => {
		const innerRef = useRef<HTMLInputElement>(null);
		const [value, setValue] = useState<React.HTMLProps<HTMLInputElement>['value']>('');
		const [type, setType] = useState(props.type || 'text');

		useEffect(() => {
			setType(props.type || 'text');
		}, [props.type]);

		const clear = () => {
			Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set?.call(innerRef.current, '');

			innerRef.current?.dispatchEvent(new Event('change', {bubbles: true}));
		};

		useEffect(() => {
			setValue(innerRef.current?.value);
		}, [innerRef.current]);

		const LeftComponent = useMemo(() => {
			if (LeftComponent_) return LeftComponent_;

			return null;
		}, [LeftComponent_]);
		const RightComponent = useMemo(() => {
			if (icon)
				return React.cloneElement(icon, {
					className: 'w-5 h-5',
					onClick: () => innerRef.current?.focus(),
				});
			if (RightComponent_) return RightComponent_;

			return null;
		}, [type, props.type, RightComponent_]);

		return (
			<div className={classNames('', className)}>
				{label && (
					<label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
						{label}
					</label>
				)}

				<div className="flex items-center space-x-2">
					<div
						className={classNames(
							'group relative flex items-stretch min-w-[200px] min-h-[2.5rem] bg-white w-full shadow-sm sm:text-sm border border-gray-300 rounded-md overflow-hidden transition-all outline-none focus-within:ring-1 focus-within:ring-primary focus-within:border-primary',
							props.disabled && 'bg-gray-100',
							props.readOnly && 'bg-gray-200',
							props.invalid && 'border-error-500 focus-within:border-error-500 focus-within:ring-error-500',
						)}>
						{LeftComponent && (
							<div className="flex items-center text-gray-300 transition-colors sm:text-sm group-focus-within:text-gray-500 px-2 -mr-2">
								{LeftComponent}
							</div>
						)}
						<input
							ref={mergeRefs([innerRef, ref])}
							id={id}
							autoComplete="off"
							{...props}
							{...props.inputProps}
							className={classNames(
								'block flex-grow focus-visible:ring-0 focus-visible:shadow-none focus-visible:outline-none bg-transparent px-2',
								props.disabled && 'text-gray-600 pointer-events-none',
								props.inputProps?.className,
							)}
							type={type}
							onChange={(e) => {
								setValue(e.currentTarget.value);

								if (typeof props.onChange === 'function') props.onChange(e);
							}}
						/>
						{isClearable && (
							<div className="flex items-center text-gray-300 transition-colors sm:text-sm group-focus-within:text-gray-500">
								<div
									className={classNames('cursor-pointer transition-all hover:text-gray-600 p-2', !value && 'opacity-0')}
									onClick={clear}>
									<XIcon className="w-4 h-4" />
								</div>
							</div>
						)}
						{(RightComponent || props.type === 'password') && (
							<div className="flex items-center text-gray-300 space-x-2 transition-colors sm:text-sm group-focus-within:text-gray-500 px-2">
								{RightComponent}

								{props.type === 'password' && (
									<>
										{type === 'password' ? (
											<EyeIcon className="w-5 h-5 cursor-pointer" onClick={() => setType('text')} />
										) : (
											<EyeOffIcon className="w-5 h-5 cursor-pointer" onClick={() => setType('password')} />
										)}
									</>
								)}
							</div>
						)}
					</div>
					{ActionComponent}
				</div>

				{props.invalid && typeof props.invalid === 'string' && (
					<div className="text-xs text-error mt-0.5 font-medium">{props.invalid}</div>
				)}
			</div>
		);
	},
);

export type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label?: string;
};
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
	({label, id = uuid(), className, ...props}, ref) => {
		return (
			<div className={className}>
				{label && (
					<label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
						{label}
					</label>
				)}

				<textarea
					ref={ref}
					id={id}
					className={classNames(
						'block min-h-[2.5rem] min-w-[200px] w-full sm:text-sm p-2 border border-gray-300 shadow-sm rounded-md transition-all outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary',
						className,
					)}
					{...props}
				/>
			</div>
		);
	},
);

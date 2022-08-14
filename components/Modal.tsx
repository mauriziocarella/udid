import {Dialog, Transition} from '@headlessui/react';
import React, {Fragment} from 'react';
import {Button, ButtonProps} from './Button';
import classNames from 'classnames';
import {LoadingIcon} from './Loading';
import {DialogContainerRef} from './Dialog';

export type ModalProps = {
    title?: string;
    description?: string;
    isOpen: boolean;
    onClose(): void;
    buttons?: Array<ButtonProps & {side?: 'left' | 'right' | 'center'}> | false;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
    loading?: boolean;
    static?: boolean;
    showCloseButton?: boolean;
	children?: React.ReactNode;
}
export const Modal = (props: ModalProps) => {
	const {
		isOpen,
		children,
		className,
		size = 'xl',
		loading = false,
		title,
		description,
		showCloseButton = true,
	} = props;

	const onClose = () => {
		if (!loading) {
			if (typeof props.onClose === 'function') {
				if (!props.static) {
					if (!DialogContainerRef.current?.isOpen()) {
						props.onClose();
					}
				}
			}
		}
	};

	const hasHeader = Boolean(title);
	const hasFooter = Boolean(props.buttons);

	return (
		<Transition
			show={isOpen}
			as={Fragment}
		>
			<Dialog
				onClose={onClose}
				className="relative z-10"
				static
			>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-200"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
				</Transition.Child>

				<Transition.Child
					as={Fragment}
					enter="ease-out duration-200"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<div className="fixed inset-0 flex justify-center items-start overflow-auto p-4 pt-8">
						<Dialog.Panel className={classNames('relative inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all sm:w-full', {
							'max-w-sm': size === 'sm',
							'max-w-md': size === 'md',
							'max-w-lg': size === 'lg',
							'max-w-xl': size === 'xl',
							'max-w-2xl': size === '2xl',
							'max-w-3xl': size === '3xl',
							'max-w-4xl': size === '4xl',
							'max-w-5xl': size === '5xl',
							'max-w-6xl': size === '6xl',
							'max-w-7xl': size === '7xl',
							'max-w-full': size === 'full',
						})}>
							{loading && (
								<div className="absolute inset-0 z-50 bg-white/80 rounded-lg flex items-center justify-center">
									<LoadingIcon/>
								</div>
							)}
							{hasHeader && (
								<div className="bg-gray-50 rounded-t-lg px-4 py-5 sm:px-6 border-b sm:flex">
									<div>
										<Dialog.Title className="text-lg leading-6 font-medium text-gray-600">{title}</Dialog.Title>
										{description && (
											<Dialog.Description className="text-md text-gray-400">{description}</Dialog.Description>
										)}
									</div>
								</div>
							)}
							<div className={classNames('bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4', !hasHeader && 'rounded-t-lg', !hasFooter && 'rounded-b-lg', className)}>
								{children}
							</div>
							{hasFooter && (
								<div className="bg-gray-50 rounded-b-lg px-4 py-3 sm:px-6 border-t">
									{props.buttons && (
										<div className="flex flex-col sm:flex-row space-y-2 sm:space-x-2 sm:space-y-0">
											{props.buttons?.filter((b) => b.side === 'left').map((button, index) => (
												<Button
													key={index}
													{...button}
												/>
											))}
											<div className="sm:flex-grow flex flex-col justify-center items-center sm:flex-row space-y-2 sm:space-x-2 sm:space-y-0">
												{props.buttons?.filter((b) => b.side === 'center').map((button, index) => (
													<Button
														key={index}
														{...button}
													/>
												))}
											</div>
											{showCloseButton && (
												<Button
													label="Close"
													className="ml-2"
													onClick={onClose}
												/>
											)}
											{props.buttons?.filter((b) => !b.side || b.side === 'right').map((button, index) => (
												<Button
													key={index}
													{...button}
												/>
											))}
										</div>
									)}
								</div>
							)}
						</Dialog.Panel>
					</div>
				</Transition.Child>
			</Dialog>
		</Transition>
	);
};

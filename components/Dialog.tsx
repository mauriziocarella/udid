import {createRef, forwardRef, useImperativeHandle, useMemo, useState} from 'react';
import {ExclamationIcon} from '@heroicons/react/outline';
import {Modal, ModalProps} from './Modal';

type DialogCommonProps = {
	message?: string;
	onClose?(): void;
}
type DialogAlertProps = DialogCommonProps & {
	type: 'alert',
}
type DialogConfirmProps = DialogCommonProps & {
	type: 'confirm',
	onSubmit?(): void;
}
type DialogTypes = DialogAlertProps | DialogConfirmProps;
type DialogType = DialogTypes & {
	open: boolean;
};
type DialogProp = Omit<DialogType, 'open'>;

type DialogContainerHandle = {
	set(dialog: DialogProp): void;
	isOpen(): boolean;
};

export const DialogContainerRef = createRef<DialogContainerHandle>();

export const DialogContainer = forwardRef<DialogContainerHandle>((props, ref) => {
	const [dialog, setDialog] = useState<DialogType>();

	const onClose = () => {
		if (typeof dialog?.onClose === 'function') dialog.onClose();

		close();
	};

	const close = () => {
		setDialog((dialog) => {
			if (dialog) return {
				...dialog,
				open: false,
			};

			return dialog;
		});
	};

	useImperativeHandle(ref, () => ({
		set: (dialog: DialogProp) => {
			setDialog({
				...dialog,
				open: true,
			});
		},
		isOpen: () => dialog?.open || false,
	}));

	const buttons = useMemo<ModalProps['buttons']>(() => {
		switch (dialog?.type) {
			case 'alert': return [
				{
					label: 'OK',
					color: 'error',
					outline: true,
					side: 'center',
				},
			];

			case 'confirm': return [
				{
					label: 'YES',
					color: 'success',
					outline: true,
					onClick: () => {
						if (typeof dialog.onSubmit === 'function') dialog.onSubmit();

						close();
					},
					side: 'center',
				},
				{
					label: 'NO',
					color: 'error',
					outline: true,
					onClick: onClose,
					side: 'center',
				}
			];
		}

		return [];
	}, [dialog]);

	return (
		<Modal
			isOpen={dialog?.open || false}
			onClose={onClose}
			static={true}
			size="sm"
			className="text-center"
			buttons={buttons}
			showCloseButton={false}
		>
			{dialog && (
				<>
					{dialog.type === 'alert' && (
						<>
							<ExclamationIcon className="w-16 h-16 bg-warning/20 text-warning rounded-full p-2 inline"/>

							<h3 className="leading-6 text-lg font-medium my-6">{dialog.message}</h3>

							<div className="flex-row space-x-2">
							</div>
						</>
					)}
					{dialog.type === 'confirm' && (
						<>
							<ExclamationIcon className="w-16 h-16 bg-warning/20 text-warning rounded-full p-2 inline"/>

							<h3 className="leading-6 text-lg font-medium my-6">{dialog.message}</h3>

							<div className="flex-row space-x-2">
							</div>
						</>
					)}
				</>
			)}
		</Modal>
	);
});

export const Alert = (props: Omit<DialogAlertProps, 'type'>) => {
	const dialog = props;

	DialogContainerRef.current?.set({
		...dialog,
		type: 'alert',
	});
};

export const Confirm = (props: Omit<DialogConfirmProps, 'type'>) => {
	return new Promise((resolve, reject) => {
		const dialog = props;

		dialog.onSubmit = () => resolve(true);
		dialog.onClose = reject;

		DialogContainerRef.current?.set({
			...dialog,
			type: 'confirm',
		});
	});
};

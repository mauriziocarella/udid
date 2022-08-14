import React, {useEffect, useMemo, useState} from 'react';
import {ExclamationIcon, XIcon} from '@heroicons/react/outline';
import {Collapse} from './Collapse';
import {IconButton} from './Button';

type ResponseFeedbackProps = React.HTMLProps<HTMLDivElement> & {
	feedback: any;
}
export const ResponseFeedback = ({feedback, className}: ResponseFeedbackProps) => {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		setOpen(Boolean(feedback));
	}, [feedback]);

	const message = useMemo<string>(() => {
		return feedback?.data?.message || '';
	}, [feedback]);

	return (
		<Collapse open={open} className={className}>
			<div className="border-2 border-error p-4 rounded-lg shadow flex items-center relative">
				<div className="bg-error/10 p-2 rounded-full text-error mr-4">
					<ExclamationIcon className="w-8 h-8" />
				</div>

				<div>
					<div className="leading-4 font-semibold text-error">An error occurred</div>
					<div className="text-sm tracking-wide text-gray-400 mt-1">{message}</div>
				</div>

				<div className="absolute top-0 right-0">
					<IconButton
						icon={<XIcon />}
						color="transparent"
						onClick={() => setOpen(false)}
						className="m-2 text-gray-400 hover:text-gray-600"
						tabIndex={-1}
					/>
				</div>
			</div>
		</Collapse>
	);
};

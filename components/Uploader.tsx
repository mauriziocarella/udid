import {ChangeEvent, DragEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {CloudUploadIcon, TrashIcon} from '@heroicons/react/outline';
import {Button} from './Button';
import {formatSize} from '../helper/utils';
import classNames from 'classnames';
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

type UploaderProps = {
    onChange?(files: Array<File>): void;
    target: AxiosRequestConfig,
}
export type UploaderHandle = {
    reset(): void;
    upload(): Promise<AxiosResponse>;
}

export const Uploader = forwardRef<UploaderHandle, UploaderProps>((props, ref) => {
	const [files, setFiles] = useState<Array<File>>([]);
	const [dragOver, setDragOver] = useState(false);
	const input = useRef<HTMLInputElement>(null);

	const onDrop = (e: DragEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();

		const files = e.dataTransfer.files;
		if (files.length > 0) {
			setFiles(Array.from(files));
		}

		setDragOver(false);
	};
	const onDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'copy';

		setDragOver(true);
	};
	const onDragLeave = () => {
		setDragOver(false);
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.currentTarget.files || [];
		if (files.length > 0) {
			setFiles(Array.from(files));
		}
		e.currentTarget.value = '';
	};

	const onClick = () => {
		if (files.length === 0) {
			if (input.current) {
				input.current.click();
			}
		}
	};

	const fileRemove = (file: File) => {
		setFiles((files) => files.filter((f) => f !== file));
	};

	const reset = () => {
		setFiles([]);
		if (input.current) {
			input.current.value = '';
		}
	};

	const upload = async () => {
		const data = new FormData();

		files.forEach((file) => {
			data.append('files', file);
		});

		if (props.target.data) {
			Object.entries(props.target.data).forEach(([k, v]) => {
				data.append(k, v as Blob);
			});
		}

		return axios({
			method: 'POST',
			...props.target,
			data,
			headers: {
				'Content-Type': 'multipart/form-data',
				...props.target.headers,
			}
		});
	};

	useEffect(() => {
		return () => {
			reset();
		};
	}, []);

	useEffect(() => {
		if (typeof props.onChange === 'function') props.onChange(files);
	}, [files]);

	useImperativeHandle(ref, () => ({
		reset,
		upload,
	}));

	return (
		<>
			<div
				className={classNames('mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md transition-all duration-200', {
					'bg-gray-100': dragOver
				})}
				onDrop={onDrop}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onClick={onClick}
			>
				<input ref={input} id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onChange} multiple/>

				{files.length === 0 ? (
					<div className="space-y-4 text-center">
						<CloudUploadIcon className="mx-auto h-12 w-12 text-gray-400"/>

						<div className="text-sm text-gray-600 text-center">
							<div className="flex">
								<span className="cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">Upload a file</span>
								<span className="pl-1">or drag and drop</span>
							</div>
						</div>
						<p className="text-xs text-gray-500">XLSX up to 10MB</p>
					</div>
				) : (
					<div className="grid grid-cols-2 space-x-4 w-full">
						{files.map((file, index) => (
							<div className="border border-gray-300 text-gray-500 space-y-2 text-center rounded-lg p-4" key={index}>
								<div className="text-sm">
									{file.name}
								</div>
								<div className="text-2xs">
									{formatSize(file.size)}
								</div>
								<Button
									label="Delete"
									icon={<TrashIcon className="h-5 w-5"/>}
									color="error"
									onClick={() => fileRemove(file)}
									className="w-full"
								/>
							</div>
						))}
					</div>
				)}
			</div>
		</>
	);
});

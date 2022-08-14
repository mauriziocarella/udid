import React, {useMemo} from 'react';
import classNames from 'classnames';

type LoadingIconProps = React.HTMLProps<HTMLDivElement> & {
    size?: number;
    stroke?: number;
    color?: 'primary' | 'white'
};
export const LoadingIcon: React.VFC<LoadingIconProps> = ({className, size = 28, stroke = 3, ...props}) => {
	const color = useMemo(() => {
		switch(props.color) {
			case 'primary': return 'border-primary/40 border-t-primary';
			case 'white': return 'border-white/40 border-t-white';
		}
		return 'border-t-primary';
	}, [props.color]);

	return (
		<div
			className={classNames('rounded-full border animate-spin', color, className)}
			style={{width: size, height: size, borderWidth: stroke}}
			{...props}
		/>
	);
};


export type LoadingViewProps = {
    fixed?: boolean;
    color?: 'primary' | 'secondary' | 'white';
}
export const LoadingView = ({fixed, ...props}: LoadingViewProps) => {
	const color = useMemo(() => {
		switch (props.color) {
			default:
			case 'primary':
				return 'border-primary/30 border-t-primary';
			case 'secondary':
				return 'border-secondary/30 border-t-secondary';
			case 'white':
				return 'border-white/30 border-t-white';
		}
	}, [props.color]);

	return (
		<div className={classNames('flex flex-grow items-center justify-center', {
			'fixed inset-0 bg-white/70': fixed,
		})}>
			<div className={classNames('block w-10 h-10 border-4 rounded-full animate-spin-bounce', color)}/>
		</div>
	);
};

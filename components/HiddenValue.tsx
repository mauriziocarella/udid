import React, {createContext, forwardRef, useContext, useEffect, useState} from 'react';
import {Button, ButtonProps, IconButton, IconButtonProps} from './Button';
import {EyeIcon, EyeOffIcon} from '@heroicons/react/outline';
import {useDidMountEffect} from '../helper/hooks';

type HiddenValueContextType = {
    visible: boolean;
    toggle?(): void;
}
export const HiddenValueContext = createContext<HiddenValueContextType>({visible: false});

export const HiddenValueProvider = ({children}: {children: React.ReactNode}) => {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		try {
			if (localStorage.getItem('hidden-values')) {
				setVisible(localStorage.getItem('hidden-values') === 'false');
			}
		}
		catch (e) {
			console.error(e);
		}
	}, []);

	const toggle = () => {
		setVisible((visible) => !visible);
	};

	useDidMountEffect(() => {
		try {
			localStorage.setItem('hidden-values', visible ? 'false' : 'true');
		}
		catch (e) {
			console.error(e);
		}
	}, [visible]);

	return (
		<HiddenValueContext.Provider
			value={{ visible, toggle }}
		>
			{children}
		</HiddenValueContext.Provider>
	);
};

type HiddenValueProps = React.HTMLProps<HTMLSpanElement> & {
	placeholder?: string;
}
export const HiddenValue = forwardRef<HTMLElement, HiddenValueProps>(({placeholder = '', children, ...props}, ref) => {
	const {visible} = useContext(HiddenValueContext);

	return (
		<span ref={ref} {...props}>{visible ? children : placeholder}</span>
	);
});

type HiddenTextProps = React.HTMLProps<HTMLSpanElement> & {
	threshold?: number;
}
export const HiddenText = forwardRef<HTMLElement, HiddenTextProps>(({threshold = 35, children: _children}, ref) => {
	const {visible} = useContext(HiddenValueContext);

	let children = _children;
	if (typeof children === 'string') children = children.length > threshold && !visible ? `${children.substring(0, threshold).trim()}...` : children;
	else children = visible ? children : null;

	if (!children) return null;

	return <span ref={ref}>{children}</span>;
});

export const HiddenValueToggleIcon: React.VFC<IconButtonProps> = ({...props}) => {
	const {visible, toggle} = useContext(HiddenValueContext);

	return (
		<IconButton
			{...props}
			icon={visible ? <EyeOffIcon/> : <EyeIcon/>}
			color="transparent"
			onClick={toggle}
		/>
	);
};

export const HiddenValueToggle = ({...props}: ButtonProps) => {
	const {visible, toggle} = useContext(HiddenValueContext);

	return (
		<Button
			{...props}
			icon={visible ? <EyeOffIcon/> : <EyeIcon/>}
			color="transparent"
			label={visible ? 'Hide values' : 'Show values'}
			onClick={toggle}
		/>
	);
};

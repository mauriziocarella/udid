import React, {useEffect, useRef, useState} from 'react';

const outerHeight = (el: HTMLElement | null) => {
	if (!el) return 0;

	const styles = window.getComputedStyle(el);
	return el.getBoundingClientRect().height + parseInt(styles.marginTop) + parseInt(styles.marginBottom);
};

type CollapseProps = React.HTMLProps<HTMLDivElement> & {
	open: boolean;
};
export const Collapse = ({open, ...props}: CollapseProps) => {
	const [height, setHeight] = useState(0);
	const el = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open || !el.current) return undefined;

		const resizeObserver = new ResizeObserver(() => {
			setHeight(outerHeight(el.current));
		});

		if (el.current) resizeObserver.observe(el.current);

		return () => {
			resizeObserver.disconnect();
		};
	}, [open]);

	useEffect(() => {
		setHeight(open ? outerHeight(el.current) : 0);
	}, [open]);

	return (
		<div className="overflow-hidden transition-all" style={{height}}>
			<div ref={el} {...props}>
				{props.children}
			</div>
		</div>
	);
};

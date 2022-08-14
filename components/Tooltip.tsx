import React, {useCallback, useEffect, useLayoutEffect, useState} from 'react';
import classNames from 'classnames';
import usePortal from '../helper/hooks/usePortal';
import {createPortal} from 'react-dom';
import {usePopper} from 'react-popper';

export type TooltipProps = React.HTMLAttributes<HTMLSpanElement> & {
	text?: string;
	disabled?: boolean;
};

export const Tooltip = ({text, disabled, children, ...props}: TooltipProps) => {
	const [referenceElement, setReferenceElement] = useState<HTMLSpanElement | null>(null);
	const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(null);
	const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
	const {styles, attributes, ...popper} = usePopper(referenceElement, popperElement, {
		modifiers: [
			{
				name: 'offset',
				options: {
					offset: [0, 8],
				},
			},
			{
				name: 'arrow',
				options: {element: arrowElement},
			},
		],
		placement: 'top',
	});
	const [visible, setVisible] = useState(false);

	const update = useCallback(() => {
		if (typeof popper.update === 'function') popper.update().catch((err) => console.error(err));
	}, [popper.update]);

	useEffect(() => {
		const mouseover = () => setVisible(true);
		const mouseleave = () => setVisible(false);
		const touchstart = () => setVisible((visible) => !visible);

		referenceElement?.addEventListener('mouseover', mouseover, {passive: true});
		referenceElement?.addEventListener('mouseleave', mouseleave, {passive: true});
		referenceElement?.addEventListener('touchstart', touchstart, {passive: true});
		referenceElement?.addEventListener('resize', update, {passive: true});
		window.addEventListener('resize', update, {passive: true});

		let resizeObserver: ResizeObserver;
		try {
			resizeObserver = new ResizeObserver(update);

			if (referenceElement) resizeObserver.observe(referenceElement);
		} catch (e) {}

		return () => {
			referenceElement?.removeEventListener('mouseover', mouseover);
			referenceElement?.removeEventListener('mouseleave', mouseleave);
			referenceElement?.removeEventListener('touchstart', touchstart);
			referenceElement?.removeEventListener('resize', update);
			window.removeEventListener('resize', update);

			if (referenceElement) {
				resizeObserver?.unobserve(referenceElement);
			}
		};
	}, [referenceElement, update]);

	if (!text || disabled) return <>{children}</>;

	return (
		<>
			<TooltipPortal>
				<div
					ref={setPopperElement}
					style={styles.popper}
					{...attributes.popper}
					className={classNames(
						'bg-neutral text-neutral-content rounded p-2 shadow-sm text-xs text-center max-w-[200px] transition-opacity pointer-events-none',
						visible ? 'opacity-100' : 'opacity-0',
					)}>
					{text}

					<div ref={setArrowElement} style={styles.arrow}>
						<div className="h-4 translate-y-1/2">
							<div className="mx-auto w-0 h-0 border-solid border-4 border-b-0 border-transparent border-t-neutral" />
						</div>
					</div>
				</div>
			</TooltipPortal>

			<span ref={setReferenceElement} {...props}>
				{children}
			</span>
		</>
	);
};

type TooltipPortalProps = {
	children?: React.HTMLProps<HTMLDivElement>['children'];
};
export const TooltipPortal = ({children}: TooltipPortalProps) => {
	const target = usePortal('tooltip');

	return createPortal(children, target);
};

// export const TooltipContainer = () => {
// 	useEffect(() => {
// 		// TooltipRef.current = {
// 		//
// 		// }
// 	}, [])
//
// 	return (
// 		<TooltipPortal>
// 			{/*{tooltips.map((tooltip) => (*/}
// 			{/*	<h1>{tooltip}</h1>*/}
// 			{/*))}*/}
// 		</TooltipPortal>
// 	)
// }

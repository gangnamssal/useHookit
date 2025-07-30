import { useCallback, useRef, useState, useEffect, useMemo } from 'react';

interface UseHoverOptions {
	/** Callback when hover starts */
	onHoverStart?: () => void;

	/** Callback when hover ends */
	onHoverEnd?: () => void;

	/** Callback when hover state changes */
	onHoverChange?: (isHovered: boolean) => void;

	/** Delay before hover is detected (ms) */
	delay?: number;

	/** Delay before hover ends (ms) */
	delayEnd?: number;

	/** Whether the hook is enabled */
	enabled?: boolean;
}

interface UseHoverReturn<T extends HTMLElement = HTMLElement> {
	/** Whether the element is hovered */
	isHovered: boolean;

	/** Ref to assign to the DOM element */
	ref: React.RefObject<T>;

	/** Event handlers for mouse and touch events */
	hoverProps: {
		onMouseEnter: () => void;
		onMouseLeave: () => void;
		onTouchStart: () => void;
		onTouchEnd: () => void;
	};
}

/**
 * React hook for detecting mouse hover state on a DOM element.
 * Provides callbacks, delay options, and touch device support.
 *
 * @param {UseHoverOptions} [options] - Hook options
 *
 * @param {() => void} [options.onHoverStart] - Callback when hover starts
 *
 * @param {() => void} [options.onHoverEnd] - Callback when hover ends
 *
 * @param {(isHovered: boolean) => void} [options.onHoverChange] - Callback when hover state changes
 *
 * @param {number} [options.delay] - Delay before hover is detected (ms, default: 0)
 *
 * @param {number} [options.delayEnd] - Delay before hover ends (ms, default: 0)
 *
 * @param {boolean} [options.enabled] - Whether the hook is enabled (default: true)
 *
 * @returns {boolean} isHovered - Whether the element is hovered
 *
 * @returns {React.RefObject<T>} ref - Ref to assign to the DOM element
 *
 * @returns {object} hoverProps - Event handlers for mouse and touch events to spread on DOM element
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { ref, isHovered, hoverProps } = useHover();
 *
 * return (
 *   <div ref={ref} {...hoverProps} className={isHovered ? 'hovered' : ''}>
 *     {isHovered ? 'Hovered!' : 'Hover me'}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // With callbacks
 * const { ref, isHovered, hoverProps } = useHover({
 *   onHoverStart: () => console.log('Hover start'),
 *   onHoverEnd: () => console.log('Hover end'),
 *   onHoverChange: (hovered) => console.log('Hover state:', hovered)
 * });
 *
 * return <div ref={ref} {...hoverProps}>Hover test</div>;
 * ```
 *
 * @example
 * ```tsx
 * // With delay
 * const { ref, isHovered, hoverProps } = useHover({
 *   delay: 200,    // 200ms before hover starts
 *   delayEnd: 100  // 100ms before hover ends
 * });
 *
 * return <div ref={ref} {...hoverProps}>Delayed hover</div>;
 * ```
 *
 * @example
 * ```tsx
 * // Direct event handler usage
 * const { ref, isHovered, hoverProps } = useHover();
 *
 * return (
 *   <div ref={ref} {...hoverProps}>
 *     Hover event handler usage
 *   </div>
 * );
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/ui-usehover--docs
 */
export function useHover<T extends HTMLElement = HTMLElement>(
	options: UseHoverOptions = {},
): UseHoverReturn<T> {
	const {
		onHoverStart,
		onHoverEnd,
		onHoverChange,
		delay = 0,
		delayEnd = 0,
		enabled = true,
	} = options;

	const [isHovered, setIsHovered] = useState(false);
	const ref = useRef<T>(null);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Clear timeout function
	const clearHoverTimeout = useCallback(() => {
		if (timeoutRef.current) {
			window.clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, []);

	// Update hover state function
	const updateHoverState = useCallback(
		(hovered: boolean) => {
			setIsHovered(hovered);
			if (hovered) {
				onHoverStart?.();
			} else {
				onHoverEnd?.();
			}
			onHoverChange?.(hovered);
		},
		[onHoverStart, onHoverEnd, onHoverChange],
	);

	// Handle hover start
	const handleHoverStart = useCallback(() => {
		if (!enabled) return;

		clearHoverTimeout();

		if (delay > 0) {
			timeoutRef.current = window.setTimeout(() => {
				updateHoverState(true);
			}, delay);
		} else {
			updateHoverState(true);
		}
	}, [enabled, delay, clearHoverTimeout, updateHoverState]);

	// Handle hover end
	const handleHoverEnd = useCallback(() => {
		if (!enabled) return;

		clearHoverTimeout();

		if (delayEnd > 0) {
			timeoutRef.current = window.setTimeout(() => {
				updateHoverState(false);
			}, delayEnd);
		} else {
			updateHoverState(false);
		}
	}, [enabled, delayEnd, clearHoverTimeout, updateHoverState]);

	// Clean up timeout on component unmount
	useEffect(() => {
		return clearHoverTimeout;
	}, [clearHoverTimeout]);

	// Memoize event handlers
	const hoverProps = useMemo(
		() => ({
			onMouseEnter: handleHoverStart,
			onMouseLeave: handleHoverEnd,
			onTouchStart: handleHoverStart,
			onTouchEnd: handleHoverEnd,
		}),
		[handleHoverStart, handleHoverEnd],
	);

	return {
		ref,
		isHovered,
		hoverProps,
	};
}

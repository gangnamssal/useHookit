import { useCallback, useRef, useEffect, useState } from 'react';
import { useIsMounted } from '../lifecycle/useIsMounted';

interface UseLongPressOptions {
	/** Minimum time to recognize as long press (milliseconds) */
	delay?: number;

	/** Callback to execute on long press */
	onLongPress?: () => void;

	/** Callback to execute when long press starts (with event object) */
	onLongPressStart?: (event: MouseEvent | TouchEvent) => void;

	/** Callback to execute when long press ends */
	onLongPressEnd?: () => void;

	/** Callback to execute when long press is cancelled */
	onLongPressCancel?: () => void;

	/** Whether to allow click events */
	preventDefault?: boolean;

	/** Whether to prevent default on touch events */
	shouldPreventDefault?: boolean;

	/** Movement threshold in pixels */
	moveThreshold?: number;
}

interface UseLongPressReturn {
	/** Object containing long press event handlers */
	handlers: {
		onMouseDown: (event: React.MouseEvent) => void;
		onMouseUp: (event: React.MouseEvent) => void;
		onMouseLeave: (event: React.MouseEvent) => void;
		onTouchStart: (event: React.TouchEvent) => void;
		onTouchEnd: (event: React.TouchEvent) => void;
		onTouchCancel: (event: React.TouchEvent) => void;
	};

	/** Whether long press is currently active */
	isLongPressing: boolean;
}

type Position = { x: number; y: number };

/**
 * A custom hook that detects long press gestures on DOM elements.
 *
 * Detects when a mouse/touch event is held for a specified duration and executes callbacks.
 *
 * @param {Object} [options] - Long press options
 *
 * @param {number} [options.delay] - Minimum time to recognize as long press (ms, default: 500)
 *
 * @param {() => void} [options.onLongPress] - Callback to execute on long press
 *
 * @param {(event: MouseEvent | TouchEvent) => void} [options.onLongPressStart] - Callback to execute when long press starts
 *
 * @param {() => void} [options.onLongPressEnd] - Callback to execute when long press ends
 *
 * @param {() => void} [options.onLongPressCancel] - Callback to execute when long press is cancelled
 *
 * @param {boolean} [options.preventDefault] - Whether to prevent default events (default: true)
 *
 * @param {boolean} [options.shouldPreventDefault] - Whether to prevent default on touch events (default: true)
 *
 * @param {number} [options.moveThreshold] - Movement threshold in pixels to cancel long press (default: 10)
 *
 * @returns {Object} handlers - Event handlers to spread on DOM element to assign to the DOM element
 *
 * @returns {boolean} isLongPressing - Current long press state
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { handlers, isLongPressing } = useLongPress({
 *   delay: 500,
 *   onLongPress: () => console.log('Long press!'),
 *   onLongPressStart: () => console.log('Long press started'),
 *   onLongPressEnd: () => console.log('Long press ended'),
 * });
 *
 * return (
 *   <button {...handlers}>
 *     {isLongPressing ? 'Long pressing...' : 'Press and hold'}
 *   </button>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Custom options usage
 * const { handlers, isLongPressing } = useLongPress({
 *   delay: 1000,
 *   moveThreshold: 5,
 *   preventDefault: false,
 *   onLongPress: () => {
 *     console.log('Long press detected');
 *     // Show context menu
 *   },
 *   onLongPressCancel: () => {
 *     console.log('Long press cancelled');
 *   },
 * });
 *
 * return (
 *   <div {...handlers} className="long-press-target">
 *     Long press me
 *   </div>
 * );
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/ui-uselongpress--docs
 */
export function useLongPress({
	delay = 500,
	onLongPress,
	onLongPressStart,
	onLongPressEnd,
	onLongPressCancel,
	preventDefault = true,
	shouldPreventDefault = true,
	moveThreshold = 10,
}: UseLongPressOptions = {}): UseLongPressReturn {
	const isMounted = useIsMounted();

	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [isLongPressing, setIsLongPressing] = useState(false);
	const startPositionRef = useRef<Position | null>(null);
	const hasMovedRef = useRef(false);

	const clearLongPressTimeout = useCallback(() => {
		if (timeoutRef.current && isMounted) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, [isMounted]);

	const getEventPosition = useCallback((event: MouseEvent | TouchEvent): Position => {
		if ('touches' in event) {
			const touch = event.touches[0];
			return { x: touch.clientX, y: touch.clientY };
		}
		return { x: event.clientX, y: event.clientY };
	}, []);

	const startLongPress = useCallback(
		(event: MouseEvent | TouchEvent) => {
			if (!isMounted) return;

			if (shouldPreventDefault) {
				event.preventDefault();
			}

			setIsLongPressing(true);
			hasMovedRef.current = false;
			startPositionRef.current = getEventPosition(event);

			onLongPressStart?.(event);

			// Execute immediately if delay is 0ms or less
			if (delay <= 0) {
				if (!hasMovedRef.current) {
					onLongPress?.();
				}
			} else {
				timeoutRef.current = setTimeout(() => {
					if (!hasMovedRef.current && isMounted) {
						onLongPress?.();
					}
				}, delay);
			}
		},
		[delay, onLongPress, onLongPressStart, shouldPreventDefault, getEventPosition, isMounted],
	);

	const endLongPress = useCallback(() => {
		setIsLongPressing(false);
		onLongPressEnd?.();
		clearLongPressTimeout();
		startPositionRef.current = null;
	}, [onLongPressEnd, clearLongPressTimeout]);

	const cancelLongPress = useCallback(() => {
		setIsLongPressing(false);
		onLongPressCancel?.();
		clearLongPressTimeout();
		startPositionRef.current = null;
	}, [onLongPressCancel, clearLongPressTimeout]);

	const checkMovement = useCallback(
		(event: MouseEvent | TouchEvent) => {
			if (!startPositionRef.current || !isMounted) return;

			const currentPosition = getEventPosition(event);
			const deltaX = Math.abs(currentPosition.x - startPositionRef.current.x);
			const deltaY = Math.abs(currentPosition.y - startPositionRef.current.y);

			if (deltaX > moveThreshold || deltaY > moveThreshold) {
				hasMovedRef.current = true;
				cancelLongPress();
			}
		},
		[cancelLongPress, getEventPosition, moveThreshold, isMounted],
	);

	// Event handler creation function
	const createEventHandler = useCallback(
		(handler: (event: MouseEvent | TouchEvent) => void) =>
			(event: React.MouseEvent | React.TouchEvent) => {
				if (preventDefault) {
					event.preventDefault();
				}
				handler(event.nativeEvent);
			},
		[preventDefault],
	);

	// Mouse event handlers
	const handleMouseDown = useCallback(createEventHandler(startLongPress), [
		createEventHandler,
		startLongPress,
	]);

	const handleMouseUp = useCallback(createEventHandler(endLongPress), [
		createEventHandler,
		endLongPress,
	]);

	const handleMouseLeave = useCallback(createEventHandler(cancelLongPress), [
		createEventHandler,
		cancelLongPress,
	]);

	// Touch event handlers
	const handleTouchStart = useCallback(createEventHandler(startLongPress), [
		createEventHandler,
		startLongPress,
	]);

	const handleTouchEnd = useCallback(createEventHandler(endLongPress), [
		createEventHandler,
		endLongPress,
	]);

	const handleTouchCancel = useCallback(createEventHandler(cancelLongPress), [
		createEventHandler,
		cancelLongPress,
	]);

	// Movement detection event listeners
	useEffect(() => {
		if (!isMounted) return;

		const handleTouchMove = (event: TouchEvent) => {
			checkMovement(event);
		};

		const handleMouseMove = (event: MouseEvent) => {
			checkMovement(event);
		};

		document.addEventListener('touchmove', handleTouchMove, { passive: false });
		document.addEventListener('mousemove', handleMouseMove);

		return () => {
			document.removeEventListener('touchmove', handleTouchMove);
			document.removeEventListener('mousemove', handleMouseMove);
			clearLongPressTimeout();
		};
	}, [checkMovement, clearLongPressTimeout, isMounted]);

	return {
		handlers: {
			onMouseDown: handleMouseDown,
			onMouseUp: handleMouseUp,
			onMouseLeave: handleMouseLeave,
			onTouchStart: handleTouchStart,
			onTouchEnd: handleTouchEnd,
			onTouchCancel: handleTouchCancel,
		},
		isLongPressing,
	};
}

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/**
 * Scroll position interface
 */
interface ScrollPosition {
	x: number;
	y: number;
}

/**
 * Options for useScrollPosition hook
 */
interface UseScrollPositionOptions {
	/**
	 * Element to track scroll position for. Defaults to window.
	 */
	element?: HTMLElement | null;
	/**
	 * Throttle delay in milliseconds. Defaults to 16 (60fps).
	 */
	throttle?: number;
	/**
	 * Callback function called when scroll position changes
	 */
	onChange?: (position: ScrollPosition) => void;
	/**
	 * Whether to enable scroll tracking. Defaults to true.
	 */
	enabled?: boolean;
}

/**
 * Constants for scroll behavior
 */
const SCROLL_END_DELAY = 150;
const DEFAULT_THROTTLE = 16;

/**
 * Hook to track scroll position with throttling support
 *
 * @param options - Configuration options for scroll tracking
 * @returns Current scroll position and utility functions
 *
 * @example
 * ```tsx
 * const { x, y, isScrolling } = useScrollPosition();
 *
 * // With custom element
 * const { x, y } = useScrollPosition({
 *   element: containerRef.current,
 *   throttle: 100
 * });
 * ```
 */
export function useScrollPosition(options: UseScrollPositionOptions = {}) {
	const { element, throttle = DEFAULT_THROTTLE, onChange, enabled = true } = options;

	const [position, setPosition] = useState<ScrollPosition>({ x: 0, y: 0 });
	const [isScrolling, setIsScrolling] = useState(false);

	const lastScrollTime = useRef(0);
	const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
	const onChangeRef = useRef(onChange);

	// Update onChange ref when it changes
	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	// Memoize scroll target to avoid unnecessary re-renders
	const scrollTarget = useMemo(() => element || window, [element]);

	// Get scroll position from element or window
	const getScrollPosition = useCallback((): ScrollPosition => {
		try {
			if (element) {
				return {
					x: element.scrollLeft,
					y: element.scrollTop,
				};
			}

			return {
				x: window.pageXOffset || document.documentElement.scrollLeft,
				y: window.pageYOffset || document.documentElement.scrollTop,
			};
		} catch (error) {
			console.warn('useScrollPosition: Error getting scroll position:', error);
			return { x: 0, y: 0 };
		}
	}, [element]);

	// Memoize scroll end position calculation
	const scrollEndPosition = useMemo(() => {
		try {
			if (element) {
				return {
					x: 0,
					y: element.scrollHeight - element.clientHeight,
				};
			}

			return {
				x: 0,
				y: document.documentElement.scrollHeight - window.innerHeight,
			};
		} catch (error) {
			console.warn('useScrollPosition: Error calculating scroll end position:', error);
			return { x: 0, y: 0 };
		}
	}, [element]);

	// Handle scroll event with throttling
	const handleScroll = useCallback(() => {
		if (!enabled) return;

		const now = Date.now();
		if (now - lastScrollTime.current < throttle) return;

		lastScrollTime.current = now;
		const newPosition = getScrollPosition();

		setPosition(newPosition);
		setIsScrolling(true);

		// Clear existing timeout
		if (scrollTimeoutRef.current) {
			clearTimeout(scrollTimeoutRef.current);
		}

		// Set scrolling to false after scroll ends
		scrollTimeoutRef.current = setTimeout(() => {
			setIsScrolling(false);
		}, SCROLL_END_DELAY);

		// Call onChange callback if provided
		if (onChangeRef.current) {
			try {
				onChangeRef.current(newPosition);
			} catch (error) {
				console.warn('useScrollPosition: Error in onChange callback:', error);
			}
		}
	}, [enabled, throttle, getScrollPosition]);

	// Set up scroll event listener
	useEffect(() => {
		if (!enabled) return;

		const initialPosition = getScrollPosition();
		setPosition(initialPosition);

		scrollTarget.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			scrollTarget.removeEventListener('scroll', handleScroll);
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}
		};
	}, [scrollTarget, enabled, handleScroll, getScrollPosition]);

	// Scroll to position utility function
	const scrollTo = useCallback(
		(x: number, y: number, behavior: ScrollBehavior = 'smooth') => {
			try {
				if (element) {
					element.scrollTo({ left: x, top: y, behavior });
				} else {
					window.scrollTo({ left: x, top: y, behavior });
				}
			} catch (error) {
				console.warn('useScrollPosition: Error scrolling to position:', error);
			}
		},
		[element],
	);

	// Scroll to top utility function
	const scrollToTop = useCallback(
		(behavior: ScrollBehavior = 'smooth') => {
			scrollTo(0, 0, behavior);
		},
		[scrollTo],
	);

	// Scroll to bottom utility function
	const scrollToBottom = useCallback(
		(behavior: ScrollBehavior = 'smooth') => {
			try {
				if (element) {
					element.scrollTo({
						left: scrollEndPosition.x,
						top: scrollEndPosition.y,
						behavior,
					});
				} else {
					window.scrollTo({
						left: scrollEndPosition.x,
						top: scrollEndPosition.y,
						behavior,
					});
				}
			} catch (error) {
				console.warn('useScrollPosition: Error scrolling to bottom:', error);
			}
		},
		[element, scrollEndPosition],
	);

	return {
		x: position.x,
		y: position.y,
		isScrolling,
		scrollTo,
		scrollToTop,
		scrollToBottom,
	};
}

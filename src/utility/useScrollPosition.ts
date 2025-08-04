import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useIsMounted } from '../lifecycle/useIsMounted';

/**
 * Scroll position interface
 */
interface ScrollPosition {
	/** X position */
	x: number;

	/** Y position */
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
 * @param {UseScrollPositionOptions} [options] - Configuration options for scroll tracking
 *
 * @param {HTMLElement | null} [options.element] - Element to track scroll position for. Defaults to window.
 *
 * @param {number} [options.throttle] - Throttle delay in milliseconds. Defaults to 16 (60fps).
 *
 * @param {() => void} [options.onChange] - Callback function called when scroll position changes
 *
 * @param {boolean} [options.enabled] - Whether to enable scroll tracking. Defaults to true.
 *
 * @returns {ScrollPosition} position - Current scroll position
 *
 * @returns {boolean} isScrolling - Whether the element is currently scrolling
 *
 * @returns {() => void} scrollTo - Function to scroll to a specific position
 *
 * @returns {() => void} scrollToTop - Function to scroll to the top of the element
 *
 * @returns {() => void} scrollToBottom - Function to scroll to the bottom of the element
 *
 * @returns {() => void} scrollToLeft - Function to scroll to the left of the element
 *
 * @returns {() => void} scrollToRight - Function to scroll to the right of the element
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
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-usescrollposition--docs
 */
export function useScrollPosition(options: UseScrollPositionOptions = {}) {
	const { element, throttle = DEFAULT_THROTTLE, onChange, enabled = true } = options;

	const isMounted = useIsMounted();

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
	const scrollTarget = useMemo(() => {
		if (!isMounted) return null;
		return element || window;
	}, [element, isMounted]);

	// Get scroll position from element or window
	const getScrollPosition = useCallback((): ScrollPosition => {
		if (!isMounted) return { x: 0, y: 0 };

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
			if (isMounted) {
				console.warn('useScrollPosition: Error getting scroll position:', error);
			}
			return { x: 0, y: 0 };
		}
	}, [element, isMounted]);

	// Handle scroll event with throttling
	const handleScroll = useCallback(() => {
		if (!enabled || !isMounted) return;

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
			if (isMounted) {
				setIsScrolling(false);
			}
		}, SCROLL_END_DELAY);

		// Call onChange callback if provided
		if (onChangeRef.current) {
			try {
				onChangeRef.current(newPosition);
			} catch (error) {
				if (isMounted) {
					console.warn('useScrollPosition: Error in onChange callback:', error);
				}
			}
		}
	}, [enabled, throttle, getScrollPosition, isMounted]);

	// Set up scroll event listener
	useEffect(() => {
		if (!enabled || !isMounted || !scrollTarget) return;

		const initialPosition = getScrollPosition();
		setPosition(initialPosition);

		scrollTarget.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			if (isMounted && scrollTarget) {
				scrollTarget.removeEventListener('scroll', handleScroll);
			}
			if (scrollTimeoutRef.current && isMounted) {
				clearTimeout(scrollTimeoutRef.current);
			}
		};
	}, [scrollTarget, enabled, handleScroll, getScrollPosition, isMounted]);

	// Scroll to position utility function
	const scrollTo = useCallback(
		(x: number, y: number, behavior: ScrollBehavior = 'smooth') => {
			if (!isMounted) return;

			try {
				if (element) {
					element.scrollTo({ left: x, top: y, behavior });
				} else {
					window.scrollTo({ left: x, top: y, behavior });
				}
			} catch (error) {
				if (isMounted) {
					console.warn('useScrollPosition: Error scrolling to position:', error);
				}
			}
		},
		[element, isMounted],
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
			if (!isMounted) return;

			try {
				if (element) {
					const maxScrollTop = element.scrollHeight - element.clientHeight;
					element.scrollTo({
						left: 0,
						top: maxScrollTop,
						behavior,
					});
				} else {
					const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
					window.scrollTo({
						left: 0,
						top: maxScrollTop,
						behavior,
					});
				}
			} catch (error) {
				if (isMounted) {
					console.warn('useScrollPosition: Error scrolling to bottom:', error);
				}
			}
		},
		[element, isMounted],
	);

	// Scroll to left utility function
	const scrollToLeft = useCallback(
		(behavior: ScrollBehavior = 'smooth') => {
			if (!isMounted) return;

			try {
				if (element) {
					element.scrollTo({
						left: 0,
						top: position.y,
						behavior,
					});
				} else {
					scrollTo(0, position.y, behavior);
				}
			} catch (error) {
				if (isMounted) {
					console.warn('useScrollPosition: Error scrolling to left:', error);
				}
			}
		},
		[element, position.y, scrollTo, isMounted],
	);

	// Scroll to right utility function
	const scrollToRight = useCallback(
		(behavior: ScrollBehavior = 'smooth') => {
			if (!isMounted) return;

			try {
				if (element) {
					const maxScrollLeft = element.scrollWidth - element.clientWidth;
					element.scrollTo({
						left: maxScrollLeft,
						top: position.y,
						behavior,
					});
				} else {
					const maxScrollLeft = document.documentElement.scrollWidth - window.innerWidth;
					window.scrollTo({
						left: maxScrollLeft,
						top: position.y,
						behavior,
					});
				}
			} catch (error) {
				if (isMounted) {
					console.warn('useScrollPosition: Error scrolling to right:', error);
				}
			}
		},
		[element, position.y, isMounted],
	);

	return {
		x: position.x,
		y: position.y,
		isScrolling,
		scrollTo,
		scrollToTop,
		scrollToBottom,
		scrollToLeft,
		scrollToRight,
	};
}

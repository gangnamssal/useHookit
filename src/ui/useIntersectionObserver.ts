import { useEffect, useRef, useState, useCallback } from 'react';
import { useIsMounted } from '../lifecycle/useIsMounted';

export interface IntersectionObserverOptions {
	/** Root element (default: null, browser viewport) */
	root?: Element | null;

	/** Root element margin (default: '0px') */
	rootMargin?: string;

	/** Threshold array (default: [0]) */
	threshold?: number | number[];

	/** Initial state (default: false) */
	initialIsIntersecting?: boolean;
}

export interface UseIntersectionObserverReturn {
	/** Current intersection state */
	isIntersecting: boolean;

	/** Intersection ratio (0-1) */
	intersectionRatio: number;

	/** Intersection area bounding rectangle */
	intersectionRect: DOMRectReadOnly | null;

	/** Target element bounding rectangle */
	boundingClientRect: DOMRectReadOnly | null;

	/** Root element bounding rectangle */
	rootBounds: DOMRectReadOnly | null;

	/** Ref for target element */
	ref: (node: Element | null) => void;

	/** Observer instance */
	observer: IntersectionObserver | null;
}

/**
 * A hook that detects element visibility using the Intersection Observer API
 *
 * @param {IntersectionObserverOptions} options - Intersection Observer options
 *
 * @param {Element | null} options.root - Root element (default: null, browser viewport)
 *
 * @param {string} options.rootMargin - Root element margin (default: '0px')
 *
 * @param {number | number[]} options.threshold - Threshold array (default: [0])
 *
 * @param {boolean} options.initialIsIntersecting - Initial state (default: false)
 *
 * @returns {boolean} isIntersecting - Current intersection state
 *
 * @returns {number} intersectionRatio - Intersection ratio (0-1)
 *
 * @returns {DOMRectReadOnly | null} intersectionRect - Intersection area bounding rectangle
 *
 * @returns {DOMRectReadOnly | null} boundingClientRect - Target element bounding rectangle
 *
 * @returns {DOMRectReadOnly | null} rootBounds - Root element bounding rectangle
 *
 * @returns {(node: Element | null) => void} ref - Ref for target element to assign to the DOM element
 *
 * @returns {IntersectionObserver | null} observer - Intersection Observer instance
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { isIntersecting, ref } = useIntersectionObserver({
 *   threshold: 0.5,
 *   rootMargin: '50px'
 * });
 *
 * return (
 *   <div ref={ref}>
 *     {isIntersecting ? 'Visible!' : 'Hidden'}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Infinite scroll
 * const { isIntersecting, ref } = useIntersectionObserver({
 *   threshold: 0.1,
 *   rootMargin: '100px'
 * });
 *
 * useEffect(() => {
 *   if (isIntersecting) {
 *     loadMoreData();
 *   }
 * }, [isIntersecting]);
 *
 * return (
 *   <div ref={ref}>
 *     Loading...
 *   </div>
 * );
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/ui-useintersectionobserver--docs
 */
export function useIntersectionObserver(
	options: IntersectionObserverOptions = {},
): UseIntersectionObserverReturn {
	const { root = null, rootMargin = '0px', threshold = 0, initialIsIntersecting = false } = options;

	const isMounted = useIsMounted();

	const [state, setState] = useState<{
		isIntersecting: boolean;
		intersectionRatio: number;
		intersectionRect: DOMRectReadOnly | null;
		boundingClientRect: DOMRectReadOnly | null;
		rootBounds: DOMRectReadOnly | null;
	}>({
		isIntersecting: initialIsIntersecting,
		intersectionRatio: 0,
		intersectionRect: null,
		boundingClientRect: null,
		rootBounds: null,
	});

	const [observer, setObserver] = useState<IntersectionObserver | null>(null);
	const elementRef = useRef<Element | null>(null);

	// Intersection Observer callback
	const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
		const entry = entries[0];
		if (entry) {
			setState({
				isIntersecting: entry.isIntersecting,
				intersectionRatio: entry.intersectionRatio,
				intersectionRect: entry.intersectionRect,
				boundingClientRect: entry.boundingClientRect,
				rootBounds: entry.rootBounds,
			});
		}
	}, []);

	// Create Observer
	useEffect(() => {
		if (!isMounted) return;

		// Check if IntersectionObserver is supported
		if (!window.IntersectionObserver) {
			console.warn(
				'useIntersectionObserver: IntersectionObserver is not supported in this browser',
			);
			return;
		}

		// Validate options
		if (
			threshold !== undefined &&
			(Array.isArray(threshold)
				? threshold.some((t) => t < 0 || t > 1)
				: threshold < 0 || threshold > 1)
		) {
			console.warn('useIntersectionObserver: threshold must be between 0 and 1');
			return;
		}

		try {
			const observer = new IntersectionObserver(handleIntersection, {
				root,
				rootMargin,
				threshold,
			});

			setObserver(observer);

			// Start observing if current element exists
			if (elementRef.current) {
				observer.observe(elementRef.current);
			}

			return () => {
				observer.disconnect();
			};
		} catch (error) {
			console.error('useIntersectionObserver: Failed to create IntersectionObserver:', error);
		}
	}, [root, rootMargin, threshold, handleIntersection, isMounted]);

	// Ref callback
	const ref = useCallback(
		(node: Element | null) => {
			elementRef.current = node;

			if (observer && isMounted) {
				// Disconnect existing element observation
				observer.disconnect();

				// Start observing new element
				if (node) {
					observer.observe(node);
				}
			}
		},
		[observer, isMounted],
	);

	return {
		...state,
		ref,
		observer,
	};
}

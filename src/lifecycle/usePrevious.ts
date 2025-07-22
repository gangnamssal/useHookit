import { useRef, useEffect } from 'react';

interface UsePreviousOptions<T> {
	initialValue?: T;
}

/**
 * A hook that returns the value from the previous render.
 *
 * @template T - Type of the value to track
 * @param {T} value - Current value to track
 * @param {UsePreviousOptions<T>} options - Options configuration
 * @param {T} options.initialValue - Initial value (returned on first render)
 * @returns {T | undefined} Value from previous render
 *
 * @example
 * ```tsx
 * // Basic usage
 * const prevCount = usePrevious(count);
 *
 * useEffect(() => {
 *   if (count !== prevCount) {
 *     console.log('Count changed:', prevCount, '->', count);
 *   }
 * }, [count, prevCount]);
 * ```
 *
 * @example
 * ```tsx
 * // Set initial value
 * const prevCount = usePrevious(count, { initialValue: 0 });
 * const prevArray = usePrevious(array, { initialValue: [] });
 * const prevObject = usePrevious(object, { initialValue: {} });
 * ```
 *
 * @example
 * ```tsx
 * // Conditional rendering
 * const prevIsVisible = usePrevious(isVisible);
 *
 * useEffect(() => {
 *   if (isVisible && !prevIsVisible) {
 *     // Element becomes visible
 *     animateIn();
 *   } else if (!isVisible && prevIsVisible) {
 *     // Element becomes hidden
 *     animateOut();
 *   }
 * }, [isVisible, prevIsVisible]);
 * ```
 */
export function usePrevious<T>(value: T, options: UsePreviousOptions<T> = {}): T | undefined {
	const { initialValue } = options;

	const ref = useRef<T | undefined>(initialValue);

	useEffect(() => {
		ref.current = value;
	}, [value]);

	return ref.current;
}

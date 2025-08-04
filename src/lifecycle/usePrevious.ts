import { useRef, useEffect, useState } from 'react';

interface UsePreviousOptions<T> {
	initialValue?: T;
}

/**
 * A hook that returns the value from the previous render.
 *
 * @template T - Type of the value to track
 *
 * @param {T} value - Current value to track
 *
 * @param {UsePreviousOptions<T>} options - Options configuration
 *
 * @param {T} options.initialValue - Initial value (returned on first render)
 *
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
 *
 * @link https://use-hookit.vercel.app/?path=/docs/lifecycle-useprevious--docs
 */
export function usePrevious<T>(value: T, options: UsePreviousOptions<T> = {}): T | undefined {
	const { initialValue } = options;

	const [isClient, setIsClient] = useState(false);

	const ref = useRef<T | undefined>(initialValue);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) {
		return initialValue;
	}

	const previousValue = ref.current;
	ref.current = value;
	return previousValue;
}

import { useRef, useCallback, useState, useEffect } from 'react';

/**
 * A custom hook that throttles a callback function to execute only once during the specified delay(ms).
 *
 * @template T - Type of the callback function
 *
 * @param {T} callback - Callback function to throttle
 *
 * @param {number} delay - Throttle interval (ms)
 *
 * @returns {T} Throttled callback function
 *
 * @example
 * ```tsx
 * // Basic usage
 * const throttledFn = useThrottle((value) => {
 *   console.log('throttled value:', value);
 * }, 500);
 *
 * throttledFn('hello');
 * ```
 *
 * @example
 * ```tsx
 * // Usage in scroll events
 * const throttledScrollHandler = useThrottle((event) => {
 *   console.log('scroll position:', event.target.scrollTop);
 * }, 100);
 *
 * useEffect(() => {
 *   window.addEventListener('scroll', throttledScrollHandler);
 *   return () => window.removeEventListener('scroll', throttledScrollHandler);
 * }, [throttledScrollHandler]);
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/performance-usethrottle--docs
 */
export function useThrottle<T extends (...args: any[]) => any>(callback: T, delay: number): T {
	const lastRun = useRef<number>(0);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Validate delay
	if (delay < 0) {
		console.warn('useThrottle: delay must be non-negative');
		return useCallback(
			((...args: Parameters<T>) => {
				callback(...args);
			}) as T,
			[callback],
		);
	}

	const throttledCallback = useCallback(
		((...args: Parameters<T>) => {
			const now = Date.now();

			if (lastRun.current && now - lastRun.current < delay) {
				// Schedule the last call if throttle time hasn't passed yet
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}

				timeoutRef.current = setTimeout(() => {
					lastRun.current = now;
					callback(...args);
				}, delay - (now - lastRun.current));
			} else {
				// Execute immediately if throttle time has passed
				lastRun.current = now;
				callback(...args);
			}
		}) as T,
		[callback, delay],
	);

	return throttledCallback;
}

/**
 * A custom hook that returns a throttled value that updates only once during the specified delay(ms) when the input value changes.
 *
 * @template T - Type of the value to throttle
 *
 * @param {T} value - Value to throttle
 *
 * @param {number} delay - Throttle interval (ms)
 *
 * @returns {T} Throttled value
 *
 * @example
 * ```tsx
 * // Basic usage
 * const throttledValue = useThrottleValue(inputValue, 300);
 *
 * useEffect(() => {
 *   if (throttledValue) {
 *     updateUI(throttledValue);
 *   }
 * }, [throttledValue]);
 * ```
 *
 * @example
 * ```tsx
 * // Usage in real-time input
 * const [inputValue, setInputValue] = useState('');
 * const throttledInputValue = useThrottleValue(inputValue, 200);
 *
 * useEffect(() => {
 *   if (throttledInputValue) {
 *     validateInput(throttledInputValue);
 *   }
 * }, [throttledInputValue]);
 *
 * return (
 *   <input
 *     value={inputValue}
 *     onChange={(e) => setInputValue(e.target.value)}
 *   />
 * );
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/performance-usethrottle--docs#related-hooks
 */
export function useThrottleValue<T>(value: T, delay: number): T {
	const [throttledValue, setThrottledValue] = useState<T>(value);
	const lastRun = useRef<number>(0);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		if (delay < 0) {
			if (typeof console !== 'undefined' && console.warn) {
				console.warn('useThrottleValue: delay must be non-negative');
			}
			setThrottledValue(value);
			return;
		}

		const now = Date.now();

		if (lastRun.current && now - lastRun.current < delay) {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = setTimeout(() => {
				lastRun.current = Date.now();
				setThrottledValue(value);
			}, delay - (now - lastRun.current));
		} else {
			lastRun.current = now;
			setThrottledValue(value);
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [value, delay]);

	return throttledValue;
}

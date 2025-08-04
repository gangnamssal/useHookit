import { useState, useEffect, useRef } from 'react';
import { useIsMounted, useIsMountedRef } from '../lifecycle/useIsMounted';

/**
 * A custom hook that delays and returns a value by a specified time (delay).
 *
 * Only returns the latest value after delay(ms) when the input value changes.
 *
 * @template T - Type of the value to return
 *
 * @param {T} value - Value to debounce
 *
 * @param {number} delay - Debounce delay time (ms)
 *
 * @returns {T} Debounced value
 *
 * @example
 * ```tsx
 * // Basic usage
 * const debouncedValue = useDebounce(inputValue, 300);
 *
 * useEffect(() => {
 *   if (debouncedValue) {
 *     searchAPI(debouncedValue);
 *   }
 * }, [debouncedValue]);
 * ```
 *
 * @example
 * ```tsx
 * // Usage in search input
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     performSearch(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 *
 * return (
 *   <input
 *     value={searchTerm}
 *     onChange={(e) => setSearchTerm(e.target.value)}
 *     placeholder="Enter search term"
 *   />
 * );
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/performance-usedebounce--docs
 */
export function useDebounce<T>(value: T, delay: number): T {
	const isMounted = useIsMounted();

	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		if (!isMounted) return;

		if (delay < 0) {
			console.warn('useDebounce: delay must be non-negative');
			setDebouncedValue(value);
			return;
		}

		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay, isMounted]);

	return isMounted ? debouncedValue : value;
}

/**
 * High-performance version of useDebounce using useRef for minimal re-renders.
 * Use this when you don't need reactive updates and want maximum performance.
 *
 * @template T - Type of the value to debounce
 * @param {T} value - Value to debounce
 * @param {number} delay - Debounce delay time (ms)
 * @param {(value: T) => void} callback - Callback to execute with debounced value
 *
 * @example
 * ```tsx
 * useDebounceCallback(searchTerm, 300, (debouncedTerm) => {
 *   performSearch(debouncedTerm);
 * });
 * ```
 */
export function useDebounceRef<T>(value: T, delay: number, callback: (value: T) => void): void {
	const isMountedRef = useIsMountedRef();
	const callbackRef = useRef(callback);
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

	// Update callback ref
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		if (!isMountedRef()) return;

		if (delay < 0) {
			console.warn('useDebounceRef: delay must be non-negative');
			callbackRef.current(value);
			return;
		}

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			if (isMountedRef()) {
				callbackRef.current(value);
			}
		}, delay);

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [value, delay, isMountedRef]);
}

/**
 * A custom hook that debounces a callback function by a specified time (delay) and returns it.
 *
 * The returned function only executes the last call after delay(ms) when called continuously.
 *
 * @template T - Type of the callback function
 *
 * @param {T} callback - Callback function to debounce
 *
 * @param {number} delay - Debounce delay time (ms)
 *
 * @returns {T} Debounced callback function
 *
 * @example
 * ```tsx
 * // Basic usage
 * const debouncedOnChange = useDebounceCallback((value) => {
 *   console.log('Debounced value:', value);
 * }, 300);
 *
 * return (
 *   <input onChange={(e) => debouncedOnChange(e.target.value)} />
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Usage in API calls
 * const debouncedSearch = useDebounceCallback((searchTerm: string) => {
 *   if (searchTerm.trim()) {
 *     searchAPI(searchTerm);
 *   }
 * }, 500);
 *
 * const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 *   debouncedSearch(e.target.value);
 * };
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/performance-usedebounce--docs#related-hooks
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
	callback: T,
	delay: number,
): T {
	const isMounted = useIsMounted();
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Validate delay on hook initialization
	useEffect(() => {
		if (delay < 0) {
			console.warn('useDebounce: delay must be non-negative');
		}
	}, [delay]);

	const debouncedCallback = ((...args: Parameters<T>) => {
		if (!isMounted) {
			callback(...args);
			return;
		}

		if (delay < 0) {
			callback(...args);
			return;
		}

		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}

		if (delay === 0) {
			callback(...args);
			return;
		}

		timerRef.current = setTimeout(() => {
			callback(...args);
		}, delay);
	}) as T;

	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, []);

	return debouncedCallback;
}

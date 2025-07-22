import { useState, useEffect, useRef } from 'react';

/**
 * A custom hook that delays and returns a value by a specified time (delay).
 *
 * Only returns the latest value after delay(ms) when the input value changes.
 *
 * @template T - Type of the value to return
 * @param {T} value - Value to debounce
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
 */
export function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
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
	}, [value, delay]);

	return debouncedValue;
}

/**
 *
 * 주어진 콜백 함수를 지정한 시간(delay)만큼 디바운스하여 반환하는 커스텀 훅입니다.
 *
 * A custom hook that debounces a callback function by a specified time (delay) and returns it.
 *
 * 반환된 함수는 연속 호출 시 마지막 호출만 delay(ms) 후 실행됩니다.
 *
 * The returned function only executes the last call after delay(ms) when called continuously.
 *
 * @template T - 콜백 함수 타입 / Type of the callback function
 *
 * @param {T} callback - 디바운스 처리할 콜백 함수 / Callback function to debounce
 *
 * @param {number} delay - 디바운스 지연 시간(ms) / Debounce delay time (ms)
 *
 * @returns {T} 디바운스된 콜백 함수 / Debounced callback function
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
 * const debouncedOnChange = useDebounceCallback((value) => {
 *   console.log('디바운스된 값:', value);
 * }, 300);
 *
 * return (
 *   <input onChange={(e) => debouncedOnChange(e.target.value)} />
 * );
 * ```
 *
 * @example
 * ```tsx
 * // API 호출에서 사용 / Usage in API calls
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
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
	callback: T,
	delay: number,
): T {
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// 훅 초기화 시 delay 검증
	useEffect(() => {
		if (delay < 0) {
			console.warn('useDebounce: delay must be non-negative');
		}
	}, [delay]);

	const debouncedCallback = ((...args: Parameters<T>) => {
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

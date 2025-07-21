import { useState, useEffect } from 'react';

/**
 * 주어진 값(value)을 지정한 시간(delay)만큼 지연시켜 반환하는 커스텀 훅입니다.
 * 입력값이 변경될 때마다 delay(ms) 후에만 최신값을 반환합니다.
 *
 * @template T 반환할 값의 타입
 * @param {T} value 디바운스 처리할 값
 * @param {number} delay 디바운스 지연 시간(ms)
 * @returns {T} 디바운스된 값
 *
 * @example
 * const debouncedValue = useDebounce(inputValue, 300);
 */
export function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
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
 * 주어진 콜백 함수를 지정한 시간(delay)만큼 디바운스하여 반환하는 커스텀 훅입니다.
 * 반환된 함수는 연속 호출 시 마지막 호출만 delay(ms) 후 실행됩니다.
 *
 * @template T 콜백 함수 타입
 * @param {T} callback 디바운스 처리할 콜백 함수
 * @param {number} delay 디바운스 지연 시간(ms)
 * @returns {T} 디바운스된 콜백 함수
 *
 * @example
 * const debouncedOnChange = useDebounceCallback((value) => { ... }, 300);
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
	callback: T,
	delay: number,
): T {
	const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

	const debouncedCallback = ((...args: Parameters<T>) => {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		const newTimer = setTimeout(() => {
			callback(...args);
		}, delay);

		setDebounceTimer(newTimer);
	}) as T;

	useEffect(() => {
		return () => {
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}
		};
	}, [debounceTimer]);

	return debouncedCallback;
}

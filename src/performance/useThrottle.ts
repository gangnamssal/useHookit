import { useRef, useCallback, useState, useEffect } from 'react';

/**
 *
 * 주어진 콜백 함수를 지정한 delay(ms) 동안 한 번만 실행되도록 throttle하는 커스텀 훅입니다.
 *
 * A custom hook that throttles a callback function to execute only once during the specified delay(ms).
 *
 * @template T - 콜백 함수의 타입 / Type of the callback function
 *
 * @param {T} callback - throttle할 콜백 함수 / Callback function to throttle
 *
 * @param {number} delay - throttle 간격(ms) / Throttle interval (ms)
 *
 * @returns {T} throttle된 콜백 함수 / Throttled callback function
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
 * const throttledFn = useThrottle((value) => {
 *   console.log('throttle된 값:', value);
 * }, 500);
 *
 * throttledFn('hello');
 * ```
 *
 * @example
 * ```tsx
 * // 스크롤 이벤트에서 사용 / Usage in scroll events
 * const throttledScrollHandler = useThrottle((event) => {
 *   console.log('스크롤 위치:', event.target.scrollTop);
 * }, 100);
 *
 * useEffect(() => {
 *   window.addEventListener('scroll', throttledScrollHandler);
 *   return () => window.removeEventListener('scroll', throttledScrollHandler);
 * }, [throttledScrollHandler]);
 * ```
 *
 */
export function useThrottle<T extends (...args: any[]) => any>(callback: T, delay: number): T {
	const lastRun = useRef<number>(0);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// delay 유효성 검사
	if (delay < 0) {
		if (typeof console !== 'undefined' && console.warn) {
			console.warn('useThrottle: delay must be non-negative');
		}
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
				// 아직 throttle 시간이 지나지 않았으면 마지막 호출을 스케줄링
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}

				timeoutRef.current = setTimeout(() => {
					lastRun.current = now;
					callback(...args);
				}, delay - (now - lastRun.current));
			} else {
				// throttle 시간이 지났으면 즉시 실행
				lastRun.current = now;
				callback(...args);
			}
		}) as T,
		[callback, delay],
	);

	return throttledCallback;
}

/**
 *
 * 입력값이 변경될 때 지정한 delay(ms) 동안 한 번만 업데이트되는 throttled value를 반환하는 커스텀 훅입니다.
 *
 * A custom hook that returns a throttled value that updates only once during the specified delay(ms) when the input value changes.
 *
 * @template T - throttle할 값의 타입 / Type of the value to throttle
 *
 * @param {T} value - throttle할 값 / Value to throttle
 *
 * @param {number} delay - throttle 간격(ms) / Throttle interval (ms)
 *
 * @returns {T} throttle된 값 / Throttled value
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
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
 * // 실시간 입력에서 사용 / Usage in real-time input
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

import { useRef, useCallback, useState, useEffect } from 'react';

/**
 * 주어진 콜백 함수를 지정한 delay(ms) 동안 한 번만 실행되도록 throttle하는 커스텀 훅입니다.
 *
 * @template T
 * @param {T} callback - throttle할 콜백 함수
 * @param {number} delay - throttle 간격(ms)
 * @returns {T} throttle된 콜백 함수
 *
 * @example
 * const throttledFn = useThrottle((value) => { ... }, 500);
 * throttledFn('hello');
 */
export function useThrottle<T extends (...args: any[]) => any>(callback: T, delay: number): T {
	const lastRun = useRef<number>(0);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
 * 입력값이 변경될 때 지정한 delay(ms) 동안 한 번만 업데이트되는 throttled value를 반환하는 커스텀 훅입니다.
 *
 * @template T
 * @param {T} value - throttle할 값
 * @param {number} delay - throttle 간격(ms)
 * @returns {T} throttle된 값
 *
 * @example
 * const throttledValue = useThrottleValue(inputValue, 300);
 */
export function useThrottleValue<T>(value: T, delay: number): T {
	const [throttledValue, setThrottledValue] = useState<T>(value);
	const lastRun = useRef<number>(0);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		const now = Date.now();

		if (lastRun.current && now - lastRun.current < delay) {
			// 아직 throttle 시간이 지나지 않았으면 마지막 업데이트를 스케줄링
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				lastRun.current = now;
				setThrottledValue(value);
			}, delay - (now - lastRun.current));
		} else {
			// throttle 시간이 지났으면 즉시 업데이트
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

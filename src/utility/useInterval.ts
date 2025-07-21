import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * 주어진 delay(ms)마다 callback을 실행하는 interval 타이머 훅입니다.
 * delay가 null이면 타이머가 동작하지 않습니다.
 *
 * @param callback - 주기적으로 실행할 함수
 * @param delay - interval 간격(ms), null이면 비활성화
 *
 * @example
 * useInterval(() => { ... }, 1000);
 */
export function useInterval(callback: () => void, delay: number | null): void {
	const savedCallback = useRef(callback);

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		if (delay === null) {
			return;
		}

		const id = setInterval(() => {
			savedCallback.current();
		}, delay);

		return () => clearInterval(id);
	}, [delay]);
}

/**
 * delay(ms) 후에 callback을 한 번 실행하는 timeout 타이머 훅입니다.
 * delay가 null이면 타이머가 동작하지 않습니다.
 *
 * @param callback - 지연 후 실행할 함수
 * @param delay - 지연 시간(ms), null이면 비활성화
 *
 * @example
 * useTimeout(() => { ... }, 500);
 */
export function useTimeout(callback: () => void, delay: number | null): void {
	const savedCallback = useRef(callback);

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		if (delay === null) {
			return;
		}

		const id = setTimeout(() => {
			savedCallback.current();
		}, delay);

		return () => clearTimeout(id);
	}, [delay]);
}

/**
 * 수동으로 시작/정지할 수 있는 interval 타이머 훅입니다.
 *
 * @param callback - 주기적으로 실행할 함수
 * @param delay - interval 간격(ms), null이면 비활성화
 * @returns
 *   start: 타이머 시작 함수
 *   stop: 타이머 정지 함수
 *   isRunning: 타이머 실행 여부
 *
 * @example
 * const { start, stop, isRunning } = useControlledInterval(() => { ... }, 1000);
 */
export function useControlledInterval(
	callback: () => void,
	delay: number | null,
): {
	start: () => void;
	stop: () => void;
	isRunning: boolean;
} {
	const [isRunning, setIsRunning] = useState(false);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const savedCallback = useRef(callback);

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	const start = useCallback(() => {
		if (delay === null || isRunning) return;

		setIsRunning(true);
		intervalRef.current = setInterval(() => {
			savedCallback.current();
		}, delay);
	}, [delay, isRunning]);

	const stop = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		setIsRunning(false);
	}, []);

	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	return { start, stop, isRunning };
}

/**
 * 수동으로 시작/정지할 수 있는 timeout 타이머 훅입니다.
 *
 * @param callback - 지연 후 실행할 함수
 * @param delay - 지연 시간(ms), null이면 비활성화
 * @returns
 *   start: 타이머 시작 함수
 *   stop: 타이머 정지 함수
 *   isRunning: 타이머 실행 여부
 *
 * @example
 * const { start, stop, isRunning } = useControlledTimeout(() => { ... }, 1000);
 */
export function useControlledTimeout(
	callback: () => void,
	delay: number | null,
): {
	start: () => void;
	stop: () => void;
	isRunning: boolean;
} {
	const [isRunning, setIsRunning] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const savedCallback = useRef(callback);

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	const start = useCallback(() => {
		if (delay === null || isRunning) return;

		setIsRunning(true);
		timeoutRef.current = setTimeout(() => {
			savedCallback.current();
			setIsRunning(false);
		}, delay);
	}, [delay, isRunning]);

	const stop = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setIsRunning(false);
	}, []);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return { start, stop, isRunning };
}

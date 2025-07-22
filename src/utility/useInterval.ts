import { useEffect, useRef, useState, useCallback } from 'react';

/**
 *
 * 주어진 delay(ms)마다 callback을 실행하는 interval 타이머 훅입니다.
 *
 * A hook that executes a callback at specified intervals (delay in ms).
 *
 * delay가 null이면 타이머가 동작하지 않습니다.
 *
 * If delay is null, the timer is disabled.
 *
 * @param {() => void} callback - 주기적으로 실행할 함수 / Function to execute periodically
 *
 * @param {number | null} delay - interval 간격(ms), null이면 비활성화 / Interval in milliseconds, null to disable
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
 * useInterval(() => {
 *   console.log('1초마다 실행');
 * }, 1000);
 * ```
 *
 * @example
 * ```tsx
 * // 조건부 실행 / Conditional execution
 * const [isActive, setIsActive] = useState(false);
 * useInterval(() => {
 *   fetchData();
 * }, isActive ? 5000 : null);
 * ```
 *
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

		// 음수 delay에 대한 경고
		if (delay < 0) {
			console.warn('useInterval: delay must be non-negative');
			return;
		}

		const id = setInterval(() => {
			savedCallback.current();
		}, delay);

		return () => clearInterval(id);
	}, [delay]);
}

/**
 *
 * delay(ms) 후에 callback을 한 번 실행하는 timeout 타이머 훅입니다.
 *
 * A hook that executes a callback once after a specified delay (ms).
 *
 * delay가 null이면 타이머가 동작하지 않습니다.
 *
 * If delay is null, the timer is disabled.
 *
 * @param {() => void} callback - 지연 후 실행할 함수 / Function to execute after delay
 *
 * @param {number | null} delay - 지연 시간(ms), null이면 비활성화 / Delay in milliseconds, null to disable
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
 * useTimeout(() => {
 *   console.log('3초 후 실행');
 * }, 3000);
 * ```
 *
 * @example
 * ```tsx
 * // 조건부 실행 / Conditional execution
 * const [shouldShow, setShouldShow] = useState(false);
 * useTimeout(() => {
 *   setShouldShow(true);
 * }, shouldShow ? null : 2000);
 * ```
 *
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

		// 음수 delay에 대한 경고
		if (delay < 0) {
			console.warn('useTimeout: delay must be non-negative');
			return;
		}

		const id = setTimeout(() => {
			savedCallback.current();
		}, delay);

		return () => clearTimeout(id);
	}, [delay]);
}

/**
 *
 * 수동으로 시작/정지할 수 있는 interval 타이머 훅입니다.
 *
 * A hook that provides a manually controllable interval timer.
 *
 * @param {() => void} callback - 주기적으로 실행할 함수 / Function to execute periodically
 *
 * @param {number | null} delay - interval 간격(ms), null이면 비활성화 / Interval in milliseconds, null to disable
 *
 * @returns {Object} 타이머 제어 객체 / Timer control object
 *
 * @returns {() => void} start - 타이머 시작 함수 / Function to start the timer
 *
 * @returns {() => void} stop - 타이머 정지 함수 / Function to stop the timer
 *
 * @returns {boolean} isRunning - 타이머 실행 여부 / Whether the timer is running
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
 * const { start, stop, isRunning } = useControlledInterval(() => {
 *   console.log('1초마다 실행');
 * }, 1000);
 *
 * return (
 *   <div>
 *     <button onClick={start} disabled={isRunning}>시작</button>
 *     <button onClick={stop} disabled={!isRunning}>정지</button>
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // 조건부 실행 / Conditional execution
 * const { start, stop, isRunning } = useControlledInterval(() => {
 *   fetchData();
 * }, isActive ? 5000 : null);
 *
 * useEffect(() => {
 *   if (isActive) {
 *     start();
 *   } else {
 *     stop();
 *   }
 * }, [isActive]);
 * ```
 *
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
 *
 * 수동으로 시작/정지할 수 있는 timeout 타이머 훅입니다.
 *
 * @param callback - 지연 후 실행할 함수
 *
 * @param delay - 지연 시간(ms), null이면 비활성화
 *
 * @returns
 *   start: 타이머 시작 함수
 *   stop: 타이머 정지 함수
 *   isRunning: 타이머 실행 여부
 *
 * @example
 * const { start, stop, isRunning } = useControlledTimeout(() => { ... }, 1000);
 *
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

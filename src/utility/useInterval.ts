import { useEffect, useRef, useState, useCallback } from 'react';
import { useIsMounted } from '../lifecycle/useIsMounted';

/**
 * A hook that executes a callback at specified intervals (delay in ms).
 *
 * If delay is null, the timer is disabled.
 *
 * @param {() => void} callback - Function to execute periodically
 *
 * @param {number | null} delay - Interval in milliseconds, null to disable
 *
 * @example
 * ```tsx
 * // Basic usage
 * useInterval(() => {
 *   console.log('Executing every second');
 * }, 1000);
 * ```
 *
 * @example
 * ```tsx
 * // Conditional execution
 * const [isActive, setIsActive] = useState(false);
 * useInterval(() => {
 *   fetchData();
 * }, isActive ? 5000 : null);
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-useinterval--docs
 */
export function useInterval(callback: () => void, delay: number | null): void {
	const isMounted = useIsMounted();

	const savedCallback = useRef(callback);

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		if (delay === null || !isMounted) {
			return;
		}

		// Warning for negative delay
		if (delay < 0) {
			if (isMounted) {
				console.warn('useInterval: delay must be non-negative');
			}
			return;
		}

		const id = setInterval(() => {
			if (isMounted) {
				savedCallback.current();
			}
		}, delay);

		return () => clearInterval(id);
	}, [delay, isMounted]);
}

/**
 * A hook that executes a callback once after a specified delay (ms).
 *
 * If delay is null, the timer is disabled.
 *
 * @param {() => void} callback - Function to execute after delay
 *
 * @param {number | null} delay - Delay in milliseconds, null to disable
 *
 * @example
 * ```tsx
 * // Basic usage
 * useTimeout(() => {
 *   console.log('Executing after 3 seconds');
 * }, 3000);
 * ```
 *
 * @example
 * ```tsx
 * // Conditional execution
 * const [shouldShow, setShouldShow] = useState(false);
 * useTimeout(() => {
 *   setShouldShow(true);
 * }, shouldShow ? null : 2000);
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-useinterval--docs#related-hooks
 */
export function useTimeout(callback: () => void, delay: number | null): void {
	const isMounted = useIsMounted();

	const savedCallback = useRef(callback);

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		if (delay === null || !isMounted) {
			return;
		}

		// Warning for negative delay
		if (delay < 0) {
			if (isMounted) {
				console.warn('useTimeout: delay must be non-negative');
			}
			return;
		}

		const id = setTimeout(() => {
			if (isMounted) {
				savedCallback.current();
			}
		}, delay);

		return () => clearTimeout(id);
	}, [delay, isMounted]);
}

/**
 * A hook that provides a manually controllable interval timer.
 *
 * @param {() => void} callback - Function to execute periodically
 *
 * @param {number | null} delay - Interval in milliseconds, null to disable
 *
 * @returns {() => void} start - Function to start the timer
 *
 * @returns {() => void} stop - Function to stop the timer
 *
 * @returns {boolean} isRunning - Whether the timer is running
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { start, stop, isRunning } = useControlledInterval(() => {
 *   console.log('Executing every second');
 * }, 1000);
 *
 * return (
 *   <div>
 *     <button onClick={start} disabled={isRunning}>Start</button>
 *     <button onClick={stop} disabled={!isRunning}>Stop</button>
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
 * @link https://use-hookit.vercel.app/?path=/docs/utility-useinterval--docs#related-hooks
 */
export function useControlledInterval(
	callback: () => void,
	delay: number | null,
): {
	start: () => void;
	stop: () => void;
	isRunning: boolean;
} {
	const isMounted = useIsMounted();

	const [isRunning, setIsRunning] = useState(false);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const savedCallback = useRef(callback);

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	const start = useCallback(() => {
		if (delay === null || isRunning || !isMounted) return;

		setIsRunning(true);
		intervalRef.current = setInterval(() => {
			if (isMounted) {
				savedCallback.current();
			}
		}, delay);
	}, [delay, isRunning, isMounted]);

	const stop = useCallback(() => {
		if (intervalRef.current && isMounted) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		setIsRunning(false);
	}, [isMounted]);

	useEffect(() => {
		return () => {
			if (intervalRef.current && isMounted) {
				clearInterval(intervalRef.current);
			}
		};
	}, [isMounted]);

	return { start, stop, isRunning };
}

/**
 * A hook that provides manual control over timeout timers.
 *
 * @param {() => void} callback - Function to execute after delay
 *
 * @param {number | null} delay - Delay in milliseconds, null to disable
 *
 * @returns {() => void} start - Function to start the timer
 *
 * @returns {() => void} stop - Function to stop the timer
 *
 * @returns {boolean} isRunning - Whether the timer is running
 *
 * @example
 * ```tsx
 * const { start, stop, isRunning } = useControlledTimeout(() => {
 *   console.log('Executing after 3 seconds');
 * }, 3000);
 * ```
 *
 * @example
 * ```tsx
 * const { start, stop, isRunning } = useControlledTimeout(() => {
 *   setShouldShow(true);
 * }, shouldShow ? null : 2000);
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-useinterval--docs#related-hooks
 */
export function useControlledTimeout(
	callback: () => void,
	delay: number | null,
): {
	start: () => void;
	stop: () => void;
	isRunning: boolean;
} {
	const isMounted = useIsMounted();
	const [isRunning, setIsRunning] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const savedCallback = useRef(callback);

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	const start = useCallback(() => {
		if (delay === null || isRunning || !isMounted) return;

		setIsRunning(true);
		timeoutRef.current = setTimeout(() => {
			if (isMounted) {
				savedCallback.current();
				setIsRunning(false);
			}
		}, delay);
	}, [delay, isRunning, isMounted]);

	const stop = useCallback(() => {
		if (timeoutRef.current && isMounted) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setIsRunning(false);
	}, [isMounted]);

	useEffect(() => {
		return () => {
			if (timeoutRef.current && isMounted) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [isMounted]);

	return { start, stop, isRunning };
}

import { useState, useEffect, useCallback, useRef } from 'react';
import { useIsMounted } from '../lifecycle/useIsMounted';

interface UseLoadingOptions {
	/** Initial loading state (default: false) */
	initialLoading?: boolean;

	/** Delay before loading state changes (milliseconds, default: 0) */
	delay?: number;

	/** Minimum loading display time (milliseconds, default: 0) */
	minLoadingTime?: number;

	/** Callback when loading state changes */
	onLoadingChange?: (loading: boolean) => void;
}

interface LoadingState {
	/** Current loading state */
	isLoading: boolean;

	/** Loading start time */
	startTime: Date | null;

	/** Loading duration (milliseconds) */
	duration: number;

	/** Loading end time */
	endTime: Date | null;
}

/**
 * A hook for declaratively managing loading states
 *
 * @param {UseLoadingOptions} [options] - Hook options
 *
 * @param {boolean} [options.initialLoading] - Initial loading state (default: false)
 *
 * @param {number} [options.delay] - Delay before loading state changes (ms, default: 0)
 *
 * @param {number} [options.minLoadingTime] - Minimum loading display time (ms, default: 0)
 *
 * @param {() => void} [options.onLoadingChange] - Callback when loading state changes
 *
 * @returns {boolean} isLoading - Current loading state
 *
 * @returns {() => void} startLoading - Function to start loading
 *
 * @returns {() => void} stopLoading - Function to stop loading
 *
 * @returns {() => void} toggleLoading - Function to toggle loading state
 *
 * @returns {LoadingState} state - Detailed loading state information
 *
 * @returns {<T>(promise: Promise<T>) => Promise<T>} withLoading - Function to execute promise with loading state
 *
 * @returns {<T>(asyncFn: () => Promise<T>) => Promise<T>} wrapAsync - Function to wrap async function with loading state
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { isLoading, startLoading, stopLoading } = useLoading();
 *
 * const handleSubmit = async () => {
 *   startLoading();
 *   try {
 *     await submitData();
 *   } finally {
 *     stopLoading();
 *   }
 * };
 *
 * return (
 *   <button onClick={handleSubmit} disabled={isLoading}>
 *     {isLoading ? 'Submitting...' : 'Submit'}
 *   </button>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Using withLoading
 * const { isLoading, withLoading } = useLoading();
 *
 * const handleSubmit = async () => {
 *   await withLoading(submitData());
 * };
 *
 * return (
 *   <button onClick={handleSubmit} disabled={isLoading}>
 *     {isLoading ? 'Submitting...' : 'Submit'}
 *   </button>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Using wrapAsync
 * const { isLoading, wrapAsync } = useLoading();
 *
 * const handleSubmit = wrapAsync(async () => {
 *   const result = await submitData();
 *   return result;
 * });
 *
 * return (
 *   <button onClick={handleSubmit} disabled={isLoading}>
 *     {isLoading ? 'Submitting...' : 'Submit'}
 *   </button>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Setting delay and minimum loading time
 * const { isLoading, withLoading } = useLoading({
 *   delay: 200, // Show loading state after 200ms
 *   minLoadingTime: 1000, // Show loading for at least 1 second
 * });
 *
 * const handleSubmit = async () => {
 *   await withLoading(submitData());
 * };
 * ```
 *
 * @example
 * ```tsx
 * // Loading state change callback
 * const { isLoading, withLoading } = useLoading({
 *   onLoadingChange: (loading) => {
 *     console.log(`Loading state: ${loading ? 'started' : 'completed'}`);
 *   },
 * });
 *
 * const handleSubmit = async () => {
 *   await withLoading(submitData());
 * };
 * ```
 *
 * @example
 * ```tsx
 * // Managing multiple loading states
 * const { isLoading: isSubmitting, withLoading: withSubmitting } = useLoading();
 * const { isLoading: isDeleting, withLoading: withDeleting } = useLoading();
 *
 * return (
 *   <div>
 *     <button
 *       onClick={() => withSubmitting(submitData())}
 *       disabled={isSubmitting || isDeleting}
 *     >
 *       {isSubmitting ? 'Submitting...' : 'Submit'}
 *     </button>
 *     <button
 *       onClick={() => withDeleting(deleteData())}
 *       disabled={isSubmitting || isDeleting}
 *     >
 *       {isDeleting ? 'Deleting...' : 'Delete'}
 *     </button>
 *   </div>
 * );
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-useloading--docs
 */
export function useLoading(options: UseLoadingOptions = {}): {
	isLoading: boolean;
	startLoading: () => void;
	stopLoading: () => void;
	toggleLoading: () => void;
	state: LoadingState;
	withLoading: <T>(promise: Promise<T>) => Promise<T>;
	wrapAsync: <T>(asyncFn: () => Promise<T>) => Promise<T>;
} {
	const { initialLoading = false, delay = 0, minLoadingTime = 0, onLoadingChange } = options;

	// useIsMounted 훅을 활용하여 SSR 안정성 확보
	const isMounted = useIsMounted();

	// Warning for negative values
	useEffect(() => {
		if (delay < 0) {
			if (isMounted) {
				console.warn('useLoading: delay must be non-negative');
			}
		}
		if (minLoadingTime < 0) {
			if (isMounted) {
				console.warn('useLoading: minLoadingTime must be non-negative');
			}
		}
	}, [delay, minLoadingTime, isMounted]);

	const [isLoading, setIsLoading] = useState(initialLoading);
	const [state, setState] = useState<LoadingState>({
		isLoading: initialLoading,
		startTime: initialLoading ? new Date() : null,
		duration: 0,
		endTime: null,
	});

	const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const minLoadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const startTimeRef = useRef<Date | null>(initialLoading ? new Date() : null);

	/**
	 * Function to update loading state
	 */
	const setLoadingState = useCallback(
		(loading: boolean) => {
			if (!isMounted) return;

			const now = new Date();

			if (loading) {
				startTimeRef.current = now;
				setState((prevState) => ({
					...prevState,
					isLoading: true,
					startTime: now,
					duration: 0,
					endTime: null,
				}));
			} else {
				const endTime = now;
				const duration = startTimeRef.current
					? endTime.getTime() - startTimeRef.current.getTime()
					: 0;

				setState((prevState) => ({
					...prevState,
					isLoading: false,
					startTime: startTimeRef.current,
					duration,
					endTime,
				}));
				startTimeRef.current = null;
			}

			setIsLoading(loading);
			if (isMounted && onLoadingChange) {
				onLoadingChange(loading);
			}
		},
		[onLoadingChange, isMounted],
	);

	/**
	 * Function to start loading
	 */
	const startLoading = useCallback(() => {
		if (!isMounted) return;

		// If delay is set
		if (delay > 0) {
			delayTimerRef.current = setTimeout(() => {
				if (isMounted) {
					setLoadingState(true);
				}
			}, delay);
		} else {
			setLoadingState(true);
		}
	}, [delay, setLoadingState, isMounted]);

	/**
	 * Function to stop loading
	 */
	const stopLoading = useCallback(() => {
		if (!isMounted) return;

		// Clear delay timer if exists
		if (delayTimerRef.current) {
			clearTimeout(delayTimerRef.current);
			delayTimerRef.current = null;
			return;
		}

		// If minimum loading time is set
		if (minLoadingTime > 0) {
			const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current.getTime() : 0;

			const remaining = Math.max(0, minLoadingTime - elapsed);

			if (remaining > 0) {
				minLoadingTimerRef.current = setTimeout(() => {
					if (isMounted) {
						setLoadingState(false);
					}
				}, remaining);
				return;
			}
		}

		setLoadingState(false);
	}, [minLoadingTime, setLoadingState, isMounted]);

	/**
	 * Function to toggle loading state
	 */
	const toggleLoading = useCallback(() => {
		if (isLoading) {
			stopLoading();
		} else {
			startLoading();
		}
	}, [isLoading, startLoading, stopLoading]);

	/**
	 * Function to execute promise with loading state
	 */
	const withLoading = useCallback(
		async <T>(promise: Promise<T>): Promise<T> => {
			if (!isMounted) {
				return promise;
			}

			// Clear delay timer if exists
			if (delayTimerRef.current) {
				clearTimeout(delayTimerRef.current);
				delayTimerRef.current = null;
			}

			// Start loading state immediately
			setLoadingState(true);

			try {
				const result = await promise;
				return result;
			} finally {
				// If minimum loading time is set
				if (minLoadingTime > 0) {
					const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current.getTime() : 0;
					const remaining = Math.max(0, minLoadingTime - elapsed);

					if (remaining > 0) {
						minLoadingTimerRef.current = setTimeout(() => {
							if (isMounted) {
								setLoadingState(false);
							}
						}, remaining);
					} else {
						setLoadingState(false);
					}
				} else {
					setLoadingState(false);
				}
			}
		},
		[setLoadingState, minLoadingTime, isMounted],
	);

	/**
	 * Function to execute async function with loading state
	 */
	const wrapAsync = useCallback(
		<T>(asyncFn: () => Promise<T>): Promise<T> => {
			return withLoading(asyncFn());
		},
		[withLoading],
	);

	// Clean up timers on component unmount
	useEffect(() => {
		return () => {
			if (delayTimerRef.current && isMounted) {
				clearTimeout(delayTimerRef.current);
			}
			if (minLoadingTimerRef.current && isMounted) {
				clearTimeout(minLoadingTimerRef.current);
			}
		};
	}, [isMounted]);

	return {
		isLoading,
		startLoading,
		stopLoading,
		toggleLoading,
		state,
		withLoading,
		wrapAsync,
	};
}

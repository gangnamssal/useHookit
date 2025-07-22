import { useState, useEffect, useCallback, useRef } from 'react';

interface UseLoadingOptions {
	/** 초기 로딩 상태 (기본값: false) */
	initialLoading?: boolean;
	/** 로딩 상태 변경 시 지연 시간 (밀리초, 기본값: 0) */
	delay?: number;
	/** 최소 로딩 표시 시간 (밀리초, 기본값: 0) */
	minLoadingTime?: number;
	/** 로딩 상태 변경 시 콜백 함수 */
	onLoadingChange?: (loading: boolean) => void;
}

interface LoadingState {
	/** 현재 로딩 상태 */
	isLoading: boolean;
	/** 로딩 시작 시간 */
	startTime: Date | null;
	/** 로딩 지속 시간 (밀리초) */
	duration: number;
	/** 로딩 완료 시간 */
	endTime: Date | null;
}

/**
 * 로딩 상태를 선언적으로 관리하는 훅
 *
 * A hook for declaratively managing loading states
 *
 * @param options - 훅 옵션 / Hook options
 *
 * @param options.initialLoading - 초기 로딩 상태 (기본값: false) / Initial loading state (default: false)
 *
 * @param options.delay - 로딩 상태 변경 시 지연 시간 (밀리초, 기본값: 0) / Delay before loading state changes (ms, default: 0)
 *
 * @param options.minLoadingTime - 최소 로딩 표시 시간 (밀리초, 기본값: 0) / Minimum loading display time (ms, default: 0)
 *
 * @param options.onLoadingChange - 로딩 상태 변경 시 콜백 함수 / Callback when loading state changes
 *
 * @returns 로딩 상태 관리 객체 / Loading state management object
 *
 * @returns {boolean} isLoading - 현재 로딩 상태 / Current loading state
 *
 * @returns {() => void} startLoading - 로딩 시작 함수 / Function to start loading
 *
 * @returns {() => void} stopLoading - 로딩 중지 함수 / Function to stop loading
 *
 * @returns {() => void} toggleLoading - 로딩 상태 토글 함수 / Function to toggle loading state
 *
 * @returns {LoadingState} state - 상세 로딩 상태 정보 / Detailed loading state information
 *
 * @returns {<T>(promise: Promise<T>) => Promise<T>} withLoading - Promise를 로딩 상태와 함께 실행하는 함수 / Function to execute promise with loading state
 *
 * @returns {<T>(asyncFn: () => Promise<T>) => Promise<T>} wrapAsync - 비동기 함수를 로딩 상태와 함께 실행하는 함수 / Function to wrap async function with loading state
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
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
 *     {isLoading ? '제출 중...' : '제출'}
 *   </button>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // withLoading 사용법 / Using withLoading
 * const { isLoading, withLoading } = useLoading();
 *
 * const handleSubmit = async () => {
 *   await withLoading(submitData());
 * };
 *
 * return (
 *   <button onClick={handleSubmit} disabled={isLoading}>
 *     {isLoading ? '제출 중...' : '제출'}
 *   </button>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // wrapAsync 사용법 / Using wrapAsync
 * const { isLoading, wrapAsync } = useLoading();
 *
 * const handleSubmit = wrapAsync(async () => {
 *   const result = await submitData();
 *   return result;
 * });
 *
 * return (
 *   <button onClick={handleSubmit} disabled={isLoading}>
 *     {isLoading ? '제출 중...' : '제출'}
 *   </button>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // 지연 시간과 최소 로딩 시간 설정 / Setting delay and minimum loading time
 * const { isLoading, withLoading } = useLoading({
 *   delay: 200, // 200ms 후에 로딩 상태 표시
 *   minLoadingTime: 1000, // 최소 1초간 로딩 표시
 * });
 *
 * const handleSubmit = async () => {
 *   await withLoading(submitData());
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 로딩 상태 변경 콜백 / Loading state change callback
 * const { isLoading, withLoading } = useLoading({
 *   onLoadingChange: (loading) => {
 *     console.log(`로딩 상태: ${loading ? '시작' : '완료'}`);
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
 * // 여러 로딩 상태 관리 / Managing multiple loading states
 * const { isLoading: isSubmitting, withLoading: withSubmitting } = useLoading();
 * const { isLoading: isDeleting, withLoading: withDeleting } = useLoading();
 *
 * return (
 *   <div>
 *     <button
 *       onClick={() => withSubmitting(submitData())}
 *       disabled={isSubmitting || isDeleting}
 *     >
 *       {isSubmitting ? '제출 중...' : '제출'}
 *     </button>
 *     <button
 *       onClick={() => withDeleting(deleteData())}
 *       disabled={isSubmitting || isDeleting}
 *     >
 *       {isDeleting ? '삭제 중...' : '삭제'}
 *     </button>
 *   </div>
 * );
 * ```
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

	// 음수 값에 대한 경고
	useEffect(() => {
		if (delay < 0) {
			console.warn('useLoading: delay must be non-negative');
		}
		if (minLoadingTime < 0) {
			console.warn('useLoading: minLoadingTime must be non-negative');
		}
	}, [delay, minLoadingTime]);

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
	 * 로딩 상태를 변경하는 함수
	 */
	const setLoadingState = useCallback(
		(loading: boolean) => {
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
			onLoadingChange?.(loading);
		},
		[onLoadingChange],
	);

	/**
	 * 로딩을 시작하는 함수
	 */
	const startLoading = useCallback(() => {
		if (isLoading) return;

		// 지연 시간이 설정된 경우
		if (delay > 0) {
			delayTimerRef.current = setTimeout(() => {
				setLoadingState(true);
			}, delay);
		} else {
			setLoadingState(true);
		}
	}, [isLoading, delay, setLoadingState]);

	/**
	 * 로딩을 중지하는 함수
	 */
	const stopLoading = useCallback(() => {
		// 지연 타이머가 있는 경우 정리
		if (delayTimerRef.current) {
			clearTimeout(delayTimerRef.current);
			delayTimerRef.current = null;
			return;
		}

		if (!isLoading) return;

		// 최소 로딩 시간이 설정된 경우
		if (minLoadingTime > 0) {
			const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current.getTime() : 0;

			const remaining = Math.max(0, minLoadingTime - elapsed);

			if (remaining > 0) {
				minLoadingTimerRef.current = setTimeout(() => {
					setLoadingState(false);
				}, remaining);
				return;
			}
		}

		setLoadingState(false);
	}, [isLoading, minLoadingTime, setLoadingState]);

	/**
	 * 로딩 상태를 토글하는 함수
	 */
	const toggleLoading = useCallback(() => {
		if (isLoading) {
			stopLoading();
		} else {
			startLoading();
		}
	}, [isLoading, startLoading, stopLoading]);

	/**
	 * Promise를 로딩 상태와 함께 실행하는 함수
	 */
	const withLoading = useCallback(
		async <T>(promise: Promise<T>): Promise<T> => {
			// 지연 타이머가 있는 경우 정리
			if (delayTimerRef.current) {
				clearTimeout(delayTimerRef.current);
				delayTimerRef.current = null;
			}

			// 즉시 로딩 상태 시작
			setLoadingState(true);

			try {
				const result = await promise;
				return result;
			} finally {
				// 최소 로딩 시간이 설정된 경우
				if (minLoadingTime > 0) {
					const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current.getTime() : 0;
					const remaining = Math.max(0, minLoadingTime - elapsed);

					if (remaining > 0) {
						minLoadingTimerRef.current = setTimeout(() => {
							setLoadingState(false);
						}, remaining);
					} else {
						setLoadingState(false);
					}
				} else {
					setLoadingState(false);
				}
			}
		},
		[setLoadingState, minLoadingTime],
	);

	/**
	 * 비동기 함수를 로딩 상태와 함께 실행하는 함수
	 */
	const wrapAsync = useCallback(
		<T>(asyncFn: () => Promise<T>): Promise<T> => {
			return new Promise<T>((resolve, reject) => {
				withLoading(asyncFn()).then(resolve).catch(reject);
			});
		},
		[withLoading],
	);

	// 컴포넌트 언마운트 시 타이머 정리
	useEffect(() => {
		return () => {
			if (delayTimerRef.current) {
				clearTimeout(delayTimerRef.current);
			}
			if (minLoadingTimerRef.current) {
				clearTimeout(minLoadingTimerRef.current);
			}
		};
	}, []);

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

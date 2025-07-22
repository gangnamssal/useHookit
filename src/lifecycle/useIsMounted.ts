import { useEffect, useState, useCallback } from 'react';

/**
 * 컴포넌트가 마운트되어 있는지 여부를 반환하는 커스텀 훅입니다.
 * A custom hook that returns whether the component is mounted.
 *
 * @returns {boolean} 컴포넌트가 마운트되어 있으면 true, 아니면 false / Returns true if the component is mounted, false otherwise
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
 * const isMounted = useIsMounted();
 *
 * useEffect(() => {
 *   if (isMounted) {
 *     // 마운트된 상태에서만 실행 / Only execute when mounted
 *     console.log('컴포넌트가 마운트됨');
 *   }
 * }, [isMounted]);
 * ```
 *
 * @example
 * ```tsx
 * // 비동기 작업에서 사용 / Usage in async operations
 * const isMounted = useIsMounted();
 *
 * const fetchData = async () => {
 *   const data = await api.getData();
 *
 *   if (isMounted) {
 *     // 컴포넌트가 여전히 마운트된 상태에서만 상태 업데이트 / Only update state if component is still mounted
 *     setData(data);
 *   }
 * };
 * ```
 */
export function useIsMounted(): boolean {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		// SSR 환경에서는 마운트 상태를 true로 설정하지 않음
		if (typeof window === 'undefined') {
			if (typeof console !== 'undefined' && console.warn) {
				console.warn('useIsMounted: window is not available (SSR environment)');
			}
			return;
		}

		setIsMounted(true);
		return () => setIsMounted(false);
	}, []);

	return isMounted;
}

/**
 *
 * 마운트된 상태에서만 안전하게 setState를 호출할 수 있는 커스텀 훅입니다.
 *
 * A custom hook that allows safe setState calls only when the component is mounted.
 *
 * @template T - 상태의 타입 / Type of the state
 *
 * @param {T} initialValue - 상태의 초기값 / Initial value for the state
 *
 * @returns {[T, (value: T | ((val: T) => T)) => void]} [state, setState] 형태의 배열 / Array in [state, setState] format
 *
 * @returns {T} state - 현재 상태값 / Current state value
 *
 * @returns {(value: T | ((val: T) => T)) => void} setState - 안전한 상태 업데이트 함수 / Safe state update function
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
 * const [count, setCount] = useSafeState(0);
 *
 * const handleClick = () => {
 *   setCount(1);
 *   setCount(prev => prev + 1);
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 비동기 작업에서 안전한 상태 업데이트 / Safe state update in async operations
 * const [data, setData] = useSafeState(null);
 *
 * const fetchData = async () => {
 *   const result = await api.getData();
 *   setData(result); // 컴포넌트가 마운트된 상태에서만 실행됨 / Only executes if component is mounted
 * };
 * ```
 */
export function useSafeState<T>(initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
	const [state, setState] = useState<T>(initialValue);
	const isMounted = useIsMounted();

	const safeSetState = useCallback(
		(value: T | ((val: T) => T)) => {
			if (isMounted) {
				setState(value);
			}
		},
		[isMounted],
	);

	return [state, safeSetState];
}

/**
 *
 * 마운트된 상태에서만 콜백이 동작하도록 보장하는 커스텀 훅입니다.
 *
 * A custom hook that ensures callbacks only work when the component is mounted.
 *
 * @template T - 콜백 함수의 타입 / Type of the callback function
 *
 * @param {T} callback - 실행할 콜백 함수 / Callback function to execute
 *
 * @returns {T} 마운트된 상태에서만 동작하는 콜백 함수 / Callback function that only works when mounted
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
 * const safeCallback = useSafeCallback((value: string) => {
 *   console.log('안전한 콜백:', value);
 * });
 *
 * safeCallback('test');
 * ```
 *
 * @example
 * ```tsx
 * // 비동기 콜백에서 사용 / Usage in async callbacks
 * const safeFetchData = useSafeCallback(async (id: number) => {
 *   const data = await api.getData(id);
 *   setData(data); // 컴포넌트가 마운트된 상태에서만 실행됨 / Only executes if component is mounted
 * });
 *
 * useEffect(() => {
 *   safeFetchData(1);
 * }, []);
 * ```
 *
 */
export function useSafeCallback<T extends (...args: any[]) => any>(callback: T): T {
	const isMounted = useIsMounted();

	return useCallback(
		((...args: Parameters<T>) => {
			if (isMounted) {
				return callback(...args);
			}
		}) as T,
		[callback, isMounted],
	);
}

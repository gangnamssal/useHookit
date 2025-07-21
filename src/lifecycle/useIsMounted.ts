import { useEffect, useState, useCallback } from 'react';

/**
 * 컴포넌트가 마운트되어 있는지 여부를 반환하는 커스텀 훅입니다.
 *
 * @returns {boolean} 컴포넌트가 마운트되어 있으면 true, 아니면 false
 * @example
 * const isMounted = useIsMounted();
 * if (isMounted) {
 *   // 마운트된 상태에서만 실행
 * }
 */
export function useIsMounted(): boolean {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
		return () => setIsMounted(false);
	}, []);

	return isMounted;
}

/**
 * 마운트된 상태에서만 안전하게 setState를 호출할 수 있는 커스텀 훅입니다.
 *
 * @template T
 * @param {T} initialValue - 상태의 초기값
 * @returns {[T, (value: T | ((val: T) => T)) => void]} [state, setState] 형태의 배열
 * @example
 * const [count, setCount] = useSafeState(0);
 * setCount(1);
 * setCount(prev => prev + 1);
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
 * 마운트된 상태에서만 콜백이 동작하도록 보장하는 커스텀 훅입니다.
 *
 * @template T
 * @param {T} callback - 실행할 콜백 함수
 * @returns {T} 마운트된 상태에서만 동작하는 콜백 함수
 * @example
 * const safeCallback = useSafeCallback((value: string) => { ... });
 * safeCallback('test');
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

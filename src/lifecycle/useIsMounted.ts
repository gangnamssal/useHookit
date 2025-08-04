import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * A custom hook that returns whether the component is mounted.
 *
 * @returns {boolean} Returns true if the component is mounted, false otherwise
 *
 * @example
 * ```tsx
 * // Basic usage
 * const isMounted = useIsMounted();
 *
 * useEffect(() => {
 *   if (isMounted) {
 *     // Only execute when mounted
 *     console.log('Component mounted');
 *   }
 * }, [isMounted]);
 * ```
 *
 * @example
 * ```tsx
 * // Usage in async operations
 * const isMounted = useIsMounted();
 *
 * const fetchData = async () => {
 *   const data = await api.getData();
 *
 *   if (isMounted) {
 *     // Only update state if component is still mounted
 *     setData(data);
 *   }
 * };
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/lifecycle-useismounted--docs
 */
export function useIsMounted(): boolean {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);

		return () => {
			setIsMounted(false);
		};
	}, []);

	return isMounted;
}

/**
 * Alternative high-performance version using useRef for minimal re-renders.
 * Use this when you need maximum performance and don't need reactive updates.
 *
 * @returns {() => boolean} Function that returns current mount status
 *
 * @example
 * ```tsx
 * const isMountedRef = useIsMountedRef();
 *
 * const fetchData = async () => {
 *   const data = await api.getData();
 *   if (isMountedRef()) {
 *     setData(data);
 *   }
 * };
 * ```
 */
export function useIsMountedRef(): () => boolean {
	const isMountedRef = useRef(false);

	useEffect(() => {
		isMountedRef.current = true;

		return () => {
			isMountedRef.current = false;
		};
	}, []);

	return useCallback(() => isMountedRef.current, []);
}

/**
 * A custom hook that allows safe setState calls only when the component is mounted.
 *
 * @template T - Type of the state
 *
 * @param {T} initialValue - Initial value for the state
 *
 * @returns {[T, (value: T | ((val: T) => T)) => void]} Array in [state, setState] format
 *
 * @returns {T} state - Current state value
 *
 * @returns {(value: T | ((val: T) => T)) => void} setState - Safe state update function
 *
 * @example
 * ```tsx
 * // Basic usage
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
 * // Safe state update in async operations
 * const [data, setData] = useSafeState(null);
 *
 * const fetchData = async () => {
 *   const result = await api.getData();
 *   setData(result); // Only executes if component is mounted
 * };
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/lifecycle-useismounted--docs#related-hooks
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
 * A custom hook that ensures callbacks only work when the component is mounted.
 *
 * @template T - Type of the callback function
 *
 * @param {T} callback - Callback function to execute
 *
 * @returns {T} Callback function that only works when mounted
 *
 * @example
 * ```tsx
 * // Basic usage
 * const safeCallback = useSafeCallback((value: string) => {
 *   console.log('Safe callback:', value);
 * });
 *
 * safeCallback('test');
 * ```
 *
 * @example
 * ```tsx
 * // Usage in async callbacks
 * const safeFetchData = useSafeCallback(async (id: number) => {
 *   const data = await api.getData(id);
 *   setData(data); // Only executes if component is mounted
 * });
 *
 * useEffect(() => {
 *   safeFetchData(1);
 * }, []);
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/lifecycle-useismounted--docs#related-hooks
 */
export function useSafeCallback<T extends (...args: any[]) => any>(callback: T): T {
	const isMountedRef = useIsMountedRef();

	return useCallback(
		((...args: Parameters<T>) => {
			if (isMountedRef()) {
				return callback(...args);
			}
		}) as T,
		[callback, isMountedRef],
	);
}

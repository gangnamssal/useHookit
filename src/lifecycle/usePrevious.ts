import { useRef, useEffect } from 'react';

interface UsePreviousOptions<T> {
	initialValue?: T;
}

/**
 *
 * 이전 렌더링에서의 값을 반환하는 훅입니다.
 *
 * A hook that returns the value from the previous render.
 *
 * @template T - 추적할 값의 타입 / Type of the value to track
 *
 * @param {T} value - 추적할 현재 값 / Current value to track
 *
 * @param {UsePreviousOptions<T>} options - 옵션 설정 / Options configuration
 *
 * @param {T} options.initialValue - 초기값 (첫 번째 렌더링에서 반환될 값) / Initial value (returned on first render)
 *
 * @returns {T | undefined} 이전 렌더링의 값 / Value from previous render
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
 * const prevCount = usePrevious(count);
 *
 * useEffect(() => {
 *   if (count !== prevCount) {
 *     console.log('카운트가 변경됨:', prevCount, '->', count);
 *   }
 * }, [count, prevCount]);
 * ```
 *
 * @example
 * ```tsx
 * // 초기값 설정 / Set initial value
 * const prevCount = usePrevious(count, { initialValue: 0 });
 * const prevArray = usePrevious(array, { initialValue: [] });
 * const prevObject = usePrevious(object, { initialValue: {} });
 * ```
 *
 * @example
 * ```tsx
 * // 조건부 렌더링 / Conditional rendering
 * const prevIsVisible = usePrevious(isVisible);
 *
 * useEffect(() => {
 *   if (isVisible && !prevIsVisible) {
 *     // 요소가 보이게 됨 / Element becomes visible
 *     animateIn();
 *   } else if (!isVisible && prevIsVisible) {
 *     // 요소가 숨겨짐 / Element becomes hidden
 *     animateOut();
 *   }
 * }, [isVisible, prevIsVisible]);
 * ```
 *
 */
export function usePrevious<T>(value: T, options: UsePreviousOptions<T> = {}): T | undefined {
	const { initialValue } = options;

	const ref = useRef<T | undefined>(initialValue);

	useEffect(() => {
		ref.current = value;
	}, [value]);

	return ref.current;
}

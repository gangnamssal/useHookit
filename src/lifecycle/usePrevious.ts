import { useRef, useEffect } from 'react';

interface UsePreviousOptions<T> {
	initialValue?: T;
}

/**
 * 이전 렌더링에서의 값을 반환하는 훅입니다.
 *
 * @template T
 * @param {T} value - 추적할 현재 값
 * @param {UsePreviousOptions<T>} options - 옵션 설정
 * @returns {T | undefined} 이전 렌더링의 값
 * @example
 * // 기본 사용법
 * const prevCount = usePrevious(count);
 *
 * // 초기값 설정
 * const prevCount = usePrevious(count, { initialValue: 0 });
 * const prevArray = usePrevious(array, { initialValue: [] });
 * const prevObject = usePrevious(object, { initialValue: {} });
 */
export function usePrevious<T>(value: T, options: UsePreviousOptions<T> = {}): T | undefined {
	const { initialValue } = options;

	const ref = useRef<T | undefined>(initialValue);

	useEffect(() => {
		ref.current = value;
	}, [value]);

	return ref.current;
}

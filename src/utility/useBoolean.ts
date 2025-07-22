import { useState, useCallback, useRef } from 'react';

interface UseBooleanOptions {
	/** 초기 불리언 값 (기본값: false) */
	initialValue?: boolean;
	/** 값 변경 시 콜백 함수 */
	onChange?: (value: boolean) => void;
}

/**
 * 불리언 상태를 선언적으로 관리하는 훅
 *
 * @param options - 훅 옵션
 * @param options.initialValue - 초기 불리언 값 (기본값: false)
 * @param options.onChange - 값 변경 시 콜백 함수
 *
 * @returns 불리언 상태 관리 객체
 * @returns {boolean} value - 현재 불리언 값
 * @returns {() => void} toggle - 값을 토글하는 함수
 * @returns {() => void} setTrue - 값을 true로 설정하는 함수
 * @returns {() => void} setFalse - 값을 false로 설정하는 함수
 * @returns {(value: boolean) => void} setValue - 값을 직접 설정하는 함수
 *
 * @example
 * ```tsx
 * const { value, toggle, setTrue, setFalse } = useBoolean();
 *
 * return (
 *   <div>
 *     <p>상태: {value ? '켜짐' : '꺼짐'}</p>
 *     <button onClick={toggle}>토글</button>
 *     <button onClick={setTrue}>켜기</button>
 *     <button onClick={setFalse}>끄기</button>
 *   </div>
 * );
 * ```
 */
export function useBoolean(options: UseBooleanOptions = {}): {
	value: boolean;
	toggle: () => void;
	setTrue: () => void;
	setFalse: () => void;
	setValue: (value: boolean) => void;
} {
	const { initialValue = false, onChange } = options;

	const [value, setValueState] = useState(initialValue);
	const onChangeRef = useRef(onChange);

	// onChange ref 업데이트
	onChangeRef.current = onChange;

	/**
	 * 값을 변경하는 공통 함수
	 */
	const updateValue = useCallback((newValue: boolean) => {
		setValueState(newValue);

		// onChange 콜백이 존재하는 경우에만 호출
		if (onChangeRef.current) {
			try {
				onChangeRef.current(newValue);
			} catch (error) {
				// onChange 콜백에서 에러가 발생해도 훅 자체는 정상 동작
				console.warn('useBoolean: onChange callback threw an error:', error);
			}
		}
	}, []);

	/**
	 * 값을 토글하는 함수
	 */
	const toggle = useCallback(() => {
		updateValue(!value);
	}, [value, updateValue]);

	/**
	 * 값을 true로 설정하는 함수
	 */
	const setTrue = useCallback(() => {
		if (value !== true) {
			updateValue(true);
		}
	}, [value, updateValue]);

	/**
	 * 값을 false로 설정하는 함수
	 */
	const setFalse = useCallback(() => {
		if (value !== false) {
			updateValue(false);
		}
	}, [value, updateValue]);

	/**
	 * 값을 직접 설정하는 함수
	 */
	const setValue = useCallback(
		(newValue: boolean) => {
			// 타입 안전성을 위해 boolean 타입 강제
			const booleanValue = Boolean(newValue);
			if (value !== booleanValue) {
				updateValue(booleanValue);
			}
		},
		[value, updateValue],
	);

	return {
		value,
		toggle,
		setTrue,
		setFalse,
		setValue,
	};
}

import { useState, useEffect, useCallback } from 'react';

/**
 * useLocalStorage 훅 옵션 타입
 *
 * @property {function} [serializer] - 값을 문자열로 직렬화하는 함수 (기본값: JSON.stringify)
 * @property {function} [deserializer] - 문자열을 값으로 역직렬화하는 함수 (기본값: JSON.parse)
 */
interface UseLocalStorageOptions {
	serializer?: (value: any) => string;
	deserializer?: (value: string) => any;
}

/**
 * 로컬 스토리지(localStorage)와 React 상태를 동기화하는 커스텀 훅입니다.
 *
 * @template T
 * @param {string} key - localStorage에 저장할 키
 * @param {T} initialValue - 초기값
 * @param {UseLocalStorageOptions} [options] - 직렬화/역직렬화 함수 옵션
 * @returns {[T, (value: T | ((val: T) => T)) => void, () => void]}
 *   - [현재 값, 값 설정 함수, 값 제거 함수] 형태의 배열을 반환합니다.
 *
 * @example
 * const [value, setValue, removeValue] = useLocalStorage('my-key', 0);
 * setValue(1);
 * removeValue();
 */
export function useLocalStorage<T>(
	key: string,
	initialValue: T,
	options: UseLocalStorageOptions = {},
): [T, (value: T | ((val: T) => T)) => void, () => void] {
	const { serializer = JSON.stringify, deserializer = JSON.parse } = options;

	/**
	 * localStorage에서 값을 읽어오는 함수
	 * @returns {T}
	 */
	const getStoredValue = useCallback((): T => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? deserializer(item) : initialValue;
		} catch (error) {
			console.warn(`Error reading localStorage key "${key}":`, error);
			return initialValue;
		}
	}, [key, initialValue, deserializer]);

	const [storedValue, setStoredValue] = useState<T>(getStoredValue);

	/**
	 * localStorage와 상태를 모두 업데이트하는 함수
	 * @param {T | ((val: T) => T)} value - 저장할 값 또는 이전 값을 인자로 받는 함수
	 */
	const setValue = useCallback(
		(value: T | ((val: T) => T)) => {
			try {
				const valueToStore = value instanceof Function ? value(storedValue) : value;
				setStoredValue(valueToStore);
				window.localStorage.setItem(key, serializer(valueToStore));
			} catch (error) {
				console.warn(`Error setting localStorage key "${key}":`, error);
			}
		},
		[key, storedValue, serializer],
	);

	/**
	 * localStorage에서 값을 제거하고 상태를 초기화하는 함수
	 */
	const removeValue = useCallback(() => {
		try {
			setStoredValue(initialValue);
			window.localStorage.removeItem(key);
		} catch (error) {
			console.warn(`Error removing localStorage key "${key}":`, error);
		}
	}, [key, initialValue]);

	// 다른 탭에서 localStorage가 변경될 때 동기화
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === key && e.newValue !== null) {
				try {
					setStoredValue(deserializer(e.newValue));
				} catch (error) {
					console.warn(`Error parsing localStorage key "${key}":`, error);
				}
			}
		};

		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, [key, deserializer]);

	return [storedValue, setValue, removeValue];
}

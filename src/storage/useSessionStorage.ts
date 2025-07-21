import { useState, useEffect, useCallback } from 'react';

interface UseSessionStorageOptions {
	serializer?: (value: any) => string;
	deserializer?: (value: string) => any;
}

/**
 * 세션 스토리지(sessionStorage)와 React 상태를 동기화하는 커스텀 훅입니다.
 *
 * @template T
 * @param {string} key - sessionStorage에 저장할 키
 * @param {T} initialValue - 초기값. sessionStorage에 값이 없을 때 사용됩니다.
 * @param {UseSessionStorageOptions} [options] - (선택) 직렬화/역직렬화 함수 커스터마이즈 옵션
 * @param {(value: any) => string} [options.serializer=JSON.stringify] - 값을 문자열로 변환하는 함수
 * @param {(value: string) => any} [options.deserializer=JSON.parse] - 문자열을 값으로 변환하는 함수
 * @returns {[T, (value: T | ((val: T) => T)) => void, () => void]} [저장된 값, 값 설정 함수, 값 제거 함수]
 *
 * @example
 * const [value, setValue, removeValue] = useSessionStorage('my-key', 'default');
 * setValue('new-value');
 * removeValue();
 */
export function useSessionStorage<T>(
	key: string,
	initialValue: T,
	options: UseSessionStorageOptions = {},
): [T, (value: T | ((val: T) => T)) => void, () => void] {
	const { serializer = JSON.stringify, deserializer = JSON.parse } = options;

	/**
	 * sessionStorage에서 값을 읽어오는 함수
	 * @returns {T}
	 */
	const getStoredValue = useCallback((): T => {
		try {
			const item = window.sessionStorage.getItem(key);
			return item ? deserializer(item) : initialValue;
		} catch (error) {
			console.warn(`Error reading sessionStorage key "${key}":`, error);
			return initialValue;
		}
	}, [key, initialValue, deserializer]);

	const [storedValue, setStoredValue] = useState<T>(getStoredValue);

	/**
	 * 값을 설정하고 sessionStorage에 저장합니다.
	 * @param {T | ((val: T) => T)} value - 새 값 또는 이전 값을 인자로 받는 함수
	 */
	const setValue = useCallback(
		(value: T | ((val: T) => T)) => {
			try {
				const valueToStore = value instanceof Function ? value(storedValue) : value;
				setStoredValue(valueToStore);
				window.sessionStorage.setItem(key, serializer(valueToStore));
			} catch (error) {
				console.warn(`Error setting sessionStorage key "${key}":`, error);
			}
		},
		[key, storedValue, serializer],
	);

	/**
	 * 값을 제거하고 초기값으로 되돌립니다.
	 */
	const removeValue = useCallback(() => {
		try {
			setStoredValue(initialValue);
			window.sessionStorage.removeItem(key);
		} catch (error) {
			console.warn(`Error removing sessionStorage key "${key}":`, error);
		}
	}, [key, initialValue]);

	// 다른 탭에서 sessionStorage가 변경될 때 동기화
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === key && e.newValue !== null) {
				try {
					setStoredValue(deserializer(e.newValue));
				} catch (error) {
					console.warn(`Error parsing sessionStorage key "${key}":`, error);
				}
			}
		};

		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, [key, deserializer]);

	return [storedValue, setValue, removeValue];
}

import { useState, useEffect, useCallback } from 'react';

/**
 * 스토리지 훅 옵션 타입
 */
export interface UseStorageOptions {
	serializer?: (value: any) => string;
	deserializer?: (value: string) => any;
}

/**
 * 스토리지 타입
 */
export type StorageType = 'localStorage' | 'sessionStorage';

/**
 * 공통 스토리지 로직을 처리하는 함수
 */
export function useStorage<T>(
	storageType: StorageType,
	key: string,
	initialValue: T,
	options: UseStorageOptions = {},
): [T, (value: T | ((val: T) => T)) => void, () => void] {
	const { serializer = JSON.stringify, deserializer = JSON.parse } = options;

	/**
	 * 환경 체크 및 스토리지 접근 가능 여부 확인
	 */
	const checkEnvironment = useCallback((): boolean => {
		if (typeof window === 'undefined') {
			console.warn(
				`use${
					storageType === 'localStorage' ? 'Local' : 'Session'
				}Storage: window is not available (SSR environment)`,
			);
			return false;
		}

		const storage = storageType === 'localStorage' ? window.localStorage : window.sessionStorage;
		if (!storage) {
			console.warn(
				`use${
					storageType === 'localStorage' ? 'Local' : 'Session'
				}Storage: ${storageType} is not supported in this browser`,
			);
			return false;
		}

		return true;
	}, [storageType]);

	/**
	 * 스토리지에서 값을 읽어오는 함수
	 */
	const getStoredValue = useCallback((): T => {
		if (!checkEnvironment()) {
			return initialValue;
		}

		try {
			const storage = storageType === 'localStorage' ? window.localStorage : window.sessionStorage;
			const item = storage.getItem(key);
			return item ? deserializer(item) : initialValue;
		} catch (error) {
			console.warn(`Error reading ${storageType} key "${key}":`, error);
			return initialValue;
		}
	}, [key, initialValue, deserializer, checkEnvironment, storageType]);

	/**
	 * 스토리지에 값을 저장하는 함수
	 */
	const setStoredValue = useCallback(
		(value: T): void => {
			if (!checkEnvironment()) {
				return;
			}

			try {
				const storage =
					storageType === 'localStorage' ? window.localStorage : window.sessionStorage;
				const serializedValue = serializer(value);
				storage.setItem(key, serializedValue);
			} catch (error) {
				console.warn(`Error setting ${storageType} key "${key}":`, error);
			}
		},
		[key, serializer, checkEnvironment, storageType],
	);

	/**
	 * 스토리지에서 값을 제거하는 함수
	 */
	const removeStoredValue = useCallback((): void => {
		if (!checkEnvironment()) {
			return;
		}

		try {
			const storage = storageType === 'localStorage' ? window.localStorage : window.sessionStorage;
			storage.removeItem(key);
		} catch (error) {
			console.warn(`Error removing ${storageType} key "${key}":`, error);
		}
	}, [key, checkEnvironment, storageType]);

	// 초기값 설정
	const [storedValue, setStoredValueState] = useState<T>(getStoredValue);

	// 스토리지 변경 이벤트 처리
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === key && e.newValue !== null) {
				try {
					const newValue = deserializer(e.newValue);
					setStoredValueState(newValue);
				} catch (error) {
					console.warn(`Error parsing ${storageType} key "${key}":`, error);
				}
			}
		};

		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, [key, deserializer, storageType]);

	// 값 설정 함수
	const setValue = useCallback(
		(value: T | ((val: T) => T)) => {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValueState(valueToStore);
			setStoredValue(valueToStore);
		},
		[storedValue, setStoredValue],
	);

	// 값 제거 함수
	const removeValue = useCallback(() => {
		setStoredValueState(initialValue);
		removeStoredValue();
	}, [initialValue, removeStoredValue]);

	return [storedValue, setValue, removeValue];
}

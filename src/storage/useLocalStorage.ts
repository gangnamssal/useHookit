import { useState, useEffect, useCallback } from 'react';

/**
 * useLocalStorage 훅 옵션 타입
 *
 * @property {function} [serializer] - 값을 문자열로 직렬화하는 함수 (기본값: JSON.stringify)
 *
 * @property {function} [deserializer] - 문자열을 값으로 역직렬화하는 함수 (기본값: JSON.parse)
 *
 */
interface UseLocalStorageOptions {
	serializer?: (value: any) => string;
	deserializer?: (value: string) => any;
}

/**
 *
 * 로컬 스토리지(localStorage)와 React 상태를 동기화하는 커스텀 훅입니다.
 *
 * A custom hook that synchronizes localStorage with React state.
 *
 * @template T - 저장할 값의 타입 / Type of the value to store
 *
 * @param {string} key - localStorage에 저장할 키 / Key to store in localStorage
 *
 * @param {T} initialValue - 초기값 / Initial value
 *
 * @param {UseLocalStorageOptions} [options] - 직렬화/역직렬화 함수 옵션 / Serialization/deserialization function options
 *
 * @param {(value: any) => string} [options.serializer] - 값을 문자열로 직렬화하는 함수 (기본값: JSON.stringify) / Function to serialize value to string (default: JSON.stringify)
 *
 * @param {(value: string) => any} [options.deserializer] - 문자열을 값으로 역직렬화하는 함수 (기본값: JSON.parse) / Function to deserialize string to value (default: JSON.parse)
 *
 * @returns {[T, (value: T | ((val: T) => T)) => void, () => void]} [현재 값, 값 설정 함수, 값 제거 함수] 형태의 배열 / Array in [current value, set value function, remove value function] format
 *
 * @returns {T} storedValue - 현재 저장된 값 / Currently stored value
 *
 * @returns {(value: T | ((val: T) => T)) => void} setValue - 값을 설정하는 함수 / Function to set value
 *
 * @returns {() => void} removeValue - 값을 제거하는 함수 / Function to remove value
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
 * const [value, setValue, removeValue] = useLocalStorage('my-key', 0);
 *
 * const handleIncrement = () => {
 *   setValue(prev => prev + 1);
 * };
 *
 * const handleReset = () => {
 *   removeValue();
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 객체 저장 / Store objects
 * const [user, setUser, removeUser] = useLocalStorage('user', {
 *   name: '',
 *   email: ''
 * });
 *
 * const handleLogin = (userData) => {
 *   setUser(userData);
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 커스텀 직렬화 사용 / Use custom serialization
 * const [date, setDate] = useLocalStorage('date', new Date(), {
 *   serializer: (value) => value.toISOString(),
 *   deserializer: (value) => new Date(value)
 * });
 * ```
 *
 */
export function useLocalStorage<T>(
	key: string,
	initialValue: T,
	options: UseLocalStorageOptions = {},
): [T, (value: T | ((val: T) => T)) => void, () => void] {
	const { serializer = JSON.stringify, deserializer = JSON.parse } = options;

	/**
	 * 환경 체크 및 localStorage 접근 가능 여부 확인
	 */
	const checkEnvironment = useCallback((): boolean => {
		if (typeof window === 'undefined') {
			console.warn('useLocalStorage: window is not available (SSR environment)');
			return false;
		}

		if (!window.localStorage) {
			console.warn('useLocalStorage: localStorage is not supported in this browser');
			return false;
		}

		return true;
	}, []);

	/**
	 * localStorage에서 값을 읽어오는 함수
	 * @returns {T}
	 */
	const getStoredValue = useCallback((): T => {
		if (!checkEnvironment()) {
			return initialValue;
		}

		try {
			const item = window.localStorage.getItem(key);
			return item ? deserializer(item) : initialValue;
		} catch (error) {
			console.warn(`Error reading localStorage key "${key}":`, error);
			return initialValue;
		}
	}, [key, initialValue, deserializer, checkEnvironment]);

	const [storedValue, setStoredValue] = useState<T>(getStoredValue);

	/**
	 * localStorage와 상태를 모두 업데이트하는 함수
	 * @param {T | ((val: T) => T)} value - 저장할 값 또는 이전 값을 인자로 받는 함수
	 */
	const setValue = useCallback(
		(value: T | ((val: T) => T)) => {
			if (!checkEnvironment()) {
				return;
			}

			try {
				const valueToStore = value instanceof Function ? value(storedValue) : value;
				setStoredValue(valueToStore);
				window.localStorage.setItem(key, serializer(valueToStore));
			} catch (error) {
				console.warn(`Error setting localStorage key "${key}":`, error);
			}
		},
		[key, storedValue, serializer, checkEnvironment],
	);

	/**
	 * localStorage에서 값을 제거하고 상태를 초기화하는 함수
	 */
	const removeValue = useCallback(() => {
		if (!checkEnvironment()) {
			return;
		}

		try {
			setStoredValue(initialValue);
			window.localStorage.removeItem(key);
		} catch (error) {
			console.warn(`Error removing localStorage key "${key}":`, error);
		}
	}, [key, initialValue, checkEnvironment]);

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

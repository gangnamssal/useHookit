import { useState, useEffect, useCallback } from 'react';

interface UseSessionStorageOptions {
	serializer?: (value: any) => string;
	deserializer?: (value: string) => any;
}

/**
 *
 * 세션 스토리지(sessionStorage)와 React 상태를 동기화하는 커스텀 훅입니다.
 *
 * A custom hook that synchronizes sessionStorage with React state.
 *
 * @template T - 저장할 값의 타입 / Type of the value to store
 *
 * @param {string} key - sessionStorage에 저장할 키 / Key to store in sessionStorage
 *
 * @param {T} initialValue - 초기값. sessionStorage에 값이 없을 때 사용됩니다. / Initial value. Used when no value exists in sessionStorage.
 *
 * @param {UseSessionStorageOptions} [options] - 직렬화/역직렬화 함수 커스터마이즈 옵션 / Serialization/deserialization function customization options
 *
 * @param {(value: any) => string} [options.serializer] - 값을 문자열로 변환하는 함수 (기본값: JSON.stringify) / Function to convert value to string (default: JSON.stringify)
 *
 * @param {(value: string) => any} [options.deserializer] - 문자열을 값으로 변환하는 함수 (기본값: JSON.parse) / Function to convert string to value (default: JSON.parse)
 *
 * @returns {[T, (value: T | ((val: T) => T)) => void, () => void]} [저장된 값, 값 설정 함수, 값 제거 함수] / [Stored value, set value function, remove value function]
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
 * const [value, setValue, removeValue] = useSessionStorage('my-key', 'default');
 *
 * const handleUpdate = () => {
 *   setValue('new-value');
 * };
 *
 * const handleClear = () => {
 *   removeValue();
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 폼 데이터 임시 저장 / Temporary form data storage
 * const [formData, setFormData, clearFormData] = useSessionStorage('form-data', {
 *   name: '',
 *   email: '',
 *   message: ''
 * });
 *
 * const handleInputChange = (field, value) => {
 *   setFormData(prev => ({
 *     ...prev,
 *     [field]: value
 *   }));
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 커스텀 직렬화 사용 / Use custom serialization
 * const [theme, setTheme] = useSessionStorage('theme', 'light', {
 *   serializer: (value) => value.toString(),
 *   deserializer: (value) => value
 * });
 * ```
 *
 */
export function useSessionStorage<T>(
	key: string,
	initialValue: T,
	options: UseSessionStorageOptions = {},
): [T, (value: T | ((val: T) => T)) => void, () => void] {
	const { serializer = JSON.stringify, deserializer = JSON.parse } = options;

	/**
	 * 환경 체크 및 sessionStorage 접근 가능 여부 확인
	 */
	const checkEnvironment = useCallback((): boolean => {
		if (typeof window === 'undefined') {
			if (typeof console !== 'undefined' && console.warn) {
				console.warn('useSessionStorage: window is not available (SSR environment)');
			}
			return false;
		}

		if (!window.sessionStorage) {
			if (typeof console !== 'undefined' && console.warn) {
				console.warn('useSessionStorage: sessionStorage is not supported in this browser');
			}
			return false;
		}

		return true;
	}, []);

	/**
	 * sessionStorage에서 값을 읽어오는 함수
	 * @returns {T}
	 */
	const getStoredValue = useCallback((): T => {
		if (!checkEnvironment()) {
			return initialValue;
		}

		try {
			const item = window.sessionStorage.getItem(key);
			return item ? deserializer(item) : initialValue;
		} catch (error) {
			if (typeof console !== 'undefined' && console.warn) {
				console.warn(`Error reading sessionStorage key "${key}":`, error);
			}
			return initialValue;
		}
	}, [key, initialValue, deserializer, checkEnvironment]);

	const [storedValue, setStoredValue] = useState<T>(getStoredValue);

	/**
	 * 값을 설정하고 sessionStorage에 저장합니다.
	 * @param {T | ((val: T) => T)} value - 새 값 또는 이전 값을 인자로 받는 함수
	 */
	const setValue = useCallback(
		(value: T | ((val: T) => T)) => {
			if (!checkEnvironment()) {
				return;
			}

			try {
				const valueToStore = value instanceof Function ? value(storedValue) : value;
				setStoredValue(valueToStore);
				window.sessionStorage.setItem(key, serializer(valueToStore));
			} catch (error) {
				if (typeof console !== 'undefined' && console.warn) {
					console.warn(`Error setting sessionStorage key "${key}":`, error);
				}
			}
		},
		[key, storedValue, serializer, checkEnvironment],
	);

	/**
	 * sessionStorage에서 값을 제거하고 상태를 초기화합니다.
	 */
	const removeValue = useCallback(() => {
		if (!checkEnvironment()) {
			return;
		}

		try {
			setStoredValue(initialValue);
			window.sessionStorage.removeItem(key);
		} catch (error) {
			if (typeof console !== 'undefined' && console.warn) {
				console.warn(`Error removing sessionStorage key "${key}":`, error);
			}
		}
	}, [key, initialValue, checkEnvironment]);

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

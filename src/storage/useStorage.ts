import { useState, useEffect, useCallback } from 'react';
import { useIsMounted } from '../lifecycle/useIsMounted';

/**
 * Storage hook options type
 */
export interface UseStorageOptions {
	/** Serializer function */
	serializer?: (value: any) => string;

	/** Deserializer function */
	deserializer?: (value: string) => any;
}

/**
 * Storage type
 */
export type StorageType = 'localStorage' | 'sessionStorage';

/**
 * Common storage logic handler function
 */
export function useStorage<T>(
	/** Storage type */
	storageType: StorageType,

	/** Storage key */
	key: string,

	/** Initial value */
	initialValue: T,

	/** Storage options */
	options: UseStorageOptions = {},
): [T, (value: T | ((val: T) => T)) => void, () => void] {
	const { serializer = JSON.stringify, deserializer = JSON.parse } = options;

	const isMounted = useIsMounted();

	/**
	 * Check environment and storage accessibility
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
	 * Function to read value from storage
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
	 * Function to save value to storage
	 */
	const setStoredValue = useCallback(
		(value: T): void => {
			if (!isMounted) {
				return;
			}

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
		[key, serializer, checkEnvironment, storageType, isMounted],
	);

	/**
	 * Function to remove value from storage
	 */
	const removeStoredValue = useCallback((): void => {
		if (!isMounted) {
			return;
		}

		if (!checkEnvironment()) {
			return;
		}

		try {
			const storage = storageType === 'localStorage' ? window.localStorage : window.sessionStorage;
			storage.removeItem(key);
		} catch (error) {
			console.warn(`Error removing ${storageType} key "${key}":`, error);
		}
	}, [key, checkEnvironment, storageType, isMounted]);

	// Set initial value
	const [storedValue, setStoredValueState] = useState<T>(getStoredValue);

	// Handle storage change events
	useEffect(() => {
		if (!isMounted) return;

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
	}, [key, deserializer, storageType, isMounted]);

	// Function to set value
	const setValue = useCallback(
		(value: T | ((val: T) => T)) => {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValueState(valueToStore);
			setStoredValue(valueToStore);
		},
		[storedValue, setStoredValue],
	);

	// Function to remove value
	const removeValue = useCallback(() => {
		setStoredValueState(initialValue);
		removeStoredValue();
	}, [initialValue, removeStoredValue]);

	return [storedValue, setValue, removeValue];
}

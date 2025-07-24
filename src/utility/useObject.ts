import { useState, useCallback, useMemo } from 'react';

/**
 * Options for useObject hook
 */
interface UseObjectOptions<T extends Record<string, any>> {
	/**
	 * Initial object value
	 */
	initialValue?: T;
	/**
	 * Whether to enable object operations logging
	 */
	debug?: boolean;
}

/**
 * Object operations interface
 */
interface ObjectOperations<T extends Record<string, any>> {
	/**
	 * Set a property in the object
	 */
	set: (key: keyof T, value: T[keyof T]) => void;
	/**
	 * Set multiple properties at once
	 */
	setMultiple: (updates: Partial<T>) => void;
	/**
	 * Remove a property from the object
	 */
	remove: (key: keyof T) => void;
	/**
	 * Remove multiple properties at once
	 */
	removeMultiple: (keys: (keyof T)[]) => void;
	/**
	 * Update a property using a function
	 */
	update: (key: keyof T, updater: (value: T[keyof T]) => T[keyof T]) => void;
	/**
	 * Update multiple properties using functions
	 */
	updateMultiple: (updaters: { [K in keyof T]?: (value: T[K]) => T[K] }) => void;
	/**
	 * Toggle a boolean property
	 */
	toggle: (key: keyof T) => void;
	/**
	 * Clear all properties from the object
	 */
	clear: () => void;
	/**
	 * Replace the entire object
	 */
	replace: (newObject: T) => void;
	/**
	 * Merge with another object
	 */
	merge: (objectToMerge: Partial<T>) => void;

	/**
	 * Check if a property exists
	 */
	has: (key: keyof T) => boolean;
	/**
	 * Get all keys
	 */
	keys: () => (keyof T)[];
	/**
	 * Get all values
	 */
	values: () => T[keyof T][];
	/**
	 * Get all entries
	 */
	entries: () => [keyof T, T[keyof T]][];
	/**
	 * Get object size (number of properties)
	 */
	size: number;
	/**
	 * Check if object is empty
	 */
	isEmpty: boolean;
	/**
	 * Check if object is not empty
	 */
	isNotEmpty: boolean;
	/**
	 * Pick specific properties
	 */
	pick: (keys: (keyof T)[]) => Partial<T>;
	/**
	 * Omit specific properties
	 */
	omit: (keys: (keyof T)[]) => Partial<T>;
	/**
	 * Transform object using a function
	 */
	transform: <R>(transformer: (obj: T) => R) => R;
	/**
	 * Filter object properties
	 */
	filter: (predicate: (value: T[keyof T], key: keyof T) => boolean) => Partial<T>;
	/**
	 * Map object values
	 */
	map: <R>(mapper: (value: T[keyof T], key: keyof T) => R) => Record<string, R>;
}

/**
 * Hook to manage object state with common object operations
 *
 * @param options - Configuration options for object management
 * @returns Object state and utility functions
 *
 * @example
 * ```tsx
 * const { object, set, remove, clear } = useObject({
 *   initialValue: { name: 'John', age: 30 }
 * });
 *
 * // Set a property
 * set('name', 'Jane');
 *
 * // Remove a property
 * remove('age');
 *
 * // Clear all properties
 * clear();
 * ```
 */
export function useObject<T extends Record<string, any>>(
	options: UseObjectOptions<T> = {},
): [T, ObjectOperations<T>] {
	const { initialValue = {} as T, debug = false } = options;
	const [object, setObject] = useState<T>(initialValue);

	// Log object operations if debug is enabled
	const log = useCallback(
		(operation: string, ...args: unknown[]) => {
			if (debug) {
				console.log(`useObject ${operation}:`, ...args);
			}
		},
		[debug],
	);

	// Set a property in the object
	const set = useCallback(
		(key: keyof T, value: T[keyof T]) => {
			setObject((prev) => {
				const newObject = { ...prev, [key]: value };
				log('set', key, value, '->', newObject);
				return newObject;
			});
		},
		[log],
	);

	// Set multiple properties at once
	const setMultiple = useCallback(
		(updates: Partial<T>) => {
			setObject((prev) => {
				const newObject = { ...prev, ...updates };
				log('setMultiple', updates, '->', newObject);
				return newObject;
			});
		},
		[log],
	);

	// Remove a property from the object
	const remove = useCallback(
		(key: keyof T) => {
			setObject((prev) => {
				const { [key]: removed, ...newObject } = prev;
				log('remove', key, '->', newObject);
				return newObject as T;
			});
		},
		[log],
	);

	// Remove multiple properties at once
	const removeMultiple = useCallback(
		(keys: (keyof T)[]) => {
			setObject((prev) => {
				const keysSet = new Set(keys);
				const newObject = Object.fromEntries(
					Object.entries(prev).filter(([key]) => !keysSet.has(key as keyof T)),
				) as T;
				log('removeMultiple', keys, '->', newObject);
				return newObject;
			});
		},
		[log],
	);

	// Update a property using a function
	const update = useCallback(
		(key: keyof T, updater: (value: T[keyof T]) => T[keyof T]) => {
			setObject((prev) => {
				const newObject = { ...prev, [key]: updater(prev[key]) };
				log('update', key, '->', newObject);
				return newObject;
			});
		},
		[log],
	);

	// Update multiple properties using functions
	const updateMultiple = useCallback(
		(updaters: { [K in keyof T]?: (value: T[K]) => T[K] }) => {
			setObject((prev) => {
				const newObject = { ...prev };
				Object.entries(updaters).forEach(([key, updater]) => {
					const typedKey = key as keyof T;
					if (updater && typedKey in prev) {
						newObject[typedKey] = updater(prev[typedKey]);
					}
				});
				log('updateMultiple', updaters, '->', newObject);
				return newObject;
			});
		},
		[log],
	);

	// Toggle a boolean property
	const toggle = useCallback(
		(key: keyof T) => {
			setObject((prev) => {
				const currentValue = prev[key];
				if (typeof currentValue === 'boolean') {
					const newObject = { ...prev, [key]: !currentValue };
					log('toggle', key, '->', newObject);
					return newObject;
				}
				return prev;
			});
		},
		[log],
	);

	// Clear all properties from the object
	const clear = useCallback(() => {
		setObject(() => {
			const newObject = {} as T;
			log('clear', '->', newObject);
			return newObject;
		});
	}, [log]);

	// Replace the entire object
	const replace = useCallback(
		(newObject: T) => {
			setObject(() => {
				log('replace', '->', newObject);
				return { ...newObject };
			});
		},
		[log],
	);

	// Merge with another object
	const merge = useCallback(
		(objectToMerge: Partial<T>) => {
			setObject((prev) => {
				const newObject = { ...prev, ...objectToMerge };
				log('merge', objectToMerge, '->', newObject);
				return newObject;
			});
		},
		[log],
	);

	// Check if a property exists
	const has = useCallback(
		(key: keyof T) => {
			return key in object;
		},
		[object],
	);

	// Memoize keys, values, entries for better performance
	const memoizedKeys = useMemo(() => Object.keys(object) as (keyof T)[], [object]);
	const memoizedValues = useMemo(() => Object.values(object) as T[keyof T][], [object]);
	const memoizedEntries = useMemo(
		() => Object.entries(object) as [keyof T, T[keyof T]][],
		[object],
	);

	// Get all keys
	const keys = useCallback(() => {
		return memoizedKeys;
	}, [memoizedKeys]);

	// Get all values
	const values = useCallback(() => {
		return memoizedValues;
	}, [memoizedValues]);

	// Get all entries
	const entries = useCallback(() => {
		return memoizedEntries;
	}, [memoizedEntries]);

	// Pick specific properties
	const pick = useCallback(
		(keys: (keyof T)[]) => {
			const picked: Partial<T> = {};
			keys.forEach((key) => {
				if (key in object) {
					picked[key] = object[key];
				}
			});
			return picked;
		},
		[object],
	);

	// Omit specific properties
	const omit = useCallback(
		(keys: (keyof T)[]) => {
			const keysSet = new Set(keys);
			const omitted = Object.fromEntries(
				Object.entries(object).filter(([key]) => !keysSet.has(key as keyof T)),
			) as Partial<T>;
			return omitted;
		},
		[object],
	);

	// Transform object using a function
	const transform = useCallback(
		<R>(transformer: (obj: T) => R) => {
			return transformer(object);
		},
		[object],
	);

	// Filter object properties
	const filter = useCallback(
		(predicate: (value: T[keyof T], key: keyof T) => boolean) => {
			const filtered: Partial<T> = {};
			Object.entries(object).forEach(([key, value]) => {
				if (predicate(value, key as keyof T)) {
					filtered[key as keyof T] = value;
				}
			});
			return filtered;
		},
		[object],
	);

	// Map object values
	const map = useCallback(
		<R>(mapper: (value: T[keyof T], key: keyof T) => R) => {
			const mapped: Record<string, R> = {};
			Object.entries(object).forEach(([key, value]) => {
				mapped[key] = mapper(value, key as keyof T);
			});
			return mapped;
		},
		[object],
	);

	// Memoize computed properties for better performance
	const computedProperties = useMemo(() => {
		const size = Object.keys(object).length;
		const isEmpty = size === 0;
		const isNotEmpty = size > 0;

		return {
			size,
			isEmpty,
			isNotEmpty,
		};
	}, [object]);

	// Memoize operations object to prevent unnecessary re-renders
	const operations = useMemo(
		(): ObjectOperations<T> => ({
			set,
			setMultiple,
			remove,
			removeMultiple,
			update,
			updateMultiple,
			toggle,
			clear,
			replace,
			merge,
			has,
			keys,
			values,
			entries,
			pick,
			omit,
			transform,
			filter,
			map,
			...computedProperties,
		}),
		[
			set,
			setMultiple,
			remove,
			removeMultiple,
			update,
			updateMultiple,
			toggle,
			clear,
			replace,
			merge,
			has,
			keys,
			values,
			entries,
			pick,
			omit,
			transform,
			filter,
			map,
			computedProperties,
		],
	);

	return [object, operations];
}

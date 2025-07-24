import { useState, useCallback, useMemo } from 'react';

/**
 * Interface providing methods for Map operations
 *
 * @template K - The type of keys in the Map
 * @template V - The type of values in the Map
 */
export interface MapOperations<K, V> {
	// Basic Map methods
	/** Sets a key-value pair in the Map. */
	set: (key: K, value: V) => void;
	/** Gets a value by key from the Map. */
	get: (key: K) => V | undefined;
	/** Removes a key-value pair from the Map. */
	delete: (key: K) => void;
	/** Checks if a key exists in the Map. */
	has: (key: K) => boolean;
	/** Removes all key-value pairs from the Map. */
	clear: () => void;

	// Convenience methods
	/** Toggles a key-value pair: removes if exists, sets if not exists. */
	toggle: (key: K, value: V) => void;
	/** Sets multiple key-value pairs at once. */
	setMultiple: (entries: [K, V][]) => void;
	/** Removes multiple keys at once. */
	deleteMultiple: (keys: K[]) => void;
	/** Updates a value if the key exists, otherwise sets a new key-value pair. */
	update: (key: K, updater: (value: V | undefined) => V) => void;

	// Query methods
	/** Returns the size of the Map. */
	size: number;
	/** Checks if the Map is empty. */
	isEmpty: boolean;
	/** Returns all keys as an array. */
	keys: K[];
	/** Returns all values as an array. */
	values: V[];
	/** Returns all entries as an array. */
	entries: [K, V][];

	// Transformation methods
	/** Filters entries based on a predicate and returns as an array. */
	filter: (predicate: (key: K, value: V) => boolean) => [K, V][];
	/** Transforms all entries using a mapper function and returns as an array. */
	map: <U>(mapper: (key: K, value: V) => U) => U[];
	/** Finds the first entry that matches the predicate. */
	find: (predicate: (key: K, value: V) => boolean) => [K, V] | undefined;
	/** Finds the first key that matches the predicate. */
	findKey: (predicate: (key: K, value: V) => boolean) => K | undefined;
	/** Finds the first value that matches the predicate. */
	findValue: (predicate: (key: K, value: V) => boolean) => V | undefined;

	// Debug mode
	/** Whether debug mode is enabled */
	debug?: boolean;
}

/**
 * Interface defining configuration options for the useMap hook
 *
 * @template K - The type of keys in the Map
 * @template V - The type of values in the Map
 */
export interface UseMapOptions<K, V> {
	/** Array of initial entries for the Map */
	initialValue?: [K, V][];
	/** Whether debug mode is enabled */
	debug?: boolean;
}

/**
 * React hook for managing Map objects
 *
 * Manages Map data structure as React state, providing basic Map methods along with
 * convenience methods, query methods, and transformation capabilities.
 *
 * @template K - The type of keys in the Map
 * @template V - The type of values in the Map
 * @param options - Configuration options for useMap
 * @param options.initialValue - Array of initial entries for the Map (default: [])
 * @param options.debug - Whether debug mode is enabled (default: false)
 * @returns [Map<K, V>, MapOperations<K, V>] - Tuple containing the Map object and operation methods
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [map, operations] = useMap<string, number>({
 *   initialValue: [['apple', 1], ['banana', 2]],
 *   debug: true
 * });
 *
 * // Basic operations
 * operations.set('orange', 3);
 * operations.get('apple'); // 1
 * operations.has('banana'); // true
 * operations.delete('apple');
 * operations.clear();
 *
 * // Convenience methods
 * operations.toggle('grape', 4);
 * operations.setMultiple([['mango', 5], ['pineapple', 6]]);
 * operations.deleteMultiple(['mango', 'grape']);
 * operations.update('apple', (value) => (value || 0) + 1);
 *
 * // Query methods
 * console.log(operations.size); // Map size
 * console.log(operations.isEmpty); // Check if empty
 * console.log(operations.keys); // All keys as array
 * console.log(operations.values); // All values as array
 * console.log(operations.entries); // All entries as array
 *
 * // Transformation methods
 * const filtered = operations.filter((key, value) => value > 3);
 * const mapped = operations.map((key, value) => `${key}: ${value}`);
 * const found = operations.find((key, value) => value === 5);
 * ```
 *
 * @example
 * ```tsx
 * // Complex object Map
 * interface User {
 *   id: number;
 *   name: string;
 *   age: number;
 * }
 *
 * const [userMap, userOperations] = useMap<number, User>({
 *   initialValue: [
 *     [1, { id: 1, name: 'Alice', age: 25 }],
 *     [2, { id: 2, name: 'Bob', age: 30 }]
 *   ]
 * });
 *
 * userOperations.set(3, { id: 3, name: 'Charlie', age: 35 });
 * const user = userOperations.get(1); // User object
 * const hasUser = userOperations.has(2); // true
 * ```
 */
export function useMap<K, V>(options: UseMapOptions<K, V> = {}): [Map<K, V>, MapOperations<K, V>] {
	const { initialValue = [], debug = false } = options;

	const [map, setMap] = useState<Map<K, V>>(() => new Map(initialValue));

	// Debug log function - performance optimized
	const log = useCallback(
		(operation: string, ...args: any[]) => {
			if (debug) {
				// Convert Map to array only in debug mode for performance
				const logArgs = args.map((arg) => (arg instanceof Map ? Array.from(arg) : arg));
				console.log(`[useMap] ${operation}:`, ...logArgs);
			}
		},
		[debug],
	);

	// Basic Map methods
	const set = useCallback(
		(key: K, value: V) => {
			setMap((prevMap) => {
				// Prevent unnecessary update if value is the same
				const currentValue = prevMap.get(key);
				if (currentValue === value) {
					return prevMap;
				}
				const newMap = new Map(prevMap);
				newMap.set(key, value);
				log('set', key, value, '->', newMap);
				return newMap;
			});
		},
		[log],
	);

	// Simple getter - no need for useCallback
	const get = (key: K): V | undefined => {
		return map.get(key);
	};

	const deleteValue = useCallback(
		(key: K) => {
			setMap((prevMap) => {
				// Prevent unnecessary update if key doesn't exist
				if (!prevMap.has(key)) {
					return prevMap;
				}
				const newMap = new Map(prevMap);
				newMap.delete(key);
				log('delete', key, '(deleted)', '->', newMap);
				return newMap;
			});
		},
		[log],
	);

	// Simple getter - no need for useCallback
	const has = (key: K): boolean => {
		return map.has(key);
	};

	const clear = useCallback(() => {
		setMap((prevMap) => {
			// Prevent unnecessary update if already empty
			if (prevMap.size === 0) {
				return prevMap;
			}
			log('clear', '->', new Map());
			return new Map();
		});
	}, [log]);

	// Convenience methods
	const toggle = useCallback(
		(key: K, value: V) => {
			setMap((prevMap) => {
				const newMap = new Map(prevMap);
				if (newMap.has(key)) {
					newMap.delete(key);
					log('toggle', key, '(removed)', '->', newMap);
				} else {
					newMap.set(key, value);
					log('toggle', key, value, '(added)', '->', newMap);
				}
				return newMap;
			});
		},
		[log],
	);

	const setMultiple = useCallback(
		(entries: [K, V][]) => {
			if (entries.length === 0) return; // Optimize for empty array

			setMap((prevMap) => {
				const newMap = new Map(prevMap);
				let hasChanges = false;

				entries.forEach(([key, value]) => {
					const currentValue = newMap.get(key);
					if (currentValue !== value) {
						newMap.set(key, value);
						hasChanges = true;
					}
				});

				// Prevent unnecessary update if no changes
				if (!hasChanges) {
					return prevMap;
				}

				log('setMultiple', entries, '->', newMap);
				return newMap;
			});
		},
		[log],
	);

	const deleteMultiple = useCallback(
		(keys: K[]) => {
			if (keys.length === 0) return; // Optimize for empty array

			setMap((prevMap) => {
				const newMap = new Map(prevMap);
				let hasChanges = false;
				let deletedCount = 0;

				keys.forEach((key) => {
					if (newMap.has(key)) {
						newMap.delete(key);
						hasChanges = true;
						deletedCount++;
					}
				});

				// Prevent unnecessary update if no changes
				if (!hasChanges) {
					return prevMap;
				}

				log('deleteMultiple', keys, `(${deletedCount} deleted)`, '->', newMap);
				return newMap;
			});
		},
		[log],
	);

	const update = useCallback(
		(key: K, updater: (value: V | undefined) => V) => {
			setMap((prevMap) => {
				const currentValue = prevMap.get(key);
				const newValue = updater(currentValue);

				// Prevent unnecessary update if value is the same
				if (currentValue === newValue) {
					return prevMap;
				}

				const newMap = new Map(prevMap);
				newMap.set(key, newValue);
				log('update', key, currentValue, '->', newValue, '->', newMap);
				return newMap;
			});
		},
		[log],
	);

	// Query methods - optimized with useMemo
	const size = useMemo(() => map.size, [map]);
	const isEmpty = useMemo(() => map.size === 0, [map]);
	const keys = useMemo(() => Array.from(map.keys()), [map]);
	const values = useMemo(() => Array.from(map.values()), [map]);
	const entries = useMemo(() => Array.from(map.entries()), [map]);

	// Transformation methods - optimized to avoid repeated Array.from calls
	const filter = useCallback(
		(predicate: (key: K, value: V) => boolean): [K, V][] => {
			return Array.from(map.entries()).filter(([key, value]) => predicate(key, value));
		},
		[map],
	);

	const mapValues = useCallback(
		<U>(mapper: (key: K, value: V) => U): U[] => {
			return Array.from(map.entries()).map(([key, value]) => mapper(key, value));
		},
		[map],
	);

	const find = useCallback(
		(predicate: (key: K, value: V) => boolean): [K, V] | undefined => {
			return Array.from(map.entries()).find(([key, value]) => predicate(key, value));
		},
		[map],
	);

	// Optimized findKey and findValue to avoid duplicate Array.from calls
	const findKey = useCallback(
		(predicate: (key: K, value: V) => boolean): K | undefined => {
			for (const [key, value] of map.entries()) {
				if (predicate(key, value)) {
					return key;
				}
			}
			return undefined;
		},
		[map],
	);

	const findValue = useCallback(
		(predicate: (key: K, value: V) => boolean): V | undefined => {
			for (const [key, value] of map.entries()) {
				if (predicate(key, value)) {
					return value;
				}
			}
			return undefined;
		},
		[map],
	);

	const operations: MapOperations<K, V> = {
		set,
		get,
		delete: deleteValue,
		has,
		clear,
		toggle,
		setMultiple,
		deleteMultiple,
		update,
		size,
		isEmpty,
		keys,
		values,
		entries,
		filter,
		map: mapValues,
		find,
		findKey,
		findValue,
		debug,
	};

	return [map, operations];
}

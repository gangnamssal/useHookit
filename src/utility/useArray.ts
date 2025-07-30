import { useState, useCallback, useMemo } from 'react';

/**
 * Options for useArray hook
 */
interface UseArrayOptions<T> {
	/**
	 * Initial array value
	 */
	initialValue?: T[];

	/**
	 * Whether to enable array operations logging
	 */
	debug?: boolean;
}

/**
 * Array operations interface
 */
interface ArrayOperations<T> {
	/**
	 * Add item to the end of array
	 */
	push: (item: T) => void;

	/**
	 * Add item to the beginning of array
	 */
	unshift: (item: T) => void;

	/**
	 * Remove last item from array
	 */
	pop: () => T | undefined;

	/**
	 * Remove first item from array
	 */
	shift: () => T | undefined;

	/**
	 * Remove item at specific index
	 */
	removeAt: (index: number) => T | undefined;

	/**
	 * Remove items that match the predicate
	 */
	remove: (predicate: (item: T, index: number) => boolean) => T[];

	/**
	 * Update item at specific index
	 */
	updateAt: (index: number, item: T) => void;

	/**
	 * Insert item at specific index
	 */
	insertAt: (index: number, item: T) => void;

	/**
	 * Clear all items from array
	 */
	clear: () => void;

	/**
	 * Replace entire array with new items
	 */
	set: (items: T[]) => void;

	/**
	 * Filter array based on predicate
	 */
	filter: (predicate: (item: T, index: number) => boolean) => void;

	/**
	 * Sort array
	 */
	sort: (compareFn?: (a: T, b: T) => number) => void;

	/**
	 * Reverse array order
	 */
	reverse: () => void;

	/**
	 * Find first item that matches predicate
	 */
	find: (predicate: (item: T, index: number) => boolean) => T | undefined;

	/**
	 * Find index of first item that matches predicate
	 */
	findIndex: (predicate: (item: T, index: number) => boolean) => number;

	/**
	 * Check if array includes item
	 */
	includes: (item: T) => boolean;

	/**
	 * Get item at specific index
	 */
	get: (index: number) => T | undefined;

	/**
	 * Get first item
	 */
	first: () => T | undefined;

	/**
	 * Get last item
	 */
	last: () => T | undefined;

	/**
	 * Get array length
	 */
	length: number;

	/**
	 * Check if array is empty
	 */
	isEmpty: boolean;

	/**
	 * Check if array is not empty
	 */
	isNotEmpty: boolean;
}

/**
 * Hook to manage array state with common array operations
 *
 * @param {UseArrayOptions<T>} [options] - Configuration options for array management
 *
 * @param {T[]} [options.initialValue] - Initial array value (default: [])
 *
 * @param {boolean} [options.debug] - Whether to enable debug logging for array operations (default: false)
 *
 * @returns {T[]} array - Current array value
 *
 * @returns {ArrayOperations<T>} operations - Array operations
 *
 * @example
 * ```tsx
 * const [array, operations] = useArray({ initialValue: [1, 2, 3] });
 *
 * // Add item
 * operations.push(4);
 *
 * // Remove item at index
 * operations.removeAt(1);
 *
 * // Clear array
 * operations.clear();
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-usearray--docs
 */
export function useArray<T>(options: UseArrayOptions<T> = {}): [T[], ArrayOperations<T>] {
	const { initialValue = [], debug = false } = options;
	const [array, setArray] = useState<T[]>(initialValue);

	// Log array operations if debug is enabled
	const log = useCallback(
		(operation: string, ...args: unknown[]) => {
			if (debug) {
				console.log(`useArray ${operation}:`, ...args);
			}
		},
		[debug],
	);

	// Add item to the end of array
	const push = useCallback(
		(item: T) => {
			setArray((prev) => {
				const newArray = [...prev, item];
				log('push', item, '->', newArray);
				return newArray;
			});
		},
		[log],
	);

	// Add item to the beginning of array
	const unshift = useCallback(
		(item: T) => {
			setArray((prev) => {
				const newArray = [item, ...prev];
				log('unshift', item, '->', newArray);
				return newArray;
			});
		},
		[log],
	);

	// Remove last item from array
	const pop = useCallback(() => {
		let removedItem: T | undefined;
		setArray((prev) => {
			if (prev.length === 0) return prev;
			const newArray = [...prev];
			removedItem = newArray.pop();
			log('pop', removedItem, '->', newArray);
			return newArray;
		});
		return removedItem;
	}, [log]);

	// Remove first item from array
	const shift = useCallback(() => {
		let removedItem: T | undefined;
		setArray((prev) => {
			if (prev.length === 0) return prev;
			const newArray = [...prev];
			removedItem = newArray.shift();
			log('shift', removedItem, '->', newArray);
			return newArray;
		});
		return removedItem;
	}, [log]);

	// Remove item at specific index
	const removeAt = useCallback(
		(index: number) => {
			let removedItem: T | undefined;
			setArray((prev) => {
				if (index < 0 || index >= prev.length) {
					removedItem = undefined;
					return prev;
				}
				const newArray = [...prev];
				removedItem = newArray.splice(index, 1)[0];
				log('removeAt', index, removedItem, '->', newArray);
				return newArray;
			});
			return removedItem;
		},
		[log],
	);

	// Remove items that match the predicate
	const remove = useCallback(
		(predicate: (item: T, index: number) => boolean) => {
			let removedItems: T[] = [];
			setArray((prev) => {
				const newArray = [...prev];
				removedItems = newArray.filter((item, index) => predicate(item, index));
				const filteredArray = newArray.filter((item, index) => !predicate(item, index));
				log('remove', removedItems.length, 'items', '->', filteredArray);
				return filteredArray;
			});
			return removedItems;
		},
		[log],
	);

	// Update item at specific index
	const updateAt = useCallback(
		(index: number, item: T) => {
			setArray((prev) => {
				if (index < 0 || index >= prev.length) return prev;
				const newArray = [...prev];
				newArray[index] = item;
				log('updateAt', index, item, '->', newArray);
				return newArray;
			});
		},
		[log],
	);

	// Insert item at specific index
	const insertAt = useCallback(
		(index: number, item: T) => {
			setArray((prev) => {
				const newArray = [...prev];
				newArray.splice(index, 0, item);
				log('insertAt', index, item, '->', newArray);
				return newArray;
			});
		},
		[log],
	);

	// Clear all items from array
	const clear = useCallback(() => {
		setArray(() => {
			log('clear', '->', []);
			return [];
		});
	}, [log]);

	// Replace entire array with new items
	const set = useCallback(
		(items: T[]) => {
			setArray(() => {
				log('set', '->', items);
				return [...items];
			});
		},
		[log],
	);

	// Filter array based on predicate
	const filter = useCallback(
		(predicate: (item: T, index: number) => boolean) => {
			setArray((prev) => {
				const filteredArray = prev.filter(predicate);
				log('filter', '->', filteredArray);
				return filteredArray;
			});
		},
		[log],
	);

	// Sort array
	const sort = useCallback(
		(compareFn?: (a: T, b: T) => number) => {
			setArray((prev) => {
				const sortedArray = [...prev].sort(compareFn);
				log('sort', '->', sortedArray);
				return sortedArray;
			});
		},
		[log],
	);

	// Reverse array order
	const reverse = useCallback(() => {
		setArray((prev) => {
			const reversedArray = [...prev].reverse();
			log('reverse', '->', reversedArray);
			return reversedArray;
		});
	}, [log]);

	// Memoize computed properties for better performance
	const computedProperties = useMemo(() => {
		const length = array.length;
		const isEmpty = length === 0;
		const isNotEmpty = length > 0;

		return {
			length,
			isEmpty,
			isNotEmpty,
		};
	}, [array.length]);

	// Memoize operations object to prevent unnecessary re-renders
	const operations = useMemo(
		(): ArrayOperations<T> => ({
			push,
			unshift,
			pop,
			shift,
			removeAt,
			remove,
			updateAt,
			insertAt,
			clear,
			set,
			filter,
			sort,
			reverse,
			// Read-only operations don't need useCallback
			find: (predicate: (item: T, index: number) => boolean) => array.find(predicate),
			findIndex: (predicate: (item: T, index: number) => boolean) => array.findIndex(predicate),
			includes: (item: T) => array.includes(item),
			get: (index: number) => array[index],
			first: () => array[0],
			last: () => array[array.length - 1],
			...computedProperties,
		}),
		[
			push,
			unshift,
			pop,
			shift,
			removeAt,
			remove,
			updateAt,
			insertAt,
			clear,
			set,
			filter,
			sort,
			reverse,
			array,
			computedProperties,
		],
	);

	return [array, operations];
}

import { useState, useCallback, useMemo } from 'react';

/**
 * Interface providing methods for Set operations
 *
 * @template T - The type of values stored in the Set
 */
export interface SetOperations<T> {
	// Basic Set methods
	/** Adds a value to the Set. Ignores if the value already exists. */
	add: (value: T) => void;
	/** Removes a value from the Set. Ignores if the value doesn't exist. */
	delete: (value: T) => void;
	/** Removes all values from the Set. */
	clear: () => void;
	/** Checks if a value exists in the Set. */
	has: (value: T) => boolean;

	// Convenience methods
	/** Toggles a value: removes if exists, adds if not exists. */
	toggle: (value: T) => void;
	/** Adds multiple values at once. */
	addMultiple: (values: T[]) => void;
	/** Removes multiple values at once. */
	deleteMultiple: (values: T[]) => void;

	// Query methods
	/** Returns the size of the Set. */
	size: number;
	/** Checks if the Set is empty. */
	isEmpty: boolean;
	/** Returns all values as an array. */
	values: T[];

	// Set operation methods
	/** Calculates union with another Set and updates the current Set. */
	union: (otherSet: Set<T>) => void;
	/** Calculates intersection with another Set and updates the current Set. */
	intersection: (otherSet: Set<T>) => void;
	/** Calculates difference with another Set and updates the current Set. */
	difference: (otherSet: Set<T>) => void;
	/** Calculates symmetric difference with another Set and updates the current Set. */
	symmetricDifference: (otherSet: Set<T>) => void;

	// Filtering methods
	/** Filters values based on a predicate and returns as an array. */
	filter: (predicate: (value: T) => boolean) => T[];
	/** Transforms all values using a mapper function and returns as an array. */
	map: <U>(mapper: (value: T) => U) => U[];

	// Debug mode
	/** Whether debug mode is enabled */
	debug?: boolean;
}

/**
 * Interface defining configuration options for the useSet hook
 *
 * @template T - The type of values stored in the Set
 */
export interface UseSetOptions<T> {
	/** Array of initial values for the Set */
	initialValue?: T[];
	/** Whether debug mode is enabled */
	debug?: boolean;
}

/**
 * React hook for managing Set objects
 *
 * Manages Set data structure as React state, providing basic Set methods along with
 * convenience methods, set operations, filtering, and transformation capabilities.
 *
 * @template T - The type of values stored in the Set
 * @param options - Configuration options for useSet
 * @param options.initialValue - Array of initial values for the Set (default: [])
 * @param options.debug - Whether debug mode is enabled (default: false)
 * @returns [Set<T>, SetOperations<T>] - Tuple containing the Set object and operation methods
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [set, operations] = useSet<string>({
 *   initialValue: ['apple', 'banana'],
 *   debug: true
 * });
 *
 * // Basic operations
 * operations.add('orange');
 * operations.delete('apple');
 * operations.has('banana'); // true
 * operations.clear();
 *
 * // Convenience methods
 * operations.toggle('grape');
 * operations.addMultiple(['mango', 'pineapple']);
 * operations.deleteMultiple(['mango', 'grape']);
 *
 * // Query methods
 * console.log(operations.size); // Set size
 * console.log(operations.isEmpty); // Check if empty
 * console.log(operations.values); // All values as array
 *
 * // Set operations
 * const otherSet = new Set(['banana', 'orange']);
 * operations.union(otherSet);
 * operations.intersection(otherSet);
 * operations.difference(otherSet);
 * operations.symmetricDifference(otherSet);
 *
 * // Filtering and transformation
 * const filtered = operations.filter(value => value.length > 5);
 * const mapped = operations.map(value => value.toUpperCase());
 * ```
 *
 * @example
 * ```tsx
 * // Complex object Set
 * interface User {
 *   id: number;
 *   name: string;
 *   age: number;
 * }
 *
 * const [userSet, userOperations] = useSet<User>({
 *   initialValue: [
 *     { id: 1, name: 'Alice', age: 25 },
 *     { id: 2, name: 'Bob', age: 30 }
 *   ]
 * });
 *
 * userOperations.add({ id: 3, name: 'Charlie', age: 35 });
 * const hasUser = userOperations.has({ id: 1, name: 'Alice', age: 25 }); // Reference comparison
 * ```
 */
export function useSet<T>(options: UseSetOptions<T> = {}): [Set<T>, SetOperations<T>] {
	const { initialValue = [], debug = false } = options;

	const [set, setSet] = useState<Set<T>>(() => new Set(initialValue));

	// 디버그 로그 함수 - 성능 최적화
	const log = useCallback(
		(operation: string, ...args: any[]) => {
			if (debug) {
				// 디버그 모드에서만 배열 변환하여 성능 개선
				const logArgs = args.map((arg) => (arg instanceof Set ? Array.from(arg) : arg));
				console.log(`[useSet] ${operation}:`, ...logArgs);
			}
		},
		[debug],
	);

	// 기본 Set 메서드들
	const add = useCallback(
		(value: T) => {
			setSet((prevSet) => {
				// 값이 이미 존재하면 불필요한 업데이트 방지
				if (prevSet.has(value)) {
					return prevSet;
				}
				const newSet = new Set(prevSet);
				newSet.add(value);
				log('add', value, '->', newSet);
				return newSet;
			});
		},
		[log],
	);

	const deleteValue = useCallback(
		(value: T) => {
			setSet((prevSet) => {
				// 값이 존재하지 않으면 불필요한 업데이트 방지
				if (!prevSet.has(value)) {
					return prevSet;
				}
				const newSet = new Set(prevSet);
				newSet.delete(value);
				log('delete', value, '(deleted)', '->', newSet);
				return newSet;
			});
		},
		[log],
	);

	const clear = useCallback(() => {
		setSet((prevSet) => {
			// 이미 비어있으면 불필요한 업데이트 방지
			if (prevSet.size === 0) {
				return prevSet;
			}
			log('clear', '->', new Set());
			return new Set();
		});
	}, [log]);

	// has는 단순 getter이므로 useCallback 불필요
	const has = (value: T): boolean => set.has(value);

	// 편의 메서드들
	const toggle = useCallback(
		(value: T) => {
			setSet((prevSet) => {
				const newSet = new Set(prevSet);
				if (newSet.has(value)) {
					newSet.delete(value);
					log('toggle', value, '(removed)', '->', newSet);
				} else {
					newSet.add(value);
					log('toggle', value, '(added)', '->', newSet);
				}
				return newSet;
			});
		},
		[log],
	);

	const addMultiple = useCallback(
		(values: T[]) => {
			if (values.length === 0) return; // 빈 배열 처리 최적화

			setSet((prevSet) => {
				const newSet = new Set(prevSet);
				let hasChanges = false;

				values.forEach((value) => {
					if (!newSet.has(value)) {
						newSet.add(value);
						hasChanges = true;
					}
				});

				// 변경사항이 없으면 불필요한 업데이트 방지
				if (!hasChanges) {
					return prevSet;
				}

				log('addMultiple', values, '->', newSet);
				return newSet;
			});
		},
		[log],
	);

	const deleteMultiple = useCallback(
		(values: T[]) => {
			if (values.length === 0) return; // 빈 배열 처리 최적화

			setSet((prevSet) => {
				const newSet = new Set(prevSet);
				let hasChanges = false;
				let deletedCount = 0;

				values.forEach((value) => {
					if (newSet.has(value)) {
						newSet.delete(value);
						hasChanges = true;
						deletedCount++;
					}
				});

				// 변경사항이 없으면 불필요한 업데이트 방지
				if (!hasChanges) {
					return prevSet;
				}

				log('deleteMultiple', values, `(${deletedCount} deleted)`, '->', newSet);
				return newSet;
			});
		},
		[log],
	);

	// 조회 메서드들 - useMemo로 최적화
	const size = useMemo(() => set.size, [set]);
	const isEmpty = useMemo(() => set.size === 0, [set]);
	const values = useMemo(() => Array.from(set), [set]);

	// 집합 연산 메서드들
	const union = useCallback(
		(otherSet: Set<T>) => {
			if (otherSet.size === 0) return; // 빈 Set 처리 최적화

			setSet((prevSet) => {
				const newSet = new Set(prevSet);
				let hasChanges = false;

				otherSet.forEach((value) => {
					if (!newSet.has(value)) {
						newSet.add(value);
						hasChanges = true;
					}
				});

				// 변경사항이 없으면 불필요한 업데이트 방지
				if (!hasChanges) {
					return prevSet;
				}

				log('union', otherSet, '->', newSet);
				return newSet;
			});
		},
		[log],
	);

	const intersection = useCallback(
		(otherSet: Set<T>) => {
			setSet((prevSet) => {
				const newSet = new Set<T>();

				prevSet.forEach((value) => {
					if (otherSet.has(value)) {
						newSet.add(value);
					}
				});

				log('intersection', otherSet, '->', newSet);
				return newSet;
			});
		},
		[log],
	);

	const difference = useCallback(
		(otherSet: Set<T>) => {
			if (otherSet.size === 0) return; // 빈 Set 처리 최적화

			setSet((prevSet) => {
				const newSet = new Set(prevSet);
				let hasChanges = false;

				otherSet.forEach((value) => {
					if (newSet.has(value)) {
						newSet.delete(value);
						hasChanges = true;
					}
				});

				// 변경사항이 없으면 불필요한 업데이트 방지
				if (!hasChanges) {
					return prevSet;
				}

				log('difference', otherSet, '->', newSet);
				return newSet;
			});
		},
		[log],
	);

	const symmetricDifference = useCallback(
		(otherSet: Set<T>) => {
			setSet((prevSet) => {
				const newSet = new Set<T>();

				// prevSet에만 있는 요소들
				prevSet.forEach((value) => {
					if (!otherSet.has(value)) {
						newSet.add(value);
					}
				});

				// otherSet에만 있는 요소들
				otherSet.forEach((value) => {
					if (!prevSet.has(value)) {
						newSet.add(value);
					}
				});

				log('symmetricDifference', otherSet, '->', newSet);
				return newSet;
			});
		},
		[log],
	);

	// 필터링 메서드들
	const filter = useCallback(
		(predicate: (value: T) => boolean): T[] => {
			return Array.from(set).filter(predicate);
		},
		[set],
	);

	const map = useCallback(
		<U>(mapper: (value: T) => U): U[] => {
			return Array.from(set).map(mapper);
		},
		[set],
	);

	const operations: SetOperations<T> = {
		add,
		delete: deleteValue,
		clear,
		has,
		toggle,
		addMultiple,
		deleteMultiple,
		size,
		isEmpty,
		values,
		union,
		intersection,
		difference,
		symmetricDifference,
		filter,
		map,
		debug,
	};

	return [set, operations];
}

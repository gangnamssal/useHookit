import { useCallback, useMemo, useState, useEffect } from 'react';
import { useIsMounted } from '../lifecycle/useIsMounted';

interface UseUrlQueryOptions {
	/**
	 * Whether to automatically sync URL query parameters
	 * @default true
	 */
	syncWithUrl?: boolean;

	/**
	 * History API usage method when updating URL
	 * @default 'push'
	 */
	historyMode?: 'push' | 'replace';

	/**
	 * Encoding method to use when parsing query parameters
	 * @default 'decodeURIComponent'
	 */
	encoding?: 'decodeURIComponent' | 'decodeURI' | 'none';

	/**
	 * Whether to use batch updates (performance optimization)
	 * @default false
	 */
	batchUpdates?: boolean;
}

interface UseUrlQueryReturn<T extends Record<string, any>> {
	/**
	 * Current query parameters object
	 */
	query: T;

	/**
	 * Get specific query parameter value
	 */
	get: (key: keyof T) => T[keyof T] | undefined;

	/**
	 * Set specific query parameter
	 */
	set: (key: keyof T, value: T[keyof T]) => void;

	/**
	 * Set multiple query parameters at once
	 */
	setMultiple: (params: Partial<T>) => void;

	/**
	 * Remove specific query parameter
	 */
	remove: (key: keyof T) => void;

	/**
	 * Remove multiple query parameters
	 */
	removeMultiple: (keys: (keyof T)[]) => void;

	/**
	 * Clear all query parameters
	 */
	clear: () => void;

	/**
	 * Check if query parameters are empty
	 */
	isEmpty: boolean;

	/**
	 * Current URL query string
	 */
	queryString: string;

	/**
	 * Function for batch updates (only used when batchUpdates is true)
	 */
	batchUpdate?: (updates: Array<{ key: keyof T; value: T[keyof T] | undefined }>) => void;
}

/**
 * Safe JSON stringify function
 */
const safeStringify = (value: any): string => {
	try {
		return JSON.stringify(value);
	} catch (error) {
		// Fallback for circular references or complex objects
		return String(value);
	}
};

/**
 * Safe JSON parse function
 */
const safeParse = (value: string, fallback: any): any => {
	try {
		return JSON.parse(value);
	} catch (error) {
		return fallback;
	}
};

/**
 * Check if value is empty
 */
const isEmptyValue = (value: any): boolean => {
	return (
		value === undefined ||
		value === null ||
		value === '' ||
		(Array.isArray(value) && value.length === 0)
	);
};

/**
 * Convert value to string
 */
const valueToString = (value: any): string => {
	return typeof value === 'object' && value !== null ? safeStringify(value) : String(value);
};

/**
 * Hook to easily manage URL query parameters
 *
 * @param {T} initialQuery - Initial query parameters object
 *
 * @param {UseUrlQueryOptions} [options] - Options settings
 *
 * @returns {T} query - Current query parameters object
 *
 * @returns {UseUrlQueryReturn<T>} Query parameter management functions and state
 *
 * @returns {() => void} set - Function to set specific query parameter
 *
 * @returns {() => void} get - Function to get specific query parameter
 *
 * @returns {() => void} setMultiple - Function to set multiple query parameters at once
 *
 * @returns {() => void} remove - Function to remove specific query parameter
 *
 * @returns {() => void} removeMultiple - Function to remove multiple query parameters
 *
 * @returns {() => void} clear - Function to clear all query parameters
 *
 * @returns {() => void} batchUpdate - Function to batch update query parameters
 *
 * @returns {() => void} isEmpty - Function to check if query parameters are empty
 *
 * @returns {() => void} queryString - Function to get query string
 *
 * @example
 * ```tsx
 * const { query, set, get, clear } = useUrlQuery({
 *   page: 1,
 *   search: '',
 *   category: 'all'
 * });
 *
 * // Set specific parameter
 * set('page', 2);
 *
 * // Get parameter value
 * const currentPage = get('page');
 *
 * // Clear all parameters
 * clear();
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-useurlquery--docs
 */
export function useUrlQuery<T extends Record<string, any>>(
	initialQuery: T,
	options: UseUrlQueryOptions = {},
): UseUrlQueryReturn<T> {
	const {
		syncWithUrl = true,
		historyMode = 'push',
		encoding = 'decodeURIComponent',
		batchUpdates = false,
	} = options;

	const isMounted = useIsMounted();

	// Memoize initial query keys for performance
	const initialQueryKeys = useMemo(() => Object.keys(initialQuery), [initialQuery]);

	// Parse query parameters from URL
	const parseQueryFromUrl = useCallback((): Partial<T> => {
		if (!isMounted || typeof window === 'undefined') return {};

		try {
			const searchParams = new URLSearchParams(window.location.search);
			const query: Partial<T> = {};

			for (const [key, value] of searchParams.entries()) {
				if (initialQueryKeys.includes(key)) {
					let parsedValue: any = value;

					// Encoding handling
					if (encoding === 'decodeURI') {
						parsedValue = decodeURI(value);
					} else if (encoding === 'none') {
						parsedValue = value;
					} else {
						// Default to decodeURIComponent
						parsedValue = decodeURIComponent(value);
					}

					// Type conversion attempt
					const originalValue = initialQuery[key as keyof T];
					if (typeof originalValue === 'number') {
						parsedValue = Number(parsedValue);
					} else if (typeof originalValue === 'boolean') {
						parsedValue = parsedValue === 'true';
					} else if (Array.isArray(originalValue)) {
						parsedValue = safeParse(parsedValue, [parsedValue]);
					}

					query[key as keyof T] = parsedValue;
				}
			}

			return query;
		} catch (error) {
			if (isMounted) {
				console.warn('useUrlQuery: Error parsing URL query parameters:', error);
			}
			return {};
		}
	}, [initialQueryKeys, encoding, isMounted]);

	// Sync query parameters to URL
	const syncToUrl = useCallback(
		(query: T) => {
			if (!isMounted || typeof window === 'undefined' || !syncWithUrl) return;

			try {
				const searchParams = new URLSearchParams();

				Object.entries(query).forEach(([key, value]) => {
					if (!isEmptyValue(value)) {
						searchParams.set(key, valueToString(value));
					}
				});

				const newUrl = `${window.location.pathname}${
					searchParams.toString() ? `?${searchParams.toString()}` : ''
				}${window.location.hash}`;

				if (historyMode === 'replace') {
					window.history.replaceState(null, '', newUrl);
				} else {
					window.history.pushState(null, '', newUrl);
				}
			} catch (error) {
				if (isMounted) {
					console.warn('useUrlQuery: Error syncing to URL:', error);
				}
			}
		},
		[syncWithUrl, historyMode, isMounted],
	);

	// Initial state setting
	const [query, setQuery] = useState<T>(initialQuery);

	useEffect(() => {
		if (isMounted && syncWithUrl) {
			const urlQuery = parseQueryFromUrl();
			if (Object.keys(urlQuery).length > 0) {
				setQuery((prev) => ({ ...prev, ...urlQuery }));
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMounted, syncWithUrl]);

	// URL change detection
	useEffect(() => {
		if (!syncWithUrl || !isMounted) return;

		const handlePopState = () => {
			if (isMounted) {
				const urlQuery = parseQueryFromUrl();
				setQuery((prev) => ({ ...prev, ...urlQuery }));
			}
		};

		window.addEventListener('popstate', handlePopState);
		return () => {
			if (isMounted) {
				window.removeEventListener('popstate', handlePopState);
			}
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [syncWithUrl, isMounted]);

	// Sync URL when query changes
	useEffect(() => {
		if (!syncWithUrl || !isMounted) return;
		syncToUrl(query);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query, syncWithUrl, isMounted]);

	// Get specific query parameter
	const get = useCallback(
		(key: keyof T): T[keyof T] | undefined => {
			return query[key];
		},
		[query],
	);

	// Set specific query parameter
	const set = useCallback((key: keyof T, value: T[keyof T]) => {
		setQuery((prev) => ({ ...prev, [key]: value }));
	}, []);

	// Set multiple query parameters at once
	const setMultiple = useCallback((params: Partial<T>) => {
		setQuery((prev) => ({ ...prev, ...params }));
	}, []);

	// Remove specific query parameter
	const remove = useCallback((key: keyof T) => {
		setQuery((prev) => {
			const newQuery = { ...prev };
			delete newQuery[key];
			return newQuery;
		});
	}, []);

	// Remove multiple query parameters
	const removeMultiple = useCallback((keys: (keyof T)[]) => {
		setQuery((prev) => {
			const newQuery = { ...prev };
			keys.forEach((key) => delete newQuery[key]);
			return newQuery;
		});
	}, []);

	// Clear all query parameters
	const clear = useCallback(() => {
		setQuery(initialQuery);
	}, [initialQuery]);

	// Batch update function
	const batchUpdate = useCallback(
		(updates: Array<{ key: keyof T; value: T[keyof T] | undefined }>) => {
			setQuery((prev) => {
				const newQuery = { ...prev };
				updates.forEach(({ key, value }) => {
					if (value === undefined) {
						delete newQuery[key];
					} else {
						newQuery[key] = value;
					}
				});
				return newQuery;
			});
		},
		[],
	);

	// Calculated values (memoization optimization)
	const isEmpty = useMemo(() => {
		return Object.values(query).every(isEmptyValue);
	}, [query]);

	const queryString = useMemo(() => {
		if (!isMounted) return '';

		try {
			const searchParams = new URLSearchParams();
			Object.entries(query).forEach(([key, value]) => {
				if (!isEmptyValue(value)) {
					searchParams.set(key, valueToString(value));
				}
			});
			return searchParams.toString();
		} catch (error) {
			if (isMounted) {
				console.warn('useUrlQuery: Error generating query string:', error);
			}
			return '';
		}
	}, [query, isMounted]);

	return {
		query,
		get,
		set,
		setMultiple,
		remove,
		removeMultiple,
		clear,
		isEmpty,
		queryString,
		...(batchUpdates && { batchUpdate }),
	};
}

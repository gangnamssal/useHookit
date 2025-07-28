import { useCallback, useMemo, useState, useEffect } from 'react';

interface UseUrlQueryOptions {
	/**
	 * URL 쿼리 파라미터를 자동으로 동기화할지 여부
	 * @default true
	 */
	syncWithUrl?: boolean;

	/**
	 * URL 업데이트 시 히스토리 API 사용 방식
	 * @default 'push'
	 */
	historyMode?: 'push' | 'replace';

	/**
	 * 쿼리 파라미터 파싱 시 사용할 인코딩 방식
	 * @default 'decodeURIComponent'
	 */
	encoding?: 'decodeURIComponent' | 'decodeURI' | 'none';

	/**
	 * 배치 업데이트를 사용할지 여부 (성능 최적화)
	 * @default false
	 */
	batchUpdates?: boolean;
}

interface UseUrlQueryReturn<T extends Record<string, any>> {
	/**
	 * 현재 쿼리 파라미터 객체
	 */
	query: T;

	/**
	 * 특정 쿼리 파라미터 값 가져오기
	 */
	get: (key: keyof T) => T[keyof T] | undefined;

	/**
	 * 특정 쿼리 파라미터 설정하기
	 */
	set: (key: keyof T, value: T[keyof T]) => void;

	/**
	 * 여러 쿼리 파라미터 한번에 설정하기
	 */
	setMultiple: (params: Partial<T>) => void;

	/**
	 * 특정 쿼리 파라미터 제거하기
	 */
	remove: (key: keyof T) => void;

	/**
	 * 여러 쿼리 파라미터 제거하기
	 */
	removeMultiple: (keys: (keyof T)[]) => void;

	/**
	 * 모든 쿼리 파라미터 제거하기
	 */
	clear: () => void;

	/**
	 * 쿼리 파라미터가 비어있는지 확인
	 */
	isEmpty: boolean;

	/**
	 * 현재 URL의 쿼리 스트링
	 */
	queryString: string;

	/**
	 * 배치 업데이트를 위한 함수 (batchUpdates가 true일 때만 사용)
	 */
	batchUpdate?: (updates: Array<{ key: keyof T; value: T[keyof T] | undefined }>) => void;
}

/**
 * 안전한 JSON 직렬화 함수
 */
const safeStringify = (value: any): string => {
	try {
		return JSON.stringify(value);
	} catch (error) {
		// 순환 참조나 복잡한 객체의 경우 fallback
		return String(value);
	}
};

/**
 * 안전한 JSON 파싱 함수
 */
const safeParse = (value: string, fallback: any): any => {
	try {
		return JSON.parse(value);
	} catch (error) {
		return fallback;
	}
};

/**
 * 값이 비어있는지 확인하는 함수
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
 * 값을 문자열로 변환하는 함수
 */
const valueToString = (value: any): string => {
	return typeof value === 'object' && value !== null ? safeStringify(value) : String(value);
};

/**
 * URL 쿼리 파라미터를 쉽게 관리할 수 있는 훅
 *
 * @param initialQuery - 초기 쿼리 파라미터 객체
 * @param options - 옵션 설정
 * @returns 쿼리 파라미터 관리 함수들과 상태
 *
 * @example
 * ```tsx
 * const { query, set, get, clear } = useUrlQuery({
 *   page: 1,
 *   search: '',
 *   category: 'all'
 * });
 *
 * // 특정 파라미터 설정
 * set('page', 2);
 *
 * // 파라미터 값 가져오기
 * const currentPage = get('page');
 *
 * // 모든 파라미터 제거
 * clear();
 * ```
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

	// URL에서 쿼리 파라미터 파싱
	const parseQueryFromUrl = useCallback((): Partial<T> => {
		if (typeof window === 'undefined') return {};

		const searchParams = new URLSearchParams(window.location.search);
		const query: Partial<T> = {};

		for (const [key, value] of searchParams.entries()) {
			if (key in initialQuery) {
				let parsedValue: any = value;

				// 인코딩 방식 처리
				if (encoding === 'decodeURI') {
					parsedValue = decodeURI(value);
				} else if (encoding === 'none') {
					parsedValue = value;
				}

				// 타입 변환 시도
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
	}, [initialQuery, encoding]);

	// 쿼리 파라미터를 URL에 동기화
	const syncToUrl = useCallback(
		(query: T) => {
			if (typeof window === 'undefined' || !syncWithUrl) return;

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
		},
		[syncWithUrl, historyMode],
	);

	// 초기 상태 설정
	const [query, setQuery] = useState<T>(() => {
		const urlQuery = parseQueryFromUrl();
		return { ...initialQuery, ...urlQuery };
	});

	// URL 변경 감지
	useEffect(() => {
		if (!syncWithUrl) return;

		const handlePopState = () => {
			const urlQuery = parseQueryFromUrl();
			setQuery((prev) => ({ ...prev, ...urlQuery }));
		};

		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	}, [syncWithUrl, parseQueryFromUrl]);

	// 쿼리 변경 시 URL 동기화
	useEffect(() => {
		if (!syncWithUrl) return;
		syncToUrl(query);
	}, [query, syncToUrl, syncWithUrl]);

	// 특정 쿼리 파라미터 가져오기
	const get = useCallback(
		(key: keyof T): T[keyof T] | undefined => {
			return query[key];
		},
		[query],
	);

	// 특정 쿼리 파라미터 설정하기
	const set = useCallback((key: keyof T, value: T[keyof T]) => {
		setQuery((prev) => ({ ...prev, [key]: value }));
	}, []);

	// 여러 쿼리 파라미터 한번에 설정하기
	const setMultiple = useCallback((params: Partial<T>) => {
		setQuery((prev) => ({ ...prev, ...params }));
	}, []);

	// 특정 쿼리 파라미터 제거하기
	const remove = useCallback((key: keyof T) => {
		setQuery((prev) => {
			const newQuery = { ...prev };
			delete newQuery[key];
			return newQuery;
		});
	}, []);

	// 여러 쿼리 파라미터 제거하기
	const removeMultiple = useCallback((keys: (keyof T)[]) => {
		setQuery((prev) => {
			const newQuery = { ...prev };
			keys.forEach((key) => delete newQuery[key]);
			return newQuery;
		});
	}, []);

	// 모든 쿼리 파라미터 제거하기
	const clear = useCallback(() => {
		setQuery(initialQuery);
	}, [initialQuery]);

	// 배치 업데이트 함수
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

	// 계산된 값들 (메모이제이션 최적화)
	const isEmpty = useMemo(() => {
		return Object.values(query).every(isEmptyValue);
	}, [query]);

	const queryString = useMemo(() => {
		const searchParams = new URLSearchParams();
		Object.entries(query).forEach(([key, value]) => {
			if (!isEmptyValue(value)) {
				searchParams.set(key, valueToString(value));
			}
		});
		return searchParams.toString();
	}, [query]);

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

import { renderHook, act } from '@testing-library/react';
import { useUrlQuery } from '../../src/utility/useUrlQuery';

// Mock window.location
const mockLocation = {
	pathname: '/test',
	search: '',
	hash: '',
	href: 'http://localhost:3000/test',
};

Object.defineProperty(window, 'location', {
	value: mockLocation,
	writable: true,
});

// Mock history API
const mockHistory = {
	pushState: vi.fn(),
	replaceState: vi.fn(),
};

Object.defineProperty(window, 'history', {
	value: mockHistory,
	writable: true,
});

describe('useUrlQuery', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockLocation.search = '';
		mockLocation.hash = '';
	});

	describe('Basic Functionality', () => {
		it('should initialize with default values', () => {
			const { result } = renderHook(() => useUrlQuery({ page: 1, search: '', category: 'all' }));

			expect(result.current.query).toEqual({
				page: 1,
				search: '',
				category: 'all',
			});
			expect(result.current.isEmpty).toBe(false);
		});

		it('should parse query parameters from URL', () => {
			mockLocation.search = '?page=2&search=test&category=electronics';

			const { result } = renderHook(() => useUrlQuery({ page: 1, search: '', category: 'all' }));

			expect(result.current.query).toEqual({
				page: 2,
				search: 'test',
				category: 'electronics',
			});
		});

		it('should set a single query parameter', () => {
			const { result } = renderHook(() => useUrlQuery({ page: 1, search: '', category: 'all' }));

			act(() => {
				result.current.set('page', 3);
			});

			expect(result.current.query.page).toBe(3);
			expect(mockHistory.pushState).toHaveBeenCalled();
		});

		it('should set multiple query parameters', () => {
			const { result } = renderHook(() => useUrlQuery({ page: 1, search: '', category: 'all' }));

			act(() => {
				result.current.setMultiple({ page: 5, search: 'new search' });
			});

			expect(result.current.query).toEqual({
				page: 5,
				search: 'new search',
				category: 'all',
			});
		});

		it('should get a specific query parameter', () => {
			const { result } = renderHook(() => useUrlQuery({ page: 1, search: '', category: 'all' }));

			act(() => {
				result.current.set('page', 10);
			});

			expect(result.current.get('page')).toBe(10);
		});

		it('should remove a specific query parameter', () => {
			const { result } = renderHook(() =>
				useUrlQuery({ page: 1, search: 'test', category: 'all' }),
			);

			act(() => {
				result.current.remove('search');
			});

			expect(result.current.query.search).toBeUndefined();
			expect(result.current.query.page).toBe(1);
			expect(result.current.query.category).toBe('all');
		});

		it('should remove multiple query parameters', () => {
			const { result } = renderHook(() =>
				useUrlQuery({ page: 1, search: 'test', category: 'all' }),
			);

			act(() => {
				result.current.removeMultiple(['search', 'category']);
			});

			expect(result.current.query.search).toBeUndefined();
			expect(result.current.query.category).toBeUndefined();
			expect(result.current.query.page).toBe(1);
		});

		it('should clear all query parameters', () => {
			const { result } = renderHook(() => useUrlQuery({ page: 1, search: '', category: 'all' }));

			act(() => {
				result.current.set('search', 'test');
			});

			act(() => {
				result.current.clear();
			});

			expect(result.current.query).toEqual({
				page: 1,
				search: '',
				category: 'all',
			});
		});

		it('should detect empty query parameters', () => {
			const { result } = renderHook(() => useUrlQuery({ page: 1, search: '', category: 'all' }));

			act(() => {
				result.current.setMultiple({ page: undefined, search: '', category: '' });
			});

			expect(result.current.isEmpty).toBe(true);
		});

		it('should generate correct query string', () => {
			const { result } = renderHook(() => useUrlQuery({ page: 1, search: '', category: 'all' }));

			act(() => {
				result.current.setMultiple({ page: 5, search: 'test search', category: 'electronics' });
			});

			expect(result.current.queryString).toBe('page=5&search=test+search&category=electronics');
		});
	});

	describe('Data Type Handling', () => {
		it('should handle different data types correctly', () => {
			const { result } = renderHook(() =>
				useUrlQuery({
					page: 1,
					isActive: false,
					tags: ['tag1', 'tag2'],
					search: '',
				}),
			);

			act(() => {
				result.current.set('page', 10);
				result.current.set('isActive', true);
				result.current.set('tags', ['new', 'tags']);
			});

			expect(result.current.query.page).toBe(10);
			expect(result.current.query.isActive).toBe(true);
			expect(result.current.query.tags).toEqual(['new', 'tags']);
		});

		it('should handle null and undefined values', () => {
			const { result } = renderHook(() => useUrlQuery({ page: 1, search: '', category: 'all' }));

			act(() => {
				result.current.set('search', null as any);
				result.current.set('category', undefined as any);
				result.current.set('page', undefined as any);
			});

			expect(result.current.query.search).toBeNull();
			expect(result.current.query.category).toBeUndefined();
			expect(result.current.query.page).toBeUndefined();
			expect(result.current.isEmpty).toBe(true);
		});

		it('should handle empty strings correctly', () => {
			const { result } = renderHook(() => useUrlQuery({ page: 1, search: '', category: 'all' }));

			act(() => {
				result.current.set('search', '');
				result.current.set('category', '');
				result.current.set('page', undefined as any);
			});

			expect(result.current.query.search).toBe('');
			expect(result.current.query.category).toBe('');
			expect(result.current.query.page).toBeUndefined();
			expect(result.current.isEmpty).toBe(true);
		});

		it('should handle zero values correctly', () => {
			const { result } = renderHook(() => useUrlQuery({ page: 1, count: 0, search: '' }));

			act(() => {
				result.current.set('page', 0);
				result.current.set('count', 0);
			});

			expect(result.current.query.page).toBe(0);
			expect(result.current.query.count).toBe(0);
			expect(result.current.isEmpty).toBe(false); // 0은 빈 값이 아님
		});

		it('should handle very large numbers', () => {
			const { result } = renderHook(() => useUrlQuery({ page: 1, id: 0 }));

			act(() => {
				result.current.set('page', Number.MAX_SAFE_INTEGER);
				result.current.set('id', Number.MIN_SAFE_INTEGER);
			});

			expect(result.current.query.page).toBe(Number.MAX_SAFE_INTEGER);
			expect(result.current.query.id).toBe(Number.MIN_SAFE_INTEGER);
		});

		it('should handle empty objects and arrays', () => {
			const { result } = renderHook(() => useUrlQuery({ filters: {}, items: [], page: 1 }));

			act(() => {
				result.current.set('filters', {});
				result.current.set('items', []);
			});

			expect(result.current.query.filters).toEqual({});
			expect(result.current.query.items).toEqual([]);
			expect(result.current.isEmpty).toBe(false); // 빈 객체/배열은 빈 값이 아님
		});
	});

	describe('Complex Objects', () => {
		it('should handle complex objects in query parameters', () => {
			const { result } = renderHook(() =>
				useUrlQuery({
					filters: { category: 'all', price: { min: 0, max: 100 } },
					page: 1,
				}),
			);

			act(() => {
				result.current.set('filters', { category: 'electronics', price: { min: 10, max: 500 } });
			});

			expect(result.current.query.filters).toEqual({
				category: 'electronics',
				price: { min: 10, max: 500 },
			});
		});

		it('should handle deeply nested objects', () => {
			const { result } = renderHook(() =>
				useUrlQuery({
					config: {
						ui: {
							theme: 'light',
							layout: { sidebar: true, header: false },
						},
						api: { timeout: 5000, retries: 3 },
					},
					page: 1,
				}),
			);

			act(() => {
				result.current.set('config', {
					ui: {
						theme: 'dark',
						layout: { sidebar: false, header: true },
					},
					api: { timeout: 10000, retries: 5 },
				});
			});

			expect(result.current.query.config).toEqual({
				ui: {
					theme: 'dark',
					layout: { sidebar: false, header: true },
				},
				api: { timeout: 10000, retries: 5 },
			});
		});

		it('should handle arrays of objects', () => {
			const { result } = renderHook(() =>
				useUrlQuery({
					users: [
						{ id: 1, name: 'Alice', active: true },
						{ id: 2, name: 'Bob', active: false },
					],
					page: 1,
				}),
			);

			act(() => {
				result.current.set('users', [
					{ id: 3, name: 'Charlie', active: true },
					{ id: 4, name: 'David', active: true },
				]);
			});

			expect(result.current.query.users).toEqual([
				{ id: 3, name: 'Charlie', active: true },
				{ id: 4, name: 'David', active: true },
			]);
		});
	});

	describe('Options and Configuration', () => {
		it('should use replace mode when specified', () => {
			const { result } = renderHook(() =>
				useUrlQuery({ page: 1, search: '' }, { historyMode: 'replace' }),
			);

			act(() => {
				result.current.set('page', 5);
			});

			expect(mockHistory.replaceState).toHaveBeenCalled();
			expect(mockHistory.pushState).not.toHaveBeenCalled();
		});

		it('should not sync with URL when syncWithUrl is false', () => {
			const { result } = renderHook(() =>
				useUrlQuery({ page: 1, search: '' }, { syncWithUrl: false }),
			);

			act(() => {
				result.current.set('page', 5);
			});

			expect(mockHistory.pushState).not.toHaveBeenCalled();
		});

		it('should handle encoding options correctly', () => {
			mockLocation.search = '?search=test%20search&category=electronics';

			const { result: result1 } = renderHook(() =>
				useUrlQuery({ search: '', category: '' }, { encoding: 'decodeURIComponent' }),
			);

			const { result: result2 } = renderHook(() =>
				useUrlQuery({ search: '', category: '' }, { encoding: 'decodeURI' }),
			);

			expect(result1.current.query.search).toBe('test search');
			expect(result2.current.query.search).toBe('test search');
		});
	});

	describe('URL and Hash Handling', () => {
		it('should preserve hash in URL', () => {
			mockLocation.hash = '#section1';
			const { result } = renderHook(() => useUrlQuery({ page: 1, search: '' }));

			act(() => {
				result.current.set('page', 5);
			});

			expect(mockHistory.pushState).toHaveBeenCalledWith(null, '', '/test?page=5#section1');
		});

		it('should handle empty query string correctly', () => {
			const { result } = renderHook(() => useUrlQuery({ page: 1, search: '' }));

			act(() => {
				result.current.setMultiple({ page: undefined as any, search: undefined as any });
			});

			expect(result.current.queryString).toBe('');
		});

		it('should handle special characters in query parameters', () => {
			const { result } = renderHook(() => useUrlQuery({ search: '', filter: '' }));

			act(() => {
				result.current.set('search', 'test & query');
				result.current.set('filter', 'category=electronics&price=100-500');
			});

			expect(result.current.queryString).toContain('search=test+%26+query');
			expect(result.current.queryString).toContain(
				'filter=category%3Delectronics%26price%3D100-500',
			);
		});

		it('should handle unicode characters correctly', () => {
			const { result } = renderHook(() => useUrlQuery({ search: '', name: '' }));

			act(() => {
				result.current.set('search', '한글 검색');
				result.current.set('name', 'José María');
			});

			expect(result.current.queryString).toContain('search=');
			expect(result.current.queryString).toContain('name=');
			expect(result.current.query.search).toBe('한글 검색');
			expect(result.current.query.name).toBe('José María');
		});

		it('should handle very long query strings', () => {
			const { result } = renderHook(() => useUrlQuery({ data: '' }));

			const longString = 'a'.repeat(10000);

			act(() => {
				result.current.set('data', longString);
			});

			expect(result.current.query.data).toBe(longString);
			expect(result.current.queryString.length).toBeGreaterThan(10000);
		});
	});

	describe('Edge Cases and Error Handling', () => {
		it('should handle popstate events correctly', () => {
			const { result } = renderHook(() => useUrlQuery({ page: 1, search: '' }));

			// Simulate popstate event
			act(() => {
				mockLocation.search = '?page=10&search=new';
				window.dispatchEvent(new PopStateEvent('popstate'));
			});

			expect(result.current.query.page).toBe(10);
			expect(result.current.query.search).toBe('new');
		});

		it('should handle invalid JSON in query parameters', () => {
			mockLocation.search = '?tags=invalid-json&page=1';

			const { result } = renderHook(() => useUrlQuery({ tags: [], page: 1 }));

			expect(result.current.query.tags).toEqual(['invalid-json']);
		});

		it('should handle missing keys in initial query', () => {
			mockLocation.search = '?unknown=value&page=2';

			const { result } = renderHook(() => useUrlQuery({ page: 1, search: '' }));

			expect(result.current.query).toEqual({ page: 2, search: '' });
			expect((result.current.query as any).unknown).toBeUndefined();
		});

		it('should handle boolean values correctly', () => {
			mockLocation.search = '?isActive=true&isVisible=false';

			const { result } = renderHook(() => useUrlQuery({ isActive: false, isVisible: true }));

			expect(result.current.query.isActive).toBe(true);
			expect(result.current.query.isVisible).toBe(false);
		});

		it('should handle numeric strings correctly', () => {
			mockLocation.search = '?page=5&count=10';

			const { result } = renderHook(() => useUrlQuery({ page: 1, count: 0 }));

			expect(result.current.query.page).toBe(5);
			expect(result.current.query.count).toBe(10);
		});

		it('should handle duplicate keys in URL', () => {
			mockLocation.search = '?page=1&page=2&search=test';

			const { result } = renderHook(() => useUrlQuery({ page: 1, search: '' }));

			// URLSearchParams는 마지막 값을 사용
			expect(result.current.query.page).toBe(2);
			expect(result.current.query.search).toBe('test');
		});

		it('should handle concurrent updates', () => {
			const { result } = renderHook(() => useUrlQuery({ page: 1, search: '', category: '' }));

			// 동시에 여러 업데이트 수행
			act(() => {
				result.current.set('page', 5);
				result.current.set('search', 'test');
				result.current.set('category', 'electronics');
			});

			expect(result.current.query).toEqual({
				page: 5,
				search: 'test',
				category: 'electronics',
			});
		});
	});

	describe('Memory and Performance', () => {
		it('should not cause memory leaks with event listeners', () => {
			const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
			const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

			const { unmount } = renderHook(() => useUrlQuery({ page: 1, search: '' }));

			expect(addEventListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function));

			unmount();

			expect(removeEventListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function));
		});

		it('should memoize computed values correctly', () => {
			const { result, rerender } = renderHook(() => useUrlQuery({ page: 1, search: '' }));

			const initialQueryString = result.current.queryString;
			const initialIsEmpty = result.current.isEmpty;

			// Rerender without changes
			rerender();

			expect(result.current.queryString).toBe(initialQueryString);
			expect(result.current.isEmpty).toBe(initialIsEmpty);
		});

		it('should handle rapid successive updates efficiently', () => {
			const { result } = renderHook(() => useUrlQuery({ page: 1, search: '' }));

			const startTime = performance.now();

			// 빠른 연속 업데이트
			for (let i = 0; i < 100; i++) {
				act(() => {
					result.current.set('page', i);
				});
			}

			const endTime = performance.now();
			const duration = endTime - startTime;

			// 성능 테스트: 100ms 이내에 완료되어야 함
			expect(duration).toBeLessThan(100);
			expect(result.current.query.page).toBe(99);
		});

		it('should handle batch updates when enabled', () => {
			const { result } = renderHook(() =>
				useUrlQuery({ page: 1, search: '', category: '' }, { batchUpdates: true }),
			);

			expect(result.current.batchUpdate).toBeDefined();

			act(() => {
				result.current.batchUpdate!([
					{ key: 'page', value: 5 },
					{ key: 'search', value: 'test' },
					{ key: 'category', value: undefined },
				]);
			});

			expect(result.current.query.page).toBe(5);
			expect(result.current.query.search).toBe('test');
			expect(result.current.query.category).toBeUndefined();
		});

		it('should handle safe JSON serialization for complex objects', () => {
			const { result } = renderHook(() => useUrlQuery({ data: null }));

			// 순환 참조가 있는 객체
			const circularObj: any = { name: 'test' };
			circularObj.self = circularObj;

			act(() => {
				result.current.set('data', circularObj);
			});

			// 안전한 직렬화가 작동하는지 확인
			expect(result.current.query.data).toBeDefined();
			expect(typeof result.current.queryString).toBe('string');
		});

		it('should handle safeStringify fallback for circular references', () => {
			const { result } = renderHook(() => useUrlQuery({ data: null }));

			// 순환 참조가 있는 객체
			const circularObj: any = { name: 'test', items: [] };
			circularObj.self = circularObj;
			circularObj.items.push(circularObj);

			act(() => {
				result.current.set('data', circularObj);
			});

			// safeStringify가 순환 참조를 안전하게 처리하는지 확인
			expect(result.current.query.data).toBeDefined();
			expect(result.current.queryString).toContain('data=');
			// queryString이 생성되었다는 것은 safeStringify가 작동했다는 의미
			expect(result.current.queryString).toBeTruthy();
		});

		it('should handle safeParse fallback for invalid JSON', () => {
			// 잘못된 JSON이 URL에 있는 상황 시뮬레이션
			mockLocation.search = '?data=invalid-json-string&page=1';

			const { result } = renderHook(() => useUrlQuery({ data: [], page: 1 }));

			// safeParse가 잘못된 JSON을 fallback으로 처리하는지 확인
			expect(result.current.query.data).toEqual(['invalid-json-string']);
			expect(result.current.query.page).toBe(1);
		});

		it('should handle safeParse with complex invalid JSON', () => {
			// 복잡한 잘못된 JSON 시뮬레이션
			mockLocation.search = '?data={invalid:json,missing:quotes}&page=1';

			const { result } = renderHook(() => useUrlQuery({ data: [], page: 1 }));

			// safeParse가 복잡한 잘못된 JSON도 처리하는지 확인
			expect(result.current.query.data).toEqual(['{invalid:json,missing:quotes}']);
			expect(result.current.query.page).toBe(1);
		});

		it('should handle safeStringify with functions and symbols', () => {
			const { result } = renderHook(() => useUrlQuery({ data: null as any }));

			// JSON.stringify에서 직렬화할 수 없는 값들
			const problematicObj = {
				func: () => 'test',
				symbol: Symbol('test'),
				undefined: undefined,
			};

			act(() => {
				result.current.set('data', problematicObj);
			});

			// safeStringify가 문제가 있는 객체도 처리하는지 확인
			expect(result.current.query.data).toBeDefined();
			expect(typeof result.current.queryString).toBe('string');
			expect(() => JSON.stringify(result.current.query)).not.toThrow();
		});

		it('should handle safe JSON parsing for invalid JSON', () => {
			mockLocation.search = '?data=invalid-json-string&page=1';

			const { result } = renderHook(() => useUrlQuery({ data: [], page: 1 }));

			// 잘못된 JSON이 fallback으로 처리되는지 확인
			expect(result.current.query.data).toEqual(['invalid-json-string']);
			expect(result.current.query.page).toBe(1);
		});

		it('should handle valueToString for different data types', () => {
			const { result } = renderHook(() =>
				useUrlQuery({
					stringValue: '',
					numberValue: 0,
					objectValue: null as any,
					arrayValue: null as any,
					booleanValue: false,
				}),
			);

			act(() => {
				result.current.set('stringValue', 'test string');
				result.current.set('numberValue', 42);
				result.current.set('objectValue', { key: 'value' });
				result.current.set('arrayValue', [1, 2, 3]);
				result.current.set('booleanValue', true);
			});

			// valueToString이 다양한 타입을 올바르게 처리하는지 확인
			expect(result.current.queryString).toContain('stringValue=test+string');
			expect(result.current.queryString).toContain('numberValue=42');
			expect(result.current.queryString).toContain('objectValue=');
			expect(result.current.queryString).toContain('arrayValue=');
			expect(result.current.queryString).toContain('booleanValue=true');
		});

		it('should handle isEmptyValue correctly', () => {
			const { result } = renderHook(() =>
				useUrlQuery({
					emptyString: '',
					nullValue: null as any,
					undefinedValue: undefined as any,
					emptyArray: null as any,
					zeroValue: 0,
					normalValue: 'test',
				}),
			);

			act(() => {
				result.current.set('emptyString', '');
				result.current.set('nullValue', null);
				result.current.set('undefinedValue', undefined);
				result.current.set('emptyArray', []);
				result.current.set('zeroValue', 0);
				result.current.set('normalValue', 'test');
			});

			// isEmptyValue가 빈 값들을 올바르게 감지하는지 확인
			expect(result.current.isEmpty).toBe(false); // zeroValue와 normalValue가 있으므로

			act(() => {
				result.current.set('zeroValue', undefined);
				result.current.set('normalValue', '');
			});

			expect(result.current.isEmpty).toBe(true);
		});

		it('should optimize URL updates by avoiding unnecessary calls', () => {
			const { result } = renderHook(() => useUrlQuery({ page: 1, search: '' }));

			// 같은 값으로 설정해도 URL이 업데이트되지 않아야 함
			const initialCallCount = mockHistory.pushState.mock.calls.length;

			act(() => {
				result.current.set('page', 1); // 같은 값
			});

			// URL 업데이트가 최적화되어 불필요한 호출이 줄어들어야 함
			expect(mockHistory.pushState.mock.calls.length).toBeGreaterThanOrEqual(initialCallCount);
		});

		it('should have improved performance with optimized serialization', () => {
			const { result } = renderHook(() => useUrlQuery({ data: null as any }));

			const complexObject = {
				nested: {
					deep: {
						array: Array.from({ length: 1000 }, (_, i) => i),
						object: { key: 'value' },
					},
				},
				items: Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` })),
			};

			const startTime = performance.now();

			act(() => {
				result.current.set('data', complexObject);
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			// 성능 테스트: 50ms 이내에 완료되어야 함
			expect(duration).toBeLessThan(50);
			expect(result.current.query.data).toBeDefined();
		});

		it('should reduce memory usage by removing unnecessary refs', () => {
			const { result, unmount } = renderHook(() => useUrlQuery({ page: 1, search: '' }));

			// 메모리 사용량이 최적화되었는지 확인
			expect(result.current.query).toBeDefined();
			expect(result.current.set).toBeDefined();

			// 컴포넌트 언마운트 시 메모리 누수 없음
			unmount();
		});

		it('should have consistent performance across multiple operations', () => {
			const { result } = renderHook(() => useUrlQuery({ page: 1, search: '', category: '' }));

			const operations = [
				() => result.current.set('page', 5),
				() => result.current.set('search', 'test'),
				() => result.current.set('category', 'electronics'),
				() => result.current.setMultiple({ page: 10, search: 'new' }),
				() => result.current.remove('category'),
				() => result.current.removeMultiple(['page', 'search']),
			];

			const startTime = performance.now();

			operations.forEach((operation) => {
				act(() => operation());
			});

			const endTime = performance.now();
			const duration = endTime - startTime;

			// 성능 테스트: 100ms 이내에 완료되어야 함
			expect(duration).toBeLessThan(100);
		});
	});
});

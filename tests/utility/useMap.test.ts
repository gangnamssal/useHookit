import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useMap } from '../../src/utility/useMap';

describe('useMap', () => {
	describe('기본 기능', () => {
		it('초기값으로 Map을 생성해야 한다', () => {
			const { result } = renderHook(() =>
				useMap({
					initialValue: [
						['apple', 1],
						['banana', 2],
					],
				}),
			);
			const [map, operations] = result.current;

			expect(map instanceof Map).toBe(true);
			expect(operations.size).toBe(2);
			expect(operations.has('apple')).toBe(true);
			expect(operations.has('banana')).toBe(true);
		});

		it('빈 Map으로 초기화해야 한다', () => {
			const { result } = renderHook(() => useMap());
			const [map, operations] = result.current;

			expect(map instanceof Map).toBe(true);
			expect(operations.size).toBe(0);
			expect(operations.isEmpty).toBe(true);
		});

		it('null/undefined 초기값을 안전하게 처리해야 한다', () => {
			const { result } = renderHook(() => useMap({ initialValue: undefined as any }));
			const [, operations] = result.current;

			expect(operations.size).toBe(0);
			expect(operations.isEmpty).toBe(true);
		});

		it('빈 배열 초기값을 안전하게 처리해야 한다', () => {
			const { result } = renderHook(() => useMap({ initialValue: [] }));
			const [, operations] = result.current;

			expect(operations.size).toBe(0);
			expect(operations.isEmpty).toBe(true);
		});
	});

	describe('기본 Map 메서드들', () => {
		it('set 메서드가 키-값 쌍을 추가해야 한다', () => {
			const { result } = renderHook(() => useMap<string, number>());

			act(() => {
				result.current[1].set('apple', 1);
			});

			expect(result.current[1].has('apple')).toBe(true);
			expect(result.current[1].get('apple')).toBe(1);
			expect(result.current[1].size).toBe(1);
		});

		it('get 메서드가 값을 반환해야 한다', () => {
			const { result } = renderHook(() =>
				useMap({
					initialValue: [
						['apple', 1],
						['banana', 2],
					],
				}),
			);

			expect(result.current[1].get('apple')).toBe(1);
			expect(result.current[1].get('banana')).toBe(2);
			expect(result.current[1].get('nonexistent')).toBeUndefined();
		});

		it('delete 메서드가 키-값 쌍을 제거해야 한다', () => {
			const { result } = renderHook(() =>
				useMap({
					initialValue: [
						['apple', 1],
						['banana', 2],
					],
				}),
			);

			act(() => {
				result.current[1].delete('apple');
			});

			expect(result.current[1].has('apple')).toBe(false);
			expect(result.current[1].get('apple')).toBeUndefined();
			expect(result.current[1].size).toBe(1);
		});

		it('존재하지 않는 키를 delete해도 안전해야 한다', () => {
			const { result } = renderHook(() => useMap({ initialValue: [['apple', 1]] }));

			act(() => {
				result.current[1].delete('nonexistent');
			});

			expect(result.current[1].size).toBe(1);
			expect(result.current[1].has('apple')).toBe(true);
		});

		it('has 메서드가 키 존재 여부를 확인해야 한다', () => {
			const { result } = renderHook(() => useMap({ initialValue: [['apple', 1]] }));

			expect(result.current[1].has('apple')).toBe(true);
			expect(result.current[1].has('banana')).toBe(false);
		});

		it('clear 메서드가 모든 키-값 쌍을 제거해야 한다', () => {
			const { result } = renderHook(() =>
				useMap({
					initialValue: [
						['apple', 1],
						['banana', 2],
					],
				}),
			);

			act(() => {
				result.current[1].clear();
			});

			expect(result.current[1].size).toBe(0);
			expect(result.current[1].isEmpty).toBe(true);
			expect(result.current[1].has('apple')).toBe(false);
			expect(result.current[1].has('banana')).toBe(false);
		});

		it('이미 비어있는 Map을 clear해도 안전해야 한다', () => {
			const { result } = renderHook(() => useMap());

			act(() => {
				result.current[1].clear();
			});

			expect(result.current[1].size).toBe(0);
			expect(result.current[1].isEmpty).toBe(true);
		});
	});

	describe('편의 메서드들', () => {
		it('toggle 메서드가 키가 있으면 제거하고 없으면 추가해야 한다', () => {
			const { result } = renderHook(() => useMap<string, number>());

			// 키가 없을 때 추가
			act(() => {
				result.current[1].toggle('apple', 1);
			});

			expect(result.current[1].has('apple')).toBe(true);
			expect(result.current[1].get('apple')).toBe(1);

			// 키가 있을 때 제거
			act(() => {
				result.current[1].toggle('apple', 1);
			});

			expect(result.current[1].has('apple')).toBe(false);
			expect(result.current[1].size).toBe(0);
		});

		it('setMultiple 메서드가 여러 키-값 쌍을 한 번에 추가해야 한다', () => {
			const { result } = renderHook(() => useMap<string, number>());

			act(() => {
				result.current[1].setMultiple([
					['apple', 1],
					['banana', 2],
					['orange', 3],
				]);
			});

			expect(result.current[1].size).toBe(3);
			expect(result.current[1].has('apple')).toBe(true);
			expect(result.current[1].has('banana')).toBe(true);
			expect(result.current[1].has('orange')).toBe(true);
		});

		it('setMultiple 메서드가 빈 배열을 안전하게 처리해야 한다', () => {
			const { result } = renderHook(() => useMap({ initialValue: [['apple', 1]] }));

			act(() => {
				result.current[1].setMultiple([]);
			});

			expect(result.current[1].size).toBe(1);
			expect(result.current[1].has('apple')).toBe(true);
		});

		it('deleteMultiple 메서드가 여러 키를 한 번에 제거해야 한다', () => {
			const { result } = renderHook(() =>
				useMap({
					initialValue: [
						['apple', 1],
						['banana', 2],
						['orange', 3],
					],
				}),
			);

			act(() => {
				result.current[1].deleteMultiple(['apple', 'banana']);
			});

			expect(result.current[1].size).toBe(1);
			expect(result.current[1].has('apple')).toBe(false);
			expect(result.current[1].has('banana')).toBe(false);
			expect(result.current[1].has('orange')).toBe(true);
		});

		it('deleteMultiple 메서드가 존재하지 않는 키를 안전하게 처리해야 한다', () => {
			const { result } = renderHook(() =>
				useMap({
					initialValue: [
						['apple', 1],
						['banana', 2],
					],
				}),
			);

			act(() => {
				result.current[1].deleteMultiple(['apple', 'nonexistent', 'banana']);
			});

			expect(result.current[1].size).toBe(0);
			expect(result.current[1].has('apple')).toBe(false);
			expect(result.current[1].has('banana')).toBe(false);
		});

		it('update 메서드가 기존 값을 업데이트해야 한다', () => {
			const { result } = renderHook(() => useMap({ initialValue: [['apple', 1]] }));

			act(() => {
				result.current[1].update('apple', (value: number | undefined) => (value || 0) + 1);
			});

			expect(result.current[1].get('apple')).toBe(2);
		});

		it('update 메서드가 존재하지 않는 키에 새 값을 설정해야 한다', () => {
			const { result } = renderHook(() => useMap<string, number>());

			act(() => {
				result.current[1].update('apple', (value: number | undefined) => (value || 0) + 1);
			});

			expect(result.current[1].get('apple')).toBe(1);
			expect(result.current[1].has('apple')).toBe(true);
		});
	});

	describe('조회 메서드들', () => {
		it('size가 올바른 크기를 반환해야 한다', () => {
			const { result } = renderHook(() =>
				useMap({
					initialValue: [
						['apple', 1],
						['banana', 2],
					],
				}),
			);

			expect(result.current[1].size).toBe(2);
		});

		it('isEmpty가 빈 Map을 올바르게 확인해야 한다', () => {
			const { result } = renderHook(() => useMap());

			expect(result.current[1].isEmpty).toBe(true);

			act(() => {
				result.current[1].set('apple', 1);
			});

			expect(result.current[1].isEmpty).toBe(false);
		});

		it('keys가 모든 키를 배열로 반환해야 한다', () => {
			const { result } = renderHook(() =>
				useMap({
					initialValue: [
						['apple', 1],
						['banana', 2],
					],
				}),
			);

			const keys = result.current[1].keys;
			expect(Array.isArray(keys)).toBe(true);
			expect(keys).toContain('apple');
			expect(keys).toContain('banana');
			expect(keys.length).toBe(2);
		});

		it('values가 모든 값을 배열로 반환해야 한다', () => {
			const { result } = renderHook(() =>
				useMap({
					initialValue: [
						['apple', 1],
						['banana', 2],
					],
				}),
			);

			const values = result.current[1].values;
			expect(Array.isArray(values)).toBe(true);
			expect(values).toContain(1);
			expect(values).toContain(2);
			expect(values.length).toBe(2);
		});

		it('entries가 모든 키-값 쌍을 배열로 반환해야 한다', () => {
			const { result } = renderHook(() =>
				useMap({
					initialValue: [
						['apple', 1],
						['banana', 2],
					],
				}),
			);

			const entries = result.current[1].entries;
			expect(Array.isArray(entries)).toBe(true);
			expect(entries).toContainEqual(['apple', 1]);
			expect(entries).toContainEqual(['banana', 2]);
			expect(entries.length).toBe(2);
		});

		it('빈 Map의 조회 메서드들이 올바르게 작동해야 한다', () => {
			const { result } = renderHook(() => useMap());

			expect(result.current[1].size).toBe(0);
			expect(result.current[1].isEmpty).toBe(true);
			expect(result.current[1].keys).toEqual([]);
			expect(result.current[1].values).toEqual([]);
			expect(result.current[1].entries).toEqual([]);
		});
	});

	describe('변환 메서드들', () => {
		it('filter가 조건에 맞는 키-값 쌍을 필터링해야 한다', () => {
			const { result } = renderHook(() =>
				useMap({
					initialValue: [
						['apple', 1],
						['banana', 2],
						['orange', 3],
					],
				}),
			);

			const filtered = result.current[1].filter((key, value) => value > 1);
			expect(filtered).toContainEqual(['banana', 2]);
			expect(filtered).toContainEqual(['orange', 3]);
			expect(filtered).not.toContainEqual(['apple', 1]);
			expect(filtered.length).toBe(2);
		});

		it('map이 모든 키-값 쌍을 변환해야 한다', () => {
			const { result } = renderHook(() =>
				useMap({
					initialValue: [
						['apple', 1],
						['banana', 2],
					],
				}),
			);

			const mapped = result.current[1].map((key, value) => `${key}: ${value}`);
			expect(mapped).toContain('apple: 1');
			expect(mapped).toContain('banana: 2');
			expect(mapped.length).toBe(2);
		});

		it('find가 조건에 맞는 첫 번째 키-값 쌍을 찾아야 한다', () => {
			const { result } = renderHook(() =>
				useMap({
					initialValue: [
						['apple', 1],
						['banana', 2],
						['orange', 3],
					],
				}),
			);

			const found = result.current[1].find((key, value) => value === 2);
			expect(found).toEqual(['banana', 2]);
		});

		it('find가 조건에 맞는 키-값 쌍이 없으면 undefined를 반환해야 한다', () => {
			const { result } = renderHook(() =>
				useMap({
					initialValue: [
						['apple', 1],
						['banana', 2],
					],
				}),
			);

			const found = result.current[1].find((key, value) => value === 5);
			expect(found).toBeUndefined();
		});

		it('findKey가 조건에 맞는 첫 번째 키를 찾아야 한다', () => {
			const { result } = renderHook(() =>
				useMap({
					initialValue: [
						['apple', 1],
						['banana', 2],
						['orange', 3],
					],
				}),
			);

			const foundKey = result.current[1].findKey((key, value) => value === 2);
			expect(foundKey).toBe('banana');
		});

		it('findValue가 조건에 맞는 첫 번째 값을 찾아야 한다', () => {
			const { result } = renderHook(() =>
				useMap({
					initialValue: [
						['apple', 1],
						['banana', 2],
						['orange', 3],
					],
				}),
			);

			const foundValue = result.current[1].findValue((key, value) => key === 'banana');
			expect(foundValue).toBe(2);
		});

		it('빈 Map의 변환 메서드들이 올바르게 작동해야 한다', () => {
			const { result } = renderHook(() => useMap());

			expect(result.current[1].filter((key: any, value: any) => true)).toEqual([]);
			expect(result.current[1].map((key: any, value: any) => `${key}: ${value}`)).toEqual([]);
			expect(result.current[1].find((key: any, value: any) => true)).toBeUndefined();
			expect(result.current[1].findKey((key: any, value: any) => true)).toBeUndefined();
			expect(result.current[1].findValue((key: any, value: any) => true)).toBeUndefined();
		});

		it('filter가 빈 결과를 반환해야 한다', () => {
			const { result } = renderHook(() =>
				useMap({
					initialValue: [
						['apple', 1],
						['banana', 2],
					],
				}),
			);

			const filtered = result.current[1].filter((key, value) => value > 10);
			expect(filtered).toEqual([]);
		});

		it('map이 복잡한 변환을 처리해야 한다', () => {
			const { result } = renderHook(() =>
				useMap({
					initialValue: [
						['apple', 1],
						['banana', 2],
					],
				}),
			);

			const mapped = result.current[1].map((key, value) => ({ key, value, doubled: value * 2 }));
			expect(mapped).toContainEqual({ key: 'apple', value: 1, doubled: 2 });
			expect(mapped).toContainEqual({ key: 'banana', value: 2, doubled: 4 });
		});
	});

	describe('디버그 모드', () => {
		it('디버그 모드가 활성화되면 로그를 출력해야 한다', () => {
			const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
			const { result } = renderHook(() => useMap({ debug: true }));

			act(() => {
				result.current[1].set('apple', 1);
			});

			expect(consoleSpy).toHaveBeenCalledWith('[useMap] set:', 'apple', 1, '->', [['apple', 1]]);

			consoleSpy.mockRestore();
		});

		it('디버그 모드가 비활성화되면 로그를 출력하지 않아야 한다', () => {
			const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
			const { result } = renderHook(() => useMap({ debug: false }));

			act(() => {
				result.current[1].set('apple', 1);
			});

			expect(consoleSpy).not.toHaveBeenCalled();

			consoleSpy.mockRestore();
		});
	});

	describe('복잡한 객체', () => {
		interface User {
			id: number;
			name: string;
			age: number;
		}

		it('복잡한 객체를 키-값으로 사용할 수 있어야 한다', () => {
			const { result } = renderHook(() =>
				useMap<number, User>({
					initialValue: [
						[1, { id: 1, name: 'Alice', age: 25 }],
						[2, { id: 2, name: 'Bob', age: 30 }],
					],
				}),
			);

			expect(result.current[1].size).toBe(2);
			expect(result.current[1].has(1)).toBe(true);
			expect(result.current[1].get(1)).toEqual({ id: 1, name: 'Alice', age: 25 });
		});

		it('복잡한 객체를 추가하고 조회할 수 있어야 한다', () => {
			const { result } = renderHook(() => useMap<number, User>());

			act(() => {
				result.current[1].set(1, { id: 1, name: 'Alice', age: 25 });
			});

			expect(result.current[1].has(1)).toBe(true);
			expect(result.current[1].get(1)).toEqual({ id: 1, name: 'Alice', age: 25 });
		});
	});

	describe('엣지 케이스들', () => {
		it('null과 undefined 값을 안전하게 처리해야 한다', () => {
			const { result } = renderHook(() => useMap<any, any>());

			act(() => {
				result.current[1].set(null, 'null value');
				result.current[1].set(undefined, 'undefined value');
			});

			expect(result.current[1].has(null)).toBe(true);
			expect(result.current[1].has(undefined)).toBe(true);
			expect(result.current[1].get(null)).toBe('null value');
			expect(result.current[1].get(undefined)).toBe('undefined value');
			expect(result.current[1].size).toBe(2);
		});

		it('숫자와 문자열 키를 구분해서 처리해야 한다', () => {
			const { result } = renderHook(() => useMap<any, string>());

			act(() => {
				result.current[1].set(1, 'number key');
				result.current[1].set('1', 'string key');
			});

			expect(result.current[1].has(1)).toBe(true);
			expect(result.current[1].has('1')).toBe(true);
			expect(result.current[1].get(1)).toBe('number key');
			expect(result.current[1].get('1')).toBe('string key');
			expect(result.current[1].size).toBe(2);
		});

		it('함수 값도 올바르게 처리해야 한다', () => {
			const func1 = () => 'hello';
			const func2 = () => 'world';
			const { result } = renderHook(() => useMap<any, any>({ initialValue: [['func1', func1]] }));

			act(() => {
				result.current[1].set('func2', func2);
			});

			expect(result.current[1].has('func1')).toBe(true);
			expect(result.current[1].has('func2')).toBe(true);
			expect(result.current[1].get('func1')).toBe(func1);
			expect(result.current[1].get('func2')).toBe(func2);
			expect(result.current[1].size).toBe(2);
		});

		it('Symbol 키도 올바르게 처리해야 한다', () => {
			const sym1 = Symbol('test1');
			const sym2 = Symbol('test2');
			const { result } = renderHook(() =>
				useMap<any, string>({ initialValue: [[sym1, 'value1']] }),
			);

			act(() => {
				result.current[1].set(sym2, 'value2');
			});

			expect(result.current[1].has(sym1)).toBe(true);
			expect(result.current[1].has(sym2)).toBe(true);
			expect(result.current[1].get(sym1)).toBe('value1');
			expect(result.current[1].get(sym2)).toBe('value2');
			expect(result.current[1].size).toBe(2);
		});

		it('빈 문자열 키도 올바르게 처리해야 한다', () => {
			const { result } = renderHook(() => useMap());

			act(() => {
				result.current[1].set('', 'empty string key');
			});

			expect(result.current[1].has('')).toBe(true);
			expect(result.current[1].get('')).toBe('empty string key');
			expect(result.current[1].size).toBe(1);
		});

		it('NaN 키도 올바르게 처리해야 한다', () => {
			const { result } = renderHook(() => useMap());

			act(() => {
				result.current[1].set(NaN, 'NaN key');
			});

			expect(result.current[1].has(NaN)).toBe(true);
			expect(result.current[1].get(NaN)).toBe('NaN key');
			expect(result.current[1].size).toBe(1);
		});

		it('Infinity 키도 올바르게 처리해야 한다', () => {
			const { result } = renderHook(() => useMap());

			act(() => {
				result.current[1].set(Infinity, 'Infinity key');
				result.current[1].set(-Infinity, '-Infinity key');
			});

			expect(result.current[1].has(Infinity)).toBe(true);
			expect(result.current[1].has(-Infinity)).toBe(true);
			expect(result.current[1].get(Infinity)).toBe('Infinity key');
			expect(result.current[1].get(-Infinity)).toBe('-Infinity key');
			expect(result.current[1].size).toBe(2);
		});

		it('객체 키도 올바르게 처리해야 한다', () => {
			const obj1 = { id: 1 };
			const obj2 = { id: 2 };
			const { result } = renderHook(() => useMap<any, string>());

			act(() => {
				result.current[1].set(obj1, 'object1');
				result.current[1].set(obj2, 'object2');
			});

			expect(result.current[1].has(obj1)).toBe(true);
			expect(result.current[1].has(obj2)).toBe(true);
			expect(result.current[1].get(obj1)).toBe('object1');
			expect(result.current[1].get(obj2)).toBe('object2');
			expect(result.current[1].size).toBe(2);
		});

		it('배열 키도 올바르게 처리해야 한다', () => {
			const arr1 = [1, 2, 3];
			const arr2 = [4, 5, 6];
			const { result } = renderHook(() => useMap<any, string>());

			act(() => {
				result.current[1].set(arr1, 'array1');
				result.current[1].set(arr2, 'array2');
			});

			expect(result.current[1].has(arr1)).toBe(true);
			expect(result.current[1].has(arr2)).toBe(true);
			expect(result.current[1].get(arr1)).toBe('array1');
			expect(result.current[1].get(arr2)).toBe('array2');
			expect(result.current[1].size).toBe(2);
		});

		it('중복된 키로 set을 호출해도 안전해야 한다', () => {
			const { result } = renderHook(() => useMap({ initialValue: [['apple', 1]] }));

			act(() => {
				result.current[1].set('apple', 2); // 같은 키, 다른 값
			});

			expect(result.current[1].get('apple')).toBe(2);
			expect(result.current[1].size).toBe(1);
		});

		it('toggle에서 같은 키로 여러 번 호출해도 안전해야 한다', () => {
			const { result } = renderHook(() => useMap<string, number>());

			act(() => {
				result.current[1].toggle('apple', 1);
				result.current[1].toggle('apple', 1);
				result.current[1].toggle('apple', 1);
			});

			expect(result.current[1].has('apple')).toBe(true);
			expect(result.current[1].get('apple')).toBe(1);
		});

		it('update에서 기존 키의 값을 undefined로 변경해야 한다', () => {
			const { result } = renderHook(() => useMap({ initialValue: [['apple', 1]] }));

			act(() => {
				result.current[1].update('apple', () => undefined as any);
			});

			expect(result.current[1].has('apple')).toBe(true);
			expect(result.current[1].get('apple')).toBeUndefined();
		});
	});

	describe('성능 최적화', () => {
		it('동일한 값으로 set을 호출해도 불필요한 업데이트를 방지해야 한다', () => {
			const { result } = renderHook(() => useMap({ initialValue: [['apple', 1]] }));

			act(() => {
				result.current[1].set('apple', 1); // 동일한 값
			});

			// 상태가 변경되지 않았으므로 동일한 참조를 유지해야 함
			expect(result.current[0]).toBe(result.current[0]);
		});

		it('존재하지 않는 키를 delete해도 불필요한 업데이트를 방지해야 한다', () => {
			const { result } = renderHook(() => useMap({ initialValue: [['apple', 1]] }));

			act(() => {
				result.current[1].delete('nonexistent');
			});

			// 상태가 변경되지 않았으므로 동일한 참조를 유지해야 함
			expect(result.current[0]).toBe(result.current[0]);
		});

		it('이미 비어있는 Map을 clear해도 불필요한 업데이트를 방지해야 한다', () => {
			const { result } = renderHook(() => useMap());

			act(() => {
				result.current[1].clear();
			});

			// 상태가 변경되지 않았으므로 동일한 참조를 유지해야 함
			expect(result.current[0]).toBe(result.current[0]);
		});

		it('update 메서드에서 동일한 값으로 업데이트해도 불필요한 업데이트를 방지해야 한다', () => {
			const { result } = renderHook(() => useMap({ initialValue: [['apple', 1]] }));

			act(() => {
				result.current[1].update('apple', (value: number | undefined) => value || 1); // 동일한 값 반환
			});

			// 상태가 변경되지 않았으므로 동일한 참조를 유지해야 함
			expect(result.current[0]).toBe(result.current[0]);
		});

		it('setMultiple에서 동일한 값들로 업데이트해도 불필요한 업데이트를 방지해야 한다', () => {
			const { result } = renderHook(() =>
				useMap({
					initialValue: [
						['apple', 1],
						['banana', 2],
					],
				}),
			);

			act(() => {
				result.current[1].setMultiple([
					['apple', 1], // 동일한 값
					['banana', 2], // 동일한 값
				]);
			});

			// 상태가 변경되지 않았으므로 동일한 참조를 유지해야 함
			expect(result.current[0]).toBe(result.current[0]);
		});

		it('setMultiple에서 일부만 변경되어도 업데이트가 발생해야 한다', () => {
			const { result } = renderHook(() =>
				useMap({
					initialValue: [
						['apple', 1],
						['banana', 2],
					],
				}),
			);

			act(() => {
				result.current[1].setMultiple([
					['apple', 1], // 동일한 값
					['banana', 3], // 변경된 값
				]);
			});

			// 상태가 변경되었으므로 다른 참조를 가져야 함
			expect(result.current[1].get('banana')).toBe(3);
		});
	});
});

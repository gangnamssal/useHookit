import { renderHook, act } from '@testing-library/react';
import { useSet } from '../../src/utility/useSet';

describe('useSet', () => {
	describe('기본 기능', () => {
		it('초기값으로 Set을 생성해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple', 'banana'] }));
			const [set, operations] = result.current;

			expect(set.has('apple')).toBe(true);
			expect(set.has('banana')).toBe(true);
			expect(operations.size).toBe(2);
		});

		it('빈 Set으로 초기화해야 한다', () => {
			const { result } = renderHook(() => useSet());
			const [set, operations] = result.current;

			expect(operations.size).toBe(0);
			expect(operations.isEmpty).toBe(true);
		});

		it('null/undefined 초기값을 안전하게 처리해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: undefined as any }));
			const [, operations] = result.current;

			expect(operations.size).toBe(0);
			expect(operations.isEmpty).toBe(true);
		});
	});

	describe('기본 Set 메서드들', () => {
		it('add 메서드가 값을 추가해야 한다', () => {
			const { result } = renderHook(() => useSet());

			act(() => {
				result.current[1].add('apple');
			});

			expect(result.current[1].has('apple')).toBe(true);
			expect(result.current[1].size).toBe(1);
		});

		it('delete 메서드가 값을 삭제해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple', 'banana'] }));

			act(() => {
				result.current[1].delete('apple');
			});

			expect(result.current[1].has('apple')).toBe(false);
			expect(result.current[1].has('banana')).toBe(true);
			expect(result.current[1].size).toBe(1);
		});

		it('존재하지 않는 값을 delete해도 안전해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple'] }));

			act(() => {
				result.current[1].delete('nonexistent');
			});

			expect(result.current[1].has('apple')).toBe(true);
			expect(result.current[1].size).toBe(1);
		});

		it('clear 메서드가 모든 값을 삭제해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple', 'banana', 'orange'] }));

			act(() => {
				result.current[1].clear();
			});

			expect(result.current[1].size).toBe(0);
			expect(result.current[1].isEmpty).toBe(true);
		});

		it('이미 비어있는 Set을 clear해도 안전해야 한다', () => {
			const { result } = renderHook(() => useSet());

			act(() => {
				result.current[1].clear();
			});

			expect(result.current[1].size).toBe(0);
			expect(result.current[1].isEmpty).toBe(true);
		});

		it('has 메서드가 값의 존재 여부를 확인해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple'] }));
			const [, operations] = result.current;

			expect(operations.has('apple')).toBe(true);
			expect(operations.has('banana')).toBe(false);
		});

		it('이미 존재하는 값을 add해도 상태가 변경되지 않아야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple'] }));

			act(() => {
				result.current[1].add('apple'); // 이미 존재하는 값
			});

			expect(result.current[1].size).toBe(1);
			expect(result.current[1].has('apple')).toBe(true);
		});
	});

	describe('편의 메서드들', () => {
		it('toggle 메서드가 값을 토글해야 한다', () => {
			const { result } = renderHook(() => useSet());

			// 추가
			act(() => {
				result.current[1].toggle('apple');
			});
			expect(result.current[1].has('apple')).toBe(true);

			// 제거
			act(() => {
				result.current[1].toggle('apple');
			});
			expect(result.current[1].has('apple')).toBe(false);
		});

		it('addMultiple 메서드가 여러 값을 추가해야 한다', () => {
			const { result } = renderHook(() => useSet());

			act(() => {
				result.current[1].addMultiple(['apple', 'banana', 'orange']);
			});

			expect(result.current[1].has('apple')).toBe(true);
			expect(result.current[1].has('banana')).toBe(true);
			expect(result.current[1].has('orange')).toBe(true);
			expect(result.current[1].size).toBe(3);
		});

		it('addMultiple 메서드가 빈 배열을 안전하게 처리해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple'] }));

			act(() => {
				result.current[1].addMultiple([]);
			});

			expect(result.current[1].size).toBe(1);
			expect(result.current[1].has('apple')).toBe(true);
		});

		it('addMultiple 메서드가 중복된 값을 안전하게 처리해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple'] }));

			act(() => {
				result.current[1].addMultiple(['apple', 'banana', 'apple']); // 중복된 값
			});

			expect(result.current[1].size).toBe(2);
			expect(result.current[1].has('apple')).toBe(true);
			expect(result.current[1].has('banana')).toBe(true);
		});

		it('addMultiple 메서드가 null/undefined 값을 안전하게 처리해야 한다', () => {
			const { result } = renderHook(() => useSet<any>());

			act(() => {
				result.current[1].addMultiple(['apple', null, undefined, 'banana']);
			});

			expect(result.current[1].has('apple')).toBe(true);
			expect(result.current[1].has('banana')).toBe(true);
			expect(result.current[1].has(null)).toBe(true);
			expect(result.current[1].has(undefined)).toBe(true);
			expect(result.current[1].size).toBe(4);
		});

		it('deleteMultiple 메서드가 여러 값을 삭제해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple', 'banana', 'orange'] }));

			act(() => {
				result.current[1].deleteMultiple(['apple', 'banana']);
			});

			expect(result.current[1].has('apple')).toBe(false);
			expect(result.current[1].has('banana')).toBe(false);
			expect(result.current[1].has('orange')).toBe(true);
			expect(result.current[1].size).toBe(1);
		});

		it('deleteMultiple 메서드가 빈 배열을 안전하게 처리해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple'] }));

			act(() => {
				result.current[1].deleteMultiple([]);
			});

			expect(result.current[1].size).toBe(1);
			expect(result.current[1].has('apple')).toBe(true);
		});

		it('deleteMultiple 메서드가 존재하지 않는 값을 안전하게 처리해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple', 'banana'] }));

			act(() => {
				result.current[1].deleteMultiple(['apple', 'nonexistent', 'banana']);
			});

			expect(result.current[1].has('apple')).toBe(false);
			expect(result.current[1].has('banana')).toBe(false);
			expect(result.current[1].size).toBe(0);
		});
	});

	describe('조회 메서드들', () => {
		it('size가 올바른 크기를 반환해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple', 'banana'] }));
			const [, operations] = result.current;

			expect(operations.size).toBe(2);
		});

		it('isEmpty가 올바른 상태를 반환해야 한다', () => {
			const { result: emptyResult } = renderHook(() => useSet());
			const { result: nonEmptyResult } = renderHook(() => useSet({ initialValue: ['apple'] }));

			expect(emptyResult.current[1].isEmpty).toBe(true);
			expect(nonEmptyResult.current[1].isEmpty).toBe(false);
		});

		it('values가 모든 값을 배열로 반환해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple', 'banana'] }));
			const [, operations] = result.current;

			const values = operations.values;
			expect(values).toContain('apple');
			expect(values).toContain('banana');
			expect(values.length).toBe(2);
		});

		it('빈 Set의 values가 빈 배열을 반환해야 한다', () => {
			const { result } = renderHook(() => useSet());
			const [, operations] = result.current;

			const values = operations.values;
			expect(Array.isArray(values)).toBe(true);
			expect(values.length).toBe(0);
		});
	});

	describe('변환 메서드들', () => {
		it('values가 배열을 반환해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple', 'banana'] }));
			const [, operations] = result.current;

			const values = operations.values;
			expect(Array.isArray(values)).toBe(true);
			expect(values).toContain('apple');
			expect(values).toContain('banana');
		});
	});

	describe('집합 연산 메서드들', () => {
		it('union이 두 Set을 합쳐야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple', 'banana'] }));

			const otherSet = new Set(['banana', 'orange']);

			act(() => {
				result.current[1].union(otherSet);
			});

			expect(result.current[1].has('apple')).toBe(true);
			expect(result.current[1].has('banana')).toBe(true);
			expect(result.current[1].has('orange')).toBe(true);
			expect(result.current[1].size).toBe(3);
		});

		it('union이 빈 Set을 안전하게 처리해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple', 'banana'] }));

			const emptySet = new Set<string>();

			act(() => {
				result.current[1].union(emptySet);
			});

			expect(result.current[1].has('apple')).toBe(true);
			expect(result.current[1].has('banana')).toBe(true);
			expect(result.current[1].size).toBe(2);
		});

		it('union이 중복된 값을 안전하게 처리해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple', 'banana'] }));

			const otherSet = new Set(['banana', 'orange']); // banana는 중복

			act(() => {
				result.current[1].union(otherSet);
			});

			expect(result.current[1].has('apple')).toBe(true);
			expect(result.current[1].has('banana')).toBe(true);
			expect(result.current[1].has('orange')).toBe(true);
			expect(result.current[1].size).toBe(3);
		});

		it('intersection이 두 Set의 교집합을 반환해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple', 'banana', 'orange'] }));

			const otherSet = new Set(['banana', 'orange', 'grape']);

			act(() => {
				result.current[1].intersection(otherSet);
			});

			expect(result.current[1].has('apple')).toBe(false);
			expect(result.current[1].has('banana')).toBe(true);
			expect(result.current[1].has('orange')).toBe(true);
			expect(result.current[1].has('grape')).toBe(false);
			expect(result.current[1].size).toBe(2);
		});

		it('intersection이 공통 요소가 없는 Set을 안전하게 처리해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple', 'banana'] }));

			const otherSet = new Set(['orange', 'grape']);

			act(() => {
				result.current[1].intersection(otherSet);
			});

			// intersection은 교집합이 없으면 빈 Set이 되어야 함
			// 현재 구현에서는 변경사항이 없으면 상태 업데이트를 방지하므로
			// 실제로는 빈 Set이 되어야 하지만 상태는 변경되지 않음
			expect(result.current[1].size).toBe(0);
			expect(result.current[1].isEmpty).toBe(true);
		});

		it('difference가 두 Set의 차집합을 반환해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple', 'banana', 'orange'] }));

			const otherSet = new Set(['banana', 'orange']);

			act(() => {
				result.current[1].difference(otherSet);
			});

			expect(result.current[1].has('apple')).toBe(true);
			expect(result.current[1].has('banana')).toBe(false);
			expect(result.current[1].has('orange')).toBe(false);
			expect(result.current[1].size).toBe(1);
		});

		it('difference가 빈 Set을 안전하게 처리해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple', 'banana'] }));

			const emptySet = new Set<string>();

			act(() => {
				result.current[1].difference(emptySet);
			});

			expect(result.current[1].has('apple')).toBe(true);
			expect(result.current[1].has('banana')).toBe(true);
			expect(result.current[1].size).toBe(2);
		});

		it('symmetricDifference가 두 Set의 대칭차집합을 반환해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple', 'banana'] }));

			const otherSet = new Set(['banana', 'orange']);

			act(() => {
				result.current[1].symmetricDifference(otherSet);
			});

			expect(result.current[1].has('apple')).toBe(true);
			expect(result.current[1].has('banana')).toBe(false);
			expect(result.current[1].has('orange')).toBe(true);
			expect(result.current[1].size).toBe(2);
		});

		it('symmetricDifference가 동일한 Set을 안전하게 처리해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple', 'banana'] }));

			const sameSet = new Set(['apple', 'banana']);

			act(() => {
				result.current[1].symmetricDifference(sameSet);
			});

			// symmetricDifference는 동일한 Set이면 빈 Set이 되어야 함
			// 하지만 현재 구현에서는 변경사항이 없으면 상태 업데이트를 방지함
			expect(result.current[1].size).toBe(0);
			expect(result.current[1].isEmpty).toBe(true);
		});
	});

	describe('필터링 메서드들', () => {
		it('filter가 조건에 맞는 값들을 반환해야 한다', () => {
			const { result } = renderHook(() =>
				useSet({ initialValue: ['apple', 'banana', 'orange', 'grape'] }),
			);
			const [, operations] = result.current;

			const filtered = operations.filter((value: string) => value.length > 5);

			expect(filtered).toContain('banana');
			expect(filtered).toContain('orange');
			expect(filtered).not.toContain('apple');
			expect(filtered).not.toContain('grape');
		});

		it('filter가 모든 조건을 만족하지 않는 경우 빈 배열을 반환해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple', 'banana'] }));
			const [, operations] = result.current;

			const filtered = operations.filter((value: string) => value.length > 10);

			expect(filtered).toEqual([]);
		});

		it('map이 모든 값을 변환해야 한다', () => {
			const { result } = renderHook(() => useSet({ initialValue: ['apple', 'banana'] }));
			const [, operations] = result.current;

			const mapped = operations.map((value: string) => value.toUpperCase());

			expect(mapped).toContain('APPLE');
			expect(mapped).toContain('BANANA');
			expect(mapped.length).toBe(2);
		});

		it('map이 빈 Set에 대해 빈 배열을 반환해야 한다', () => {
			const { result } = renderHook(() => useSet<string>());
			const [, operations] = result.current;

			const mapped = operations.map((value: string) => value.toUpperCase());

			expect(mapped).toEqual([]);
		});
	});

	describe('디버그 모드', () => {
		it('디버그 모드가 활성화되면 로그가 출력되어야 한다', () => {
			const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
			const { result } = renderHook(() => useSet({ debug: true }));

			act(() => {
				result.current[1].add('apple');
			});

			expect(consoleSpy).toHaveBeenCalledWith('[useSet] add:', 'apple', '->', ['apple']);
			consoleSpy.mockRestore();
		});

		it('디버그 모드가 비활성화되면 로그가 출력되지 않아야 한다', () => {
			const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
			const { result } = renderHook(() => useSet({ debug: false }));

			act(() => {
				result.current[1].add('apple');
			});

			expect(consoleSpy).not.toHaveBeenCalledWith(expect.stringContaining('[useSet]'));
			consoleSpy.mockRestore();
		});
	});

	describe('엣지 케이스들', () => {
		it('중복된 값을 add해도 Set의 특성상 중복이 제거되어야 한다', () => {
			const { result } = renderHook(() => useSet());

			act(() => {
				result.current[1].add('apple');
				result.current[1].add('apple');
			});

			expect(result.current[1].size).toBe(1);
			expect(result.current[1].has('apple')).toBe(true);
		});

		it('객체 값도 올바르게 처리해야 한다', () => {
			const obj1 = { id: 1, name: 'apple' };
			const obj2 = { id: 2, name: 'banana' };
			const { result } = renderHook(() => useSet({ initialValue: [obj1] }));

			act(() => {
				result.current[1].add(obj2);
			});

			expect(result.current[1].has(obj1)).toBe(true);
			expect(result.current[1].has(obj2)).toBe(true);
			expect(result.current[1].size).toBe(2);
		});

		it('빈 Set으로 집합 연산을 수행해도 안전해야 한다', () => {
			const { result } = renderHook(() => useSet());

			const otherSet = new Set(['apple', 'banana']);

			act(() => {
				result.current[1].union(otherSet);
			});

			expect(result.current[1].has('apple')).toBe(true);
			expect(result.current[1].has('banana')).toBe(true);
			expect(result.current[1].size).toBe(2);
		});

		it('null과 undefined 값을 안전하게 처리해야 한다', () => {
			const { result } = renderHook(() => useSet<any>());

			act(() => {
				result.current[1].add(null);
				result.current[1].add(undefined);
			});

			expect(result.current[1].has(null)).toBe(true);
			expect(result.current[1].has(undefined)).toBe(true);
			expect(result.current[1].size).toBe(2);
		});

		it('숫자와 문자열을 구분해서 처리해야 한다', () => {
			const { result } = renderHook(() => useSet());

			act(() => {
				result.current[1].add(1);
				result.current[1].add('1');
			});

			expect(result.current[1].has(1)).toBe(true);
			expect(result.current[1].has('1')).toBe(true);
			expect(result.current[1].size).toBe(2);
		});

		it('함수 값도 올바르게 처리해야 한다', () => {
			const func1 = () => 'hello';
			const func2 = () => 'world';
			const { result } = renderHook(() => useSet({ initialValue: [func1] }));

			act(() => {
				result.current[1].add(func2);
			});

			expect(result.current[1].has(func1)).toBe(true);
			expect(result.current[1].has(func2)).toBe(true);
			expect(result.current[1].size).toBe(2);
		});

		it('Symbol 값도 올바르게 처리해야 한다', () => {
			const sym1 = Symbol('test1');
			const sym2 = Symbol('test2');
			const { result } = renderHook(() => useSet({ initialValue: [sym1] }));

			act(() => {
				result.current[1].add(sym2);
			});

			expect(result.current[1].has(sym1)).toBe(true);
			expect(result.current[1].has(sym2)).toBe(true);
			expect(result.current[1].size).toBe(2);
		});

		it('빈 문자열도 올바르게 처리해야 한다', () => {
			const { result } = renderHook(() => useSet());

			act(() => {
				result.current[1].add('');
			});

			expect(result.current[1].has('')).toBe(true);
			expect(result.current[1].size).toBe(1);
		});

		it('NaN 값도 올바르게 처리해야 한다', () => {
			const { result } = renderHook(() => useSet());

			act(() => {
				result.current[1].add(NaN);
			});

			expect(result.current[1].has(NaN)).toBe(true);
			expect(result.current[1].size).toBe(1);
		});

		it('Infinity 값도 올바르게 처리해야 한다', () => {
			const { result } = renderHook(() => useSet());

			act(() => {
				result.current[1].add(Infinity);
				result.current[1].add(-Infinity);
			});

			expect(result.current[1].has(Infinity)).toBe(true);
			expect(result.current[1].has(-Infinity)).toBe(true);
			expect(result.current[1].size).toBe(2);
		});
	});
});

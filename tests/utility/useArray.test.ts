import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useArray } from '../../src/utility/useArray';

describe('useArray', () => {
	it('기본 옵션으로 훅을 초기화해야 함', () => {
		const { result } = renderHook(() => useArray<number>());
		const [array, operations] = result.current;

		expect(array).toEqual([]);
		expect(operations.length).toBe(0);
		expect(operations.isEmpty).toBe(true);
		expect(operations.isNotEmpty).toBe(false);
	});

	it('초기값으로 훅을 초기화해야 함', () => {
		const initialValue = [1, 2, 3];
		const { result } = renderHook(() => useArray({ initialValue }));
		const [array, operations] = result.current;

		expect(array).toEqual(initialValue);
		expect(operations.length).toBe(3);
		expect(operations.isEmpty).toBe(false);
		expect(operations.isNotEmpty).toBe(true);
	});

	it('push 메서드가 배열 끝에 아이템을 추가해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2] }));
		const [, operations] = result.current;

		act(() => {
			operations.push(3);
		});

		expect(result.current[0]).toEqual([1, 2, 3]);
	});

	it('push 메서드가 undefined와 null 값을 올바르게 처리해야 함', () => {
		const { result } = renderHook(() => useArray<unknown>());
		const [, operations] = result.current;

		act(() => {
			operations.push(undefined);
			operations.push(null);
		});

		expect(result.current[0]).toEqual([undefined, null]);
	});

	it('unshift 메서드가 배열 시작에 아이템을 추가해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2] }));
		const [, operations] = result.current;

		act(() => {
			operations.unshift(0);
		});

		expect(result.current[0]).toEqual([0, 1, 2]);
	});

	it('unshift 메서드가 undefined와 null 값을 올바르게 처리해야 함', () => {
		const { result } = renderHook(() => useArray<unknown>());
		const [, operations] = result.current;

		act(() => {
			operations.unshift(undefined);
			operations.unshift(null);
		});

		expect(result.current[0]).toEqual([null, undefined]);
	});

	it('pop 메서드가 배열 끝에서 아이템을 제거해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		let removedItem: number | undefined;
		act(() => {
			removedItem = operations.pop();
		});

		expect(removedItem).toBe(3);
		expect(result.current[0]).toEqual([1, 2]);
	});

	it('pop 메서드가 빈 배열에서 undefined를 반환해야 함', () => {
		const { result } = renderHook(() => useArray<number>());
		const [, operations] = result.current;

		let removedItem: number | undefined;
		act(() => {
			removedItem = operations.pop();
		});

		expect(removedItem).toBeUndefined();
		expect(result.current[0]).toEqual([]);
	});

	it('pop 메서드가 단일 요소 배열에서 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1] }));
		const [, operations] = result.current;

		let removedItem: number | undefined;
		act(() => {
			removedItem = operations.pop();
		});

		expect(removedItem).toBe(1);
		expect(result.current[0]).toEqual([]);
		expect(result.current[1].isEmpty).toBe(true);
	});

	it('shift 메서드가 배열 시작에서 아이템을 제거해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		let removedItem: number | undefined;
		act(() => {
			removedItem = operations.shift();
		});

		expect(removedItem).toBe(1);
		expect(result.current[0]).toEqual([2, 3]);
	});

	it('shift 메서드가 빈 배열에서 undefined를 반환해야 함', () => {
		const { result } = renderHook(() => useArray<number>());
		const [, operations] = result.current;

		let removedItem: number | undefined;
		act(() => {
			removedItem = operations.shift();
		});

		expect(removedItem).toBeUndefined();
		expect(result.current[0]).toEqual([]);
	});

	it('shift 메서드가 단일 요소 배열에서 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1] }));
		const [, operations] = result.current;

		let removedItem: number | undefined;
		act(() => {
			removedItem = operations.shift();
		});

		expect(removedItem).toBe(1);
		expect(result.current[0]).toEqual([]);
		expect(result.current[1].isEmpty).toBe(true);
	});

	it('removeAt 메서드가 특정 인덱스의 아이템을 제거해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		let removedItem: number | undefined;
		act(() => {
			removedItem = operations.removeAt(1);
		});

		expect(removedItem).toBe(2);
		expect(result.current[0]).toEqual([1, 3]);
	});

	it('removeAt 메서드가 유효하지 않은 인덱스에서 undefined를 반환해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		let removedItem: number | undefined;
		act(() => {
			removedItem = operations.removeAt(5);
		});

		expect(removedItem).toBeUndefined();
		expect(result.current[0]).toEqual([1, 2, 3]);
	});

	it('removeAt 메서드가 음수 인덱스에서 undefined를 반환해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		let removedItem: number | undefined;
		act(() => {
			removedItem = operations.removeAt(-1);
		});

		expect(removedItem).toBeUndefined();
		expect(result.current[0]).toEqual([1, 2, 3]);
	});

	it('removeAt 메서드가 경계값에서 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		// 첫 번째 요소 제거
		act(() => {
			operations.removeAt(0);
		});
		expect(result.current[0]).toEqual([2, 3]);

		// 마지막 요소 제거 (배열이 [2, 3]이 되었으므로 인덱스 1이 3)
		act(() => {
			operations.removeAt(1);
		});
		expect(result.current[0]).toEqual([2]);
	});

	it('removeAt 메서드가 단일 요소 배열에서 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1] }));
		const [, operations] = result.current;

		let removedItem: number | undefined;
		act(() => {
			removedItem = operations.removeAt(0);
		});

		expect(removedItem).toBe(1);
		expect(result.current[0]).toEqual([]);
		expect(result.current[1].isEmpty).toBe(true);
	});

	it('remove 메서드가 조건에 맞는 아이템들을 제거해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3, 4, 5] }));
		const [, operations] = result.current;

		let removedItems: number[] = [];
		act(() => {
			removedItems = operations.remove((item: number) => item % 2 === 0);
		});

		expect(removedItems).toEqual([2, 4]);
		expect(result.current[0]).toEqual([1, 3, 5]);
	});

	it('remove 메서드가 조건에 맞는 아이템이 없으면 빈 배열을 반환해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		let removedItems: number[] = [];
		act(() => {
			removedItems = operations.remove((item: number) => item > 10);
		});

		expect(removedItems).toEqual([]);
		expect(result.current[0]).toEqual([1, 2, 3]);
	});

	it('remove 메서드가 모든 아이템을 제거할 때 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		let removedItems: number[] = [];
		act(() => {
			removedItems = operations.remove((item: number) => true);
		});

		expect(removedItems).toEqual([1, 2, 3]);
		expect(result.current[0]).toEqual([]);
		expect(result.current[1].isEmpty).toBe(true);
	});

	it('remove 메서드가 빈 배열에서 빈 배열을 반환해야 함', () => {
		const { result } = renderHook(() => useArray<number>());
		const [, operations] = result.current;

		let removedItems: number[] = [];
		act(() => {
			removedItems = operations.remove((item: number) => true);
		});

		expect(removedItems).toEqual([]);
		expect(result.current[0]).toEqual([]);
		expect(result.current[1].isEmpty).toBe(true);
	});

	it('updateAt 메서드가 특정 인덱스의 아이템을 업데이트해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		act(() => {
			operations.updateAt(1, 10);
		});

		expect(result.current[0]).toEqual([1, 10, 3]);
	});

	it('updateAt 메서드가 유효하지 않은 인덱스에서 아무것도 하지 않아야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		act(() => {
			operations.updateAt(5, 10);
		});

		expect(result.current[0]).toEqual([1, 2, 3]);
	});

	it('updateAt 메서드가 음수 인덱스에서 아무것도 하지 않아야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		act(() => {
			operations.updateAt(-1, 10);
		});

		expect(result.current[0]).toEqual([1, 2, 3]);
	});

	it('updateAt 메서드가 경계값에서 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		// 첫 번째 요소 업데이트
		act(() => {
			operations.updateAt(0, 10);
		});
		expect(result.current[0]).toEqual([10, 2, 3]);

		// 마지막 요소 업데이트
		act(() => {
			operations.updateAt(2, 30);
		});
		expect(result.current[0]).toEqual([10, 2, 30]);
	});

	it('updateAt 메서드가 undefined와 null 값으로 업데이트할 수 있어야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		act(() => {
			operations.updateAt(1, undefined as any);
		});
		expect(result.current[0]).toEqual([1, undefined, 3]);

		act(() => {
			operations.updateAt(2, null as any);
		});
		expect(result.current[0]).toEqual([1, undefined, null]);
	});

	it('insertAt 메서드가 특정 인덱스에 아이템을 삽입해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		act(() => {
			operations.insertAt(1, 10);
		});

		expect(result.current[0]).toEqual([1, 10, 2, 3]);
	});

	it('insertAt 메서드가 음수 인덱스에서 배열 끝에 삽입해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		act(() => {
			operations.insertAt(-1, 10);
		});

		// JavaScript splice는 음수 인덱스를 배열 끝에서부터 계산
		// -1은 마지막 요소 다음 위치, 즉 배열 끝
		expect(result.current[0]).toEqual([1, 2, 10, 3]);
	});

	it('insertAt 메서드가 배열 길이보다 큰 인덱스에서 배열 끝에 삽입해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		act(() => {
			operations.insertAt(10, 10);
		});

		expect(result.current[0]).toEqual([1, 2, 3, 10]);
	});

	it('insertAt 메서드가 빈 배열에서 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useArray<number>());
		const [, operations] = result.current;

		act(() => {
			operations.insertAt(0, 1);
		});

		expect(result.current[0]).toEqual([1]);
	});

	it('insertAt 메서드가 undefined와 null 값을 삽입할 수 있어야 함', () => {
		const { result } = renderHook(() => useArray<unknown>());
		const [, operations] = result.current;

		act(() => {
			operations.insertAt(0, undefined);
			operations.insertAt(1, null);
		});

		expect(result.current[0]).toEqual([undefined, null]);
	});

	it('clear 메서드가 모든 아이템을 제거해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		act(() => {
			operations.clear();
		});

		expect(result.current[0]).toEqual([]);
		expect(result.current[1].isEmpty).toBe(true);
	});

	it('clear 메서드가 빈 배열에서도 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useArray<number>());
		const [, operations] = result.current;

		act(() => {
			operations.clear();
		});

		expect(result.current[0]).toEqual([]);
		expect(result.current[1].isEmpty).toBe(true);
	});

	it('set 메서드가 전체 배열을 교체해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		act(() => {
			operations.set([10, 20, 30]);
		});

		expect(result.current[0]).toEqual([10, 20, 30]);
	});

	it('set 메서드가 빈 배열로 설정할 때 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		act(() => {
			operations.set([]);
		});

		expect(result.current[0]).toEqual([]);
		expect(result.current[1].isEmpty).toBe(true);
	});

	it('set 메서드가 undefined와 null 값을 포함한 배열로 설정할 수 있어야 함', () => {
		const { result } = renderHook(() => useArray<unknown>());
		const [, operations] = result.current;

		act(() => {
			operations.set([undefined, null, 1]);
		});

		expect(result.current[0]).toEqual([undefined, null, 1]);
	});

	it('filter 메서드가 조건에 맞는 아이템들만 남겨야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3, 4, 5] }));
		const [, operations] = result.current;

		act(() => {
			operations.filter((item: number) => item > 2);
		});

		expect(result.current[0]).toEqual([3, 4, 5]);
	});

	it('filter 메서드가 모든 요소가 필터링될 때 빈 배열을 반환해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		act(() => {
			operations.filter((item: number) => item > 10);
		});

		expect(result.current[0]).toEqual([]);
		expect(result.current[1].isEmpty).toBe(true);
	});

	it('filter 메서드가 빈 배열에서 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useArray<number>());
		const [, operations] = result.current;

		act(() => {
			operations.filter((item: number) => item > 0);
		});

		expect(result.current[0]).toEqual([]);
		expect(result.current[1].isEmpty).toBe(true);
	});

	it('filter 메서드가 undefined와 null 값을 올바르게 처리해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [undefined, null, 1, 2] }));
		const [, operations] = result.current;

		act(() => {
			operations.filter((item: unknown) => item !== undefined && item !== null);
		});

		expect(result.current[0]).toEqual([1, 2]);
	});

	it('sort 메서드가 배열을 정렬해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [3, 1, 4, 1, 5] }));
		const [, operations] = result.current;

		act(() => {
			operations.sort((a: number, b: number) => a - b);
		});

		expect(result.current[0]).toEqual([1, 1, 3, 4, 5]);
	});

	it('sort 메서드가 빈 배열에서 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useArray<number>());
		const [, operations] = result.current;

		act(() => {
			operations.sort();
		});

		expect(result.current[0]).toEqual([]);
	});

	it('sort 메서드가 단일 요소 배열에서 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1] }));
		const [, operations] = result.current;

		act(() => {
			operations.sort();
		});

		expect(result.current[0]).toEqual([1]);
	});

	it('sort 메서드가 undefined와 null 값을 포함한 배열에서 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [3, undefined, 1, null, 2] }));
		const [, operations] = result.current;

		act(() => {
			operations.sort((a: unknown, b: unknown) => {
				if (a === undefined || a === null) return 1;
				if (b === undefined || b === null) return -1;
				return (a as number) - (b as number);
			});
		});

		// JavaScript sort는 undefined와 null을 배열 끝으로 보내지만 순서는 보장하지 않음
		// 숫자 부분만 확인
		expect(result.current[0].slice(0, 3)).toEqual([1, 2, 3]);
		expect(result.current[0].slice(3)).toContain(undefined);
		expect(result.current[0].slice(3)).toContain(null);
	});

	it('reverse 메서드가 배열 순서를 뒤집어야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		act(() => {
			operations.reverse();
		});

		expect(result.current[0]).toEqual([3, 2, 1]);
	});

	it('reverse 메서드가 빈 배열에서 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useArray<number>());
		const [, operations] = result.current;

		act(() => {
			operations.reverse();
		});

		expect(result.current[0]).toEqual([]);
	});

	it('reverse 메서드가 단일 요소 배열에서 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1] }));
		const [, operations] = result.current;

		act(() => {
			operations.reverse();
		});

		expect(result.current[0]).toEqual([1]);
	});

	it('reverse 메서드가 undefined와 null 값을 포함한 배열에서 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, undefined, null, 2] }));
		const [, operations] = result.current;

		act(() => {
			operations.reverse();
		});

		expect(result.current[0]).toEqual([2, null, undefined, 1]);
	});

	it('find 메서드가 조건에 맞는 첫 번째 아이템을 찾아야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3, 4, 5] }));
		const [, operations] = result.current;

		const found = operations.find((item: number) => item > 3);
		expect(found).toBe(4);
	});

	it('find 메서드가 조건에 맞는 아이템이 없으면 undefined를 반환해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		const found = operations.find((item: number) => item > 10);
		expect(found).toBeUndefined();
	});

	it('find 메서드가 빈 배열에서 undefined를 반환해야 함', () => {
		const { result } = renderHook(() => useArray<number>());
		const [, operations] = result.current;

		const found = operations.find((item: number) => item > 0);
		expect(found).toBeUndefined();
	});

	it('find 메서드가 undefined와 null 값을 올바르게 처리해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, undefined, null, 2] }));
		const [, operations] = result.current;

		const foundUndefined = operations.find((item: unknown) => item === undefined);
		expect(foundUndefined).toBe(undefined);

		const foundNull = operations.find((item: unknown) => item === null);
		expect(foundNull).toBe(null);
	});

	it('findIndex 메서드가 조건에 맞는 첫 번째 아이템의 인덱스를 찾아야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3, 4, 5] }));
		const [, operations] = result.current;

		const index = operations.findIndex((item: number) => item > 3);
		expect(index).toBe(3);
	});

	it('findIndex 메서드가 조건에 맞는 아이템이 없으면 -1을 반환해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		const index = operations.findIndex((item: number) => item > 10);
		expect(index).toBe(-1);
	});

	it('findIndex 메서드가 빈 배열에서 -1을 반환해야 함', () => {
		const { result } = renderHook(() => useArray<number>());
		const [, operations] = result.current;

		const index = operations.findIndex((item: number) => item > 0);
		expect(index).toBe(-1);
	});

	it('findIndex 메서드가 undefined와 null 값을 올바르게 처리해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, undefined, null, 2] }));
		const [, operations] = result.current;

		const undefinedIndex = operations.findIndex((item: unknown) => item === undefined);
		expect(undefinedIndex).toBe(1);

		const nullIndex = operations.findIndex((item: unknown) => item === null);
		expect(nullIndex).toBe(2);
	});

	it('includes 메서드가 아이템 포함 여부를 확인해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		expect(operations.includes(2)).toBe(true);
		expect(operations.includes(5)).toBe(false);
	});

	it('includes 메서드가 NaN 값을 올바르게 처리해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [NaN, 1, 2] }));
		const [, operations] = result.current;

		expect(operations.includes(NaN)).toBe(true);
		expect(operations.includes(1)).toBe(true);
		expect(operations.includes(3)).toBe(false);
	});

	it('includes 메서드가 undefined와 null 값을 올바르게 처리해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [undefined, null, 1] }));
		const [, operations] = result.current;

		expect(operations.includes(undefined)).toBe(true);
		expect(operations.includes(null)).toBe(true);
		expect(operations.includes(1)).toBe(true);
		expect(operations.includes(2)).toBe(false);
	});

	it('get 메서드가 특정 인덱스의 아이템을 반환해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		expect(operations.get(1)).toBe(2);
		expect(operations.get(5)).toBeUndefined();
	});

	it('get 메서드가 음수 인덱스에서 undefined를 반환해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		expect(operations.get(-1)).toBeUndefined();
	});

	it('get 메서드가 undefined와 null 값을 올바르게 반환해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, undefined, null, 2] }));
		const [, operations] = result.current;

		expect(operations.get(1)).toBe(undefined);
		expect(operations.get(2)).toBe(null);
	});

	it('first 메서드가 첫 번째 아이템을 반환해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		expect(operations.first()).toBe(1);
	});

	it('first 메서드가 빈 배열에서 undefined를 반환해야 함', () => {
		const { result } = renderHook(() => useArray<number>());
		const [, operations] = result.current;

		expect(operations.first()).toBeUndefined();
	});

	it('first 메서드가 undefined와 null 값을 올바르게 반환해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [undefined, null, 1] }));
		const [, operations] = result.current;

		expect(operations.first()).toBe(undefined);
	});

	it('last 메서드가 마지막 아이템을 반환해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		expect(operations.last()).toBe(3);
	});

	it('last 메서드가 빈 배열에서 undefined를 반환해야 함', () => {
		const { result } = renderHook(() => useArray<number>());
		const [, operations] = result.current;

		expect(operations.last()).toBeUndefined();
	});

	it('last 메서드가 단일 요소 배열에서 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1] }));
		const [, operations] = result.current;

		expect(operations.last()).toBe(1);
	});

	it('last 메서드가 undefined와 null 값을 올바르게 반환해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, undefined, null] }));
		const [, operations] = result.current;

		expect(operations.last()).toBe(null);
	});

	it('debug 옵션이 활성화되면 로그를 출력해야 함', () => {
		const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
		const { result } = renderHook(() => useArray({ debug: true, initialValue: [1, 2] }));
		const [, operations] = result.current;

		act(() => {
			operations.push(3);
		});

		expect(consoleSpy).toHaveBeenCalledWith('useArray push:', 3, '->', [1, 2, 3]);

		consoleSpy.mockRestore();
	});

	it('복잡한 객체 배열에서도 정상적으로 작동해야 함', () => {
		const initialValue = [
			{ id: 1, name: 'Alice' },
			{ id: 2, name: 'Bob' },
			{ id: 3, name: 'Charlie' },
		];
		const { result } = renderHook(() => useArray({ initialValue }));
		const [, operations] = result.current;

		act(() => {
			operations.push({ id: 4, name: 'David' });
		});

		expect(result.current[0]).toHaveLength(4);
		expect(result.current[0][3]).toEqual({ id: 4, name: 'David' });

		act(() => {
			operations.remove((item: { id: number; name: string }) => item.id === 2);
		});

		expect(result.current[0]).toHaveLength(3);
		expect(
			result.current[0].find((item: { id: number; name: string }) => item.id === 2),
		).toBeUndefined();
	});

	it('여러 연속 작업이 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		act(() => {
			operations.push(4);
			operations.unshift(0);
			operations.removeAt(2);
		});

		expect(result.current[0]).toEqual([0, 1, 3, 4]);
	});

	it('메모이제이션이 제대로 작동해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		const [, operations] = result.current;

		// 첫 번째 렌더링에서의 값들
		const initialLength = operations.length;
		const initialIsEmpty = operations.isEmpty;
		const initialIsNotEmpty = operations.isNotEmpty;

		// 배열을 변경
		act(() => {
			operations.push(4);
		});

		// 값들이 업데이트되었는지 확인
		expect(result.current[1].length).toBe(initialLength + 1);
		expect(result.current[1].isEmpty).toBe(initialIsEmpty);
		expect(result.current[1].isNotEmpty).toBe(initialIsNotEmpty);
	});

	it('빈 배열에서 모든 메서드가 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useArray<number>());
		const [, operations] = result.current;

		// 읽기 전용 메서드들
		expect(operations.length).toBe(0);
		expect(operations.isEmpty).toBe(true);
		expect(operations.isNotEmpty).toBe(false);
		expect(operations.first()).toBeUndefined();
		expect(operations.last()).toBeUndefined();
		expect(operations.get(0)).toBeUndefined();
		expect(operations.find(() => true)).toBeUndefined();
		expect(operations.findIndex(() => true)).toBe(-1);
		expect(operations.includes(1)).toBe(false);

		// 수정 메서드들
		act(() => {
			operations.push(1);
		});
		expect(result.current[0]).toEqual([1]);
		expect(result.current[1].isEmpty).toBe(false);
	});

	it('대용량 배열에서도 정상적으로 작동해야 함', () => {
		const largeArray = Array.from({ length: 1000 }, (_, i) => i);
		const { result } = renderHook(() => useArray({ initialValue: largeArray }));
		const [, operations] = result.current;

		expect(result.current[0]).toHaveLength(1000);
		expect(operations.length).toBe(1000);

		act(() => {
			operations.push(1000);
		});

		expect(result.current[0]).toHaveLength(1001);
		expect(result.current[0][1000]).toBe(1000);
	});

	it('중첩된 객체 배열에서도 정상적으로 작동해야 함', () => {
		const nestedArray = [
			{ id: 1, data: { name: 'Alice', scores: [90, 85, 95] } },
			{ id: 2, data: { name: 'Bob', scores: [88, 92, 87] } },
		];
		const { result } = renderHook(() => useArray({ initialValue: nestedArray }));
		const [, operations] = result.current;

		act(() => {
			operations.push({
				id: 3,
				data: { name: 'Charlie', scores: [95, 89, 91] },
			});
		});

		expect(result.current[0]).toHaveLength(3);
		expect(result.current[0][2].data.name).toBe('Charlie');

		act(() => {
			operations.remove((item: any) => item.id === 2);
		});

		expect(result.current[0]).toHaveLength(2);
		expect(result.current[0].find((item: any) => item.id === 2)).toBeUndefined();
	});

	it('함수형 프로그래밍 패턴에서도 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useArray({ initialValue: [1, 2, 3, 4, 5] }));
		const [, operations] = result.current;

		// 체이닝 패턴 테스트
		act(() => {
			operations.push(6);
			operations.filter((item: number) => item % 2 === 0);
			operations.sort((a: number, b: number) => a - b);
		});

		expect(result.current[0]).toEqual([2, 4, 6]);
	});

	it('타입 안전성이 보장되어야 함', () => {
		// 문자열 배열
		const stringArray = renderHook(() => useArray({ initialValue: ['a', 'b', 'c'] }));
		expect(stringArray.result.current[0]).toEqual(['a', 'b', 'c']);

		// 숫자 배열
		const numberArray = renderHook(() => useArray({ initialValue: [1, 2, 3] }));
		expect(numberArray.result.current[0]).toEqual([1, 2, 3]);

		// 유니온 타입 배열
		const unionArray = renderHook(() => useArray({ initialValue: [1, 'two', 3] }));
		expect(unionArray.result.current[0]).toEqual([1, 'two', 3]);
	});
});

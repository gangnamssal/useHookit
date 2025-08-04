import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePrevious } from '../../src/lifecycle/usePrevious';

describe('usePrevious', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('기본 사용법 - 첫 번째 렌더링에서는 undefined를 반환한다', () => {
		const { result } = renderHook(() => usePrevious('initial'));

		expect(result.current).toBeUndefined();
	});

	it('기본 사용법 - 값이 변경되면 이전 값을 반환한다', () => {
		const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
			initialProps: { value: 'first' },
		});

		expect(result.current).toBeUndefined();

		rerender({ value: 'second' });
		expect(result.current).toBe('first');

		rerender({ value: 'third' });
		expect(result.current).toBe('second');
	});

	it('초기값 옵션 - 첫 번째 렌더링에서는 초기값을 반환한다', () => {
		const { result } = renderHook(() => usePrevious('current', { initialValue: 'initial' }));

		expect(result.current).toBe('initial');
	});

	it('초기값 옵션 - 값이 변경되면 이전 값을 반환한다', () => {
		const { result, rerender } = renderHook(
			({ value }) => usePrevious(value, { initialValue: 'initial' }),
			{
				initialProps: { value: 'first' },
			},
		);

		expect(result.current).toBe('initial');

		rerender({ value: 'second' });
		expect(result.current).toBe('first');

		rerender({ value: 'third' });
		expect(result.current).toBe('second');
	});

	it('배열 초기값 - 첫 번째 렌더링에서는 빈 배열을 반환한다', () => {
		const { result } = renderHook(() => usePrevious([1, 2, 3], { initialValue: [] }));

		expect(result.current).toEqual([]);
	});

	it('배열 초기값 - 배열이 변경되면 이전 배열을 반환한다', () => {
		const { result, rerender } = renderHook(
			({ values }) => usePrevious(values, { initialValue: [] }),
			{
				initialProps: { values: [1, 2, 3] },
			},
		);

		expect(result.current).toEqual([]);

		rerender({ values: [4, 5, 6] });
		expect(result.current).toEqual([1, 2, 3]);

		rerender({ values: [7, 8, 9] });
		expect(result.current).toEqual([4, 5, 6]);
	});

	it('객체 초기값 - 첫 번째 렌더링에서는 빈 객체를 반환한다', () => {
		const { result } = renderHook(() =>
			usePrevious({ name: 'John', age: 25 }, { initialValue: {} as any }),
		);

		expect(result.current).toEqual({});
	});

	it('객체 초기값 - 객체가 변경되면 이전 객체를 반환한다', () => {
		const { result, rerender } = renderHook(
			({ value }) => usePrevious(value, { initialValue: {} as any }),
			{
				initialProps: { value: { name: 'John', age: 25 } },
			},
		);

		expect(result.current).toEqual({});

		rerender({ value: { name: 'Jane', age: 30 } });
		expect(result.current).toEqual({ name: 'John', age: 25 });

		rerender({ value: { name: 'Bob', age: 35 } });
		expect(result.current).toEqual({ name: 'Jane', age: 30 });
	});

	it('커스텀 초기값 - 사용자가 지정한 초기값을 사용한다', () => {
		const { result } = renderHook(() =>
			usePrevious([1, 2, 3], {
				initialValue: ['custom'],
			}),
		);

		expect(result.current).toEqual(['custom']);
	});

	it('객체 값도 정상적으로 추적한다', () => {
		const obj1 = { name: 'John', age: 25 };
		const obj2 = { name: 'Jane', age: 30 };

		const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
			initialProps: { value: obj1 },
		});

		expect(result.current).toBeUndefined();

		rerender({ value: obj2 });
		expect(result.current).toBe(obj1);
	});

	it('배열 값도 정상적으로 추적한다', () => {
		const arr1 = [1, 2, 3];
		const arr2 = [4, 5, 6];

		const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
			initialProps: { value: arr1 },
		});

		expect(result.current).toBeUndefined();

		rerender({ value: arr2 });
		expect(result.current).toBe(arr1);
	});

	it('null과 undefined 값도 정상적으로 추적한다', () => {
		const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
			initialProps: { value: null as any },
		});

		expect(result.current).toBeUndefined();

		rerender({ value: undefined as any });
		expect(result.current).toBe(null);

		rerender({ value: 'string' });
		expect(result.current).toBeUndefined();
	});

	it('복잡한 객체도 정상적으로 추적한다', () => {
		const initialObj = { name: 'Initial', data: [] };
		const obj1 = { name: 'John', data: [1, 2] };
		const obj2 = { name: 'Jane', data: [3, 4] };

		const { result, rerender } = renderHook(
			({ value, initial }) => usePrevious(value, { initialValue: initial }),
			{
				initialProps: { value: obj1, initial: initialObj },
			},
		);

		expect(result.current).toBe(initialObj);

		rerender({ value: obj2, initial: initialObj });
		expect(result.current).toBe(obj1);
	});

	it('null과 undefined 초기값도 정상적으로 처리한다', () => {
		const { result, rerender } = renderHook(
			({ value, initial }) => usePrevious(value, { initialValue: initial }),
			{
				initialProps: { value: 'first', initial: null as any },
			},
		);

		expect(result.current).toBe(null);

		rerender({ value: 'second', initial: null as any });
		expect(result.current).toBe('first');
	});

	it('빈 배열도 정상적으로 추적한다', () => {
		const { result, rerender } = renderHook(
			({ values }) => usePrevious(values, { initialValue: [] }),
			{
				initialProps: { values: [1, 2, 3] },
			},
		);

		expect(result.current).toEqual([]);

		rerender({ values: [] });
		expect(result.current).toEqual([1, 2, 3]);

		rerender({ values: [4, 5] });
		expect(result.current).toEqual([]);
	});

	it('중첩 배열도 정상적으로 추적한다', () => {
		const nested1 = [
			[1, 2],
			[3, 4],
		];
		const nested2 = [
			[5, 6],
			[7, 8],
		];

		const { result, rerender } = renderHook(
			({ values }) => usePrevious(values, { initialValue: [] }),
			{
				initialProps: { values: nested1 },
			},
		);

		expect(result.current).toEqual([]);

		rerender({ values: nested2 });
		expect(result.current).toEqual(nested1);
	});

	it('빈 객체도 정상적으로 추적한다', () => {
		const { result, rerender } = renderHook(
			({ value }) => usePrevious(value, { initialValue: {} as any }),
			{
				initialProps: { value: { name: 'John' } },
			},
		);

		expect(result.current).toEqual({});

		rerender({ value: {} as any });
		expect(result.current).toEqual({ name: 'John' });

		rerender({ value: { age: 25 } as any });
		expect(result.current).toEqual({});
	});

	it('중첩 객체도 정상적으로 추적한다', () => {
		const nested1 = { user: { name: 'John', address: { city: 'Seoul' } } };
		const nested2 = { user: { name: 'Jane', address: { city: 'Busan' } } };

		const { result, rerender } = renderHook(
			({ value }) => usePrevious(value, { initialValue: {} as any }),
			{
				initialProps: { value: nested1 },
			},
		);

		expect(result.current).toEqual({});

		rerender({ value: nested2 });
		expect(result.current).toEqual(nested1);
	});

	it('null과 undefined 속성도 정상적으로 처리한다', () => {
		const { result, rerender } = renderHook(
			({ value }) => usePrevious(value, { initialValue: {} as any }),
			{
				initialProps: { value: { name: 'John', age: null } },
			},
		);

		expect(result.current).toEqual({});

		rerender({ value: { name: 'Jane', age: undefined } as any });
		expect(result.current).toEqual({ name: 'John', age: null });
	});

	it('함수 값도 정상적으로 추적한다', () => {
		const fn1 = () => 'function1';
		const fn2 = () => 'function2';

		const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
			initialProps: { value: fn1 },
		});

		expect(result.current).toBeUndefined();

		rerender({ value: fn2 });
		expect(result.current).toBe(fn1);
	});

	it('동일한 값이 반복되어도 정상 작동한다', () => {
		const { result, rerender } = renderHook(
			({ value, initial }) => usePrevious(value, { initialValue: initial }),
			{
				initialProps: { value: 'same', initial: 'initial' },
			},
		);

		expect(result.current).toBe('initial');

		rerender({ value: 'same', initial: 'initial' });
		expect(result.current).toBe('same');

		rerender({ value: 'same', initial: 'initial' });
		expect(result.current).toBe('same');
	});

	it('동일한 배열 참조가 반복되어도 정상 작동한다', () => {
		const sameArray = [1, 2, 3];
		const { result, rerender } = renderHook(
			({ values }) => usePrevious(values, { initialValue: [] }),
			{
				initialProps: { values: sameArray },
			},
		);

		expect(result.current).toEqual([]);

		rerender({ values: sameArray });
		expect(result.current).toEqual(sameArray);

		rerender({ values: sameArray });
		expect(result.current).toEqual(sameArray);
	});

	it('동일한 객체 참조가 반복되어도 정상 작동한다', () => {
		const sameObject = { name: 'John', age: 25 };
		const { result, rerender } = renderHook(
			({ value }) => usePrevious(value, { initialValue: {} as any }),
			{
				initialProps: { value: sameObject },
			},
		);

		expect(result.current).toEqual({});

		rerender({ value: sameObject });
		expect(result.current).toEqual(sameObject);

		rerender({ value: sameObject });
		expect(result.current).toEqual(sameObject);
	});

	it('클라이언트에서 하이드레이션 후 이전 값 추적을 시작한다', () => {
		const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
			initialProps: { value: 'first' },
		});

		// 클라이언트에서는 첫 번째 렌더링에서 undefined를 반환
		expect(result.current).toBeUndefined();

		// 값이 변경되면 이전 값을 반환
		rerender({ value: 'second' });
		expect(result.current).toBe('first');
	});

	it('컴포넌트 리렌더링 시에도 올바르게 동작한다', () => {
		const { result, rerender } = renderHook(
			({ value }) => usePrevious(value, { initialValue: 'initial' }),
			{
				initialProps: { value: 'first' },
			},
		);

		// 초기 렌더링
		expect(result.current).toBe('initial');

		// 값 변경
		rerender({ value: 'second' });
		expect(result.current).toBe('first');

		// 리렌더링 (같은 값) - 이전 값이 유지되어야 함
		rerender({ value: 'second' });
		expect(result.current).toBe('second');

		// 값 변경
		rerender({ value: 'third' });
		expect(result.current).toBe('second');
	});

	it('복잡한 객체의 동작을 검증한다', () => {
		const initialObj = { name: 'Initial', data: [] };
		const { result, rerender } = renderHook(
			({ value }) => usePrevious(value, { initialValue: initialObj }),
			{
				initialProps: { value: { name: 'John', data: [1, 2] } },
			},
		);

		// 초기값을 반환
		expect(result.current).toBe(initialObj);

		// 컴포넌트 리렌더링
		rerender({ value: { name: 'Jane', data: [3, 4] } });

		// 이전 값을 반환
		expect(result.current).toEqual({ name: 'John', data: [1, 2] });
	});

	it('SSR 호환성을 위한 안전한 초기 상태를 제공한다', () => {
		const { result } = renderHook(() => usePrevious('current', { initialValue: 'safe' }));

		// SSR 환경에서도 안전한 초기값을 반환
		expect(result.current).toBe('safe');
	});

	it('초기값이 없는 경우 SSR에서도 안전하게 동작한다', () => {
		const { result } = renderHook(() => usePrevious('current'));

		// SSR 환경에서도 안전하게 undefined를 반환
		expect(result.current).toBeUndefined();
	});
});

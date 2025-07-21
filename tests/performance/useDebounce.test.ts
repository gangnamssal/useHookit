import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useDebounce } from '../../src/performance/useDebounce';

describe('useDebounce', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	it('초기값을 즉시 반환한다', () => {
		const { result } = renderHook(() => useDebounce('init', 1000));
		expect(result.current).toBe('init');
	});

	it('값이 바뀌면 delay 후에만 변경된다', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'a', delay: 1000 },
		});
		rerender({ value: 'b', delay: 1000 });
		act(() => {
			vi.advanceTimersByTime(999);
		});
		expect(result.current).toBe('a');
		act(() => {
			vi.advanceTimersByTime(1);
		});
		expect(result.current).toBe('b');
	});

	it('delay가 0이거나 음수면 즉시 변경된다', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'a', delay: 0 },
		});
		rerender({ value: 'b', delay: 0 });
		act(() => {
			vi.runAllTimers();
		});
		expect(result.current).toBe('b');
		rerender({ value: 'c', delay: -100 });
		act(() => {
			vi.runAllTimers();
		});
		expect(result.current).toBe('c');
	});

	it('숫자, 불린, 객체 등 다양한 타입을 지원한다', () => {
		// 숫자
		const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 1, delay: 100 },
		});
		rerender({ value: 2, delay: 100 });
		act(() => {
			vi.advanceTimersByTime(100);
		});
		expect(result.current).toBe(2);

		// 불린
		const { result: r2, rerender: rer2 } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{ initialProps: { value: false, delay: 100 } },
		);
		rer2({ value: true, delay: 100 });
		act(() => {
			vi.advanceTimersByTime(100);
		});
		expect(r2.current).toBe(true);

		// 객체
		const obj = { a: 1 };
		const { result: r3, rerender: rer3 } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{ initialProps: { value: { a: 0 }, delay: 100 } },
		);
		rer3({ value: obj, delay: 100 });
		act(() => {
			vi.advanceTimersByTime(100);
		});
		expect(r3.current).toBe(obj);
	});

	it('언마운트 시 타이머가 정리되어야 한다', () => {
		const { rerender, unmount } = renderHook(({ value, delay }) => useDebounce(value, delay), {
			initialProps: { value: 'a', delay: 1000 },
		});
		rerender({ value: 'b', delay: 1000 });
		unmount();
		act(() => {
			vi.advanceTimersByTime(1000);
		});
		// 에러 없이 통과하면 성공
	});
});

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useDebounce, useDebounceCallback } from '../../src/performance/useDebounce';

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

	it('음수 delay에 대해 경고를 출력해야 한다', () => {
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		renderHook(() => useDebounce('test', -100));
		expect(consoleSpy).toHaveBeenCalledWith('useDebounce: delay must be non-negative');
		consoleSpy.mockRestore();
	});
});

describe('useDebounceCallback', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});
	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	it('콜백을 디바운스해야 한다', () => {
		const mockCallback = vi.fn();
		const { result } = renderHook(() => useDebounceCallback(mockCallback, 1000));

		act(() => {
			result.current();
			result.current();
			result.current();
		});

		expect(mockCallback).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(mockCallback).toHaveBeenCalledTimes(1);
	});

	it('마지막 호출만 실행되어야 한다', () => {
		const mockCallback = vi.fn();
		const { result } = renderHook(() => useDebounceCallback(mockCallback, 1000));

		act(() => {
			result.current('first');
			result.current('second');
			result.current('third');
		});

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(mockCallback).toHaveBeenCalledTimes(1);
		expect(mockCallback).toHaveBeenCalledWith('third');
	});

	it('delay가 0이거나 음수면 즉시 실행되어야 한다', () => {
		const mockCallback = vi.fn();
		const { result } = renderHook(() => useDebounceCallback(mockCallback, 0));

		act(() => {
			result.current('test');
		});

		expect(mockCallback).toHaveBeenCalledWith('test');
	});

	it('음수 delay에 대해 경고를 출력해야 한다', () => {
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const mockCallback = vi.fn();
		renderHook(() => useDebounceCallback(mockCallback, -100));
		expect(consoleSpy).toHaveBeenCalledWith('useDebounce: delay must be non-negative');
		consoleSpy.mockRestore();
	});

	it('언마운트 시 타이머가 정리되어야 한다', () => {
		const mockCallback = vi.fn();
		const { result, unmount } = renderHook(() => useDebounceCallback(mockCallback, 1000));

		act(() => {
			result.current();
		});

		unmount();

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(mockCallback).not.toHaveBeenCalled();
	});

	it('여러 인자를 받는 콜백을 지원해야 한다', () => {
		const mockCallback = vi.fn();
		const { result } = renderHook(() => useDebounceCallback(mockCallback, 1000));

		act(() => {
			result.current('arg1', 'arg2', { key: 'value' });
		});

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(mockCallback).toHaveBeenCalledWith('arg1', 'arg2', { key: 'value' });
	});

	it('콜백이 변경되어도 올바르게 동작해야 한다', () => {
		const mockCallback1 = vi.fn();
		const mockCallback2 = vi.fn();
		const { result, rerender } = renderHook(
			({ callback, delay }) => useDebounceCallback(callback, delay),
			{ initialProps: { callback: mockCallback1, delay: 1000 } },
		);

		act(() => {
			result.current();
		});

		rerender({ callback: mockCallback2, delay: 1000 });

		act(() => {
			result.current();
		});

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(mockCallback1).not.toHaveBeenCalled();
		expect(mockCallback2).toHaveBeenCalledTimes(1);
	});
});

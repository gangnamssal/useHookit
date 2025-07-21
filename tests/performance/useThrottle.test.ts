import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useThrottle, useThrottleValue } from '../../src/performance/useThrottle';

describe('useThrottle', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
	});

	it('첫 번째 호출은 즉시 실행된다', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useThrottle(callback, 1000));

		act(() => {
			result.current('test');
		});

		expect(callback).toHaveBeenCalledWith('test');
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('delay 시간 내의 연속 호출은 throttle된다', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useThrottle(callback, 1000));

		// 첫 번째 호출
		act(() => {
			result.current('first');
		});

		// delay 시간 내에 연속 호출
		act(() => {
			result.current('second');
			result.current('third');
			result.current('fourth');
		});

		expect(callback).toHaveBeenCalledWith('first');
		expect(callback).toHaveBeenCalledTimes(1);

		// delay 시간 후에 마지막 호출이 실행됨
		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(callback).toHaveBeenCalledWith('fourth');
		expect(callback).toHaveBeenCalledTimes(2);
	});

	it('delay 시간 후의 호출은 즉시 실행된다', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useThrottle(callback, 1000));

		// 첫 번째 호출
		act(() => {
			result.current('first');
		});

		// delay 시간 후 호출
		act(() => {
			vi.advanceTimersByTime(1000);
			result.current('second');
		});

		expect(callback).toHaveBeenCalledWith('first');
		expect(callback).toHaveBeenCalledWith('second');
		expect(callback).toHaveBeenCalledTimes(2);
	});

	it('여러 인자를 전달할 수 있다', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useThrottle(callback, 1000));

		act(() => {
			result.current('arg1', 'arg2', { key: 'value' });
		});

		expect(callback).toHaveBeenCalledWith('arg1', 'arg2', { key: 'value' });
	});

	it('callback이 변경되면 새로운 throttle 함수가 생성된다', () => {
		const callback1 = vi.fn();
		const callback2 = vi.fn();

		const { result, rerender } = renderHook(({ callback }) => useThrottle(callback, 1000), {
			initialProps: { callback: callback1 },
		});

		act(() => {
			result.current('test1');
		});

		expect(callback1).toHaveBeenCalledWith('test1');

		rerender({ callback: callback2 });

		// throttle 시간이 지난 후 새로운 callback으로 호출
		act(() => {
			vi.advanceTimersByTime(1000);
			result.current('test2');
		});

		expect(callback2).toHaveBeenCalledWith('test2');
	});

	it('delay가 변경되면 새로운 throttle 함수가 생성된다', () => {
		const callback = vi.fn();

		const { result, rerender } = renderHook(({ delay }) => useThrottle(callback, delay), {
			initialProps: { delay: 1000 },
		});

		act(() => {
			result.current('test1');
		});

		expect(callback).toHaveBeenCalledWith('test1');

		rerender({ delay: 500 });

		// throttle 시간이 지난 후 새로운 delay로 호출
		act(() => {
			vi.advanceTimersByTime(1000);
			result.current('test2');
		});

		expect(callback).toHaveBeenCalledWith('test2');
	});

	it('0ms delay에서는 즉시 실행된다', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useThrottle(callback, 0));

		act(() => {
			result.current('test1');
			result.current('test2');
			result.current('test3');
		});

		expect(callback).toHaveBeenCalledWith('test1');
		expect(callback).toHaveBeenCalledWith('test2');
		expect(callback).toHaveBeenCalledWith('test3');
		expect(callback).toHaveBeenCalledTimes(3);
	});

	it('음수 delay에서는 즉시 실행된다', () => {
		const callback = vi.fn();
		const { result } = renderHook(() => useThrottle(callback, -1000));

		act(() => {
			result.current('test1');
			result.current('test2');
		});

		expect(callback).toHaveBeenCalledWith('test1');
		expect(callback).toHaveBeenCalledWith('test2');
		expect(callback).toHaveBeenCalledTimes(2);
	});
});

describe('useThrottleValue', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
	});

	it('첫 번째 값은 즉시 반환된다', () => {
		const { result } = renderHook(() => useThrottleValue('initial', 1000));

		expect(result.current).toBe('initial');
	});

	it('delay 시간 내의 값 변경은 throttle된다', () => {
		const { result, rerender } = renderHook(({ value }) => useThrottleValue(value, 1000), {
			initialProps: { value: 'initial' },
		});

		expect(result.current).toBe('initial');

		// delay 시간 내에 값 변경
		rerender({ value: 'second' });
		expect(result.current).toBe('initial'); // 아직 변경되지 않음

		rerender({ value: 'third' });
		expect(result.current).toBe('initial'); // 아직 변경되지 않음

		// delay 시간 후에 마지막 값으로 업데이트됨
		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(result.current).toBe('third');
	});

	it('delay 시간 후의 값 변경은 즉시 반영된다', () => {
		const { result, rerender } = renderHook(({ value }) => useThrottleValue(value, 1000), {
			initialProps: { value: 'initial' },
		});

		expect(result.current).toBe('initial');

		// delay 시간 후 값 변경
		act(() => {
			vi.advanceTimersByTime(1000);
		});

		rerender({ value: 'second' });
		expect(result.current).toBe('second');
	});

	it('복잡한 객체도 정상적으로 throttle된다', () => {
		const initialValue = { name: 'initial', count: 0 };
		const { result, rerender } = renderHook(({ value }) => useThrottleValue(value, 1000), {
			initialProps: { value: initialValue },
		});

		expect(result.current).toEqual(initialValue);

		const newValue = { name: 'updated', count: 1 };
		rerender({ value: newValue });
		expect(result.current).toEqual(initialValue); // 아직 변경되지 않음

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(result.current).toEqual(newValue);
	});

	it('배열 값도 정상적으로 throttle된다', () => {
		const { result, rerender } = renderHook(({ value }) => useThrottleValue(value, 1000), {
			initialProps: { value: [1, 2, 3] },
		});

		expect(result.current).toEqual([1, 2, 3]);

		rerender({ value: [4, 5, 6] });
		expect(result.current).toEqual([1, 2, 3]); // 아직 변경되지 않음

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(result.current).toEqual([4, 5, 6]);
	});

	it('0ms delay에서는 즉시 업데이트된다', () => {
		const { result, rerender } = renderHook(({ value }) => useThrottleValue(value, 0), {
			initialProps: { value: 'initial' },
		});

		expect(result.current).toBe('initial');

		rerender({ value: 'second' });
		expect(result.current).toBe('second');

		rerender({ value: 'third' });
		expect(result.current).toBe('third');
	});

	it('음수 delay에서는 즉시 업데이트된다', () => {
		const { result, rerender } = renderHook(({ value }) => useThrottleValue(value, -1000), {
			initialProps: { value: 'initial' },
		});

		expect(result.current).toBe('initial');

		rerender({ value: 'second' });
		expect(result.current).toBe('second');
	});

	it('delay가 변경되면 새로운 throttle이 적용된다', () => {
		const { result, rerender } = renderHook(({ value, delay }) => useThrottleValue(value, delay), {
			initialProps: { value: 'initial', delay: 1000 },
		});

		expect(result.current).toBe('initial');

		rerender({ value: 'second', delay: 500 });
		expect(result.current).toBe('initial'); // 아직 변경되지 않음

		act(() => {
			vi.advanceTimersByTime(500);
		});

		expect(result.current).toBe('second');
	});

	it('컴포넌트 언마운트 시 타이머가 정리된다', () => {
		const { result, rerender, unmount } = renderHook(({ value }) => useThrottleValue(value, 1000), {
			initialProps: { value: 'initial' },
		});

		rerender({ value: 'second' });
		expect(result.current).toBe('initial');

		// 언마운트 시 타이머 정리
		unmount();

		// 타이머가 정리되었으므로 콜백이 실행되지 않음
		act(() => {
			vi.advanceTimersByTime(1000);
		});

		// 언마운트 후에는 상태가 변경되지 않음
		expect(result.current).toBe('initial');
	});
});

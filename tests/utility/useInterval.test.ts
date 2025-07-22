import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
	useInterval,
	useTimeout,
	useControlledInterval,
	useControlledTimeout,
} from '../../src/utility/useInterval';

describe('useInterval', () => {
	let mockCallback: ReturnType<typeof vi.fn>;
	let setIntervalSpy: ReturnType<typeof vi.fn>;
	let clearIntervalSpy: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockCallback = vi.fn();
		setIntervalSpy = vi.fn();
		clearIntervalSpy = vi.fn();

		vi.useFakeTimers();
		vi.spyOn(window, 'setInterval').mockImplementation(setIntervalSpy);
		vi.spyOn(window, 'clearInterval').mockImplementation(clearIntervalSpy);
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.useRealTimers();
	});

	it('delay가 유효할 때 setInterval을 호출한다', () => {
		renderHook(() => useInterval(mockCallback, 1000));

		expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
	});

	it('delay가 null일 때 setInterval을 호출하지 않는다', () => {
		renderHook(() => useInterval(mockCallback, null));

		expect(setIntervalSpy).not.toHaveBeenCalled();
	});

	it('delay가 변경될 때 이전 타이머를 정리하고 새 타이머를 설정한다', () => {
		const { rerender } = renderHook(({ delay }) => useInterval(mockCallback, delay), {
			initialProps: { delay: 1000 },
		});

		expect(setIntervalSpy).toHaveBeenCalledTimes(1);
		expect(clearIntervalSpy).not.toHaveBeenCalled();

		rerender({ delay: 2000 });

		expect(setIntervalSpy).toHaveBeenCalledTimes(2);
		expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
	});

	it('callback이 변경될 때 최신 콜백이 호출된다', () => {
		const { rerender } = renderHook(({ callback }) => useInterval(callback, 1000), {
			initialProps: { callback: mockCallback },
		});

		const newCallback = vi.fn();
		rerender({ callback: newCallback });

		const intervalHandler = setIntervalSpy.mock.calls[0][0];
		act(() => {
			intervalHandler();
		});

		expect(newCallback).toHaveBeenCalled();
		expect(mockCallback).not.toHaveBeenCalled();
	});

	it('언마운트 시 타이머를 정리한다', () => {
		const { unmount } = renderHook(() => useInterval(mockCallback, 1000));

		expect(setIntervalSpy).toHaveBeenCalled();

		unmount();

		expect(clearIntervalSpy).toHaveBeenCalled();
	});

	it('delay가 0일 때도 정상적으로 작동한다', () => {
		renderHook(() => useInterval(mockCallback, 0));

		expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 0);
	});

	it('음수 delay에 대해 경고를 출력해야 한다', () => {
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		renderHook(() => useInterval(mockCallback, -1000));
		expect(consoleSpy).toHaveBeenCalledWith('useInterval: delay must be non-negative');
		consoleSpy.mockRestore();
	});
});

describe('useTimeout', () => {
	let mockCallback: ReturnType<typeof vi.fn>;
	let setTimeoutSpy: ReturnType<typeof vi.fn>;
	let clearTimeoutSpy: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockCallback = vi.fn();
		setTimeoutSpy = vi.fn();
		clearTimeoutSpy = vi.fn();

		vi.useFakeTimers();
		vi.spyOn(window, 'setTimeout').mockImplementation(setTimeoutSpy);
		vi.spyOn(window, 'clearTimeout').mockImplementation(clearTimeoutSpy);
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.useRealTimers();
	});

	it('delay가 유효할 때 setTimeout을 호출한다', () => {
		renderHook(() => useTimeout(mockCallback, 1000));

		expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
	});

	it('delay가 null일 때 setTimeout을 호출하지 않는다', () => {
		renderHook(() => useTimeout(mockCallback, null));

		expect(setTimeoutSpy).not.toHaveBeenCalled();
	});

	it('delay가 변경될 때 이전 타이머를 정리하고 새 타이머를 설정한다', () => {
		const { rerender } = renderHook(({ delay }) => useTimeout(mockCallback, delay), {
			initialProps: { delay: 1000 },
		});

		expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
		expect(clearTimeoutSpy).not.toHaveBeenCalled();

		rerender({ delay: 2000 });

		expect(setTimeoutSpy).toHaveBeenCalledTimes(2);
		expect(clearTimeoutSpy).toHaveBeenCalledTimes(1);
	});

	it('callback이 변경될 때 최신 콜백이 호출된다', () => {
		const { rerender } = renderHook(({ callback }) => useTimeout(callback, 1000), {
			initialProps: { callback: mockCallback },
		});

		const newCallback = vi.fn();
		rerender({ callback: newCallback });

		const timeoutHandler = setTimeoutSpy.mock.calls[0][0];
		act(() => {
			timeoutHandler();
		});

		expect(newCallback).toHaveBeenCalled();
		expect(mockCallback).not.toHaveBeenCalled();
	});

	it('언마운트 시 타이머를 정리한다', () => {
		const { unmount } = renderHook(() => useTimeout(mockCallback, 1000));

		expect(setTimeoutSpy).toHaveBeenCalled();

		unmount();

		expect(clearTimeoutSpy).toHaveBeenCalled();
	});

	it('음수 delay에 대해 경고를 출력해야 한다', () => {
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		renderHook(() => useTimeout(mockCallback, -1000));
		expect(consoleSpy).toHaveBeenCalledWith('useTimeout: delay must be non-negative');
		consoleSpy.mockRestore();
	});
});

describe('useControlledInterval', () => {
	let mockCallback: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockCallback = vi.fn();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.useRealTimers();
	});

	it('초기 상태는 isRunning이 false이다', () => {
		const { result } = renderHook(() => useControlledInterval(mockCallback, 1000));

		expect(result.current.isRunning).toBe(false);
	});

	it('start를 호출하면 타이머가 시작되고 isRunning이 true가 된다', () => {
		const { result } = renderHook(() => useControlledInterval(mockCallback, 1000));

		act(() => {
			result.current.start();
		});

		expect(result.current.isRunning).toBe(true);
	});

	it('stop을 호출하면 타이머가 정지되고 isRunning이 false가 된다', () => {
		const { result } = renderHook(() => useControlledInterval(mockCallback, 1000));

		act(() => {
			result.current.start();
		});

		expect(result.current.isRunning).toBe(true);

		act(() => {
			result.current.stop();
		});

		expect(result.current.isRunning).toBe(false);
	});

	it('이미 실행 중일 때 start를 호출해도 추가 타이머를 생성하지 않는다', () => {
		const { result } = renderHook(() => useControlledInterval(mockCallback, 1000));

		act(() => {
			result.current.start();
		});

		const initialIsRunning = result.current.isRunning;

		act(() => {
			result.current.start();
		});

		expect(result.current.isRunning).toBe(initialIsRunning);
	});

	it('delay가 null일 때 start를 호출해도 타이머가 시작되지 않는다', () => {
		const { result } = renderHook(() => useControlledInterval(mockCallback, null));

		act(() => {
			result.current.start();
		});

		expect(result.current.isRunning).toBe(false);
	});

	it('callback이 변경될 때 최신 콜백이 호출된다', () => {
		const { result, rerender } = renderHook(
			({ callback }) => useControlledInterval(callback, 1000),
			{ initialProps: { callback: mockCallback } },
		);

		act(() => {
			result.current.start();
		});

		const newCallback = vi.fn();
		rerender({ callback: newCallback });

		// 타이머가 실행되도록 시간을 진행
		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(newCallback).toHaveBeenCalled();
		expect(mockCallback).not.toHaveBeenCalled();
	});

	it('언마운트 시 타이머를 정리한다', () => {
		const { result, unmount } = renderHook(() => useControlledInterval(mockCallback, 1000));

		act(() => {
			result.current.start();
		});

		expect(result.current.isRunning).toBe(true);

		unmount();

		// 언마운트 후에도 메모리 누수가 없는지 확인
		expect(() => {
			result.current.stop();
		}).not.toThrow();
	});
});

describe('useControlledTimeout', () => {
	let mockCallback: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockCallback = vi.fn();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.clearAllMocks();
		vi.useRealTimers();
	});

	it('초기 상태는 isRunning이 false이다', () => {
		const { result } = renderHook(() => useControlledTimeout(mockCallback, 1000));

		expect(result.current.isRunning).toBe(false);
	});

	it('start를 호출하면 타이머가 시작되고 isRunning이 true가 된다', () => {
		const { result } = renderHook(() => useControlledTimeout(mockCallback, 1000));

		act(() => {
			result.current.start();
		});

		expect(result.current.isRunning).toBe(true);
	});

	it('타이머 완료 시 isRunning이 false가 된다', () => {
		const { result } = renderHook(() => useControlledTimeout(mockCallback, 1000));

		act(() => {
			result.current.start();
		});

		expect(result.current.isRunning).toBe(true);

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(result.current.isRunning).toBe(false);
		expect(mockCallback).toHaveBeenCalled();
	});

	it('stop을 호출하면 타이머가 정지되고 isRunning이 false가 된다', () => {
		const { result } = renderHook(() => useControlledTimeout(mockCallback, 1000));

		act(() => {
			result.current.start();
		});

		expect(result.current.isRunning).toBe(true);

		act(() => {
			result.current.stop();
		});

		expect(result.current.isRunning).toBe(false);
	});

	it('이미 실행 중일 때 start를 호출해도 추가 타이머를 생성하지 않는다', () => {
		const { result } = renderHook(() => useControlledTimeout(mockCallback, 1000));

		act(() => {
			result.current.start();
		});

		const initialIsRunning = result.current.isRunning;

		act(() => {
			result.current.start();
		});

		expect(result.current.isRunning).toBe(initialIsRunning);
	});

	it('delay가 null일 때 start를 호출해도 타이머가 시작되지 않는다', () => {
		const { result } = renderHook(() => useControlledTimeout(mockCallback, null));

		act(() => {
			result.current.start();
		});

		expect(result.current.isRunning).toBe(false);
	});

	it('callback이 변경될 때 최신 콜백이 호출된다', () => {
		const { result, rerender } = renderHook(
			({ callback }) => useControlledTimeout(callback, 1000),
			{ initialProps: { callback: mockCallback } },
		);

		act(() => {
			result.current.start();
		});

		const newCallback = vi.fn();
		rerender({ callback: newCallback });

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(newCallback).toHaveBeenCalled();
		expect(mockCallback).not.toHaveBeenCalled();
	});

	it('언마운트 시 타이머를 정리한다', () => {
		const { result, unmount } = renderHook(() => useControlledTimeout(mockCallback, 1000));

		act(() => {
			result.current.start();
		});

		expect(result.current.isRunning).toBe(true);

		unmount();

		// 언마운트 후에도 메모리 누수가 없는지 확인
		expect(() => {
			result.current.stop();
		}).not.toThrow();
	});
});

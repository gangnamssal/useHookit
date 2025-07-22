import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLoading } from '../../src/utility/useLoading';

describe('useLoading', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	it('기본 옵션으로 훅을 초기화해야 함', () => {
		const { result } = renderHook(() => useLoading());

		expect(result.current.isLoading).toBe(false);
		expect(typeof result.current.startLoading).toBe('function');
		expect(typeof result.current.stopLoading).toBe('function');
		expect(typeof result.current.toggleLoading).toBe('function');
		expect(typeof result.current.withLoading).toBe('function');
		expect(typeof result.current.wrapAsync).toBe('function');
		expect(result.current.state.isLoading).toBe(false);
		expect(result.current.state.startTime).toBeNull();
		expect(result.current.state.duration).toBe(0);
		expect(result.current.state.endTime).toBeNull();
	});

	it('초기 로딩 상태로 훅을 초기화해야 함', () => {
		const { result } = renderHook(() => useLoading({ initialLoading: true }));

		expect(result.current.isLoading).toBe(true);
		expect(result.current.state.isLoading).toBe(true);
		expect(result.current.state.startTime).toBeInstanceOf(Date);
	});

	it('startLoading이 로딩 상태를 true로 변경해야 함', () => {
		const { result } = renderHook(() => useLoading());

		act(() => {
			result.current.startLoading();
		});

		expect(result.current.isLoading).toBe(true);
		expect(result.current.state.isLoading).toBe(true);
		expect(result.current.state.startTime).toBeInstanceOf(Date);
	});

	it('stopLoading이 로딩 상태를 false로 변경해야 함', () => {
		const { result } = renderHook(() => useLoading({ initialLoading: true }));

		act(() => {
			result.current.stopLoading();
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.state.isLoading).toBe(false);
		expect(result.current.state.endTime).toBeInstanceOf(Date);
	});

	it('toggleLoading이 로딩 상태를 토글해야 함', () => {
		const { result } = renderHook(() => useLoading());

		act(() => {
			result.current.toggleLoading();
		});

		expect(result.current.isLoading).toBe(true);

		act(() => {
			result.current.toggleLoading();
		});

		expect(result.current.isLoading).toBe(false);
	});

	it('withLoading이 Promise를 로딩 상태와 함께 실행해야 함', async () => {
		const { result } = renderHook(() => useLoading());
		const mockPromise = Promise.resolve('test result');

		// Promise 실행
		let promise: Promise<string>;
		act(() => {
			promise = result.current.withLoading(mockPromise);
		});

		// 로딩이 시작되어야 함
		expect(result.current.isLoading).toBe(true);

		// Promise가 완료되면 로딩이 중지되어야 함
		await act(async () => {
			await promise!;
		});

		expect(result.current.isLoading).toBe(false);
	});

	it('withLoading이 에러가 발생한 Promise도 처리해야 함', async () => {
		const { result } = renderHook(() => useLoading());
		const mockPromise = Promise.reject(new Error('test error'));

		// Promise 실행
		let promise: Promise<never>;
		act(() => {
			promise = result.current.withLoading(mockPromise);
		});

		// 로딩이 시작되어야 함
		expect(result.current.isLoading).toBe(true);

		// Promise가 완료되면 로딩이 중지되어야 함
		await act(async () => {
			try {
				await promise!;
			} catch (error) {
				// 에러는 예상된 동작
			}
		});

		expect(result.current.isLoading).toBe(false);
	});

	it('wrapAsync가 비동기 함수를 로딩 상태와 함께 실행해야 함', async () => {
		const { result } = renderHook(() => useLoading());
		const mockAsyncFn = vi.fn().mockResolvedValue('test result');

		// 함수 실행
		let promise: Promise<string>;
		act(() => {
			promise = result.current.wrapAsync(mockAsyncFn);
		});

		// 로딩이 시작되어야 함
		expect(result.current.isLoading).toBe(true);

		// 함수가 호출되어야 함
		expect(mockAsyncFn).toHaveBeenCalled();

		// Promise가 완료되면 로딩이 중지되어야 함
		await act(async () => {
			await promise!;
		});

		expect(result.current.isLoading).toBe(false);
	});

	it('지연 시간이 설정된 경우 로딩 상태 변경이 지연되어야 함', () => {
		const { result } = renderHook(() => useLoading({ delay: 1000 }));

		act(() => {
			result.current.startLoading();
		});

		// 지연 시간 전에는 로딩 상태가 변경되지 않아야 함
		expect(result.current.isLoading).toBe(false);

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		// 지연 시간 후에 로딩 상태가 변경되어야 함
		expect(result.current.isLoading).toBe(true);
	});

	it('최소 로딩 시간이 설정된 경우 최소 시간만큼 로딩이 유지되어야 함', () => {
		const { result } = renderHook(() => useLoading({ minLoadingTime: 1000 }));

		act(() => {
			result.current.startLoading();
		});

		expect(result.current.isLoading).toBe(true);

		// 500ms 후에 stopLoading 호출
		act(() => {
			vi.advanceTimersByTime(500);
			result.current.stopLoading();
		});

		// 최소 시간이 지나기 전까지는 로딩 상태가 유지되어야 함
		expect(result.current.isLoading).toBe(true);

		// 최소 시간이 지나면 로딩 상태가 중지되어야 함
		act(() => {
			vi.advanceTimersByTime(500);
		});

		expect(result.current.isLoading).toBe(false);
	});

	it('로딩 상태 변경 시 콜백이 호출되어야 함', () => {
		const onLoadingChange = vi.fn();
		const { result } = renderHook(() => useLoading({ onLoadingChange }));

		act(() => {
			result.current.startLoading();
		});

		expect(onLoadingChange).toHaveBeenCalledWith(true);

		act(() => {
			result.current.stopLoading();
		});

		expect(onLoadingChange).toHaveBeenCalledWith(false);
	});

	it('이미 로딩 중일 때 startLoading을 호출해도 상태가 변경되지 않아야 함', () => {
		const { result } = renderHook(() => useLoading({ initialLoading: true }));

		act(() => {
			result.current.startLoading();
		});

		expect(result.current.isLoading).toBe(true);
	});

	it('로딩 중이 아닐 때 stopLoading을 호출해도 상태가 변경되지 않아야 함', () => {
		const { result } = renderHook(() => useLoading());

		act(() => {
			result.current.stopLoading();
		});

		expect(result.current.isLoading).toBe(false);
	});

	it('지연 타이머가 있는 상태에서 stopLoading을 호출하면 타이머가 정리되어야 함', () => {
		const { result } = renderHook(() => useLoading({ delay: 1000 }));

		act(() => {
			result.current.startLoading();
		});

		expect(result.current.isLoading).toBe(false);

		act(() => {
			result.current.stopLoading();
		});

		// 지연 시간이 지나도 로딩 상태가 변경되지 않아야 함
		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(result.current.isLoading).toBe(false);
	});

	it('로딩 지속 시간이 올바르게 계산되어야 함', () => {
		const { result } = renderHook(() => useLoading());

		act(() => {
			result.current.startLoading();
		});

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		act(() => {
			result.current.stopLoading();
		});

		expect(result.current.state.duration).toBe(1000);
		expect(result.current.state.endTime).toBeInstanceOf(Date);
	});

	it('여러 번의 startLoading과 stopLoading이 올바르게 동작해야 함', () => {
		const { result } = renderHook(() => useLoading());

		// 첫 번째 로딩
		act(() => {
			result.current.startLoading();
		});

		expect(result.current.isLoading).toBe(true);

		act(() => {
			result.current.stopLoading();
		});

		expect(result.current.isLoading).toBe(false);

		// 두 번째 로딩
		act(() => {
			result.current.startLoading();
		});

		expect(result.current.isLoading).toBe(true);

		act(() => {
			result.current.stopLoading();
		});

		expect(result.current.isLoading).toBe(false);
	});

	it('withLoading이 Promise의 결과를 반환해야 함', async () => {
		const { result } = renderHook(() => useLoading());
		const testData = { id: 1, name: 'test' };
		const mockPromise = Promise.resolve(testData);

		let resultData: typeof testData;
		await act(async () => {
			resultData = await result.current.withLoading(mockPromise);
		});

		expect(resultData!).toEqual(testData);
		expect(result.current.isLoading).toBe(false);
	});

	it('wrapAsync가 비동기 함수의 결과를 반환해야 함', async () => {
		const { result } = renderHook(() => useLoading());
		const testData = { id: 1, name: 'test' };
		const mockAsyncFn = vi.fn().mockResolvedValue(testData);

		let resultData: typeof testData;
		await act(async () => {
			resultData = await result.current.wrapAsync(mockAsyncFn);
		});

		expect(resultData!).toEqual(testData);
		expect(mockAsyncFn).toHaveBeenCalled();
		expect(result.current.isLoading).toBe(false);
	});

	it('매우 짧은 지연 시간으로도 동작해야 함', () => {
		const { result } = renderHook(() => useLoading({ delay: 1 }));

		act(() => {
			result.current.startLoading();
		});

		expect(result.current.isLoading).toBe(false);

		act(() => {
			vi.advanceTimersByTime(1);
		});

		expect(result.current.isLoading).toBe(true);
	});

	it('매우 짧은 최소 로딩 시간으로도 동작해야 함', () => {
		const { result } = renderHook(() => useLoading({ minLoadingTime: 1 }));

		act(() => {
			result.current.startLoading();
		});

		expect(result.current.isLoading).toBe(true);

		act(() => {
			result.current.stopLoading();
		});

		act(() => {
			vi.advanceTimersByTime(1);
		});

		expect(result.current.isLoading).toBe(false);
	});

	it('음수 delay에 대해 경고를 출력해야 함', () => {
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		renderHook(() => useLoading({ delay: -100 }));
		expect(consoleSpy).toHaveBeenCalledWith('useLoading: delay must be non-negative');
		consoleSpy.mockRestore();
	});

	it('음수 minLoadingTime에 대해 경고를 출력해야 함', () => {
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		renderHook(() => useLoading({ minLoadingTime: -100 }));
		expect(consoleSpy).toHaveBeenCalledWith('useLoading: minLoadingTime must be non-negative');
		consoleSpy.mockRestore();
	});
});

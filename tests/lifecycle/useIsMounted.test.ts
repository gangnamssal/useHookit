import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useIsMounted, useSafeState, useSafeCallback } from '../../src/lifecycle/useIsMounted';

describe('useIsMounted', () => {
	it('마운트 후 true를 반환한다', () => {
		const { result } = renderHook(() => useIsMounted());
		expect(result.current).toBe(true);
	});
});

describe('useSafeState', () => {
	it('초기값을 올바르게 설정한다', () => {
		const { result } = renderHook(() => useSafeState('initial'));
		expect(result.current[0]).toBe('initial');
		expect(typeof result.current[1]).toBe('function');
	});

	it('마운트된 상태에서 setState가 정상적으로 작동한다', () => {
		const { result } = renderHook(() => useSafeState('initial'));
		act(() => {
			result.current[1]('updated');
		});
		expect(result.current[0]).toBe('updated');
	});

	it('함수형 업데이트가 정상적으로 작동한다', () => {
		const { result } = renderHook(() => useSafeState(0));
		act(() => {
			result.current[1]((prev) => prev + 1);
		});
		expect(result.current[0]).toBe(1);
	});

	it('언마운트 후 setState 호출 시 상태가 변경되지 않는다', () => {
		const { result, unmount } = renderHook(() => useSafeState('initial'));
		unmount();
		act(() => {
			result.current[1]('updated');
		});
		expect(result.current[0]).toBe('initial');
	});

	it('복잡한 객체 상태도 정상적으로 처리한다', () => {
		const initialValue = { name: 'test', count: 0 };
		const { result } = renderHook(() => useSafeState(initialValue));
		act(() => {
			result.current[1]({ name: 'updated', count: 1 });
		});
		expect(result.current[0]).toEqual({ name: 'updated', count: 1 });
	});

	it('함수형 업데이트로 객체 상태를 업데이트한다', () => {
		const initialValue = { name: 'test', count: 0 };
		const { result } = renderHook(() => useSafeState(initialValue));
		act(() => {
			result.current[1]((prev) => ({ ...prev, count: prev.count + 1 }));
		});
		expect(result.current[0]).toEqual({ name: 'test', count: 1 });
	});
});

describe('useSafeCallback', () => {
	it('마운트 상태에서만 콜백이 동작한다', () => {
		const spy = vi.fn();
		const { result } = renderHook(() => useSafeCallback(spy));
		act(() => result.current('a'));
		expect(spy).toHaveBeenCalledWith('a');
	});

	it('콜백이 값을 반환한다', () => {
		const mockCallback = vi.fn().mockReturnValue('returned');
		const { result } = renderHook(() => useSafeCallback(mockCallback));
		let returnValue: string | undefined;
		act(() => {
			returnValue = result.current('test');
		});
		expect(returnValue).toBe('returned');
		expect(mockCallback).toHaveBeenCalledWith('test');
	});

	it('여러 매개변수를 받는 콜백이 정상적으로 작동한다', () => {
		const mockCallback = vi.fn();
		const { result } = renderHook(() => useSafeCallback(mockCallback));
		act(() => {
			result.current('param1', 'param2', 123);
		});
		expect(mockCallback).toHaveBeenCalledWith('param1', 'param2', 123);
	});

	it('콜백이 변경될 때 새로운 콜백이 사용된다', () => {
		const mockCallback1 = vi.fn();
		const mockCallback2 = vi.fn();
		const { result, rerender } = renderHook(({ callback }) => useSafeCallback(callback), {
			initialProps: { callback: mockCallback1 },
		});
		act(() => {
			result.current('test1');
		});
		expect(mockCallback1).toHaveBeenCalledWith('test1');
		rerender({ callback: mockCallback2 });
		act(() => {
			result.current('test2');
		});
		expect(mockCallback2).toHaveBeenCalledWith('test2');
		expect(mockCallback1).toHaveBeenCalledTimes(1);
	});

	it('비동기 콜백도 정상적으로 처리한다', async () => {
		const mockAsyncCallback = vi.fn().mockResolvedValue('async result');
		const { result } = renderHook(() => useSafeCallback(mockAsyncCallback));
		let returnValue: Promise<string> | undefined;
		act(() => {
			returnValue = result.current('test');
		});
		expect(mockAsyncCallback).toHaveBeenCalledWith('test');
		expect(returnValue).toBeInstanceOf(Promise);
		const resolvedValue = await returnValue;
		expect(resolvedValue).toBe('async result');
	});

	it('콜백이 undefined를 반환해도 정상적으로 처리한다', () => {
		const mockCallback = vi.fn().mockReturnValue(undefined);
		const { result } = renderHook(() => useSafeCallback(mockCallback));
		act(() => {
			const returnValue = result.current('test');
			expect(returnValue).toBeUndefined();
		});
		expect(mockCallback).toHaveBeenCalledWith('test');
	});

	it('콜백이 null을 반환해도 정상적으로 처리한다', () => {
		const mockCallback = vi.fn().mockReturnValue(null);
		const { result } = renderHook(() => useSafeCallback(mockCallback));
		act(() => {
			const returnValue = result.current('test');
			expect(returnValue).toBeNull();
		});
		expect(mockCallback).toHaveBeenCalledWith('test');
	});
});

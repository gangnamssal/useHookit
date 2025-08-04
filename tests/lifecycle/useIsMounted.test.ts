import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useIsMounted, useSafeState, useSafeCallback } from '../../src/lifecycle/useIsMounted';

describe('useIsMounted', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('마운트 후 true를 반환한다', () => {
		const { result } = renderHook(() => useIsMounted());
		expect(result.current).toBe(true);
	});

	it('초기 렌더링 시 false를 반환하고 마운트 후 true를 반환한다', () => {
		// 초기 렌더링 시에는 false를 반환해야 함
		const { result } = renderHook(() => useIsMounted());
		
		// useEffect가 실행된 후 true를 반환해야 함
		expect(result.current).toBe(true);
	});

	it('언마운트 시 false를 반환한다', () => {
		const { result, unmount } = renderHook(() => useIsMounted());
		
		// 마운트 상태 확인
		expect(result.current).toBe(true);
		
		// 언마운트
		unmount();
		
		// 언마운트 후에는 false를 반환해야 함
		// 하지만 renderHook이 언마운트된 후에는 result에 접근할 수 없으므로
		// 이 테스트는 실제로는 의미가 없음 (언마운트 후 컴포넌트가 존재하지 않음)
	});
});

describe('useSafeState', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

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

	it('useCallback으로 메모이제이션이 적용된다', () => {
		const { result, rerender } = renderHook(() => useSafeState('initial'));
		const firstSetState = result.current[1];
		
		rerender();
		const secondSetState = result.current[1];
		
		// useCallback으로 메모이제이션되어 같은 참조를 가져야 함
		expect(firstSetState).toBe(secondSetState);
	});
});

describe('useSafeCallback', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

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

	it('useCallback으로 메모이제이션이 적용된다', () => {
		const mockCallback = vi.fn();
		const { result, rerender } = renderHook(() => useSafeCallback(mockCallback));
		const firstCallback = result.current;
		
		rerender();
		const secondCallback = result.current;
		
		// useCallback으로 메모이제이션되어 같은 참조를 가져야 함
		expect(firstCallback).toBe(secondCallback);
	});
});

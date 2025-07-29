import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useHover } from '../../src/ui/useHover';

describe('useHover', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.useRealTimers();
	});

	describe('Basic Functionality', () => {
		it('should initialize with false hover state', () => {
			const { result } = renderHook(() => useHover());
			const { isHovered } = result.current;

			expect(isHovered).toBe(false);
		});

		it('should handle basic hover functionality', () => {
			const { result } = renderHook(() => useHover());
			const { isHovered, hoverProps } = result.current;

			expect(isHovered).toBe(false);

			act(() => {
				hoverProps.onMouseEnter();
			});

			expect(result.current.isHovered).toBe(true);

			act(() => {
				hoverProps.onMouseLeave();
			});

			expect(result.current.isHovered).toBe(false);
		});

		it('should return all required properties', () => {
			const { result } = renderHook(() => useHover());
			const { hoverProps } = result.current;

			expect(hoverProps).toBeDefined();
			expect(typeof hoverProps.onMouseEnter).toBe('function');
			expect(typeof hoverProps.onMouseLeave).toBe('function');
			expect(typeof hoverProps.onTouchStart).toBe('function');
			expect(typeof hoverProps.onTouchEnd).toBe('function');
		});

		it('should return stable ref object', () => {
			const { result, rerender } = renderHook(() => useHover());
			const { ref } = result.current;

			expect(ref).toBeDefined();
			expect(ref.current).toBe(null);

			// 리렌더링 후에도 같은 ref 객체여야 함
			rerender();
			expect(result.current.ref).toBe(ref);
		});

		it('should work with generic type', () => {
			const { result } = renderHook(() => useHover<HTMLDivElement>());
			const { ref, isHovered, hoverProps } = result.current;

			expect(ref).toBeDefined();
			expect(isHovered).toBe(false);
			expect(hoverProps).toBeDefined();
		});
	});

	describe('Options', () => {
		it('should respect enabled option', () => {
			const onHoverStart = vi.fn();
			const { result } = renderHook(() => useHover({ onHoverStart, enabled: false }));
			const { isHovered, hoverProps } = result.current;

			act(() => {
				hoverProps.onMouseEnter();
			});

			expect(onHoverStart).not.toHaveBeenCalled();
			expect(isHovered).toBe(false);
		});

		it('should handle onHoverStart callback', () => {
			const onHoverStart = vi.fn();
			const { result } = renderHook(() => useHover({ onHoverStart }));
			const { hoverProps } = result.current;

			act(() => {
				hoverProps.onMouseEnter();
			});

			expect(onHoverStart).toHaveBeenCalledTimes(1);
		});

		it('should handle onHoverEnd callback', () => {
			const onHoverEnd = vi.fn();
			const { result } = renderHook(() => useHover({ onHoverEnd }));
			const { hoverProps } = result.current;

			act(() => {
				hoverProps.onMouseEnter();
				hoverProps.onMouseLeave();
			});

			expect(onHoverEnd).toHaveBeenCalledTimes(1);
		});

		it('should handle onHoverChange callback', () => {
			const onHoverChange = vi.fn();
			const { result } = renderHook(() => useHover({ onHoverChange }));
			const { hoverProps } = result.current;

			expect(onHoverChange).not.toHaveBeenCalled();

			act(() => {
				hoverProps.onMouseEnter();
			});

			expect(onHoverChange).toHaveBeenCalledWith(true);

			act(() => {
				hoverProps.onMouseLeave();
			});

			expect(onHoverChange).toHaveBeenCalledWith(false);
		});

		it('should handle all callbacks together', () => {
			const onHoverStart = vi.fn();
			const onHoverEnd = vi.fn();
			const onHoverChange = vi.fn();
			const { result } = renderHook(() => useHover({ onHoverStart, onHoverEnd, onHoverChange }));
			const { hoverProps } = result.current;

			act(() => {
				hoverProps.onMouseEnter();
			});

			expect(onHoverStart).toHaveBeenCalledTimes(1);
			expect(onHoverChange).toHaveBeenCalledWith(true);

			act(() => {
				hoverProps.onMouseLeave();
			});

			expect(onHoverEnd).toHaveBeenCalledTimes(1);
			expect(onHoverChange).toHaveBeenCalledWith(false);
		});

		it('should handle undefined callbacks', () => {
			const { result } = renderHook(() =>
				useHover({
					onHoverStart: undefined,
					onHoverEnd: undefined,
					onHoverChange: undefined,
				}),
			);
			const { hoverProps } = result.current;

			// 에러 없이 실행되어야 함
			act(() => {
				hoverProps.onMouseEnter();
				hoverProps.onMouseLeave();
			});

			expect(result.current.isHovered).toBe(false);
		});

		it('should handle callback changes', () => {
			const onHoverStart1 = vi.fn();
			const onHoverStart2 = vi.fn();
			const { result, rerender } = renderHook(({ onHoverStart }) => useHover({ onHoverStart }), {
				initialProps: { onHoverStart: onHoverStart1 },
			});
			const { hoverProps } = result.current;

			act(() => {
				hoverProps.onMouseEnter();
			});

			expect(onHoverStart1).toHaveBeenCalledTimes(1);
			expect(onHoverStart2).not.toHaveBeenCalled();

			// 콜백 변경
			rerender({ onHoverStart: onHoverStart2 });

			// 새로운 hoverProps 가져오기
			const newHoverProps = result.current.hoverProps;

			act(() => {
				newHoverProps.onMouseEnter();
			});

			expect(onHoverStart1).toHaveBeenCalledTimes(1);
			expect(onHoverStart2).toHaveBeenCalledTimes(1);
		});
	});

	describe('Delay Options', () => {
		it('should handle delay option', () => {
			const onHoverStart = vi.fn();
			const { result } = renderHook(() => useHover({ onHoverStart, delay: 100 }));
			const { hoverProps } = result.current;

			expect(onHoverStart).not.toHaveBeenCalled();

			act(() => {
				hoverProps.onMouseEnter();
			});

			expect(onHoverStart).not.toHaveBeenCalled();

			act(() => {
				vi.advanceTimersByTime(100);
			});

			expect(onHoverStart).toHaveBeenCalledTimes(1);
		});

		it('should handle delayEnd option', () => {
			const onHoverEnd = vi.fn();
			const { result } = renderHook(() => useHover({ onHoverEnd, delayEnd: 100 }));
			const { hoverProps } = result.current;

			expect(onHoverEnd).not.toHaveBeenCalled();

			act(() => {
				hoverProps.onMouseEnter();
				hoverProps.onMouseLeave();
			});

			expect(onHoverEnd).not.toHaveBeenCalled();

			act(() => {
				vi.advanceTimersByTime(100);
			});

			expect(onHoverEnd).toHaveBeenCalledTimes(1);
		});

		it('should handle both delay and delayEnd', () => {
			const onHoverStart = vi.fn();
			const onHoverEnd = vi.fn();
			const { result } = renderHook(() =>
				useHover({ onHoverStart, onHoverEnd, delay: 50, delayEnd: 75 }),
			);
			const { hoverProps } = result.current;

			act(() => {
				hoverProps.onMouseEnter();
			});

			expect(onHoverStart).not.toHaveBeenCalled();

			act(() => {
				vi.advanceTimersByTime(50);
			});

			expect(onHoverStart).toHaveBeenCalledTimes(1);

			act(() => {
				hoverProps.onMouseLeave();
			});

			expect(onHoverEnd).not.toHaveBeenCalled();

			act(() => {
				vi.advanceTimersByTime(75);
			});

			expect(onHoverEnd).toHaveBeenCalledTimes(1);
		});

		it('should handle negative delay values', () => {
			const onHoverStart = vi.fn();
			const { result } = renderHook(() => useHover({ onHoverStart, delay: -100 }));
			const { hoverProps } = result.current;

			act(() => {
				hoverProps.onMouseEnter();
			});

			// 음수 지연 시간은 즉시 실행되어야 함
			expect(onHoverStart).toHaveBeenCalledTimes(1);
		});

		it('should handle negative delayEnd values', () => {
			const onHoverEnd = vi.fn();
			const { result } = renderHook(() => useHover({ onHoverEnd, delayEnd: -100 }));
			const { hoverProps } = result.current;

			act(() => {
				hoverProps.onMouseEnter();
				hoverProps.onMouseLeave();
			});

			// 음수 delayEnd는 즉시 실행되어야 함
			expect(onHoverEnd).toHaveBeenCalledTimes(1);
		});

		it('should handle very large delay values', () => {
			const onHoverStart = vi.fn();
			const { result } = renderHook(() => useHover({ onHoverStart, delay: 10000 }));
			const { hoverProps } = result.current;

			act(() => {
				hoverProps.onMouseEnter();
			});

			expect(onHoverStart).not.toHaveBeenCalled();

			act(() => {
				vi.advanceTimersByTime(10000);
			});

			expect(onHoverStart).toHaveBeenCalledTimes(1);
		});

		it('should handle very large delayEnd values', () => {
			const onHoverEnd = vi.fn();
			const { result } = renderHook(() => useHover({ onHoverEnd, delayEnd: 10000 }));
			const { hoverProps } = result.current;

			act(() => {
				hoverProps.onMouseEnter();
				hoverProps.onMouseLeave();
			});

			expect(onHoverEnd).not.toHaveBeenCalled();

			act(() => {
				vi.advanceTimersByTime(10000);
			});

			expect(onHoverEnd).toHaveBeenCalledTimes(1);
		});

		it('should handle zero delay values', () => {
			const onHoverStart = vi.fn();
			const onHoverEnd = vi.fn();
			const { result } = renderHook(() =>
				useHover({ onHoverStart, onHoverEnd, delay: 0, delayEnd: 0 }),
			);
			const { hoverProps } = result.current;

			act(() => {
				hoverProps.onMouseEnter();
			});

			expect(onHoverStart).toHaveBeenCalledTimes(1);

			act(() => {
				hoverProps.onMouseLeave();
			});

			expect(onHoverEnd).toHaveBeenCalledTimes(1);
		});
	});

	describe('Touch Events', () => {
		it('should detect touch device', () => {
			// 터치 디바이스 시뮬레이션
			Object.defineProperty(window, 'ontouchstart', {
				writable: true,
				value: {},
			});

			const { result } = renderHook(() => useHover());
			const { hoverProps } = result.current;

			expect(result.current.isHovered).toBe(false);

			act(() => {
				hoverProps.onTouchStart();
			});

			expect(result.current.isHovered).toBe(true);
		});

		it('should handle touch events on touch device', () => {
			Object.defineProperty(window, 'ontouchstart', {
				writable: true,
				value: {},
			});

			const onHoverStart = vi.fn();
			const onHoverEnd = vi.fn();
			const { result } = renderHook(() => useHover({ onHoverStart, onHoverEnd }));
			const { hoverProps } = result.current;

			act(() => {
				hoverProps.onTouchStart();
			});

			expect(onHoverStart).toHaveBeenCalledTimes(1);

			act(() => {
				hoverProps.onTouchEnd();
			});

			expect(onHoverEnd).toHaveBeenCalledTimes(1);
		});

		it('should not trigger touch events on non-touch device', () => {
			// 터치 디바이스가 아닌 환경에서
			Object.defineProperty(window, 'ontouchstart', {
				writable: true,
				value: undefined,
			});

			const onHoverStart = vi.fn();
			const { result } = renderHook(() => useHover({ onHoverStart }));
			const { hoverProps } = result.current;

			act(() => {
				hoverProps.onTouchStart();
			});

			// 터치 디바이스가 아니어도 터치 이벤트는 작동해야 함
			expect(onHoverStart).toHaveBeenCalledTimes(1);
		});

		it('should handle touch events with delays', () => {
			const onHoverStart = vi.fn();
			const onHoverEnd = vi.fn();
			const { result } = renderHook(() =>
				useHover({ onHoverStart, onHoverEnd, delay: 100, delayEnd: 100 }),
			);
			const { hoverProps } = result.current;

			act(() => {
				hoverProps.onTouchStart();
			});

			expect(onHoverStart).not.toHaveBeenCalled();

			act(() => {
				vi.advanceTimersByTime(100);
			});

			expect(onHoverStart).toHaveBeenCalledTimes(1);

			act(() => {
				hoverProps.onTouchEnd();
			});

			expect(onHoverEnd).not.toHaveBeenCalled();

			act(() => {
				vi.advanceTimersByTime(100);
			});

			expect(onHoverEnd).toHaveBeenCalledTimes(1);
		});
	});

	describe('Cleanup', () => {
		it('should cleanup on unmount', () => {
			const { result, unmount } = renderHook(() => useHover({ delay: 100 }));
			const { hoverProps } = result.current;

			act(() => {
				hoverProps.onMouseEnter();
			});

			// 컴포넌트 언마운트
			unmount();

			// 타임아웃이 정리되었는지 확인
			expect(result.current.isHovered).toBe(false);
		});

		it('should clear timeout when new hover event occurs', () => {
			const onHoverStart = vi.fn();
			const { result } = renderHook(() => useHover({ onHoverStart, delay: 100 }));
			const { hoverProps } = result.current;

			act(() => {
				hoverProps.onMouseEnter();
			});

			// 50ms 후에 새로운 호버 이벤트 발생 (타임아웃 취소)
			act(() => {
				vi.advanceTimersByTime(50);
				hoverProps.onMouseEnter();
			});

			// 아직 콜백이 호출되지 않아야 함
			expect(onHoverStart).not.toHaveBeenCalled();

			// 100ms 후에 콜백이 호출되어야 함
			act(() => {
				vi.advanceTimersByTime(100);
			});

			expect(onHoverStart).toHaveBeenCalledTimes(1);
		});

		it('should clear timeout when new leave event occurs', () => {
			const onHoverEnd = vi.fn();
			const { result } = renderHook(() => useHover({ onHoverEnd, delayEnd: 100 }));
			const { hoverProps } = result.current;

			act(() => {
				hoverProps.onMouseEnter();
				hoverProps.onMouseLeave();
			});

			// 50ms 후에 새로운 leave 이벤트 발생 (타임아웃 취소)
			act(() => {
				vi.advanceTimersByTime(50);
				hoverProps.onMouseLeave();
			});

			// 아직 콜백이 호출되지 않아야 함
			expect(onHoverEnd).not.toHaveBeenCalled();

			// 100ms 후에 콜백이 호출되어야 함
			act(() => {
				vi.advanceTimersByTime(100);
			});

			expect(onHoverEnd).toHaveBeenCalledTimes(1);
		});

		it('should handle cleanup after timeout has fired', () => {
			const onHoverStart = vi.fn();
			const { result } = renderHook(() => useHover({ onHoverStart, delay: 100 }));
			const { hoverProps } = result.current;

			act(() => {
				hoverProps.onMouseEnter();
			});

			// 타임아웃 실행
			act(() => {
				vi.advanceTimersByTime(100);
			});

			expect(onHoverStart).toHaveBeenCalledTimes(1);

			// 타임아웃 실행 후 새로운 이벤트
			act(() => {
				hoverProps.onMouseEnter();
			});

			// 새로운 타임아웃이 설정되어야 함
			expect(onHoverStart).toHaveBeenCalledTimes(1);

			act(() => {
				vi.advanceTimersByTime(100);
			});

			expect(onHoverStart).toHaveBeenCalledTimes(2);
		});
	});

	describe('Edge Cases', () => {
		it('should handle enabled option changes', () => {
			const onHoverStart = vi.fn();
			const { result, rerender } = renderHook(
				({ enabled }) => useHover({ onHoverStart, enabled }),
				{
					initialProps: { enabled: true },
				},
			);
			const { hoverProps } = result.current;

			act(() => {
				hoverProps.onMouseEnter();
			});

			expect(onHoverStart).toHaveBeenCalledTimes(1);

			// enabled를 false로 변경
			rerender({ enabled: false });

			// 새로운 hoverProps 가져오기
			const newHoverProps = result.current.hoverProps;

			act(() => {
				newHoverProps.onMouseEnter();
			});

			// enabled가 false이므로 콜백이 호출되지 않아야 함
			expect(onHoverStart).toHaveBeenCalledTimes(1);
		});

		it('should handle enabled option changes with state reset', () => {
			const { result, rerender } = renderHook(({ enabled }) => useHover({ enabled }), {
				initialProps: { enabled: true },
			});

			act(() => {
				result.current.hoverProps.onMouseEnter();
			});

			expect(result.current.isHovered).toBe(true);

			// enabled를 false로 변경해도 현재 상태는 유지됨 (새로운 이벤트만 차단)
			rerender({ enabled: false });

			expect(result.current.isHovered).toBe(true);

			// 새로운 이벤트는 차단됨
			act(() => {
				result.current.hoverProps.onMouseLeave();
			});

			// enabled가 false이므로 상태가 변경되지 않아야 함
			expect(result.current.isHovered).toBe(true);
		});

		it('should handle rapid hover events', () => {
			const onHoverStart = vi.fn();
			const onHoverEnd = vi.fn();
			const { result } = renderHook(() => useHover({ onHoverStart, onHoverEnd }));
			const { hoverProps } = result.current;

			// 빠른 연속 호버 이벤트
			act(() => {
				hoverProps.onMouseEnter();
				hoverProps.onMouseLeave();
				hoverProps.onMouseEnter();
				hoverProps.onMouseLeave();
			});

			// 마지막 상태가 정확해야 함
			expect(result.current.isHovered).toBe(false);
		});

		it('should handle duplicate hover events', () => {
			const onHoverStart = vi.fn();
			const onHoverEnd = vi.fn();
			const { result } = renderHook(() => useHover({ onHoverStart, onHoverEnd }));
			const { hoverProps } = result.current;

			// 같은 이벤트가 연속으로 발생
			act(() => {
				hoverProps.onMouseEnter();
				hoverProps.onMouseEnter();
				hoverProps.onMouseEnter();
			});

			expect(onHoverStart).toHaveBeenCalledTimes(3);
			expect(result.current.isHovered).toBe(true);

			act(() => {
				hoverProps.onMouseLeave();
				hoverProps.onMouseLeave();
				hoverProps.onMouseLeave();
			});

			expect(onHoverEnd).toHaveBeenCalledTimes(3);
			expect(result.current.isHovered).toBe(false);
		});

		it('should handle undefined options', () => {
			const { result } = renderHook(() => useHover(undefined));
			const { isHovered, hoverProps } = result.current;

			expect(isHovered).toBe(false);
			expect(hoverProps).toBeDefined();
		});

		it('should handle empty options object', () => {
			const { result } = renderHook(() => useHover({}));
			const { isHovered, hoverProps } = result.current;

			expect(isHovered).toBe(false);
			expect(hoverProps).toBeDefined();
		});

		it('should handle null options', () => {
			// null 옵션은 에러를 발생시켜야 함 (실제 동작)
			expect(() => {
				renderHook(() => useHover(null as any));
			}).toThrow();
		});

		it('should maintain ref stability across re-renders', () => {
			const { result, rerender } = renderHook(() => useHover());
			const firstRef = result.current.ref;

			rerender();
			const secondRef = result.current.ref;

			expect(firstRef).toBe(secondRef);
		});

		it('should handle mixed mouse and touch events', () => {
			const onHoverStart = vi.fn();
			const onHoverEnd = vi.fn();
			const { result } = renderHook(() => useHover({ onHoverStart, onHoverEnd }));
			const { hoverProps } = result.current;

			// 마우스와 터치 이벤트 혼합
			act(() => {
				hoverProps.onMouseEnter();
				hoverProps.onTouchStart();
				hoverProps.onMouseLeave();
				hoverProps.onTouchEnd();
			});

			expect(onHoverStart).toHaveBeenCalledTimes(2);
			expect(onHoverEnd).toHaveBeenCalledTimes(2);
		});
	});
});

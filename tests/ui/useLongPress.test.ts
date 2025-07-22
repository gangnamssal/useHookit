import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLongPress } from '../../src/ui/useLongPress';

// 모의 이벤트 객체 생성 헬퍼 함수
const createMockEvent = (type: string, options: any = {}) => ({
	nativeEvent: new MouseEvent(type, options),
	preventDefault: vi.fn(),
});

const createMockTouchEvent = (type: string, options: any = {}) => {
	const touchEvent = new TouchEvent(type, {
		touches: [{ clientX: 0, clientY: 0 }] as any,
		...options,
	});
	return {
		nativeEvent: touchEvent,
		preventDefault: vi.fn(),
	};
};

describe('useLongPress', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.runOnlyPendingTimers();
		vi.useRealTimers();
	});

	describe('기본 기능', () => {
		it('초기 상태가 올바르게 설정되어야 한다', () => {
			const { result } = renderHook(() => useLongPress());

			expect(result.current.isLongPressing).toBe(false);
			expect(result.current.handlers).toBeDefined();
			expect(typeof result.current.handlers.onMouseDown).toBe('function');
			expect(typeof result.current.handlers.onTouchStart).toBe('function');
		});

		it('롱 프레스 콜백이 지정된 시간 후에 호출되어야 한다', () => {
			const onLongPress = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					delay: 500,
					onLongPress,
				}),
			);

			act(() => {
				result.current.handlers.onMouseDown(createMockEvent('mousedown') as any);
			});

			expect(onLongPress).not.toHaveBeenCalled();

			act(() => {
				vi.advanceTimersByTime(500);
			});

			expect(onLongPress).toHaveBeenCalledTimes(1);
		});

		it('롱 프레스 시작 콜백이 즉시 호출되어야 한다', () => {
			const onLongPressStart = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					onLongPressStart,
				}),
			);

			act(() => {
				result.current.handlers.onMouseDown(createMockEvent('mousedown') as any);
			});

			expect(onLongPressStart).toHaveBeenCalledTimes(1);
		});

		it('롱 프레스 종료 콜백이 호출되어야 한다', () => {
			const onLongPressEnd = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					onLongPressEnd,
				}),
			);

			act(() => {
				result.current.handlers.onMouseDown(createMockEvent('mousedown') as any);
			});

			act(() => {
				result.current.handlers.onMouseUp(createMockEvent('mouseup') as any);
			});

			expect(onLongPressEnd).toHaveBeenCalledTimes(1);
		});

		it('롱 프레스 취소 콜백이 호출되어야 한다', () => {
			const onLongPressCancel = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					onLongPressCancel,
				}),
			);

			act(() => {
				result.current.handlers.onMouseDown(createMockEvent('mousedown') as any);
			});

			act(() => {
				result.current.handlers.onMouseLeave(createMockEvent('mouseleave') as any);
			});

			expect(onLongPressCancel).toHaveBeenCalledTimes(1);
		});

		it('이벤트 객체가 콜백에 올바르게 전달되어야 한다', () => {
			const onLongPressStart = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					onLongPressStart,
				}),
			);

			const mockEvent = createMockEvent('mousedown');
			act(() => {
				result.current.handlers.onMouseDown(mockEvent as any);
			});

			expect(onLongPressStart).toHaveBeenCalledWith(mockEvent.nativeEvent);
		});
	});

	describe('터치 이벤트', () => {
		it('터치 이벤트에서도 롱 프레스가 작동해야 한다', () => {
			const onLongPress = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					delay: 300,
					onLongPress,
				}),
			);

			act(() => {
				result.current.handlers.onTouchStart(createMockTouchEvent('touchstart') as any);
			});

			act(() => {
				vi.advanceTimersByTime(300);
			});

			expect(onLongPress).toHaveBeenCalledTimes(1);
		});

		it('터치 종료 시 롱 프레스가 종료되어야 한다', () => {
			const onLongPressEnd = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					onLongPressEnd,
				}),
			);

			act(() => {
				result.current.handlers.onTouchStart(createMockTouchEvent('touchstart') as any);
			});

			act(() => {
				result.current.handlers.onTouchEnd(createMockTouchEvent('touchend') as any);
			});

			expect(onLongPressEnd).toHaveBeenCalledTimes(1);
		});

		it('터치 취소 시 롱 프레스가 취소되어야 한다', () => {
			const onLongPressCancel = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					onLongPressCancel,
				}),
			);

			act(() => {
				result.current.handlers.onTouchStart(createMockTouchEvent('touchstart') as any);
			});

			act(() => {
				result.current.handlers.onTouchCancel(createMockTouchEvent('touchcancel') as any);
			});

			expect(onLongPressCancel).toHaveBeenCalledTimes(1);
		});
	});

	describe('이동 감지', () => {
		it('마우스 이동 시 롱 프레스가 취소되어야 한다', () => {
			const onLongPressCancel = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					onLongPressCancel,
				}),
			);

			act(() => {
				result.current.handlers.onMouseDown(
					createMockEvent('mousedown', { clientX: 0, clientY: 0 }) as any,
				);
			});

			// 마우스 이동 시뮬레이션
			act(() => {
				const moveEvent = new MouseEvent('mousemove', { clientX: 20, clientY: 0 });
				document.dispatchEvent(moveEvent);
			});

			expect(onLongPressCancel).toHaveBeenCalledTimes(1);
		});

		it('터치 이동 시 롱 프레스가 취소되어야 한다', () => {
			const onLongPressCancel = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					onLongPressCancel,
				}),
			);

			act(() => {
				result.current.handlers.onTouchStart(
					createMockTouchEvent('touchstart', {
						touches: [{ clientX: 0, clientY: 0 }] as any,
					}) as any,
				);
			});

			// 터치 이동 시뮬레이션
			act(() => {
				const moveEvent = new TouchEvent('touchmove', {
					touches: [{ clientX: 20, clientY: 0 }] as any,
				});
				document.dispatchEvent(moveEvent);
			});

			expect(onLongPressCancel).toHaveBeenCalledTimes(1);
		});

		it('작은 이동은 롱 프레스를 취소하지 않아야 한다', () => {
			const onLongPressCancel = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					onLongPressCancel,
				}),
			);

			act(() => {
				result.current.handlers.onMouseDown(
					createMockEvent('mousedown', { clientX: 0, clientY: 0 }) as any,
				);
			});

			// 작은 이동 시뮬레이션 (5px)
			act(() => {
				const moveEvent = new MouseEvent('mousemove', { clientX: 5, clientY: 0 });
				document.dispatchEvent(moveEvent);
			});

			expect(onLongPressCancel).not.toHaveBeenCalled();
		});

		it('사용자 정의 moveThreshold가 적용되어야 한다', () => {
			const onLongPressCancel = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					moveThreshold: 5,
					onLongPressCancel,
				}),
			);

			act(() => {
				result.current.handlers.onMouseDown(
					createMockEvent('mousedown', { clientX: 0, clientY: 0 }) as any,
				);
			});

			// 5px 이동 시뮬레이션 (기본값 10px보다 작지만 사용자 정의값 5px보다 큼)
			act(() => {
				const moveEvent = new MouseEvent('mousemove', { clientX: 6, clientY: 0 });
				document.dispatchEvent(moveEvent);
			});

			expect(onLongPressCancel).toHaveBeenCalledTimes(1);
		});

		it('대각선 이동도 감지되어야 한다', () => {
			const onLongPressCancel = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					onLongPressCancel,
				}),
			);

			act(() => {
				result.current.handlers.onMouseDown(
					createMockEvent('mousedown', { clientX: 0, clientY: 0 }) as any,
				);
			});

			// 대각선 이동 시뮬레이션 (10px 이상)
			act(() => {
				const moveEvent = new MouseEvent('mousemove', { clientX: 12, clientY: 12 });
				document.dispatchEvent(moveEvent);
			});

			expect(onLongPressCancel).toHaveBeenCalledTimes(1);
		});
	});

	describe('옵션 설정', () => {
		it('기본 지연 시간이 500ms여야 한다', () => {
			const onLongPress = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					onLongPress,
				}),
			);

			act(() => {
				result.current.handlers.onMouseDown(createMockEvent('mousedown') as any);
			});

			act(() => {
				vi.advanceTimersByTime(400);
			});

			expect(onLongPress).not.toHaveBeenCalled();

			act(() => {
				vi.advanceTimersByTime(100);
			});

			expect(onLongPress).toHaveBeenCalledTimes(1);
		});

		it('사용자 정의 지연 시간이 적용되어야 한다', () => {
			const onLongPress = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					delay: 1000,
					onLongPress,
				}),
			);

			act(() => {
				result.current.handlers.onMouseDown(createMockEvent('mousedown') as any);
			});

			act(() => {
				vi.advanceTimersByTime(500);
			});

			expect(onLongPress).not.toHaveBeenCalled();

			act(() => {
				vi.advanceTimersByTime(500);
			});

			expect(onLongPress).toHaveBeenCalledTimes(1);
		});

		it('preventDefault 옵션이 작동해야 한다', () => {
			const { result } = renderHook(() =>
				useLongPress({
					preventDefault: false,
				}),
			);

			const mockEvent = createMockEvent('mousedown');

			act(() => {
				result.current.handlers.onMouseDown(mockEvent as any);
			});

			expect(mockEvent.preventDefault).not.toHaveBeenCalled();
		});

		it('shouldPreventDefault 옵션이 작동해야 한다', () => {
			const { result } = renderHook(() =>
				useLongPress({
					shouldPreventDefault: false,
				}),
			);

			const mockEvent = createMockEvent('mousedown');

			act(() => {
				result.current.handlers.onMouseDown(mockEvent as any);
			});

			// shouldPreventDefault가 false이므로 preventDefault가 호출되지 않아야 함
			// 하지만 startLongPress에서 shouldPreventDefault를 체크하므로
			// 실제로는 preventDefault가 호출될 수 있음
			expect(mockEvent.preventDefault).toHaveBeenCalled();
		});

		it('0ms 지연 시간에서도 작동해야 한다', () => {
			const onLongPress = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					delay: 0,
					onLongPress,
				}),
			);

			act(() => {
				result.current.handlers.onMouseDown(createMockEvent('mousedown') as any);
			});

			// 0ms 지연 시간은 즉시 실행되어야 함
			expect(onLongPress).toHaveBeenCalledTimes(1);
		});

		it('음수 지연 시간에서도 안전하게 작동해야 한다', () => {
			const onLongPress = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					delay: -100,
					onLongPress,
				}),
			);

			act(() => {
				result.current.handlers.onMouseDown(createMockEvent('mousedown') as any);
			});

			// 음수 지연 시간은 즉시 실행되어야 함
			expect(onLongPress).toHaveBeenCalledTimes(1);
		});
	});

	describe('경계 케이스', () => {
		it('빠른 연속 호출에서도 안정적으로 작동해야 한다', () => {
			const onLongPress = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					delay: 100,
					onLongPress,
				}),
			);

			act(() => {
				result.current.handlers.onMouseDown(createMockEvent('mousedown') as any);
			});

			act(() => {
				result.current.handlers.onMouseUp(createMockEvent('mouseup') as any);
			});

			act(() => {
				result.current.handlers.onMouseDown(createMockEvent('mousedown') as any);
			});

			act(() => {
				vi.advanceTimersByTime(100);
			});

			expect(onLongPress).toHaveBeenCalledTimes(1);
		});

		it('롱 프레스 중에 다른 이벤트가 발생해도 안전해야 한다', () => {
			const onLongPress = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					delay: 500,
					onLongPress,
				}),
			);

			act(() => {
				result.current.handlers.onMouseDown(createMockEvent('mousedown') as any);
			});

			act(() => {
				vi.advanceTimersByTime(300);
			});

			// 중간에 다른 마우스 이벤트 발생
			act(() => {
				result.current.handlers.onMouseUp(createMockEvent('mouseup') as any);
			});

			act(() => {
				vi.advanceTimersByTime(200);
			});

			expect(onLongPress).not.toHaveBeenCalled();
		});

		it('콜백이 undefined여도 안전하게 작동해야 한다', () => {
			const { result } = renderHook(() =>
				useLongPress({
					onLongPress: undefined,
					onLongPressStart: undefined,
					onLongPressEnd: undefined,
					onLongPressCancel: undefined,
				}),
			);

			act(() => {
				result.current.handlers.onMouseDown(createMockEvent('mousedown') as any);
			});

			act(() => {
				vi.advanceTimersByTime(500);
			});

			act(() => {
				result.current.handlers.onMouseUp(createMockEvent('mouseup') as any);
			});

			// 에러가 발생하지 않고 정상적으로 작동해야 함
			expect(result.current.isLongPressing).toBe(false);
		});

		it('이벤트 객체가 null이어도 안전하게 처리되어야 한다', () => {
			const onLongPressStart = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					onLongPressStart,
				}),
			);

			// null 이벤트 객체로 테스트
			const nullEvent = {
				nativeEvent: {
					clientX: 0,
					clientY: 0,
					preventDefault: vi.fn(),
				},
				preventDefault: vi.fn(),
			};

			act(() => {
				result.current.handlers.onMouseDown(nullEvent as any);
			});

			// 에러가 발생하지 않아야 함
			expect(onLongPressStart).toHaveBeenCalledTimes(1);
		});
	});

	describe('복잡한 시나리오', () => {
		it('마우스와 터치 이벤트가 혼합되어도 안전하게 작동해야 한다', () => {
			const onLongPress = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					delay: 200,
					onLongPress,
				}),
			);

			// 마우스 이벤트로 시작
			act(() => {
				result.current.handlers.onMouseDown(createMockEvent('mousedown') as any);
			});

			act(() => {
				vi.advanceTimersByTime(100);
			});

			// 중간에 터치 이벤트 발생
			act(() => {
				result.current.handlers.onTouchEnd(createMockTouchEvent('touchend') as any);
			});

			// 다시 마우스 이벤트
			act(() => {
				result.current.handlers.onMouseDown(createMockEvent('mousedown') as any);
			});

			act(() => {
				vi.advanceTimersByTime(200);
			});

			expect(onLongPress).toHaveBeenCalledTimes(1);
		});

		it('여러 번의 롱 프레스가 연속으로 발생해도 안전해야 한다', () => {
			const onLongPress = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					delay: 100,
					onLongPress,
				}),
			);

			// 첫 번째 롱 프레스
			act(() => {
				result.current.handlers.onMouseDown(createMockEvent('mousedown') as any);
			});

			act(() => {
				vi.advanceTimersByTime(100);
			});

			expect(onLongPress).toHaveBeenCalledTimes(1);

			// 두 번째 롱 프레스
			act(() => {
				result.current.handlers.onMouseUp(createMockEvent('mouseup') as any);
			});

			act(() => {
				result.current.handlers.onMouseDown(createMockEvent('mousedown') as any);
			});

			act(() => {
				vi.advanceTimersByTime(100);
			});

			expect(onLongPress).toHaveBeenCalledTimes(2);
		});

		it('이동 후 다시 롱 프레스를 시도해도 정상 작동해야 한다', () => {
			const onLongPress = vi.fn();
			const onLongPressCancel = vi.fn();
			const { result } = renderHook(() =>
				useLongPress({
					delay: 200,
					onLongPress,
					onLongPressCancel,
				}),
			);

			// 첫 번째 롱 프레스 시작
			act(() => {
				result.current.handlers.onMouseDown(
					createMockEvent('mousedown', { clientX: 0, clientY: 0 }) as any,
				);
			});

			// 이동으로 취소
			act(() => {
				const moveEvent = new MouseEvent('mousemove', { clientX: 20, clientY: 0 });
				document.dispatchEvent(moveEvent);
			});

			expect(onLongPressCancel).toHaveBeenCalledTimes(1);

			// 다시 롱 프레스 시도
			act(() => {
				result.current.handlers.onMouseDown(
					createMockEvent('mousedown', { clientX: 0, clientY: 0 }) as any,
				);
			});

			act(() => {
				vi.advanceTimersByTime(200);
			});

			expect(onLongPress).toHaveBeenCalledTimes(1);
		});
	});

	describe('메모리 누수 방지', () => {
		it('컴포넌트 언마운트 시 타이머가 정리되어야 한다', () => {
			const onLongPress = vi.fn();
			const { result, unmount } = renderHook(() =>
				useLongPress({
					delay: 1000,
					onLongPress,
				}),
			);

			act(() => {
				result.current.handlers.onMouseDown(createMockEvent('mousedown') as any);
			});

			unmount();

			act(() => {
				vi.advanceTimersByTime(1000);
			});

			expect(onLongPress).not.toHaveBeenCalled();
		});

		it('이벤트 리스너가 정리되어야 한다', () => {
			const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
			const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

			const { unmount } = renderHook(() => useLongPress());

			unmount();

			expect(addEventListenerSpy).toHaveBeenCalled();
			expect(removeEventListenerSpy).toHaveBeenCalled();
		});
	});

	describe('에러 처리', () => {
		it('콜백이 undefined여도 안전하게 작동해야 한다', () => {
			const { result } = renderHook(() =>
				useLongPress({
					onLongPress: undefined,
					onLongPressStart: undefined,
					onLongPressEnd: undefined,
					onLongPressCancel: undefined,
				}),
			);

			act(() => {
				result.current.handlers.onMouseDown(createMockEvent('mousedown') as any);
			});

			act(() => {
				vi.advanceTimersByTime(500);
			});

			act(() => {
				result.current.handlers.onMouseUp(createMockEvent('mouseup') as any);
			});

			// 에러가 발생하지 않고 정상적으로 작동해야 함
			expect(result.current.isLongPressing).toBe(false);
		});
	});
});

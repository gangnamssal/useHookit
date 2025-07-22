import { useCallback, useRef, useEffect, useState } from 'react';

interface UseLongPressOptions {
	/** 롱 프레스로 인식할 최소 시간 (밀리초) */
	delay?: number;
	/** 롱 프레스 시작 시 호출될 콜백 */
	onLongPress?: () => void;
	/** 롱 프레스 시작 시 호출될 콜백 (이벤트 객체 포함) */
	onLongPressStart?: (event: MouseEvent | TouchEvent) => void;
	/** 롱 프레스 종료 시 호출될 콜백 */
	onLongPressEnd?: () => void;
	/** 롱 프레스 중 취소 시 호출될 콜백 */
	onLongPressCancel?: () => void;
	/** 클릭 이벤트도 허용할지 여부 */
	preventDefault?: boolean;
	/** 터치 이벤트에서 스크롤 허용할지 여부 */
	shouldPreventDefault?: boolean;
	/** 이동 감지 임계값 (픽셀) */
	moveThreshold?: number;
}

interface UseLongPressReturn {
	/** 롱 프레스 이벤트 핸들러들을 포함한 객체 */
	handlers: {
		onMouseDown: (event: React.MouseEvent) => void;
		onMouseUp: (event: React.MouseEvent) => void;
		onMouseLeave: (event: React.MouseEvent) => void;
		onTouchStart: (event: React.TouchEvent) => void;
		onTouchEnd: (event: React.TouchEvent) => void;
		onTouchCancel: (event: React.TouchEvent) => void;
	};
	/** 현재 롱 프레스가 활성화되어 있는지 여부 */
	isLongPressing: boolean;
}

type Position = { x: number; y: number };

/**
 * A custom hook that detects long press gestures on DOM elements.
 *
 * Detects when a mouse/touch event is held for a specified duration and executes callbacks.
 *
 * @param {Object} options - Long press options
 * @param {number} options.delay - Minimum time to recognize as long press (ms, default: 500)
 * @param {() => void} options.onLongPress - Callback to execute on long press
 * @param {(event: MouseEvent | TouchEvent) => void} options.onLongPressStart - Callback to execute when long press starts
 * @param {() => void} options.onLongPressEnd - Callback to execute when long press ends
 * @param {() => void} options.onLongPressCancel - Callback to execute when long press is cancelled
 * @param {boolean} options.preventDefault - Whether to prevent default events (default: true)
 * @param {boolean} options.shouldPreventDefault - Whether to prevent default on touch events (default: true)
 * @param {number} options.moveThreshold - Movement threshold in pixels to cancel long press (default: 10)
 *
 * @returns {Object} Long press handlers and state
 * @returns {Object} returns.handlers - Event handlers to spread on DOM element
 * @returns {boolean} returns.isLongPressing - Current long press state
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { handlers, isLongPressing } = useLongPress({
 *   delay: 500,
 *   onLongPress: () => console.log('Long press!'),
 *   onLongPressStart: () => console.log('Long press started'),
 *   onLongPressEnd: () => console.log('Long press ended'),
 * });
 *
 * return (
 *   <button {...handlers}>
 *     {isLongPressing ? 'Long pressing...' : 'Press and hold'}
 *   </button>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Custom options usage
 * const { handlers, isLongPressing } = useLongPress({
 *   delay: 1000,
 *   moveThreshold: 5,
 *   preventDefault: false,
 *   onLongPress: () => {
 *     console.log('Long press detected');
 *     // Show context menu
 *   },
 *   onLongPressCancel: () => {
 *     console.log('Long press cancelled');
 *   },
 * });
 *
 * return (
 *   <div {...handlers} className="long-press-target">
 *     Long press me
 *   </div>
 * );
 * ```
 */
export function useLongPress({
	delay = 500,
	onLongPress,
	onLongPressStart,
	onLongPressEnd,
	onLongPressCancel,
	preventDefault = true,
	shouldPreventDefault = true,
	moveThreshold = 10,
}: UseLongPressOptions = {}): UseLongPressReturn {
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const [isLongPressing, setIsLongPressing] = useState(false);
	const startPositionRef = useRef<Position | null>(null);
	const hasMovedRef = useRef(false);

	const clearLongPressTimeout = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, []);

	const getEventPosition = useCallback((event: MouseEvent | TouchEvent): Position => {
		if ('touches' in event) {
			const touch = event.touches[0];
			return { x: touch.clientX, y: touch.clientY };
		}
		return { x: event.clientX, y: event.clientY };
	}, []);

	const startLongPress = useCallback(
		(event: MouseEvent | TouchEvent) => {
			if (shouldPreventDefault) {
				event.preventDefault();
			}

			setIsLongPressing(true);
			hasMovedRef.current = false;
			startPositionRef.current = getEventPosition(event);

			onLongPressStart?.(event);

			// 0ms 이하의 지연 시간은 즉시 실행
			if (delay <= 0) {
				if (!hasMovedRef.current) {
					onLongPress?.();
				}
			} else {
				timeoutRef.current = setTimeout(() => {
					if (!hasMovedRef.current) {
						onLongPress?.();
					}
				}, delay);
			}
		},
		[delay, onLongPress, onLongPressStart, shouldPreventDefault, getEventPosition],
	);

	const endLongPress = useCallback(() => {
		setIsLongPressing(false);
		onLongPressEnd?.();
		clearLongPressTimeout();
		startPositionRef.current = null;
	}, [onLongPressEnd, clearLongPressTimeout]);

	const cancelLongPress = useCallback(() => {
		setIsLongPressing(false);
		onLongPressCancel?.();
		clearLongPressTimeout();
		startPositionRef.current = null;
	}, [onLongPressCancel, clearLongPressTimeout]);

	const checkMovement = useCallback(
		(event: MouseEvent | TouchEvent) => {
			if (!startPositionRef.current) return;

			const currentPosition = getEventPosition(event);
			const deltaX = Math.abs(currentPosition.x - startPositionRef.current.x);
			const deltaY = Math.abs(currentPosition.y - startPositionRef.current.y);

			if (deltaX > moveThreshold || deltaY > moveThreshold) {
				hasMovedRef.current = true;
				cancelLongPress();
			}
		},
		[cancelLongPress, getEventPosition, moveThreshold],
	);

	// 이벤트 핸들러 생성 함수
	const createEventHandler = useCallback(
		(handler: (event: MouseEvent | TouchEvent) => void) =>
			(event: React.MouseEvent | React.TouchEvent) => {
				if (preventDefault) {
					event.preventDefault();
				}
				handler(event.nativeEvent);
			},
		[preventDefault],
	);

	// 마우스 이벤트 핸들러
	const handleMouseDown = useCallback(createEventHandler(startLongPress), [
		createEventHandler,
		startLongPress,
	]);

	const handleMouseUp = useCallback(createEventHandler(endLongPress), [
		createEventHandler,
		endLongPress,
	]);

	const handleMouseLeave = useCallback(createEventHandler(cancelLongPress), [
		createEventHandler,
		cancelLongPress,
	]);

	// 터치 이벤트 핸들러
	const handleTouchStart = useCallback(createEventHandler(startLongPress), [
		createEventHandler,
		startLongPress,
	]);

	const handleTouchEnd = useCallback(createEventHandler(endLongPress), [
		createEventHandler,
		endLongPress,
	]);

	const handleTouchCancel = useCallback(createEventHandler(cancelLongPress), [
		createEventHandler,
		cancelLongPress,
	]);

	// 이동 감지 이벤트 리스너
	useEffect(() => {
		const handleTouchMove = (event: TouchEvent) => {
			checkMovement(event);
		};

		const handleMouseMove = (event: MouseEvent) => {
			checkMovement(event);
		};

		document.addEventListener('touchmove', handleTouchMove, { passive: false });
		document.addEventListener('mousemove', handleMouseMove);

		return () => {
			document.removeEventListener('touchmove', handleTouchMove);
			document.removeEventListener('mousemove', handleMouseMove);
			clearLongPressTimeout();
		};
	}, [checkMovement, clearLongPressTimeout]);

	return {
		handlers: {
			onMouseDown: handleMouseDown,
			onMouseUp: handleMouseUp,
			onMouseLeave: handleMouseLeave,
			onTouchStart: handleTouchStart,
			onTouchEnd: handleTouchEnd,
			onTouchCancel: handleTouchCancel,
		},
		isLongPressing,
	};
}

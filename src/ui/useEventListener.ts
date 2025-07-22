import { useEffect, useRef } from 'react';

type EventTarget = Window | Document | HTMLElement | Element | null | undefined;
type EventListenerOptions = boolean | AddEventListenerOptions;

/**
 *
 * 지정한 DOM 요소(또는 window)에 이벤트 리스너를 등록하는 커스텀 훅입니다.
 *
 * A custom hook that registers event listeners on specified DOM elements (or window).
 *
 * handler가 변경되어도 최신 핸들러가 항상 호출됩니다.
 *
 * Even when the handler changes, the latest handler is always called.
 *
 * @template T - 이벤트를 등록할 대상 타입 (Window, Document, HTMLElement 등) / Target type for event registration (Window, Document, HTMLElement, etc.)
 *
 * @param {string} eventName - 등록할 이벤트 이름 (예: 'click', 'keydown', 'resize') / Event name to register (e.g., 'click', 'keydown', 'resize')
 *
 * @param {(event: Event) => void} handler - 이벤트 발생 시 실행할 콜백 함수 / Callback function to execute when event occurs
 *
 * @param {T} element - 이벤트를 등록할 대상 (기본값: window) / Target to register event on (default: window)
 *
 * @param {EventListenerOptions} [options] - addEventListener의 옵션 (passive, capture 등) / addEventListener options (passive, capture, etc.)
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
 * useEventListener('click', (e) => {
 *   console.log('클릭됨:', e.target);
 * }, document);
 * ```
 *
 * @example
 * ```tsx
 * // 커스텀 요소에 이벤트 등록 / Register event on custom element
 * const buttonRef = useRef<HTMLButtonElement>(null);
 *
 * useEventListener('click', (e) => {
 *   console.log('버튼 클릭됨');
 * }, buttonRef.current);
 *
 * return <button ref={buttonRef}>클릭하세요</button>;
 * ```
 *
 * @example
 * ```tsx
 * // 옵션과 함께 사용 / Usage with options
 * useEventListener('scroll', (e) => {
 *   console.log('스크롤됨');
 * }, window, { passive: true });
 * ```
 *
 */
export function useEventListener<T extends EventTarget>(
	eventName: string,
	handler: (event: Event) => void,
	element: T,
	options?: EventListenerOptions,
): void {
	const savedHandler = useRef(handler);

	// handler가 변경될 때마다 ref를 최신으로 유지
	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(() => {
		// 입력값 유효성 검사
		if (!eventName || typeof eventName !== 'string') {
			console.warn('useEventListener: eventName must be a non-empty string');
			return;
		}

		if (typeof handler !== 'function') {
			console.warn('useEventListener: handler must be a function');
			return;
		}

		const targetElement = element || window;

		// addEventListener 지원 여부 체크
		if (!targetElement || !targetElement.addEventListener) {
			console.warn('useEventListener: target element does not support addEventListener');
			return;
		}

		const eventListener = (event: Event) => {
			try {
				savedHandler.current(event);
			} catch (error) {
				console.error('useEventListener: Error in event handler:', error);
			}
		};

		targetElement.addEventListener(eventName, eventListener, options);

		return () => {
			targetElement.removeEventListener(eventName, eventListener, options);
		};
	}, [eventName, element, options]);
}

/**
 * 특정 이벤트 타입에 대한 이벤트 리스너를 생성하는 팩토리 함수
 */
function createTypedEventListener<T extends EventTarget, E extends Event>(
	eventName: string,
	handler: (event: E) => void,
	element?: T,
	options?: EventListenerOptions,
): void {
	useEventListener(eventName, (event: Event) => handler(event as E), element, options);
}

/**
 * 키보드 이벤트 리스너
 */
export function useKeyDown(handler: (event: KeyboardEvent) => void, element?: EventTarget): void {
	createTypedEventListener('keydown', handler, element);
}

/**
 * 키보드 이벤트 리스너 (키 업)
 */
export function useKeyUp(handler: (event: KeyboardEvent) => void, element?: EventTarget): void {
	createTypedEventListener('keyup', handler, element);
}

/**
 * 마우스 클릭 이벤트 리스너
 */
export function useClick(handler: (event: MouseEvent) => void, element?: EventTarget): void {
	createTypedEventListener('click', handler, element);
}

/**
 * 마우스 다운 이벤트 리스너
 */
export function useMouseDown(handler: (event: MouseEvent) => void, element?: EventTarget): void {
	createTypedEventListener('mousedown', handler, element);
}

/**
 * 마우스 업 이벤트 리스너
 */
export function useMouseUp(handler: (event: MouseEvent) => void, element?: EventTarget): void {
	createTypedEventListener('mouseup', handler, element);
}

/**
 * 마우스 이동 이벤트 리스너
 */
export function useMouseMove(handler: (event: MouseEvent) => void, element?: EventTarget): void {
	createTypedEventListener('mousemove', handler, element);
}

/**
 * 리사이즈 이벤트 리스너
 */
export function useResize(handler: (event: UIEvent) => void, element?: EventTarget): void {
	createTypedEventListener('resize', handler, element);
}

/**
 * 스크롤 이벤트 리스너
 */
export function useScroll(handler: (event: Event) => void, element?: EventTarget): void {
	createTypedEventListener('scroll', handler, element);
}

/**
 * 터치 시작 이벤트 리스너
 */
export function useTouchStart(handler: (event: TouchEvent) => void, element?: EventTarget): void {
	createTypedEventListener('touchstart', handler, element);
}

/**
 * 터치 이동 이벤트 리스너
 */
export function useTouchMove(handler: (event: TouchEvent) => void, element?: EventTarget): void {
	createTypedEventListener('touchmove', handler, element);
}

/**
 * 터치 종료 이벤트 리스너
 */
export function useTouchEnd(handler: (event: TouchEvent) => void, element?: EventTarget): void {
	createTypedEventListener('touchend', handler, element);
}

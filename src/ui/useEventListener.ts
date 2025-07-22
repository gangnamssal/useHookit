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
			if (typeof console !== 'undefined' && console.warn) {
				console.warn('useEventListener: eventName must be a non-empty string');
			}
			return;
		}

		if (typeof handler !== 'function') {
			if (typeof console !== 'undefined' && console.warn) {
				console.warn('useEventListener: handler must be a function');
			}
			return;
		}

		const targetElement = element || window;

		// SSR 환경 체크
		if (typeof window === 'undefined') {
			if (typeof console !== 'undefined' && console.warn) {
				console.warn('useEventListener: window is not available (SSR environment)');
			}
			return;
		}

		// addEventListener 지원 여부 체크
		if (!targetElement || !targetElement.addEventListener) {
			if (typeof console !== 'undefined' && console.warn) {
				console.warn('useEventListener: target element does not support addEventListener');
			}
			return;
		}

		const eventListener = (event: Event) => {
			try {
				savedHandler.current(event);
			} catch (error) {
				if (typeof console !== 'undefined' && console.error) {
					console.error('useEventListener: Error in event handler:', error);
				}
			}
		};

		try {
			targetElement.addEventListener(eventName, eventListener, options);
		} catch (error) {
			if (typeof console !== 'undefined' && console.error) {
				console.error('useEventListener: Failed to add event listener:', error);
			}
			return;
		}

		return () => {
			try {
				targetElement.removeEventListener(eventName, eventListener, options);
			} catch (error) {
				if (typeof console !== 'undefined' && console.error) {
					console.error('useEventListener: Failed to remove event listener:', error);
				}
			}
		};
	}, [eventName, element, options]);
}

/**
 *
 * 'keydown' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 *
 * @param handler - KeyboardEvent를 인자로 받는 콜백
 *
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 *
 */
export function useKeyDown(handler: (event: KeyboardEvent) => void, element?: EventTarget): void {
	useEventListener('keydown', handler as (event: Event) => void, element);
}

/**
 *
 * 'keyup' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 *
 * @param handler - KeyboardEvent를 인자로 받는 콜백
 *
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 *
 */
export function useKeyUp(handler: (event: KeyboardEvent) => void, element?: EventTarget): void {
	useEventListener('keyup', handler as (event: Event) => void, element);
}

/**
 *
 * 'click' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 *
 * @param handler - MouseEvent를 인자로 받는 콜백
 *
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 *
 */
export function useClick(handler: (event: MouseEvent) => void, element?: EventTarget): void {
	useEventListener('click', handler as (event: Event) => void, element);
}

/**
 *
 * 'mousedown' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 *
 * @param handler - MouseEvent를 인자로 받는 콜백
 *
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 *
 */
export function useMouseDown(handler: (event: MouseEvent) => void, element?: EventTarget): void {
	useEventListener('mousedown', handler as (event: Event) => void, element);
}

/**
 *
 * 'mouseup' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 *
 * @param handler - MouseEvent를 인자로 받는 콜백
 *
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 *
 */
export function useMouseUp(handler: (event: MouseEvent) => void, element?: EventTarget): void {
	useEventListener('mouseup', handler as (event: Event) => void, element);
}

/**
 *
 * 'mousemove' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 *
 * @param handler - MouseEvent를 인자로 받는 콜백
 *
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 *
 */
export function useMouseMove(handler: (event: MouseEvent) => void, element?: EventTarget): void {
	useEventListener('mousemove', handler as (event: Event) => void, element);
}

/**
 *
 * 'resize' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 *
 * @param handler - UIEvent를 인자로 받는 콜백
 *
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 *
 */
export function useResize(handler: (event: UIEvent) => void, element?: EventTarget): void {
	useEventListener('resize', handler as (event: Event) => void, element);
}

/**
 *
 * 'scroll' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 *
 * @param handler - Event를 인자로 받는 콜백
 *
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 *
 */
export function useScroll(handler: (event: Event) => void, element?: EventTarget): void {
	useEventListener('scroll', handler, element);
}

/**
 *
 * 'touchstart' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 *
 * @param handler - TouchEvent를 인자로 받는 콜백
 *
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 *
 */
export function useTouchStart(handler: (event: TouchEvent) => void, element?: EventTarget): void {
	useEventListener('touchstart', handler as (event: Event) => void, element);
}

/**
 *
 * 'touchmove' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 *
 * @param handler - TouchEvent를 인자로 받는 콜백
 *
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 *
 */
export function useTouchMove(handler: (event: TouchEvent) => void, element?: EventTarget): void {
	useEventListener('touchmove', handler as (event: Event) => void, element);
}

/**
 *
 * 'touchend' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 *
 * @param handler - TouchEvent를 인자로 받는 콜백
 *
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 *
 */
export function useTouchEnd(handler: (event: TouchEvent) => void, element?: EventTarget): void {
	useEventListener('touchend', handler as (event: Event) => void, element);
}

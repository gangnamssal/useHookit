import { useEffect, useRef } from 'react';

type EventTarget = Window | Document | HTMLElement | Element | null | undefined;
type EventListenerOptions = boolean | AddEventListenerOptions;

/**
 * 지정한 DOM 요소(또는 window)에 이벤트 리스너를 등록하는 커스텀 훅입니다.
 * handler가 변경되어도 최신 핸들러가 항상 호출됩니다.
 *
 * @template T - 이벤트를 등록할 대상 타입 (Window, Document, HTMLElement 등)
 * @param {string} eventName - 등록할 이벤트 이름 (예: 'click', 'keydown')
 * @param {(event: Event) => void} handler - 이벤트 발생 시 실행할 콜백 함수
 * @param {T} element - 이벤트를 등록할 대상 (기본값: window)
 * @param {EventListenerOptions} [options] - addEventListener의 옵션
 *
 * @example
 * useEventListener('click', (e) => { ... }, document);
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
		const targetElement = element || window;

		if (!targetElement || !targetElement.addEventListener) {
			return;
		}

		const eventListener = (event: Event) => {
			savedHandler.current(event);
		};

		targetElement.addEventListener(eventName, eventListener, options);

		return () => {
			targetElement.removeEventListener(eventName, eventListener, options);
		};
	}, [eventName, element, options]);
}

/**
 * 'keydown' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 * @param handler - KeyboardEvent를 인자로 받는 콜백
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 */
export function useKeyDown(handler: (event: KeyboardEvent) => void, element?: EventTarget): void {
	useEventListener('keydown', handler as (event: Event) => void, element);
}

/**
 * 'keyup' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 * @param handler - KeyboardEvent를 인자로 받는 콜백
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 */
export function useKeyUp(handler: (event: KeyboardEvent) => void, element?: EventTarget): void {
	useEventListener('keyup', handler as (event: Event) => void, element);
}

/**
 * 'click' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 * @param handler - MouseEvent를 인자로 받는 콜백
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 */
export function useClick(handler: (event: MouseEvent) => void, element?: EventTarget): void {
	useEventListener('click', handler as (event: Event) => void, element);
}

/**
 * 'mousedown' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 * @param handler - MouseEvent를 인자로 받는 콜백
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 */
export function useMouseDown(handler: (event: MouseEvent) => void, element?: EventTarget): void {
	useEventListener('mousedown', handler as (event: Event) => void, element);
}

/**
 * 'mouseup' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 * @param handler - MouseEvent를 인자로 받는 콜백
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 */
export function useMouseUp(handler: (event: MouseEvent) => void, element?: EventTarget): void {
	useEventListener('mouseup', handler as (event: Event) => void, element);
}

/**
 * 'mousemove' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 * @param handler - MouseEvent를 인자로 받는 콜백
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 */
export function useMouseMove(handler: (event: MouseEvent) => void, element?: EventTarget): void {
	useEventListener('mousemove', handler as (event: Event) => void, element);
}

/**
 * 'resize' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 * @param handler - UIEvent를 인자로 받는 콜백
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 */
export function useResize(handler: (event: UIEvent) => void, element?: EventTarget): void {
	useEventListener('resize', handler as (event: Event) => void, element);
}

/**
 * 'scroll' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 * @param handler - Event를 인자로 받는 콜백
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 */
export function useScroll(handler: (event: Event) => void, element?: EventTarget): void {
	useEventListener('scroll', handler, element);
}

/**
 * 'touchstart' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 * @param handler - TouchEvent를 인자로 받는 콜백
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 */
export function useTouchStart(handler: (event: TouchEvent) => void, element?: EventTarget): void {
	useEventListener('touchstart', handler as (event: Event) => void, element);
}

/**
 * 'touchmove' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 * @param handler - TouchEvent를 인자로 받는 콜백
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 */
export function useTouchMove(handler: (event: TouchEvent) => void, element?: EventTarget): void {
	useEventListener('touchmove', handler as (event: Event) => void, element);
}

/**
 * 'touchend' 이벤트에 타입 안전하게 리스너를 등록하는 훅
 * @param handler - TouchEvent를 인자로 받는 콜백
 * @param element - 이벤트를 등록할 대상 (기본값: window)
 */
export function useTouchEnd(handler: (event: TouchEvent) => void, element?: EventTarget): void {
	useEventListener('touchend', handler as (event: Event) => void, element);
}

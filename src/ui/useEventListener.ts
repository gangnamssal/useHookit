import { useEffect, useRef } from 'react';
import { useIsMounted } from '../lifecycle/useIsMounted';

type EventTarget = Window | Document | HTMLElement | Element | null | undefined;
type EventListenerOptions = boolean | AddEventListenerOptions;

/**
 * A custom hook that registers event listeners on specified DOM elements (or window).
 *
 * Even when the handler changes, the latest handler is always called.
 *
 * @template T - Target type for event registration (Window, Document, HTMLElement, etc.)
 *
 * @param {string} eventName - Event name to register (e.g., 'click', 'keydown', 'resize')
 *
 * @param {(event: Event) => void} handler - Callback function to execute when event occurs
 *
 * @param {T} [element] - Target to register event on (default: window)
 *
 * @param {EventListenerOptions} [options] - addEventListener options (passive, capture, etc.)
 *
 * @example
 * ```tsx
 * // Basic usage
 * useEventListener('click', (e) => {
 *   console.log('Clicked:', e.target);
 * }, document);
 * ```
 *
 * @example
 * ```tsx
 * // Register event on custom element
 * const buttonRef = useRef<HTMLButtonElement>(null);
 *
 * useEventListener('click', (e) => {
 *   console.log('Button clicked');
 * }, buttonRef.current);
 *
 * return <button ref={buttonRef}>Click me</button>;
 * ```
 *
 * @example
 * ```tsx
 * // Usage with options
 * useEventListener('scroll', (e) => {
 *   console.log('Scrolled');
 * }, window, { passive: true });
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/ui-useeventlistener--docs
 */
export function useEventListener<T extends EventTarget>(
	eventName: string,
	handler: (event: Event) => void,
	element?: T,
	options?: EventListenerOptions,
): void {
	const savedHandler = useRef(handler);

	const isMounted = useIsMounted();

	// Keep ref up to date when handler changes
	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(() => {
		if (!isMounted) return;

		// Input validation
		if (!eventName || typeof eventName !== 'string') {
			console.warn('useEventListener: eventName must be a non-empty string');
			return;
		}

		if (typeof handler !== 'function') {
			console.warn('useEventListener: handler must be a function');
			return;
		}

		const targetElement = element || window;

		// Check if addEventListener is supported
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
	}, [eventName, element, options, isMounted]);
}

/**
 * Factory function to create typed event listeners
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
 * Keyboard event listener
 *
 * @link https://use-hookit.vercel.app/?path=/docs/ui-useeventlistener--docs
 */
export function useKeyDown(handler: (event: KeyboardEvent) => void, element?: EventTarget): void {
	createTypedEventListener('keydown', handler, element);
}

/**
 * Keyboard event listener (key up)
 *
 * @link https://use-hookit.vercel.app/?path=/docs/ui-useeventlistener--docs
 */
export function useKeyUp(handler: (event: KeyboardEvent) => void, element?: EventTarget): void {
	createTypedEventListener('keyup', handler, element);
}

/**
 * Mouse click event listener
 *
 * @link https://use-hookit.vercel.app/?path=/docs/ui-useeventlistener--docs
 */
export function useClick(handler: (event: MouseEvent) => void, element?: EventTarget): void {
	createTypedEventListener('click', handler, element);
}

/**
 * Mouse down event listener
 *
 * @link https://use-hookit.vercel.app/?path=/docs/ui-useeventlistener--docs
 */
export function useMouseDown(handler: (event: MouseEvent) => void, element?: EventTarget): void {
	createTypedEventListener('mousedown', handler, element);
}

/**
 * Mouse up event listener
 *
 * @link https://use-hookit.vercel.app/?path=/docs/ui-useeventlistener--docs
 */
export function useMouseUp(handler: (event: MouseEvent) => void, element?: EventTarget): void {
	createTypedEventListener('mouseup', handler, element);
}

/**
 * Mouse move event listener
 *
 * @link https://use-hookit.vercel.app/?path=/docs/ui-useeventlistener--docs
 */
export function useMouseMove(handler: (event: MouseEvent) => void, element?: EventTarget): void {
	createTypedEventListener('mousemove', handler, element);
}

/**
 * Resize event listener
 *
 * @link https://use-hookit.vercel.app/?path=/docs/ui-useeventlistener--docs
 */
export function useResize(handler: (event: UIEvent) => void, element?: EventTarget): void {
	createTypedEventListener('resize', handler, element);
}

/**
 * Scroll event listener
 *
 * @link https://use-hookit.vercel.app/?path=/docs/ui-useeventlistener--docs
 */
export function useScroll(handler: (event: Event) => void, element?: EventTarget): void {
	createTypedEventListener('scroll', handler, element);
}

/**
 * Touch start event listener
 *
 * @link https://use-hookit.vercel.app/?path=/docs/ui-useeventlistener--docs
 */
export function useTouchStart(handler: (event: TouchEvent) => void, element?: EventTarget): void {
	createTypedEventListener('touchstart', handler, element);
}

/**
 * Touch move event listener
 *
 * @link https://use-hookit.vercel.app/?path=/docs/ui-useeventlistener--docs
 */
export function useTouchMove(handler: (event: TouchEvent) => void, element?: EventTarget): void {
	createTypedEventListener('touchmove', handler, element);
}

/**
 * Touch end event listener
 *
 * @link https://use-hookit.vercel.app/?path=/docs/ui-useeventlistener--docs
 */
export function useTouchEnd(handler: (event: TouchEvent) => void, element?: EventTarget): void {
	createTypedEventListener('touchend', handler, element);
}

import { useEffect, useRef } from 'react';

/**
 * A custom hook that executes a callback when clicking outside a specified DOM element.
 *
 * @template T - HTMLElement or its subtype
 *
 * @param {() => void} callback - Callback function to execute on outside click
 *
 * @param {Object} [options] - Options object
 *
 * @param {boolean} [options.enabled] - Whether the hook is enabled (default: true)
 *
 * @param {'mousedown' | 'click' | 'touchstart'} [options.eventType] - Event type to detect (default: 'mousedown')
 *
 * @returns {React.RefObject<T>} ref - Ref to assign to the DOM element to detect
 *
 * @example
 * ```tsx
 * // Basic usage
 * const ref = useClickOutside(() => setOpen(false));
 *
 * return (
 *   <div ref={ref}>
 *     Modal content
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Custom options usage
 * const ref = useClickOutside(() => {
 *   console.log('Clicked outside');
 * }, {
 *   enabled: isModalOpen,
 *   eventType: 'click'
 * });
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/ui-useclickoutside--docs
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
	callback: () => void,
	options: {
		enabled?: boolean;
		eventType?: 'mousedown' | 'click' | 'touchstart';
	} = {},
): React.RefObject<T> {
	const { enabled = true, eventType = 'mousedown' } = options;
	const ref = useRef<T>(null);

	useEffect(() => {
		// Check if document is supported
		if (!document || !document.addEventListener) {
			console.warn(
				'useClickOutside: document is not available or does not support addEventListener',
			);
			return;
		}

		// Validate event type
		if (!['mousedown', 'click', 'touchstart'].includes(eventType)) {
			console.warn('useClickOutside: eventType must be one of: mousedown, click, touchstart');
			return;
		}

		if (!enabled) return;

		const handleClickOutside = (event: Event) => {
			const target = event.target as Node;

			if (ref.current && !ref.current.contains(target)) {
				callback();
			}
		};

		try {
			document.addEventListener(eventType, handleClickOutside);
			return () => {
				document.removeEventListener(eventType, handleClickOutside);
			};
		} catch (error) {
			console.error('useClickOutside: Failed to add event listener:', error);
		}
	}, [callback, enabled, eventType]);

	return ref;
}

/**
 * A custom hook that executes a callback when clicking outside multiple DOM elements.
 *
 * @template T - HTMLElement or its subtype
 *
 * @param {() => void} callback - Callback function to execute on outside click
 *
 * @param {React.RefObject<T>[]} refs - Array of refs for multiple DOM elements to detect
 *
 * @param {Object} [options] - Options object
 *
 * @param {boolean} [options.enabled] - Whether the hook is enabled (default: true)
 *
 * @param {'mousedown' | 'click' | 'touchstart'} [options.eventType] - Event type to detect (default: 'mousedown')
 *
 * @example
 * ```tsx
 * // Basic usage
 * const ref1 = useRef(null);
 * const ref2 = useRef(null);
 *
 * useClickOutsideMultiple(() => setOpen(false), [ref1, ref2]);
 *
 * return (
 *   <>
 *     <div ref={ref1}>First element</div>
 *     <div ref={ref2}>Second element</div>
 *   </>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Custom options usage
 * const refs = [ref1, ref2, ref3];
 *
 * useClickOutsideMultiple(() => {
 *   console.log('Clicked outside all elements');
 * }, refs, {
 *   enabled: isActive,
 *   eventType: 'click'
 * });
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/ui-useclickoutside--docs#related-hooks
 */
export function useClickOutsideMultiple<T extends HTMLElement = HTMLElement>(
	callback: () => void,
	refs: React.RefObject<T>[],
	options: {
		enabled?: boolean;
		eventType?: 'mousedown' | 'click' | 'touchstart';
	} = {},
): void {
	const { enabled = true, eventType = 'mousedown' } = options;

	useEffect(() => {
		// Check SSR environment
		if (typeof window === 'undefined') {
			if (typeof console !== 'undefined' && console.warn) {
				console.warn('useClickOutsideMultiple: window is not available (SSR environment)');
			}
			return;
		}

		// Check if document is supported
		if (!document || !document.addEventListener) {
			if (typeof console !== 'undefined' && console.warn) {
				console.warn(
					'useClickOutsideMultiple: document is not available or does not support addEventListener',
				);
			}
			return;
		}

		// Validate event type
		if (!['mousedown', 'click', 'touchstart'].includes(eventType)) {
			if (typeof console !== 'undefined' && console.warn) {
				console.warn(
					'useClickOutsideMultiple: eventType must be one of: mousedown, click, touchstart',
				);
			}
			return;
		}

		// Validate refs array
		if (!Array.isArray(refs) || refs.length === 0) {
			if (typeof console !== 'undefined' && console.warn) {
				console.warn('useClickOutsideMultiple: refs must be a non-empty array');
			}
			return;
		}

		if (!enabled) return;

		const handleClickOutside = (event: Event) => {
			const target = event.target as Node;

			const isOutsideAll = refs.every((ref) => !ref.current || !ref.current.contains(target));

			if (isOutsideAll) {
				callback();
			}
		};

		try {
			document.addEventListener(eventType, handleClickOutside);
			return () => {
				document.removeEventListener(eventType, handleClickOutside);
			};
		} catch (error) {
			if (typeof console !== 'undefined' && console.error) {
				console.error('useClickOutsideMultiple: Failed to add event listener:', error);
			}
		}
	}, [callback, refs, enabled, eventType]);
}

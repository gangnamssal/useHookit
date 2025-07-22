import { useEffect, useRef } from 'react';

/**
 *
 * 지정한 DOM 요소 외부를 클릭했을 때 콜백을 실행하는 커스텀 훅입니다.
 *
 * A custom hook that executes a callback when clicking outside a specified DOM element.
 *
 * @template T - HTMLElement 또는 그 하위 타입 / HTMLElement or its subtype
 *
 * @param {() => void} callback - 외부 클릭 시 실행할 콜백 함수 / Callback function to execute on outside click
 *
 * @param {Object} options - 옵션 객체 / Options object
 *
 * @param {boolean} options.enabled - 훅 활성화 여부 (기본값: true) / Whether the hook is enabled (default: true)
 *
 * @param {'mousedown' | 'click' | 'touchstart'} options.eventType - 감지할 이벤트 타입 (기본값: 'mousedown') / Event type to detect (default: 'mousedown')
 *
 * @returns {React.RefObject<T>} 감지할 DOM 요소에 할당할 ref / Ref to assign to the DOM element to detect
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
 * const ref = useClickOutside(() => setOpen(false));
 *
 * return (
 *   <div ref={ref}>
 *     모달 내용
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // 커스텀 옵션 사용 / Custom options usage
 * const ref = useClickOutside(() => {
 *   console.log('외부 클릭됨');
 * }, {
 *   enabled: isModalOpen,
 *   eventType: 'click'
 * });
 * ```
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
		// document 지원 여부 체크
		if (!document || !document.addEventListener) {
			console.warn(
				'useClickOutside: document is not available or does not support addEventListener',
			);
			return;
		}

		// 이벤트 타입 유효성 검사
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
 *
 * 여러 개의 DOM 요소 외부를 클릭했을 때 콜백을 실행하는 커스텀 훅입니다.
 *
 * A custom hook that executes a callback when clicking outside multiple DOM elements.
 *
 * @template T - HTMLElement 또는 그 하위 타입 / HTMLElement or its subtype
 *
 * @param {() => void} callback - 외부 클릭 시 실행할 콜백 함수 / Callback function to execute on outside click
 *
 * @param {React.RefObject<T>[]} refs - 감지할 여러 DOM 요소의 ref 배열 / Array of refs for multiple DOM elements to detect
 *
 * @param {Object} options - 옵션 객체 / Options object
 *
 * @param {boolean} options.enabled - 훅 활성화 여부 (기본값: true) / Whether the hook is enabled (default: true)
 *
 * @param {'mousedown' | 'click' | 'touchstart'} options.eventType - 감지할 이벤트 타입 (기본값: 'mousedown') / Event type to detect (default: 'mousedown')
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
 * const ref1 = useRef(null);
 * const ref2 = useRef(null);
 *
 * useClickOutsideMultiple(() => setOpen(false), [ref1, ref2]);
 *
 * return (
 *   <>
 *     <div ref={ref1}>첫 번째 요소</div>
 *     <div ref={ref2}>두 번째 요소</div>
 *   </>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // 커스텀 옵션 사용 / Custom options usage
 * const refs = [ref1, ref2, ref3];
 *
 * useClickOutsideMultiple(() => {
 *   console.log('모든 요소 외부 클릭됨');
 * }, refs, {
 *   enabled: isActive,
 *   eventType: 'click'
 * });
 * ```
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
		// SSR 환경 체크
		if (typeof window === 'undefined') {
			if (typeof console !== 'undefined' && console.warn) {
				console.warn('useClickOutsideMultiple: window is not available (SSR environment)');
			}
			return;
		}

		// document 지원 여부 체크
		if (!document || !document.addEventListener) {
			if (typeof console !== 'undefined' && console.warn) {
				console.warn(
					'useClickOutsideMultiple: document is not available or does not support addEventListener',
				);
			}
			return;
		}

		// 이벤트 타입 유효성 검사
		if (!['mousedown', 'click', 'touchstart'].includes(eventType)) {
			if (typeof console !== 'undefined' && console.warn) {
				console.warn(
					'useClickOutsideMultiple: eventType must be one of: mousedown, click, touchstart',
				);
			}
			return;
		}

		// refs 배열 유효성 검사
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

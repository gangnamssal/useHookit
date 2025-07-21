import { useEffect, useRef } from 'react';

/**
 * 지정한 DOM 요소 외부를 클릭했을 때 콜백을 실행하는 커스텀 훅입니다.
 *
 * @template T - HTMLElement 또는 그 하위 타입
 * @param callback 외부 클릭 시 실행할 콜백 함수
 * @param options.enabled 훅 활성화 여부 (기본값: true)
 * @param options.eventType 감지할 이벤트 타입 ('mousedown' | 'click' | 'touchstart', 기본값: 'mousedown')
 * @returns React.RefObject<T> - 감지할 DOM 요소에 할당할 ref
 *
 * @example
 * const ref = useClickOutside(() => setOpen(false));
 * return <div ref={ref}>...</div>;
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
		if (!enabled) return;

		const handleClickOutside = (event: Event) => {
			const target = event.target as Node;

			if (ref.current && !ref.current.contains(target)) {
				callback();
			}
		};

		document.addEventListener(eventType, handleClickOutside);

		return () => {
			document.removeEventListener(eventType, handleClickOutside);
		};
	}, [callback, enabled, eventType]);

	return ref;
}

/**
 * 여러 개의 DOM 요소 외부를 클릭했을 때 콜백을 실행하는 커스텀 훅입니다.
 *
 * @template T - HTMLElement 또는 그 하위 타입
 * @param callback 외부 클릭 시 실행할 콜백 함수
 * @param refs 감지할 여러 DOM 요소의 ref 배열
 * @param options.enabled 훅 활성화 여부 (기본값: true)
 * @param options.eventType 감지할 이벤트 타입 ('mousedown' | 'click' | 'touchstart', 기본값: 'mousedown')
 *
 * @example
 * const ref1 = useRef(null);
 * const ref2 = useRef(null);
 * useClickOutsideMultiple(() => setOpen(false), [ref1, ref2]);
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
		if (!enabled) return;

		const handleClickOutside = (event: Event) => {
			const target = event.target as Node;

			const isOutsideAll = refs.every((ref) => !ref.current || !ref.current.contains(target));

			if (isOutsideAll) {
				callback();
			}
		};

		document.addEventListener(eventType, handleClickOutside);

		return () => {
			document.removeEventListener(eventType, handleClickOutside);
		};
	}, [callback, enabled, eventType, refs]);
}

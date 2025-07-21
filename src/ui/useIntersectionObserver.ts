import { useEffect, useRef, useState, useCallback } from 'react';

export interface IntersectionObserverOptions {
	/** 루트 요소 (기본값: null, 브라우저 뷰포트) */
	root?: Element | null;
	/** 루트 요소의 마진 (기본값: '0px') */
	rootMargin?: string;
	/** 임계값 배열 (기본값: [0]) */
	threshold?: number | number[];
	/** 초기 상태 (기본값: false) */
	initialIsIntersecting?: boolean;
}

export interface UseIntersectionObserverReturn {
	/** 현재 교차 상태 */
	isIntersecting: boolean;
	/** 교차 비율 (0-1) */
	intersectionRatio: number;
	/** 교차 영역의 경계 사각형 */
	intersectionRect: DOMRectReadOnly | null;
	/** 대상 요소의 경계 사각형 */
	boundingClientRect: DOMRectReadOnly | null;
	/** 루트 요소의 경계 사각형 */
	rootBounds: DOMRectReadOnly | null;
	/** 대상 요소에 대한 ref */
	ref: (node: Element | null) => void;
	/** Observer 인스턴스 */
	observer: IntersectionObserver | null;
}

/**
 * Intersection Observer API를 사용하여 요소의 가시성을 감지하는 훅
 *
 * @param options - Intersection Observer 옵션
 * @returns 교차 상태와 관련 정보를 포함한 객체
 *
 * @example
 * ```tsx
 * const { isIntersecting, ref } = useIntersectionObserver({
 *   threshold: 0.5,
 *   rootMargin: '50px'
 * });
 *
 * return (
 *   <div ref={ref}>
 *     {isIntersecting ? '보임!' : '안 보임'}
 *   </div>
 * );
 * ```
 */
export function useIntersectionObserver(
	options: IntersectionObserverOptions = {},
): UseIntersectionObserverReturn {
	const { root = null, rootMargin = '0px', threshold = 0, initialIsIntersecting = false } = options;

	const [state, setState] = useState<{
		isIntersecting: boolean;
		intersectionRatio: number;
		intersectionRect: DOMRectReadOnly | null;
		boundingClientRect: DOMRectReadOnly | null;
		rootBounds: DOMRectReadOnly | null;
	}>({
		isIntersecting: initialIsIntersecting,
		intersectionRatio: 0,
		intersectionRect: null,
		boundingClientRect: null,
		rootBounds: null,
	});

	const [observer, setObserver] = useState<IntersectionObserver | null>(null);
	const elementRef = useRef<Element | null>(null);

	// Intersection Observer 콜백
	const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
		const entry = entries[0];
		if (entry) {
			setState({
				isIntersecting: entry.isIntersecting,
				intersectionRatio: entry.intersectionRatio,
				intersectionRect: entry.intersectionRect,
				boundingClientRect: entry.boundingClientRect,
				rootBounds: entry.rootBounds,
			});
		}
	}, []);

	// Observer 생성
	useEffect(() => {
		if (typeof window === 'undefined' || !window.IntersectionObserver) {
			console.warn('IntersectionObserver is not supported in this environment');
			return;
		}

		const observer = new IntersectionObserver(handleIntersection, {
			root,
			rootMargin,
			threshold,
		});

		setObserver(observer);

		// 현재 요소가 있다면 observe 시작
		if (elementRef.current) {
			observer.observe(elementRef.current);
		}

		return () => {
			observer.disconnect();
		};
	}, [root, rootMargin, threshold, handleIntersection]);

	// ref 콜백
	const ref = useCallback(
		(node: Element | null) => {
			elementRef.current = node;

			if (observer) {
				// 기존 요소 관찰 해제
				observer.disconnect();

				// 새 요소 관찰 시작
				if (node) {
					observer.observe(node);
				}
			}
		},
		[observer],
	);

	return {
		...state,
		ref,
		observer,
	};
}

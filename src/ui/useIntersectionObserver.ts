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
 * A hook that detects element visibility using the Intersection Observer API
 *
 * @param {IntersectionObserverOptions} options - Intersection Observer 옵션 / Intersection Observer options
 *
 * @param {Element | null} options.root - 루트 요소 (기본값: null, 브라우저 뷰포트) / Root element (default: null, browser viewport)
 *
 * @param {string} options.rootMargin - 루트 요소의 마진 (기본값: '0px') / Root element margin (default: '0px')
 *
 * @param {number | number[]} options.threshold - 임계값 배열 (기본값: [0]) / Threshold array (default: [0])
 *
 * @param {boolean} options.initialIsIntersecting - 초기 상태 (기본값: false) / Initial state (default: false)
 *
 * @returns {UseIntersectionObserverReturn} 교차 상태와 관련 정보를 포함한 객체 / Object containing intersection state and related information
 *
 * @returns {boolean} isIntersecting - 현재 교차 상태 / Current intersection state
 *
 * @returns {number} intersectionRatio - 교차 비율 (0-1) / Intersection ratio (0-1)
 *
 * @returns {DOMRectReadOnly | null} intersectionRect - 교차 영역의 경계 사각형 / Intersection area bounding rectangle
 *
 * @returns {DOMRectReadOnly | null} boundingClientRect - 대상 요소의 경계 사각형 / Target element bounding rectangle
 *
 * @returns {DOMRectReadOnly | null} rootBounds - 루트 요소의 경계 사각형 / Root element bounding rectangle
 *
 * @returns {(node: Element | null) => void} ref - 대상 요소에 대한 ref / Ref for target element
 *
 * @returns {IntersectionObserver | null} observer - Observer 인스턴스 / Observer instance
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
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
 *
 * @example
 * ```tsx
 * // 무한 스크롤 / Infinite scroll
 * const { isIntersecting, ref } = useIntersectionObserver({
 *   threshold: 0.1,
 *   rootMargin: '100px'
 * });
 *
 * useEffect(() => {
 *   if (isIntersecting) {
 *     loadMoreData();
 *   }
 * }, [isIntersecting]);
 *
 * return (
 *   <div ref={ref}>
 *     로딩 중...
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
		// IntersectionObserver 지원 여부 체크
		if (!window.IntersectionObserver) {
			console.warn(
				'useIntersectionObserver: IntersectionObserver is not supported in this browser',
			);
			return;
		}

		// 옵션 유효성 검사
		if (
			threshold !== undefined &&
			(Array.isArray(threshold)
				? threshold.some((t) => t < 0 || t > 1)
				: threshold < 0 || threshold > 1)
		) {
			console.warn('useIntersectionObserver: threshold must be between 0 and 1');
			return;
		}

		try {
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
		} catch (error) {
			console.error('useIntersectionObserver: Failed to create IntersectionObserver:', error);
		}
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

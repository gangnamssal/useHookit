import { useState, useEffect, useRef } from 'react';

export interface WindowSize {
	width: number;
	height: number;
}

export interface UseWindowSizeOptions {
	/** 초기 윈도우 크기 (기본값: { width: 0, height: 0 }) */
	initialSize?: WindowSize;
	/** 리사이즈 이벤트의 디바운스 시간 (ms, 기본값: 100) */
	debounceMs?: number;
	/** 리사이즈 이벤트의 throttle 시간 (ms, 기본값: 0 - throttle 사용 안함) */
	throttleMs?: number;
	/** 리사이즈 이벤트 리스너 옵션 (기본값: { passive: true }) */
	listenerOptions?: AddEventListenerOptions;
}

/**
 * 브라우저 윈도우의 크기를 실시간으로 감지하는 훅
 *
 * A hook that detects browser window size in real-time
 *
 * @param options - 윈도우 크기 감지 옵션 / Window size detection options
 *
 * @param options.initialSize - 초기 윈도우 크기 (SSR 환경에서 사용, 기본값: { width: 0, height: 0 }) / Initial window size (used in SSR environment, default: { width: 0, height: 0 })
 *
 * @param options.debounceMs - 리사이즈 이벤트의 디바운스 시간 (ms, 기본값: 100) / Debounce time for resize events (ms, default: 100)
 *
 * @param options.throttleMs - 리사이즈 이벤트의 throttle 시간 (ms, 기본값: 0 - throttle 사용 안함) / Throttle time for resize events (ms, default: 0 - throttle disabled)
 *
 * @param options.listenerOptions - 리사이즈 이벤트 리스너 옵션 (기본값: { passive: true }) / Resize event listener options (default: { passive: true })
 *
 * @returns 현재 윈도우 크기와 관련 정보 / Current window size and related information
 *
 * @returns {number} width - 현재 윈도우 너비 / Current window width
 *
 * @returns {number} height - 현재 윈도우 높이 / Current window height
 *
 * @returns {boolean} isMobile - 모바일 크기 여부 (≤ 767px) / Whether it's mobile size (≤ 767px)
 *
 * @returns {boolean} isTablet - 태블릿 크기 여부 (768px - 1023px) / Whether it's tablet size (768px - 1023px)
 *
 * @returns {boolean} isDesktop - 데스크탑 크기 여부 (≥ 1024px) / Whether it's desktop size (≥ 1024px)
 *
 * @returns {boolean} isLargeScreen - 대형 화면 여부 (≥ 1440px) / Whether it's large screen (≥ 1440px)
 *
 * @returns {'portrait' | 'landscape'} orientation - 화면 방향 / Screen orientation
 *
 * @example
 * ```tsx
 * const { width, height, isMobile, isTablet, isDesktop } = useWindowSize();
 *
 * return (
 *   <div>
 *     윈도우 크기: {width} x {height}
 *     {isMobile && <MobileLayout />}
 *     {isDesktop && <DesktopLayout />}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // 커스텀 옵션 사용 / Custom options usage
 * const { width, height } = useWindowSize({
 *   debounceMs: 200,
 *   throttleMs: 50,
 *   listenerOptions: { passive: false }
 * });
 * ```
 */
export function useWindowSize(options: UseWindowSizeOptions = {}): WindowSize & {
	isMobile: boolean;
	isTablet: boolean;
	isDesktop: boolean;
	isLargeScreen: boolean;
	orientation: 'portrait' | 'landscape';
} {
	const {
		initialSize = { width: 0, height: 0 },
		debounceMs = 100,
		throttleMs = 0,
		listenerOptions = { passive: true },
	} = options;

	const [windowSize, setWindowSize] = useState<WindowSize>(() => {
		if (typeof window === 'undefined') {
			return initialSize;
		}

		return {
			width: window.innerWidth,
			height: window.innerHeight,
		};
	});

	const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const lastRunRef = useRef<number>(0);
	const throttleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		// SSR 환경 체크
		if (typeof window === 'undefined') {
			// 테스트 환경에서는 경고를 출력하지 않음
			if (typeof console !== 'undefined' && console.warn) {
				console.warn('useWindowSize: window is not available (SSR environment)');
			}
			return;
		}

		// 옵션 유효성 검사
		if (debounceMs < 0) {
			if (typeof console !== 'undefined' && console.warn) {
				console.warn('useWindowSize: debounceMs must be non-negative');
			}
			return;
		}

		if (throttleMs < 0) {
			if (typeof console !== 'undefined' && console.warn) {
				console.warn('useWindowSize: throttleMs must be non-negative');
			}
			return;
		}

		const updateWindowSize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		const debouncedUpdate = () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}

			debounceTimerRef.current = setTimeout(updateWindowSize, debounceMs);
		};

		const throttledUpdate = () => {
			const now = Date.now();

			if (lastRunRef.current && now - lastRunRef.current < throttleMs) {
				if (throttleTimerRef.current) {
					clearTimeout(throttleTimerRef.current);
				}

				throttleTimerRef.current = setTimeout(() => {
					lastRunRef.current = now;
					updateWindowSize();
				}, throttleMs - (now - lastRunRef.current));
			} else {
				lastRunRef.current = now;
				updateWindowSize();
			}
		};

		const handleResize = () => {
			if (throttleMs > 0) {
				throttledUpdate();
			} else if (debounceMs > 0) {
				debouncedUpdate();
			} else {
				updateWindowSize();
			}
		};

		try {
			updateWindowSize();
			window.addEventListener('resize', handleResize, listenerOptions);

			return () => {
				window.removeEventListener('resize', handleResize, listenerOptions);
				if (debounceTimerRef.current) {
					clearTimeout(debounceTimerRef.current);
				}
				if (throttleTimerRef.current) {
					clearTimeout(throttleTimerRef.current);
				}
			};
		} catch (error) {
			if (typeof console !== 'undefined' && console.error) {
				console.error('useWindowSize: Failed to add resize event listener:', error);
			}
		}
	}, [debounceMs, throttleMs]);

	const { width, height } = windowSize;

	return {
		...windowSize,
		isMobile: width <= 767,
		isTablet: width >= 768 && width <= 1023,
		isDesktop: width >= 1024,
		isLargeScreen: width >= 1440,
		orientation: width > height ? 'landscape' : 'portrait',
	};
}

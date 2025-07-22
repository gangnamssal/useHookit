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
 * @param options - 윈도우 크기 감지 옵션
 * @returns 현재 윈도우 크기와 관련 정보
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
		if (typeof window === 'undefined') {
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

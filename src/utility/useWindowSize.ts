import { useState, useEffect, useRef, useMemo } from 'react';

export interface WindowSize {
	width: number;
	height: number;
}

export interface UseWindowSizeOptions {
	/** Initial window size (default: { width: 0, height: 0 }) */
	initialSize?: WindowSize;
	/** Debounce time for resize events (ms, default: 100) */
	debounceMs?: number;
	/** Resize event listener options (default: { passive: true }) */
	listenerOptions?: AddEventListenerOptions;
}

/**
 * A hook that detects browser window size in real-time
 *
 * @param options - Window size detection options
 * @param options.initialSize - Initial window size (used in SSR environment, default: { width: 0, height: 0 })
 * @param options.debounceMs - Debounce time for resize events (ms, default: 100)
 * @param options.throttleMs - Throttle time for resize events (ms, default: 0 - throttle disabled)
 * @param options.listenerOptions - Resize event listener options (default: { passive: true })
 *
 * @returns Current window size and related information
 * @returns {number} width - Current window width
 * @returns {number} height - Current window height
 * @returns {boolean} isMobile - Whether it's mobile size (≤ 767px)
 * @returns {boolean} isTablet - Whether it's tablet size (768px - 1023px)
 * @returns {boolean} isDesktop - Whether it's desktop size (≥ 1024px)
 * @returns {boolean} isLargeScreen - Whether it's large screen (≥ 1440px)
 * @returns {'portrait' | 'landscape'} orientation - Screen orientation
 *
 * @example
 * ```tsx
 * const { width, height, isMobile, isTablet, isDesktop } = useWindowSize();
 *
 * return (
 *   <div>
 *     Window size: {width} x {height}
 *     {isMobile && <MobileLayout />}
 *     {isDesktop && <DesktopLayout />}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Custom options usage
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

	// 브레이크포인트 계산을 메모이제이션
	const breakpoints = useMemo(() => {
		const { width } = windowSize;
		return {
			isMobile: width <= 767,
			isTablet: width >= 768 && width <= 1023,
			isDesktop: width >= 1024,
			isLargeScreen: width >= 1440,
			orientation: (width > windowSize.height ? 'landscape' : 'portrait') as
				| 'portrait'
				| 'landscape',
		};
	}, [windowSize.width, windowSize.height]);

	useEffect(() => {
		// SSR 환경 체크
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

		const handleResize = debounceMs > 0 ? debouncedUpdate : updateWindowSize;

		window.addEventListener('resize', handleResize, listenerOptions);

		return () => {
			window.removeEventListener('resize', handleResize, listenerOptions);
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, [debounceMs, listenerOptions]);

	return {
		...windowSize,
		...breakpoints,
	};
}

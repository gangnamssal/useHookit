import { useState, useEffect } from 'react';

/**
 * 주어진 미디어 쿼리 문자열에 대한 일치 여부를 반환하는 커스텀 훅입니다.
 *
 * @param {string} query - CSS 미디어 쿼리 문자열 (예: '(max-width: 767px)')
 * @returns {boolean} 미디어 쿼리가 현재 환경에 일치하면 true, 아니면 false
 * @example
 * const isMobile = useMediaQuery('(max-width: 767px)');
 */
export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const media = window.matchMedia(query);

		// 초기값 설정
		setMatches(media.matches);

		// 이벤트 리스너 생성
		const listener = (event: MediaQueryListEvent) => {
			setMatches(event.matches);
		};

		// 이벤트 리스너 등록
		media.addEventListener('change', listener);

		// 클린업
		return () => {
			media.removeEventListener('change', listener);
		};
	}, [query]);

	return matches;
}

/**
 * 모바일 화면 여부를 반환합니다. (max-width: 767px)
 * @returns {boolean}
 */
export function useIsMobile(): boolean {
	return useMediaQuery('(max-width: 767px)');
}

/**
 * 태블릿 화면 여부를 반환합니다. (min-width: 768px) and (max-width: 1023px)
 * @returns {boolean}
 */
export function useIsTablet(): boolean {
	return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

/**
 * 데스크탑 화면 여부를 반환합니다. (min-width: 1024px)
 * @returns {boolean}
 */
export function useIsDesktop(): boolean {
	return useMediaQuery('(min-width: 1024px)');
}

/**
 * 대형 화면 여부를 반환합니다. (min-width: 1440px)
 * @returns {boolean}
 */
export function useIsLargeScreen(): boolean {
	return useMediaQuery('(min-width: 1440px)');
}

/**
 * 세로(포트레이트) 방향 여부를 반환합니다.
 * @returns {boolean}
 */
export function useIsPortrait(): boolean {
	return useMediaQuery('(orientation: portrait)');
}

/**
 * 가로(랜드스케이프) 방향 여부를 반환합니다.
 * @returns {boolean}
 */
export function useIsLandscape(): boolean {
	return useMediaQuery('(orientation: landscape)');
}

/**
 * 사용자가 다크 모드를 선호하는지 여부를 반환합니다.
 * @returns {boolean}
 */
export function usePrefersDarkMode(): boolean {
	return useMediaQuery('(prefers-color-scheme: dark)');
}

/**
 * 사용자가 모션 감소를 선호하는지 여부를 반환합니다.
 * @returns {boolean}
 */
export function usePrefersReducedMotion(): boolean {
	return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * 호버(마우스 오버) 기능이 지원되는지 여부를 반환합니다.
 * @returns {boolean}
 */
export function useIsHoverSupported(): boolean {
	return useMediaQuery('(hover: hover)');
}

/**
 * 터치 입력이 지원되는지 여부를 반환합니다.
 * @returns {boolean}
 */
export function useIsTouchSupported(): boolean {
	return useMediaQuery('(pointer: coarse)');
}

/**
 * 현재 반응형 브레이크포인트를 반환합니다.
 * 'mobile' | 'tablet' | 'desktop' | 'large'
 *
 * @returns {'mobile' | 'tablet' | 'desktop' | 'large'}
 * @example
 * const breakpoint = useBreakpoint();
 * if (breakpoint === 'mobile') { ... }
 */
export function useBreakpoint(): 'mobile' | 'tablet' | 'desktop' | 'large' {
	const isMobile = useIsMobile();
	const isTablet = useIsTablet();
	const isDesktop = useIsDesktop();
	const isLargeScreen = useIsLargeScreen();

	if (isMobile) return 'mobile';
	if (isTablet) return 'tablet';
	if (isDesktop) return 'desktop';
	if (isLargeScreen) return 'large';

	return 'desktop'; // 기본값
}

import { useState, useEffect } from 'react';

/**
 * A custom hook that returns whether a given media query string matches the current environment.
 *
 * @param {string} query - Valid CSS media query string (e.g., '(max-width: 767px)', '(orientation: portrait)')
 *
 * @returns {boolean} matches - Whether the media query matches the current environment
 *
 * @example
 * ```tsx
 * // Basic usage
 * const isMobile = useMediaQuery('(max-width: 767px)');
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 *
 * return (
 *   <div>
 *     {isMobile && <MobileLayout />}
 *     {isDarkMode && <DarkTheme />}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Dynamic media query
 * const [screenSize, setScreenSize] = useState('(max-width: 768px)');
 * const matches = useMediaQuery(screenSize);
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-usemediaquery--docs
 */
export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		// Check if matchMedia is supported
		if (!window.matchMedia) {
			console.warn('useMediaQuery: matchMedia is not supported in this browser');
			return;
		}

		// Validate query
		if (!query || typeof query !== 'string') {
			console.warn('useMediaQuery: query must be a non-empty string');
			return;
		}

		try {
			const media = window.matchMedia(query);
			setMatches(media.matches);

			const listener = (event: MediaQueryListEvent) => {
				setMatches(event.matches);
			};

			media.addEventListener('change', listener);
			return () => {
				media.removeEventListener('change', listener);
			};
		} catch (error) {
			console.error('useMediaQuery: Failed to create media query:', error);
		}
	}, [query]);

	return matches;
}

/**
 * Returns whether the screen is mobile (max-width: 767px)
 *
 * @returns {boolean}
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-usemediaquery--docs
 */
export function useIsMobile(): boolean {
	return useMediaQuery('(max-width: 767px)');
}

/**
 * Returns whether the screen is tablet (min-width: 768px) and (max-width: 1023px)
 *
 * @returns {boolean}
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-usemediaquery--docs
 */
export function useIsTablet(): boolean {
	return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

/**
 * Returns whether the screen is desktop (min-width: 1024px)
 *
 * @returns {boolean}
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-usemediaquery--docs
 */
export function useIsDesktop(): boolean {
	return useMediaQuery('(min-width: 1024px)');
}

/**
 * Returns whether the screen is large (min-width: 1440px)
 *
 * @returns {boolean}
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-usemediaquery--docs
 */
export function useIsLargeScreen(): boolean {
	return useMediaQuery('(min-width: 1440px)');
}

/**
 * Returns whether the screen is in portrait orientation
 *
 * @returns {boolean}
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-usemediaquery--docs
 */
export function useIsPortrait(): boolean {
	return useMediaQuery('(orientation: portrait)');
}

/**
 * Returns whether the screen is in landscape orientation
 *
 * @returns {boolean}
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-usemediaquery--docs
 */
export function useIsLandscape(): boolean {
	return useMediaQuery('(orientation: landscape)');
}

/**
 * Returns whether the user prefers dark mode
 *
 * @returns {boolean}
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-usemediaquery--docs
 */
export function usePrefersDarkMode(): boolean {
	return useMediaQuery('(prefers-color-scheme: dark)');
}

/**
 * Returns whether the user prefers reduced motion
 *
 * @returns {boolean}
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-usemediaquery--docs
 */
export function usePrefersReducedMotion(): boolean {
	return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Returns whether hover is supported
 *
 * @returns {boolean}
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-usemediaquery--docs
 */
export function useIsHoverSupported(): boolean {
	return useMediaQuery('(hover: hover)');
}

/**
 * Returns whether touch is supported
 *
 * @returns {boolean}
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-usemediaquery--docs
 */
export function useIsTouchSupported(): boolean {
	return useMediaQuery('(pointer: coarse)');
}

/**
 * Returns the current breakpoint based on screen size
 *
 * @returns {'mobile' | 'tablet' | 'desktop' | 'large'}
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-usemediaquery--docs
 */
export function useBreakpoint(): 'mobile' | 'tablet' | 'desktop' | 'large' {
	const isMobile = useIsMobile();
	const isTablet = useIsTablet();
	const isLargeScreen = useIsLargeScreen();

	if (isMobile) return 'mobile';
	if (isTablet) return 'tablet';
	if (isLargeScreen) return 'large';
	return 'desktop';
}

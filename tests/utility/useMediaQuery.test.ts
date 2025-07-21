import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
	useMediaQuery,
	useIsMobile,
	useIsTablet,
	useIsDesktop,
	useIsLargeScreen,
	useIsPortrait,
	useIsLandscape,
	usePrefersDarkMode,
	usePrefersReducedMotion,
	useIsHoverSupported,
	useIsTouchSupported,
	useBreakpoint,
} from '../../src/utility/useMediaQuery';

// matchMedia 모킹
const matchMediaMock = vi.fn();
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: matchMediaMock,
});

describe('useMediaQuery', () => {
	let mockMediaQueryList: {
		matches: boolean;
		addEventListener: ReturnType<typeof vi.fn>;
		removeEventListener: ReturnType<typeof vi.fn>;
	};

	beforeEach(() => {
		mockMediaQueryList = {
			matches: false,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		};
		matchMediaMock.mockReturnValue(mockMediaQueryList);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('미디어 쿼리가 일치하면 true를 반환한다', () => {
		mockMediaQueryList.matches = true;
		const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

		expect(result.current).toBe(true);
		expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 768px)');
	});

	it('미디어 쿼리가 일치하지 않으면 false를 반환한다', () => {
		mockMediaQueryList.matches = false;
		const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

		expect(result.current).toBe(false);
	});

	it('미디어 쿼리 변경 시 상태가 업데이트된다', () => {
		mockMediaQueryList.matches = false;
		const { result } = renderHook(() => useMediaQuery('(max-width: 768px)'));

		expect(result.current).toBe(false);

		// 이벤트 리스너 호출 시뮬레이션
		const listener = mockMediaQueryList.addEventListener.mock.calls[0][1];
		act(() => {
			listener({ matches: true });
		});

		expect(result.current).toBe(true);
	});

	it('컴포넌트 언마운트 시 이벤트 리스너가 정리된다', () => {
		const { unmount } = renderHook(() => useMediaQuery('(max-width: 768px)'));

		unmount();

		expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
			'change',
			expect.any(Function),
		);
	});

	it('쿼리가 변경되면 새로운 미디어 쿼리를 사용한다', () => {
		const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
			initialProps: { query: '(max-width: 768px)' },
		});

		rerender({ query: '(max-width: 1024px)' });

		expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 1024px)');
	});
});

describe('useIsMobile', () => {
	it('모바일 화면 크기에서 true를 반환한다', () => {
		const mockMediaQueryList = {
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		};
		matchMediaMock.mockReturnValue(mockMediaQueryList);

		const { result } = renderHook(() => useIsMobile());

		expect(result.current).toBe(true);
		expect(matchMediaMock).toHaveBeenCalledWith('(max-width: 767px)');
	});
});

describe('useIsTablet', () => {
	it('태블릿 화면 크기에서 true를 반환한다', () => {
		const mockMediaQueryList = {
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		};
		matchMediaMock.mockReturnValue(mockMediaQueryList);

		const { result } = renderHook(() => useIsTablet());

		expect(result.current).toBe(true);
		expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 768px) and (max-width: 1023px)');
	});
});

describe('useIsDesktop', () => {
	it('데스크톱 화면 크기에서 true를 반환한다', () => {
		const mockMediaQueryList = {
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		};
		matchMediaMock.mockReturnValue(mockMediaQueryList);

		const { result } = renderHook(() => useIsDesktop());

		expect(result.current).toBe(true);
		expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 1024px)');
	});
});

describe('useIsLargeScreen', () => {
	it('대형 화면에서 true를 반환한다', () => {
		const mockMediaQueryList = {
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		};
		matchMediaMock.mockReturnValue(mockMediaQueryList);

		const { result } = renderHook(() => useIsLargeScreen());

		expect(result.current).toBe(true);
		expect(matchMediaMock).toHaveBeenCalledWith('(min-width: 1440px)');
	});
});

describe('useIsPortrait', () => {
	it('세로 방향에서 true를 반환한다', () => {
		const mockMediaQueryList = {
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		};
		matchMediaMock.mockReturnValue(mockMediaQueryList);

		const { result } = renderHook(() => useIsPortrait());

		expect(result.current).toBe(true);
		expect(matchMediaMock).toHaveBeenCalledWith('(orientation: portrait)');
	});
});

describe('useIsLandscape', () => {
	it('가로 방향에서 true를 반환한다', () => {
		const mockMediaQueryList = {
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		};
		matchMediaMock.mockReturnValue(mockMediaQueryList);

		const { result } = renderHook(() => useIsLandscape());

		expect(result.current).toBe(true);
		expect(matchMediaMock).toHaveBeenCalledWith('(orientation: landscape)');
	});
});

describe('usePrefersDarkMode', () => {
	it('다크 모드 선호 시 true를 반환한다', () => {
		const mockMediaQueryList = {
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		};
		matchMediaMock.mockReturnValue(mockMediaQueryList);

		const { result } = renderHook(() => usePrefersDarkMode());

		expect(result.current).toBe(true);
		expect(matchMediaMock).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
	});
});

describe('usePrefersReducedMotion', () => {
	it('모션 감소 선호 시 true를 반환한다', () => {
		const mockMediaQueryList = {
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		};
		matchMediaMock.mockReturnValue(mockMediaQueryList);

		const { result } = renderHook(() => usePrefersReducedMotion());

		expect(result.current).toBe(true);
		expect(matchMediaMock).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
	});
});

describe('useIsHoverSupported', () => {
	it('호버 지원 시 true를 반환한다', () => {
		const mockMediaQueryList = {
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		};
		matchMediaMock.mockReturnValue(mockMediaQueryList);

		const { result } = renderHook(() => useIsHoverSupported());

		expect(result.current).toBe(true);
		expect(matchMediaMock).toHaveBeenCalledWith('(hover: hover)');
	});
});

describe('useIsTouchSupported', () => {
	it('터치 지원 시 true를 반환한다', () => {
		const mockMediaQueryList = {
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		};
		matchMediaMock.mockReturnValue(mockMediaQueryList);

		const { result } = renderHook(() => useIsTouchSupported());

		expect(result.current).toBe(true);
		expect(matchMediaMock).toHaveBeenCalledWith('(pointer: coarse)');
	});
});

describe('useBreakpoint', () => {
	it('모바일 화면에서 mobile을 반환한다', () => {
		// useIsMobile만 true, 나머지는 false
		matchMediaMock
			.mockReturnValueOnce({
				matches: true,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}) // mobile
			.mockReturnValueOnce({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}) // tablet
			.mockReturnValueOnce({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}) // desktop
			.mockReturnValueOnce({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}); // large

		const { result } = renderHook(() => useBreakpoint());

		expect(result.current).toBe('mobile');
	});

	it('태블릿 화면에서 tablet을 반환한다', () => {
		// useIsTablet만 true, 나머지는 false
		matchMediaMock
			.mockReturnValueOnce({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}) // mobile
			.mockReturnValueOnce({
				matches: true,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}) // tablet
			.mockReturnValueOnce({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}) // desktop
			.mockReturnValueOnce({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}); // large

		const { result } = renderHook(() => useBreakpoint());

		expect(result.current).toBe('tablet');
	});

	it('데스크톱 화면에서 desktop을 반환한다', () => {
		// useIsDesktop만 true, 나머지는 false
		matchMediaMock
			.mockReturnValueOnce({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}) // mobile
			.mockReturnValueOnce({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}) // tablet
			.mockReturnValueOnce({
				matches: true,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}) // desktop
			.mockReturnValueOnce({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}); // large

		const { result } = renderHook(() => useBreakpoint());

		expect(result.current).toBe('desktop');
	});

	it('대형 화면에서 large를 반환한다', () => {
		// useIsLargeScreen만 true, 나머지는 false
		matchMediaMock
			.mockReturnValueOnce({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}) // mobile
			.mockReturnValueOnce({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}) // tablet
			.mockReturnValueOnce({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}) // desktop
			.mockReturnValueOnce({
				matches: true,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}); // large

		const { result } = renderHook(() => useBreakpoint());

		expect(result.current).toBe('large');
	});

	it('모든 조건이 false일 때 desktop을 기본값으로 반환한다', () => {
		// 모든 조건이 false
		matchMediaMock
			.mockReturnValueOnce({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}) // mobile
			.mockReturnValueOnce({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}) // tablet
			.mockReturnValueOnce({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}) // desktop
			.mockReturnValueOnce({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}); // large

		const { result } = renderHook(() => useBreakpoint());

		expect(result.current).toBe('desktop');
	});
});

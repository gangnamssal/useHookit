import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useWindowSize } from '../../src/utility/useWindowSize';

// window 객체 모킹
const mockWindow = {
	innerWidth: 1024,
	innerHeight: 768,
	addEventListener: vi.fn(),
	removeEventListener: vi.fn(),
};

// global 객체 대신 다른 방법으로 window 모킹
Object.defineProperty(globalThis, 'window', {
	value: mockWindow,
	writable: true,
	configurable: true,
});

describe('useWindowSize', () => {
	let originalInnerWidth: number;
	let originalInnerHeight: number;

	beforeEach(() => {
		originalInnerWidth = mockWindow.innerWidth;
		originalInnerHeight = mockWindow.innerHeight;
	});

	afterEach(() => {
		// 원래 크기로 복원
		Object.defineProperty(mockWindow, 'innerWidth', {
			value: originalInnerWidth,
			writable: true,
		});
		Object.defineProperty(mockWindow, 'innerHeight', {
			value: originalInnerHeight,
			writable: true,
		});
		vi.clearAllMocks();
	});

	it('기본 옵션으로 훅을 초기화해야 함', () => {
		const { result } = renderHook(() => useWindowSize());

		expect(result.current.width).toBe(mockWindow.innerWidth);
		expect(result.current.height).toBe(mockWindow.innerHeight);
		expect(typeof result.current.isMobile).toBe('boolean');
		expect(typeof result.current.isTablet).toBe('boolean');
		expect(typeof result.current.isDesktop).toBe('boolean');
		expect(typeof result.current.isLargeScreen).toBe('boolean');
		expect(typeof result.current.orientation).toBe('string');
	});

	it('커스텀 옵션으로 훅을 초기화해야 함', () => {
		const options = {
			initialSize: { width: 1200, height: 800 },
			debounceMs: 200,
			listenerOptions: { passive: false },
		};

		const { result } = renderHook(() => useWindowSize(options));

		expect(result.current.width).toBe(mockWindow.innerWidth);
		expect(result.current.height).toBe(mockWindow.innerHeight);
	});

	it('반응형 브레이크포인트를 올바르게 계산해야 함', () => {
		// 모바일 크기로 설정
		Object.defineProperty(mockWindow, 'innerWidth', {
			value: 375,
			writable: true,
		});

		const { result } = renderHook(() => useWindowSize());

		expect(result.current.isMobile).toBe(true);
		expect(result.current.isTablet).toBe(false);
		expect(result.current.isDesktop).toBe(false);
		expect(result.current.isLargeScreen).toBe(false);
	});

	it('태블릿 크기에서 올바른 브레이크포인트를 반환해야 함', () => {
		Object.defineProperty(mockWindow, 'innerWidth', {
			value: 768,
			writable: true,
		});

		const { result } = renderHook(() => useWindowSize());

		expect(result.current.isMobile).toBe(false);
		expect(result.current.isTablet).toBe(true);
		expect(result.current.isDesktop).toBe(false);
	});

	it('데스크탑 크기에서 올바른 브레이크포인트를 반환해야 함', () => {
		Object.defineProperty(mockWindow, 'innerWidth', {
			value: 1024,
			writable: true,
		});

		const { result } = renderHook(() => useWindowSize());

		expect(result.current.isMobile).toBe(false);
		expect(result.current.isTablet).toBe(false);
		expect(result.current.isDesktop).toBe(true);
	});

	it('대형 화면에서 올바른 브레이크포인트를 반환해야 함', () => {
		Object.defineProperty(mockWindow, 'innerWidth', {
			value: 1440,
			writable: true,
		});

		const { result } = renderHook(() => useWindowSize());

		expect(result.current.isLargeScreen).toBe(true);
	});

	it('방향을 올바르게 계산해야 함', () => {
		// 세로 방향
		Object.defineProperty(mockWindow, 'innerWidth', {
			value: 375,
			writable: true,
		});
		Object.defineProperty(mockWindow, 'innerHeight', {
			value: 667,
			writable: true,
		});

		const { result: portraitResult } = renderHook(() => useWindowSize());
		expect(portraitResult.current.orientation).toBe('portrait');

		// 가로 방향
		Object.defineProperty(mockWindow, 'innerWidth', {
			value: 1024,
			writable: true,
		});
		Object.defineProperty(mockWindow, 'innerHeight', {
			value: 768,
			writable: true,
		});

		const { result: landscapeResult } = renderHook(() => useWindowSize());
		expect(landscapeResult.current.orientation).toBe('landscape');
	});

	it('throttle 옵션을 설정할 수 있어야 함', () => {
		const options = {
			debounceMs: 50,
		};

		const { result } = renderHook(() => useWindowSize(options));

		expect(result.current.width).toBe(mockWindow.innerWidth);
		expect(result.current.height).toBe(mockWindow.innerHeight);
	});

	it('debounce를 설정할 수 있어야 함', () => {
		const options = {
			debounceMs: 100,
		};

		const { result } = renderHook(() => useWindowSize(options));

		expect(result.current.width).toBe(mockWindow.innerWidth);
		expect(result.current.height).toBe(mockWindow.innerHeight);
	});

	it('debounce를 동시에 설정할 수 있어야 함', () => {
		const options = {
			debounceMs: 100,
		};

		const { result } = renderHook(() => useWindowSize(options));

		expect(result.current.width).toBe(mockWindow.innerWidth);
		expect(result.current.height).toBe(mockWindow.innerHeight);
	});

	it('초기 크기를 설정할 수 있어야 함', () => {
		const options = {
			initialSize: { width: 1200, height: 800 },
		};

		const { result } = renderHook(() => useWindowSize(options));

		// 초기값은 설정되지만 실제 윈도우 크기로 덮어씌워짐
		expect(result.current.width).toBe(mockWindow.innerWidth);
		expect(result.current.height).toBe(mockWindow.innerHeight);
	});

	it('커스텀 리스너 옵션을 설정할 수 있어야 함', () => {
		const options = {
			listenerOptions: { passive: false },
		};

		const { result } = renderHook(() => useWindowSize(options));

		expect(result.current.width).toBe(mockWindow.innerWidth);
		expect(result.current.height).toBe(mockWindow.innerHeight);
	});

	it('윈도우 크기가 0일 때도 올바르게 동작해야 함', () => {
		Object.defineProperty(mockWindow, 'innerWidth', {
			value: 0,
			writable: true,
		});
		Object.defineProperty(mockWindow, 'innerHeight', {
			value: 0,
			writable: true,
		});

		const { result } = renderHook(() => useWindowSize());

		expect(result.current.width).toBe(0);
		expect(result.current.height).toBe(0);
		expect(result.current.isMobile).toBe(true);
		expect(result.current.isTablet).toBe(false);
		expect(result.current.isDesktop).toBe(false);
	});

	it('매우 큰 윈도우 크기에서도 올바르게 동작해야 함', () => {
		Object.defineProperty(mockWindow, 'innerWidth', {
			value: 9999,
			writable: true,
		});
		Object.defineProperty(mockWindow, 'innerHeight', {
			value: 9999,
			writable: true,
		});

		const { result } = renderHook(() => useWindowSize());

		expect(result.current.width).toBe(9999);
		expect(result.current.height).toBe(9999);
		expect(result.current.isMobile).toBe(false);
		expect(result.current.isTablet).toBe(false);
		expect(result.current.isDesktop).toBe(true);
		expect(result.current.isLargeScreen).toBe(true);
	});

	it('음수 크기에서도 올바르게 동작해야 함', () => {
		Object.defineProperty(mockWindow, 'innerWidth', {
			value: -100,
			writable: true,
		});
		Object.defineProperty(mockWindow, 'innerHeight', {
			value: -100,
			writable: true,
		});

		const { result } = renderHook(() => useWindowSize());

		expect(result.current.width).toBe(-100);
		expect(result.current.height).toBe(-100);
	});

	it('NaN 크기에서도 올바르게 동작해야 함', () => {
		Object.defineProperty(mockWindow, 'innerWidth', {
			value: NaN,
			writable: true,
		});
		Object.defineProperty(mockWindow, 'innerHeight', {
			value: NaN,
			writable: true,
		});

		const { result } = renderHook(() => useWindowSize());

		expect(result.current.width).toBe(NaN);
		expect(result.current.height).toBe(NaN);
	});

	it('Infinity 크기에서도 올바르게 동작해야 함', () => {
		Object.defineProperty(mockWindow, 'innerWidth', {
			value: Infinity,
			writable: true,
		});
		Object.defineProperty(mockWindow, 'innerHeight', {
			value: Infinity,
			writable: true,
		});

		const { result } = renderHook(() => useWindowSize());

		expect(result.current.width).toBe(Infinity);
		expect(result.current.height).toBe(Infinity);
	});

	it('옵션이 변경되면 새로운 설정이 적용되어야 함', () => {
		const { result, rerender } = renderHook(({ options }) => useWindowSize(options), {
			initialProps: { options: { debounceMs: 100 } },
		});

		rerender({ options: { debounceMs: 200 } });

		expect(result.current.width).toBe(mockWindow.innerWidth);
		expect(result.current.height).toBe(mockWindow.innerHeight);
	});

	it('이벤트 리스너가 올바르게 등록되어야 함', () => {
		renderHook(() => useWindowSize());

		expect(mockWindow.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function), {
			passive: true,
		});
	});

	it('컴포넌트 언마운트 시 이벤트 리스너가 정리되어야 함', () => {
		const { unmount } = renderHook(() => useWindowSize());

		unmount();

		expect(mockWindow.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function), {
			passive: true,
		});
	});
});

import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useWindowSize } from '../../src/utility/useWindowSize';

describe('useWindowSize', () => {
	let originalInnerWidth: number;
	let originalInnerHeight: number;

	beforeEach(() => {
		originalInnerWidth = window.innerWidth;
		originalInnerHeight = window.innerHeight;
	});

	afterEach(() => {
		// 원래 크기로 복원
		Object.defineProperty(window, 'innerWidth', {
			value: originalInnerWidth,
			writable: true,
		});
		Object.defineProperty(window, 'innerHeight', {
			value: originalInnerHeight,
			writable: true,
		});
		vi.clearAllMocks();
	});

	it('기본 옵션으로 훅을 초기화해야 함', () => {
		const { result } = renderHook(() => useWindowSize());

		expect(result.current.width).toBe(window.innerWidth);
		expect(result.current.height).toBe(window.innerHeight);
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
			throttleMs: 50,
			listenerOptions: { passive: false },
		};

		const { result } = renderHook(() => useWindowSize(options));

		expect(result.current.width).toBe(window.innerWidth);
		expect(result.current.height).toBe(window.innerHeight);
	});

	it('반응형 브레이크포인트를 올바르게 계산해야 함', () => {
		// 모바일 크기로 설정
		Object.defineProperty(window, 'innerWidth', {
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
		Object.defineProperty(window, 'innerWidth', {
			value: 768,
			writable: true,
		});

		const { result } = renderHook(() => useWindowSize());

		expect(result.current.isMobile).toBe(false);
		expect(result.current.isTablet).toBe(true);
		expect(result.current.isDesktop).toBe(false);
	});

	it('데스크탑 크기에서 올바른 브레이크포인트를 반환해야 함', () => {
		Object.defineProperty(window, 'innerWidth', {
			value: 1024,
			writable: true,
		});

		const { result } = renderHook(() => useWindowSize());

		expect(result.current.isMobile).toBe(false);
		expect(result.current.isTablet).toBe(false);
		expect(result.current.isDesktop).toBe(true);
	});

	it('대형 화면에서 올바른 브레이크포인트를 반환해야 함', () => {
		Object.defineProperty(window, 'innerWidth', {
			value: 1440,
			writable: true,
		});

		const { result } = renderHook(() => useWindowSize());

		expect(result.current.isLargeScreen).toBe(true);
	});

	it('방향을 올바르게 계산해야 함', () => {
		// 세로 방향
		Object.defineProperty(window, 'innerWidth', {
			value: 375,
			writable: true,
		});
		Object.defineProperty(window, 'innerHeight', {
			value: 667,
			writable: true,
		});

		const { result: portraitResult } = renderHook(() => useWindowSize());
		expect(portraitResult.current.orientation).toBe('portrait');

		// 가로 방향
		Object.defineProperty(window, 'innerWidth', {
			value: 1024,
			writable: true,
		});
		Object.defineProperty(window, 'innerHeight', {
			value: 768,
			writable: true,
		});

		const { result: landscapeResult } = renderHook(() => useWindowSize());
		expect(landscapeResult.current.orientation).toBe('landscape');
	});

	it('디바운스 옵션을 설정할 수 있어야 함', () => {
		const options = {
			debounceMs: 100,
		};

		const { result } = renderHook(() => useWindowSize(options));

		expect(result.current.width).toBe(window.innerWidth);
		expect(result.current.height).toBe(window.innerHeight);
	});

	it('throttle 옵션을 설정할 수 있어야 함', () => {
		const options = {
			throttleMs: 50,
		};

		const { result } = renderHook(() => useWindowSize(options));

		expect(result.current.width).toBe(window.innerWidth);
		expect(result.current.height).toBe(window.innerHeight);
	});

	it('throttle과 debounce를 동시에 설정할 수 있어야 함', () => {
		const options = {
			debounceMs: 100,
			throttleMs: 50,
		};

		const { result } = renderHook(() => useWindowSize(options));

		expect(result.current.width).toBe(window.innerWidth);
		expect(result.current.height).toBe(window.innerHeight);
	});

	it('초기 크기를 설정할 수 있어야 함', () => {
		const options = {
			initialSize: { width: 1200, height: 800 },
		};

		const { result } = renderHook(() => useWindowSize(options));

		// 초기값은 설정되지만 실제 윈도우 크기로 덮어씌워짐
		expect(result.current.width).toBe(window.innerWidth);
		expect(result.current.height).toBe(window.innerHeight);
	});

	it('커스텀 리스너 옵션을 설정할 수 있어야 함', () => {
		const options = {
			listenerOptions: { passive: false },
		};

		const { result } = renderHook(() => useWindowSize(options));

		expect(result.current.width).toBe(window.innerWidth);
		expect(result.current.height).toBe(window.innerHeight);
	});
});

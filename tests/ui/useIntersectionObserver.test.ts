import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useIntersectionObserver } from '../../src/ui/useIntersectionObserver';

// IntersectionObserver 모킹
const mockIntersectionObserver = vi.fn();
const mockDisconnect = vi.fn();
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();

describe('useIntersectionObserver', () => {
	beforeEach(() => {
		// IntersectionObserver 모킹 설정
		mockIntersectionObserver.mockImplementation(() => ({
			observe: mockObserve,
			unobserve: mockUnobserve,
			disconnect: mockDisconnect,
		}));

		Object.defineProperty(window, 'IntersectionObserver', {
			writable: true,
			configurable: true,
			value: mockIntersectionObserver,
		});

		// DOMRect 모킹
		Object.defineProperty(window, 'DOMRectReadOnly', {
			writable: true,
			configurable: true,
			value: class DOMRectReadOnly {
				constructor(
					public x: number = 0,
					public y: number = 0,
					public width: number = 0,
					public height: number = 0,
				) {}
			},
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('기본 옵션으로 훅을 초기화해야 함', () => {
		const { result } = renderHook(() => useIntersectionObserver());

		expect(result.current.isIntersecting).toBe(false);
		expect(result.current.intersectionRatio).toBe(0);
		expect(result.current.intersectionRect).toBe(null);
		expect(result.current.boundingClientRect).toBe(null);
		expect(result.current.rootBounds).toBe(null);
		expect(typeof result.current.ref).toBe('function');
		expect(result.current.observer).toBeInstanceOf(Object);
	});

	it('커스텀 옵션으로 훅을 초기화해야 함', () => {
		const options = {
			rootMargin: '50px',
			threshold: 0.5,
			initialIsIntersecting: true,
		};

		const { result } = renderHook(() => useIntersectionObserver(options));

		expect(result.current.isIntersecting).toBe(true);
		expect(mockIntersectionObserver).toHaveBeenCalledWith(
			expect.any(Function),
			expect.objectContaining({
				root: null,
				rootMargin: '50px',
				threshold: 0.5,
			}),
		);
	});

	it('요소에 ref를 설정해야 함', () => {
		const { result } = renderHook(() => useIntersectionObserver());
		const mockElement = document.createElement('div');

		act(() => {
			result.current.ref(mockElement);
		});

		expect(mockObserve).toHaveBeenCalledWith(mockElement);
	});

	it('요소가 변경되면 observe를 업데이트해야 함', () => {
		const { result } = renderHook(() => useIntersectionObserver());
		const element1 = document.createElement('div');
		const element2 = document.createElement('div');

		act(() => {
			result.current.ref(element1);
		});

		act(() => {
			result.current.ref(element2);
		});

		expect(mockDisconnect).toHaveBeenCalled();
		expect(mockObserve).toHaveBeenCalledWith(element2);
	});

	it('IntersectionObserver가 지원되지 않는 환경에서 경고를 출력해야 함', () => {
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		// IntersectionObserver 제거
		Object.defineProperty(window, 'IntersectionObserver', {
			writable: true,
			configurable: true,
			value: undefined,
		});

		renderHook(() => useIntersectionObserver());

		expect(consoleSpy).toHaveBeenCalledWith(
			'useIntersectionObserver: IntersectionObserver is not supported in this browser',
		);

		consoleSpy.mockRestore();
	});

	it('교차 이벤트를 처리해야 함', () => {
		const { result } = renderHook(() => useIntersectionObserver());
		const mockElement = document.createElement('div');

		act(() => {
			result.current.ref(mockElement);
		});

		// IntersectionObserver 콜백 가져오기
		const callback = mockIntersectionObserver.mock.calls[0][0];
		const mockEntry = {
			isIntersecting: true,
			intersectionRatio: 0.8,
			intersectionRect: new DOMRectReadOnly(0, 0, 100, 100),
			boundingClientRect: new DOMRectReadOnly(0, 0, 200, 200),
			rootBounds: new DOMRectReadOnly(0, 0, 800, 600),
		};

		act(() => {
			callback([mockEntry]);
		});

		expect(result.current.isIntersecting).toBe(true);
		expect(result.current.intersectionRatio).toBe(0.8);
		expect(result.current.intersectionRect).toBe(mockEntry.intersectionRect);
		expect(result.current.boundingClientRect).toBe(mockEntry.boundingClientRect);
		expect(result.current.rootBounds).toBe(mockEntry.rootBounds);
	});
});

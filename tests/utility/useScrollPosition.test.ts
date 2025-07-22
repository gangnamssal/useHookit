import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useScrollPosition } from '../../src/utility/useScrollPosition';

describe('useScrollPosition', () => {
	let mockElement: HTMLElement;

	beforeEach(() => {
		// Mock element
		mockElement = document.createElement('div');
		mockElement.scrollLeft = 0;
		mockElement.scrollTop = 0;
		Object.defineProperty(mockElement, 'scrollHeight', { value: 1000, writable: true });
		Object.defineProperty(mockElement, 'clientHeight', { value: 500, writable: true });

		// Mock window scroll properties
		Object.defineProperty(window, 'pageXOffset', { value: 0, writable: true });
		Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true });
		Object.defineProperty(window, 'innerHeight', { value: 500, writable: true });

		// Mock document.documentElement
		Object.defineProperty(document.documentElement, 'scrollLeft', { value: 0, writable: true });
		Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, writable: true });
		Object.defineProperty(document.documentElement, 'scrollHeight', {
			value: 1000,
			writable: true,
		});

		// Mock event listeners
		vi.spyOn(window, 'addEventListener');
		vi.spyOn(window, 'removeEventListener');
		vi.spyOn(mockElement, 'addEventListener');
		vi.spyOn(mockElement, 'removeEventListener');

		// Mock scrollTo methods
		vi.spyOn(window, 'scrollTo');
		Object.defineProperty(mockElement, 'scrollTo', { value: vi.fn(), writable: true });
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('기본 옵션으로 훅을 초기화해야 함', () => {
		const { result } = renderHook(() => useScrollPosition());

		expect(result.current.x).toBe(0);
		expect(result.current.y).toBe(0);
		expect(result.current.isScrolling).toBe(false);
		expect(typeof result.current.scrollTo).toBe('function');
		expect(typeof result.current.scrollToTop).toBe('function');
		expect(typeof result.current.scrollToBottom).toBe('function');
	});

	it('커스텀 요소로 스크롤 위치를 추적해야 함', () => {
		const { result } = renderHook(() => useScrollPosition({ element: mockElement }));

		expect(result.current.x).toBe(0);
		expect(result.current.y).toBe(0);
		expect(mockElement.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), {
			passive: true,
		});
	});

	it('스크롤 이벤트가 발생하면 위치가 업데이트되어야 함', () => {
		const { result } = renderHook(() => useScrollPosition());

		act(() => {
			Object.defineProperty(window, 'pageXOffset', { value: 100 });
			Object.defineProperty(window, 'pageYOffset', { value: 200 });
			window.dispatchEvent(new Event('scroll'));
		});

		expect(result.current.x).toBe(100);
		expect(result.current.y).toBe(200);
		expect(result.current.isScrolling).toBe(true);
	});

	it('스크롤이 멈추면 isScrolling이 false가 되어야 함', async () => {
		vi.useFakeTimers();
		const { result } = renderHook(() => useScrollPosition());

		act(() => {
			window.dispatchEvent(new Event('scroll'));
		});

		expect(result.current.isScrolling).toBe(true);

		act(() => {
			vi.advanceTimersByTime(150);
		});

		expect(result.current.isScrolling).toBe(false);
		vi.useRealTimers();
	});

	it('throttle 옵션이 적용되어야 함', () => {
		const { result } = renderHook(() => useScrollPosition({ throttle: 100 }));

		act(() => {
			Object.defineProperty(window, 'pageXOffset', { value: 100 });
			window.dispatchEvent(new Event('scroll'));
		});

		expect(result.current.x).toBe(100);

		// 빠른 연속 스크롤 이벤트는 throttle되어야 함
		act(() => {
			Object.defineProperty(window, 'pageXOffset', { value: 200 });
			window.dispatchEvent(new Event('scroll'));
		});

		// throttle로 인해 업데이트되지 않아야 함
		expect(result.current.x).toBe(100);
	});

	it('onChange 콜백이 호출되어야 함', () => {
		const onChange = vi.fn();
		renderHook(() => useScrollPosition({ onChange }));

		act(() => {
			Object.defineProperty(window, 'pageXOffset', { value: 100 });
			Object.defineProperty(window, 'pageYOffset', { value: 200 });
			window.dispatchEvent(new Event('scroll'));
		});

		expect(onChange).toHaveBeenCalledWith({ x: 100, y: 200 });
	});

	it('enabled가 false면 스크롤 추적이 비활성화되어야 함', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() => useScrollPosition({ enabled: false, onChange }));

		act(() => {
			Object.defineProperty(window, 'pageXOffset', { value: 100 });
			window.dispatchEvent(new Event('scroll'));
		});

		expect(result.current.x).toBe(0);
		expect(onChange).not.toHaveBeenCalled();
	});

	describe('scrollTo 함수', () => {
		it('window에 대해 정상적으로 작동해야 함', () => {
			const scrollToSpy = vi.spyOn(window, 'scrollTo');
			const { result } = renderHook(() => useScrollPosition());

			act(() => {
				result.current.scrollTo(100, 200);
			});

			expect(scrollToSpy).toHaveBeenCalledWith({ left: 100, top: 200, behavior: 'smooth' });
		});

		it('커스텀 요소에 대해 정상적으로 작동해야 함', () => {
			const scrollToSpy = vi.spyOn(mockElement, 'scrollTo');
			const { result } = renderHook(() => useScrollPosition({ element: mockElement }));

			act(() => {
				result.current.scrollTo(100, 200);
			});

			expect(scrollToSpy).toHaveBeenCalledWith({ left: 100, top: 200, behavior: 'smooth' });
		});
	});

	describe('scrollToTop 함수', () => {
		it('정상적으로 작동해야 함', () => {
			const scrollToSpy = vi.spyOn(window, 'scrollTo');
			const { result } = renderHook(() => useScrollPosition());

			act(() => {
				result.current.scrollToTop();
			});

			expect(scrollToSpy).toHaveBeenCalledWith({ left: 0, top: 0, behavior: 'smooth' });
		});
	});

	describe('scrollToBottom 함수', () => {
		it('window에 대해 정상적으로 작동해야 함', () => {
			const scrollToSpy = vi.spyOn(window, 'scrollTo');
			const { result } = renderHook(() => useScrollPosition());

			act(() => {
				result.current.scrollToBottom();
			});

			expect(scrollToSpy).toHaveBeenCalledWith({ left: 0, top: 500, behavior: 'smooth' });
		});

		it('커스텀 요소에 대해 정상적으로 작동해야 함', () => {
			const scrollToSpy = vi.spyOn(mockElement, 'scrollTo');
			const { result } = renderHook(() => useScrollPosition({ element: mockElement }));

			act(() => {
				result.current.scrollToBottom();
			});

			expect(scrollToSpy).toHaveBeenCalledWith({ left: 0, top: 500, behavior: 'smooth' });
		});
	});

	it('onChange 콜백에서 에러가 발생해도 훅이 계속 작동해야 함', () => {
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const onChange = vi.fn().mockImplementation(() => {
			throw new Error('Test error');
		});

		const { result } = renderHook(() => useScrollPosition({ onChange }));

		act(() => {
			window.dispatchEvent(new Event('scroll'));
		});

		expect(consoleSpy).toHaveBeenCalledWith(
			'useScrollPosition: Error in onChange callback:',
			expect.any(Error),
		);
		expect(result.current.x).toBe(0);
		expect(result.current.y).toBe(0);

		consoleSpy.mockRestore();
	});

	describe('이벤트 리스너 관리', () => {
		it('요소가 변경되면 이벤트 리스너가 재설정되어야 함', () => {
			const { rerender } = renderHook(
				({ element }: { element: HTMLElement | null }) => useScrollPosition({ element }),
				{ initialProps: { element: null as HTMLElement | null } },
			);

			expect(window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), {
				passive: true,
			});

			rerender({ element: mockElement as HTMLElement | null });

			expect(mockElement.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), {
				passive: true,
			});
		});

		it('컴포넌트가 언마운트되면 이벤트 리스너가 제거되어야 함', () => {
			const { unmount } = renderHook(() => useScrollPosition());

			unmount();

			expect(window.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
		});

		it('커스텀 요소가 변경되면 이벤트 리스너가 제거되어야 함', () => {
			const { rerender } = renderHook(
				({ element }: { element: HTMLElement | null }) => useScrollPosition({ element }),
				{ initialProps: { element: mockElement as HTMLElement | null } },
			);

			rerender({ element: null as HTMLElement | null });

			expect(mockElement.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
		});
	});
});

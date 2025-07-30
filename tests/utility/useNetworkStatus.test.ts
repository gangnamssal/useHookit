import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useNetworkStatus } from '../../src/utility/useNetworkStatus';

describe('useNetworkStatus', () => {
	let originalOnLine: boolean;

	beforeEach(() => {
		originalOnLine = navigator.onLine;
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		// 원래 상태로 복원
		Object.defineProperty(navigator, 'onLine', {
			value: originalOnLine,
			writable: true,
		});
	});

	it('기본 옵션으로 훅을 초기화해야 함', () => {
		const { result } = renderHook(() => useNetworkStatus());

		expect(typeof result.current.isOnline).toBe('boolean');
		expect(typeof result.current.isOffline).toBe('boolean');
		expect(typeof result.current.statusMessage).toBe('string');
		expect(result.current.lastOnline).toBeNull();
		expect(result.current.lastOffline).toBeNull();
		expect(typeof result.current.refreshStatus).toBe('function');
	});

	it('커스텀 옵션으로 훅을 초기화해야 함', () => {
		// navigator.onLine을 false로 설정하여 초기 상태가 제대로 적용되는지 확인
		Object.defineProperty(navigator, 'onLine', {
			value: false,
			writable: true,
		});

		const options = {
			initialOnline: false,
			onlineMessage: '커스텀 온라인',
			offlineMessage: '커스텀 오프라인',
			showStatusMessage: true,
		};

		const { result } = renderHook(() => useNetworkStatus(options));

		expect(result.current.isOnline).toBe(false);
		expect(result.current.isOffline).toBe(true);
		expect(result.current.statusMessage).toBe('커스텀 오프라인');
	});

	it('온라인 상태에서 올바른 값을 반환해야 함', () => {
		Object.defineProperty(navigator, 'onLine', {
			value: true,
			writable: true,
		});

		const { result } = renderHook(() => useNetworkStatus());

		expect(result.current.isOnline).toBe(true);
		expect(result.current.isOffline).toBe(false);
		expect(result.current.statusMessage).toBe('Online');
	});

	it('오프라인 상태에서 올바른 값을 반환해야 함', () => {
		Object.defineProperty(navigator, 'onLine', {
			value: false,
			writable: true,
		});

		const { result } = renderHook(() => useNetworkStatus());

		expect(result.current.isOnline).toBe(false);
		expect(result.current.isOffline).toBe(true);
		expect(result.current.statusMessage).toBe('Offline');
	});

	it('온라인 이벤트가 발생하면 상태가 업데이트되어야 함', async () => {
		Object.defineProperty(navigator, 'onLine', {
			value: false,
			writable: true,
		});

		const { result } = renderHook(() => useNetworkStatus());

		expect(result.current.isOnline).toBe(false);

		// 온라인 이벤트 발생
		act(() => {
			Object.defineProperty(navigator, 'onLine', {
				value: true,
				writable: true,
			});
			window.dispatchEvent(new Event('online'));
		});

		// 상태 업데이트를 기다림
		await Promise.resolve();

		expect(result.current.isOnline).toBe(true);
		expect(result.current.lastOnline).toBeInstanceOf(Date);
	});

	it('오프라인 이벤트가 발생하면 상태가 업데이트되어야 함', async () => {
		Object.defineProperty(navigator, 'onLine', {
			value: true,
			writable: true,
		});

		const { result } = renderHook(() => useNetworkStatus());

		expect(result.current.isOnline).toBe(true);

		// 오프라인 이벤트 발생
		act(() => {
			Object.defineProperty(navigator, 'onLine', {
				value: false,
				writable: true,
			});
			window.dispatchEvent(new Event('offline'));
		});

		// 상태 업데이트를 기다림
		await Promise.resolve();

		expect(result.current.isOnline).toBe(false);
		expect(result.current.lastOffline).toBeInstanceOf(Date);
	});

	it('refreshStatus 함수가 상태를 새로고침해야 함', async () => {
		Object.defineProperty(navigator, 'onLine', {
			value: false,
			writable: true,
		});

		const { result } = renderHook(() => useNetworkStatus());

		expect(result.current.isOnline).toBe(false);

		// navigator.onLine을 true로 변경
		Object.defineProperty(navigator, 'onLine', {
			value: true,
			writable: true,
		});

		// refreshStatus 호출
		act(() => {
			result.current.refreshStatus();
		});

		// 상태 업데이트를 기다림
		await Promise.resolve();

		expect(result.current.isOnline).toBe(true);
	});

	it('커스텀 메시지를 사용해야 함', async () => {
		const customOnlineMessage = '커스텀 온라인 메시지';
		const customOfflineMessage = '커스텀 오프라인 메시지';

		Object.defineProperty(navigator, 'onLine', {
			value: true,
			writable: true,
		});

		const { result } = renderHook(() =>
			useNetworkStatus({
				onlineMessage: customOnlineMessage,
				offlineMessage: customOfflineMessage,
			}),
		);

		expect(result.current.statusMessage).toBe(customOnlineMessage);

		// 오프라인으로 변경
		act(() => {
			Object.defineProperty(navigator, 'onLine', {
				value: false,
				writable: true,
			});
			window.dispatchEvent(new Event('offline'));
		});

		// 상태 업데이트를 기다림
		await Promise.resolve();

		expect(result.current.statusMessage).toBe(customOfflineMessage);
	});

	it('초기 온라인 상태를 설정할 수 있어야 함', () => {
		// navigator.onLine을 false로 설정하지만 initialOnline을 true로 설정
		Object.defineProperty(navigator, 'onLine', {
			value: false,
			writable: true,
		});

		const { result } = renderHook(() => useNetworkStatus({ initialOnline: true }));

		// initialOnline 옵션이 우선되어야 함
		expect(result.current.isOnline).toBe(true);
		expect(result.current.isOffline).toBe(false);
	});

	it('이벤트 리스너가 정리되어야 함', () => {
		const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
		const { unmount } = renderHook(() => useNetworkStatus());

		unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
		expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
		removeEventListenerSpy.mockRestore();
	});

	it('navigator.onLine이 지원되지 않는 환경에서 안전하게 동작해야 함', () => {
		// navigator.onLine을 undefined로 설정
		Object.defineProperty(navigator, 'onLine', {
			value: undefined,
			writable: true,
		});

		const { result } = renderHook(() => useNetworkStatus());

		// 기본값으로 동작해야 함
		expect(result.current.isOnline).toBe(true);
		expect(result.current.isOffline).toBe(false);
	});

	it('연속적인 상태 변화를 올바르게 처리해야 함', async () => {
		Object.defineProperty(navigator, 'onLine', {
			value: true,
			writable: true,
		});

		const { result } = renderHook(() => useNetworkStatus());

		// 온라인 -> 오프라인
		act(() => {
			Object.defineProperty(navigator, 'onLine', {
				value: false,
				writable: true,
			});
			window.dispatchEvent(new Event('offline'));
		});

		// 상태 업데이트를 기다림
		await Promise.resolve();

		expect(result.current.isOnline).toBe(false);
		expect(result.current.lastOffline).toBeInstanceOf(Date);

		// 오프라인 -> 온라인
		act(() => {
			Object.defineProperty(navigator, 'onLine', {
				value: true,
				writable: true,
			});
			window.dispatchEvent(new Event('online'));
		});

		// 상태 업데이트를 기다림
		await Promise.resolve();

		expect(result.current.isOnline).toBe(true);
		expect(result.current.lastOnline).toBeInstanceOf(Date);
	});
});

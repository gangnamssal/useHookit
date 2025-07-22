import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGeolocation } from '../../src/utility/useGeolocation';

// Mock navigator.geolocation
const mockGeolocation = {
	getCurrentPosition: vi.fn(),
	watchPosition: vi.fn(),
	clearWatch: vi.fn(),
};

// Mock navigator
Object.defineProperty(globalThis, 'navigator', {
	value: {
		geolocation: mockGeolocation,
	},
	writable: true,
});

describe('useGeolocation', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Reset navigator mock
		Object.defineProperty(globalThis, 'navigator', {
			value: {
				geolocation: mockGeolocation,
			},
			writable: true,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('기본 상태를 올바르게 반환해야 한다', () => {
		const { result } = renderHook(() => useGeolocation());

		expect(result.current.position).toBeNull();
		expect(result.current.error).toBeNull();
		expect(result.current.loading).toBe(false);
		expect(result.current.supported).toBe(true);
		expect(result.current.isWatching).toBe(false);
		expect(typeof result.current.getCurrentPosition).toBe('function');
		expect(typeof result.current.startWatching).toBe('function');
		expect(typeof result.current.stopWatching).toBe('function');
	});

	it('Geolocation API가 지원되지 않는 환경에서 supported가 false여야 한다', () => {
		// navigator.geolocation을 undefined로 설정
		Object.defineProperty(globalThis, 'navigator', {
			value: {},
			writable: true,
		});

		const { result } = renderHook(() => useGeolocation());

		expect(result.current.supported).toBe(false);
	});

	it('getCurrentPosition이 성공적으로 위치 정보를 가져와야 한다', async () => {
		const mockPosition = {
			coords: {
				latitude: 37.5665,
				longitude: 126.978,
				accuracy: 10,
				altitude: null,
				altitudeAccuracy: null,
				heading: null,
				speed: null,
			},
			timestamp: Date.now(),
		};

		mockGeolocation.getCurrentPosition.mockImplementation((success) => {
			success(mockPosition);
		});

		const { result } = renderHook(() => useGeolocation());

		await act(async () => {
			const position = await result.current.getCurrentPosition();
			expect(position).toEqual({
				latitude: 37.5665,
				longitude: 126.978,
				accuracy: 10,
				altitude: null,
				altitudeAccuracy: null,
				heading: null,
				speed: null,
				timestamp: mockPosition.timestamp,
			});
		});

		expect(result.current.position).toEqual({
			latitude: 37.5665,
			longitude: 126.978,
			accuracy: 10,
			altitude: null,
			altitudeAccuracy: null,
			heading: null,
			speed: null,
			timestamp: mockPosition.timestamp,
		});
		expect(result.current.loading).toBe(false);
		expect(result.current.error).toBeNull();
	});

	it('getCurrentPosition이 실패 시 에러를 반환해야 한다', async () => {
		const mockError = {
			code: 1,
			message: 'User denied geolocation',
		};

		mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
			error(mockError);
		});

		const { result } = renderHook(() => useGeolocation());

		await act(async () => {
			try {
				await result.current.getCurrentPosition();
			} catch (error) {
				expect(error).toEqual({
					code: 1,
					message: 'PERMISSION_DENIED: 위치 정보 접근 권한이 거부되었습니다.',
				});
			}
		});

		expect(result.current.error).toEqual({
			code: 1,
			message: 'PERMISSION_DENIED: 위치 정보 접근 권한이 거부되었습니다.',
		});
		expect(result.current.loading).toBe(false);
	});

	it('Geolocation API가 지원되지 않을 때 getCurrentPosition이 에러를 던져야 한다', async () => {
		Object.defineProperty(globalThis, 'navigator', {
			value: {},
			writable: true,
		});

		const { result } = renderHook(() => useGeolocation());

		await act(async () => {
			try {
				await result.current.getCurrentPosition();
			} catch (error) {
				expect(error).toEqual(new Error('Geolocation API is not supported in this browser'));
			}
		});
	});

	it('startWatching이 위치 감시를 시작해야 한다', () => {
		const mockPosition = {
			coords: {
				latitude: 37.5665,
				longitude: 126.978,
				accuracy: 10,
				altitude: null,
				altitudeAccuracy: null,
				heading: null,
				speed: null,
			},
			timestamp: Date.now(),
		};

		mockGeolocation.watchPosition.mockImplementation((success) => {
			success(mockPosition);
			return 123; // watch ID
		});

		const { result } = renderHook(() => useGeolocation());

		act(() => {
			result.current.startWatching();
		});

		expect(result.current.isWatching).toBe(true);
		expect(mockGeolocation.watchPosition).toHaveBeenCalled();
	});

	it('stopWatching이 위치 감시를 중지해야 한다', async () => {
		mockGeolocation.watchPosition.mockReturnValue(123);

		const { result } = renderHook(() => useGeolocation());

		act(() => {
			result.current.startWatching();
		});

		expect(result.current.isWatching).toBe(true);

		act(() => {
			result.current.stopWatching();
		});

		await waitFor(() => {
			expect(result.current.isWatching).toBe(false);
		});
		expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(123);
	});

	it('watch 옵션이 true일 때 자동으로 감시를 시작해야 한다', () => {
		const mockPosition = {
			coords: {
				latitude: 37.5665,
				longitude: 126.978,
				accuracy: 10,
				altitude: null,
				altitudeAccuracy: null,
				heading: null,
				speed: null,
			},
			timestamp: Date.now(),
		};

		mockGeolocation.watchPosition.mockImplementation((success) => {
			success(mockPosition);
			return 123;
		});

		const { result } = renderHook(() => useGeolocation({ watch: true }));

		expect(result.current.isWatching).toBe(true);
		expect(mockGeolocation.watchPosition).toHaveBeenCalled();
	});

	it('커스텀 옵션을 사용할 수 있어야 한다', async () => {
		const mockPosition = {
			coords: {
				latitude: 37.5665,
				longitude: 126.978,
				accuracy: 10,
				altitude: null,
				altitudeAccuracy: null,
				heading: null,
				speed: null,
			},
			timestamp: Date.now(),
		};

		mockGeolocation.getCurrentPosition.mockImplementation((success) => {
			success(mockPosition);
		});

		const { result } = renderHook(() =>
			useGeolocation({
				enableHighAccuracy: true,
				timeout: 15000,
				maximumAge: 300000,
			}),
		);

		await act(async () => {
			await result.current.getCurrentPosition({
				enableHighAccuracy: true,
				timeout: 20000,
			});
		});

		expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
			expect.any(Function),
			expect.any(Function),
			expect.objectContaining({
				enableHighAccuracy: true,
				timeout: 20000,
				maximumAge: 300000,
			}),
		);
	});

	it('에러 코드에 따른 적절한 메시지를 반환해야 한다', async () => {
		const errorCases = [
			{ code: 1, expectedMessage: 'PERMISSION_DENIED: 위치 정보 접근 권한이 거부되었습니다.' },
			{ code: 2, expectedMessage: 'POSITION_UNAVAILABLE: 위치 정보를 사용할 수 없습니다.' },
			{ code: 3, expectedMessage: 'TIMEOUT: 위치 정보 요청 시간이 초과되었습니다.' },
		];

		for (const { code, expectedMessage } of errorCases) {
			mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
				error({ code, message: 'Test error' });
			});

			const { result } = renderHook(() => useGeolocation());

			await act(async () => {
				try {
					await result.current.getCurrentPosition();
				} catch (error) {
					expect((error as any).message).toBe(expectedMessage);
				}
			});

			expect(result.current.error?.message).toBe(expectedMessage);
		}
	});

	it('이미 감시 중일 때 startWatching을 다시 호출해도 중복으로 시작되지 않아야 한다', () => {
		mockGeolocation.watchPosition.mockReturnValue(123);

		const { result } = renderHook(() => useGeolocation());

		act(() => {
			result.current.startWatching();
		});

		expect(result.current.isWatching).toBe(true);
		expect(mockGeolocation.watchPosition).toHaveBeenCalledTimes(1);

		act(() => {
			result.current.startWatching();
		});

		expect(mockGeolocation.watchPosition).toHaveBeenCalledTimes(1);
	});

	it('Geolocation API가 지원되지 않을 때 startWatching이 경고를 출력해야 한다', () => {
		Object.defineProperty(globalThis, 'navigator', {
			value: {},
			writable: true,
		});

		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const { result } = renderHook(() => useGeolocation());

		act(() => {
			result.current.startWatching();
		});

		expect(consoleSpy).toHaveBeenCalledWith('Geolocation API is not supported in this browser');
		consoleSpy.mockRestore();
	});

	it('watchPosition 에러를 적절히 처리해야 한다', () => {
		const mockError = {
			code: 2,
			message: 'Position unavailable',
		};

		mockGeolocation.watchPosition.mockImplementation((success, error) => {
			error(mockError);
			return 123;
		});

		const { result } = renderHook(() => useGeolocation());

		act(() => {
			result.current.startWatching();
		});

		expect(result.current.error).toEqual({
			code: 2,
			message: 'POSITION_UNAVAILABLE: 위치 정보를 사용할 수 없습니다.',
		});
	});

	it('컴포넌트 언마운트 시 감시를 정리해야 한다', () => {
		mockGeolocation.watchPosition.mockReturnValue(123);

		const { result, unmount } = renderHook(() => useGeolocation());

		act(() => {
			result.current.startWatching();
		});

		expect(result.current.isWatching).toBe(true);

		unmount();

		expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(123);
	});

	it('위치 정보에 모든 속성이 포함되어야 한다', async () => {
		const mockPosition = {
			coords: {
				latitude: 37.5665,
				longitude: 1206.978,
				accuracy: 10,
				altitude: 100,
				altitudeAccuracy: 5,
				heading: 45,
				speed: 10,
			},
			timestamp: Date.now(),
		};

		mockGeolocation.getCurrentPosition.mockImplementation((success) => {
			success(mockPosition);
		});

		const { result } = renderHook(() => useGeolocation());

		await act(async () => {
			const position = await result.current.getCurrentPosition();
			expect(position).toEqual({
				latitude: 37.5665,
				longitude: 1206.978,
				accuracy: 10,
				altitude: 100,
				altitudeAccuracy: 5,
				heading: 45,
				speed: 10,
				timestamp: mockPosition.timestamp,
			});
		});
	});

	it('navigator가 undefined인 환경에서 안전하게 처리해야 한다', () => {
		const originalNavigator = globalThis.navigator;
		// @ts-expect-error
		delete globalThis.navigator;
		const { result } = renderHook(() => useGeolocation());
		expect(result.current.supported).toBe(false);
		expect(result.current.position).toBeNull();
		expect(result.current.error).toBeNull();
		globalThis.navigator = originalNavigator;
	});

	it('navigator.geolocation이 undefined인 환경에서 안전하게 처리해야 한다', () => {
		const originalNavigator = globalThis.navigator;
		// @ts-expect-error
		globalThis.navigator = {};
		const { result } = renderHook(() => useGeolocation());
		expect(result.current.supported).toBe(false);
		globalThis.navigator = originalNavigator;
	});

	it('getCurrentPosition이 동시에 여러 번 호출될 때 안전하게 처리해야 한다', async () => {
		const mockPosition = {
			coords: {
				latitude: 37.5665,
				longitude: 126.978,
				accuracy: 10,
				altitude: null,
				altitudeAccuracy: null,
				heading: null,
				speed: null,
			},
			timestamp: Date.now(),
		};
		mockGeolocation.getCurrentPosition.mockImplementation((success) => {
			setTimeout(() => success(mockPosition), 10);
		});
		const { result } = renderHook(() => useGeolocation());
		await act(async () => {
			const promises = [
				result.current.getCurrentPosition(),
				result.current.getCurrentPosition(),
				result.current.getCurrentPosition(),
			];
			const positions = await Promise.all(promises);
			expect(positions).toHaveLength(3);
			expect(positions[0]).toEqual(positions[1]);
			expect(positions[1]).toEqual(positions[2]);
		});
		expect(result.current.loading).toBe(false);
	});

	it('알 수 없는 에러 코드에 대해 기본 메시지를 사용해야 한다', async () => {
		const mockError = {
			code: 999,
			message: 'Unknown error',
		};
		mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
			error(mockError);
		});
		const { result } = renderHook(() => useGeolocation());
		await act(async () => {
			try {
				await result.current.getCurrentPosition();
			} catch (error) {
				expect(error).toEqual({
					code: 999,
					message: 'Unknown error',
				});
			}
		});
		expect(result.current.error?.message).toBe('Unknown error');
	});
});

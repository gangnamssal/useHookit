import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/**
 * Geolocation position type
 */
export interface GeolocationPosition {
	latitude: number;
	longitude: number;
	accuracy?: number;
	altitude?: number | null;
	altitudeAccuracy?: number | null;
	heading?: number | null;
	speed?: number | null;
	timestamp: number;
}

/**
 * Geolocation error type
 */
export interface GeolocationError {
	code: number;
	message: string;
}

/**
 * useGeolocation hook options type
 */
export interface UseGeolocationOptions {
	/** Geolocation request options */
	enableHighAccuracy?: boolean;
	/** Geolocation request timeout (ms) */
	timeout?: number;
	/** Geolocation cache time (ms) */
	maximumAge?: number;
	/** Whether to automatically get location */
	watch?: boolean;
}

/**
 * useGeolocation hook return type
 */
export interface UseGeolocationReturn {
	/** Current location information */
	position: GeolocationPosition | null;
	/** Location error */
	error: GeolocationError | null;
	/** Location loading state */
	loading: boolean;
	/** Location support status */
	supported: boolean;
	/** Function to get current location */
	getCurrentPosition: (options?: PositionOptions) => Promise<GeolocationPosition>;
	/** Function to start location watching */
	startWatching: (options?: PositionOptions) => void;
	/** Function to stop location watching */
	stopWatching: () => void;
	/** Whether location watching is active */
	isWatching: boolean;
}

const ERROR_MESSAGES = {
	1: 'PERMISSION_DENIED: 위치 정보 접근 권한이 거부되었습니다.',
	2: 'POSITION_UNAVAILABLE: 위치 정보를 사용할 수 없습니다.',
	3: 'TIMEOUT: 위치 정보 요청 시간이 초과되었습니다.',
} as const;

/**
 * A custom hook that manages location information using the browser's Geolocation API.
 *
 * @param {UseGeolocationOptions} [options] - Geolocation request options
 *
 * @param {boolean} [options.enableHighAccuracy] - Whether to request high accuracy location (default: false)
 *
 * @param {number} [options.timeout] - Timeout for location request (ms, default: 10000)
 *
 * @param {number} [options.maximumAge] - Maximum age of cached location (ms, default: 0)
 *
 * @param {boolean} [options.watch] - Whether to automatically watch location (default: false)
 *
 * @returns {UseGeolocationReturn} Location management object
 *
 * @returns {GeolocationPosition | null} position - Current location information
 *
 * @returns {GeolocationError | null} error - Location error
 *
 * @returns {boolean} loading - Location loading state
 *
 * @returns {boolean} supported - Location support status
 *
 * @returns {(options?: PositionOptions) => Promise<GeolocationPosition>} getCurrentPosition - Function to get current location
 *
 * @returns {(options?: PositionOptions) => void} startWatching - Function to start location watching
 *
 * @returns {() => void} stopWatching - Function to stop location watching
 *
 * @returns {boolean} isWatching - Whether location watching is active
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
 * const { position, error, loading, getCurrentPosition } = useGeolocation();
 *
 * const handleGetLocation = async () => {
 *   try {
 *     await getCurrentPosition();
 *   } catch (error) {
 *     console.error('위치 정보 가져오기 실패:', error);
 *   }
 * };
 *
 * return (
 *   <div>
 *     {loading && <p>위치 정보 가져오는 중...</p>}
 *     {error && <p>에러: {error.message}</p>}
 *     {position && (
 *       <p>
 *         위도: {position.latitude}, 경도: {position.longitude}
 *       </p>
 *     )}
 *     <button onClick={handleGetLocation}>위치 가져오기</button>
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // 자동 감시 모드 / Auto watch mode
 * const { position, error, loading, isWatching, startWatching, stopWatching } = useGeolocation({
 *   watch: true,
 *   enableHighAccuracy: true,
 *   timeout: 5000,
 * });
 *
 * return (
 *   <div>
 *     {isWatching ? (
 *       <button onClick={stopWatching}>감시 중지</button>
 *     ) : (
 *       <button onClick={startWatching}>감시 시작</button>
 *     )}
 *     {position && (
 *       <p>
 *         실시간 위치: {position.latitude}, {position.longitude}
 *       </p>
 *     )}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // 고정밀 위치 정보 / High accuracy location
 * const { position, error, loading, getCurrentPosition } = useGeolocation({
 *   enableHighAccuracy: true,
 *   timeout: 15000,
 *   maximumAge: 300000, // 5분 캐시
 * });
 *
 * const handleGetPreciseLocation = async () => {
 *   try {
 *     await getCurrentPosition({
 *       enableHighAccuracy: true,
 *       timeout: 20000,
 *     });
 *   } catch (error) {
 *     console.error('고정밀 위치 정보 가져오기 실패:', error);
 *   }
 * };
 * ```
 *
 */
export function useGeolocation(options: UseGeolocationOptions = {}): UseGeolocationReturn {
	const { enableHighAccuracy = false, timeout = 10000, maximumAge = 0, watch = false } = options;

	const [position, setPosition] = useState<GeolocationPosition | null>(null);
	const [error, setError] = useState<GeolocationError | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [isWatching, setIsWatching] = useState<boolean>(false);
	const watchIdRef = useRef<number | null>(null);
	const isWatchingRef = useRef<boolean>(false);

	// Geolocation API 지원 여부 확인 (최적화)
	const supported = useMemo(
		() => typeof navigator !== 'undefined' && 'geolocation' in navigator,
		[],
	);

	// 브라우저 위치 정보를 GeolocationPosition 형태로 변환
	const convertPosition = useCallback(
		(browserPosition: globalThis.GeolocationPosition): GeolocationPosition => ({
			latitude: browserPosition.coords.latitude,
			longitude: browserPosition.coords.longitude,
			accuracy: browserPosition.coords.accuracy,
			altitude: browserPosition.coords.altitude ?? null,
			altitudeAccuracy: browserPosition.coords.altitudeAccuracy ?? null,
			heading: browserPosition.coords.heading ?? null,
			speed: browserPosition.coords.speed ?? null,
			timestamp: browserPosition.timestamp,
		}),
		[],
	);

	// Convert browser error to GeolocationError format
	const convertError = useCallback(
		(browserError: GeolocationPositionError): GeolocationError => ({
			code: browserError.code,
			message:
				ERROR_MESSAGES[browserError.code as keyof typeof ERROR_MESSAGES] || browserError.message,
		}),
		[],
	);

	// Function to get current location
	const getCurrentPosition = useCallback(
		async (customOptions?: PositionOptions): Promise<GeolocationPosition> => {
			if (!supported) {
				throw new Error('Geolocation API is not supported in this browser');
			}
			setLoading(true);
			setError(null);

			return new Promise((resolve, reject) => {
				const opts: PositionOptions = {
					enableHighAccuracy,
					timeout,
					maximumAge,
					...customOptions,
				};
				navigator.geolocation.getCurrentPosition(
					(browserPosition) => {
						const converted = convertPosition(browserPosition);
						setPosition(converted);
						setLoading(false);
						resolve(converted);
					},
					(browserError) => {
						const converted = convertError(browserError);
						setError(converted);
						setLoading(false);
						reject(converted);
					},
					opts,
				);
			});
		},
		[supported, enableHighAccuracy, timeout, maximumAge, convertPosition, convertError],
	);

	// Function to start location watching
	const startWatching = useCallback(
		(customOptions?: PositionOptions) => {
			if (!supported) {
				console.warn('Geolocation API is not supported in this browser');
				return;
			}
			if (isWatchingRef.current) return;

			const opts: PositionOptions = {
				enableHighAccuracy,
				timeout,
				maximumAge,
				...customOptions,
			};
			watchIdRef.current = navigator.geolocation.watchPosition(
				(browserPosition) => {
					setPosition(convertPosition(browserPosition));
					setError(null);
				},
				(browserError) => {
					setError(convertError(browserError));
				},
				opts,
			);
			isWatchingRef.current = true;
			setIsWatching(true);
		},
		[supported, enableHighAccuracy, timeout, maximumAge, convertPosition, convertError],
	);

	// Function to stop location watching
	const stopWatching = useCallback(() => {
		if (watchIdRef.current !== null) {
			navigator.geolocation.clearWatch(watchIdRef.current);
			watchIdRef.current = null;
			isWatchingRef.current = false;
			setIsWatching(false);
		}
	}, []);

	// Auto start/stop watching based on watch option and cleanup on unmount
	useEffect(() => {
		if (watch && supported) {
			startWatching();
		} else if (!watch && isWatchingRef.current) {
			stopWatching();
		}
		return () => {
			if (watchIdRef.current !== null) {
				navigator.geolocation.clearWatch(watchIdRef.current);
				watchIdRef.current = null;
			}
		};
	}, [watch, supported, startWatching, stopWatching]);

	return {
		position,
		error,
		loading,
		supported,
		getCurrentPosition,
		startWatching,
		stopWatching,
		isWatching,
	};
}

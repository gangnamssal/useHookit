import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/**
 * 위치 정보 타입
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
 * 위치 정보 에러 타입
 */
export interface GeolocationError {
	code: number;
	message: string;
}

/**
 * useGeolocation 훅 옵션 타입
 */
export interface UseGeolocationOptions {
	/** 위치 정보 요청 시 옵션 */
	enableHighAccuracy?: boolean;
	/** 위치 정보 요청 타임아웃 (ms) */
	timeout?: number;
	/** 위치 정보 캐시 시간 (ms) */
	maximumAge?: number;
	/** 자동으로 위치 정보를 가져올지 여부 */
	watch?: boolean;
}

/**
 * useGeolocation 훅 반환 타입
 */
export interface UseGeolocationReturn {
	/** 현재 위치 정보 */
	position: GeolocationPosition | null;
	/** 위치 정보 에러 */
	error: GeolocationError | null;
	/** 위치 정보 로딩 상태 */
	loading: boolean;
	/** 위치 정보 지원 여부 */
	supported: boolean;
	/** 현재 위치 정보를 가져오는 함수 */
	getCurrentPosition: (options?: PositionOptions) => Promise<GeolocationPosition>;
	/** 위치 정보 감시를 시작하는 함수 */
	startWatching: (options?: PositionOptions) => void;
	/** 위치 정보 감시를 중지하는 함수 */
	stopWatching: () => void;
	/** 위치 정보 감시 중인지 여부 */
	isWatching: boolean;
}

const ERROR_MESSAGES = {
	1: 'PERMISSION_DENIED: 위치 정보 접근 권한이 거부되었습니다.',
	2: 'POSITION_UNAVAILABLE: 위치 정보를 사용할 수 없습니다.',
	3: 'TIMEOUT: 위치 정보 요청 시간이 초과되었습니다.',
} as const;

/**
 *
 * 브라우저의 Geolocation API를 활용하여 위치 정보를 관리하는 커스텀 훅입니다.
 *
 * A custom hook that manages location information using the browser's Geolocation API.
 *
 * @param {UseGeolocationOptions} [options] - 위치 정보 요청 옵션 / Geolocation request options
 *
 * @param {boolean} [options.enableHighAccuracy] - 고정밀 위치 정보 요청 여부 (기본값: false) / Whether to request high accuracy location (default: false)
 *
 * @param {number} [options.timeout] - 위치 정보 요청 타임아웃 (ms, 기본값: 10000) / Timeout for location request (ms, default: 10000)
 *
 * @param {number} [options.maximumAge] - 위치 정보 캐시 시간 (ms, 기본값: 0) / Maximum age of cached location (ms, default: 0)
 *
 * @param {boolean} [options.watch] - 자동으로 위치 정보를 감시할지 여부 (기본값: false) / Whether to automatically watch location (default: false)
 *
 * @returns {UseGeolocationReturn} 위치 정보 관리 객체 / Location management object
 *
 * @returns {GeolocationPosition | null} position - 현재 위치 정보 / Current location information
 *
 * @returns {GeolocationError | null} error - 위치 정보 에러 / Location error
 *
 * @returns {boolean} loading - 위치 정보 로딩 상태 / Location loading state
 *
 * @returns {boolean} supported - 위치 정보 지원 여부 / Location support status
 *
 * @returns {(options?: PositionOptions) => Promise<GeolocationPosition>} getCurrentPosition - 현재 위치 정보를 가져오는 함수 / Function to get current location
 *
 * @returns {(options?: PositionOptions) => void} startWatching - 위치 정보 감시를 시작하는 함수 / Function to start location watching
 *
 * @returns {() => void} stopWatching - 위치 정보 감시를 중지하는 함수 / Function to stop location watching
 *
 * @returns {boolean} isWatching - 위치 정보 감시 중인지 여부 / Whether location watching is active
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

	// 브라우저 에러를 GeolocationError 형태로 변환
	const convertError = useCallback(
		(browserError: GeolocationPositionError): GeolocationError => ({
			code: browserError.code,
			message:
				ERROR_MESSAGES[browserError.code as keyof typeof ERROR_MESSAGES] || browserError.message,
		}),
		[],
	);

	// 현재 위치 정보를 가져오는 함수
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

	// 위치 정보 감시를 시작하는 함수
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

	// 위치 정보 감시를 중지하는 함수
	const stopWatching = useCallback(() => {
		if (watchIdRef.current !== null) {
			navigator.geolocation.clearWatch(watchIdRef.current);
			watchIdRef.current = null;
			isWatchingRef.current = false;
			setIsWatching(false);
		}
	}, []);

	// watch 옵션에 따라 자동 감시 시작/중지 및 언마운트 시 cleanup
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

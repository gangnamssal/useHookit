import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useIsMounted } from '../lifecycle/useIsMounted';

/**
 * Geolocation position type
 */
export interface GeolocationPosition {
	/** Latitude (decimal degrees) */
	latitude: number;

	/** Longitude (decimal degrees) */
	longitude: number;

	/** Position accuracy (meters, optional) */
	accuracy?: number;

	/** Altitude (meters, optional, null possible) */
	altitude?: number | null;

	/** Altitude accuracy (meters, optional, null possible) */
	altitudeAccuracy?: number | null;

	/** Heading (degree, optional, null possible) */
	heading?: number | null;

	/** Speed (m/s, optional, null possible) */
	speed?: number | null;

	/** Timestamp when position was measured (timestamp, ms) */
	timestamp: number;
}

/**
 * Geolocation error type
 */
export interface GeolocationError {
	/** Error code */
	code: number;

	/** Error message */
	message: string;
}

/**
 * useGeolocation hook options type
 */
export interface UseGeolocationOptions {
	/** Whether to request high accuracy location (default: false) */
	enableHighAccuracy?: boolean;

	/** Timeout for location request (ms, default: 10000) */
	timeout?: number;

	/** Maximum age of cached location (ms, default: 0) */
	maximumAge?: number;

	/** Whether to automatically watch location (default: false) */
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
	1: 'PERMISSION_DENIED: Location access permission denied.',
	2: 'POSITION_UNAVAILABLE: Location information unavailable.',
	3: 'TIMEOUT: Location request timeout.',
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
 * // Basic usage
 * const { position, error, loading, getCurrentPosition } = useGeolocation();
 *
 * const handleGetLocation = async () => {
 *   try {
 *     await getCurrentPosition();
 *   } catch (error) {
 *     console.error('Failed to get location:', error);
 *   }
 * };
 *
 * return (
 *   <div>
 *     {loading && <p>Getting location...</p>}
 *     {error && <p>Error: {error.message}</p>}
 *     {position && (
 *       <p>
 *         Latitude: {position.latitude}, Longitude: {position.longitude}
 *       </p>
 *     )}
 *     <button onClick={handleGetLocation}>Get Location</button>
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Auto watch mode
 * const { position, error, loading, isWatching, startWatching, stopWatching } = useGeolocation({
 *   watch: true,
 *   enableHighAccuracy: true,
 *   timeout: 5000,
 * });
 *
 * return (
 *   <div>
 *     {isWatching ? (
 *       <button onClick={stopWatching}>Stop Watching</button>
 *     ) : (
 *       <button onClick={startWatching}>Start Watching</button>
 *     )}
 *     {position && (
 *       <p>
 *         Real-time location: {position.latitude}, {position.longitude}
 *       </p>
 *     )}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // High accuracy location
 * const { position, error, loading, getCurrentPosition } = useGeolocation({
 *   enableHighAccuracy: true,
 *   timeout: 15000,
 *   maximumAge: 300000, // 5 minute cache
 * });
 *
 * const handleGetPreciseLocation = async () => {
 *   try {
 *     await getCurrentPosition({
 *       enableHighAccuracy: true,
 *       timeout: 20000,
 *     });
 *   } catch (error) {
 *     console.error('Failed to get precise location:', error);
 *   }
 * };
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-usegeolocation--docs
 */
export function useGeolocation(options: UseGeolocationOptions = {}): UseGeolocationReturn {
	const { enableHighAccuracy = false, timeout = 10000, maximumAge = 0, watch = false } = options;

	const isMounted = useIsMounted();

	const [position, setPosition] = useState<GeolocationPosition | null>(null);
	const [error, setError] = useState<GeolocationError | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [isWatching, setIsWatching] = useState<boolean>(false);
	const watchIdRef = useRef<number | null>(null);
	const isWatchingRef = useRef<boolean>(false);

	// Check if Geolocation API is supported (optimized)
	const supported = useMemo(
		() => isMounted && typeof navigator !== 'undefined' && 'geolocation' in navigator,
		[isMounted],
	);

	// Convert browser position to GeolocationPosition format
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
			if (!isMounted) {
				throw new Error('Cannot get location during SSR');
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
						if (isMounted) {
							const converted = convertPosition(browserPosition);
							setPosition(converted);
							setLoading(false);
							resolve(converted);
						}
					},
					(browserError) => {
						if (isMounted) {
							const converted = convertError(browserError);
							setError(converted);
							setLoading(false);
							reject(converted);
						}
					},
					opts,
				);
			});
		},
		[supported, enableHighAccuracy, timeout, maximumAge, convertPosition, convertError, isMounted],
	);

	// Function to start location watching
	const startWatching = useCallback(
		(customOptions?: PositionOptions) => {
			if (!supported) {
				if (isMounted) {
					console.warn('Geolocation API is not supported in this browser');
				}
				return;
			}
			if (!isMounted) {
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
					if (isMounted) {
						setPosition(convertPosition(browserPosition));
						setError(null);
					}
				},
				(browserError) => {
					if (isMounted) {
						setError(convertError(browserError));
					}
				},
				opts,
			);
			isWatchingRef.current = true;
			setIsWatching(true);
		},
		[supported, enableHighAccuracy, timeout, maximumAge, convertPosition, convertError, isMounted],
	);

	// Function to stop location watching
	const stopWatching = useCallback(() => {
		if (watchIdRef.current !== null && isMounted) {
			navigator.geolocation.clearWatch(watchIdRef.current);
			watchIdRef.current = null;
			isWatchingRef.current = false;
			setIsWatching(false);
		}
	}, [isMounted]);

	// Auto start/stop watching based on watch option and cleanup on unmount
	useEffect(() => {
		if (watch && supported && isMounted) {
			startWatching();
		} else if (!watch && isWatchingRef.current) {
			stopWatching();
		}
		return () => {
			if (watchIdRef.current !== null && isMounted) {
				navigator.geolocation.clearWatch(watchIdRef.current);
				watchIdRef.current = null;
			}
		};
	}, [watch, supported, startWatching, stopWatching, isMounted]);

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

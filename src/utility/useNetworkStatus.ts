import { useState, useEffect, useCallback } from 'react';

interface UseNetworkStatusOptions {
	/** Initial online status (default: navigator.onLine) */
	initialOnline?: boolean;

	/** Online status message (default: 'Online') */
	onlineMessage?: string;

	/** Offline status message (default: 'Offline') */
	offlineMessage?: string;

	/** Whether to log status changes to console (default: false) */
	showStatusMessage?: boolean;
}

/**
 * A hook that detects network connection status
 *
 * @param {UseNetworkStatusOptions} [options] - Hook options
 *
 * @param {boolean} [options.initialOnline] - Initial online status (default: navigator.onLine)
 *
 * @param {string} [options.onlineMessage] - Online status message (default: 'Online')
 *
 * @param {string} [options.offlineMessage] - Offline status message (default: 'Offline')
 *
 * @param {boolean} [options.showStatusMessage] - Whether to log status changes to console (default: false)
 *
 * @returns {boolean} isOnline - Whether online
 *
 * @returns {boolean} isOffline - Whether offline
 *
 * @returns {string} statusMessage - Current status message
 *
 * @returns {Date} lastOnline - Last online time
 *
 * @returns {Date} lastOffline - Last offline time
 *
 * @returns {() => void} refreshStatus - Status refresh function
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { isOnline, isOffline } = useNetworkStatus();
 *
 * return (
 *   <div>
 *     <div>Network status: {isOnline ? 'Online' : 'Offline'}</div>
 *     {isOffline && <OfflineBanner />}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Custom options usage
 * const { isOnline, statusMessage, lastOnline } = useNetworkStatus({
 *   onlineMessage: 'Internet connected',
 *   offlineMessage: 'Internet disconnected',
 *   showStatusMessage: true
 * });
 *
 * return (
 *   <div>
 *     <div>{statusMessage}</div>
 *     {isOnline && (
 *       <div>
 *         Last online: {lastOnline?.toLocaleString()}
 *       </div>
 *     )}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Show alternative UI when offline
 * const { isOnline, isOffline } = useNetworkStatus();
 *
 * return (
 *   <div>
 *     {isOnline ? (
 *       <OnlineContent />
 *     ) : (
 *       <OfflineContent />
 *     )}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Detect network status changes
 * const { isOnline, lastOnline, lastOffline } = useNetworkStatus();
 *
 * useEffect(() => {
 *   if (isOnline) {
 *     console.log('Network connected:', lastOnline);
 *     // Data synchronization logic
 *     syncData();
 *   } else {
 *     console.log('Network disconnected:', lastOffline);
 *     // Enable offline mode
 *     enableOfflineMode();
 *   }
 * }, [isOnline, lastOnline, lastOffline]);
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-usenetworkstatus--docs
 */
export function useNetworkStatus(options: UseNetworkStatusOptions = {}) {
	const {
		initialOnline,
		onlineMessage = 'Online',
		offlineMessage = 'Offline',
		showStatusMessage = false,
	} = options;

	const hasInitialOnline = typeof initialOnline === 'boolean';

	const [isOnline, setIsOnline] = useState(() => {
		if (hasInitialOnline) return !!initialOnline;
		if (typeof window !== 'undefined' && typeof navigator.onLine === 'boolean') {
			return navigator.onLine;
		}
		return true;
	});

	const [lastOnline, setLastOnline] = useState<Date | null>(null);
	const [lastOffline, setLastOffline] = useState<Date | null>(null);

	const updateNetworkStatus = useCallback(
		(online: boolean) => {
			const now = new Date();
			if (online && !isOnline) {
				setIsOnline(true);
				setLastOnline(now);
				if (showStatusMessage) {
					console.log('useNetworkStatus: 네트워크 연결됨');
				}
			} else if (!online && isOnline) {
				setIsOnline(false);
				setLastOffline(now);
				if (showStatusMessage) {
					console.log('useNetworkStatus: 네트워크 연결 끊김');
				}
			}
		},
		[isOnline, showStatusMessage],
	);

	const refreshStatus = useCallback(() => {
		let actualStatus: boolean;
		if (hasInitialOnline) {
			actualStatus = !!initialOnline;
		} else if (typeof window !== 'undefined' && typeof navigator.onLine === 'boolean') {
			actualStatus = navigator.onLine;
		} else {
			actualStatus = true;
		}
		updateNetworkStatus(actualStatus);
	}, [hasInitialOnline, initialOnline, updateNetworkStatus]);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		if (typeof navigator.onLine === 'undefined') return;

		// Initial state synchronization
		if (!hasInitialOnline) {
			updateNetworkStatus(navigator.onLine);
		}

		const handleOnline = () => {
			try {
				updateNetworkStatus(true);
			} catch {
				// 에러 무시
			}
		};

		const handleOffline = () => {
			try {
				updateNetworkStatus(false);
			} catch {
				// 에러 무시
			}
		};

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, [updateNetworkStatus, hasInitialOnline]);

	const statusMessage = isOnline ? onlineMessage : offlineMessage;

	return {
		isOnline,
		isOffline: !isOnline,
		statusMessage,
		lastOnline,
		lastOffline,
		refreshStatus,
	};
}

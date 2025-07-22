import { useState, useEffect, useCallback } from 'react';

interface UseNetworkStatusOptions {
	initialOnline?: boolean;
	onlineMessage?: string;
	offlineMessage?: string;
	showStatusMessage?: boolean;
}

/**
 * 네트워크 연결 상태를 감지하는 훅
 *
 * @param options - 훅 옵션
 *
 * @param options.initialOnline - 초기 온라인 상태 (기본값: navigator.onLine)
 *
 * @param options.onlineMessage - 온라인 상태 메시지 (기본값: '온라인')
 *
 * @param options.offlineMessage - 오프라인 상태 메시지 (기본값: '오프라인')
 *
 * @param options.showStatusMessage - 상태 변화 시 콘솔 메시지 출력 여부 (기본값: false)
 *
 * @returns 네트워크 상태 정보
 *
 * @returns isOnline - 온라인 상태 여부
 *
 * @returns isOffline - 오프라인 상태 여부
 *
 * @returns statusMessage - 현재 상태 메시지
 *
 * @returns lastOnline - 마지막 온라인 시간
 *
 * @returns lastOffline - 마지막 오프라인 시간
 *
 * @returns onlineDuration - 온라인 지속 시간 (밀리초)
 *
 * @returns offlineDuration - 오프라인 지속 시간 (밀리초)
 *
 * @returns refreshStatus - 상태 새로고침 함수
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
 * const { isOnline, isOffline } = useNetworkStatus();
 *
 * return (
 *   <div>
 *     <div>네트워크 상태: {isOnline ? '온라인' : '오프라인'}</div>
 *     {isOffline && <OfflineBanner />}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // 커스텀 옵션 사용 / Custom options usage
 * const { isOnline, statusMessage, lastOnline, onlineDuration } = useNetworkStatus({
 *   onlineMessage: '인터넷 연결됨',
 *   offlineMessage: '인터넷 연결 끊김',
 *   showStatusMessage: true
 * });
 *
 * return (
 *   <div>
 *     <div>{statusMessage}</div>
 *     {isOnline && (
 *       <div>
 *         마지막 온라인: {lastOnline?.toLocaleString()}
 *         온라인 지속 시간: {Math.floor(onlineDuration / 1000)}초
 *       </div>
 *     )}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // 오프라인 시 대체 UI 표시 / Show alternative UI when offline
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
 * // 네트워크 상태 변화 감지 / Detect network status changes
 * const { isOnline, lastOnline, lastOffline } = useNetworkStatus();
 *
 * useEffect(() => {
 *   if (isOnline) {
 *     console.log('네트워크 연결됨:', lastOnline);
 *     // 데이터 동기화 로직
 *     syncData();
 *   } else {
 *     console.log('네트워크 연결 끊김:', lastOffline);
 *     // 오프라인 모드 활성화
 *     enableOfflineMode();
 *   }
 * }, [isOnline, lastOnline, lastOffline]);
 * ```
 *
 */
export function useNetworkStatus(options: UseNetworkStatusOptions = {}) {
	const {
		initialOnline,
		onlineMessage = '온라인',
		offlineMessage = '오프라인',
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
	const [onlineStartTime, setOnlineStartTime] = useState<Date | null>(() => {
		if (hasInitialOnline) return initialOnline ? new Date() : null;
		if (typeof window !== 'undefined' && typeof navigator.onLine === 'boolean') {
			return navigator.onLine ? new Date() : null;
		}
		return new Date();
	});
	const [offlineStartTime, setOfflineStartTime] = useState<Date | null>(() => {
		if (hasInitialOnline) return !initialOnline ? new Date() : null;
		if (typeof window !== 'undefined' && typeof navigator.onLine === 'boolean') {
			return !navigator.onLine ? new Date() : null;
		}
		return null;
	});

	const updateNetworkStatus = useCallback(
		(online: boolean) => {
			const now = new Date();
			if (online && !isOnline) {
				setIsOnline(true);
				setLastOnline(now);
				setOnlineStartTime(now);
				setOfflineStartTime(null);
				if (showStatusMessage && typeof console !== 'undefined' && console.log) {
					console.log('useNetworkStatus: 네트워크 연결됨');
				}
			} else if (!online && isOnline) {
				setIsOnline(false);
				setLastOffline(now);
				setOfflineStartTime(now);
				setOnlineStartTime(null);
				if (showStatusMessage && typeof console !== 'undefined' && console.log) {
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

		// 초기 상태 동기화
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

	const onlineDuration = useCallback(() => {
		if (!onlineStartTime || !isOnline) return 0;
		return Date.now() - onlineStartTime.getTime();
	}, [onlineStartTime, isOnline]);

	const offlineDuration = useCallback(() => {
		if (!offlineStartTime || isOnline) return 0;
		return Date.now() - offlineStartTime.getTime();
	}, [offlineStartTime, isOnline]);

	const statusMessage = isOnline ? onlineMessage : offlineMessage;

	return {
		isOnline,
		isOffline: !isOnline,
		statusMessage,
		lastOnline,
		lastOffline,
		onlineDuration: onlineDuration(),
		offlineDuration: offlineDuration(),
		refreshStatus,
	};
}

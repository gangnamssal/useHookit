import { useNetworkStatus } from '@/utility/useNetworkStatus';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'Utility/useNetworkStatus',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
A React hook that provides comprehensive network status management for detecting online/offline connectivity. Simplifies network status monitoring in React components with automatic cleanup and real-time updates.

## API

### Parameters
- **options**: UseNetworkStatusOptions - Network status configuration options
- **Usage Example**: useNetworkStatus({ onlineMessage: 'Connected', offlineMessage: 'Disconnected' });

### Return Value
- **Type**: NetworkStatusInfo
- **Description**: Returns network status information including online/offline state and timestamps
- **Usage Example**: const { isOnline, isOffline, statusMessage } = useNetworkStatus();

### Parameters Properties
- **initialOnline**: boolean (optional) - Initial online status (default: navigator.onLine)
- **onlineMessage**: string (optional) - Online status message (default: '온라인')
- **offlineMessage**: string (optional) - Offline status message (default: '오프라인')
- **showStatusMessage**: boolean (optional) - Whether to log status changes to console (default: false)

### Return Value Properties
- **isOnline**: boolean - Whether the device is currently online
- **isOffline**: boolean - Whether the device is currently offline
- **statusMessage**: string - Current status message (online or offline message)
- **lastOnline**: Date | null - Timestamp of last online event
- **lastOffline**: Date | null - Timestamp of last offline event
- **refreshStatus**: () => void - Function to manually refresh network status

## Usage Examples

\`\`\`tsx
// Basic network status usage
const { isOnline, isOffline, statusMessage } = useNetworkStatus();

return (
  <div>
    <p>상태: {isOnline ? '🟢 온라인' : '🔴 오프라인'}</p>
    <p>메시지: {statusMessage}</p>
    {isOffline && <p>⚠️ 오프라인 모드</p>}
  </div>
);

// Custom options usage
const { isOnline, statusMessage, lastOnline } = useNetworkStatus({
  onlineMessage: '인터넷 연결됨',
  offlineMessage: '인터넷 연결 끊김',
  showStatusMessage: true
});

return (
  <div>
    <p>{statusMessage}</p>
    {isOnline && lastOnline && (
      <p>마지막 연결: {lastOnline.toLocaleString()}</p>
    )}
  </div>
);

// Alternative UI based on network status
const { isOnline, isOffline } = useNetworkStatus();

return (
  <div>
    {isOnline ? (
      <div>
        <h2>온라인 콘텐츠</h2>
        <p>실시간 데이터를 표시합니다.</p>
      </div>
    ) : (
      <div>
        <h2>오프라인 콘텐츠</h2>
        <p>캐시된 데이터를 표시합니다.</p>
      </div>
    )}
  </div>
);

// Network status change detection
const { isOnline, lastOnline, lastOffline } = useNetworkStatus();

useEffect(() => {
  if (isOnline) {
    console.log('네트워크 연결됨:', lastOnline);
    syncData();
  } else {
    console.log('네트워크 연결 끊김:', lastOffline);
    enableOfflineMode();
  }
}, [isOnline, lastOnline, lastOffline]);

// Manual status refresh
const { isOnline, refreshStatus } = useNetworkStatus();

return (
  <div>
    <p>상태: {isOnline ? '온라인' : '오프라인'}</p>
    <button onClick={refreshStatus}>상태 새로고침</button>
  </div>
);
\`\`\`

### Key Features

- **Browser compatibility**: Checks for window and navigator.onLine support with fallback to true
- **Initial state handling**: Complex initialization logic with hasInitialOnline check
- **Real-time updates**: Automatically updates when network status changes via online/offline events
- **Memory-safe operations**: Properly cleans up event listeners on unmount
- **Error handling**: Graceful error handling with try-catch blocks in event handlers
- **Event listener management**: Uses addEventListener/removeEventListener for online/offline events
- **State change optimization**: Only updates state when status actually changes
- **Timestamp tracking**: Records lastOnline and lastOffline timestamps
- **Console logging**: Optional status change logging with showStatusMessage option
- **Manual refresh**: Provides refreshStatus function for manual status updates
- **Type safety**: Full TypeScript support with proper interface definitions
- **Performance optimized**: Efficient event listener management and state updates

### Implementation Details

- **Window validation**: Checks for typeof window !== 'undefined' before accessing navigator
- **Navigator validation**: Checks for typeof navigator.onLine === 'boolean' support
- **Initial state logic**: Uses hasInitialOnline flag to determine initial state source
- **State change detection**: Only updates state when online status actually changes
- **Event listener pattern**: Uses online/offline events for real-time updates
- **Cleanup mechanism**: Removes event listeners in useEffect cleanup
- **Error boundary**: Wraps event handlers in try-catch for error handling
- **State management**: Uses useState for tracking online status and timestamps
- **Callback optimization**: Uses useCallback for updateNetworkStatus and refreshStatus
- **Memory leak prevention**: Proper cleanup prevents memory leaks
- **Real-time responsiveness**: Immediate updates when network status changes
- **Fallback mechanism**: Defaults to true when navigator.onLine is not available
				`,
			},
			// Canvas 완전히 숨기기
			canvas: {
				sourceState: 'none',
				hidden: true,
			},
			// 스토리 렌더링 비활성화
			story: {
				iframeHeight: '0px',
				inline: false,
			},
			// 스토리 자체를 Docs에서 비활성화
			disable: true,
		},
	},
	tags: ['utility', 'network', 'online', 'offline', 'autodocs'],
};

// 코드 스니펫들
const basicCode = `const { isOnline, isOffline, statusMessage } = useNetworkStatus();

return (
  <div>
    <p>상태: {isOnline ? '🟢 온라인' : '🔴 오프라인'}</p>
    <p>메시지: {statusMessage}</p>
    {isOffline && <p>⚠️ 오프라인 모드</p>}
  </div>
);`;

const offlineUIExampleCode = `const { isOnline } = useNetworkStatus();

return (
  <div>
    {isOnline ? (
      <div>
        <h2>온라인 콘텐츠</h2>
        <p>실시간 데이터를 표시합니다.</p>
      </div>
    ) : (
      <div>
        <h2>오프라인 콘텐츠</h2>
        <p>캐시된 데이터를 표시합니다.</p>
      </div>
    )}
  </div>
);`;

export const Default = () => {
	const { isOnline, isOffline, statusMessage } = useNetworkStatus();

	return (
		<ToggleComponent
			code={basicCode}
			title='기본 사용법'
			description='useNetworkStatus 훅의 기본적인 사용법을 보여줍니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>기본 사용법</h3>
				<p>네트워크 연결 상태를 감지하는 훅입니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							padding: '15px',
							backgroundColor: isOnline ? '#d4edda' : '#f8d7da',
							borderRadius: '4px',
							border: `1px solid ${isOnline ? '#c3e6cb' : '#f5c6cb'}`,
							color: isOnline ? '#155724' : '#721c24',
						}}
					>
						<p>
							<strong>상태:</strong> {isOnline ? '🟢 온라인' : '🔴 오프라인'}
						</p>
						<p>
							<strong>메시지:</strong> {statusMessage}
						</p>
						{isOffline && (
							<p>
								<strong>⚠️ 오프라인 모드:</strong> 일부 기능이 제한될 수 있습니다.
							</p>
						)}
					</div>
				</div>

				<div
					style={{
						padding: '15px',
						backgroundColor: '#fff3cd',
						borderRadius: '4px',
						border: '1px solid #ffeaa7',
						marginBottom: '20px',
					}}
				>
					<p>
						<strong>💡 테스트 방법:</strong>
					</p>
					<ol>
						<li>브라우저 개발자 도구를 엽니다 (F12)</li>
						<li>Network 탭으로 이동합니다</li>
						<li>"Offline" 체크박스를 클릭하여 오프라인 상태를 시뮬레이션합니다</li>
						<li>다시 체크를 해제하여 온라인 상태로 돌아갑니다</li>
					</ol>
				</div>

				<div
					style={{
						padding: '15px',
						backgroundColor: '#f8f9fa',
						borderRadius: '4px',
						border: '1px solid #dee2e6',
					}}
				>
					<p>
						<strong>사용 사례:</strong>
					</p>
					<ul>
						<li>오프라인 상태일 때 대체 UI 표시</li>
						<li>네트워크 상태 변경 시 데이터 동기화</li>
						<li>사용자에게 네트워크 상태 알림</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithOfflineUI = () => {
	const { isOnline } = useNetworkStatus();

	return (
		<ToggleComponent
			code={offlineUIExampleCode}
			title='오프라인 UI'
			description='네트워크 상태에 따라 다른 UI를 표시하는 예제입니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>오프라인 UI 예제</h3>
				<p>네트워크 상태에 따라 다른 UI를 표시합니다.</p>

				{isOnline ? (
					<div
						style={{
							padding: '20px',
							backgroundColor: '#d4edda',
							borderRadius: '8px',
							border: '1px solid #c3e6cb',
							color: '#155724',
						}}
					>
						<h4>🟢 온라인 콘텐츠</h4>
						<p>실시간 데이터를 표시합니다.</p>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
								gap: '15px',
								marginTop: '15px',
							}}
						>
							<div
								style={{
									padding: '15px',
									backgroundColor: '#ffffff',
									borderRadius: '4px',
									border: '1px solid #dee2e6',
								}}
							>
								<h5>실시간 데이터</h5>
								<p>서버에서 실시간으로 가져온 최신 정보입니다.</p>
							</div>
							<div
								style={{
									padding: '15px',
									backgroundColor: '#ffffff',
									borderRadius: '4px',
									border: '1px solid #dee2e6',
								}}
							>
								<h5>동기화 기능</h5>
								<p>모든 변경사항이 서버와 동기화됩니다.</p>
							</div>
						</div>
					</div>
				) : (
					<div
						style={{
							padding: '20px',
							backgroundColor: '#f8d7da',
							borderRadius: '8px',
							border: '1px solid #f5c6cb',
							color: '#721c24',
						}}
					>
						<h4>🔴 오프라인 콘텐츠</h4>
						<p>캐시된 데이터를 표시합니다.</p>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
								gap: '15px',
								marginTop: '15px',
							}}
						>
							<div
								style={{
									padding: '15px',
									backgroundColor: '#ffffff',
									borderRadius: '4px',
									border: '1px solid #dee2e6',
								}}
							>
								<h5>캐시된 데이터</h5>
								<p>이전에 저장된 데이터를 표시합니다.</p>
							</div>
							<div
								style={{
									padding: '15px',
									backgroundColor: '#ffffff',
									borderRadius: '4px',
									border: '1px solid #dee2e6',
								}}
							>
								<h5>오프라인 모드</h5>
								<p>일부 기능이 제한됩니다.</p>
							</div>
						</div>
					</div>
				)}

				<div
					style={{
						padding: '15px',
						backgroundColor: '#fff3cd',
						borderRadius: '4px',
						border: '1px solid #ffeaa7',
						marginTop: '20px',
					}}
				>
					<p>
						<strong>💡 테스트:</strong> 개발자 도구의 Network 탭에서 "Offline" 체크박스를 사용하여
						오프라인 상태를 시뮬레이션해보세요.
					</p>
				</div>
			</div>
		</ToggleComponent>
	);
};

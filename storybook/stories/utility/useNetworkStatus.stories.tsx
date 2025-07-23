import { useNetworkStatus } from '@/utility/useNetworkStatus';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'Utility/useNetworkStatus',
	parameters: {
		layout: 'centered',
	},
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

const offlineUIExampleCode = `const { isOnline, isOffline } = useNetworkStatus();

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

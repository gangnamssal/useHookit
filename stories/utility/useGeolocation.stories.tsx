import React from 'react';
import { useGeolocation } from '../../src/utility/useGeolocation';
import { ToggleComponent } from '../components/ToggleComponent';

export default {
	title: 'Utility/useGeolocation',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
## useGeolocation 훅

브라우저의 Geolocation API를 사용하여 위치 정보를 관리하는 훅입니다.

### 기본 사용법

\`\`\`tsx
import { useGeolocation } from 'useHookit';

function MyComponent() {
  const {
    position,
    error,
    loading,
    supported,
    getCurrentPosition,
    startWatching,
    stopWatching,
    isWatching,
  } = useGeolocation({
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 0,
    watch: false,
  });

  return (
    <div>
      {supported ? (
        <button onClick={getCurrentPosition}>
          {loading ? '위치 가져오는 중...' : '위치 가져오기'}
        </button>
      ) : (
        <p>Geolocation을 지원하지 않습니다.</p>
      )}
      
      {position && (
        <p>
          위도: {position.latitude}, 경도: {position.longitude}
        </p>
      )}
      
      {error && <p>오류: {error.message}</p>}
    </div>
  );
}
\`\`\`

### 매개변수

- \`enableHighAccuracy\`: 고정밀 위치 정보 사용 여부
- \`timeout\`: 위치 정보 요청 타임아웃 (밀리초)
- \`maximumAge\`: 캐시된 위치 정보 최대 나이 (밀리초)
- \`watch\`: 위치 감시 모드 사용 여부

### 반환값

- \`position\`: 위치 정보 객체
- \`error\`: 오류 정보
- \`loading\`: 로딩 상태
- \`supported\`: Geolocation 지원 여부
- \`getCurrentPosition\`: 현재 위치 가져오기 함수
- \`startWatching\`: 위치 감시 시작 함수
- \`stopWatching\`: 위치 감시 중지 함수
- \`isWatching\`: 감시 상태
				`,
			},
		},
	},
};

function UseGeolocationDemo() {
	const {
		position,
		error,
		loading,
		supported,
		getCurrentPosition,
		startWatching,
		stopWatching,
		isWatching,
	} = useGeolocation();

	const handleGetPosition = async () => {
		try {
			console.log('위치 정보 요청 시작...');
			await getCurrentPosition();
			console.log('위치 정보 성공적으로 가져옴');
		} catch (err) {
			console.error('위치 정보 가져오기 실패:', err);
			// 에러 정보를 더 자세히 표시
			if (err instanceof Error) {
				console.error('에러 타입:', err.constructor.name);
				console.error('에러 메시지:', err.message);
			}
		}
	};

	const handleStartWatching = () => {
		startWatching();
	};

	const handleStopWatching = () => {
		stopWatching();
	};

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>useGeolocation 훅 데모</h3>
			<p>브라우저의 Geolocation API를 사용하여 위치 정보를 관리하는 훅입니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<p>
					<strong>지원 상태:</strong> {supported ? '✅ 지원됨' : '❌ 지원되지 않음'}
				</p>
				<p>
					<strong>로딩 상태:</strong> {loading ? '🔄 로딩 중...' : '⏸️ 대기 중'}
				</p>
				<p>
					<strong>감시 상태:</strong> {isWatching ? '🔄 감시 중...' : '⏸️ 중지됨'}
				</p>
				{!supported && (
					<p style={{ color: '#dc3545', fontSize: '14px' }}>
						⚠️ 이 브라우저는 Geolocation API를 지원하지 않습니다.
					</p>
				)}
			</div>

			{error && (
				<div
					style={{
						padding: '10px',
						backgroundColor: '#f8d7da',
						color: '#721c24',
						borderRadius: '4px',
						border: '1px solid #f5c6cb',
						marginBottom: '20px',
					}}
				>
					<p>
						<strong>오류:</strong> {error.message}
					</p>
				</div>
			)}

			<div style={{ marginBottom: '20px' }}>
				<h4>위치 정보</h4>
				{position ? (
					<div
						style={{
							padding: '15px',
							backgroundColor: '#d4edda',
							borderRadius: '4px',
							border: '1px solid #c3e6cb',
						}}
					>
						<p>
							<strong>위도:</strong> {position.latitude.toFixed(6)}°
						</p>
						<p>
							<strong>경도:</strong> {position.longitude.toFixed(6)}°
						</p>
						{position.accuracy && (
							<p>
								<strong>정확도:</strong> ±{position.accuracy.toFixed(1)}m
							</p>
						)}
						<p>
							<strong>시간:</strong> {new Date(position.timestamp).toLocaleString()}
						</p>
					</div>
				) : (
					<div
						style={{
							padding: '15px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
						}}
					>
						<p>위치 정보가 없습니다.</p>
					</div>
				)}
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>제어 버튼</h4>
				<button
					onClick={handleGetPosition}
					disabled={loading || !supported}
					style={{
						padding: '10px 20px',
						backgroundColor: loading || !supported ? '#6c757d' : '#007bff',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: loading || !supported ? 'not-allowed' : 'pointer',
						marginRight: '10px',
						opacity: loading || !supported ? 0.6 : 1,
					}}
				>
					{loading ? '🔄 가져오는 중...' : '📍 위치 가져오기'}
				</button>
				{!supported && (
					<p style={{ color: '#6c757d', fontSize: '12px', marginTop: '5px' }}>
						💡 브라우저가 Geolocation API를 지원하지 않아 버튼이 비활성화되었습니다.
					</p>
				)}

				{!isWatching ? (
					<button
						onClick={handleStartWatching}
						disabled={!supported}
						style={{
							padding: '10px 20px',
							backgroundColor: !supported ? '#6c757d' : '#28a745',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: !supported ? 'not-allowed' : 'pointer',
							opacity: !supported ? 0.6 : 1,
						}}
					>
						👁️ 감시 시작
					</button>
				) : (
					<button
						onClick={handleStopWatching}
						style={{
							padding: '10px 20px',
							backgroundColor: '#dc3545',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						⏹️ 감시 중지
					</button>
				)}
			</div>

			{isWatching && (
				<div
					style={{
						padding: '10px',
						backgroundColor: '#fff3cd',
						borderRadius: '4px',
						border: '1px solid #ffeaa7',
					}}
				>
					<p style={{ margin: 0 }}>🔄 위치 감시 중... 위치가 변경되면 자동으로 업데이트됩니다.</p>
				</div>
			)}

			{!supported && (
				<div
					style={{
						padding: '15px',
						backgroundColor: '#f8d7da',
						borderRadius: '4px',
						border: '1px solid #f5c6cb',
						marginTop: '20px',
					}}
				>
					<p>
						<strong>⚠️ 주의:</strong> 이 브라우저는 Geolocation API를 지원하지 않습니다.
					</p>
				</div>
			)}

			{supported && !position && !loading && !error && (
				<div
					style={{
						padding: '15px',
						backgroundColor: '#e7f3ff',
						borderRadius: '4px',
						border: '1px solid #b3d9ff',
						marginTop: '20px',
					}}
				>
					<p>
						<strong>💡 안내:</strong> 위치 정보를 가져오려면 "📍 위치 가져오기" 버튼을 클릭하세요.
						브라우저에서 위치 정보 접근 권한을 요청할 수 있습니다.
					</p>
				</div>
			)}
		</div>
	);
}

export const Default = () => (
	<ToggleComponent
		title='기본 사용법'
		description='브라우저의 Geolocation API를 사용하여 위치 정보를 관리하는 기본 예제입니다.'
		code={`import React from 'react';
import { useGeolocation } from 'useHookit';

function UseGeolocationDemo() {
	const {
		position,
		error,
		loading,
		supported,
		getCurrentPosition,
		startWatching,
		stopWatching,
		isWatching,
	} = useGeolocation();

	const handleGetPosition = async () => {
		try {
			await getCurrentPosition();
		} catch (err) {
			console.error('위치 정보 가져오기 실패:', err);
		}
	};

	return (
		<div>
			{/* 지원 상태 확인 */}
			<p>지원: {supported ? '✅' : '❌'}</p>
			
			{/* 오류 표시 */}
			{error && <p>오류: {error.message}</p>}
			
			{/* 위치 정보 표시 */}
			{position && (
				<div>
					<p>위도: {position.latitude.toFixed(6)}°</p>
					<p>경도: {position.longitude.toFixed(6)}°</p>
					{position.accuracy && (
						<p>정확도: ±{position.accuracy.toFixed(1)}m</p>
					)}
				</div>
			)}
			
			{/* 제어 버튼 */}
			<button onClick={handleGetPosition} disabled={loading}>
				{loading ? '로딩 중...' : '위치 가져오기'}
			</button>
			
			{!isWatching ? (
				<button onClick={startWatching}>감시 시작</button>
			) : (
				<button onClick={stopWatching}>감시 중지</button>
			)}
		</div>
	);
}`}
	>
		<UseGeolocationDemo />
	</ToggleComponent>
);

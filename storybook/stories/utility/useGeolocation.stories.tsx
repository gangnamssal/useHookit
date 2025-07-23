import { useState } from 'react';
import { useGeolocation } from '@/utility/useGeolocation';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'Utility/useGeolocation',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
## useGeolocation 훅

브라우저의 Geolocation API를 사용하여 위치 정보를 관리하는 훅입니다.

### 주요 기능

- **현재 위치 가져오기**: \`getCurrentPosition()\` 함수로 현재 위치 정보를 가져옵니다
- **위치 감시**: \`startWatching()\`, \`stopWatching()\` 함수로 실시간 위치 추적
- **고정밀 위치**: \`enableHighAccuracy\` 옵션으로 더 정확한 위치 정보
- **캐시 설정**: \`maximumAge\` 옵션으로 캐시된 위치 정보 활용
- **타임아웃 설정**: \`timeout\` 옵션으로 위치 요청 시간 제한

### 매개변수

- \`enableHighAccuracy\`: 고정밀 위치 정보 사용 여부 (기본값: false)
- \`timeout\`: 위치 정보 요청 타임아웃 (밀리초, 기본값: 10000)
- \`maximumAge\`: 캐시된 위치 정보 최대 나이 (밀리초, 기본값: 0)
- \`watch\`: 자동 감시 모드 사용 여부 (기본값: false)

### 반환값

- \`position\`: 위치 정보 객체 (위도, 경도, 정확도, 고도, 방향, 속도, 타임스탬프)
- \`error\`: 오류 정보 (코드, 메시지)
- \`loading\`: 로딩 상태
- \`supported\`: Geolocation 지원 여부
- \`getCurrentPosition\`: 현재 위치 가져오기 함수
- \`startWatching\`: 위치 감시 시작 함수
- \`stopWatching\`: 위치 감시 중지 함수
- \`isWatching\`: 감시 상태

### 오류 코드

- \`1\`: PERMISSION_DENIED - 위치 정보 접근 권한이 거부됨
- \`2\`: POSITION_UNAVAILABLE - 위치 정보를 사용할 수 없음
- \`3\`: TIMEOUT - 위치 정보 요청 시간 초과

### 문제 해결

**POSITION_UNAVAILABLE 오류가 발생하는 경우:**

1. **브라우저 설정 확인**
   - 브라우저 주소창 왼쪽의 자물쇠 아이콘 클릭
   - 위치 권한을 "허용"으로 설정

2. **시스템 위치 서비스 확인**
   - macOS: 시스템 환경설정 > 보안 및 개인 정보 보호 > 위치 서비스
   - Windows: 설정 > 개인 정보 > 위치
   - 위치 서비스가 활성화되어 있는지 확인

3. **네트워크 연결 확인**
   - 인터넷 연결 상태 확인
   - VPN 사용 중이라면 일시적으로 비활성화

4. **브라우저 재시작**
   - 브라우저를 완전히 종료 후 재시작
   - 캐시 및 쿠키 삭제
				`,
			},
		},
	},
};

// 기본 사용법 데모
function BasicUsageDemo() {
	const { position, error, loading, supported, getCurrentPosition } = useGeolocation();

	const [debugInfo, setDebugInfo] = useState<string>('');

	const handleGetPosition = async () => {
		try {
			setDebugInfo('위치 정보 요청 시작...');
			await getCurrentPosition();
			setDebugInfo('위치 정보 성공적으로 가져옴!');
		} catch (err: any) {
			console.error('위치 정보 가져오기 실패:', err);
			setDebugInfo(`오류 발생: ${err.message}`);
		}
	};

	// 오류 메시지를 더 친화적으로 표시
	const getErrorMessage = (error: any) => {
		if (!error) return '';

		switch (error.code) {
			case 1:
				return '위치 정보 접근 권한이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.';
			case 2:
				return '위치 정보를 사용할 수 없습니다. 네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.';
			case 3:
				return '위치 정보 요청 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.';
			default:
				return error.message || '알 수 없는 오류가 발생했습니다.';
		}
	};

	// HTTPS 환경인지 확인 (localhost 포함)
	const isSecureContext =
		typeof window !== 'undefined' &&
		(window.isSecureContext ||
			window.location.hostname === 'localhost' ||
			window.location.hostname === '127.0.0.1');

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>기본 사용법</h3>
			<p>현재 위치 정보를 가져오는 기본적인 사용법입니다.</p>

			{/* 보안 컨텍스트 경고 */}
			{!isSecureContext && (
				<div
					style={{
						padding: '15px',
						backgroundColor: '#fff3cd',
						borderRadius: '4px',
						border: '1px solid #ffeaa7',
						marginBottom: '20px',
					}}
				>
					<p style={{ margin: 0 }}>
						<strong>⚠️ 주의:</strong> Geolocation API는 HTTPS 환경 또는 localhost에서만 작동합니다.
						현재 환경에서는 위치 정보를 가져올 수 없습니다.
					</p>
				</div>
			)}

			<div style={{ marginBottom: '20px' }}>
				<p>
					<strong>지원 상태:</strong> {supported ? '✅ 지원됨' : '❌ 지원되지 않음'}
				</p>
				<p>
					<strong>보안 컨텍스트:</strong> {isSecureContext ? '✅ 안전' : '❌ 안전하지 않음'}
				</p>
				<p>
					<strong>로딩 상태:</strong> {loading ? '🔄 로딩 중...' : '⏸️ 대기 중'}
				</p>
			</div>

			{error && (
				<div
					style={{
						padding: '15px',
						backgroundColor: '#f8d7da',
						color: '#721c24',
						borderRadius: '4px',
						border: '1px solid #f5c6cb',
						marginBottom: '20px',
					}}
				>
					<p>
						<strong>오류:</strong> {getErrorMessage(error)}
					</p>
					{error.code === 1 && (
						<div style={{ marginTop: '10px', fontSize: '14px' }}>
							<p>
								<strong>💡 해결 방법:</strong>
							</p>
							<ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
								<li>브라우저 주소창 왼쪽의 자물쇠 아이콘을 클릭</li>
								<li>위치 권한을 "허용"으로 설정</li>
								<li>페이지를 새로고침</li>
							</ul>
						</div>
					)}
					{error.code === 2 && (
						<div style={{ marginTop: '10px', fontSize: '14px' }}>
							<p>
								<strong>💡 해결 방법:</strong>
							</p>
							<ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
								<li>시스템 위치 서비스가 활성화되어 있는지 확인</li>
								<li>네트워크 연결 상태 확인</li>
								<li>VPN을 사용 중이라면 일시적으로 비활성화</li>
								<li>다른 브라우저에서 시도</li>
							</ul>
						</div>
					)}
				</div>
			)}

			{debugInfo && (
				<div
					style={{
						padding: '10px',
						backgroundColor: '#e7f3ff',
						borderRadius: '4px',
						border: '1px solid #b3d9ff',
						marginBottom: '20px',
						fontSize: '14px',
					}}
				>
					<p style={{ margin: 0 }}>
						<strong>디버그:</strong> {debugInfo}
					</p>
				</div>
			)}

			{position && (
				<div
					style={{
						padding: '15px',
						backgroundColor: '#d4edda',
						borderRadius: '4px',
						border: '1px solid #c3e6cb',
						marginBottom: '20px',
					}}
				>
					<h4>위치 정보</h4>
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
					{position.altitude && (
						<p>
							<strong>고도:</strong> {position.altitude.toFixed(1)}m
						</p>
					)}
					{position.heading && (
						<p>
							<strong>방향:</strong> {position.heading.toFixed(1)}°
						</p>
					)}
					{position.speed && (
						<p>
							<strong>속도:</strong> {position.speed.toFixed(1)}m/s
						</p>
					)}
					<p>
						<strong>시간:</strong> {new Date(position.timestamp).toLocaleString()}
					</p>
				</div>
			)}

			<button
				onClick={handleGetPosition}
				disabled={loading || !supported || !isSecureContext}
				style={{
					padding: '10px 20px',
					backgroundColor: loading || !supported || !isSecureContext ? '#6c757d' : '#007bff',
					color: 'white',
					border: 'none',
					borderRadius: '4px',
					cursor: loading || !supported || !isSecureContext ? 'not-allowed' : 'pointer',
				}}
			>
				{loading ? '🔄 가져오는 중...' : '📍 위치 가져오기'}
			</button>

			{(!supported || !isSecureContext) && (
				<p style={{ color: '#6c757d', fontSize: '12px', marginTop: '5px' }}>
					💡{' '}
					{!supported
						? '브라우저가 Geolocation API를 지원하지 않아'
						: '안전하지 않은 환경에서 실행 중이어서'}{' '}
					버튼이 비활성화되었습니다.
				</p>
			)}

			{/* 디버깅 정보 */}
			<div
				style={{
					padding: '10px',
					backgroundColor: '#f8f9fa',
					borderRadius: '4px',
					border: '1px solid #dee2e6',
					marginTop: '20px',
					fontSize: '12px',
				}}
			>
				<h5>디버깅 정보</h5>
				<p>
					<strong>User Agent:</strong>{' '}
					{typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}
				</p>
				<p>
					<strong>Platform:</strong> {typeof navigator !== 'undefined' ? navigator.platform : 'N/A'}
				</p>
				<p>
					<strong>Geolocation 지원:</strong>{' '}
					{typeof navigator !== 'undefined' && 'geolocation' in navigator ? '✅' : '❌'}
				</p>
				<p>
					<strong>현재 URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}
				</p>
				<p>
					<strong>보안 컨텍스트:</strong>{' '}
					{typeof window !== 'undefined' ? (window.isSecureContext ? '✅' : '❌') : 'N/A'}
				</p>
			</div>
		</div>
	);
}

// 감시 모드 데모
function WatchModeDemo() {
	const { position, error, loading, supported, startWatching, stopWatching, isWatching } =
		useGeolocation();

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>감시 모드</h3>
			<p>실시간으로 위치 변화를 감시하는 기능입니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<p>
					<strong>감시 상태:</strong> {isWatching ? '🔄 감시 중...' : '⏸️ 중지됨'}
				</p>
				<p>
					<strong>지원 상태:</strong> {supported ? '✅ 지원됨' : '❌ 지원되지 않음'}
				</p>
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

			{position && (
				<div
					style={{
						padding: '15px',
						backgroundColor: '#d4edda',
						borderRadius: '4px',
						border: '1px solid #c3e6cb',
						marginBottom: '20px',
					}}
				>
					<h4>실시간 위치</h4>
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
						<strong>업데이트 시간:</strong> {new Date(position.timestamp).toLocaleTimeString()}
					</p>
				</div>
			)}

			<div style={{ marginBottom: '20px' }}>
				{!isWatching ? (
					<button
						onClick={() => startWatching()}
						disabled={!supported}
						style={{
							padding: '10px 20px',
							backgroundColor: !supported ? '#6c757d' : '#28a745',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: !supported ? 'not-allowed' : 'pointer',
							marginRight: '10px',
						}}
					>
						👁️ 감시 시작
					</button>
				) : (
					<button
						onClick={stopWatching}
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
		</div>
	);
}

// 고정밀 위치 데모
function HighAccuracyDemo() {
	const [options, setOptions] = useState({
		enableHighAccuracy: true,
		timeout: 15000,
		maximumAge: 300000, // 5분 캐시
	});

	const { position, error, loading, supported, getCurrentPosition } = useGeolocation(options);

	const handleGetPosition = async () => {
		try {
			await getCurrentPosition({
				enableHighAccuracy: true,
				timeout: 20000,
			});
		} catch (err) {
			console.error('고정밀 위치 정보 가져오기 실패:', err);
		}
	};

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>고정밀 위치 정보</h3>
			<p>더 정확한 위치 정보를 가져오는 고정밀 모드입니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<h4>설정 옵션</h4>
				<div style={{ marginBottom: '10px' }}>
					<label>
						<input
							type='checkbox'
							checked={options.enableHighAccuracy}
							onChange={(e) =>
								setOptions((prev) => ({ ...prev, enableHighAccuracy: e.target.checked }))
							}
							style={{ marginRight: '8px' }}
						/>
						고정밀 모드 (enableHighAccuracy)
					</label>
				</div>
				<div style={{ marginBottom: '10px' }}>
					<label>
						타임아웃:
						<input
							type='number'
							value={options.timeout / 1000}
							onChange={(e) =>
								setOptions((prev) => ({ ...prev, timeout: Number(e.target.value) * 1000 }))
							}
							style={{ width: '60px', marginLeft: '8px' }}
						/>
						초
					</label>
				</div>
				<div style={{ marginBottom: '10px' }}>
					<label>
						캐시 시간:
						<input
							type='number'
							value={options.maximumAge / 1000}
							onChange={(e) =>
								setOptions((prev) => ({ ...prev, maximumAge: Number(e.target.value) * 1000 }))
							}
							style={{ width: '60px', marginLeft: '8px' }}
						/>
						초
					</label>
				</div>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<p>
					<strong>로딩 상태:</strong> {loading ? '🔄 로딩 중...' : '⏸️ 대기 중'}
				</p>
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

			{position && (
				<div
					style={{
						padding: '15px',
						backgroundColor: '#d4edda',
						borderRadius: '4px',
						border: '1px solid #c3e6cb',
						marginBottom: '20px',
					}}
				>
					<h4>고정밀 위치 정보</h4>
					<p>
						<strong>위도:</strong> {position.latitude.toFixed(8)}°
					</p>
					<p>
						<strong>경도:</strong> {position.longitude.toFixed(8)}°
					</p>
					{position.accuracy && (
						<p>
							<strong>정확도:</strong> ±{position.accuracy.toFixed(1)}m
						</p>
					)}
					{position.altitude && (
						<p>
							<strong>고도:</strong> {position.altitude.toFixed(1)}m
						</p>
					)}
					{position.altitudeAccuracy && (
						<p>
							<strong>고도 정확도:</strong> ±{position.altitudeAccuracy.toFixed(1)}m
						</p>
					)}
					{position.heading && (
						<p>
							<strong>방향:</strong> {position.heading.toFixed(1)}°
						</p>
					)}
					{position.speed && (
						<p>
							<strong>속도:</strong> {position.speed.toFixed(1)}m/s
						</p>
					)}
					<p>
						<strong>시간:</strong> {new Date(position.timestamp).toLocaleString()}
					</p>
				</div>
			)}

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
				}}
			>
				{loading ? '🔄 가져오는 중...' : '🎯 고정밀 위치 가져오기'}
			</button>
		</div>
	);
}

// 자동 감시 모드 데모
function AutoWatchDemo() {
	const { position, error, loading, supported, isWatching, startWatching, stopWatching } =
		useGeolocation({
			watch: true,
			enableHighAccuracy: true,
			timeout: 5000,
		});

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>자동 감시 모드</h3>
			<p>훅 초기화 시 자동으로 위치 감시를 시작하는 모드입니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<p>
					<strong>감시 상태:</strong> {isWatching ? '🔄 감시 중...' : '⏸️ 중지됨'}
				</p>
				<p>
					<strong>지원 상태:</strong> {supported ? '✅ 지원됨' : '❌ 지원되지 않음'}
				</p>
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

			{position && (
				<div
					style={{
						padding: '15px',
						backgroundColor: '#d4edda',
						borderRadius: '4px',
						border: '1px solid #c3e6cb',
						marginBottom: '20px',
					}}
				>
					<h4>자동 감시 위치</h4>
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
						<strong>업데이트 시간:</strong> {new Date(position.timestamp).toLocaleTimeString()}
					</p>
				</div>
			)}

			<div style={{ marginBottom: '20px' }}>
				{!isWatching ? (
					<button
						onClick={() => startWatching()}
						disabled={!supported}
						style={{
							padding: '10px 20px',
							backgroundColor: !supported ? '#6c757d' : '#28a745',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: !supported ? 'not-allowed' : 'pointer',
							marginRight: '10px',
						}}
					>
						👁️ 감시 시작
					</button>
				) : (
					<button
						onClick={stopWatching}
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
					<p style={{ margin: 0 }}>🔄 자동 감시 중... 위치가 변경되면 자동으로 업데이트됩니다.</p>
				</div>
			)}
		</div>
	);
}

export const BasicUsage = () => (
	<ToggleComponent
		title='기본 사용법'
		description='현재 위치 정보를 가져오는 기본적인 사용법입니다.'
		code={`import React from 'react';
import { useGeolocation } from 'useHookit';

function BasicUsageDemo() {
	const {
		position,
		error,
		loading,
		supported,
		getCurrentPosition,
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
		</div>
	);
}`}
	>
		<BasicUsageDemo />
	</ToggleComponent>
);

export const WatchMode = () => (
	<ToggleComponent
		title='감시 모드'
		description='실시간으로 위치 변화를 감시하는 기능입니다.'
		code={`import React from 'react';
import { useGeolocation } from 'useHookit';

function WatchModeDemo() {
	const {
		position,
		error,
		loading,
		supported,
		startWatching,
		stopWatching,
		isWatching,
	} = useGeolocation();

	return (
		<div>
			{/* 감시 상태 표시 */}
			<p>감시 상태: {isWatching ? '🔄 감시 중...' : '⏸️ 중지됨'}</p>
			
			{/* 오류 표시 */}
			{error && <p>오류: {error.message}</p>}
			
			{/* 실시간 위치 정보 */}
			{position && (
				<div>
					<p>위도: {position.latitude.toFixed(6)}°</p>
					<p>경도: {position.longitude.toFixed(6)}°</p>
					{position.accuracy && (
						<p>정확도: ±{position.accuracy.toFixed(1)}m</p>
					)}
				</div>
			)}
			
			{/* 감시 제어 버튼 */}
			{!isWatching ? (
				<button onClick={startWatching}>감시 시작</button>
			) : (
				<button onClick={stopWatching}>감시 중지</button>
			)}
		</div>
	);
}`}
	>
		<WatchModeDemo />
	</ToggleComponent>
);

export const HighAccuracy = () => (
	<ToggleComponent
		title='고정밀 위치 정보'
		description='더 정확한 위치 정보를 가져오는 고정밀 모드입니다.'
		code={`import React from 'react';
import { useGeolocation } from 'useHookit';

function HighAccuracyDemo() {
	const {
		position,
		error,
		loading,
		supported,
		getCurrentPosition,
	} = useGeolocation({
		enableHighAccuracy: true,
		timeout: 15000,
		maximumAge: 300000, // 5분 캐시
	});

	const handleGetPosition = async () => {
		try {
			await getCurrentPosition({
				enableHighAccuracy: true,
				timeout: 20000,
			});
		} catch (err) {
			console.error('고정밀 위치 정보 가져오기 실패:', err);
		}
	};

	return (
		<div>
			{/* 오류 표시 */}
			{error && <p>오류: {error.message}</p>}
			
			{/* 고정밀 위치 정보 */}
			{position && (
				<div>
					<p>위도: {position.latitude.toFixed(8)}°</p>
					<p>경도: {position.longitude.toFixed(8)}°</p>
					{position.accuracy && (
						<p>정확도: ±{position.accuracy.toFixed(1)}m</p>
					)}
					{position.altitude && (
						<p>고도: {position.altitude.toFixed(1)}m</p>
					)}
				</div>
			)}
			
			{/* 제어 버튼 */}
			<button onClick={handleGetPosition} disabled={loading}>
				{loading ? '로딩 중...' : '고정밀 위치 가져오기'}
			</button>
		</div>
	);
}`}
	>
		<HighAccuracyDemo />
	</ToggleComponent>
);

export const AutoWatch = () => (
	<ToggleComponent
		title='자동 감시 모드'
		description='훅 초기화 시 자동으로 위치 감시를 시작하는 모드입니다.'
		code={`import React from 'react';
import { useGeolocation } from 'useHookit';

function AutoWatchDemo() {
	const {
		position,
		error,
		loading,
		supported,
		isWatching,
		startWatching,
		stopWatching,
	} = useGeolocation({
		watch: true,
		enableHighAccuracy: true,
		timeout: 5000,
	});

	return (
		<div>
			{/* 감시 상태 표시 */}
			<p>감시 상태: {isWatching ? '🔄 감시 중...' : '⏸️ 중지됨'}</p>
			
			{/* 오류 표시 */}
			{error && <p>오류: {error.message}</p>}
			
			{/* 자동 감시 위치 정보 */}
			{position && (
				<div>
					<p>위도: {position.latitude.toFixed(6)}°</p>
					<p>경도: {position.longitude.toFixed(6)}°</p>
					{position.accuracy && (
						<p>정확도: ±{position.accuracy.toFixed(1)}m</p>
					)}
				</div>
			)}
			
			{/* 감시 제어 버튼 */}
			{!isWatching ? (
				<button onClick={startWatching}>감시 시작</button>
			) : (
				<button onClick={stopWatching}>감시 중지</button>
			)}
		</div>
	);
}`}
	>
		<AutoWatchDemo />
	</ToggleComponent>
);

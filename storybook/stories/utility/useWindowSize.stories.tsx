import { useWindowSize } from '@/utility/useWindowSize';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'Utility/useWindowSize',
	parameters: {
		layout: 'centered',
	},
};

// 코드 스니펫들
const basicCode = `const { width, height, isMobile, isTablet, isDesktop, isLargeScreen, orientation } = useWindowSize();

return (
  <div>
    <p>크기: {width}px × {height}px</p>
    <p>방향: {orientation}</p>
    <p>디바이스: {isMobile ? '모바일' : isTablet ? '태블릿' : isDesktop ? '데스크톱' : '대형 화면'}</p>
  </div>
);`;

const responsiveCode = `const { isMobile, isTablet, isDesktop } = useWindowSize();

return (
  <div>
    {isMobile && <MobileLayout />}
    {isTablet && <TabletLayout />}
    {isDesktop && <DesktopLayout />}
  </div>
);`;

const debounceCode = `const { width, height } = useWindowSize({
  debounceMs: 500
});

return (
  <div>
    <p>디바운스 적용된 크기: {width}px × {height}px</p>
  </div>
);`;

const orientationCode = `const { orientation, width, height } = useWindowSize();

return (
  <div>
    <p>방향: {orientation}</p>
    <p>크기: {width}px × {height}px</p>
  </div>
);`;

export const Default = () => {
	const { width, height, isMobile, isTablet, isDesktop, isLargeScreen, orientation } =
		useWindowSize();

	return (
		<ToggleComponent
			code={basicCode}
			title='기본 사용법'
			description='useWindowSize 훅의 기본적인 사용법을 보여줍니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>기본 사용법</h3>
				<p>브라우저 창 크기와 관련 정보를 실시간으로 감지합니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
							gap: '15px',
						}}
					>
						<div
							style={{
								padding: '15px',
								backgroundColor: '#d4edda',
								borderRadius: '4px',
								border: '1px solid #c3e6cb',
								textAlign: 'center',
							}}
						>
							<h5>창 크기</h5>
							<div style={{ fontSize: '24px', fontWeight: 'bold', color: '#155724' }}>
								{width}px × {height}px
							</div>
						</div>

						<div
							style={{
								padding: '15px',
								backgroundColor: '#d1ecf1',
								borderRadius: '4px',
								border: '1px solid #bee5eb',
								textAlign: 'center',
							}}
						>
							<h5>화면 방향</h5>
							<div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0c5460' }}>
								{orientation === 'portrait' ? '📱 세로' : '🖥️ 가로'}
							</div>
						</div>

						<div
							style={{
								padding: '15px',
								backgroundColor: '#fff3cd',
								borderRadius: '4px',
								border: '1px solid #ffeaa7',
								textAlign: 'center',
							}}
						>
							<h5>디바이스 타입</h5>
							<div style={{ fontSize: '24px', fontWeight: 'bold', color: '#856404' }}>
								{isMobile
									? '📱 모바일'
									: isTablet
									? '📱 태블릿'
									: isDesktop
									? '💻 데스크톱'
									: '🖥️ 대형 화면'}
							</div>
						</div>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>상세 정보</h4>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
						}}
					>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
								gap: '10px',
							}}
						>
							<div>
								<strong>모바일:</strong> {isMobile ? '✅' : '❌'}
							</div>
							<div>
								<strong>태블릿:</strong> {isTablet ? '✅' : '❌'}
							</div>
							<div>
								<strong>데스크톱:</strong> {isDesktop ? '✅' : '❌'}
							</div>
							<div>
								<strong>대형 화면:</strong> {isLargeScreen ? '✅' : '❌'}
							</div>
						</div>
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
						<strong>💡 테스트:</strong> 브라우저 창 크기를 조절하거나 개발자 도구의 디바이스
						시뮬레이션을 사용해보세요.
					</p>
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
						<li>반응형 레이아웃 구현</li>
						<li>조건부 컴포넌트 렌더링</li>
						<li>화면 방향에 따른 UI 조정</li>
						<li>디바이스별 최적화</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithResponsiveLayout = () => {
	const { isMobile, isTablet, isDesktop } = useWindowSize();

	const getLayoutStyle = () => {
		if (isMobile) {
			return {
				display: 'flex',
				flexDirection: 'column' as const,
				gap: '10px',
			};
		} else if (isTablet) {
			return {
				display: 'grid',
				gridTemplateColumns: 'repeat(2, 1fr)',
				gap: '15px',
			};
		} else {
			return {
				display: 'grid',
				gridTemplateColumns: 'repeat(3, 1fr)',
				gap: '20px',
			};
		}
	};

	const getCardStyle = () => {
		if (isMobile) {
			return {
				padding: '15px',
				backgroundColor: '#ffffff',
				borderRadius: '4px',
				border: '1px solid #dee2e6',
				marginBottom: '10px',
			};
		} else {
			return {
				padding: '20px',
				backgroundColor: '#ffffff',
				borderRadius: '4px',
				border: '1px solid #dee2e6',
			};
		}
	};

	return (
		<ToggleComponent
			code={responsiveCode}
			title='반응형 레이아웃'
			description='헬퍼 함수를 사용한 반응형 레이아웃 예제입니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>반응형 레이아웃 예제</h3>
				<p>헬퍼 함수를 사용하여 창 크기에 따라 레이아웃이 자동으로 변경됩니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#e2e3e5',
							borderRadius: '4px',
							border: '1px solid #d6d8db',
							marginBottom: '20px',
						}}
					>
						<p>
							<strong>현재 레이아웃:</strong>{' '}
							{isMobile
								? '📱 모바일 (세로 스택)'
								: isTablet
								? '📱 태블릿 (2열 그리드)'
								: '💻 데스크톱 (3열 그리드)'}
						</p>
					</div>
				</div>

				<div style={getLayoutStyle()}>
					<div style={getCardStyle()}>
						<h5>카드 1</h5>
						<p>이 카드는 화면 크기에 따라 배치가 변경됩니다.</p>
						<div
							style={{
								padding: '10px',
								backgroundColor: '#f8f9fa',
								borderRadius: '4px',
								fontSize: '12px',
							}}
						>
							{isMobile && '📱 모바일: 세로 배치'}
							{isTablet && '📱 태블릿: 2열 그리드'}
							{isDesktop && '💻 데스크톱: 3열 그리드'}
						</div>
					</div>

					<div style={getCardStyle()}>
						<h5>카드 2</h5>
						<p>헬퍼 함수를 사용한 반응형 디자인입니다.</p>
						<div
							style={{
								padding: '10px',
								backgroundColor: '#f8f9fa',
								borderRadius: '4px',
								fontSize: '12px',
							}}
						>
							모든 디바이스에서
							<br />
							최적의 사용자 경험을
							<br />
							제공합니다.
						</div>
					</div>

					<div style={getCardStyle()}>
						<h5>카드 3</h5>
						<p>useWindowSize 훅의 헬퍼 함수를 활용합니다.</p>
						<div
							style={{
								padding: '10px',
								backgroundColor: '#f8f9fa',
								borderRadius: '4px',
								fontSize: '12px',
							}}
						>
							실시간으로 창 크기를
							<br />
							감지하여 레이아웃을
							<br />
							자동 조정합니다.
						</div>
					</div>
				</div>

				<div
					style={{
						padding: '15px',
						backgroundColor: '#fff3cd',
						borderRadius: '4px',
						border: '1px solid #ffeaa7',
					}}
				>
					<p>
						<strong>💡 헬퍼 함수 활용:</strong>
					</p>
					<ul>
						<li>
							<code>isMobile</code>: 모바일 디바이스 감지
						</li>
						<li>
							<code>isTablet</code>: 태블릿 디바이스 감지
						</li>
						<li>
							<code>isDesktop</code>: 데스크톱 디바이스 감지
						</li>
						<li>
							<code>isLargeScreen</code>: 대형 화면 감지
						</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithDebounce = () => {
	const { width, height } = useWindowSize({
		debounceMs: 500,
	});

	return (
		<ToggleComponent
			code={debounceCode}
			title='디바운스 적용'
			description='디바운스를 적용하여 성능을 최적화하는 예제입니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>디바운스 적용 예제</h3>
				<p>디바운스를 적용하여 창 크기 변경 시 성능을 최적화합니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#d1ecf1',
							borderRadius: '4px',
							border: '1px solid #bee5eb',
							textAlign: 'center',
						}}
					>
						<h4>디바운스 적용된 크기</h4>
						<div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0c5460' }}>
							{width}px × {height}px
						</div>
						<p style={{ margin: '10px 0 0 0', fontSize: '14px', opacity: 0.7 }}>
							(500ms 디바운스 적용)
						</p>
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
						<strong>💡 디바운스 효과:</strong>
					</p>
					<ul>
						<li>창 크기 변경 시 500ms 대기 후 업데이트</li>
						<li>빈번한 리사이즈 이벤트로 인한 성능 저하 방지</li>
						<li>부드러운 사용자 경험 제공</li>
						<li>CPU 사용량 최적화</li>
					</ul>
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
						<li>복잡한 레이아웃 계산이 필요한 경우</li>
						<li>애니메이션이나 전환 효과가 있는 경우</li>
						<li>API 호출이나 무거운 연산이 포함된 경우</li>
						<li>모바일 디바이스에서 성능 최적화</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithOrientation = () => {
	const { orientation, width, height } = useWindowSize();

	return (
		<ToggleComponent
			code={orientationCode}
			title='화면 방향 감지'
			description='화면 방향을 감지하여 UI를 조정하는 예제입니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>화면 방향 감지 예제</h3>
				<p>화면 방향을 감지하여 UI를 자동으로 조정합니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							padding: '20px',
							backgroundColor: orientation === 'portrait' ? '#d4edda' : '#d1ecf1',
							borderRadius: '4px',
							border: `1px solid ${orientation === 'portrait' ? '#c3e6cb' : '#bee5eb'}`,
							textAlign: 'center',
						}}
					>
						<h4 style={{ margin: '0 0 10px 0' }}>
							{orientation === 'portrait' ? '📱 세로 모드' : '🖥️ 가로 모드'}
						</h4>
						<p style={{ margin: '0', fontSize: '18px' }}>
							{width}px × {height}px
						</p>
						<p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
							{orientation === 'portrait' ? '세로가 가로보다 긴 화면' : '가로가 세로보다 긴 화면'}
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>방향별 UI 예제</h4>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: orientation === 'portrait' ? '1fr' : 'repeat(2, 1fr)',
							gap: '15px',
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
							<h5>콘텐츠 영역 1</h5>
							<p>
								{orientation === 'portrait'
									? '세로 모드에서는 세로로 배치됩니다.'
									: '가로 모드에서는 가로로 배치됩니다.'}
							</p>
						</div>

						<div
							style={{
								padding: '15px',
								backgroundColor: '#ffffff',
								borderRadius: '4px',
								border: '1px solid #dee2e6',
							}}
						>
							<h5>콘텐츠 영역 2</h5>
							<p>
								{orientation === 'portrait'
									? '모바일에서 최적화된 레이아웃을 제공합니다.'
									: '태블릿이나 데스크톱에서 넓은 공간을 활용합니다.'}
							</p>
						</div>
					</div>
				</div>

				<div
					style={{
						padding: '15px',
						backgroundColor: '#d1ecf1',
						borderRadius: '4px',
						border: '1px solid #bee5eb',
					}}
				>
					<p>
						<strong>💡 방향 감지 활용:</strong>
					</p>
					<ul>
						<li>모바일에서 세로/가로 모드에 따른 UI 조정</li>
						<li>태블릿에서 방향에 따른 레이아웃 최적화</li>
						<li>게임이나 미디어 앱에서 방향별 최적화</li>
						<li>사용자 경험 향상을 위한 동적 UI</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

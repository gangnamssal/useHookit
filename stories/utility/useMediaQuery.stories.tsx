import React from 'react';
import {
	useMediaQuery,
	useIsMobile,
	useIsTablet,
	useIsDesktop,
	useIsLargeScreen,
	useIsPortrait,
	useIsLandscape,
	usePrefersDarkMode,
	usePrefersReducedMotion,
	useBreakpoint,
} from '../../src/utility/useMediaQuery';
import { ToggleComponent } from '../components/ToggleComponent';

export default {
	title: 'Utility/useMediaQuery',
	parameters: {
		layout: 'centered',
	},
};

// 코드 스니펫들
const basicCode = `const isMobile = useMediaQuery('(max-width: 767px)');
const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
const isDesktop = useMediaQuery('(min-width: 1024px)');
const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

return (
  <div>
    {isMobile && <p>모바일 화면</p>}
    {isTablet && <p>태블릿 화면</p>}
    {isDesktop && <p>데스크톱 화면</p>}
    {isDarkMode && <p>다크 모드</p>}
  </div>
);`;

const helperHooksCode = `// 헬퍼 훅들 사용
const isMobile = useIsMobile();
const isTablet = useIsTablet();
const isDesktop = useIsDesktop();
const isLargeScreen = useIsLargeScreen();
const isPortrait = useIsPortrait();
const isLandscape = useIsLandscape();
const prefersDarkMode = usePrefersDarkMode();
const prefersReducedMotion = usePrefersReducedMotion();

return (
  <div>
    {isMobile && <p>모바일</p>}
    {isTablet && <p>태블릿</p>}
    {isDesktop && <p>데스크톱</p>}
    {isLargeScreen && <p>대형 화면</p>}
  </div>
);`;

const breakpointCode = `const breakpoint = useBreakpoint();

return (
  <div>
    {breakpoint === 'mobile' && <p>모바일 레이아웃</p>}
    {breakpoint === 'tablet' && <p>태블릿 레이아웃</p>}
    {breakpoint === 'desktop' && <p>데스크톱 레이아웃</p>}
    {breakpoint === 'large' && <p>대형 화면 레이아웃</p>}
  </div>
);`;

const responsiveLayoutCode = `const breakpoint = useBreakpoint();

return (
  <div>
    {breakpoint === 'mobile' && <div>모바일 레이아웃</div>}
    {breakpoint === 'tablet' && <div>태블릿 레이아웃</div>}
    {breakpoint === 'desktop' && <div>데스크톱 레이아웃</div>}
    {breakpoint === 'large' && <div>대형 화면 레이아웃</div>}
  </div>
);`;

function UseMediaQueryDemo() {
	const isMobile = useMediaQuery('(max-width: 767px)');
	const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
	const isDesktop = useMediaQuery('(min-width: 1024px)');
	const isLandscape = useMediaQuery('(orientation: landscape)');
	const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
	const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>useMediaQuery 훅 데모</h3>
			<p>CSS 미디어 쿼리를 React에서 사용할 수 있는 훅입니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<h4>화면 크기</h4>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
						gap: '10px',
					}}
				>
					<div
						style={{
							padding: '10px',
							backgroundColor: isMobile ? '#28a745' : '#6c757d',
							color: 'white',
							borderRadius: '4px',
							textAlign: 'center',
						}}
					>
						<strong>모바일</strong>
						<br />
						{isMobile ? '✅ 활성' : '❌ 비활성'}
					</div>

					<div
						style={{
							padding: '10px',
							backgroundColor: isTablet ? '#ffc107' : '#6c757d',
							color: isTablet ? 'black' : 'white',
							borderRadius: '4px',
							textAlign: 'center',
						}}
					>
						<strong>태블릿</strong>
						<br />
						{isTablet ? '✅ 활성' : '❌ 비활성'}
					</div>

					<div
						style={{
							padding: '10px',
							backgroundColor: isDesktop ? '#007bff' : '#6c757d',
							color: 'white',
							borderRadius: '4px',
							textAlign: 'center',
						}}
					>
						<strong>데스크톱</strong>
						<br />
						{isDesktop ? '✅ 활성' : '❌ 비활성'}
					</div>
				</div>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>화면 방향</h4>
				<div
					style={{
						padding: '10px',
						backgroundColor: isLandscape ? '#17a2b8' : '#6c757d',
						color: 'white',
						borderRadius: '4px',
						textAlign: 'center',
					}}
				>
					<strong>가로 모드</strong>
					<br />
					{isLandscape ? '✅ 활성' : '❌ 비활성'}
				</div>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>시스템 설정</h4>
				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
						gap: '10px',
					}}
				>
					<div
						style={{
							padding: '10px',
							backgroundColor: isDarkMode ? '#343a40' : '#f8f9fa',
							color: isDarkMode ? 'white' : 'black',
							borderRadius: '4px',
							textAlign: 'center',
						}}
					>
						<strong>다크 모드</strong>
						<br />
						{isDarkMode ? '✅ 활성' : '❌ 비활성'}
					</div>

					<div
						style={{
							padding: '10px',
							backgroundColor: prefersReducedMotion ? '#28a745' : '#6c757d',
							color: 'white',
							borderRadius: '4px',
							textAlign: 'center',
						}}
					>
						<strong>모션 감소</strong>
						<br />
						{prefersReducedMotion ? '✅ 활성' : '❌ 비활성'}
					</div>
				</div>
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
					<strong>사용법:</strong>
				</p>
				<ul>
					<li>브라우저 창 크기를 조절하여 변화를 확인하세요</li>
					<li>개발자 도구에서 디바이스를 변경해보세요</li>
					<li>시스템 설정을 변경하여 다크 모드 등을 테스트하세요</li>
				</ul>
			</div>
		</div>
	);
}

export const Default = () => (
	<ToggleComponent
		code={basicCode}
		title='기본 사용법'
		description='useMediaQuery 훅의 기본적인 사용법을 보여줍니다. 화면 크기, 방향, 시스템 설정 감지를 포함합니다.'
	>
		<UseMediaQueryDemo />
	</ToggleComponent>
);

export const WithHelperHooks = () => {
	const isMobile = useIsMobile();
	const isTablet = useIsTablet();
	const isDesktop = useIsDesktop();
	const isLargeScreen = useIsLargeScreen();
	const isPortrait = useIsPortrait();
	const isLandscape = useIsLandscape();
	const prefersDarkMode = usePrefersDarkMode();
	const prefersReducedMotion = usePrefersReducedMotion();

	return (
		<ToggleComponent
			code={helperHooksCode}
			title='헬퍼 훅들'
			description='미리 정의된 헬퍼 훅들을 사용하여 더 간편하게 미디어 쿼리를 사용할 수 있습니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>헬퍼 훅들 예제</h3>
				<p>미리 정의된 헬퍼 훅들을 사용합니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<h4>화면 크기</h4>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
							gap: '10px',
						}}
					>
						<div
							style={{
								padding: '10px',
								backgroundColor: isMobile ? '#28a745' : '#6c757d',
								color: 'white',
								borderRadius: '4px',
								textAlign: 'center',
							}}
						>
							<strong>모바일</strong>
							<br />
							{isMobile ? '✅ 활성' : '❌ 비활성'}
						</div>
						<div
							style={{
								padding: '10px',
								backgroundColor: isTablet ? '#ffc107' : '#6c757d',
								color: isTablet ? 'black' : 'white',
								borderRadius: '4px',
								textAlign: 'center',
							}}
						>
							<strong>태블릿</strong>
							<br />
							{isTablet ? '✅ 활성' : '❌ 비활성'}
						</div>
						<div
							style={{
								padding: '10px',
								backgroundColor: isDesktop ? '#007bff' : '#6c757d',
								color: 'white',
								borderRadius: '4px',
								textAlign: 'center',
							}}
						>
							<strong>데스크톱</strong>
							<br />
							{isDesktop ? '✅ 활성' : '❌ 비활성'}
						</div>
						<div
							style={{
								padding: '10px',
								backgroundColor: isLargeScreen ? '#17a2b8' : '#6c757d',
								color: 'white',
								borderRadius: '4px',
								textAlign: 'center',
							}}
						>
							<strong>대형 화면</strong>
							<br />
							{isLargeScreen ? '✅ 활성' : '❌ 비활성'}
						</div>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>화면 방향</h4>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
							gap: '10px',
						}}
					>
						<div
							style={{
								padding: '10px',
								backgroundColor: isPortrait ? '#28a745' : '#6c757d',
								color: 'white',
								borderRadius: '4px',
								textAlign: 'center',
							}}
						>
							<strong>세로 모드</strong>
							<br />
							{isPortrait ? '✅ 활성' : '❌ 비활성'}
						</div>
						<div
							style={{
								padding: '10px',
								backgroundColor: isLandscape ? '#17a2b8' : '#6c757d',
								color: 'white',
								borderRadius: '4px',
								textAlign: 'center',
							}}
						>
							<strong>가로 모드</strong>
							<br />
							{isLandscape ? '✅ 활성' : '❌ 비활성'}
						</div>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>시스템 설정</h4>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
							gap: '10px',
						}}
					>
						<div
							style={{
								padding: '10px',
								backgroundColor: prefersDarkMode ? '#343a40' : '#f8f9fa',
								color: prefersDarkMode ? 'white' : 'black',
								borderRadius: '4px',
								textAlign: 'center',
							}}
						>
							<strong>다크 모드</strong>
							<br />
							{prefersDarkMode ? '✅ 활성' : '❌ 비활성'}
						</div>
						<div
							style={{
								padding: '10px',
								backgroundColor: prefersReducedMotion ? '#28a745' : '#6c757d',
								color: 'white',
								borderRadius: '4px',
								textAlign: 'center',
							}}
						>
							<strong>모션 감소</strong>
							<br />
							{prefersReducedMotion ? '✅ 활성' : '❌ 비활성'}
						</div>
					</div>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithBreakpoint = () => {
	const breakpoint = useBreakpoint();

	return (
		<ToggleComponent
			code={breakpointCode}
			title='useBreakpoint'
			description='현재 화면 크기에 따른 브레이크포인트를 문자열로 반환하는 useBreakpoint 훅을 사용합니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>useBreakpoint 예제</h3>
				<p>
					현재 브레이크포인트: <strong>{breakpoint}</strong>
				</p>

				<div style={{ marginBottom: '20px' }}>
					{breakpoint === 'mobile' && (
						<div
							style={{
								padding: '15px',
								backgroundColor: '#d4edda',
								borderRadius: '4px',
								border: '1px solid #c3e6cb',
							}}
						>
							<h4>📱 모바일 레이아웃</h4>
							<p>세로로 긴 레이아웃으로 최적화되어 있습니다.</p>
						</div>
					)}
					{breakpoint === 'tablet' && (
						<div
							style={{
								padding: '15px',
								backgroundColor: '#fff3cd',
								borderRadius: '4px',
								border: '1px solid #ffeaa7',
							}}
						>
							<h4>📱 태블릿 레이아웃</h4>
							<p>중간 크기 화면에 최적화되어 있습니다.</p>
						</div>
					)}
					{breakpoint === 'desktop' && (
						<div
							style={{
								padding: '15px',
								backgroundColor: '#d1ecf1',
								borderRadius: '4px',
								border: '1px solid #bee5eb',
							}}
						>
							<h4>💻 데스크톱 레이아웃</h4>
							<p>큰 화면에 최적화되어 있습니다.</p>
						</div>
					)}
					{breakpoint === 'large' && (
						<div
							style={{
								padding: '15px',
								backgroundColor: '#e2e3e5',
								borderRadius: '4px',
								border: '1px solid #d6d8db',
							}}
						>
							<h4>🖥️ 대형 화면 레이아웃</h4>
							<p>매우 큰 화면에 최적화되어 있습니다.</p>
						</div>
					)}
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
						<strong>브레이크포인트:</strong>
					</p>
					<ul>
						<li>
							<strong>mobile:</strong> ≤ 767px
						</li>
						<li>
							<strong>tablet:</strong> 768px - 1023px
						</li>
						<li>
							<strong>desktop:</strong> 1024px - 1439px
						</li>
						<li>
							<strong>large:</strong> ≥ 1440px
						</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithResponsiveLayout = () => {
	const breakpoint = useBreakpoint();

	return (
		<ToggleComponent
			code={responsiveLayoutCode}
			title='반응형 레이아웃'
			description='useBreakpoint를 사용한 반응형 레이아웃을 구현하는 예제입니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>반응형 레이아웃 예제</h3>
				<p>useBreakpoint를 사용한 반응형 레이아웃을 구현합니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<h4>현재 화면 크기</h4>
					<div
						style={{
							padding: '15px',
							backgroundColor:
								breakpoint === 'mobile'
									? '#d4edda'
									: breakpoint === 'tablet'
									? '#fff3cd'
									: breakpoint === 'desktop'
									? '#d1ecf1'
									: '#e2e3e5',
							borderRadius: '4px',
							border: `1px solid ${
								breakpoint === 'mobile'
									? '#c3e6cb'
									: breakpoint === 'tablet'
									? '#ffeaa7'
									: breakpoint === 'desktop'
									? '#bee5eb'
									: '#d6d8db'
							}`,
						}}
					>
						{breakpoint === 'mobile' && (
							<div>
								<h5>📱 모바일 레이아웃</h5>
								<p>세로로 긴 레이아웃으로 최적화되어 있습니다.</p>
								<div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
									<div
										style={{
											padding: '10px',
											backgroundColor: '#ffffff',
											borderRadius: '4px',
											border: '1px solid #dee2e6',
										}}
									>
										<h6>카드 1</h6>
										<p>모바일에 최적화된 콘텐츠입니다.</p>
									</div>
									<div
										style={{
											padding: '10px',
											backgroundColor: '#ffffff',
											borderRadius: '4px',
											border: '1px solid #dee2e6',
										}}
									>
										<h6>카드 2</h6>
										<p>세로 스크롤이 자연스럽습니다.</p>
									</div>
								</div>
							</div>
						)}

						{breakpoint === 'tablet' && (
							<div>
								<h5>📱 태블릿 레이아웃</h5>
								<p>중간 크기 화면에 최적화되어 있습니다.</p>
								<div
									style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}
								>
									<div
										style={{
											padding: '15px',
											backgroundColor: '#ffffff',
											borderRadius: '4px',
											border: '1px solid #dee2e6',
										}}
									>
										<h6>카드 1</h6>
										<p>2열 그리드 레이아웃입니다.</p>
									</div>
									<div
										style={{
											padding: '15px',
											backgroundColor: '#ffffff',
											borderRadius: '4px',
											border: '1px solid #dee2e6',
										}}
									>
										<h6>카드 2</h6>
										<p>태블릿에 적합한 크기입니다.</p>
									</div>
								</div>
							</div>
						)}

						{breakpoint === 'desktop' && (
							<div>
								<h5>💻 데스크톱 레이아웃</h5>
								<p>큰 화면에 최적화되어 있습니다.</p>
								<div
									style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}
								>
									<div
										style={{
											padding: '20px',
											backgroundColor: '#ffffff',
											borderRadius: '4px',
											border: '1px solid #dee2e6',
										}}
									>
										<h6>카드 1</h6>
										<p>3열 그리드 레이아웃입니다.</p>
									</div>
									<div
										style={{
											padding: '20px',
											backgroundColor: '#ffffff',
											borderRadius: '4px',
											border: '1px solid #dee2e6',
										}}
									>
										<h6>카드 2</h6>
										<p>데스크톱에 적합한 여백입니다.</p>
									</div>
									<div
										style={{
											padding: '20px',
											backgroundColor: '#ffffff',
											borderRadius: '4px',
											border: '1px solid #dee2e6',
										}}
									>
										<h6>카드 3</h6>
										<p>큰 화면을 활용한 레이아웃입니다.</p>
									</div>
								</div>
							</div>
						)}

						{breakpoint === 'large' && (
							<div>
								<h5>🖥️ 대형 화면 레이아웃</h5>
								<p>매우 큰 화면에 최적화되어 있습니다.</p>
								<div
									style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}
								>
									<div
										style={{
											padding: '20px',
											backgroundColor: '#ffffff',
											borderRadius: '4px',
											border: '1px solid #dee2e6',
										}}
									>
										<h6>카드 1</h6>
										<p>4열 그리드 레이아웃입니다.</p>
									</div>
									<div
										style={{
											padding: '20px',
											backgroundColor: '#ffffff',
											borderRadius: '4px',
											border: '1px solid #dee2e6',
										}}
									>
										<h6>카드 2</h6>
										<p>대형 화면에 적합한 여백입니다.</p>
									</div>
									<div
										style={{
											padding: '20px',
											backgroundColor: '#ffffff',
											borderRadius: '4px',
											border: '1px solid #dee2e6',
										}}
									>
										<h6>카드 3</h6>
										<p>매우 큰 화면을 활용한 레이아웃입니다.</p>
									</div>
									<div
										style={{
											padding: '20px',
											backgroundColor: '#ffffff',
											borderRadius: '4px',
											border: '1px solid #dee2e6',
										}}
									>
										<h6>카드 4</h6>
										<p>추가 콘텐츠를 표시할 수 있습니다.</p>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</ToggleComponent>
	);
};

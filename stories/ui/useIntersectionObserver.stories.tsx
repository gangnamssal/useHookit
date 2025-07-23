import React, { useState } from 'react';
import { useIntersectionObserver } from '../../src/ui/useIntersectionObserver';
import { ToggleComponent } from '../components/ToggleComponent';

export default {
	title: 'UI/useIntersectionObserver',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
## useIntersectionObserver 훅

요소의 가시성을 감지하는 훅입니다.

### 기본 사용법

\`\`\`tsx
import { useIntersectionObserver } from 'useHookit';

function MyComponent() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useIntersectionObserver((entries) => {
    setIsVisible(entries[0].isIntersecting);
  });

  return (
    <div>
      <div ref={ref}>
        {isVisible ? '보임' : '안 보임'}
      </div>
    </div>
  );
}
\`\`\`

### 매개변수

- \`callback\`: 교차 시 실행할 콜백 함수
- \`options\`: IntersectionObserver 옵션

### 반환값

- \`ref\`: 감지할 요소에 연결할 ref
				`,
			},
		},
	},
};

function UseIntersectionObserverDemo() {
	const [isVisible, setIsVisible] = useState(false);
	const [intersectionRatio, setIntersectionRatio] = useState(0);

	const {
		ref,
		isIntersecting,
		intersectionRatio: ratio,
	} = useIntersectionObserver({
		threshold: 0.5,
		rootMargin: '50px',
	});

	React.useEffect(() => {
		setIsVisible(isIntersecting);
		setIntersectionRatio(ratio);
	}, [isIntersecting, ratio]);

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<h4>가시성 감지</h4>
				<p>
					<strong>상태:</strong> {isVisible ? '✅ 보임' : '❌ 안 보임'}
				</p>
				<p>
					<strong>교차 비율:</strong> {(intersectionRatio * 100).toFixed(1)}%
				</p>
			</div>

			<div
				style={{ height: '400px', overflow: 'auto', border: '1px solid #dee2e6', padding: '10px' }}
			>
				<div
					style={{
						height: '150px',
						backgroundColor: '#f8f9fa',
						padding: '20px',
						borderRadius: '8px',
					}}
				>
					<h5>스크롤 시작 영역</h5>
					<p>아래로 스크롤하여 관찰 대상 요소를 확인하세요</p>
					<p>여러 섹션을 거쳐 관찰 대상 요소에 도달할 수 있습니다</p>
				</div>

				<div
					style={{
						height: '120px',
						backgroundColor: '#e9ecef',
						padding: '20px',
						borderRadius: '8px',
						margin: '20px 0',
					}}
				>
					<h5>중간 섹션 1</h5>
					<p>계속 스크롤하세요...</p>
				</div>

				<div
					style={{
						height: '100px',
						backgroundColor: '#dee2e6',
						padding: '20px',
						borderRadius: '8px',
						margin: '20px 0',
					}}
				>
					<h5>중간 섹션 2</h5>
					<p>거의 도착했습니다...</p>
				</div>

				<div
					ref={ref}
					style={{
						padding: '20px',
						backgroundColor: isVisible ? '#d4edda' : '#f8d7da',
						border: `2px solid ${isVisible ? '#28a745' : '#dc3545'}`,
						borderRadius: '8px',
						margin: '20px 0',
						textAlign: 'center',
						transition: 'all 0.3s ease',
					}}
				>
					<h4>🎯 관찰 대상 요소</h4>
					<p>이 요소가 화면에 나타나면 색상이 변경됩니다</p>
					<p style={{ fontSize: '12px', marginTop: '10px' }}>
						{isVisible ? '현재 화면에 표시되고 있습니다!' : '아직 화면에 나타나지 않았습니다'}
					</p>
				</div>

				<div
					style={{
						height: '100px',
						backgroundColor: '#dee2e6',
						padding: '20px',
						borderRadius: '8px',
						margin: '20px 0',
					}}
				>
					<h5>중간 섹션 3</h5>
					<p>관찰 대상 요소를 지나쳤습니다</p>
				</div>

				<div
					style={{
						height: '120px',
						backgroundColor: '#e9ecef',
						padding: '20px',
						borderRadius: '8px',
						margin: '20px 0',
					}}
				>
					<h5>중간 섹션 4</h5>
					<p>계속 스크롤하세요...</p>
				</div>

				<div
					style={{
						height: '150px',
						backgroundColor: '#f8f9fa',
						padding: '20px',
						borderRadius: '8px',
						margin: '20px 0',
					}}
				>
					<h5>스크롤 끝 영역</h5>
					<p>이제 위로 스크롤하여 관찰 대상 요소가 다시 사라지는 것을 확인하세요</p>
					<p>요소가 화면에서 벗어나면 색상이 다시 변경됩니다</p>
				</div>
			</div>

			<div
				style={{
					padding: '10px',
					backgroundColor: '#f8f9fa',
					borderRadius: '4px',
					border: '1px solid #dee2e6',
					marginTop: '15px',
				}}
			>
				<p>
					<strong>💡 useIntersectionObserver의 활용:</strong>
				</p>
				<ul>
					<li>무한 스크롤 구현</li>
					<li>이미지 지연 로딩</li>
					<li>애니메이션 트리거</li>
					<li>광고 노출 측정</li>
				</ul>
			</div>
		</div>
	);
}

function LazyLoadingExample() {
	const [isLoaded, setIsLoaded] = useState(false);
	const [isInView, setIsInView] = useState(false);

	const { ref, isIntersecting } = useIntersectionObserver({
		threshold: 0.1,
		rootMargin: '50px',
	});

	React.useEffect(() => {
		if (isIntersecting && !isLoaded) {
			setIsInView(true);
			// 이미지 로딩 시뮬레이션
			setTimeout(() => setIsLoaded(true), 1000);
		}
	}, [isIntersecting, isLoaded]);

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<h4>지연 로딩 예제</h4>
				<p>
					<strong>상태:</strong>{' '}
					{isLoaded ? '✅ 로드됨' : isInView ? '🔄 로딩 중...' : '⏸️ 대기 중'}
				</p>
			</div>

			<div
				style={{ height: '500px', overflow: 'auto', border: '1px solid #dee2e6', padding: '10px' }}
			>
				<div
					style={{
						height: '120px',
						backgroundColor: '#f8f9fa',
						padding: '20px',
						borderRadius: '8px',
					}}
				>
					<h5>📱 콘텐츠 섹션 1</h5>
					<p>스크롤하여 이미지 로딩 영역에 도달하세요</p>
				</div>

				<div
					style={{
						height: '100px',
						backgroundColor: '#e9ecef',
						padding: '20px',
						borderRadius: '8px',
						margin: '20px 0',
					}}
				>
					<h5>📱 콘텐츠 섹션 2</h5>
					<p>계속 스크롤하세요...</p>
				</div>

				<div
					style={{
						height: '80px',
						backgroundColor: '#dee2e6',
						padding: '20px',
						borderRadius: '8px',
						margin: '20px 0',
					}}
				>
					<h5>📱 콘텐츠 섹션 3</h5>
					<p>거의 도착했습니다...</p>
				</div>

				<div
					ref={ref}
					style={{
						minHeight: '120px',
						border: '2px dashed #6c757d',
						borderRadius: '8px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						margin: '20px 0',
						backgroundColor: '#f8f9fa',
						transition: 'all 0.3s ease',
					}}
				>
					{isLoaded ? (
						<div style={{ textAlign: 'center' }}>
							<div
								style={{
									width: '100px',
									height: '100px',
									backgroundColor: '#28a745',
									borderRadius: '50%',
									margin: '0 auto 10px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: 'white',
									fontSize: '32px',
									boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
								}}
							>
								✅
							</div>
							<p style={{ fontWeight: 'bold', color: '#28a745' }}>이미지가 로드되었습니다!</p>
							<p style={{ fontSize: '12px', color: '#6c757d' }}>
								사용자가 스크롤하여 이 영역에 도달했을 때 로딩이 시작되었습니다
							</p>
						</div>
					) : isInView ? (
						<div style={{ textAlign: 'center' }}>
							<div
								style={{
									width: '100px',
									height: '100px',
									backgroundColor: '#ffc107',
									borderRadius: '50%',
									margin: '0 auto 10px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: 'white',
									fontSize: '32px',
									animation: 'pulse 1s infinite',
								}}
							>
								⏳
							</div>
							<p style={{ fontWeight: 'bold', color: '#ffc107' }}>로딩 중...</p>
							<p style={{ fontSize: '12px', color: '#6c757d' }}>이미지가 로드되고 있습니다</p>
						</div>
					) : (
						<div style={{ textAlign: 'center' }}>
							<div
								style={{
									width: '100px',
									height: '100px',
									backgroundColor: '#6c757d',
									borderRadius: '50%',
									margin: '0 auto 10px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									color: 'white',
									fontSize: '32px',
								}}
							>
								📷
							</div>
							<p style={{ fontWeight: 'bold', color: '#6c757d' }}>이미지 영역</p>
							<p style={{ fontSize: '12px', color: '#6c757d' }}>
								스크롤하여 이 영역에 도달하면 이미지가 로드됩니다
							</p>
						</div>
					)}
				</div>

				<div
					style={{
						height: '100px',
						backgroundColor: '#dee2e6',
						padding: '20px',
						borderRadius: '8px',
						margin: '20px 0',
					}}
				>
					<h5>📱 콘텐츠 섹션 4</h5>
					<p>이미지 로딩 영역을 지나쳤습니다</p>
				</div>

				<div
					style={{
						height: '120px',
						backgroundColor: '#e9ecef',
						padding: '20px',
						borderRadius: '8px',
						margin: '20px 0',
					}}
				>
					<h5>📱 콘텐츠 섹션 5</h5>
					<p>계속 스크롤하세요...</p>
				</div>

				<div
					style={{
						height: '150px',
						backgroundColor: '#f8f9fa',
						padding: '20px',
						borderRadius: '8px',
						margin: '20px 0',
					}}
				>
					<h5>📱 콘텐츠 섹션 6</h5>
					<p>이제 위로 스크롤하여 이미지 로딩 영역이 다시 나타나는 것을 확인하세요</p>
					<p>이미지가 이미 로드되었으므로 즉시 표시됩니다</p>
				</div>
			</div>

			<div
				style={{
					padding: '10px',
					backgroundColor: '#f8f9fa',
					borderRadius: '4px',
					border: '1px solid #dee2e6',
					marginTop: '15px',
				}}
			>
				<p>
					<strong>💡 지연 로딩의 장점:</strong>
				</p>
				<ul>
					<li>초기 페이지 로딩 속도 향상</li>
					<li>대역폭 절약</li>
					<li>사용자 경험 개선</li>
					<li>성능 최적화</li>
				</ul>
			</div>
		</div>
	);
}

// 코드 스니펫들
const basicCode = `const [isVisible, setIsVisible] = useState(false);
const [intersectionRatio, setIntersectionRatio] = useState(0);

const { ref, isIntersecting, intersectionRatio: ratio } = useIntersectionObserver({
  threshold: 0.5,
  rootMargin: '50px',
});

useEffect(() => {
  setIsVisible(isIntersecting);
  setIntersectionRatio(ratio);
}, [isIntersecting, ratio]);

return (
  <div ref={ref}>
    {isVisible ? '보임' : '안 보임'}
  </div>
);`;

const lazyLoadingCode = `const [isLoaded, setIsLoaded] = useState(false);
const [isInView, setIsInView] = useState(false);

const { ref, isIntersecting } = useIntersectionObserver({
  threshold: 0.1,
  rootMargin: '50px',
});

useEffect(() => {
  if (isIntersecting && !isLoaded) {
    setIsInView(true);
    // 이미지 로딩 시뮬레이션
    setTimeout(() => setIsLoaded(true), 1000);
  }
}, [isIntersecting, isLoaded]);

// 요소가 화면에 나타나면 자동으로 로딩 시작`;

export const Default = () => (
	<ToggleComponent
		title='기본 사용법'
		description='요소의 가시성을 감지하는 예제입니다.'
		code={basicCode}
	>
		<UseIntersectionObserverDemo />
	</ToggleComponent>
);

export const LazyLoading = () => (
	<ToggleComponent
		title='지연 로딩 예제'
		description='요소가 화면에 나타나면 자동으로 로딩하는 예제입니다.'
		code={lazyLoadingCode}
	>
		<LazyLoadingExample />
	</ToggleComponent>
);

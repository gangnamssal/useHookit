import React, { useState } from 'react';
import { useLongPress } from '../../src/ui/useLongPress';
import { CodeSnippet } from '../components/CodeSnippet';

export default {
	title: 'UI/useLongPress',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
## useLongPress 훅

길게 누르기 동작을 감지하는 훅입니다.

### 기본 사용법

\`\`\`tsx
import { useLongPress } from 'useHookit';

function MyComponent() {
  const { handlers } = useLongPress({
    delay: 1000,
    onLongPress: () => {
      console.log('길게 누름!');
    },
    onLongPressStart: () => {
      console.log('길게 누르기 시작');
    },
    onLongPressEnd: () => {
      console.log('길게 누르기 종료');
    },
  });

  return (
    <button {...handlers}>
      길게 누르세요
    </button>
  );
}
\`\`\`

### 매개변수

- \`delay\`: 길게 누르기로 인식할 시간 (밀리초)
- \`onLongPress\`: 길게 누르기가 완료되었을 때 호출되는 콜백
- \`onLongPressStart\`: 길게 누르기가 시작되었을 때 호출되는 콜백
- \`onLongPressEnd\`: 길게 누르기가 종료되었을 때 호출되는 콜백
- \`preventDefault\`: 기본 이벤트 방지 여부

### 반환값

- \`handlers\`: 이벤트 핸들러 객체
				`,
			},
		},
	},
};

// 토글 가능한 컴포넌트 래퍼
function ToggleComponent({
	children,
	code,
	title,
	description,
}: {
	children: React.ReactNode;
	code: string;
	title: string;
	description: string;
}) {
	const [showCode, setShowCode] = useState(false);

	return (
		<div style={{ marginBottom: '30px' }}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '15px',
				}}
			>
				<div>
					<h3 style={{ margin: 0 }}>{title}</h3>
				</div>
				<div style={{ display: 'flex', gap: '8px' }}>
					<button
						onClick={() => setShowCode(false)}
						style={{
							padding: '8px 16px',
							backgroundColor: !showCode ? '#007bff' : '#f8f9fa',
							color: !showCode ? 'white' : '#495057',
							border: `1px solid ${!showCode ? '#007bff' : '#dee2e6'}`,
							borderRadius: '6px',
							cursor: 'pointer',
							fontSize: '13px',
							fontWeight: '500',
							transition: 'all 0.2s ease',
						}}
					>
						Preview
					</button>
					<button
						onClick={() => setShowCode(true)}
						style={{
							padding: '8px 16px',
							backgroundColor: showCode ? '#007bff' : '#f8f9fa',
							color: showCode ? 'white' : '#495057',
							border: `1px solid ${showCode ? '#007bff' : '#dee2e6'}`,
							borderRadius: '6px',
							cursor: 'pointer',
							fontSize: '13px',
							fontWeight: '500',
							transition: 'all 0.2s ease',
						}}
					>
						Code
					</button>
				</div>
			</div>

			{showCode ? (
				<CodeSnippet code={code} />
			) : (
				<div>
					<p style={{ marginBottom: '15px', color: '#6c757d' }}>{description}</p>
					{children}
				</div>
			)}
		</div>
	);
}

function UseLongPressDemo() {
	const [longPressCount, setLongPressCount] = useState(0);
	const [isLongPressing, setIsLongPressing] = useState(false);

	const { handlers: longPressHandlers } = useLongPress({
		delay: 1000, // 1초
		onLongPress: () => {
			setLongPressCount((prev) => prev + 1);
		},
		onLongPressStart: () => setIsLongPressing(true),
		onLongPressEnd: () => setIsLongPressing(false),
		preventDefault: true,
	});

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>useLongPress 훅 데모</h3>
			<p>길게 누르기 동작을 감지하는 훅입니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<h4>상태 정보</h4>
				<p>
					<strong>길게 누르기 횟수:</strong> {longPressCount}
				</p>
				<p>
					<strong>현재 상태:</strong> {isLongPressing ? '🔄 길게 누르는 중...' : '⏸️ 대기 중'}
				</p>
			</div>

			<div
				{...longPressHandlers}
				style={{
					padding: '30px',
					backgroundColor: isLongPressing ? '#ffc107' : '#007bff',
					color: 'white',
					borderRadius: '8px',
					cursor: 'pointer',
					textAlign: 'center',
					transition: 'all 0.3s ease',
					userSelect: 'none',
					marginBottom: '20px',
				}}
			>
				<h4>길게 누르기 테스트</h4>
				<p>이 박스를 1초 이상 길게 누르세요!</p>
				<p>색이 변하면서 카운트가 증가합니다.</p>
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
					<li>박스를 1초 이상 길게 누르세요</li>
					<li>누르는 동안 색이 변합니다</li>
					<li>1초가 지나면 카운트가 증가합니다</li>
				</ul>
			</div>
		</div>
	);
}

export const Default = () => (
	<ToggleComponent
		title='기본 사용법'
		description='길게 누르기 동작을 감지하는 기본 예제입니다.'
		code={`const [longPressCount, setLongPressCount] = useState(0);
const [isLongPressing, setIsLongPressing] = useState(false);

const { handlers: longPressHandlers } = useLongPress({
  delay: 1000,
  onLongPress: () => setLongPressCount(prev => prev + 1),
  onLongPressStart: () => setIsLongPressing(true),
  onLongPressEnd: () => setIsLongPressing(false),
  preventDefault: true,
});

return (
  <div {...longPressHandlers}>
    <p>길게 누르기 횟수: {longPressCount}</p>
    <p>상태: {isLongPressing ? '길게 누르는 중' : '대기 중'}</p>
  </div>
);`}
	>
		<UseLongPressDemo />
	</ToggleComponent>
);

export const WithCustomThreshold = () => {
	const [longPressCount, setLongPressCount] = useState(0);
	const [isLongPressing, setIsLongPressing] = useState(false);

	const { handlers: longPressHandlers } = useLongPress({
		delay: 2000, // 2초
		onLongPress: () => {
			setLongPressCount((prev) => prev + 1);
		},
		onLongPressStart: () => setIsLongPressing(true),
		onLongPressEnd: () => setIsLongPressing(false),
		preventDefault: true,
	});

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>2초 임계값 예제</h3>
			<p>2초 이상 길게 누르면 동작합니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<p>
					<strong>길게 누르기 횟수:</strong> {longPressCount}
				</p>
				<p>
					<strong>현재 상태:</strong> {isLongPressing ? '🔄 길게 누르는 중...' : '⏸️ 대기 중'}
				</p>
			</div>

			<div
				{...longPressHandlers}
				style={{
					padding: '30px',
					backgroundColor: isLongPressing ? '#dc3545' : '#28a745',
					color: 'white',
					borderRadius: '8px',
					cursor: 'pointer',
					textAlign: 'center',
					transition: 'all 0.3s ease',
					userSelect: 'none',
					marginBottom: '20px',
				}}
			>
				<h4>2초 길게 누르기</h4>
				<p>이 박스를 2초 이상 길게 누르세요!</p>
				<p>더 오래 기다려야 합니다.</p>
			</div>
		</div>
	);
};

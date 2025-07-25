import { useState } from 'react';
import { useLongPress } from '@/ui/useLongPress';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'UI/useLongPress',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
A React hook that handles long press events with customizable timing and movement thresholds. Perfect for implementing mobile context menus, item selection, and drag-and-drop interactions.

### API

#### Parameters
- **delay**: number (optional, default: 500) - Duration in milliseconds to trigger long press
- **onLongPress**: () => void (optional) - Callback when long press is completed
- **onLongPressStart**: (event: MouseEvent | TouchEvent) => void (optional) - Callback when long press starts
- **onLongPressEnd**: () => void (optional) - Callback when long press ends
- **onLongPressCancel**: () => void (optional) - Callback when long press is cancelled
- **preventDefault**: boolean (optional, default: true) - Whether to prevent default events
- **shouldPreventDefault**: boolean (optional, default: true) - Whether to prevent default on touch events
- **moveThreshold**: number (optional, default: 10) - Movement threshold in pixels before canceling
- **Usage Example**: useLongPress({ delay: 1000, onLongPress: () => console.log('Long pressed!') });

#### Return Value
- **Type**: { handlers: LongPressHandlers, isLongPressing: boolean }
- **Description**: Returns event handlers to attach to target element and current long press state
- **Usage Example**: const { handlers, isLongPressing } = useLongPress(options);

#### Return Value Properties

| Property | Type | Description |
|----------|------|-------------|
| handlers | LongPressHandlers | Event handlers object to spread on target element |
| isLongPressing | boolean | Current long press state |

### Usage Examples

\`\`\`tsx
// Basic long press detection
const [longPressCount, setLongPressCount] = useState(0);

const { handlers, isLongPressing } = useLongPress({
  delay: 1000,
  onLongPress: () => setLongPressCount(prev => prev + 1),
  preventDefault: true,
});

return (
  <div {...handlers}>
    {isLongPressing ? 'Long pressing...' : 'Press and hold'}
    <p>Count: {longPressCount}</p>
  </div>
);

// Custom delay and movement threshold
const { handlers, isLongPressing } = useLongPress({
  delay: 2000, // 2 seconds
  moveThreshold: 50, // Allow 50px movement
  onLongPress: () => console.log('Long press completed'),
  preventDefault: true,
});

return (
  <button {...handlers}>
    {isLongPressing ? 'Long pressing...' : 'Hold for 2 seconds'}
  </button>
);

// Mobile context menu with cancel handling
const [showContextMenu, setShowContextMenu] = useState(false);

const { handlers, isLongPressing } = useLongPress({
  delay: 500,
  onLongPress: () => setShowContextMenu(true),
  onLongPressCancel: () => console.log('Long press cancelled'),
  preventDefault: true,
});

return (
  <div>
    <div {...handlers}>
      {isLongPressing ? 'Long pressing...' : 'Long press for context menu'}
    </div>
    {showContextMenu && (
      <div className="context-menu">
        <button onClick={() => console.log('Delete')}>Delete</button>
        <button onClick={() => console.log('Edit')}>Edit</button>
      </div>
    )}
  </div>
);
\`\`\`
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
};

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
  delay: 1000, // 1초
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

function WithCustomThresholdDemo() {
	const [longPressCount, setLongPressCount] = useState(0);
	const [isLongPressing, setIsLongPressing] = useState(false);

	const { handlers: longPressHandlers } = useLongPress({
		delay: 2000, // 2초
		moveThreshold: 50, // 이동 감지 임계값을 늘려서 실수로 취소되는 것을 방지
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
			<p>
				2초 이상 길게 누르면 동작합니다. 이동 감지 임계값을 늘려서 실수로 취소되는 것을
				방지했습니다.
			</p>

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
				<p>💡 팁: 손가락이나 마우스를 움직이지 말고 고정해서 누르세요.</p>
			</div>

			<div
				style={{
					padding: '15px',
					backgroundColor: '#f8f9fa',
					borderRadius: '4px',
					border: '1px solid #dee2e6',
					marginTop: '15px',
				}}
			>
				<p>
					<strong>설정:</strong>
				</p>
				<ul>
					<li>지연 시간: 2000ms (2초)</li>
					<li>이동 감지 임계값: 50px (기본값 10px보다 큼)</li>
					<li>이동 감지 임계값을 늘려서 실수로 롱프레스가 취소되는 것을 방지</li>
				</ul>
			</div>
		</div>
	);
}

export const WithCustomThreshold = () => (
	<ToggleComponent
		title='커스텀 임계값'
		description='2초 길게 누르기 + 이동 감지 임계값 조정 예제입니다.'
		code={`const [longPressCount, setLongPressCount] = useState(0);
const [isLongPressing, setIsLongPressing] = useState(false);

const { handlers: longPressHandlers } = useLongPress({
  delay: 2000, // 2초
  moveThreshold: 50, // 이동 감지 임계값을 늘려서 실수로 취소되는 것을 방지
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
		<WithCustomThresholdDemo />
	</ToggleComponent>
);

function MoveThresholdComparisonDemo() {
	const [strictCount, setStrictCount] = useState(0);
	const [looseCount, setLooseCount] = useState(0);
	const [isStrictLongPressing, setIsStrictLongPressing] = useState(false);
	const [isLooseLongPressing, setIsLooseLongPressing] = useState(false);

	const { handlers: strictHandlers } = useLongPress({
		delay: 1000,
		moveThreshold: 5, // 매우 엄격한 이동 감지
		onLongPress: () => setStrictCount((prev) => prev + 1),
		onLongPressStart: () => setIsStrictLongPressing(true),
		onLongPressEnd: () => setIsStrictLongPressing(false),
		preventDefault: true,
	});

	const { handlers: looseHandlers } = useLongPress({
		delay: 1000,
		moveThreshold: 100, // 매우 관대한 이동 감지
		onLongPress: () => setLooseCount((prev) => prev + 1),
		onLongPressStart: () => setIsLooseLongPressing(true),
		onLongPressEnd: () => setIsLooseLongPressing(false),
		preventDefault: true,
	});

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>이동 임계값 비교 예제</h3>
			<p>같은 1초 지연시간이지만 다른 이동 감지 임계값을 비교해보세요.</p>

			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr 1fr',
					gap: '20px',
					marginBottom: '20px',
				}}
			>
				<div>
					<h4>엄격한 이동 감지 (5px)</h4>
					<p>
						<strong>카운트:</strong> {strictCount}
					</p>
					<p>
						<strong>상태:</strong> {isStrictLongPressing ? '🔄 길게 누르는 중...' : '⏸️ 대기 중'}
					</p>
					<div
						{...strictHandlers}
						style={{
							padding: '20px',
							backgroundColor: isStrictLongPressing ? '#dc3545' : '#6c757d',
							color: 'white',
							borderRadius: '8px',
							cursor: 'pointer',
							textAlign: 'center',
							transition: 'all 0.3s ease',
							userSelect: 'none',
						}}
					>
						<p>엄격한 감지</p>
						<p style={{ fontSize: '12px' }}>5px만 움직여도 취소됨</p>
					</div>
				</div>

				<div>
					<h4>관대한 이동 감지 (100px)</h4>
					<p>
						<strong>카운트:</strong> {looseCount}
					</p>
					<p>
						<strong>상태:</strong> {isLooseLongPressing ? '🔄 길게 누르는 중...' : '⏸️ 대기 중'}
					</p>
					<div
						{...looseHandlers}
						style={{
							padding: '20px',
							backgroundColor: isLooseLongPressing ? '#28a745' : '#6c757d',
							color: 'white',
							borderRadius: '8px',
							cursor: 'pointer',
							textAlign: 'center',
							transition: 'all 0.3s ease',
							userSelect: 'none',
						}}
					>
						<p>관대한 감지</p>
						<p style={{ fontSize: '12px' }}>100px까지 움직여도 유지됨</p>
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
					<strong>비교 결과:</strong>
				</p>
				<ul>
					<li>왼쪽: 5px만 움직여도 롱프레스가 취소됨 (정밀한 제어)</li>
					<li>오른쪽: 100px까지 움직여도 롱프레스가 유지됨 (사용자 친화적)</li>
					<li>두 박스를 동시에 길게 누르면서 움직여보세요!</li>
				</ul>
			</div>
		</div>
	);
}

export const MoveThresholdComparison = () => (
	<ToggleComponent
		title='이동 임계값 비교'
		description='엄격한 이동 감지와 관대한 이동 감지를 비교하는 예제입니다.'
		code={`const [strictCount, setStrictCount] = useState(0);
const [looseCount, setLooseCount] = useState(0);
const [isStrictLongPressing, setIsStrictLongPressing] = useState(false);
const [isLooseLongPressing, setIsLooseLongPressing] = useState(false);

// 엄격한 이동 감지 (5px)
const { handlers: strictHandlers } = useLongPress({
  delay: 1000,
  moveThreshold: 5,
  onLongPress: () => setStrictCount(prev => prev + 1),
  onLongPressStart: () => setIsStrictLongPressing(true),
  onLongPressEnd: () => setIsStrictLongPressing(false),
  preventDefault: true,
});

// 관대한 이동 감지 (100px)
const { handlers: looseHandlers } = useLongPress({
  delay: 1000,
  moveThreshold: 100,
  onLongPress: () => setLooseCount(prev => prev + 1),
  onLongPressStart: () => setIsLooseLongPressing(true),
  onLongPressEnd: () => setIsLooseLongPressing(false),
  preventDefault: true,
});

return (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
    <div {...strictHandlers}>
      <p>엄격한 감지: {strictCount}</p>
    </div>
    <div {...looseHandlers}>
      <p>관대한 감지: {looseCount}</p>
    </div>
  </div>
);`}
	>
		<MoveThresholdComparisonDemo />
	</ToggleComponent>
);

function WithNoMoveThresholdDemo() {
	const [longPressCount, setLongPressCount] = useState(0);
	const [isLongPressing, setIsLongPressing] = useState(false);

	const { handlers: longPressHandlers } = useLongPress({
		delay: 1000, // 1초
		moveThreshold: 0, // 이동 감지 비활성화 (극단적인 경우)
		onLongPress: () => {
			setLongPressCount((prev) => prev + 1);
		},
		onLongPressStart: () => setIsLongPressing(true),
		onLongPressEnd: () => setIsLongPressing(false),
		preventDefault: true,
	});

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>이동 감지 비활성화 예제</h3>
			<p>1초 길게 누르기 + 이동 감지 완전 비활성화</p>

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
					backgroundColor: isLongPressing ? '#e83e8c' : '#20c997',
					color: 'white',
					borderRadius: '8px',
					cursor: 'pointer',
					textAlign: 'center',
					transition: 'all 0.3s ease',
					userSelect: 'none',
					marginBottom: '20px',
				}}
			>
				<h4>이동 감지 없음</h4>
				<p>이 박스를 1초 이상 길게 누르세요!</p>
				<p>💡 팁: 아무리 움직여도 롱프레스가 취소되지 않습니다!</p>
			</div>

			<div
				style={{
					padding: '15px',
					backgroundColor: '#f8f9fa',
					borderRadius: '4px',
					border: '1px solid #dee2e6',
					marginTop: '15px',
				}}
			>
				<p>
					<strong>설정:</strong>
				</p>
				<ul>
					<li>지연 시간: 1000ms (1초)</li>
					<li>이동 감지 임계값: 0px (완전 비활성화)</li>
					<li>사용자가 아무리 움직여도 롱프레스가 유지됨</li>
					<li>주의: 의도하지 않은 롱프레스가 발생할 수 있음</li>
				</ul>
			</div>
		</div>
	);
}

export const WithNoMoveThreshold = () => (
	<ToggleComponent
		title='이동 감지 비활성화'
		description='이동 감지를 완전히 비활성화하는 극단적인 예제입니다.'
		code={`const [longPressCount, setLongPressCount] = useState(0);
const [isLongPressing, setIsLongPressing] = useState(false);

const { handlers: longPressHandlers } = useLongPress({
  delay: 1000, // 1초
  moveThreshold: 0, // 이동 감지 비활성화 (극단적인 경우)
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
		<WithNoMoveThresholdDemo />
	</ToggleComponent>
);

function WithHighMoveThresholdDemo() {
	const [longPressCount, setLongPressCount] = useState(0);
	const [isLongPressing, setIsLongPressing] = useState(false);

	const { handlers: longPressHandlers } = useLongPress({
		delay: 1500, // 1.5초
		moveThreshold: 100, // 매우 큰 이동 감지 임계값
		onLongPress: () => {
			setLongPressCount((prev) => prev + 1);
		},
		onLongPressStart: () => setIsLongPressing(true),
		onLongPressEnd: () => setIsLongPressing(false),
		preventDefault: true,
	});

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>높은 이동 임계값 예제</h3>
			<p>1.5초 길게 누르기 + 매우 관대한 이동 감지 (100px)</p>

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
					backgroundColor: isLongPressing ? '#6f42c1' : '#fd7e14',
					color: 'white',
					borderRadius: '8px',
					cursor: 'pointer',
					textAlign: 'center',
					transition: 'all 0.3s ease',
					userSelect: 'none',
					marginBottom: '20px',
				}}
			>
				<h4>관대한 이동 감지</h4>
				<p>이 박스를 1.5초 이상 길게 누르세요!</p>
				<p>💡 팁: 100px까지 움직여도 롱프레스가 유지됩니다!</p>
			</div>

			<div
				style={{
					padding: '15px',
					backgroundColor: '#f8f9fa',
					borderRadius: '4px',
					border: '1px solid #dee2e6',
					marginTop: '15px',
				}}
			>
				<p>
					<strong>설정:</strong>
				</p>
				<ul>
					<li>지연 시간: 1500ms (1.5초)</li>
					<li>이동 감지 임계값: 100px (매우 관대함)</li>
					<li>사용자가 많이 움직여도 롱프레스가 취소되지 않음</li>
					<li>모바일에서 특히 유용한 설정</li>
				</ul>
			</div>
		</div>
	);
}

export const WithHighMoveThreshold = () => (
	<ToggleComponent
		title='높은 이동 임계값'
		description='매우 관대한 이동 감지 임계값을 사용하는 예제입니다.'
		code={`const [longPressCount, setLongPressCount] = useState(0);
const [isLongPressing, setIsLongPressing] = useState(false);

const { handlers: longPressHandlers } = useLongPress({
  delay: 1500, // 1.5초
  moveThreshold: 100, // 매우 큰 이동 감지 임계값
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
		<WithHighMoveThresholdDemo />
	</ToggleComponent>
);

import { useState } from 'react';
import { useKeyPress } from '../../../src/ui/useKeyPress';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'UI/useKeyPress',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
A React hook that provides comprehensive keyboard event detection including single keys, key combinations, and various event types. Simplifies keyboard input handling with automatic cleanup and flexible configuration options. Supports case-insensitive key detection and automatic key normalization (e.g., 'Control' and 'Ctrl' are treated as the same key).

### API

#### Parameters
- **key**: string | string[] - Key(s) to listen for (case insensitive)
- **options**: UseKeyPressOptions - Configuration options
- **Usage Example**: useKeyPress('Enter');

#### Options
- **target**: EventTarget | null - Target element (default: document)
- **preventDefault**: boolean - Prevent default behavior (default: false)
- **enabled**: boolean - Whether the hook is enabled (default: true)
- **keydown**: boolean - Listen for keydown events (default: true)
- **keyup**: boolean - Listen for keyup events (default: true)
- **keyMappings**: Record<string, string> - Custom key mappings for different keyboard layouts

#### Return Value
- **Type**: { isPressed: boolean, keyCode: string | null, pressedAt: number | null, holdDuration: number | null }
- **Description**: Object containing key press state and metadata
- **isPressed**: Whether the key is currently pressed
- **keyCode**: Key code of the pressed key (null when not pressed)
- **pressedAt**: Timestamp when the key was pressed (null when not pressed)
- **holdDuration**: Duration the key has been held in milliseconds (null when not pressed)
- **Usage Example**: const { isPressed, keyCode, holdDuration } = useKeyPress('Enter');

### Usage Examples

\`\`\`tsx
const { isPressed, keyCode, holdDuration } = useKeyPress('Enter');

return (
  <div>
    <p>상태: {isPressed ? '눌림' : '떼어짐'}</p>
    <p>키: {keyCode || '없음'}</p>
    <p>홀드 시간: {holdDuration ? \`\${holdDuration}ms\` : '0ms'}</p>
  </div>
);
\`\`\`

### Related Features

#### Key Combinations
Detect when multiple keys are pressed simultaneously. **Note:** Automatically enabled when key array has more than one element. All keys in the combination must be pressed simultaneously for the hook to return isPressed: true.

**Usage Example**:
\`\`\`tsx
const { isPressed, keyCode, holdDuration } = useKeyPress(['Control', 'a']);

return (
  <div>
    {isPressed ? 'Ctrl+A 감지됨!' : 'Ctrl+A를 눌러보세요'}
    <p>감지된 키: {keyCode || '없음'}</p>
    <p>홀드 시간: {isPressed ? '누르는 중...' : holdDuration ? \`\${holdDuration}ms\` : '0ms'}</p>
  </div>
);
\`\`\`

#### Hold Duration
Track how long a key has been held down. **Note:** Hold duration is automatically calculated when keys are pressed and updates every 16ms.

**Usage Example**:
\`\`\`tsx
const { isPressed, holdDuration } = useKeyPress(' '); // Space 키

return (
  <div>
    <p>holdDuration: {isPressed ? holdDuration : 0}ms</p>
  </div>
);
\`\`\`

#### Custom Key Mappings
Support for different keyboard layouts using custom key mappings. Useful for international keyboards where the same physical key produces different characters.

**Usage Example**:
\`\`\`tsx
// 기본 A 키 감지
const { isPressed: isPressedA } = useKeyPress('a');

// 한국어 키보드 지원 (ㅁ 키를 A로 매핑)
const { isPressed: isPressedKoreanA } = useKeyPress('a', {
  keyMappings: { 'ㅁ': 'a' }
});

return (
  <div>
    <p>A 키 상태: {isPressedA ? '감지됨' : '없음'}</p>
    <p>한국어 A 키 상태: {isPressedKoreanA ? '감지됨' : '없음'}</p>
  </div>
);
\`\`\`

#### Target Element
Listen for key events on a specific element. Useful for form inputs, modals, or any element that should capture keyboard events independently.

**Usage Example**:
\`\`\`tsx
const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);

const { isPressed } = useKeyPress('Escape', {
  target: inputRef
});

return (
  <div>
    <input 
      ref={setInputRef}
      placeholder="텍스트를 입력하고 Escape를 눌러보세요"
    />
    <p>Escape 키 상태: {isPressed ? '눌림' : '떼어짐'}</p>
  </div>
);
\`\`\`
				`,
			},
			canvas: {
				sourceState: 'none',
				hidden: true,
			},
			story: {
				iframeHeight: '0px',
				inline: false,
			},
			disable: true,
		},
	},
};

// 간단한 키 감지 데모 컴포넌트
function SimpleKeyDemo({ keyName }: { keyName: string }) {
	const { isPressed, keyCode, holdDuration } = useKeyPress(keyName, {
		preventDefault: true,
	});

	return (
		<div
			style={{
				width: '200px',
				padding: '20px',
				border: '1px solid #ccc',
				borderRadius: '8px',
				margin: '10px',
			}}
		>
			<h4>키 감지: {keyName}</h4>
			<div
				style={{
					padding: '15px',
					backgroundColor: isPressed ? '#d4edda' : '#f8f9fa',
					borderRadius: '4px',
					border: `1px solid ${isPressed ? '#c3e6cb' : '#dee2e6'}`,
					textAlign: 'center',
					fontSize: '16px',
					fontWeight: 'bold',
					marginBottom: '10px',
				}}
			>
				{isPressed ? '🔴 눌림' : '⚪ 떼어짐'}
			</div>
			<div style={{ fontSize: '14px', color: '#666' }}>
				<p>감지된 키: {keyCode || '없음'}</p>
				<p>홀드 시간: {holdDuration ? `${holdDuration}ms` : '0ms'}</p>
			</div>
		</div>
	);
}

export const Default = () => (
	<ToggleComponent
		title='기본 사용법'
		description='단일 키 감지의 기본 예제입니다. 시뮬레이션 버튼을 사용하여 테스트하세요.'
		code={`const { isPressed, keyCode, holdDuration } = useKeyPress('Enter');

return (
  <div>
    <p>상태: {isPressed ? '눌림' : '떼어짐'}</p>
    <p>키: {keyCode || '없음'}</p>
    <p>홀드 시간: {holdDuration ? \`\${holdDuration}ms\` : '0ms'}</p>
  </div>
);`}
	>
		<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
			<SimpleKeyDemo keyName='Enter' />
			<SimpleKeyDemo keyName='Escape' />
			<SimpleKeyDemo keyName='Tab' />
		</div>
		<div
			style={{
				marginTop: '20px',
				padding: '15px',
				backgroundColor: '#fff3cd',
				borderRadius: '4px',
				border: '1px solid #ffeaa7',
			}}
		>
			<p>
				<strong>💡 참고:</strong> Storybook의 iframe 환경에서는 실제 키보드 입력이 제한될 수
				있습니다. 시뮬레이션 버튼을 사용하여 기능을 테스트하세요.
			</p>
		</div>
	</ToggleComponent>
);

export const WithKeyCombination = () => {
	const { isPressed, keyCode, holdDuration } = useKeyPress(['Control', 'a']);

	return (
		<ToggleComponent
			title='키 조합 사용법'
			description='여러 키를 동시에 눌러야 감지되는 예제입니다. 시뮬레이션 버튼을 사용하여 테스트하세요.'
			code={`const { isPressed, keyCode, holdDuration } = useKeyPress(['Control', 'a']);

return (
  <div>
    {isPressed ? 'Ctrl+A 감지됨!' : 'Ctrl+A를 눌러보세요'}
    <p>감지된 키: {keyCode || '없음'}</p>
    <p>홀드 시간: {isPressed ? '누르는 중...' : holdDuration ? \`\${holdDuration}ms\` : '0ms'}</p>
  </div>
);`}
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>키 조합 감지</h3>
				<p>실제 키보드로 Ctrl+A를 누르거나 시뮬레이션 버튼을 클릭해보세요!</p>
				<p>동작하지 않으면 한글(ㅁ)로 되어있을 수 있습니다.</p>
				<p>영어로 변경해 테스트해보세요.</p>

				<div style={{ marginBottom: '20px' }}>
					<h4>조합 키 상태</h4>
					<div
						style={{
							padding: '20px',
							backgroundColor: isPressed ? '#d4edda' : '#f8f9fa',
							borderRadius: '4px',
							border: `1px solid ${isPressed ? '#c3e6cb' : '#dee2e6'}`,
							textAlign: 'center',
							fontSize: '18px',
							fontWeight: 'bold',
						}}
					>
						{isPressed ? '✅ Ctrl+A 감지됨!' : '⏳ Ctrl+A를 눌러보세요'}
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>상태 정보</h4>
					<div style={{ fontSize: '14px', color: '#666' }}>
						<p>
							감지된 키: <strong>{keyCode || '없음'}</strong>
						</p>
						<p>
							홀드 시간:{' '}
							<strong>
								{isPressed ? '누르는 중...' : holdDuration ? `${holdDuration}ms` : '0ms'}
							</strong>
						</p>
					</div>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithTargetElement = () => {
	const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);

	const { isPressed } = useKeyPress('Escape', {
		target: inputRef,
	});

	return (
		<ToggleComponent
			title='타겟 요소 지정'
			description='특정 요소에서만 키 이벤트를 감지하는 예제입니다. 입력 필드에 포커스를 맞추고 Escape를 눌러보세요.'
			code={`const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);

const { isPressed } = useKeyPress('Escape', {
  target: inputRef
});

return (
  <div>
    <input 
      ref={setInputRef}
      placeholder="텍스트를 입력하고 Escape를 눌러보세요"
    />
    <p>Escape 키 상태: {isPressed ? '눌림' : '떼어짐'}</p>
  </div>
);`}
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>타겟 요소 지정</h3>
				<p>입력 필드에 포커스를 맞추고 Escape 키를 눌러보세요!</p>

				<div style={{ marginBottom: '20px' }}>
					<h4>입력 필드</h4>
					<input
						ref={setInputRef}
						placeholder='텍스트를 입력하고 Escape를 눌러보세요'
						style={{
							width: '100%',
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							fontSize: '16px',
						}}
					/>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>Escape 키 상태</h4>
					<div
						style={{
							padding: '15px',
							backgroundColor: isPressed ? '#d4edda' : '#f8f9fa',
							borderRadius: '4px',
							border: `1px solid ${isPressed ? '#c3e6cb' : '#dee2e6'}`,
							textAlign: 'center',
						}}
					>
						{isPressed ? '🔴 Escape 키가 눌림' : '⚪ Escape 키가 떼어짐'}
					</div>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithPreventDefault = () => {
	const { isPressed } = useKeyPress('Enter', {
		preventDefault: true,
	});

	return (
		<ToggleComponent
			title='preventDefault 사용법'
			description='기본 키보드 동작을 방지하는 예제입니다. 시뮬레이션 버튼을 사용하여 테스트하세요.'
			code={`const { isPressed } = useKeyPress('Enter', {
  preventDefault: true
});

return (
  <div>
    <p>Enter 키 상태: {isPressed ? '감지됨' : '없음'}</p>
    <p>Enter 키를 눌러도 폼이 제출되지 않습니다</p>
  </div>
);`}
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>preventDefault 사용법</h3>
				<p>시뮬레이션 버튼을 사용하여 Enter 키 preventDefault를 테스트하세요!</p>

				<div style={{ marginBottom: '20px' }}>
					<h4>Enter 키 상태</h4>
					<div
						style={{
							padding: '20px',
							backgroundColor: isPressed ? '#d4edda' : '#f8f9fa',
							borderRadius: '4px',
							border: `1px solid ${isPressed ? '#c3e6cb' : '#dee2e6'}`,
							textAlign: 'center',
							fontSize: '18px',
							fontWeight: 'bold',
						}}
					>
						{isPressed ? '🔴 Enter 키 감지됨!' : '⚪ Enter 키를 눌러보세요'}
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>테스트 폼</h4>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							alert('폼 제출 시도됨!');
						}}
						style={{
							padding: '15px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
						}}
					>
						<input
							type='text'
							placeholder='텍스트를 입력하고 Enter를 눌러보세요'
							style={{
								width: '100%',
								padding: '10px',
								border: '1px solid #ccc',
								borderRadius: '4px',
								marginBottom: '10px',
							}}
						/>
						<button
							type='submit'
							style={{
								padding: '10px 20px',
								backgroundColor: '#007bff',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							제출
						</button>
					</form>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithKeyMappings = () => {
	const { isPressed: isPressedA, keyCode: keyCodeA } = useKeyPress('a');

	const { isPressed: isPressedKoreanA, keyCode: keyCodeKoreanA } = useKeyPress('a', {
		keyMappings: { ㅁ: 'a' },
	});

	return (
		<ToggleComponent
			title='키 매핑 사용법'
			description='다른 키보드 레이아웃을 위한 커스텀 키 매핑 예제입니다. 시뮬레이션 버튼을 사용하여 테스트하세요.'
			code={`// 기본 A 키 감지
const { isPressed: isPressedA } = useKeyPress('a');

// 한국어 키보드 지원 (ㅁ 키를 A로 매핑)
const { isPressed: isPressedKoreanA } = useKeyPress('a', {
  keyMappings: { 'ㅁ': 'a' }
});

return (
  <div>
    <p>A 키 상태: {isPressedA ? '감지됨' : '없음'}</p>
    <p>한국어 A 키 상태: {isPressedKoreanA ? '감지됨' : '없음'}</p>
  </div>
);`}
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>키 매핑 사용법</h3>
				<p>다른 키보드 레이아웃을 위한 커스텀 키 매핑을 테스트해보세요!</p>

				<div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
					<div
						style={{ flex: 1, padding: '15px', border: '1px solid #dee2e6', borderRadius: '4px' }}
					>
						<h4>기본 A 키 감지</h4>
						<div
							style={{
								padding: '15px',
								backgroundColor: isPressedA ? '#d4edda' : '#f8f9fa',
								borderRadius: '4px',
								border: `1px solid ${isPressedA ? '#c3e6cb' : '#dee2e6'}`,
								textAlign: 'center',
								marginBottom: '10px',
							}}
						>
							{isPressedA ? '🔴 A 키 감지됨!' : '⚪ A 키를 눌러보세요'}
						</div>
						<p style={{ fontSize: '14px', color: '#666' }}>
							감지된 키: <strong>{keyCodeA || '없음'}</strong>
						</p>
					</div>

					<div
						style={{ flex: 1, padding: '15px', border: '1px solid #dee2e6', borderRadius: '4px' }}
					>
						<h4>한국어 키보드 A 키 감지</h4>
						<div
							style={{
								padding: '15px',
								backgroundColor: isPressedKoreanA ? '#d4edda' : '#f8f9fa',
								borderRadius: '4px',
								border: `1px solid ${isPressedKoreanA ? '#c3e6cb' : '#dee2e6'}`,
								textAlign: 'center',
								marginBottom: '10px',
							}}
						>
							{isPressedKoreanA ? '🔴 ㅁ 키 감지됨!' : '⚪ ㅁ 키를 눌러보세요'}
						</div>
						<p style={{ fontSize: '14px', color: '#666' }}>
							감지된 키: <strong>{keyCodeKoreanA || '없음'}</strong>
						</p>
					</div>
				</div>
			</div>
		</ToggleComponent>
	);
};

// 간소화된 holdDuration 데모 컴포넌트
function HoldDurationDemo({ keyName = 'Space' }: { keyName?: string }) {
	const { isPressed, holdDuration } = useKeyPress(keyName, {
		preventDefault: true,
	});

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px' }}>
			<h4>holdDuration 테스트: {keyName === ' ' ? 'Space' : keyName} 키</h4>
			<div
				style={{
					padding: '15px',
					backgroundColor: isPressed ? '#d1ecf1' : '#f8f9fa',
					borderRadius: '4px',
					border: `1px solid ${isPressed ? '#bee5eb' : '#dee2e6'}`,
					textAlign: 'center',
					fontSize: '16px',
					fontWeight: 'bold',
					marginBottom: '10px',
				}}
			>
				{isPressed ? '🔵 누르는 중...' : '⚪ 떼어짐'}
			</div>
			<div style={{ fontSize: '14px', color: '#666' }}>
				<p>
					holdDuration: <strong>{holdDuration}ms</strong>
				</p>
			</div>
		</div>
	);
}

export const HoldDurationStory = () => (
	<ToggleComponent
		title='holdDuration 실시간 테스트'
		description='키를 누르고 있는 동안 holdDuration(ms)이 실시간으로 증가하는지 확인할 수 있습니다. 시뮬레이션 버튼 또는 실제 키보드로 Space/ArrowUp/Enter 등을 눌러보세요.'
		code={`const { isPressed, holdDuration } = useKeyPress(' '); // Space 키

return (
  <div>
    <p>holdDuration: {isPressed ? holdDuration : 0}ms</p>
  </div>
);`}
	>
		<div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
			<HoldDurationDemo keyName=' ' />
			<HoldDurationDemo keyName='ArrowUp' />
			<HoldDurationDemo keyName='Enter' />
		</div>
		<div
			style={{
				marginTop: '20px',
				padding: '15px',
				backgroundColor: '#fff3cd',
				borderRadius: '4px',
				border: '1px solid #ffeaa7',
			}}
		>
			<p>
				<strong>💡 참고:</strong> Storybook의 iframe 환경에서는 실제 키보드 입력이 제한될 수
				있습니다. 시뮬레이션 버튼을 사용하거나, 실제 키보드로 테스트하세요.
			</p>
		</div>
	</ToggleComponent>
);

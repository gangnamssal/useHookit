import React, { useState } from 'react';
import { useKeyPress } from '../../../src/ui/useKeyPress';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'UI/useKeyPress',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
A React hook that provides comprehensive keyboard event detection including single keys, key combinations, and various event types. Simplifies keyboard input handling with automatic cleanup and flexible configuration options.

### API

#### Parameters
- **key**: string | string[] - Key(s) to listen for (case insensitive)
- **options**: UseKeyPressOptions - Configuration options
- **Usage Example**: useKeyPress('Enter', { preventDefault: true });

#### Options
- **target**: EventTarget | null - Target element (default: document)
- **preventDefault**: boolean - Prevent default behavior (default: false)
- **enabled**: boolean - Whether the hook is enabled (default: true)
- **keydown**: boolean - Listen for keydown events (default: true)
- **keyup**: boolean - Listen for keyup events (default: false)
- **keypress**: boolean - Listen for keypress events (default: false)
- **keyMappings**: Record<string, string> - Custom key mappings for different keyboard layouts

#### Implementation Details
- **Case Insensitive**: All keys are converted to lowercase for comparison
- **Key Combination Logic**: Automatically enabled for arrays with length > 1
- **Hold Duration**: Only calculated when keyup is enabled (60fps updates with 16ms intervals)
- **Event Cleanup**: Automatic cleanup on unmount and option changes
- **Memory Management**: Prevents duplicate event listeners and interval leaks
- **Event Processing**: Handles keydown → keyup → keypress in sequence
- **Custom Key Mappings**: Supports custom key mappings for different keyboard layouts

#### Return Value
- **Type**: { isPressed: boolean, keyCode: string | null, pressedAt: number | null, holdDuration: number | null }
- **Description**: Object containing key press state and metadata
- **Usage Example**: const { isPressed, keyCode, holdDuration } = useKeyPress('Enter', { keyup: true });

### Usage Examples

\`\`\`tsx
// Basic key detection
const { isPressed } = useKeyPress('Enter');

return (
  <div>
    {isPressed ? 'Enter pressed!' : 'Press Enter'}
  </div>
);
\`\`\`

### Related Features

#### Key Combinations
Detect when multiple keys are pressed simultaneously. **Note:** Automatically enabled when key array has more than one element.

**Usage Example**:
\`\`\`tsx
const { isPressed } = useKeyPress(['Control', 's'], {
  preventDefault: true
});

return (
  <div>
    {isPressed ? 'Ctrl+S pressed!' : 'Press Ctrl+S to save'}
  </div>
);
\`\`\`

#### Custom Key Mappings
Support for different keyboard layouts using custom key mappings.

**Usage Example**:
\`\`\`tsx
const { isPressed } = useKeyPress('a', {
  keyMappings: { 'ㅁ': 'a' } // Korean keyboard support
});

return (
  <div>
    {isPressed ? 'A key pressed!' : 'Press A or ㅁ'}
  </div>
);
\`\`\`

#### Hold Duration
Track how long a key has been held down. **Note:** Requires \`keyup: true\` to calculate hold duration.

**Usage Example**:
\`\`\`tsx
const { isPressed, holdDuration } = useKeyPress('ArrowUp', {
  keyup: true,
  preventDefault: true
});

return (
  <div>
    {isPressed ? \`ArrowUp held for \${holdDuration}ms\` : 'Hold ArrowUp'}
  </div>
);
\`\`\`

#### Target Element
Listen for key events on specific elements.

**Usage Example**:
\`\`\`tsx
const inputRef = useRef<HTMLInputElement>(null);
const { isPressed } = useKeyPress('Escape', {
  target: inputRef.current,
  preventDefault: true
});

return (
  <input ref={inputRef} />
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

// 간단한 키 감지 데모 컴포넌트
function SimpleKeyDemo({ keyName, options = {} }: { keyName: string; options?: any }) {
	const { isPressed, keyCode, holdDuration } = useKeyPress(keyName, {
		keydown: true,
		keyup: true,
		preventDefault: true,
		...options,
	});

	const simulateKeyPress = () => {
		const keydownEvent = new KeyboardEvent('keydown', { key: keyName });
		document.dispatchEvent(keydownEvent);

		setTimeout(() => {
			const keyupEvent = new KeyboardEvent('keyup', { key: keyName });
			document.dispatchEvent(keyupEvent);
		}, 100);
	};

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', margin: '10px' }}>
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
			<button
				onClick={simulateKeyPress}
				style={{
					padding: '8px 16px',
					backgroundColor: '#007bff',
					color: 'white',
					border: 'none',
					borderRadius: '4px',
					cursor: 'pointer',
					fontSize: '12px',
					marginTop: '10px',
				}}
			>
				시뮬레이션: {keyName} 키
			</button>
		</div>
	);
}

export const Default = () => (
	<ToggleComponent
		title='기본 사용법'
		description='단일 키 감지의 기본 예제입니다. 시뮬레이션 버튼을 사용하여 테스트하세요.'
		code={`const { isPressed, keyCode, pressedAt, holdDuration } = useKeyPress('Enter', {
  keyup: true,
  preventDefault: true
});

return (
  <div>
    <p>상태: {isPressed ? '눌림' : '떼어짐'}</p>
    <p>키: {keyCode || '없음'}</p>
    <p>홀드 시간: {holdDuration ? \`\${holdDuration}ms\` : '0ms'}</p>
  </div>
);`}
	>
		<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
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
	const { isPressed, keyCode, pressedAt, holdDuration } = useKeyPress(['Control', 'a'], {
		keydown: true,
		keyup: true,
		preventDefault: true,
	});

	const simulateKeyCombination = () => {
		// Control 키 누름
		const ctrlDown = new KeyboardEvent('keydown', { key: 'Control' });
		document.dispatchEvent(ctrlDown);

		// A 키 누름
		const aDown = new KeyboardEvent('keydown', { key: 'a' });
		document.dispatchEvent(aDown);

		// 100ms 후 A 키 뗌
		setTimeout(() => {
			const aUp = new KeyboardEvent('keyup', { key: 'a' });
			document.dispatchEvent(aUp);
		}, 100);

		// 200ms 후 Control 키 뗌
		setTimeout(() => {
			const ctrlUp = new KeyboardEvent('keyup', { key: 'Control' });
			document.dispatchEvent(ctrlUp);
		}, 200);
	};

	return (
		<ToggleComponent
			title='키 조합 사용법'
			description='여러 키를 동시에 눌러야 감지되는 예제입니다. 시뮬레이션 버튼을 사용하여 테스트하세요.'
			code={`const { isPressed, keyCode, pressedAt, holdDuration } = useKeyPress(['Control', 'a'], {
  keydown: true,
  keyup: true,
  preventDefault: true
});

return (
  <div>
    {isPressed ? 'Ctrl+A 감지됨!' : 'Ctrl+A를 눌러보세요'}
    <p>감지된 키: {keyCode || '없음'}</p>
    <p>홀드 시간: {holdDuration ? \`\${holdDuration}ms\` : '0ms'}</p>
  </div>
);`}
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>키 조합 감지</h3>
				<p>실제 키보드로 Ctrl+A를 누르거나 시뮬레이션 버튼을 클릭해보세요!</p>

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
							눌린 시간:{' '}
							<strong>{pressedAt ? new Date(pressedAt).toLocaleTimeString() : '없음'}</strong>
						</p>
						<p>
							홀드 시간: <strong>{holdDuration ? `${holdDuration}ms` : '0ms'}</strong>
						</p>
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
						<strong>💡 키 조합 특징:</strong>
					</p>
					<ul>
						<li>모든 키가 동시에 눌려야 감지됩니다</li>
						<li>하나라도 떼면 조합이 해제됩니다</li>
						<li>순서는 중요하지 않습니다</li>
						<li>대소문자를 구분하지 않습니다</li>
					</ul>
				</div>

				<div
					style={{
						padding: '15px',
						backgroundColor: '#fff3cd',
						borderRadius: '4px',
						border: '1px solid #ffeaa7',
						marginBottom: '15px',
					}}
				>
					<p>
						<strong>🔧 사용 팁:</strong>
					</p>
					<ul>
						<li>실제 키보드: Ctrl을 누른 상태에서 A를 누르세요</li>
						<li>시뮬레이션: 버튼을 클릭하면 자동으로 Ctrl+A 조합을 시뮬레이션합니다</li>
						<li>Storybook iframe 환경에서는 실제 키보드 입력이 제한될 수 있습니다</li>
					</ul>
				</div>

				<button
					onClick={simulateKeyCombination}
					style={{
						padding: '10px 20px',
						backgroundColor: '#28a745',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						fontSize: '14px',
						marginTop: '15px',
						width: '100%',
					}}
				>
					시뮬레이션: Ctrl+A 조합
				</button>
			</div>
		</ToggleComponent>
	);
};

export const WithTargetElement = () => {
	const [inputValue, setInputValue] = useState('');
	const inputRef = React.useRef<HTMLInputElement>(null);

	const { isPressed, keyCode, pressedAt, holdDuration } = useKeyPress('Escape', {
		target: inputRef.current,
		keydown: true,
		keyup: true,
		preventDefault: false, // 기본 동작 허용
	});

	// Escape 키가 눌리면 입력값 초기화
	React.useEffect(() => {
		if (isPressed) {
			setInputValue('');
		}
	}, [isPressed]);

	const simulateEscape = () => {
		// 입력 필드에 포커스
		if (inputRef.current) {
			inputRef.current.focus();
		}

		// Escape 키 시뮬레이션
		const keydownEvent = new KeyboardEvent('keydown', { key: 'Escape' });
		document.dispatchEvent(keydownEvent);

		setTimeout(() => {
			const keyupEvent = new KeyboardEvent('keyup', { key: 'Escape' });
			document.dispatchEvent(keyupEvent);
		}, 100);
	};

	return (
		<ToggleComponent
			title='타겟 요소 지정'
			description='특정 요소에서만 키 이벤트를 감지하는 예제입니다. 입력 필드에 포커스를 맞추고 Escape를 눌러보세요.'
			code={`const [inputValue, setInputValue] = useState('');
const inputRef = useRef<HTMLInputElement>(null);

const { isPressed } = useKeyPress('Escape', {
  target: inputRef.current,
  keydown: true,
  keyup: true,
  preventDefault: false
});

// Escape 키가 눌리면 입력값 초기화
React.useEffect(() => {
  if (isPressed) {
    setInputValue('');
  }
}, [isPressed]);

return (
  <div>
    <input 
      ref={inputRef}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
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
						ref={inputRef}
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						placeholder='텍스트를 입력하고 Escape를 눌러보세요'
						style={{
							width: '100%',
							padding: '10px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							fontSize: '16px',
						}}
					/>
					<p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
						💡 입력 필드를 클릭하여 포커스를 맞춘 후 Escape를 눌러보세요
					</p>
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

				<div style={{ marginBottom: '20px' }}>
					<h4>상태 정보</h4>
					<div style={{ fontSize: '14px', color: '#666' }}>
						<p>
							감지된 키: <strong>{keyCode || '없음'}</strong>
						</p>
						<p>
							눌린 시간:{' '}
							<strong>{pressedAt ? new Date(pressedAt).toLocaleTimeString() : '없음'}</strong>
						</p>
						<p>
							홀드 시간: <strong>{holdDuration ? `${holdDuration}ms` : '0ms'}</strong>
						</p>
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
						<strong>💡 타겟 요소 특징:</strong>
					</p>
					<ul>
						<li>특정 요소에서만 키 이벤트를 감지합니다</li>
						<li>입력 필드에 포커스가 있을 때만 Escape 키가 감지됩니다</li>
						<li>Escape 키를 누르면 입력값이 초기화됩니다</li>
						<li>기본 Escape 동작(포커스 해제)도 함께 작동합니다</li>
					</ul>
				</div>

				<div
					style={{
						padding: '15px',
						backgroundColor: '#fff3cd',
						borderRadius: '4px',
						border: '1px solid #ffeaa7',
						marginBottom: '15px',
					}}
				>
					<p>
						<strong>🔧 사용 팁:</strong>
					</p>
					<ul>
						<li>입력 필드를 클릭하여 포커스를 맞추세요</li>
						<li>텍스트를 입력한 후 Escape 키를 눌러보세요</li>
						<li>시뮬레이션 버튼을 클릭하면 자동으로 포커스를 맞추고 Escape를 시뮬레이션합니다</li>
						<li>Escape 키는 입력 필드에 포커스가 있을 때만 감지됩니다</li>
					</ul>
				</div>

				<button
					onClick={simulateEscape}
					style={{
						padding: '10px 20px',
						backgroundColor: '#dc3545',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						fontSize: '14px',
						marginTop: '15px',
						width: '100%',
					}}
				>
					시뮬레이션: 입력 필드 포커스 + Escape 키
				</button>
			</div>
		</ToggleComponent>
	);
};

export const WithPreventDefault = () => {
	const { isPressed } = useKeyPress('Enter', {
		keydown: true,
		keyup: true,
		preventDefault: true,
	});

	const simulateEnter = () => {
		const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
		document.dispatchEvent(keydownEvent);

		setTimeout(() => {
			const keyupEvent = new KeyboardEvent('keyup', { key: 'Enter' });
			document.dispatchEvent(keyupEvent);
		}, 100);
	};

	return (
		<ToggleComponent
			title='preventDefault 사용법'
			description='기본 키보드 동작을 방지하는 예제입니다. 시뮬레이션 버튼을 사용하여 테스트하세요.'
			code={`const { isPressed } = useKeyPress('Enter', {
  keydown: true,
  keyup: true,
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

				<div
					style={{
						padding: '15px',
						backgroundColor: '#d1ecf1',
						borderRadius: '4px',
						border: '1px solid #bee5eb',
					}}
				>
					<p>
						<strong>💡 preventDefault 특징:</strong>
					</p>
					<ul>
						<li>브라우저의 기본 키보드 동작을 방지합니다</li>
						<li>게임이나 커스텀 UI에서 유용합니다</li>
						<li>폼 제출, 페이지 스크롤 등을 방지할 수 있습니다</li>
						<li>Enter 키를 눌러도 폼이 제출되지 않습니다</li>
					</ul>
				</div>
				<button
					onClick={simulateEnter}
					style={{
						padding: '10px 20px',
						backgroundColor: '#28a745',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						fontSize: '14px',
						marginTop: '15px',
						width: '100%',
					}}
				>
					시뮬레이션: Enter 키
				</button>
			</div>
		</ToggleComponent>
	);
};

export const WithKeyMappings = () => {
	const { isPressed: isPressedA, keyCode: keyCodeA } = useKeyPress('a', {
		keydown: true,
		keyup: true,
		preventDefault: true,
	});

	const { isPressed: isPressedKoreanA, keyCode: keyCodeKoreanA } = useKeyPress('a', {
		keydown: true,
		keyup: true,
		preventDefault: true,
		keyMappings: { ㅁ: 'a' }, // 한국어 키보드에서 ㅁ 키를 A로 매핑
	});

	const simulateKeyPress = (key: string) => {
		const keydownEvent = new KeyboardEvent('keydown', { key });
		document.dispatchEvent(keydownEvent);

		setTimeout(() => {
			const keyupEvent = new KeyboardEvent('keyup', { key });
			document.dispatchEvent(keyupEvent);
		}, 100);
	};

	return (
		<ToggleComponent
			title='키 매핑 사용법'
			description='다른 키보드 레이아웃을 위한 커스텀 키 매핑 예제입니다. 시뮬레이션 버튼을 사용하여 테스트하세요.'
			code={`// 기본 A 키 감지
const { isPressed: isPressedA } = useKeyPress('a', {
  keydown: true,
  keyup: true,
  preventDefault: true
});

// 한국어 키보드 지원 (ㅁ 키를 A로 매핑)
const { isPressed: isPressedKoreanA } = useKeyPress('a', {
  keydown: true,
  keyup: true,
  preventDefault: true,
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
						<button
							onClick={() => simulateKeyPress('a')}
							style={{
								padding: '8px 16px',
								backgroundColor: '#007bff',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
								fontSize: '12px',
								width: '100%',
							}}
						>
							시뮬레이션: A 키
						</button>
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
						<button
							onClick={() => simulateKeyPress('ㅁ')}
							style={{
								padding: '8px 16px',
								backgroundColor: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
								fontSize: '12px',
								width: '100%',
							}}
						>
							시뮬레이션: ㅁ 키
						</button>
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
						<strong>💡 키 매핑 특징:</strong>
					</p>
					<ul>
						<li>다른 키보드 레이아웃을 지원합니다</li>
						<li>물리적 키 위치와 논리적 키를 분리합니다</li>
						<li>한국어 키보드에서 ㅁ 키를 A로 인식할 수 있습니다</li>
						<li>대소문자를 구분하지 않습니다</li>
						<li>커스텀 매핑은 입력 키를 대상 키로 변환합니다</li>
					</ul>
				</div>

				<div
					style={{
						padding: '15px',
						backgroundColor: '#fff3cd',
						borderRadius: '4px',
						border: '1px solid #ffeaa7',
						marginBottom: '15px',
					}}
				>
					<p>
						<strong>🔧 사용 팁:</strong>
					</p>
					<ul>
						<li>실제 키보드: A 키나 ㅁ 키를 눌러보세요</li>
						<li>시뮬레이션: 버튼을 클릭하면 해당 키를 시뮬레이션합니다</li>
						<li>한국어 키보드에서는 ㅁ 키가 A 키와 같은 물리적 위치에 있습니다</li>
						<li>keyMappings 옵션으로 ㅁ 키를 A로 매핑하여 동일하게 처리할 수 있습니다</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

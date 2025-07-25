import { useState } from 'react';
import { usePrevious } from '@/lifecycle/usePrevious';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'Lifecycle/usePrevious',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
A React hook that tracks the previous state of a value. It compares the current value with the previous value to detect changes and execute appropriate logic.

### API

#### Parameters
- **value**: T - Current value to track
- **options**: UsePreviousOptions<T> (optional) - Configuration options
  - **initialValue**: T (optional) - Initial value returned on first render
- **Usage Example**: const previousValue = usePrevious(currentValue, { initialValue: defaultValue });

#### Return Value
- **Type**: T | undefined
- **Description**: Previous value from the last render (undefined on first render unless initialValue is provided)
- **Return Value Properties**:
  - **previousValue**: T | undefined - Value from previous render
  - **First render**: Returns undefined (or initialValue if provided)
  - **Subsequent renders**: Returns the value from the previous render
- **Usage Example**: const previousValue = usePrevious(value);

### Usage Examples

\`\`\`tsx
// Basic usage
const [count, setCount] = useState(0);
const previousCount = usePrevious(count);

// Value change detection
useEffect(() => {
  if (previousCount !== undefined && count !== previousCount) {
    console.log('Count changed:', previousCount, '→', count);
  }
}, [count, previousCount]);

// With initial value
const [value, setValue] = useState(10);
const previousValue = usePrevious(value, { initialValue: 0 });

// Conditional rendering based on previous value
const [isVisible, setIsVisible] = useState(false);
const previousIsVisible = usePrevious(isVisible);

useEffect(() => {
  if (isVisible && !previousIsVisible) {
    // Element becomes visible
    animateIn();
  } else if (!isVisible && previousIsVisible) {
    // Element becomes hidden
    animateOut();
  }
}, [isVisible, previousIsVisible]);

// Text input tracking
const [text, setText] = useState('');
const previousText = usePrevious(text);

useEffect(() => {
  if (previousText !== undefined && text !== previousText) {
    console.log('Text changed from:', previousText, 'to:', text);
  }
}, [text, previousText]);
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

// 숫자 예제 컴포넌트
function NumberExample() {
	const [count, setCount] = useState(0);
	const previousCount = usePrevious(count);

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<p>
					<strong>현재 값:</strong> {count}
				</p>
				<p>
					<strong>이전 값:</strong> {previousCount !== undefined ? previousCount : '없음'}
				</p>
				<div style={{ marginTop: '15px' }}>
					<button
						onClick={() => setCount(count + 1)}
						style={{
							padding: '8px 16px',
							backgroundColor: '#28a745',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							marginRight: '10px',
						}}
					>
						증가
					</button>
					<button
						onClick={() => setCount(count - 1)}
						style={{
							padding: '8px 16px',
							backgroundColor: '#dc3545',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						감소
					</button>
					<button
						onClick={() => setCount(0)}
						style={{
							padding: '8px 16px',
							backgroundColor: '#6c757d',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							marginLeft: '10px',
						}}
					>
						초기화
					</button>
				</div>
			</div>

			<div
				style={{
					padding: '10px',
					backgroundColor: '#f8f9fa',
					borderRadius: '4px',
					border: '1px solid #dee2e6',
				}}
			>
				<p>
					<strong>💡 특징:</strong>
				</p>
				<ul>
					<li>숫자 값의 변화를 추적합니다</li>
					<li>이전 값과 현재 값을 비교할 수 있습니다</li>
					<li>초기 렌더링 시 이전 값은 undefined입니다</li>
				</ul>
			</div>
		</div>
	);
}

// 텍스트 예제 컴포넌트
function TextExampleComponent() {
	const [text, setText] = useState('');
	const previousText = usePrevious(text);

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<label>
					<strong>텍스트 입력:</strong>
					<input
						type='text'
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder='텍스트를 입력하세요'
						style={{
							padding: '8px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							width: '250px',
							marginLeft: '10px',
						}}
					/>
				</label>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<p>
					<strong>현재 값:</strong> {text || '(비어있음)'}
				</p>
				<p>
					<strong>이전 값:</strong>{' '}
					{previousText !== undefined ? previousText || '(비어있음)' : '없음'}
				</p>
			</div>

			<div
				style={{
					padding: '10px',
					backgroundColor: '#f8f9fa',
					borderRadius: '4px',
					border: '1px solid #dee2e6',
				}}
			>
				<p>
					<strong>💡 특징:</strong>
				</p>
				<ul>
					<li>텍스트 값의 변화를 추적합니다</li>
					<li>실시간으로 이전 값을 확인할 수 있습니다</li>
					<li>빈 문자열도 이전 값으로 추적됩니다</li>
				</ul>
			</div>
		</div>
	);
}

// 초기값 예제
function InitialValueExample() {
	const [value, setValue] = useState(10);
	const previousValue = usePrevious(value);

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<p>
					<strong>현재 값:</strong> {value}
				</p>
				<p>
					<strong>이전 값:</strong> {previousValue !== undefined ? previousValue : '없음'}
				</p>
				<div style={{ marginTop: '15px' }}>
					<button
						onClick={() => setValue(value + 5)}
						style={{
							padding: '8px 16px',
							backgroundColor: '#28a745',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							marginRight: '10px',
						}}
					>
						+5
					</button>
					<button
						onClick={() => setValue(value - 5)}
						style={{
							padding: '8px 16px',
							backgroundColor: '#dc3545',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						-5
					</button>
					<button
						onClick={() => setValue(10)}
						style={{
							padding: '8px 16px',
							backgroundColor: '#6c757d',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							marginLeft: '10px',
						}}
					>
						초기화
					</button>
				</div>
			</div>

			<div
				style={{
					padding: '10px',
					backgroundColor: '#f8f9fa',
					borderRadius: '4px',
					border: '1px solid #dee2e6',
				}}
			>
				<p>
					<strong>💡 초기값 예제:</strong>
				</p>
				<ul>
					<li>초기값이 10으로 설정되어 있습니다</li>
					<li>첫 번째 렌더링 시 이전 값은 undefined입니다</li>
					<li>값이 변경된 후부터 이전 값을 추적합니다</li>
				</ul>
			</div>
		</div>
	);
}

// 코드 스니펫들
const numberCode = `const [count, setCount] = useState(0);
const previousCount = usePrevious(count);

return (
  <div>
    <p>현재 값: {count}</p>
    <p>이전 값: {previousCount !== undefined ? previousCount : '없음'}</p>
  </div>
);`;

const textCode = `const [text, setText] = useState('');
const previousText = usePrevious(text);

return (
  <div>
    <input
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="텍스트를 입력하세요"
    />
    <p>현재 값: {text}</p>
    <p>이전 값: {previousText}</p>
  </div>
);`;

const initialValueCode = `const [value, setValue] = useState(10);
const previousValue = usePrevious(value);

return (
  <div>
    <p>Current: {value}</p>
    <p>Previous: {previousValue !== undefined ? previousValue : 'None'}</p>
    <button onClick={() => setValue(value + 5)}>+5</button>
    <button onClick={() => setValue(value - 5)}>-5</button>
    <button onClick={() => setValue(10)}>Reset</button>
  </div>
);`;

export const Default = () => (
	<ToggleComponent
		title='숫자 예제'
		description='숫자 값의 이전 상태를 추적합니다.'
		code={numberCode}
	>
		<NumberExample />
	</ToggleComponent>
);

export const TextExample = () => (
	<ToggleComponent
		title='텍스트 예제'
		description='텍스트 값의 변화를 실시간으로 추적합니다.'
		code={textCode}
	>
		<TextExampleComponent />
	</ToggleComponent>
);

export const WithInitialValue = () => (
	<ToggleComponent
		title='초기값 예제'
		description='초기값이 설정된 상태에서 이전 값을 추적합니다.'
		code={initialValueCode}
	>
		<InitialValueExample />
	</ToggleComponent>
);

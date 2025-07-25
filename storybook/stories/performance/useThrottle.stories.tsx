import { useState } from 'react';
import { useThrottleValue } from '@/performance/useThrottle';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'Performance/useThrottle',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
A React hook that limits callback execution to optimize performance. It restricts continuous function calls at regular intervals to prevent excessive processing or rendering.

### API

#### Parameters
- **callback**: T (generic function type)
- **delay**: number - Throttle interval (ms)
- **Usage Example**: const throttledFn = useThrottle(callback, 500);

#### Return Value
- **Type**: T
- **Description**: Throttled callback function
- **Usage Example**: const throttledFn = useThrottle(callback, 500);

### Usage Examples

\`\`\`tsx
// Basic usage
const throttledFn = useThrottle((value) => {
  console.log('throttled value:', value);
}, 500);

throttledFn('hello');

// Usage in scroll events
const throttledScrollHandler = useThrottle((event) => {
  console.log('scroll position:', event.target.scrollTop);
}, 100);

useEffect(() => {
  window.addEventListener('scroll', throttledScrollHandler);
  return () => window.removeEventListener('scroll', throttledScrollHandler);
}, [throttledScrollHandler]);
\`\`\`

### Related Hooks

#### useThrottleValue
A value throttling hook that limits value changes to once during the specified delay.

**Usage Example**:
\`\`\`tsx
// Basic usage
const [inputValue, setInputValue] = useState('');
const throttledValue = useThrottleValue(inputValue, 1000);

// API call at regular intervals
useEffect(() => {
  if (throttledValue) {
    searchAPI(throttledValue);
  }
}, [throttledValue]);
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

function BasicThrottleExample() {
	const [inputValue, setInputValue] = useState('');
	const throttledValue = useThrottleValue(inputValue, 1000);

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<label>
					<strong>실시간 입력:</strong>
					<input
						type='text'
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						placeholder='빠르게 타이핑해보세요'
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
					<strong>스로틀된 값 (1초):</strong> {throttledValue || '(비어있음)'}
				</p>
			</div>

			<div
				style={{
					padding: '10px',
					backgroundColor: throttledValue ? '#d4edda' : '#f8f9fa',
					borderRadius: '4px',
					border: `1px solid ${throttledValue ? '#c3e6cb' : '#dee2e6'}`,
				}}
			>
				<p>
					<strong>상태:</strong> {throttledValue ? '스로틀링 완료' : '대기 중'}
				</p>
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
					<strong>💡 스로틀링의 장점:</strong>
				</p>
				<ul>
					<li>과도한 이벤트 발생 방지</li>
					<li>성능 최적화</li>
					<li>서버 부하 감소</li>
					<li>일정한 간격으로 값 업데이트</li>
				</ul>
			</div>
		</div>
	);
}

function ClickThrottleExample() {
	const [clickCount, setClickCount] = useState(0);
	const throttledClickCount = useThrottleValue(clickCount, 1000);

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<h4>클릭 스로틀 예제</h4>
				<p>
					<strong>실제 클릭 횟수:</strong> {clickCount}
				</p>
				<p>
					<strong>스로틀된 클릭 횟수:</strong> {throttledClickCount}
				</p>
				<button
					onClick={() => setClickCount((prev) => prev + 1)}
					style={{
						padding: '10px 20px',
						backgroundColor: '#007bff',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
					}}
				>
					빠르게 클릭해보세요 (1초마다만 반영)
				</button>
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
					<strong>💡 클릭 스로틀링의 효과:</strong>
				</p>
				<ul>
					<li>실제 클릭은 즉시 반영되지만</li>
					<li>스로틀된 값은 1초마다만 업데이트</li>
					<li>과도한 클릭 이벤트 방지</li>
					<li>성능 최적화</li>
				</ul>
			</div>
		</div>
	);
}

// 코드 스니펫들
const basicCode = `const [inputValue, setInputValue] = useState('');
const throttledValue = useThrottleValue(inputValue, 1000);

return (
  <div>
    <input
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="빠르게 타이핑해보세요"
    />
    <p>스로틀된 값: {throttledValue}</p>
  </div>
);`;

const clickThrottleCode = `const [clickCount, setClickCount] = useState(0);
const throttledClickCount = useThrottleValue(clickCount, 1000);

return (
  <div>
    <p>실제 클릭 횟수: {clickCount}</p>
    <p>스로틀된 클릭 횟수: {throttledClickCount}</p>
    <button onClick={() => setClickCount(prev => prev + 1)}>
      빠르게 클릭해보세요
    </button>
  </div>
);`;

export const Default = () => (
	<ToggleComponent
		title='기본 스로틀 예제'
		description='입력값을 스로틀링하여 성능을 최적화하는 훅입니다.'
		code={basicCode}
	>
		<BasicThrottleExample />
	</ToggleComponent>
);

export const ClickThrottle = () => (
	<ToggleComponent
		title='클릭 스로틀 예제'
		description='클릭 이벤트를 스로틀링하여 성능을 최적화하는 예제입니다.'
		code={clickThrottleCode}
	>
		<ClickThrottleExample />
	</ToggleComponent>
);

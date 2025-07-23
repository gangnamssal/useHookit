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
## usePrevious 훅

이전 값을 추적하는 훅입니다.

### 기본 사용법

\`\`\`tsx
import { usePrevious } from 'useHookit';

function MyComponent() {
  const [count, setCount] = useState(0);
  const previousCount = usePrevious(count);

  return (
    <div>
      <p>현재: {count}</p>
      <p>이전: {previousCount}</p>
    </div>
  );
}
\`\`\`

### 매개변수

- \`value\`: 추적할 값

### 반환값

- 이전 값 (첫 번째 렌더링 시에는 undefined)
				`,
			},
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

// 초기 렌더링 시 previousValue는 undefined
// 첫 번째 값 변경 후부터 이전 값을 추적`;

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

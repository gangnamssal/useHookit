import React from 'react';
import { useBoolean } from '@/utility/useBoolean';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'Utility/useBoolean',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
A React hook that provides declarative boolean state management with toggle, set, and callback functionality. Simplifies boolean state handling for UI components like modals, checkboxes, and toggle buttons.

### API

#### Parameters
- **options**: UseBooleanOptions (optional) - Configuration options for boolean management
- **options.initialValue**: boolean (optional, default: false) - Initial boolean value
- **options.onChange**: (value: boolean) => void (optional) - Callback when value changes
- **Usage Example**: useBoolean({ initialValue: true, onChange: (value) => console.log(value) });

#### Return Value
- **Type**: { value: boolean, toggle: () => void, setTrue: () => void, setFalse: () => void, setValue: (value: boolean) => void }
- **Description**: Returns object with current boolean value and control functions
- **Usage Example**: const { value, toggle, setTrue, setFalse } = useBoolean({ initialValue: false });

#### Return Value Properties

| Property | Type | Description |
|----------|------|-------------|
| value | boolean | Current boolean value |
| toggle | () => void | Function to invert current value |
| setTrue | () => void | Function to set value to true (optimized: only updates if not already true) |
| setFalse | () => void | Function to set value to false (optimized: only updates if not already false) |
| setValue | (value: boolean) => void | Function to set value directly (forces boolean type conversion) |

### Usage Examples

\`\`\`tsx
// Basic boolean state management
const { value: isVisible, toggle, setTrue, setFalse } = useBoolean({ initialValue: false });

return (
  <div>
    <p>Status: {isVisible ? 'Visible' : 'Hidden'}</p>
    <button onClick={toggle}>Toggle</button>
    <button onClick={setTrue}>Show</button>
    <button onClick={setFalse}>Hide</button>
    
    {isVisible && <div>Visible content</div>}
  </div>
);

// With initial true value
const { value: isActive, toggle, setTrue, setFalse } = useBoolean({ initialValue: true });

return (
  <div>
    <p>Active: {isActive ? 'Yes' : 'No'}</p>
    <button onClick={toggle}>Toggle</button>
    <button onClick={setTrue}>Activate</button>
    <button onClick={setFalse}>Deactivate</button>
  </div>
);

// With onChange callback
const { value: isVisible, toggle, setTrue, setFalse } = useBoolean({
  initialValue: false,
  onChange: (value) => {
    console.log('State changed:', value);
    // Additional logic like analytics, side effects, etc.
  }
});

return (
  <div>
    <p>Status: {isVisible ? 'Visible' : 'Hidden'}</p>
    <button onClick={toggle}>Toggle</button>
    <button onClick={setTrue}>Show</button>
    <button onClick={setFalse}>Hide</button>
  </div>
);

// onChange callback with error handling (built-in)
const { value: isVisible, toggle } = useBoolean({
  initialValue: false,
  onChange: (value) => {
    // Even if this throws an error, the hook continues to work
    throw new Error('Simulated error in onChange');
  }
});

// Using setValue for custom logic
const { value: isVisible, setValue } = useBoolean({ initialValue: false });

const handleCustomToggle = () => {
  setValue(!isVisible);
};

const handleConditionalSet = (condition: boolean) => {
  setValue(condition);
};

// setValue forces boolean type conversion
const handleNonBooleanInput = () => {
  setValue(1); // Will be converted to true
  setValue(0); // Will be converted to false
  setValue(''); // Will be converted to false
  setValue('hello'); // Will be converted to true
};

return (
  <div>
    <p>Status: {isVisible ? 'Visible' : 'Hidden'}</p>
    <button onClick={handleCustomToggle}>Custom Toggle</button>
    <button onClick={() => setValue(true)}>Set True</button>
    <button onClick={() => setValue(false)}>Set False</button>
    <button onClick={() => handleConditionalSet(Math.random() > 0.5)}>Random</button>
    <button onClick={handleNonBooleanInput}>Test Type Conversion</button>
  </div>
);

// Modal example
const { value: isModalOpen, toggle, setTrue, setFalse } = useBoolean({ initialValue: false });

return (
  <div>
    <button onClick={setTrue}>Open Modal</button>
    
    {isModalOpen && (
      <div className="modal">
        <h2>Modal Content</h2>
        <p>This is a modal dialog.</p>
        <button onClick={setFalse}>Close</button>
      </div>
    )}
  </div>
);

// Loading state example
const { value: isLoading, setTrue: startLoading, setFalse: stopLoading } = useBoolean({ initialValue: false });

const handleAsyncOperation = async () => {
  startLoading();
  try {
    await someAsyncOperation();
  } finally {
    stopLoading();
  }
};

return (
  <div>
    <button onClick={handleAsyncOperation} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Start Operation'}
    </button>
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

// 코드 스니펫들
const basicCode = `import { useBoolean } from '@/utility/useBoolean';

function MyComponent() {
	const { value: isVisible, toggle, setTrue, setFalse } = useBoolean({ 
		initialValue: false 
	});

	return (
		<div>
			<p>상태: {isVisible ? '보임' : '숨김'}</p>
			<button onClick={toggle}>토글</button>
			<button onClick={setTrue}>보이기</button>
			<button onClick={setFalse}>숨기기</button>
			
			{isVisible && <div>보이는 내용</div>}
		</div>
	);
}`;

const initialTrueCode = `import { useBoolean } from '@/utility/useBoolean';

function MyComponent() {
	const { value: isActive, toggle, setTrue, setFalse } = useBoolean({ 
		initialValue: true 
	});

	return (
		<div>
			<p>활성 상태: {isActive ? '활성' : '비활성'}</p>
			<button onClick={toggle}>토글</button>
			<button onClick={setTrue}>활성화</button>
			<button onClick={setFalse}>비활성화</button>
			
			{isActive && <div>활성 상태입니다!</div>}
		</div>
	);
}`;

const onChangeCode = `import { useBoolean } from '@/utility/useBoolean';

function MyComponent() {
	const { value: isVisible, toggle, setTrue, setFalse } = useBoolean({
		initialValue: false,
		onChange: (value) => {
			console.log('상태가 변경됨:', value);
			// 추가 로직 수행
		}
	});

	return (
		<div>
			<p>상태: {isVisible ? '보임' : '숨김'}</p>
			<button onClick={toggle}>토글</button>
			<button onClick={setTrue}>보이기</button>
			<button onClick={setFalse}>숨기기</button>
		</div>
	);
}`;

const setValueCode = `import { useBoolean } from '@/utility/useBoolean';

function MyComponent() {
	const { value: isVisible, setValue } = useBoolean({ initialValue: false });

	const handleCustomToggle = () => {
		setValue(!isVisible);
	};

	return (
		<div>
			<p>상태: {isVisible ? '보임' : '숨김'}</p>
			<button onClick={handleCustomToggle}>커스텀 토글</button>
			<button onClick={() => setValue(true)}>true로 설정</button>
			<button onClick={() => setValue(false)}>false로 설정</button>
		</div>
	);
}`;

function UseBooleanDemo() {
	const { value: isVisible, toggle, setTrue, setFalse } = useBoolean({ initialValue: false });

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>useBoolean 훅 데모</h3>
			<p>불린 상태를 쉽게 관리하는 훅입니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<h4>토글 예제</h4>
				<p>
					<strong>상태:</strong> {isVisible ? '✅ 보임' : '❌ 숨김'}
				</p>
				<button
					onClick={toggle}
					style={{
						padding: '10px 20px',
						backgroundColor: '#007bff',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						marginRight: '10px',
					}}
				>
					토글
				</button>
				<button
					onClick={setTrue}
					style={{
						padding: '10px 20px',
						backgroundColor: '#28a745',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						marginRight: '10px',
					}}
				>
					보이기
				</button>
				<button
					onClick={setFalse}
					style={{
						padding: '10px 20px',
						backgroundColor: '#dc3545',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
					}}
				>
					숨기기
				</button>
			</div>

			{isVisible && (
				<div
					style={{
						marginBottom: '20px',
						padding: '15px',
						backgroundColor: '#d4edda',
						borderRadius: '4px',
						border: '1px solid #c3e6cb',
					}}
				>
					<p>이 내용은 토글 버튼으로 보이거나 숨겨집니다!</p>
				</div>
			)}
		</div>
	);
}

export const Default = () => (
	<ToggleComponent
		code={basicCode}
		title='기본 사용법'
		description='useBoolean 훅의 기본적인 사용법을 보여줍니다. 토글, setTrue, setFalse 기능을 포함합니다.'
	>
		<UseBooleanDemo />
	</ToggleComponent>
);

Default.parameters = {
	docs: {
		description: {
			story:
				'가장 기본적인 useBoolean 훅 사용법입니다. 초기값은 false로 설정되며, 토글, setTrue, setFalse 함수를 사용할 수 있습니다.',
		},
		disable: true,
	},
};

export const WithInitialTrue = () => {
	const { value: isActive, toggle, setTrue, setFalse } = useBoolean({ initialValue: true });

	return (
		<ToggleComponent
			code={initialTrueCode}
			title='초기값이 true인 경우'
			description='initialValue를 true로 설정하여 초기 상태가 활성화된 상태로 시작하는 예제입니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>초기값이 true인 useBoolean</h3>
				<p>
					<strong>활성 상태:</strong> {isActive ? '✅ 활성' : '❌ 비활성'}
				</p>

				<div style={{ marginBottom: '20px' }}>
					<button
						onClick={toggle}
						style={{
							padding: '10px 20px',
							backgroundColor: '#007bff',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							marginRight: '10px',
						}}
					>
						토글
					</button>
					<button
						onClick={setTrue}
						style={{
							padding: '10px 20px',
							backgroundColor: '#28a745',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							marginRight: '10px',
						}}
					>
						활성화
					</button>
					<button
						onClick={setFalse}
						style={{
							padding: '10px 20px',
							backgroundColor: '#dc3545',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						비활성화
					</button>
				</div>

				<div
					style={{
						padding: '15px',
						backgroundColor: isActive ? '#d4edda' : '#f8d7da',
						borderRadius: '4px',
						border: `1px solid ${isActive ? '#c3e6cb' : '#f5c6cb'}`,
					}}
				>
					<p>{isActive ? '✅ 활성 상태입니다!' : '❌ 비활성 상태입니다!'}</p>
				</div>
			</div>
		</ToggleComponent>
	);
};

WithInitialTrue.parameters = {
	docs: {
		description: {
			story:
				'initialValue를 true로 설정하면 훅이 활성 상태로 시작합니다. 이는 기본적으로 활성화되어야 하는 UI 요소에 유용합니다.',
		},
		disable: true,
	},
};

export const WithOnChange = () => {
	const [log, setLog] = React.useState<string[]>([]);

	const {
		value: isVisible,
		toggle,
		setTrue,
		setFalse,
	} = useBoolean({
		initialValue: false,
		onChange: (value) => {
			setLog((prev) => [
				...prev,
				`상태가 ${value ? 'true' : 'false'}로 변경됨 - ${new Date().toLocaleTimeString()}`,
			]);
		},
	});

	return (
		<ToggleComponent
			code={onChangeCode}
			title='onChange 콜백 사용'
			description='값이 변경될 때마다 콜백이 실행되는 예제입니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>onChange 콜백 예제</h3>
				<p>값이 변경될 때마다 콜백이 실행됩니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<p>
						<strong>상태:</strong> {isVisible ? '✅ 보임' : '❌ 숨김'}
					</p>
					<button
						onClick={toggle}
						style={{
							padding: '10px 20px',
							backgroundColor: '#007bff',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							marginRight: '10px',
						}}
					>
						토글
					</button>
					<button
						onClick={setTrue}
						style={{
							padding: '10px 20px',
							backgroundColor: '#28a745',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							marginRight: '10px',
						}}
					>
						보이기
					</button>
					<button
						onClick={setFalse}
						style={{
							padding: '10px 20px',
							backgroundColor: '#dc3545',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						숨기기
					</button>
				</div>

				<div style={{ marginTop: '20px' }}>
					<h4>변경 로그:</h4>
					<div
						style={{
							maxHeight: '150px',
							overflowY: 'auto',
							backgroundColor: '#f8f9fa',
							padding: '10px',
							borderRadius: '4px',
							fontSize: '12px',
						}}
					>
						{log.map((entry, index) => (
							<div key={index} style={{ marginBottom: '5px' }}>
								{entry}
							</div>
						))}
						{log.length === 0 && <div style={{ color: '#6c757d' }}>아직 변경사항이 없습니다.</div>}
					</div>
				</div>
			</div>
		</ToggleComponent>
	);
};

WithOnChange.parameters = {
	docs: {
		description: {
			story: 'onChange 콜백을 사용하여 값이 변경될 때마다 추가 로직을 실행할 수 있습니다.',
		},
		disable: true,
	},
};

export const WithSetValue = () => {
	const { value: isVisible, setValue } = useBoolean({ initialValue: false });

	const handleCustomToggle = () => {
		setValue(!isVisible);
	};

	return (
		<ToggleComponent
			code={setValueCode}
			title='setValue 사용'
			description='setValue를 사용하여 직접 불린 값을 설정하는 예제입니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>setValue 사용 예제</h3>
				<p>setValue를 사용하여 직접 불린 값을 설정할 수 있습니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<p>
						<strong>상태:</strong> {isVisible ? '✅ 보임' : '❌ 숨김'}
					</p>
					<button
						onClick={handleCustomToggle}
						style={{
							padding: '10px 20px',
							backgroundColor: '#007bff',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							marginRight: '10px',
						}}
					>
						커스텀 토글
					</button>
					<button
						onClick={() => setValue(true)}
						style={{
							padding: '10px 20px',
							backgroundColor: '#28a745',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							marginRight: '10px',
						}}
					>
						true로 설정
					</button>
					<button
						onClick={() => setValue(false)}
						style={{
							padding: '10px 20px',
							backgroundColor: '#dc3545',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						false로 설정
					</button>
				</div>

				{isVisible && (
					<div
						style={{
							padding: '15px',
							backgroundColor: '#d4edda',
							borderRadius: '4px',
							border: '1px solid #c3e6cb',
						}}
					>
						<p>setValue를 사용하여 직접 값을 설정했습니다!</p>
					</div>
				)}
			</div>
		</ToggleComponent>
	);
};

WithSetValue.parameters = {
	docs: {
		description: {
			story: 'setValue를 사용하여 직접 불린 값을 설정할 수 있습니다.',
		},
		disable: true,
	},
};

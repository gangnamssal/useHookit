import { useState } from 'react';
import { useCounter } from '@/utility/useCounter';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'Utility/useCounter',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
A React hook that provides a comprehensive counter with bounds, step control, and callback support. Simplifies counter state management in React components with automatic value clamping and real-time updates.

### Features

- **Automatic Value Clamping**: Initial values and set values are automatically clamped within min/max bounds
- **Error Handling**: Invalid values (NaN, Infinity) are safely ignored
- **Callback Safety**: Callback errors don't break the hook functionality
- **Performance Optimized**: Uses memoization and refs to prevent unnecessary re-renders
- **Boundary Detection**: Real-time min/max boundary state tracking

### API

#### Parameters
- **options**: UseCounterOptions (optional) - Configuration options for counter
- **options.initialValue**: number (optional, default: 0) - Initial counter value (automatically clamped if outside bounds)
- **options.min**: number (optional) - Minimum value limit
- **options.max**: number (optional) - Maximum value limit
- **options.step**: number (optional, default: 1) - Step value for increment/decrement
- **options.onChange**: (value: number) => void (optional) - Callback function called when value changes
- **options.onMin**: (value: number) => void (optional) - Callback function called when minimum is reached
- **options.onMax**: (value: number) => void (optional) - Callback function called when maximum is reached
- **Usage Example**: useCounter({ initialValue: 5, min: 0, max: 10, step: 2 });

#### Return Value
- **Type**: { value: number; increment: () => void; decrement: () => void; reset: () => void; setValue: (value: number) => void; isMin: boolean; isMax: boolean; }
- **Description**: Returns current counter value and utility functions
- **Usage Example**: const { value, increment, decrement } = useCounter();

#### Return Value Properties
- **value**: number - Current counter value (always within bounds if min/max are set)
- **increment**: () => void - Increment counter by step value (disabled when at max)
- **decrement**: () => void - Decrement counter by step value (disabled when at min)
- **reset**: () => void - Reset counter to initial value (clamped if outside bounds)
- **setValue**: (value: number) => void - Set counter to specific value (invalid values ignored)
- **isMin**: boolean - Whether counter is at minimum value
- **isMax**: boolean - Whether counter is at maximum value

### Usage Examples

\`\`\`tsx
// Basic counter
const { value, increment, decrement } = useCounter();

return (
  <div>
    <p>Count: {value}</p>
    <button onClick={increment}>+</button>
    <button onClick={decrement}>-</button>
  </div>
);

// Counter with bounds (automatic clamping)
const { value, increment, decrement, isMin, isMax } = useCounter({
  initialValue: 15, // Will be clamped to 10
  min: 0,
  max: 10
});

return (
  <div>
    <p>Count: {value}</p>
    <button onClick={increment} disabled={isMax}>+</button>
    <button onClick={decrement} disabled={isMin}>-</button>
  </div>
);

// Counter with custom step
const { value, increment, decrement } = useCounter({
  initialValue: 0,
  step: 5
});

return (
  <div>
    <p>Count: {value}</p>
    <button onClick={increment}>+5</button>
    <button onClick={decrement}>-5</button>
  </div>
);

// Counter with callbacks (error-safe)
const { value, increment, decrement } = useCounter({
  initialValue: 5,
  min: 0,
  max: 10,
  onChange: (value) => console.log('Value changed:', value),
  onMin: (value) => console.log('Reached minimum:', value),
  onMax: (value) => console.log('Reached maximum:', value)
});

return (
  <div>
    <p>Count: {value}</p>
    <button onClick={increment}>+</button>
    <button onClick={decrement}>-</button>
  </div>
);

// Counter with direct value setting (invalid value handling)
const { value, setValue, reset } = useCounter({
  initialValue: 0
});

return (
  <div>
    <p>Count: {value}</p>
    <input 
      type="number" 
      onChange={(e) => setValue(Number(e.target.value))}
    />
    <button onClick={reset}>Reset</button>
  </div>
);

// Negative step counter
const { value, increment, decrement } = useCounter({
  initialValue: 10,
  step: -2
});

return (
  <div>
    <p>Count: {value}</p>
    <button onClick={increment}>-2</button>
    <button onClick={decrement}>+2</button>
  </div>
);

// Decimal step counter
const { value, increment, decrement } = useCounter({
  initialValue: 0,
  step: 0.5
});

return (
  <div>
    <p>Count: {value}</p>
    <button onClick={increment}>+0.5</button>
    <button onClick={decrement}>-0.5</button>
  </div>
);
\`\`\`

### Implementation Details

- **Value Clamping**: All values are automatically clamped to min/max bounds
- **Error Resilience**: Invalid inputs (NaN, Infinity) are safely ignored
- **Callback Safety**: Callback errors are caught and logged without breaking functionality
- **Performance**: Uses useCallback, useMemo, and useRef for optimal performance
- **Initial Callbacks**: Callbacks are triggered on mount if initial value is clamped
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
const basicCode = `const { value, increment, decrement } = useCounter();

return (
  <div>
    <p>Count: {value}</p>
    <button onClick={increment}>+</button>
    <button onClick={decrement}>-</button>
  </div>
);`;

const boundsCode = `const { value, increment, decrement, isMin, isMax } = useCounter({
  initialValue: 15, // Will be clamped to 10
  min: 0,
  max: 10
});

return (
  <div>
    <p>Count: {value}</p>
    <button onClick={increment} disabled={isMax}>+</button>
    <button onClick={decrement} disabled={isMin}>-</button>
  </div>
);`;

const customStepCode = `const { value, increment, decrement } = useCounter({
  initialValue: 0,
  step: 5
});

return (
  <div>
    <p>Count: {value}</p>
    <button onClick={increment}>+5</button>
    <button onClick={decrement}>-5</button>
  </div>
);`;

const callbacksCode = `const { value, increment, decrement } = useCounter({
  initialValue: 5,
  min: 0,
  max: 10,
  onChange: (value) => console.log('Value changed:', value),
  onMin: (value) => console.log('Reached minimum:', value),
  onMax: (value) => console.log('Reached maximum:', value)
});

return (
  <div>
    <p>Count: {value}</p>
    <button onClick={increment}>+</button>
    <button onClick={decrement}>-</button>
  </div>
);`;

const setValueCode = `const { value, setValue, reset } = useCounter({
  initialValue: 0
});

return (
  <div>
    <p>Count: {value}</p>
    <input 
      type="number" 
      onChange={(e) => setValue(Number(e.target.value))}
      placeholder="Enter a number"
    />
    <button onClick={reset}>Reset</button>
    {/* Invalid values (NaN, Infinity) are ignored */}
  </div>
);`;

const negativeStepCode = `const { value, increment, decrement } = useCounter({
  initialValue: 10,
  step: -2
});

return (
  <div>
    <p>Count: {value}</p>
    <button onClick={increment}>-2</button>
    <button onClick={decrement}>+2</button>
  </div>
);`;

const decimalStepCode = `const { value, increment, decrement } = useCounter({
  initialValue: 0,
  step: 0.5
});

return (
  <div>
    <p>Count: {value}</p>
    <button onClick={increment}>+0.5</button>
    <button onClick={decrement}>-0.5</button>
  </div>
);`;

export const Default = () => {
	const { value, increment, decrement } = useCounter();

	return (
		<ToggleComponent
			code={basicCode}
			title='기본 사용법'
			description='useCounter 훅의 기본적인 사용법을 보여줍니다.'
		>
			<div
				style={{
					padding: '20px',
					border: '1px solid #ccc',
					borderRadius: '8px',
					minWidth: '300px',
				}}
			>
				<h3>기본 사용법</h3>
				<p>간단한 카운터를 구현합니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
							textAlign: 'center',
						}}
					>
						<h2 style={{ margin: '0 0 10px 0', fontSize: '2rem', color: '#007bff' }}>{value}</h2>
						<p style={{ margin: '0', color: '#6c757d' }}>현재 값</p>
					</div>
				</div>

				<div
					style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}
				>
					<button
						onClick={decrement}
						style={{
							padding: '12px 24px',
							fontSize: '1.2rem',
							backgroundColor: '#dc3545',
							color: 'white',
							border: 'none',
							borderRadius: '6px',
							cursor: 'pointer',
							minWidth: '60px',
						}}
					>
						-
					</button>
					<button
						onClick={increment}
						style={{
							padding: '12px 24px',
							fontSize: '1.2rem',
							backgroundColor: '#28a745',
							color: 'white',
							border: 'none',
							borderRadius: '6px',
							cursor: 'pointer',
							minWidth: '60px',
						}}
					>
						+
					</button>
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
						<strong>📝 기능:</strong>
					</p>
					<ul>
						<li>
							<code>increment()</code>: 값을 1씩 증가 (기본 스텝)
						</li>
						<li>
							<code>decrement()</code>: 값을 1씩 감소 (기본 스텝)
						</li>
						<li>기본값은 0부터 시작합니다</li>
						<li>무제한으로 증가/감소 가능합니다</li>
						<li>값이 변경될 때만 상태가 업데이트됩니다</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithBounds = () => {
	const { value, increment, decrement, isMin, isMax } = useCounter({
		initialValue: 5,
		min: 0,
		max: 10,
	});

	return (
		<ToggleComponent
			code={boundsCode}
			title='범위 제한'
			description='최소값과 최대값을 설정하여 카운터의 범위를 제한하는 예제입니다.'
		>
			<div
				style={{
					padding: '20px',
					border: '1px solid #ccc',
					borderRadius: '8px',
					minWidth: '300px',
				}}
			>
				<h3>범위 제한 예제</h3>
				<p>0에서 10 사이의 값으로 제한된 카운터입니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
							textAlign: 'center',
						}}
					>
						<h2 style={{ margin: '0 0 10px 0', fontSize: '2rem', color: '#007bff' }}>{value}</h2>
						<p style={{ margin: '0', color: '#6c757d' }}>현재 값 (0-10)</p>

						<div style={{ marginTop: '10px' }}>
							{isMin && <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>• 최소값 도달</span>}
							{isMax && <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>• 최대값 도달</span>}
							{!isMin && !isMax && <span style={{ color: '#27ae60' }}>• 범위 내</span>}
						</div>
					</div>
				</div>

				<div
					style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}
				>
					<button
						onClick={decrement}
						disabled={isMin}
						style={{
							padding: '12px 24px',
							fontSize: '1.2rem',
							backgroundColor: isMin ? '#f8f9fa' : '#dc3545',
							color: isMin ? '#6c757d' : 'white',
							border: 'none',
							borderRadius: '6px',
							cursor: isMin ? 'not-allowed' : 'pointer',
							minWidth: '60px',
						}}
					>
						-
					</button>
					<button
						onClick={increment}
						disabled={isMax}
						style={{
							padding: '12px 24px',
							fontSize: '1.2rem',
							backgroundColor: isMax ? '#f8f9fa' : '#28a745',
							color: isMax ? '#6c757d' : 'white',
							border: 'none',
							borderRadius: '6px',
							cursor: isMax ? 'not-allowed' : 'pointer',
							minWidth: '60px',
						}}
					>
						+
					</button>
				</div>

				<div
					style={{
						padding: '15px',
						backgroundColor: '#fff3cd',
						borderRadius: '4px',
						border: '1px solid #ffeaa7',
					}}
				>
					<p>
						<strong>💡 특징:</strong>
					</p>
					<ul>
						<li>
							최소값(0)에 도달하면 감소 버튼이 비활성화되고 <code>decrement()</code>가 실행되지
							않습니다
						</li>
						<li>
							최대값(10)에 도달하면 증가 버튼이 비활성화되고 <code>increment()</code>가 실행되지
							않습니다
						</li>
						<li>
							<code>isMin</code>, <code>isMax</code>로 상태를 확인할 수 있습니다
						</li>
						<li>초기값(15)이 범위를 벗어나면 자동으로 클램핑(10)됩니다</li>
						<li>클램핑 시 적절한 콜백이 호출됩니다</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithCustomStep = () => {
	const { value, increment, decrement } = useCounter({
		initialValue: 0,
		step: 5,
	});

	return (
		<ToggleComponent
			code={customStepCode}
			title='커스텀 스텝'
			description='증가/감소 시 사용할 스텝 값을 설정하는 예제입니다.'
		>
			<div
				style={{
					padding: '20px',
					border: '1px solid #ccc',
					borderRadius: '8px',
					minWidth: '300px',
				}}
			>
				<h3>커스텀 스텝 예제</h3>
				<p>5씩 증가/감소하는 카운터입니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
							textAlign: 'center',
						}}
					>
						<h2 style={{ margin: '0 0 10px 0', fontSize: '2rem', color: '#007bff' }}>{value}</h2>
						<p style={{ margin: '0', color: '#6c757d' }}>현재 값 (스텝: 5)</p>
					</div>
				</div>

				<div
					style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}
				>
					<button
						onClick={decrement}
						style={{
							padding: '12px 24px',
							fontSize: '1.2rem',
							backgroundColor: '#dc3545',
							color: 'white',
							border: 'none',
							borderRadius: '6px',
							cursor: 'pointer',
							minWidth: '80px',
						}}
					>
						-5
					</button>
					<button
						onClick={increment}
						style={{
							padding: '12px 24px',
							fontSize: '1.2rem',
							backgroundColor: '#28a745',
							color: 'white',
							border: 'none',
							borderRadius: '6px',
							cursor: 'pointer',
							minWidth: '80px',
						}}
					>
						+5
					</button>
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
						<strong>📝 특징:</strong>
					</p>
					<ul>
						<li>기본 스텝은 1이지만 커스텀할 수 있습니다</li>
						<li>음수 스텝도 사용 가능합니다</li>
						<li>소수점 스텝도 지원합니다</li>
						<li>스텝이 0이면 값이 변경되지 않습니다</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithCallbacks = () => {
	const [log, setLog] = useState<string[]>([]);

	const { value, increment, decrement, isMin, isMax } = useCounter({
		initialValue: 5,
		min: 0,
		max: 10,
		onChange: (newValue: number) => {
			setLog((prev) => [...prev, `값 변경: ${newValue}`]);
		},
		onMin: (newValue: number) => {
			setLog((prev) => [...prev, `최소값 도달: ${newValue}`]);
		},
		onMax: (newValue: number) => {
			setLog((prev) => [...prev, `최대값 도달: ${newValue}`]);
		},
	});

	return (
		<ToggleComponent
			code={callbacksCode}
			title='콜백 함수'
			description='값 변경 시 콜백 함수를 실행하는 예제입니다.'
		>
			<div
				style={{
					padding: '20px',
					border: '1px solid #ccc',
					borderRadius: '8px',
					minWidth: '400px',
				}}
			>
				<h3>콜백 함수 예제</h3>
				<p>값 변경 시 콜백 함수가 실행됩니다.</p>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: '1fr 1fr',
						gap: '20px',
						marginBottom: '20px',
					}}
				>
					<div>
						<div
							style={{
								padding: '15px',
								backgroundColor: '#f8f9fa',
								borderRadius: '4px',
								border: '1px solid #dee2e6',
								textAlign: 'center',
							}}
						>
							<h2 style={{ margin: '0 0 10px 0', fontSize: '2rem', color: '#007bff' }}>{value}</h2>
							<p style={{ margin: '0', color: '#6c757d' }}>현재 값 (0-10)</p>

							<div style={{ marginTop: '10px' }}>
								{isMin && <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>• 최소값</span>}
								{isMax && <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>• 최대값</span>}
								{!isMin && !isMax && <span style={{ color: '#27ae60' }}>• 범위 내</span>}
							</div>
						</div>

						<div
							style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}
						>
							<button
								onClick={decrement}
								disabled={isMin}
								style={{
									padding: '10px 20px',
									fontSize: '1rem',
									backgroundColor: isMin ? '#f8f9fa' : '#dc3545',
									color: isMin ? '#6c757d' : 'white',
									border: 'none',
									borderRadius: '4px',
									cursor: isMin ? 'not-allowed' : 'pointer',
								}}
							>
								-
							</button>
							<button
								onClick={increment}
								disabled={isMax}
								style={{
									padding: '10px 20px',
									fontSize: '1rem',
									backgroundColor: isMax ? '#f8f9fa' : '#28a745',
									color: isMax ? '#6c757d' : 'white',
									border: 'none',
									borderRadius: '4px',
									cursor: isMax ? 'not-allowed' : 'pointer',
								}}
							>
								+
							</button>
						</div>
					</div>

					<div>
						<h4 style={{ margin: '0 0 10px 0' }}>콜백 로그</h4>
						<div
							style={{
								height: '200px',
								overflow: 'auto',
								padding: '10px',
								backgroundColor: '#f8f9fa',
								borderRadius: '4px',
								border: '1px solid #dee2e6',
								fontSize: '12px',
							}}
						>
							{log.length === 0 ? (
								<p style={{ color: '#6c757d', fontStyle: 'italic' }}>
									버튼을 클릭하면 콜백 로그가 표시됩니다.
								</p>
							) : (
								log.map((entry, index) => (
									<div
										key={index}
										style={{
											padding: '4px 8px',
											margin: '2px 0',
											backgroundColor: '#ffffff',
											borderRadius: '2px',
											border: '1px solid #dee2e6',
										}}
									>
										{entry}
									</div>
								))
							)}
						</div>
						<button
							onClick={() => setLog([])}
							style={{
								padding: '5px 10px',
								fontSize: '12px',
								backgroundColor: '#6c757d',
								color: 'white',
								border: 'none',
								borderRadius: '2px',
								cursor: 'pointer',
								marginTop: '5px',
							}}
						>
							로그 지우기
						</button>
					</div>
				</div>

				<div
					style={{
						padding: '15px',
						backgroundColor: '#fff3cd',
						borderRadius: '4px',
						border: '1px solid #ffeaa7',
					}}
				>
					<p>
						<strong>💡 콜백 종류:</strong>
					</p>
					<ul>
						<li>
							<code>onChange</code>: 값이 변경될 때마다 호출
						</li>
						<li>
							<code>onMin</code>: 최소값에 도달할 때 호출
						</li>
						<li>
							<code>onMax</code>: 최대값에 도달할 때 호출
						</li>
						<li>콜백에서 오류가 발생해도 카운터는 정상 작동합니다</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithSetValue = () => {
	const { value, setValue, reset } = useCounter({
		initialValue: 0,
	});

	const [inputValue, setInputValue] = useState(value.toString());

	const handleSetValue = () => {
		const numValue = Number(inputValue);
		if (!isNaN(numValue)) {
			setValue(numValue);
		}
	};

	return (
		<ToggleComponent
			code={setValueCode}
			title='직접 값 설정'
			description='setValue 함수를 사용하여 카운터 값을 직접 설정하는 예제입니다.'
		>
			<div
				style={{
					padding: '20px',
					border: '1px solid #ccc',
					borderRadius: '8px',
					minWidth: '300px',
				}}
			>
				<h3>직접 값 설정 예제</h3>
				<p>입력 필드를 통해 카운터 값을 직접 설정할 수 있습니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
							textAlign: 'center',
						}}
					>
						<h2 style={{ margin: '0 0 10px 0', fontSize: '2rem', color: '#007bff' }}>{value}</h2>
						<p style={{ margin: '0', color: '#6c757d' }}>현재 값</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							display: 'flex',
							gap: '10px',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<input
							type='number'
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							style={{
								padding: '8px 12px',
								border: '1px solid #ced4da',
								borderRadius: '4px',
								width: '100px',
								fontSize: '14px',
							}}
						/>
						<button
							onClick={handleSetValue}
							style={{
								padding: '8px 16px',
								backgroundColor: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							설정
						</button>
						<button
							onClick={reset}
							style={{
								padding: '8px 16px',
								backgroundColor: '#6c757d',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							리셋
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
						<strong>📝 기능:</strong>
					</p>
					<ul>
						<li>
							<code>setValue(value)</code>: 특정 값으로 직접 설정
						</li>
						<li>
							<code>reset()</code>: 클램핑된 초기값으로 리셋
						</li>
						<li>유효하지 않은 값(NaN, Infinity)은 안전하게 무시됩니다</li>
						<li>범위가 설정된 경우 자동으로 클램핑됩니다</li>
						<li>값이 실제로 변경될 때만 상태가 업데이트됩니다</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithNegativeStep = () => {
	const { value, increment, decrement } = useCounter({
		initialValue: 10,
		step: -2,
	});

	return (
		<ToggleComponent
			code={negativeStepCode}
			title='음수 스텝'
			description='음수 스텝을 사용하여 카운터가 반대로 동작하는 예제입니다.'
		>
			<div
				style={{
					padding: '20px',
					border: '1px solid #ccc',
					borderRadius: '8px',
					minWidth: '300px',
				}}
			>
				<h3>음수 스텝 예제</h3>
				<p>스텝이 -2인 카운터입니다. 증가 버튼을 누르면 값이 감소합니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
							textAlign: 'center',
						}}
					>
						<h2 style={{ margin: '0 0 10px 0', fontSize: '2rem', color: '#007bff' }}>{value}</h2>
						<p style={{ margin: '0', color: '#6c757d' }}>현재 값 (스텝: -2)</p>
					</div>
				</div>

				<div
					style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}
				>
					<button
						onClick={decrement}
						style={{
							padding: '12px 24px',
							fontSize: '1.2rem',
							backgroundColor: '#dc3545',
							color: 'white',
							border: 'none',
							borderRadius: '6px',
							cursor: 'pointer',
							minWidth: '80px',
						}}
					>
						+2
					</button>
					<button
						onClick={increment}
						style={{
							padding: '12px 24px',
							fontSize: '1.2rem',
							backgroundColor: '#28a745',
							color: 'white',
							border: 'none',
							borderRadius: '6px',
							cursor: 'pointer',
							minWidth: '80px',
						}}
					>
						-2
					</button>
				</div>

				<div
					style={{
						padding: '15px',
						backgroundColor: '#fff3cd',
						borderRadius: '4px',
						border: '1px solid #ffeaa7',
					}}
				>
					<p>
						<strong>💡 특징:</strong>
					</p>
					<ul>
						<li>음수 스텝에서는 증가 버튼이 값을 감소시킵니다</li>
						<li>감소 버튼이 값을 증가시킵니다</li>
						<li>범위가 설정된 경우 음수 스텝도 정상적으로 작동합니다</li>
						<li>스텝이 0이면 값이 변경되지 않습니다</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithDecimalStep = () => {
	const { value, increment, decrement } = useCounter({
		initialValue: 0,
		step: 0.5,
	});

	return (
		<ToggleComponent
			code={decimalStepCode}
			title='소수점 스텝'
			description='소수점 스텝을 사용하여 카운터를 세밀하게 제어하는 예제입니다.'
		>
			<div
				style={{
					padding: '20px',
					border: '1px solid #ccc',
					borderRadius: '8px',
					minWidth: '300px',
				}}
			>
				<h3>소수점 스텝 예제</h3>
				<p>0.5씩 증가/감소하는 카운터입니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
							textAlign: 'center',
						}}
					>
						<h2 style={{ margin: '0 0 10px 0', fontSize: '2rem', color: '#007bff' }}>{value}</h2>
						<p style={{ margin: '0', color: '#6c757d' }}>현재 값 (스텝: 0.5)</p>
					</div>
				</div>

				<div
					style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}
				>
					<button
						onClick={decrement}
						style={{
							padding: '12px 24px',
							fontSize: '1.2rem',
							backgroundColor: '#dc3545',
							color: 'white',
							border: 'none',
							borderRadius: '6px',
							cursor: 'pointer',
							minWidth: '80px',
						}}
					>
						-0.5
					</button>
					<button
						onClick={increment}
						style={{
							padding: '12px 24px',
							fontSize: '1.2rem',
							backgroundColor: '#28a745',
							color: 'white',
							border: 'none',
							borderRadius: '6px',
							cursor: 'pointer',
							minWidth: '80px',
						}}
					>
						+0.5
					</button>
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
						<strong>📝 특징:</strong>
					</p>
					<ul>
						<li>소수점 스텝을 사용하여 세밀한 제어가 가능합니다</li>
						<li>금액, 온도, 비율 등을 표현할 때 유용합니다</li>
						<li>JavaScript의 부동소수점 연산을 사용합니다</li>
						<li>정확한 소수점 계산이 필요한 경우 별도 처리가 필요할 수 있습니다</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

import { useState } from 'react';
import { useInterval, useTimeout, useControlledInterval } from '@/utility/useInterval';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'Utility/useInterval',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
## useInterval 훅

지정된 간격으로 콜백 함수를 실행하는 훅입니다.

### 기본 사용법

\`\`\`tsx
import { useInterval } from 'useHookit';

function MyComponent() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useInterval(
    () => {
      setCount((c) => c + 1);
    },
    isRunning ? 1000 : null,
  );

  return (
    <div>
      <p>카운트: {count}</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? '중지' : '시작'}
      </button>
    </div>
  );
}
\`\`\`

### 매개변수

- \`callback\`: 실행할 콜백 함수
- \`delay\`: 실행 간격 (밀리초), null이면 중지

### 반환값

- 없음 (void)
				`,
			},
		},
	},
};

function UseIntervalDemo() {
	const [count, setCount] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [delay, setDelay] = useState(1000);

	useInterval(
		() => {
			setCount((c) => c + 1);
		},
		isRunning ? delay : null,
	);

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>useInterval 훅 데모</h3>
			<p>지정된 간격으로 콜백 함수를 실행하는 훅입니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<h4>카운터</h4>
				<div
					style={{
						padding: '20px',
						backgroundColor: '#f8f9fa',
						borderRadius: '4px',
						border: '1px solid #dee2e6',
						textAlign: 'center',
						fontSize: '24px',
						fontWeight: 'bold',
					}}
				>
					{count}
				</div>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>제어</h4>
				<div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
					<button
						onClick={() => setIsRunning(!isRunning)}
						style={{
							padding: '10px 20px',
							backgroundColor: isRunning ? '#dc3545' : '#28a745',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						{isRunning ? '⏸️ 중지' : '▶️ 시작'}
					</button>

					<button
						onClick={() => setCount(0)}
						style={{
							padding: '10px 20px',
							backgroundColor: '#6c757d',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						🔄 리셋
					</button>
				</div>

				<div>
					<label>
						<strong>간격 (ms):</strong>
						<input
							type='number'
							value={delay}
							onChange={(e) => setDelay(Number(e.target.value))}
							min='100'
							max='10000'
							step='100'
							style={{
								marginLeft: '10px',
								padding: '5px',
								border: '1px solid #ccc',
								borderRadius: '4px',
								width: '100px',
							}}
						/>
					</label>
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
					<strong>사용법:</strong>
				</p>
				<ul>
					<li>시작/중지 버튼으로 인터벌을 제어합니다</li>
					<li>간격을 조절하여 실행 속도를 변경할 수 있습니다</li>
					<li>리셋 버튼으로 카운터를 초기화합니다</li>
				</ul>
			</div>
		</div>
	);
}

export const Default = () => (
	<ToggleComponent
		title='기본 사용법'
		description='지정된 간격으로 콜백 함수를 실행하는 기본 예제입니다.'
		code={`const [count, setCount] = useState(0);
const [isRunning, setIsRunning] = useState(false);
const [delay, setDelay] = useState(1000);

useInterval(
  () => setCount(c => c + 1),
  isRunning ? delay : null
);

return (
  <div>
    <p>카운터: {count}</p>
    <button onClick={() => setIsRunning(!isRunning)}>
      {isRunning ? '중지' : '시작'}
    </button>
  </div>
);`}
	>
		<UseIntervalDemo />
	</ToggleComponent>
);

export const WithTimeout = () => {
	const [message, setMessage] = useState('');
	const [showMessage, setShowMessage] = useState(false);

	useTimeout(() => {
		setMessage('3초 후에 나타난 메시지입니다!');
		setShowMessage(true);
	}, 3000);

	return (
		<ToggleComponent
			title='useTimeout 사용법'
			description='지정된 시간 후에 한 번만 실행되는 훅입니다.'
			code={`const [message, setMessage] = useState('');
const [showMessage, setShowMessage] = useState(false);

useTimeout(() => {
  setMessage('3초 후에 나타난 메시지입니다!');
  setShowMessage(true);
}, 3000);

return (
  <div>
    {!showMessage ? (
      <p>⏰ 3초 후에 메시지가 나타납니다...</p>
    ) : (
      <p>✅ {message}</p>
    )}
  </div>
);`}
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>useTimeout 훅 데모</h3>
				<p>지정된 시간 후에 한 번만 실행되는 훅입니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<h4>타임아웃 메시지</h4>
					{!showMessage ? (
						<div
							style={{
								padding: '20px',
								backgroundColor: '#fff3cd',
								borderRadius: '4px',
								border: '1px solid #ffeaa7',
								textAlign: 'center',
							}}
						>
							<p>⏰ 3초 후에 메시지가 나타납니다...</p>
						</div>
					) : (
						<div
							style={{
								padding: '20px',
								backgroundColor: '#d4edda',
								borderRadius: '4px',
								border: '1px solid #c3e6cb',
								textAlign: 'center',
							}}
						>
							<p>✅ {message}</p>
						</div>
					)}
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
						<strong>특징:</strong>
					</p>
					<ul>
						<li>컴포넌트가 마운트되면 자동으로 시작됩니다</li>
						<li>한 번만 실행되며, 자동으로 정리됩니다</li>
						<li>컴포넌트가 언마운트되면 자동으로 취소됩니다</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithControlledInterval = () => {
	const [count, setCount] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [delay, setDelay] = useState(1000);

	const { start, stop } = useControlledInterval(() => {
		setCount((c) => c + 1);
	}, delay);

	return (
		<ToggleComponent
			title='useControlledInterval 사용법'
			description='수동으로 제어할 수 있는 인터벌 훅입니다.'
			code={`const [count, setCount] = useState(0);
const [isRunning, setIsRunning] = useState(false);
const [delay, setDelay] = useState(1000);

const { start, stop } = useControlledInterval(() => {
  setCount(c => c + 1);
}, delay);

const handleToggle = () => {
  if (isRunning) {
    stop();
  } else {
    start();
  }
  setIsRunning(!isRunning);
};

return (
  <div>
    <p>카운터: {count}</p>
    <button onClick={handleToggle}>
      {isRunning ? '중지' : '시작'}
    </button>
  </div>
);`}
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>useControlledInterval 훅 데모</h3>
				<p>수동으로 제어할 수 있는 인터벌 훅입니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<h4>카운터</h4>
					<div
						style={{
							padding: '20px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
							textAlign: 'center',
							fontSize: '24px',
							fontWeight: 'bold',
						}}
					>
						{count}
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>수동 제어</h4>
					<div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
						<button
							onClick={() => {
								if (isRunning) {
									stop();
								} else {
									start();
								}
								setIsRunning(!isRunning);
							}}
							style={{
								padding: '10px 20px',
								backgroundColor: isRunning ? '#dc3545' : '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							{isRunning ? '⏸️ 중지' : '▶️ 시작'}
						</button>

						<button
							onClick={() => {
								stop();
								setCount(0);
							}}
							style={{
								padding: '10px 20px',
								backgroundColor: '#6c757d',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🔄 리셋
						</button>
					</div>

					<div>
						<label>
							<strong>간격 (ms):</strong>
							<input
								type='number'
								value={delay}
								onChange={(e) => setDelay(Number(e.target.value))}
								min='100'
								max='10000'
								step='100'
								style={{
									marginLeft: '10px',
									padding: '5px',
									border: '1px solid #ccc',
									borderRadius: '4px',
									width: '100px',
								}}
							/>
						</label>
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
						<strong>💡 useControlledInterval vs useInterval:</strong>
					</p>
					<ul>
						<li>
							<strong>useInterval:</strong> 조건부로 실행 (null일 때 중지)
						</li>
						<li>
							<strong>useControlledInterval:</strong> 수동으로 start/stop/reset 제어
						</li>
						<li>더 세밀한 제어가 필요할 때 사용합니다</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithAsyncFunction = () => {
	const [data, setData] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isRunning, setIsRunning] = useState(false);

	const fetchData = async () => {
		setIsLoading(true);
		try {
			// 시뮬레이션된 API 호출
			await new Promise((resolve) => setTimeout(resolve, 500));
			const newData = `데이터 ${Date.now()}`;
			setData((prev) => [...prev, newData]);
		} catch (error) {
			console.error('데이터 가져오기 실패:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useInterval(fetchData, isRunning ? 2000 : null);

	return (
		<ToggleComponent
			title='비동기 함수와 함께 사용'
			description='API 호출 등 비동기 작업을 주기적으로 실행합니다.'
			code={`const [data, setData] = useState<string[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [isRunning, setIsRunning] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  try {
    // 시뮬레이션된 API 호출
    await new Promise(resolve => setTimeout(resolve, 500));
    const newData = \`데이터 \${Date.now()}\`;
    setData(prev => [...prev, newData]);
  } catch (error) {
    console.error('데이터 가져오기 실패:', error);
  } finally {
    setIsLoading(false);
  }
};

useInterval(fetchData, isRunning ? 2000 : null);

return (
  <div>
    <button onClick={() => setIsRunning(!isRunning)}>
      {isRunning ? '중지' : '시작'}
    </button>
    {isLoading && <p>로딩 중...</p>}
    <ul>
      {data.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);`}
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>비동기 함수와 함께 사용</h3>
				<p>API 호출 등 비동기 작업을 주기적으로 실행합니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<h4>데이터 목록</h4>
					<div
						style={{
							maxHeight: '200px',
							overflowY: 'auto',
							padding: '10px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
						}}
					>
						{data.length === 0 ? (
							<p style={{ textAlign: 'center', color: '#6c757d' }}>데이터가 없습니다</p>
						) : (
							data.map((item, index) => (
								<div
									key={index}
									style={{
										padding: '8px',
										margin: '4px 0',
										backgroundColor: '#ffffff',
										borderRadius: '4px',
										border: '1px solid #dee2e6',
									}}
								>
									{item}
								</div>
							))
						)}
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>제어</h4>
					<div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
						<button
							onClick={() => setIsRunning(!isRunning)}
							disabled={isLoading}
							style={{
								padding: '10px 20px',
								backgroundColor: isRunning ? '#dc3545' : '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: isLoading ? 'not-allowed' : 'pointer',
								opacity: isLoading ? 0.6 : 1,
							}}
						>
							{isRunning ? '⏸️ 중지' : '▶️ 시작'}
						</button>

						<button
							onClick={() => setData([])}
							style={{
								padding: '10px 20px',
								backgroundColor: '#6c757d',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🗑️ 데이터 초기화
						</button>
					</div>

					{isLoading && (
						<div
							style={{
								padding: '10px',
								backgroundColor: '#fff3cd',
								borderRadius: '4px',
								border: '1px solid #ffeaa7',
								textAlign: 'center',
							}}
						>
							🔄 데이터를 가져오는 중...
						</div>
					)}
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
						<strong>💡 비동기 인터벌 특징:</strong>
					</p>
					<ul>
						<li>API 호출, 데이터 동기화 등에 유용합니다</li>
						<li>로딩 상태를 관리할 수 있습니다</li>
						<li>에러 처리가 가능합니다</li>
						<li>2초마다 새로운 데이터를 가져옵니다</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

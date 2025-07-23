import { useState, useEffect } from 'react';
import { useIsMounted } from '@/lifecycle/useIsMounted';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'Lifecycle/useIsMounted',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
## useIsMounted 훅

컴포넌트가 마운트되어 있는지 확인하는 훅입니다.

### 기본 사용법

\`\`\`tsx
import { useIsMounted } from 'useHookit';

function MyComponent() {
  const isMounted = useIsMounted();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.getData();
      
      if (isMounted) {
        setData(result);
      }
    };

    fetchData();
  }, [isMounted]);

  return <div>{data && <p>{data}</p>}</div>;
}
\`\`\`

### 매개변수

없음

### 반환값

- \`boolean\`: 컴포넌트가 마운트되어 있으면 \`true\`, 그렇지 않으면 \`false\`
				`,
			},
		},
	},
};

// 기본 사용 예제
function BasicExample() {
	const isMounted = useIsMounted();
	const [count, setCount] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			if (isMounted) {
				setCount((prev) => prev + 1);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [isMounted]);

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<p>
					<strong>마운트 상태:</strong> {isMounted ? '✅ 마운트됨' : '❌ 언마운트됨'}
				</p>
				<p>
					<strong>카운터:</strong> {count}
				</p>
			</div>

			<div
				style={{
					padding: '15px',
					backgroundColor: isMounted ? '#d4edda' : '#f8d7da',
					borderRadius: '4px',
					border: `1px solid ${isMounted ? '#c3e6cb' : '#f5c6cb'}`,
				}}
			>
				<p>
					<strong>상태:</strong>{' '}
					{isMounted ? '활성 - 카운터가 증가합니다' : '비활성 - 카운터가 멈춥니다'}
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
					<strong>💡 useIsMounted의 활용:</strong>
				</p>
				<ul>
					<li>컴포넌트가 마운트되어 있는지 확인</li>
					<li>비동기 작업 후 상태 업데이트 방지</li>
					<li>메모리 누수 방지</li>
					<li>안전한 상태 업데이트 보장</li>
				</ul>
			</div>
		</div>
	);
}

// 여러 컴포넌트 예제
function MultipleComponentsExample() {
	const [components, setComponents] = useState<number[]>([1]);

	const addComponent = () => {
		setComponents((prev) => [...prev, prev.length > 0 ? Math.max(...prev) + 1 : 1]);
	};

	const removeComponent = (id: number) => {
		setComponents((prev) => prev.filter((c) => c !== id));
	};

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<button
					onClick={addComponent}
					style={{
						padding: '10px 20px',
						backgroundColor: '#28a745',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
					}}
				>
					➕ 컴포넌트 추가
				</button>
			</div>

			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
					gap: '15px',
				}}
			>
				{components.map((id) => (
					<ComponentWithIsMounted key={id} id={id} onRemove={removeComponent} />
				))}
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
					<strong>💡 여러 컴포넌트 관리:</strong>
				</p>
				<ul>
					<li>각 컴포넌트의 마운트 상태를 개별적으로 추적</li>
					<li>동적으로 컴포넌트 추가/제거</li>
					<li>각 컴포넌트의 독립적인 상태 관리</li>
				</ul>
			</div>
		</div>
	);
}

function ComponentWithIsMounted({ id, onRemove }: { id: number; onRemove: (id: number) => void }) {
	const isMounted = useIsMounted();
	const [count, setCount] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			if (isMounted) {
				setCount((prev) => prev + 1);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [isMounted]);

	return (
		<div
			style={{
				padding: '15px',
				backgroundColor: '#f8f9fa',
				borderRadius: '8px',
				border: '1px solid #dee2e6',
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '10px',
				}}
			>
				<h5>컴포넌트 {id}</h5>
				<button
					onClick={() => onRemove(id)}
					style={{
						padding: '5px 10px',
						backgroundColor: '#dc3545',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						fontSize: '12px',
					}}
				>
					❌ 제거
				</button>
			</div>

			<div style={{ marginBottom: '10px' }}>
				<p>
					<strong>마운트 상태:</strong> {isMounted ? '✅ 마운트됨' : '❌ 언마운트됨'}
				</p>
				<p>
					<strong>카운터:</strong> {count}
				</p>
			</div>

			<div
				style={{
					padding: '8px',
					backgroundColor: isMounted ? '#d4edda' : '#f8d7da',
					borderRadius: '4px',
					border: `1px solid ${isMounted ? '#c3e6cb' : '#f5c6cb'}`,
					fontSize: '12px',
				}}
			>
				{isMounted ? '🔄 활성 - 카운터가 증가합니다' : '⏸️ 비활성 - 카운터가 멈춥니다'}
			</div>
		</div>
	);
}

// 코드 스니펫들
const basicCode = `const isMounted = useIsMounted();
const [count, setCount] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    if (isMounted) {
      setCount(prev => prev + 1);
    }
  }, 1000);

  return () => clearInterval(interval);
}, [isMounted]);`;

const multipleComponentsCode = `function ComponentWithIsMounted({ id, onRemove }) {
  const isMounted = useIsMounted();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isMounted) {
        setCount(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isMounted]);

  return (
    <div>
      <p>마운트 상태: {isMounted ? '✅' : '❌'}</p>
      <p>카운터: {count}</p>
    </div>
  );
}`;

export const Default = () => (
	<ToggleComponent
		title='기본 사용법'
		description='컴포넌트가 마운트되어 있는지 확인하는 훅입니다.'
		code={basicCode}
	>
		<BasicExample />
	</ToggleComponent>
);

export const WithMultipleComponents = () => (
	<ToggleComponent
		title='여러 컴포넌트 예제'
		description='각 컴포넌트의 마운트 상태를 개별적으로 추적합니다.'
		code={multipleComponentsCode}
	>
		<MultipleComponentsExample />
	</ToggleComponent>
);

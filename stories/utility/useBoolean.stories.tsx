import React from 'react';
import { useBoolean } from '../../src/utility/useBoolean';
import { ToggleComponent } from '../components/ToggleComponent';

export default {
	title: 'Utility/useBoolean',
	parameters: {
		layout: 'centered',
	},
};

// 코드 스니펫들
const basicCode = `import React from 'react';
import { useBoolean } from '../../src/utility/useBoolean';

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
				<button onClick={toggle}>토글</button>
				<button onClick={setTrue}>보이기</button>
				<button onClick={setFalse}>숨기기</button>
			</div>

			{isVisible && (
				<div>
					<p>이 내용은 토글 버튼으로 보이거나 숨겨집니다!</p>
				</div>
			)}
		</div>
	);
}`;

const initialTrueCode = `import React from 'react';
import { useBoolean } from '../../src/utility/useBoolean';

`;

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

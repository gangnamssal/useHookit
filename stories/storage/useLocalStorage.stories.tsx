import React from 'react';
import { useLocalStorage } from '../../src/storage/useLocalStorage';
import { ToggleComponent } from '../components/ToggleComponent';

export default {
	title: 'Storage/useLocalStorage',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
## useLocalStorage 훅

로컬 스토리지에 데이터를 저장하고 관리하는 훅입니다.

### 기본 사용법

\`\`\`tsx
import { useLocalStorage } from 'useHookit';

function MyComponent() {
  const [name, setName] = useLocalStorage('user-name', '');
  const [age, setAge] = useLocalStorage('user-age', 0);

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름을 입력하세요"
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
      />
    </div>
  );
}
\`\`\`

### 매개변수

- \`key\`: 로컬 스토리지 키
- \`initialValue\`: 초기값

### 반환값

- \`[value, setValue]\`: 상태와 설정 함수
				`,
			},
		},
	},
};

function UseLocalStorageDemo() {
	const [name, setName] = useLocalStorage('user-name', '');
	const [age, setAge] = useLocalStorage('user-age', 0);
	const [preferences, setPreferences] = useLocalStorage('user-preferences', {
		theme: 'light',
		language: 'ko',
	});

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<h4>문자열 저장</h4>
				<label>
					<strong>이름:</strong>
					<input
						type='text'
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder='이름을 입력하세요'
						style={{
							padding: '8px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							width: '200px',
							marginLeft: '10px',
						}}
					/>
				</label>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>숫자 저장</h4>
				<label>
					<strong>나이:</strong>
					<input
						type='number'
						value={age}
						onChange={(e) => setAge(Number(e.target.value))}
						style={{
							padding: '8px',
							border: '1px solid #ccc',
							borderRadius: '4px',
							width: '100px',
							marginLeft: '10px',
						}}
					/>
				</label>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>객체 저장</h4>
				<p>
					<strong>테마:</strong> {preferences.theme}
				</p>
				<p>
					<strong>언어:</strong> {preferences.language}
				</p>
				<button
					onClick={() =>
						setPreferences({
							...preferences,
							theme: preferences.theme === 'light' ? 'dark' : 'light',
						})
					}
					style={{
						padding: '8px 16px',
						backgroundColor: '#007bff',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						marginRight: '10px',
					}}
				>
					테마 변경
				</button>
				<button
					onClick={() =>
						setPreferences({
							...preferences,
							language: preferences.language === 'ko' ? 'en' : 'ko',
						})
					}
					style={{
						padding: '8px 16px',
						backgroundColor: '#28a745',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
					}}
				>
					언어 변경
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
					<strong>💡 로컬 스토리지의 특징:</strong>
				</p>
				<ul>
					<li>브라우저를 닫아도 데이터가 유지됩니다</li>
					<li>문자열, 숫자, 객체 등 다양한 타입을 저장할 수 있습니다</li>
					<li>자동으로 JSON 직렬화/역직렬화를 처리합니다</li>
					<li>페이지 새로고침 후에도 데이터가 복원됩니다</li>
				</ul>
			</div>
		</div>
	);
}

function ClearDataExample() {
	const [name, , removeName] = useLocalStorage('user-name', '');
	const [age, , removeAge] = useLocalStorage('user-age', 0);
	const [preferences, , removePreferences] = useLocalStorage('user-preferences', {
		theme: 'light',
		language: 'ko',
	});

	const clearAllData = () => {
		removeName();
		removeAge();
		removePreferences();
	};

	const clearSpecificData = (key: string) => {
		if (key === 'user-name') removeName();
		if (key === 'user-age') removeAge();
		if (key === 'user-preferences') removePreferences();
	};

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<h4>현재 저장된 데이터</h4>
				<p>
					<strong>이름:</strong> {name || '(없음)'}
				</p>
				<p>
					<strong>나이:</strong> {age || '(없음)'}
				</p>
				<p>
					<strong>설정:</strong> {preferences ? JSON.stringify(preferences) : '(없음)'}
				</p>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>데이터 삭제</h4>
				<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
					<button
						onClick={() => clearSpecificData('user-name')}
						style={{
							padding: '8px 16px',
							backgroundColor: '#ffc107',
							color: 'black',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						이름 삭제
					</button>
					<button
						onClick={() => clearSpecificData('user-age')}
						style={{
							padding: '8px 16px',
							backgroundColor: '#ffc107',
							color: 'black',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						나이 삭제
					</button>
					<button
						onClick={() => clearSpecificData('user-preferences')}
						style={{
							padding: '8px 16px',
							backgroundColor: '#ffc107',
							color: 'black',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						설정 삭제
					</button>
					<button
						onClick={clearAllData}
						style={{
							padding: '8px 16px',
							backgroundColor: '#dc3545',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						모든 데이터 삭제
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
					<strong>💡 데이터 삭제 방법:</strong>
				</p>
				<ul>
					<li>특정 키 삭제: localStorage.removeItem('key')</li>
					<li>모든 데이터 삭제: localStorage.clear()</li>
					<li>삭제 후에는 초기값으로 복원됩니다</li>
					<li>위의 버튼들을 클릭하여 실제로 데이터가 삭제되는 것을 확인해보세요</li>
				</ul>
			</div>
		</div>
	);
}

// 코드 스니펫들
const basicCode = `const [name, setName, removeName] = useLocalStorage('user-name', '');
const [age, setAge, removeAge] = useLocalStorage('user-age', 0);
const [preferences, setPreferences, removePreferences] = useLocalStorage('user-preferences', {
  theme: 'light',
  language: 'ko',
});

// 문자열, 숫자, 객체 등 다양한 타입을 저장할 수 있습니다
// 브라우저를 닫아도 데이터가 유지됩니다`;

const clearDataCode = `const [name, setName, removeName] = useLocalStorage('user-name', '');
const [age, setAge, removeAge] = useLocalStorage('user-age', 0);
const [preferences, setPreferences, removePreferences] = useLocalStorage('user-preferences', {
  theme: 'light',
  language: 'ko',
});

const clearAllData = () => {
  removeName();
  removeAge();
  removePreferences();
};

const clearSpecificData = (key: string) => {
  if (key === 'user-name') removeName();
  if (key === 'user-age') removeAge();
  if (key === 'user-preferences') removePreferences();
};

// 특정 키 삭제: localStorage.removeItem('key')
// 모든 데이터 삭제: localStorage.clear()`;

export const Default = () => (
	<ToggleComponent
		title='기본 사용법'
		description='로컬 스토리지에 데이터를 저장하고 관리하는 훅입니다.'
		code={basicCode}
	>
		<UseLocalStorageDemo />
	</ToggleComponent>
);

export const WithClearData = () => (
	<ToggleComponent
		title='데이터 삭제 예제'
		description='기본 예제에서 저장된 데이터를 삭제하는 방법을 보여줍니다.'
		code={clearDataCode}
	>
		<ClearDataExample />
	</ToggleComponent>
);

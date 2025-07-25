import { useSessionStorage } from '@/storage/useSessionStorage';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'Storage/useSessionStorage',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
A React hook that allows you to use browser's sessionStorage like React state. It provides temporary data storage that persists only for the current browser session.

### API

#### Parameters
- **key**: string - Key to store in sessionStorage
- **initialValue**: T - Initial value for the storage
- **options**: UseSessionStorageOptions (optional) - Serialization/deserialization function options
  - **serializer**: (value: T) => string (optional) - Custom serialization function
  - **deserializer**: (value: string) => T (optional) - Custom deserialization function
- **Usage Example**: const [value, setValue, removeValue] = useSessionStorage('key', initialValue);

#### Return Value
- **Type**: [T, (value: T | ((val: T) => T)) => void, () => void]
- **Description**: Returns [current value, set value function, remove value function] tuple
- **Return Value Properties**:
  - **value**: T - Current stored value
  - **setValue**: (value: T | ((val: T) => T)) => void - Function to update the stored value
  - **removeValue**: () => void - Function to remove the stored value
- **Usage Example**: const [name, setName, removeName] = useSessionStorage('user-name', '');

### Usage Examples

\`\`\`tsx
// Basic usage
const [name, setName, removeName] = useSessionStorage('user-name', '');
const [age, setAge, removeAge] = useSessionStorage('user-age', 0);
const [tempData, setTempData, removeTempData] = useSessionStorage('temp-data', {
  step: 1,
  progress: 0
});

// String, number, object types are automatically serialized
// Data persists only for the current browser session

// Usage with function updater
const handleIncrement = () => {
  setAge(prev => prev + 1);
};

// Remove stored value
const handleReset = () => {
  removeName();
  removeAge();
  removeTempData();
};

// Custom serialization for Date objects
const [sessionDate, setSessionDate, removeSessionDate] = useSessionStorage('session-date', new Date(), {
  serializer: (value) => value.toISOString(),
  deserializer: (value) => new Date(value)
});

// Custom serialization for complex objects
const [sessionUser, setSessionUser, removeSessionUser] = useSessionStorage('session-user', null, {
  serializer: (value) => JSON.stringify(value, null, 2),
  deserializer: (value) => JSON.parse(value)
});
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

function UseSessionStorageDemo() {
	const [name, setName] = useSessionStorage('user-name', '');
	const [age, setAge] = useSessionStorage('user-age', 0);
	const [preferences, setPreferences] = useSessionStorage('user-preferences', {
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
					<strong>💡 세션 스토리지의 특징:</strong>
				</p>
				<ul>
					<li>브라우저 탭을 닫으면 데이터가 삭제됩니다</li>
					<li>문자열, 숫자, 객체 등 다양한 타입을 저장할 수 있습니다</li>
					<li>자동으로 JSON 직렬화/역직렬화를 처리합니다</li>
					<li>페이지 새로고침 후에도 데이터가 유지됩니다</li>
				</ul>
			</div>
		</div>
	);
}

function ClearDataExample() {
	const [name, , removeName] = useSessionStorage('user-name', '');
	const [age, , removeAge] = useSessionStorage('user-age', 0);
	const [preferences, , removePreferences] = useSessionStorage('user-preferences', {
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
					<li>특정 키 삭제: sessionStorage.removeItem('key')</li>
					<li>모든 데이터 삭제: sessionStorage.clear()</li>
					<li>삭제 후에는 초기값으로 복원됩니다</li>
					<li>위의 버튼들을 클릭하여 실제로 데이터가 삭제되는 것을 확인해보세요</li>
				</ul>
			</div>
		</div>
	);
}

// 코드 스니펫들
const basicCode = `const [name, setName, removeName] = useSessionStorage('user-name', '');
const [age, setAge, removeAge] = useSessionStorage('user-age', 0);
const [preferences, setPreferences, removePreferences] = useSessionStorage('user-preferences', {
  theme: 'light',
  language: 'ko',
});

// 문자열, 숫자, 객체 등 다양한 타입을 저장할 수 있습니다
// 브라우저 탭을 닫으면 데이터가 삭제됩니다

// Function updater 사용법
const handleIncrement = () => {
  setAge(prev => prev + 1);
};

// 값 제거
const handleReset = () => {
  removeName();
  removeAge();
  removePreferences();
};`;

const clearDataCode = `const [name, setName, removeName] = useSessionStorage('user-name', '');
const [age, setAge, removeAge] = useSessionStorage('user-age', 0);
const [preferences, setPreferences, removePreferences] = useSessionStorage('user-preferences', {
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

// 특정 키 삭제: sessionStorage.removeItem('key')
// 모든 데이터 삭제: sessionStorage.clear()`;

export const Default = () => (
	<ToggleComponent
		title='기본 사용법'
		description='세션 스토리지에 데이터를 저장하고 관리하는 훅입니다.'
		code={basicCode}
	>
		<UseSessionStorageDemo />
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

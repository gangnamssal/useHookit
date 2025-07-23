import React, { useState } from 'react';
import { useDebounce } from '../../src/performance/useDebounce';
import { ToggleComponent } from '../components/ToggleComponent';

export default {
	title: 'Performance/useDebounce',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
## useDebounce 훅

입력값을 디바운스하여 성능을 최적화하는 훅입니다.

### 기본 사용법

\`\`\`tsx
import { useDebounce } from 'useHookit';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // API 호출
      searchAPI(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="검색어를 입력하세요"
    />
  );
}
\`\`\`

### 매개변수

- \`value\`: 디바운스할 값
- \`delay\`: 지연 시간 (밀리초)

### 반환값

- 디바운스된 값
				`,
			},
		},
	},
	argTypes: {
		delay: {
			control: { type: 'number', min: 100, max: 3000, step: 100 },
			description: '디바운스 지연 시간 (밀리초)',
		},
	},
};

// 기본 검색 예제
function SearchExample() {
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearchTerm = useDebounce(searchTerm, 500);
	const [searchResults, setSearchResults] = useState<string[]>([]);
	const [isSearching, setIsSearching] = useState(false);

	// 검색 시뮬레이션
	React.useEffect(() => {
		if (debouncedSearchTerm) {
			setIsSearching(true);
			// 검색 API 호출 시뮬레이션
			const timer = setTimeout(() => {
				const mockResults = [
					`"${debouncedSearchTerm}"에 대한 결과 1`,
					`"${debouncedSearchTerm}"에 대한 결과 2`,
					`"${debouncedSearchTerm}"에 대한 결과 3`,
				];
				setSearchResults(mockResults);
				setIsSearching(false);
			}, 300);

			return () => clearTimeout(timer);
		} else {
			setSearchResults([]);
		}
	}, [debouncedSearchTerm]);

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<label>
					<strong>검색어:</strong>
					<input
						type='text'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder='검색어를 입력하세요'
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
					<strong>실시간 입력:</strong> {searchTerm || '(비어있음)'}
				</p>
				<p>
					<strong>디바운스된 검색어 (500ms):</strong> {debouncedSearchTerm || '(비어있음)'}
				</p>
			</div>

			{isSearching && (
				<div
					style={{
						padding: '10px',
						backgroundColor: '#fff3cd',
						borderRadius: '4px',
						border: '1px solid #ffeaa7',
						marginBottom: '15px',
					}}
				>
					<p>🔍 검색 중...</p>
				</div>
			)}

			{searchResults.length > 0 && (
				<div
					style={{
						padding: '15px',
						backgroundColor: '#d4edda',
						borderRadius: '4px',
						border: '1px solid #c3e6cb',
					}}
				>
					<h4>검색 결과:</h4>
					<ul style={{ margin: '0', paddingLeft: '20px' }}>
						{searchResults.map((result, index) => (
							<li key={index}>{result}</li>
						))}
					</ul>
				</div>
			)}

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
					<strong>💡 디바운스의 장점:</strong>
				</p>
				<ul>
					<li>사용자가 타이핑을 멈춘 후 500ms 후에만 검색 실행</li>
					<li>불필요한 API 호출 방지</li>
					<li>성능 최적화 및 서버 부하 감소</li>
				</ul>
			</div>
		</div>
	);
}

// 폼 검증 예제
function FormValidationExample() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const debouncedEmail = useDebounce(email, 300);
	const debouncedPassword = useDebounce(password, 300);
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');

	// 이메일 검증
	React.useEffect(() => {
		if (debouncedEmail && !debouncedEmail.includes('@')) {
			setEmailError('올바른 이메일 형식이 아닙니다.');
		} else {
			setEmailError('');
		}
	}, [debouncedEmail]);

	// 비밀번호 검증
	React.useEffect(() => {
		if (debouncedPassword && debouncedPassword.length < 6) {
			setPasswordError('비밀번호는 최소 6자 이상이어야 합니다.');
		} else {
			setPasswordError('');
		}
	}, [debouncedPassword]);

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<div style={{ marginBottom: '15px' }}>
					<label>
						<strong>이메일:</strong>
						<input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder='이메일을 입력하세요'
							style={{
								padding: '8px',
								border: `1px solid ${emailError ? '#dc3545' : '#ccc'}`,
								borderRadius: '4px',
								width: '250px',
								marginLeft: '10px',
							}}
						/>
					</label>
					{emailError && (
						<p style={{ color: '#dc3545', fontSize: '14px', margin: '5px 0 0 0' }}>
							❌ {emailError}
						</p>
					)}
				</div>

				<div style={{ marginBottom: '15px' }}>
					<label>
						<strong>비밀번호:</strong>
						<input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder='비밀번호를 입력하세요'
							style={{
								padding: '8px',
								border: `1px solid ${passwordError ? '#dc3545' : '#ccc'}`,
								borderRadius: '4px',
								width: '250px',
								marginLeft: '10px',
							}}
						/>
					</label>
					{passwordError && (
						<p style={{ color: '#dc3545', fontSize: '14px', margin: '5px 0 0 0' }}>
							❌ {passwordError}
						</p>
					)}
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
					<strong>💡 폼 검증에서의 디바운스:</strong>
				</p>
				<ul>
					<li>사용자가 타이핑을 멈춘 후 300ms 후에만 검증 실행</li>
					<li>실시간으로 오류 메시지 표시</li>
					<li>과도한 검증으로 인한 성능 저하 방지</li>
				</ul>
			</div>
		</div>
	);
}

// 윈도우 크기 추적 예제
function WindowSizeExample() {
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});
	const debouncedWindowSize = useDebounce(windowSize, 200);

	React.useEffect(() => {
		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<p>
					<strong>실시간 크기:</strong> {windowSize.width} × {windowSize.height}
				</p>
				<p>
					<strong>디바운스된 크기 (200ms):</strong> {debouncedWindowSize.width} ×{' '}
					{debouncedWindowSize.height}
				</p>
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
					<strong>💡 사용법:</strong>
				</p>
				<p>
					브라우저 창의 크기를 변경해보세요. 실시간 크기와 디바운스된 크기의 차이를 확인할 수
					있습니다.
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
					<strong>💡 윈도우 크기에서의 디바운스:</strong>
				</p>
				<ul>
					<li>리사이즈 이벤트를 디바운스하여 성능 최적화</li>
					<li>과도한 상태 업데이트 방지</li>
					<li>부드러운 사용자 경험 제공</li>
				</ul>
			</div>
		</div>
	);
}

// 커스텀 지연 시간 예제
function CustomDelayExample() {
	const [value, setValue] = useState('');
	const [delay, setDelay] = useState(1000);
	const debouncedValue = useDebounce(value, delay);

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<div style={{ marginBottom: '15px' }}>
					<label>
						<strong>지연 시간 (ms):</strong>
						<select
							value={delay}
							onChange={(e) => setDelay(Number(e.target.value))}
							style={{
								padding: '8px',
								border: '1px solid #ccc',
								borderRadius: '4px',
								marginLeft: '10px',
							}}
						>
							<option value={100}>100ms</option>
							<option value={300}>300ms</option>
							<option value={500}>500ms</option>
							<option value={1000}>1000ms</option>
							<option value={2000}>2000ms</option>
						</select>
					</label>
				</div>

				<div style={{ marginBottom: '15px' }}>
					<label>
						<strong>입력:</strong>
						<input
							type='text'
							value={value}
							onChange={(e) => setValue(e.target.value)}
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
			</div>

			<div style={{ marginBottom: '20px' }}>
				<p>
					<strong>실시간 값:</strong> {value || '(비어있음)'}
				</p>
				<p>
					<strong>디바운스된 값 ({delay}ms):</strong> {debouncedValue || '(비어있음)'}
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
					<strong>💡 지연 시간 선택:</strong>
				</p>
				<ul>
					<li>
						<strong>100ms:</strong> 빠른 응답이 필요한 경우
					</li>
					<li>
						<strong>300-500ms:</strong> 일반적인 검색/검증
					</li>
					<li>
						<strong>1000ms+:</strong> 무거운 작업이나 네트워크 요청
					</li>
				</ul>
			</div>
		</div>
	);
}

// 코드 스니펫들
const searchCode = `const [searchTerm, setSearchTerm] = useState('');
const debouncedSearchTerm = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearchTerm) {
    // API 호출
    searchAPI(debouncedSearchTerm);
  }
}, [debouncedSearchTerm]);`;

const formValidationCode = `const [email, setEmail] = useState('');
const debouncedEmail = useDebounce(email, 300);

useEffect(() => {
  if (debouncedEmail && !debouncedEmail.includes('@')) {
    setEmailError('올바른 이메일 형식이 아닙니다.');
  } else {
    setEmailError('');
  }
}, [debouncedEmail]);`;

const windowSizeCode = `const [windowSize, setWindowSize] = useState({
  width: window.innerWidth,
  height: window.innerHeight,
});
const debouncedWindowSize = useDebounce(windowSize, 200);

useEffect(() => {
  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);`;

const customDelayCode = `const [value, setValue] = useState('');
const [delay, setDelay] = useState(1000);
const debouncedValue = useDebounce(value, delay);

// 다양한 지연 시간으로 실험 가능
// 100ms: 빠른 응답
// 500ms: 일반적인 검색
// 1000ms: 무거운 작업`;

export const Default = () => (
	<ToggleComponent
		title='검색 예제'
		description='실시간 검색에서 디바운스를 사용하여 API 호출을 최적화합니다.'
		code={searchCode}
	>
		<SearchExample />
	</ToggleComponent>
);

export const FormValidation = () => (
	<ToggleComponent
		title='폼 검증 예제'
		description='실시간 폼 검증에서 디바운스를 사용하여 사용자 경험을 개선합니다.'
		code={formValidationCode}
	>
		<FormValidationExample />
	</ToggleComponent>
);

export const WindowSize = () => (
	<ToggleComponent
		title='윈도우 크기 추적 예제'
		description='윈도우 크기 변경을 디바운스하여 성능을 최적화합니다.'
		code={windowSizeCode}
	>
		<WindowSizeExample />
	</ToggleComponent>
);

export const CustomDelay = () => (
	<ToggleComponent
		title='커스텀 지연 시간 예제'
		description='다양한 지연 시간으로 디바운스 동작을 확인할 수 있습니다.'
		code={customDelayCode}
	>
		<CustomDelayExample />
	</ToggleComponent>
);

import { useState } from 'react';
import { useObject } from '../../../src/utility/useObject';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'Utility/useObject',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
A React hook that provides declarative object state management with comprehensive object manipulation methods. Simplifies object operations like adding, removing, updating, searching, and transforming properties while maintaining immutability and performance.

### API

#### Parameters
- **options**: UseObjectOptions<T> (optional) - Configuration options for object management
- **options.initialValue**: T (optional, default: {}) - Initial object value
- **options.debug**: boolean (optional, default: false) - Enable debug logging
- **Usage Example**: useObject<User>({ initialValue: { name: 'John', age: 30 }, debug: true });

#### Return Value
- **Type**: [T, ObjectOperations<T>]
- **Description**: Returns current object and operations object
- **Usage Example**: const [object, operations] = useObject<User>({ initialValue: { name: 'John' } });

#### Return Value Properties

| Property | Type | Description |
|----------|------|-------------|
| object | T | Current object value |
| operations | ObjectOperations<T> | Object containing all object manipulation methods |

#### ObjectOperations Methods

**Basic Operations:**
- **set**: (key: keyof T, value: T[keyof T]) => void - Set a property
- **remove**: (key: keyof T) => void - Remove a property
- **has**: (key: keyof T) => boolean - Check if property exists
- **clear**: () => void - Remove all properties

**Convenience Methods:**
- **setMultiple**: (updates: Partial<T>) => void - Set multiple properties
- **removeMultiple**: (keys: (keyof T)[]) => void - Remove multiple properties
- **update**: (key: keyof T, updater: (value: T[keyof T]) => T[keyof T]) => void - Update property using function
- **updateMultiple**: (updaters: { [K in keyof T]?: (value: T[K]) => T[K] }) => void - Update multiple properties using functions
- **toggle**: (key: keyof T) => void - Toggle boolean property
- **merge**: (objectToMerge: Partial<T>) => void - Merge with another object
- **replace**: (newObject: T) => void - Replace entire object

**Query Methods:**
- **size**: number - Object size (number of properties)
- **isEmpty**: boolean - Is object empty
- **isNotEmpty**: boolean - Is object not empty
- **keys**: () => (keyof T)[] - All keys as array
- **values**: () => T[keyof T][] - All values as array
- **entries**: () => [keyof T, T[keyof T]][] - All entries as array

**Transformation Methods:**
- **pick**: (keys: (keyof T)[]) => Partial<T> - Pick specific properties
- **omit**: (keys: (keyof T)[]) => Partial<T> - Omit specific properties
- **transform**: <R>(transformer: (obj: T) => R) => R - Transform object using function
- **filter**: (predicate: (value: T[keyof T], key: keyof T) => boolean) => Partial<T> - Filter properties based on predicate
- **map**: <R>(mapper: (value: T[keyof T], key: keyof T) => R) => Record<string, R> - Transform object values using mapper function

**Debug:**
- **debug**: boolean - Debug mode flag

### Usage Examples

\`\`\`tsx
// Basic object operations
const [object, operations] = useObject<User>({ 
  initialValue: { name: 'John', age: 30, isActive: true } 
});

const handleSetName = () => operations.set('name', 'Jane');
const handleGetAge = () => alert('나이: ' + object.age);
const handleRemoveEmail = () => operations.remove('email');
const handleHasName = () => alert('이름이 있나요? ' + operations.has('name'));
const handleClear = () => operations.clear();

return (
  <div>
    <p>객체: {JSON.stringify(object)}</p>
    <button onClick={handleSetName}>이름 변경</button>
    <button onClick={handleGetAge}>나이 조회</button>
    <button onClick={handleRemoveEmail}>이메일 제거</button>
    <button onClick={handleHasName}>이름 확인</button>
    <button onClick={handleClear}>초기화</button>
  </div>
);

// Convenience methods
const [object, operations] = useObject<User>();

const handleSetMultiple = () => operations.setMultiple({ name: 'Alice', age: 25, isActive: true });
const handleRemoveMultiple = () => operations.removeMultiple(['email', 'preferences']);
const handleUpdate = () => operations.update('age', (age) => age + 1);
const handleToggle = () => operations.toggle('isActive');
const handleMerge = () => operations.merge({ email: 'alice@example.com' });

return (
  <div>
    <p>객체: {JSON.stringify(object)}</p>
    <button onClick={handleSetMultiple}>여러 속성 설정</button>
    <button onClick={handleRemoveMultiple}>여러 속성 제거</button>
    <button onClick={handleUpdate}>나이 증가</button>
    <button onClick={handleToggle}>활성 토글</button>
    <button onClick={handleMerge}>객체 병합</button>
  </div>
);

// Query methods
const [object, operations] = useObject<User>({ 
  initialValue: { name: 'Bob', age: 35, isActive: false, email: 'bob@example.com' } 
});

return (
  <div>
    <p>객체: {JSON.stringify(object)}</p>
    <p>크기: {operations.size}</p>
    <p>비어있나요? {operations.isEmpty ? '예' : '아니오'}</p>
    <p>키들: {JSON.stringify(operations.keys())}</p>
    <p>값들: {JSON.stringify(operations.values())}</p>
    <p>엔트리들: {JSON.stringify(operations.entries())}</p>
  </div>
);

// Transformation methods
const [object, operations] = useObject<User>({ 
  initialValue: { name: 'Charlie', age: 40, isActive: true, email: 'charlie@example.com' } 
});

const handlePick = () => {
  const picked = operations.pick(['name', 'age']);
  alert('선택된 속성: ' + JSON.stringify(picked));
};

const handleOmit = () => {
  const omitted = operations.omit(['email', 'preferences']);
  alert('제외된 속성: ' + JSON.stringify(omitted));
};

const handleFilter = () => {
  const filtered = operations.filter((value, key) => typeof value === 'string');
  alert('문자열 값들: ' + JSON.stringify(filtered));
};

const handleMap = () => {
  const mapped = operations.map((value, key) => 
    typeof value === 'string' ? value.toUpperCase() : value
  );
  alert('변환된 값들: ' + JSON.stringify(mapped));
};

const handleTransform = () => {
  const transformed = operations.transform((obj) => ({
    displayName: obj.name.toUpperCase(),
    ageGroup: obj.age < 30 ? 'young' : obj.age < 50 ? 'middle' : 'senior',
    status: obj.isActive ? 'active' : 'inactive'
  }));
  alert('변환된 객체: ' + JSON.stringify(transformed));
};

return (
  <div>
    <p>객체: {JSON.stringify(object)}</p>
    <button onClick={handlePick}>속성 선택</button>
    <button onClick={handleOmit}>속성 제외</button>
    <button onClick={handleFilter}>필터링</button>
    <button onClick={handleMap}>변환</button>
    <button onClick={handleTransform}>객체 변환</button>
  </div>
);

// Complex object management
interface User {
  name: string;
  age: number;
  isActive: boolean;
  email?: string;
  preferences?: {
    theme: string;
    language: string;
  };
}

const [user, operations] = useObject<User>({
  initialValue: { name: 'David', age: 28, isActive: true }
});

const handleAddEmail = () => operations.set('email', 'david@example.com');
const handleAddPreferences = () => operations.set('preferences', { theme: 'dark', language: 'ko' });
const handleUpdateAge = () => operations.update('age', (age) => age + 1);
const handleToggleActive = () => operations.toggle('isActive');

return (
  <div>
    <p>사용자: {JSON.stringify(user)}</p>
    <button onClick={handleAddEmail}>이메일 추가</button>
    <button onClick={handleAddPreferences}>설정 추가</button>
    <button onClick={handleUpdateAge}>나이 증가</button>
    <button onClick={handleToggleActive}>활성 토글</button>
  </div>
);

// Debug mode
const [object, operations] = useObject<User>({ debug: true });

const handleAdd = () => operations.set('name', 'Emma');
const handleRemove = () => operations.remove('email');

return (
  <div>
    <p>객체: {JSON.stringify(object)}</p>
    <p>콘솔을 확인하여 디버그 로그를 보세요!</p>
    <button onClick={handleAdd}>속성 추가</button>
    <button onClick={handleRemove}>속성 제거</button>
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
	tags: ['utility', 'object', 'state-management', 'autodocs'],
};

interface User {
	name: string;
	age: number;
	isActive: boolean;
	email?: string;
	preferences?: {
		theme: string;
		language: string;
	};
}

// 기본 사용법
const BasicUsage = () => {
	const [object, operations] = useObject<User>({
		initialValue: { name: 'John', age: 30, isActive: true },
	});

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>기본 사용법</h3>
			<p>객체 상태를 관리하는 기본적인 사용법입니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<h4>현재 객체 상태</h4>
				<pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
					{JSON.stringify(object, null, 2)}
				</pre>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>객체 정보</h4>
				<p>크기: {operations.size}</p>
				<p>비어있음: {operations.isEmpty ? '예' : '아니오'}</p>
				<p>비어있지 않음: {operations.isNotEmpty ? '예' : '아니오'}</p>
			</div>

			<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
				<button onClick={() => operations.set('name', 'Jane')}>이름을 Jane으로 변경</button>
				<button onClick={() => operations.set('age', 25)}>나이를 25로 변경</button>
				<button onClick={() => operations.toggle('isActive')}>활성 상태 토글</button>
				<button onClick={() => operations.set('email', 'jane@example.com')}>이메일 추가</button>
				<button onClick={() => operations.remove('email')}>이메일 제거</button>
				<button onClick={() => operations.clear()}>모든 속성 제거</button>
			</div>
		</div>
	);
};

const basicCode = `
const [object, operations] = useObject<User>({
	initialValue: { name: 'John', age: 30, isActive: true }
});

// 속성 설정
operations.set('name', 'Jane');

// 속성 제거
operations.remove('email');

// 불린 속성 토글
operations.toggle('isActive');

// 모든 속성 제거
operations.clear();
`;

// 여러 속성 동시 설정
const MultipleProperties = () => {
	const [object, operations] = useObject<User>();

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>여러 속성 동시 설정</h3>
			<p>setMultiple을 사용하여 여러 속성을 한 번에 설정할 수 있습니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<h4>현재 객체 상태</h4>
				<pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
					{JSON.stringify(object, null, 2)}
				</pre>
			</div>

			<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
				<button onClick={() => operations.setMultiple({ name: 'Alice', age: 28, isActive: true })}>
					사용자 정보 설정
				</button>
				<button
					onClick={() =>
						operations.setMultiple({
							email: 'alice@example.com',
							preferences: { theme: 'dark', language: 'ko' },
						})
					}
				>
					추가 정보 설정
				</button>
				<button onClick={() => operations.removeMultiple(['email', 'preferences'])}>
					추가 정보 제거
				</button>
			</div>
		</div>
	);
};

const multiplePropertiesCode = `
// 여러 속성 동시 설정
operations.setMultiple({ 
	name: 'Alice', 
	age: 28, 
	isActive: true 
});

// 여러 속성 동시 제거
operations.removeMultiple(['email', 'preferences']);
`;

// 함수를 사용한 업데이트
const FunctionUpdates = () => {
	const [object, operations] = useObject<User>({
		initialValue: { name: 'Bob', age: 35, isActive: false },
	});

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>함수를 사용한 업데이트</h3>
			<p>update와 updateMultiple을 사용하여 함수로 속성을 업데이트할 수 있습니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<h4>현재 객체 상태</h4>
				<pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
					{JSON.stringify(object, null, 2)}
				</pre>
			</div>

			<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
				<button onClick={() => operations.update('age', (age) => (age as number) + 1)}>
					나이 +1
				</button>
				<button onClick={() => operations.update('name', (name) => (name as string).toUpperCase())}>
					이름 대문자로
				</button>
				<button
					onClick={() =>
						operations.updateMultiple({
							age: (age) => age - 1,
							name: (name) => name.toLowerCase(),
						})
					}
				>
					여러 속성 업데이트
				</button>
			</div>
		</div>
	);
};

const functionUpdatesCode = `
// 함수를 사용한 단일 속성 업데이트
operations.update('age', (age) => age + 1);

// 함수를 사용한 여러 속성 업데이트
operations.updateMultiple({
	age: (age) => age - 1,
	name: (name) => name.toLowerCase(),
});
`;

// 객체 병합 및 교체
const MergeAndReplace = () => {
	const [object, operations] = useObject<User>({
		initialValue: { name: 'Charlie', age: 40, isActive: true },
	});

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>객체 병합 및 교체</h3>
			<p>merge와 replace를 사용하여 객체를 병합하거나 교체할 수 있습니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<h4>현재 객체 상태</h4>
				<pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
					{JSON.stringify(object, null, 2)}
				</pre>
			</div>

			<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
				<button onClick={() => operations.merge({ age: 41, email: 'charlie@example.com' })}>
					객체 병합
				</button>
				<button onClick={() => operations.replace({ name: 'David', age: 25, isActive: false })}>
					객체 교체
				</button>
			</div>
		</div>
	);
};

const mergeAndReplaceCode = `
// 객체 병합
operations.merge({ 
	age: 41, 
	email: 'charlie@example.com' 
});

// 객체 교체
operations.replace({ 
	name: 'David', 
	age: 25, 
	isActive: false 
});
`;

// 객체 조회 및 필터링
const QueryAndFilter = () => {
	const [object, operations] = useObject<User>({
		initialValue: {
			name: 'Emma',
			age: 32,
			isActive: true,
			email: 'emma@example.com',
			preferences: { theme: 'light', language: 'en' },
		},
	});

	const [queryResult, setQueryResult] = useState<any>(null);

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>객체 조회 및 필터링</h3>
			<p>다양한 조회 및 필터링 메서드를 사용할 수 있습니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<h4>현재 객체 상태</h4>
				<pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
					{JSON.stringify(object, null, 2)}
				</pre>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>조회 결과</h4>
				<pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
					{JSON.stringify(queryResult, null, 2)}
				</pre>
			</div>

			<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
				<button onClick={() => setQueryResult({ keys: operations.keys() })}>모든 키 조회</button>
				<button onClick={() => setQueryResult({ values: operations.values() })}>
					모든 값 조회
				</button>
				<button onClick={() => setQueryResult({ entries: operations.entries() })}>
					모든 엔트리 조회
				</button>
				<button onClick={() => setQueryResult({ picked: operations.pick(['name', 'age']) })}>
					특정 속성 선택
				</button>
				<button onClick={() => setQueryResult({ omitted: operations.omit(['preferences']) })}>
					특정 속성 제외
				</button>
				<button
					onClick={() =>
						setQueryResult({
							filtered: operations.filter((value, key) => typeof value === 'string'),
						})
					}
				>
					문자열 값만 필터링
				</button>
				<button
					onClick={() =>
						setQueryResult({
							mapped: operations.map((value, key) =>
								typeof value === 'string' ? value.toUpperCase() : value,
							),
						})
					}
				>
					문자열 값 대문자로 변환
				</button>
			</div>
		</div>
	);
};

const queryAndFilterCode = `
// 모든 키 조회
const keys = operations.keys();

// 모든 값 조회
const values = operations.values();

// 특정 속성 선택
const picked = operations.pick(['name', 'age']);

// 특정 속성 제외
const omitted = operations.omit(['preferences']);

// 조건에 맞는 속성 필터링
const filtered = operations.filter((value, key) => typeof value === 'string');

// 값 변환
const mapped = operations.map((value, key) => 
	typeof value === 'string' ? value.toUpperCase() : value
);
`;

// 객체 변환
const Transform = () => {
	const [object, operations] = useObject<User>({
		initialValue: { name: 'Frank', age: 45, isActive: true },
	});

	const [transformed, setTransformed] = useState<any>(null);

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>객체 변환</h3>
			<p>transform 메서드를 사용하여 객체를 다른 형태로 변환할 수 있습니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<h4>원본 객체</h4>
				<pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
					{JSON.stringify(object, null, 2)}
				</pre>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>변환 결과</h4>
				<pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
					{JSON.stringify(transformed, null, 2)}
				</pre>
			</div>

			<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
				<button
					onClick={() =>
						setTransformed(
							operations.transform((obj) => ({
								displayName: obj.name.toUpperCase(),
								ageGroup: obj.age < 30 ? 'young' : obj.age < 50 ? 'middle' : 'senior',
								status: obj.isActive ? 'active' : 'inactive',
							})),
						)
					}
				>
					사용자 정보 변환
				</button>
				<button onClick={() => setTransformed(operations.transform((obj) => Object.entries(obj)))}>
					엔트리 배열로 변환
				</button>
				<button
					onClick={() =>
						setTransformed(
							operations.transform((obj) => ({
								...obj,
								name: obj.name + ' (Modified)',
								age: obj.age + 5,
							})),
						)
					}
				>
					속성 값 수정
				</button>
			</div>
		</div>
	);
};

const transformCode = `
// 객체를 다른 형태로 변환
const transformed = operations.transform((obj) => ({
	displayName: obj.name.toUpperCase(),
	ageGroup: obj.age < 30 ? 'young' : obj.age < 50 ? 'middle' : 'senior',
	status: obj.isActive ? 'active' : 'inactive',
}));

// 엔트리 배열로 변환
const entries = operations.transform((obj) => Object.entries(obj));
`;

// 디버그 모드
const DebugMode = () => {
	const [object, operations] = useObject<User>({
		initialValue: { name: 'Grace', age: 29, isActive: false },
		debug: true,
	});

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>디버그 모드</h3>
			<p>debug 옵션을 활성화하면 콘솔에 모든 작업이 로그됩니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<h4>현재 객체 상태</h4>
				<pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
					{JSON.stringify(object, null, 2)}
				</pre>
			</div>

			<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
				<button onClick={() => operations.set('name', 'Hannah')}>이름 변경 (로그 확인)</button>
				<button onClick={() => operations.setMultiple({ age: 30, isActive: true })}>
					여러 속성 변경 (로그 확인)
				</button>
				<button onClick={() => operations.update('age', (age) => (age as number) + 1)}>
					나이 증가 (로그 확인)
				</button>
			</div>

			<p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
				💡 브라우저 개발자 도구의 콘솔을 열어서 로그를 확인해보세요!
			</p>
		</div>
	);
};

const debugModeCode = `
const [object, operations] = useObject<User>({
	initialValue: { name: 'Grace', age: 29, isActive: false },
	debug: true, // 디버그 모드 활성화
});

// 모든 작업이 콘솔에 로그됩니다
operations.set('name', 'Hannah');
operations.setMultiple({ age: 30, isActive: true });
`;

// Toggle 기능 스토리
const ToggleExampleComponent = () => {
	const [object, operations] = useObject<User>({
		initialValue: { name: 'John', age: 30, isActive: false },
	});

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>Toggle 기능</h3>
			<p>불린 속성을 쉽게 토글할 수 있습니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<h4>현재 객체 상태</h4>
				<pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
					{JSON.stringify(object, null, 2)}
				</pre>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>Toggle 예제</h4>
				<p>
					<strong>활성 상태:</strong> {object.isActive ? '✅ 활성' : '❌ 비활성'}
				</p>
				<button onClick={() => operations.toggle('isActive')}>활성 상태 토글</button>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>다른 타입 토글 시도</h4>
				<p>불린이 아닌 속성을 토글하면 아무 일도 일어나지 않습니다.</p>
				<button onClick={() => operations.toggle('name')}>이름 토글 (무시됨)</button>
				<button onClick={() => operations.toggle('age')}>나이 토글 (무시됨)</button>
			</div>
		</div>
	);
};

const toggleCode = `
const [object, operations] = useObject<User>({
	initialValue: { name: 'John', age: 30, isActive: false }
});

// 불린 속성 토글
operations.toggle('isActive');

// 불린이 아닌 속성은 무시됨
operations.toggle('name'); // 아무 일도 일어나지 않음
`;

// Remove 기능 스토리
const RemoveExampleComponent = () => {
	const [object, operations] = useObject<User>({
		initialValue: { name: 'John', age: 30, isActive: true, email: 'john@example.com' },
	});

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>Remove 기능</h3>
			<p>개별 속성 제거와 여러 속성 동시 제거를 보여줍니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<h4>현재 객체 상태</h4>
				<pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
					{JSON.stringify(object, null, 2)}
				</pre>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>개별 속성 제거</h4>
				<button onClick={() => operations.remove('email')}>이메일 제거</button>
				<button onClick={() => operations.remove('age')}>나이 제거</button>
				<button onClick={() => operations.remove('isActive')}>활성 상태 제거</button>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>여러 속성 동시 제거</h4>
				<button onClick={() => operations.removeMultiple(['email', 'age'])}>
					이메일과 나이 제거
				</button>
				<button onClick={() => operations.removeMultiple(['name', 'isActive'])}>
					이름과 활성 상태 제거
				</button>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>존재하지 않는 속성 제거</h4>
				<button onClick={() => operations.remove('nonexistent' as keyof User)}>
					존재하지 않는 속성 제거 (안전함)
				</button>
			</div>
		</div>
	);
};

const removeCode = `
const [object, operations] = useObject<User>({
	initialValue: { name: 'John', age: 30, isActive: true, email: 'john@example.com' }
});

// 개별 속성 제거
operations.remove('email');

// 여러 속성 동시 제거
operations.removeMultiple(['email', 'age']);

// 존재하지 않는 속성은 안전하게 무시됨
operations.remove('nonexistent');
`;

// Clear 기능 스토리
const ClearExampleComponent = () => {
	const [object, operations] = useObject<User>({
		initialValue: { name: 'John', age: 30, isActive: true, email: 'john@example.com' },
	});

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>Clear 기능</h3>
			<p>모든 속성을 한 번에 제거합니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<h4>현재 객체 상태</h4>
				<pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
					{JSON.stringify(object, null, 2)}
				</pre>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>객체 정보</h4>
				<p>크기: {operations.size}</p>
				<p>비어있음: {operations.isEmpty ? '예' : '아니오'}</p>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>Clear 작업</h4>
				<button onClick={() => operations.clear()}>모든 속성 제거</button>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>Clear 후 상태</h4>
				<p>크기: {operations.size}</p>
				<p>비어있음: {operations.isEmpty ? '예' : '아니오'}</p>
			</div>
		</div>
	);
};

const clearCode = `
const [object, operations] = useObject<User>({
	initialValue: { name: 'John', age: 30, isActive: true, email: 'john@example.com' }
});

// 모든 속성 제거
operations.clear();

// 결과: {}
`;

// Pick/Omit 기능 스토리
const PickOmitExampleComponent = () => {
	const [object, operations] = useObject<User>({
		initialValue: { name: 'John', age: 30, isActive: true, email: 'john@example.com' },
	});

	const [pickedResult, setPickedResult] = useState<Partial<User>>({});
	const [omittedResult, setOmittedResult] = useState<Partial<User>>({});

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>Pick & Omit 기능</h3>
			<p>특정 속성만 선택하거나 제외하는 기능을 보여줍니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<h4>현재 객체 상태</h4>
				<pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
					{JSON.stringify(object, null, 2)}
				</pre>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>Pick 기능 (특정 속성만 선택)</h4>
				<button onClick={() => setPickedResult(operations.pick(['name', 'age']))}>
					이름과 나이만 선택
				</button>
				<button onClick={() => setPickedResult(operations.pick(['isActive', 'email']))}>
					활성 상태와 이메일만 선택
				</button>
				<button onClick={() => setPickedResult(operations.pick([]))}>
					빈 배열로 선택 (빈 객체 반환)
				</button>
			</div>

			{pickedResult && Object.keys(pickedResult).length > 0 && (
				<div style={{ marginBottom: '20px' }}>
					<h4>Pick 결과</h4>
					<pre style={{ background: '#e8f5e8', padding: '10px', borderRadius: '4px' }}>
						{JSON.stringify(pickedResult, null, 2)}
					</pre>
				</div>
			)}

			<div style={{ marginBottom: '20px' }}>
				<h4>Omit 기능 (특정 속성 제외)</h4>
				<button onClick={() => setOmittedResult(operations.omit(['email', 'age']))}>
					이메일과 나이 제외
				</button>
				<button onClick={() => setOmittedResult(operations.omit(['name', 'isActive']))}>
					이름과 활성 상태 제외
				</button>
				<button onClick={() => setOmittedResult(operations.omit([]))}>
					빈 배열로 제외 (전체 객체 반환)
				</button>
			</div>

			{omittedResult && Object.keys(omittedResult).length > 0 && (
				<div style={{ marginBottom: '20px' }}>
					<h4>Omit 결과</h4>
					<pre style={{ background: '#fff3cd', padding: '10px', borderRadius: '4px' }}>
						{JSON.stringify(omittedResult, null, 2)}
					</pre>
				</div>
			)}
		</div>
	);
};

const pickOmitCode = `
const [object, operations] = useObject<User>({
	initialValue: { name: 'John', age: 30, isActive: true, email: 'john@example.com' }
});

// 특정 속성만 선택
const picked = operations.pick(['name', 'age']);
// 결과: { name: 'John', age: 30 }

// 특정 속성 제외
const omitted = operations.omit(['email', 'age']);
// 결과: { name: 'John', isActive: true }
`;

// Map 기능 스토리
const MapExampleComponent = () => {
	const [object, operations] = useObject<User>({
		initialValue: { name: 'John', age: 30, isActive: true, email: 'john@example.com' },
	});

	const [mappedResult, setMappedResult] = useState<Record<string, any>>({});

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>Map 기능</h3>
			<p>객체의 모든 값을 변환하는 기능을 보여줍니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<h4>현재 객체 상태</h4>
				<pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
					{JSON.stringify(object, null, 2)}
				</pre>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>Map 변환 예제</h4>
				<button
					onClick={() =>
						setMappedResult(
							operations.map((value, key) => {
								if (typeof value === 'string') return value.toUpperCase();
								if (typeof value === 'number') return value * 2;
								return value;
							}),
						)
					}
				>
					문자열은 대문자로, 숫자는 2배로 변환
				</button>
				<button
					onClick={() =>
						setMappedResult(
							operations.map((value, key) => {
								if (typeof value === 'string') return value.length;
								if (typeof value === 'number') return value.toString();
								return value;
							}),
						)
					}
				>
					문자열은 길이로, 숫자는 문자열로 변환
				</button>
				<button
					onClick={() =>
						setMappedResult(
							operations.map((value, key) => ({
								value,
								type: typeof value,
								key,
							})),
						)
					}
				>
					값, 타입, 키 정보로 변환
				</button>
			</div>

			{mappedResult && Object.keys(mappedResult).length > 0 && (
				<div style={{ marginBottom: '20px' }}>
					<h4>Map 결과</h4>
					<pre style={{ background: '#e3f2fd', padding: '10px', borderRadius: '4px' }}>
						{JSON.stringify(mappedResult, null, 2)}
					</pre>
				</div>
			)}
		</div>
	);
};

const mapCode = `
const [object, operations] = useObject<User>({
	initialValue: { name: 'John', age: 30, isActive: true, email: 'john@example.com' }
});

// 모든 값을 변환
const mapped = operations.map((value, key) => {
	if (typeof value === 'string') return value.toUpperCase();
	if (typeof value === 'number') return value * 2;
	return value;
});

// 결과: { name: 'JOHN', age: 60, isActive: true, email: 'JOHN@EXAMPLE.COM' }
`;

// Edge Cases 스토리
const EdgeCasesExampleComponent = () => {
	const [object, operations] = useObject<User>({
		initialValue: { name: 'John', age: 30, isActive: true, email: 'john@example.com' },
	});

	const [results, setResults] = useState<string[]>([]);

	const addResult = (message: string) => {
		setResults((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
	};

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>Edge Cases</h3>
			<p>다양한 엣지 케이스들을 테스트합니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<h4>현재 객체 상태</h4>
				<pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
					{JSON.stringify(object, null, 2)}
				</pre>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>엣지 케이스 테스트</h4>
				<button
					onClick={() => {
						operations.removeMultiple([]);
						addResult('빈 배열로 removeMultiple 실행');
					}}
				>
					빈 배열로 removeMultiple
				</button>
				<button
					onClick={() => {
						operations.updateMultiple({});
						addResult('빈 객체로 updateMultiple 실행');
					}}
				>
					빈 객체로 updateMultiple
				</button>
				<button
					onClick={() => {
						operations.toggle('email');
						addResult('undefined 값으로 toggle 실행');
					}}
				>
					undefined 값으로 toggle
				</button>
				<button
					onClick={() => {
						operations.merge({});
						addResult('빈 객체로 merge 실행');
					}}
				>
					빈 객체로 merge
				</button>
				<button
					onClick={() => {
						const picked = operations.pick([]);
						addResult(`빈 배열로 pick 실행: ${JSON.stringify(picked)}`);
					}}
				>
					빈 배열로 pick
				</button>
				<button
					onClick={() => {
						const omitted = operations.omit([]);
						addResult(`빈 배열로 omit 실행: ${JSON.stringify(omitted)}`);
					}}
				>
					빈 배열로 omit
				</button>
			</div>

			{results.length > 0 && (
				<div style={{ marginBottom: '20px' }}>
					<h4>실행 결과</h4>
					<div
						style={{
							background: '#f8f9fa',
							padding: '10px',
							borderRadius: '4px',
							maxHeight: '200px',
							overflowY: 'auto',
						}}
					>
						{results.map((result, index) => (
							<div key={index} style={{ fontSize: '12px', marginBottom: '5px' }}>
								{result}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

const edgeCasesCode = `
const [object, operations] = useObject<User>({
	initialValue: { name: 'John', age: 30, isActive: true, email: 'john@example.com' }
});

// 다양한 엣지 케이스들
operations.removeMultiple([]); // 빈 배열
operations.updateMultiple({}); // 빈 객체
operations.toggle('email'); // undefined 값
operations.merge({}); // 빈 객체
operations.pick([]); // 빈 배열
operations.omit([]); // 빈 배열

// 모든 경우에 안전하게 처리됨
`;

export const Basic = () => (
	<ToggleComponent
		title='기본 사용법'
		code={basicCode}
		description='useObject 훅의 기본적인 사용법을 보여줍니다.'
	>
		<BasicUsage />
	</ToggleComponent>
);

export const MultiplePropertiesExample = () => (
	<ToggleComponent
		title='여러 속성 동시 설정'
		code={multiplePropertiesCode}
		description='여러 속성을 동시에 설정하고 제거하는 방법을 보여줍니다.'
	>
		<MultipleProperties />
	</ToggleComponent>
);

export const FunctionUpdatesExample = () => (
	<ToggleComponent
		title='함수 업데이트'
		code={functionUpdatesCode}
		description='함수를 사용하여 속성을 업데이트하는 방법을 보여줍니다.'
	>
		<FunctionUpdates />
	</ToggleComponent>
);

export const MergeAndReplaceExample = () => (
	<ToggleComponent
		title='병합 및 교체'
		code={mergeAndReplaceCode}
		description='객체를 병합하거나 교체하는 방법을 보여줍니다.'
	>
		<MergeAndReplace />
	</ToggleComponent>
);

export const QueryAndFilterExample = () => (
	<ToggleComponent
		title='조회 및 필터링'
		code={queryAndFilterCode}
		description='객체를 조회하고 필터링하는 다양한 메서드를 보여줍니다.'
	>
		<QueryAndFilter />
	</ToggleComponent>
);

export const TransformExample = () => (
	<ToggleComponent
		title='객체 변환'
		code={transformCode}
		description='객체를 다른 형태로 변환하는 방법을 보여줍니다.'
	>
		<Transform />
	</ToggleComponent>
);

export const DebugModeExample = () => (
	<ToggleComponent
		title='디버그 모드'
		code={debugModeCode}
		description='디버그 모드를 활성화하여 모든 작업을 로그로 확인하는 방법을 보여줍니다.'
	>
		<DebugMode />
	</ToggleComponent>
);

export const ToggleExample = () => (
	<ToggleComponent
		title='Toggle 기능'
		code={toggleCode}
		description='불린 속성을 쉽게 토글할 수 있는 기능을 보여줍니다.'
	>
		<ToggleExampleComponent />
	</ToggleComponent>
);

export const RemoveExample = () => (
	<ToggleComponent
		title='Remove 기능'
		code={removeCode}
		description='개별 속성 제거와 여러 속성 동시 제거 기능을 보여줍니다.'
	>
		<RemoveExampleComponent />
	</ToggleComponent>
);

export const ClearExample = () => (
	<ToggleComponent
		title='Clear 기능'
		code={clearCode}
		description='모든 속성을 한 번에 제거하는 기능을 보여줍니다.'
	>
		<ClearExampleComponent />
	</ToggleComponent>
);

export const PickOmitExample = () => (
	<ToggleComponent
		title='Pick & Omit 기능'
		code={pickOmitCode}
		description='특정 속성만 선택하거나 제외하는 기능을 보여줍니다.'
	>
		<PickOmitExampleComponent />
	</ToggleComponent>
);

export const MapExample = () => (
	<ToggleComponent
		title='Map 기능'
		code={mapCode}
		description='객체의 모든 값을 변환하는 기능을 보여줍니다.'
	>
		<MapExampleComponent />
	</ToggleComponent>
);

export const EdgeCasesExample = () => (
	<ToggleComponent
		title='Edge Cases'
		code={edgeCasesCode}
		description='다양한 엣지 케이스들을 테스트하여 안전성을 보여줍니다.'
	>
		<EdgeCasesExampleComponent />
	</ToggleComponent>
);

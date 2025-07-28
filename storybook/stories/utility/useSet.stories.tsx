import { useSet } from '@/utility/useSet';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'Utility/useSet',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
A React hook that provides declarative Set state management with comprehensive Set manipulation methods. Simplifies Set operations like adding, removing, querying, and performing set operations while maintaining immutability and performance.

### API

#### Parameters
- **options**: UseSetOptions<T> (optional) - Configuration options for Set management
- **options.initialValue**: T[] (optional, default: []) - Initial Set values
- **options.debug**: boolean (optional, default: false) - Enable debug logging
- **Usage Example**: useSet<string>({ initialValue: ['apple', 'banana'], debug: true });

#### Return Value
- **Type**: [Set<T>, SetOperations<T>]
- **Description**: Returns current Set and operations object
- **Usage Example**: const [set, operations] = useSet<string>({ initialValue: ['apple'] });

#### Return Value Properties

| Property | Type | Description |
|----------|------|-------------|
| set | Set<T> | Current Set value |
| operations | SetOperations<T> | Object containing all Set manipulation methods |

#### SetOperations Methods

**Basic Operations:**
- **add**: (value: T) => void - Add a value to Set (ignores if already exists)
- **delete**: (value: T) => void - Remove a value from Set (ignores if doesn't exist)
- **clear**: () => void - Remove all values from Set
- **has**: (value: T) => boolean - Check if value exists in Set

**Convenience Methods:**
- **toggle**: (value: T) => void - Toggle value (remove if exists, add if not)
- **addMultiple**: (values: T[]) => void - Add multiple values at once (ignores duplicates)
- **deleteMultiple**: (values: T[]) => void - Remove multiple values at once

**Query Methods:**
- **size**: number - Set size (number of values) - memoized
- **isEmpty**: boolean - Is Set empty - memoized
- **values**: T[] - All values as array - memoized

**Set Operations:**
- **union**: (otherSet: Set<T>) => void - Union with another Set
- **intersection**: (otherSet: Set<T>) => void - Intersection with another Set
- **difference**: (otherSet: Set<T>) => void - Difference with another Set
- **symmetricDifference**: (otherSet: Set<T>) => void - Symmetric difference with another Set

**Transformation Methods:**
- **filter**: (predicate: (value: T) => boolean) => T[] - Filter values based on predicate
- **map**: <U>(mapper: (value: T) => U) => U[] - Transform values using mapper function

**Debug:**
- **debug**: boolean - Debug mode flag

### Usage Examples

\`\`\`tsx
// Basic Set operations
const [set, operations] = useSet<string>({ 
  initialValue: ['apple', 'banana'] 
});

const handleAdd = () => operations.add('orange');
const handleDelete = () => operations.delete('apple');
const handleClear = () => operations.clear();
const checkHas = () => alert('apple이 있나요? ' + operations.has('apple'));

return (
  <div>
    <p>Set: {JSON.stringify(Array.from(set))}</p>
    <button onClick={handleAdd}>추가</button>
    <button onClick={handleDelete}>제거</button>
    <button onClick={handleClear}>초기화</button>
    <button onClick={checkHas}>확인</button>
  </div>
);

// Convenience methods
const [set, operations] = useSet<string>();

const handleToggle = () => operations.toggle('apple');
const handleAddMultiple = () => operations.addMultiple(['apple', 'banana', 'orange']);
const handleDeleteMultiple = () => operations.deleteMultiple(['apple', 'banana']);

return (
  <div>
    <p>Set: {JSON.stringify(Array.from(set))}</p>
    <button onClick={handleToggle}>토글</button>
    <button onClick={handleAddMultiple}>여러 개 추가</button>
    <button onClick={handleDeleteMultiple}>여러 개 제거</button>
  </div>
);

// Query methods
const [set, operations] = useSet<string>({ 
  initialValue: ['apple', 'banana', 'orange'] 
});

return (
  <div>
    <p>Set: {JSON.stringify(Array.from(set))}</p>
    <p>크기: {operations.size}</p>
    <p>비어있나요? {operations.isEmpty ? '예' : '아니오'}</p>
    <p>값들: {JSON.stringify(operations.values)}</p>
  </div>
);

// Set operations
const [set, operations] = useSet<string>({ 
  initialValue: ['apple', 'banana'] 
});

const otherSet = new Set(['banana', 'orange']);

const handleUnion = () => operations.union(otherSet);
const handleIntersection = () => operations.intersection(otherSet);
const handleDifference = () => operations.difference(otherSet);
const handleSymmetricDifference = () => operations.symmetricDifference(otherSet);

return (
  <div>
    <p>현재 Set: {JSON.stringify(Array.from(set))}</p>
    <p>다른 Set: {JSON.stringify(Array.from(otherSet))}</p>
    <button onClick={handleUnion}>합집합</button>
    <button onClick={handleIntersection}>교집합</button>
    <button onClick={handleDifference}>차집합</button>
    <button onClick={handleSymmetricDifference}>대칭차집합</button>
  </div>
);

// Transformation methods
const [set, operations] = useSet<string>({ 
  initialValue: ['apple', 'banana', 'orange', 'grape'] 
});

const handleFilter = () => {
  const filtered = operations.filter(value => value.length > 5);
  alert('5글자보다 긴 값들: ' + JSON.stringify(filtered));
};

const handleMap = () => {
  const mapped = operations.map(value => value.toUpperCase());
  alert('대문자로 변환: ' + JSON.stringify(mapped));
};

return (
  <div>
    <p>Set: {JSON.stringify(Array.from(set))}</p>
    <button onClick={handleFilter}>필터링</button>
    <button onClick={handleMap}>변환</button>
  </div>
);

// Complex object Set
interface User {
  id: number;
  name: string;
  age: number;
}

const [set, operations] = useSet<User>({
  initialValue: [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 }
  ]
});

const handleAddUser = () => {
  operations.add({ id: 3, name: 'Charlie', age: 35 });
};

const handleDeleteUser = () => {
  const aliceUser = operations.values.find(user => user.name === 'Alice');
  if (aliceUser) {
    operations.delete(aliceUser);
  }
};

const handleCheckUser = () => {
  const bobUser = operations.values.find(user => user.name === 'Bob');
  if (bobUser) {
    alert('Bob이 있나요? ' + operations.has(bobUser));
  } else {
    alert('Bob이 없습니다.');
  }
};

return (
  <div>
    <p>사용자 Set:</p>
    <ul>
      {Array.from(set).map(user => (
        <li key={user.id}>{user.name} ({user.age}세)</li>
      ))}
    </ul>
    <button onClick={handleAddUser}>사용자 추가</button>
    <button onClick={handleDeleteUser}>Alice 제거</button>
    <button onClick={handleCheckUser}>Bob 확인</button>
  </div>
);

// Debug mode
const [set, operations] = useSet<string>({ debug: true });

const handleAdd = () => operations.add('apple');
const handleDelete = () => operations.delete('banana');

return (
  <div>
    <p>Set: {JSON.stringify(Array.from(set))}</p>
    <p>콘솔을 확인하여 디버그 로그를 보세요!</p>
    <button onClick={handleAdd}>추가 (로그 출력)</button>
    <button onClick={handleDelete}>제거 (로그 출력)</button>
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
	tags: ['utility', 'set', 'data-structure', 'state-management', 'autodocs'],
};

const basicCode = `const [set, { add, delete: deleteValue, clear, has }] = useSet<string>({
  initialValue: ['apple', 'banana']
});

const handleAdd = () => add('orange');
const handleDelete = () => deleteValue('apple');
const handleClear = () => clear();
const checkHas = () => alert('apple이 있나요? ' + has('apple'));

return (
  <div>
    <p>Set: {JSON.stringify(Array.from(set))}</p>
    <button onClick={handleAdd}>추가</button>
    <button onClick={handleDelete}>제거</button>
    <button onClick={handleClear}>초기화</button>
    <button onClick={checkHas}>확인</button>
  </div>
);`;

const convenienceMethodsCode = `const [set, { toggle, addMultiple, deleteMultiple }] = useSet<string>();

const handleToggle = () => toggle('apple');
const handleAddMultiple = () => addMultiple(['apple', 'banana', 'orange']);
const handleDeleteMultiple = () => deleteMultiple(['apple', 'banana']);

return (
  <div>
    <p>Set: {JSON.stringify(Array.from(set))}</p>
    <button onClick={handleToggle}>토글</button>
    <button onClick={handleAddMultiple}>여러 개 추가</button>
    <button onClick={handleDeleteMultiple}>여러 개 제거</button>
  </div>
);`;

const queryMethodsCode = `const [set, operations] = useSet<string>({
  initialValue: ['apple', 'banana', 'orange']
});

return (
  <div>
    <p>Set: {JSON.stringify(Array.from(set))}</p>
    <p>크기: {operations.size}</p>
    <p>비어있나요? {operations.isEmpty ? '예' : '아니오'}</p>
    <p>값들: {JSON.stringify(operations.values)}</p>
  </div>
);`;

const setOperationsCode = `const [set, { union, intersection, difference, symmetricDifference }] = useSet<string>({
  initialValue: ['apple', 'banana']
});

const otherSet = new Set(['banana', 'orange']);

const handleUnion = () => union(otherSet);
const handleIntersection = () => intersection(otherSet);
const handleDifference = () => difference(otherSet);
const handleSymmetricDifference = () => symmetricDifference(otherSet);

return (
  <div>
    <p>현재 Set: {JSON.stringify(Array.from(set))}</p>
    <p>다른 Set: {JSON.stringify(Array.from(otherSet))}</p>
    <button onClick={handleUnion}>합집합</button>
    <button onClick={handleIntersection}>교집합</button>
    <button onClick={handleDifference}>차집합</button>
    <button onClick={handleSymmetricDifference}>대칭차집합</button>
  </div>
);`;

const filterMapCode = `const [set, { filter, map }] = useSet<string>({
  initialValue: ['apple', 'banana', 'orange', 'grape']
});

const handleFilter = () => {
  const filtered = filter(value => value.length > 5);
  alert('5글자보다 긴 값들: ' + JSON.stringify(filtered));
};

const handleMap = () => {
  const mapped = map(value => value.toUpperCase());
  alert('대문자로 변환: ' + JSON.stringify(mapped));
};

return (
  <div>
    <p>Set: {JSON.stringify(Array.from(set))}</p>
    <button onClick={handleFilter}>필터링</button>
    <button onClick={handleMap}>변환</button>
  </div>
);`;

const complexObjectsCode = `interface User {
  id: number;
  name: string;
  age: number;
}

const [set, { add, delete: deleteValue, has, values }] = useSet<User>({
  initialValue: [
    { id: 1, name: 'Alice', age: 25 },
    { id: 2, name: 'Bob', age: 30 }
  ]
});

const handleAddUser = () => {
  add({ id: 3, name: 'Charlie', age: 35 });
};

const handleDeleteUser = () => {
  // Set에서 실제로 존재하는 Alice 객체를 찾아서 제거
  const aliceUser = values.find(user => user.name === 'Alice');
  if (aliceUser) {
    deleteValue(aliceUser);
  }
};

const handleCheckUser = () => {
  // Set에서 실제로 존재하는 Bob 객체를 찾아서 확인
  const bobUser = values.find(user => user.name === 'Bob');
  if (bobUser) {
    alert('Bob이 있나요? ' + has(bobUser));
  } else {
    alert('Bob이 없습니다.');
  }
};

return (
  <div>
    <p>사용자 Set:</p>
    <ul>
      {Array.from(set).map(user => (
        <li key={user.id}>{user.name} ({user.age}세)</li>
      ))}
    </ul>
    <button onClick={handleAddUser}>사용자 추가</button>
    <button onClick={handleDeleteUser}>Alice 제거</button>
    <button onClick={handleCheckUser}>Bob 확인</button>
  </div>
);`;

const debugModeCode = `const [set, { add, delete: deleteValue }] = useSet<string>({
  initialValue: ['apple'],
  debug: true
});

const handleAdd = () => add('banana');
const handleDelete = () => deleteValue('apple');

return (
  <div>
    <p>Set: {JSON.stringify(Array.from(set))}</p>
    <p>콘솔을 열어서 로그를 확인하세요!</p>
    <button onClick={handleAdd}>추가 (로그 출력)</button>
    <button onClick={handleDelete}>제거 (로그 출력)</button>
  </div>
);`;

const edgeCasesCode = `const [set, { add, has, size }] = useSet<any>();

const handleAddNull = () => add(null);
const handleAddUndefined = () => add(undefined);
const handleAddEmptyString = () => add('');
const handleAddNaN = () => add(NaN);
const handleAddInfinity = () => add(Infinity);

const handleCheckNull = () => alert('null이 있나요? ' + has(null));
const handleCheckUndefined = () => alert('undefined가 있나요? ' + has(undefined));

return (
  <div>
    <p>Set: {JSON.stringify(Array.from(set))}</p>
    <p>크기: {size}</p>
    <button onClick={handleAddNull}>null 추가</button>
    <button onClick={handleAddUndefined}>undefined 추가</button>
    <button onClick={handleAddEmptyString}>빈 문자열 추가</button>
    <button onClick={handleAddNaN}>NaN 추가</button>
    <button onClick={handleAddInfinity}>Infinity 추가</button>
    <button onClick={handleCheckNull}>null 확인</button>
    <button onClick={handleCheckUndefined}>undefined 확인</button>
  </div>
);`;

const comprehensiveExampleCode = `const [set, operations] = useSet<string>({
  initialValue: ['apple', 'banana']
});

const handleComplexOperations = () => {
  // 여러 연속 작업 수행
  operations.add('orange');
  operations.toggle('grape');
  operations.addMultiple(['mango', 'pineapple']);
  operations.delete('banana');
};

const handleReset = () => {
  operations.clear();
  operations.addMultiple(['apple', 'banana']);
};

return (
  <div>
    <p>Set: {JSON.stringify(Array.from(set))}</p>
    <p>크기: {operations.size}</p>
    <p>비어있나요? {operations.isEmpty ? '예' : '아니오'}</p>
    <button onClick={handleComplexOperations}>복합 작업 실행</button>
    <button onClick={handleReset}>초기화</button>
  </div>
);`;

export const Default = () => {
	const [set, { add, delete: deleteValue, clear, has }] = useSet<string>({
		initialValue: ['apple', 'banana'],
	});

	const handleAdd = () => add('orange');
	const handleDelete = () => deleteValue('apple');
	const handleClear = () => clear();
	const checkHas = () => alert('apple이 있나요? ' + has('apple'));

	return (
		<ToggleComponent
			code={basicCode}
			title='기본 사용법'
			description='useSet의 기본적인 사용법을 보여줍니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>기본 사용법</h3>
				<p>useSet의 기본적인 사용법을 보여줍니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
						}}
					>
						<p>
							<strong>현재 Set:</strong> {JSON.stringify(Array.from(set))}
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>기본 조작</h4>
					<div
						style={{
							display: 'flex',
							gap: '10px',
							marginBottom: '15px',
							flexWrap: 'wrap',
						}}
					>
						<button
							onClick={handleAdd}
							style={{
								padding: '10px 15px',
								backgroundColor: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							➕ 추가
						</button>
						<button
							onClick={handleDelete}
							style={{
								padding: '10px 15px',
								backgroundColor: '#dc3545',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							➖ 제거
						</button>
						<button
							onClick={handleClear}
							style={{
								padding: '10px 15px',
								backgroundColor: '#6c757d',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🗑️ 초기화
						</button>
						<button
							onClick={checkHas}
							style={{
								padding: '10px 15px',
								backgroundColor: '#17a2b8',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🔍 확인
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
						<strong>💡 특징:</strong>
					</p>
					<ul>
						<li>중복 값 자동 제거</li>
						<li>값 존재 여부 확인</li>
						<li>전체 Set 초기화</li>
						<li>타입 안전성 보장</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const ConvenienceMethods = () => {
	const [set, { toggle, addMultiple, deleteMultiple }] = useSet<string>();

	const handleToggle = () => toggle('apple');
	const handleAddMultiple = () => addMultiple(['apple', 'banana', 'orange']);
	const handleDeleteMultiple = () => deleteMultiple(['apple', 'banana']);

	return (
		<ToggleComponent
			code={convenienceMethodsCode}
			title='편의 메서드'
			description='useSet의 편의 메서드들을 보여줍니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>편의 메서드</h3>
				<p>useSet의 편의 메서드들을 보여줍니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
						}}
					>
						<p>
							<strong>현재 Set:</strong> {JSON.stringify(Array.from(set))}
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>편의 메서드</h4>
					<div
						style={{
							display: 'flex',
							gap: '10px',
							marginBottom: '15px',
							flexWrap: 'wrap',
						}}
					>
						<button
							onClick={handleToggle}
							style={{
								padding: '10px 15px',
								backgroundColor: '#6f42c1',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🔄 토글
						</button>
						<button
							onClick={handleAddMultiple}
							style={{
								padding: '10px 15px',
								backgroundColor: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							➕ 여러 개 추가
						</button>
						<button
							onClick={handleDeleteMultiple}
							style={{
								padding: '10px 15px',
								backgroundColor: '#dc3545',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							➖ 여러 개 제거
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
						<strong>🔧 편의 메서드:</strong>
					</p>
					<ul>
						<li>
							<code>toggle(value)</code> - 값이 있으면 제거, 없으면 추가
						</li>
						<li>
							<code>addMultiple(values)</code> - 여러 값을 한 번에 추가
						</li>
						<li>
							<code>deleteMultiple(values)</code> - 여러 값을 한 번에 제거
						</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const QueryMethods = () => {
	const [set, operations] = useSet<string>({
		initialValue: ['apple', 'banana', 'orange'],
	});

	return (
		<ToggleComponent
			code={queryMethodsCode}
			title='조회 메서드'
			description='useSet의 조회 메서드들을 보여줍니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>조회 메서드</h3>
				<p>useSet의 조회 메서드들을 보여줍니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
						}}
					>
						<p>
							<strong>현재 Set:</strong> {JSON.stringify(Array.from(set))}
						</p>
						<p>
							<strong>크기:</strong> {operations.size}
						</p>
						<p>
							<strong>비어있나요?</strong> {operations.isEmpty ? '예' : '아니오'}
						</p>
						<p>
							<strong>값들:</strong> {JSON.stringify(operations.values)}
						</p>
					</div>
				</div>

				<div
					style={{
						padding: '15px',
						backgroundColor: '#e2e3e5',
						borderRadius: '4px',
						border: '1px solid #d6d8db',
					}}
				>
					<p>
						<strong>📊 조회 속성:</strong>
					</p>
					<ul>
						<li>
							<code>size</code> - Set의 크기
						</li>
						<li>
							<code>isEmpty</code> - 빈 Set 여부
						</li>
						<li>
							<code>values</code> - 모든 값을 배열로 반환
						</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const SetOperations = () => {
	const [set, { union, intersection, difference, symmetricDifference }] = useSet<string>({
		initialValue: ['apple', 'banana'],
	});

	const otherSet = new Set(['banana', 'orange']);

	const handleUnion = () => union(otherSet);
	const handleIntersection = () => intersection(otherSet);
	const handleDifference = () => difference(otherSet);
	const handleSymmetricDifference = () => symmetricDifference(otherSet);

	return (
		<ToggleComponent
			code={setOperationsCode}
			title='집합 연산'
			description='useSet의 집합 연산 메서드들을 보여줍니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>집합 연산</h3>
				<p>useSet의 집합 연산 메서드들을 보여줍니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
						}}
					>
						<p>
							<strong>현재 Set:</strong> {JSON.stringify(Array.from(set))}
						</p>
						<p>
							<strong>다른 Set:</strong> {JSON.stringify(Array.from(otherSet))}
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>집합 연산</h4>
					<div
						style={{
							display: 'flex',
							gap: '10px',
							marginBottom: '15px',
							flexWrap: 'wrap',
						}}
					>
						<button
							onClick={handleUnion}
							style={{
								padding: '10px 15px',
								backgroundColor: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							∪ 합집합
						</button>
						<button
							onClick={handleIntersection}
							style={{
								padding: '10px 15px',
								backgroundColor: '#17a2b8',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							∩ 교집합
						</button>
						<button
							onClick={handleDifference}
							style={{
								padding: '10px 15px',
								backgroundColor: '#dc3545',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							− 차집합
						</button>
						<button
							onClick={handleSymmetricDifference}
							style={{
								padding: '10px 15px',
								backgroundColor: '#6f42c1',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							⊖ 대칭차집합
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
						<strong>🔢 집합 연산:</strong>
					</p>
					<ul>
						<li>
							<code>union(otherSet)</code> - 두 Set의 합집합
						</li>
						<li>
							<code>intersection(otherSet)</code> - 두 Set의 교집합
						</li>
						<li>
							<code>difference(otherSet)</code> - 두 Set의 차집합
						</li>
						<li>
							<code>symmetricDifference(otherSet)</code> - 두 Set의 대칭차집합
						</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const FilterMap = () => {
	const [set, { filter, map }] = useSet<string>({
		initialValue: ['apple', 'banana', 'orange', 'grape'],
	});

	const handleFilter = () => {
		const filtered = filter((value) => value.length > 5);
		alert('5글자보다 긴 값들: ' + JSON.stringify(filtered));
	};

	const handleMap = () => {
		const mapped = map((value) => value.toUpperCase());
		alert('대문자로 변환: ' + JSON.stringify(mapped));
	};

	return (
		<ToggleComponent
			code={filterMapCode}
			title='필터링 및 변환'
			description='useSet의 필터링 및 변환 메서드들을 보여줍니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>필터링 및 변환</h3>
				<p>useSet의 필터링 및 변환 메서드들을 보여줍니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
						}}
					>
						<p>
							<strong>현재 Set:</strong> {JSON.stringify(Array.from(set))}
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>필터링 및 변환</h4>
					<div
						style={{
							display: 'flex',
							gap: '10px',
							marginBottom: '15px',
							flexWrap: 'wrap',
						}}
					>
						<button
							onClick={handleFilter}
							style={{
								padding: '10px 15px',
								backgroundColor: '#17a2b8',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🔍 필터링
						</button>
						<button
							onClick={handleMap}
							style={{
								padding: '10px 15px',
								backgroundColor: '#6f42c1',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🔄 변환
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
						<strong>🔧 변환 메서드:</strong>
					</p>
					<ul>
						<li>
							<code>filter(predicate)</code> - 조건에 맞는 값들만 반환
						</li>
						<li>
							<code>map(mapper)</code> - 모든 값을 변환하여 반환
						</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const ComplexObjects = () => {
	interface User {
		id: number;
		name: string;
		age: number;
	}

	const [set, { add, delete: deleteValue, has, values }] = useSet<User>({
		initialValue: [
			{ id: 1, name: 'Alice', age: 25 },
			{ id: 2, name: 'Bob', age: 30 },
		],
	});

	const handleAddUser = () => {
		add({ id: 3, name: 'Charlie', age: 35 });
	};

	const handleDeleteUser = () => {
		// Set에서 실제로 존재하는 Alice 객체를 찾아서 제거
		const aliceUser = values.find((user) => user.name === 'Alice');
		if (aliceUser) {
			deleteValue(aliceUser);
		}
	};

	const handleCheckUser = () => {
		// Set에서 실제로 존재하는 Bob 객체를 찾아서 확인
		const bobUser = values.find((user) => user.name === 'Bob');
		if (bobUser) {
			alert('Bob이 있나요? ' + has(bobUser));
		} else {
			alert('Bob이 없습니다.');
		}
	};

	return (
		<ToggleComponent
			code={complexObjectsCode}
			title='복잡한 객체 Set'
			description='복잡한 객체를 Set으로 관리하는 방법을 보여줍니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>복잡한 객체 Set</h3>
				<p>복잡한 객체를 Set으로 관리하는 방법을 보여줍니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<h4>사용자 Set</h4>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
						}}
					>
						{set.size === 0 ? (
							<p>사용자가 없습니다.</p>
						) : (
							<ul style={{ margin: 0, paddingLeft: '20px' }}>
								{Array.from(set).map((user) => (
									<li key={user.id}>
										<strong>{user.name}</strong> ({user.age}세)
									</li>
								))}
							</ul>
						)}
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>객체 조작</h4>
					<div
						style={{
							display: 'flex',
							gap: '10px',
							marginBottom: '15px',
							flexWrap: 'wrap',
						}}
					>
						<button
							onClick={handleAddUser}
							style={{
								padding: '10px 15px',
								backgroundColor: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							➕ 사용자 추가
						</button>
						<button
							onClick={handleDeleteUser}
							style={{
								padding: '10px 15px',
								backgroundColor: '#dc3545',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🗑️ Alice 제거
						</button>
						<button
							onClick={handleCheckUser}
							style={{
								padding: '10px 15px',
								backgroundColor: '#17a2b8',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🔍 Bob 확인
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
						<strong>💡 객체 Set 특징:</strong>
					</p>
					<ul>
						<li>타입 안전성: 제네릭 타입으로 객체 구조 정의</li>
						<li>참조 비교: 동일한 객체 참조만 같은 것으로 간주</li>
						<li>객체 관리: 복잡한 데이터 구조 관리에 유용</li>
						<li>실제 참조: Set에 저장된 실제 객체 참조를 사용해야 함</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const DebugMode = () => {
	const [set, { add, delete: deleteValue }] = useSet<string>({
		initialValue: ['apple'],
		debug: true,
	});

	const handleAdd = () => add('banana');
	const handleDelete = () => deleteValue('apple');

	return (
		<ToggleComponent
			code={debugModeCode}
			title='디버그 모드'
			description='디버그 모드에서의 로그 출력을 보여줍니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>디버그 모드</h3>
				<p>디버그 모드에서의 로그 출력을 보여줍니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
						}}
					>
						<p>
							<strong>현재 Set:</strong> {JSON.stringify(Array.from(set))}
						</p>
						<p style={{ color: '#6c757d', fontSize: '14px' }}>
							💡 브라우저 개발자 도구 콘솔을 열어서 로그를 확인하세요!
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>디버그 테스트</h4>
					<div
						style={{
							display: 'flex',
							gap: '10px',
							marginBottom: '15px',
							flexWrap: 'wrap',
						}}
					>
						<button
							onClick={handleAdd}
							style={{
								padding: '10px 15px',
								backgroundColor: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							➕ 추가 (로그 출력)
						</button>
						<button
							onClick={handleDelete}
							style={{
								padding: '10px 15px',
								backgroundColor: '#dc3545',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							➖ 제거 (로그 출력)
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
						<strong>🐛 디버그 모드:</strong>
					</p>
					<ul>
						<li>
							<code>debug: true</code> 옵션으로 활성화
						</li>
						<li>모든 Set 조작이 콘솔에 로그 출력</li>
						<li>개발 중 문제 해결에 유용</li>
						<li>Set 상태 변화 추적 가능</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const EdgeCases = () => {
	const [set, { add, has, size }] = useSet<any>();

	const handleAddNull = () => add(null);
	const handleAddUndefined = () => add(undefined);
	const handleAddEmptyString = () => add('');
	const handleAddNaN = () => add(NaN);
	const handleAddInfinity = () => add(Infinity);

	const handleCheckNull = () => alert('null이 있나요? ' + has(null));
	const handleCheckUndefined = () => alert('undefined가 있나요? ' + has(undefined));

	return (
		<ToggleComponent
			code={edgeCasesCode}
			title='엣지 케이스'
			description='useSet의 다양한 엣지 케이스들을 보여줍니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>엣지 케이스</h3>
				<p>useSet의 다양한 엣지 케이스들을 보여줍니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
						}}
					>
						<p>
							<strong>현재 Set:</strong> {JSON.stringify(Array.from(set))}
						</p>
						<p>
							<strong>크기:</strong> {size}
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>특수 값 테스트</h4>
					<div
						style={{
							display: 'flex',
							gap: '10px',
							marginBottom: '15px',
							flexWrap: 'wrap',
						}}
					>
						<button
							onClick={handleAddNull}
							style={{
								padding: '10px 15px',
								backgroundColor: '#6c757d',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							null 추가
						</button>
						<button
							onClick={handleAddUndefined}
							style={{
								padding: '10px 15px',
								backgroundColor: '#6c757d',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							undefined 추가
						</button>
						<button
							onClick={handleAddEmptyString}
							style={{
								padding: '10px 15px',
								backgroundColor: '#17a2b8',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							빈 문자열 추가
						</button>
						<button
							onClick={handleAddNaN}
							style={{
								padding: '10px 15px',
								backgroundColor: '#ffc107',
								color: 'black',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							NaN 추가
						</button>
						<button
							onClick={handleAddInfinity}
							style={{
								padding: '10px 15px',
								backgroundColor: '#6f42c1',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							Infinity 추가
						</button>
						<button
							onClick={handleCheckNull}
							style={{
								padding: '10px 15px',
								backgroundColor: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							null 확인
						</button>
						<button
							onClick={handleCheckUndefined}
							style={{
								padding: '10px 15px',
								backgroundColor: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							undefined 확인
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
						<strong>⚠️ 엣지 케이스:</strong>
					</p>
					<ul>
						<li>null과 undefined 값 처리</li>
						<li>빈 문자열 처리</li>
						<li>NaN과 Infinity 처리</li>
						<li>특수 값들의 존재 여부 확인</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const ComprehensiveExample = () => {
	const [set, operations] = useSet<string>({
		initialValue: ['apple', 'banana'],
	});

	const handleComplexOperations = () => {
		// 여러 연속 작업 수행
		operations.add('orange');
		operations.toggle('grape');
		operations.addMultiple(['mango', 'pineapple']);
		operations.delete('banana');
	};

	const handleReset = () => {
		operations.clear();
		operations.addMultiple(['apple', 'banana']);
	};

	return (
		<ToggleComponent
			code={comprehensiveExampleCode}
			title='종합 예제'
			description='useSet의 모든 기능을 종합적으로 보여주는 예제입니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>종합 예제</h3>
				<p>useSet의 모든 기능을 종합적으로 보여주는 예제입니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
						}}
					>
						<p>
							<strong>현재 Set:</strong> {JSON.stringify(Array.from(set))}
						</p>
						<p>
							<strong>크기:</strong> {operations.size}
						</p>
						<p>
							<strong>비어있나요?</strong> {operations.isEmpty ? '예' : '아니오'}
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>종합 기능 테스트</h4>
					<div
						style={{
							display: 'flex',
							gap: '10px',
							marginBottom: '15px',
							flexWrap: 'wrap',
						}}
					>
						<button
							onClick={handleComplexOperations}
							style={{
								padding: '10px 15px',
								backgroundColor: '#6f42c1',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🔄 복합 작업 실행
						</button>
						<button
							onClick={handleReset}
							style={{
								padding: '10px 15px',
								backgroundColor: '#6c757d',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🔄 초기화
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
						<strong>🎯 종합 기능:</strong>
					</p>
					<ul>
						<li>기본 조작: add, delete, clear, has</li>
						<li>편의 메서드: toggle, addMultiple, deleteMultiple</li>
						<li>조회 메서드: size, isEmpty, values</li>
						<li>집합 연산: union, intersection, difference, symmetricDifference</li>
						<li>변환 메서드: filter, map</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

import { useMap } from '@/utility/useMap';
import { ToggleComponent } from '../../components/ToggleComponent';

const basicCode = `const [map, { set, get, delete: deleteValue, has, clear }] = useMap<string, number>({
  initialValue: [['apple', 1], ['banana', 2]]
});

const handleSet = () => set('orange', 3);
const handleGet = () => alert('apple의 값: ' + get('apple'));
const handleDelete = () => deleteValue('apple');
const handleHas = () => alert('banana가 있나요? ' + has('banana'));
const handleClear = () => clear();

return (
  <div>
    <p>Map: {JSON.stringify(Array.from(map.entries()))}</p>
    <button onClick={handleSet}>추가</button>
    <button onClick={handleGet}>조회</button>
    <button onClick={handleDelete}>제거</button>
    <button onClick={handleHas}>확인</button>
    <button onClick={handleClear}>초기화</button>
  </div>
);`;

const convenienceMethodsCode = `const [map, { toggle, setMultiple, deleteMultiple, update }] = useMap<string, number>();

const handleToggle = () => toggle('apple', 1);
const handleSetMultiple = () => setMultiple([['apple', 1], ['banana', 2], ['orange', 3]]);
const handleDeleteMultiple = () => deleteMultiple(['apple', 'banana']);
const handleUpdate = () => update('apple', (value) => (value || 0) + 1);

return (
  <div>
    <p>Map: {JSON.stringify(Array.from(map.entries()))}</p>
    <button onClick={handleToggle}>토글</button>
    <button onClick={handleSetMultiple}>여러 개 추가</button>
    <button onClick={handleDeleteMultiple}>여러 개 제거</button>
    <button onClick={handleUpdate}>업데이트</button>
  </div>
);`;

const queryMethodsCode = `const [map, operations] = useMap<string, number>({
  initialValue: [['apple', 1], ['banana', 2], ['orange', 3]]
});

return (
  <div>
    <p>Map: {JSON.stringify(Array.from(map.entries()))}</p>
    <p>크기: {operations.size}</p>
    <p>비어있나요? {operations.isEmpty ? '예' : '아니오'}</p>
    <p>키들: {JSON.stringify(operations.keys)}</p>
    <p>값들: {JSON.stringify(operations.values)}</p>
    <p>엔트리들: {JSON.stringify(operations.entries)}</p>
  </div>
);`;

const transformationMethodsCode = `const [map, { filter, map: mapValues, find, findKey, findValue }] = useMap<string, number>({
  initialValue: [['apple', 1], ['banana', 2], ['orange', 3], ['grape', 4]]
});

const handleFilter = () => {
  const filtered = filter((key, value) => value > 2);
  alert('2보다 큰 값들: ' + JSON.stringify(filtered));
};

const handleMap = () => {
  const mapped = mapValues((key, value) => \`\${key}: \${value * 2}\`);
  alert('값을 2배로 변환: ' + JSON.stringify(mapped));
};

const handleFind = () => {
  const found = find((key, value) => value === 3);
  alert('값이 3인 엔트리: ' + JSON.stringify(found));
};

const handleFindKey = () => {
  const foundKey = findKey((key, value) => value === 2);
  alert('값이 2인 키: ' + foundKey);
};

const handleFindValue = () => {
  const foundValue = findValue((key, value) => key === 'banana');
  alert('키가 banana인 값: ' + foundValue);
};

return (
  <div>
    <p>Map: {JSON.stringify(Array.from(map.entries()))}</p>
    <button onClick={handleFilter}>필터링</button>
    <button onClick={handleMap}>변환</button>
    <button onClick={handleFind}>찾기</button>
    <button onClick={handleFindKey}>키 찾기</button>
    <button onClick={handleFindValue}>값 찾기</button>
  </div>
);`;

const complexObjectsCode = `interface User {
  id: number;
  name: string;
  age: number;
}

const [map, { set, get, has, delete: deleteValue }] = useMap<number, User>();

const user1 = { id: 1, name: 'Alice', age: 25 };
const user2 = { id: 2, name: 'Bob', age: 30 };

const handleAddUser = () => {
  set(1, user1);
  set(2, user2);
};

const handleGetUser = () => {
  const user = get(1);
  alert('User 1: ' + JSON.stringify(user));
};

const handleCheckUser = () => {
  alert('User 2가 있나요? ' + has(2));
};

const handleDeleteUser = () => {
  deleteValue(1);
};

return (
  <div>
    <p>Map: {JSON.stringify(Array.from(map.entries()))}</p>
    <button onClick={handleAddUser}>사용자 추가</button>
    <button onClick={handleGetUser}>사용자 조회</button>
    <button onClick={handleCheckUser}>사용자 확인</button>
    <button onClick={handleDeleteUser}>사용자 제거</button>
  </div>
);`;

const debugModeCode = `const [map, { set, delete: deleteValue }] = useMap<string, number>({ debug: true });

const handleAdd = () => set('apple', 1);
const handleDelete = () => deleteValue('apple');

return (
  <div>
    <p>Map: {JSON.stringify(Array.from(map.entries()))}</p>
    <p>콘솔을 확인하여 디버그 로그를 보세요!</p>
    <button onClick={handleAdd}>추가</button>
    <button onClick={handleDelete}>제거</button>
  </div>
);`;

const edgeCasesCode = `const [map, { set, get, has }] = useMap<any, any>();

const handleAddNull = () => set(null, 'null value');
const handleAddUndefined = () => set(undefined, 'undefined value');
const handleAddEmptyString = () => set('', 'empty string key');
const handleAddNaN = () => set(NaN, 'NaN key');
const handleAddInfinity = () => set(Infinity, 'Infinity key');
const handleAddObject = () => set({ id: 1 }, 'object key');
const handleAddArray = () => set([1, 2, 3], 'array key');

const handleCheckNull = () => alert('null이 있나요? ' + has(null));
const handleCheckUndefined = () => alert('undefined가 있나요? ' + has(undefined));
const handleCheckEmptyString = () => alert('빈 문자열이 있나요? ' + has(''));
const handleCheckNaN = () => alert('NaN이 있나요? ' + has(NaN));
const handleCheckInfinity = () => alert('Infinity가 있나요? ' + has(Infinity));

return (
  <div>
    <p>Map: {JSON.stringify(Array.from(map.entries()))}</p>
    <div>
      <button onClick={handleAddNull}>null 추가</button>
      <button onClick={handleAddUndefined}>undefined 추가</button>
      <button onClick={handleAddEmptyString}>빈 문자열 추가</button>
      <button onClick={handleAddNaN}>NaN 추가</button>
      <button onClick={handleAddInfinity}>Infinity 추가</button>
      <button onClick={handleAddObject}>객체 추가</button>
      <button onClick={handleAddArray}>배열 추가</button>
    </div>
    <div>
      <button onClick={handleCheckNull}>null 확인</button>
      <button onClick={handleCheckUndefined}>undefined 확인</button>
      <button onClick={handleCheckEmptyString}>빈 문자열 확인</button>
      <button onClick={handleCheckNaN}>NaN 확인</button>
      <button onClick={handleCheckInfinity}>Infinity 확인</button>
    </div>
  </div>
);`;

const comprehensiveExampleCode = `const [map, operations] = useMap<string, number>({
  initialValue: [['apple', 1], ['banana', 2]],
  debug: true
});

const handleComplexOperations = () => {
  // 기본 작업
  operations.set('orange', 3);
  operations.set('grape', 4);
  
  // 편의 메서드
  operations.toggle('apple', 1);
  operations.setMultiple([['mango', 5], ['kiwi', 6]]);
  operations.update('banana', (value) => (value || 0) * 2);
  
  // 변환 메서드
  const filtered = operations.filter((key, value) => value > 3);
  const mapped = operations.map((key, value) => \`\${key}: \${value * 2}\`);
  const found = operations.find((key, value) => value === 6);
  
  alert(\`필터링 결과: \${JSON.stringify(filtered)}\`);
  alert(\`변환 결과: \${JSON.stringify(mapped)}\`);
  alert(\`찾기 결과: \${JSON.stringify(found)}\`);
};

const handleReset = () => {
  operations.clear();
  operations.setMultiple([['apple', 1], ['banana', 2]]);
};

return (
  <div>
    <p>Map: {JSON.stringify(Array.from(map.entries()))}</p>
    <p>크기: {operations.size}</p>
    <p>비어있나요? {operations.isEmpty ? '예' : '아니오'}</p>
    <p>키들: {JSON.stringify(operations.keys)}</p>
    <p>값들: {JSON.stringify(operations.values)}</p>
    <button onClick={handleComplexOperations}>복잡한 작업</button>
    <button onClick={handleReset}>초기화</button>
  </div>
);`;

export default {
	title: 'Utility/useMap',
	parameters: {
		docs: {
			description: {
				component:
					'React hook for managing Map objects with convenience methods and transformations.',
			},
		},
	},
};

export const Default = () => {
	const [map, { set, get, delete: deleteValue, has, clear }] = useMap<string, number>({
		initialValue: [
			['apple', 1],
			['banana', 2],
		],
	});

	const handleSet = () => set('orange', 3);
	const handleGet = () => alert('apple의 값: ' + get('apple'));
	const handleDelete = () => deleteValue('apple');
	const handleHas = () => alert('banana가 있나요? ' + has('banana'));
	const handleClear = () => clear();

	return (
		<ToggleComponent
			title='기본 Map 메서드들'
			description='useMap의 기본적인 Map 메서드들을 사용하는 예제입니다.'
			code={basicCode}
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>기본 Map 메서드들</h3>
				<p>useMap의 기본적인 Map 메서드들을 사용하는 예제입니다.</p>

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
							<strong>현재 Map:</strong> {JSON.stringify(Array.from(map.entries()))}
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
							onClick={handleSet}
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
							onClick={handleGet}
							style={{
								padding: '10px 15px',
								backgroundColor: '#17a2b8',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🔍 조회
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
							onClick={handleHas}
							style={{
								padding: '10px 15px',
								backgroundColor: '#ffc107',
								color: 'black',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							✅ 확인
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
					</div>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const ConvenienceMethods = () => {
	const [map, { toggle, setMultiple, deleteMultiple, update }] = useMap<string, number>();

	const handleToggle = () => toggle('apple', 1);
	const handleSetMultiple = () =>
		setMultiple([
			['apple', 1],
			['banana', 2],
			['orange', 3],
		]);
	const handleDeleteMultiple = () => deleteMultiple(['apple', 'banana']);
	const handleUpdate = () => update('apple', (value) => (value || 0) + 1);

	return (
		<ToggleComponent
			title='편의 메서드들'
			description='useMap의 편의 메서드들을 사용하는 예제입니다.'
			code={convenienceMethodsCode}
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>편의 메서드들</h3>
				<p>useMap의 편의 메서드들을 사용하는 예제입니다.</p>

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
							<strong>현재 Map:</strong> {JSON.stringify(Array.from(map.entries()))}
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>편의 조작</h4>
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
							onClick={handleSetMultiple}
							style={{
								padding: '10px 15px',
								backgroundColor: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							📦 여러 개 추가
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
							🗑️ 여러 개 제거
						</button>
						<button
							onClick={handleUpdate}
							style={{
								padding: '10px 15px',
								backgroundColor: '#fd7e14',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🔄 업데이트
						</button>
					</div>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const QueryMethods = () => {
	const [map, operations] = useMap<string, number>({
		initialValue: [
			['apple', 1],
			['banana', 2],
			['orange', 3],
		],
	});

	return (
		<ToggleComponent
			title='조회 메서드들'
			description='useMap의 조회 메서드들을 사용하는 예제입니다.'
			code={queryMethodsCode}
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>조회 메서드들</h3>
				<p>useMap의 조회 메서드들을 사용하는 예제입니다.</p>

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
							<strong>현재 Map:</strong> {JSON.stringify(Array.from(map.entries()))}
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>Map 정보</h4>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
							gap: '10px',
						}}
					>
						<div
							style={{
								padding: '10px',
								backgroundColor: '#e3f2fd',
								borderRadius: '4px',
								border: '1px solid #bbdefb',
							}}
						>
							<strong>크기:</strong> {operations.size}
						</div>
						<div
							style={{
								padding: '10px',
								backgroundColor: operations.isEmpty ? '#ffebee' : '#e8f5e8',
								borderRadius: '4px',
								border: operations.isEmpty ? '1px solid #ffcdd2' : '1px solid #c8e6c9',
							}}
						>
							<strong>비어있나요?</strong> {operations.isEmpty ? '예' : '아니오'}
						</div>
						<div
							style={{
								padding: '10px',
								backgroundColor: '#fff3e0',
								borderRadius: '4px',
								border: '1px solid #ffcc80',
							}}
						>
							<strong>키들:</strong> {JSON.stringify(operations.keys)}
						</div>
						<div
							style={{
								padding: '10px',
								backgroundColor: '#f3e5f5',
								borderRadius: '4px',
								border: '1px solid #e1bee7',
							}}
						>
							<strong>값들:</strong> {JSON.stringify(operations.values)}
						</div>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>엔트리들</h4>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#fafafa',
							borderRadius: '4px',
							border: '1px solid #e0e0e0',
							maxHeight: '200px',
							overflow: 'auto',
						}}
					>
						<strong>엔트리들:</strong> {JSON.stringify(operations.entries)}
					</div>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const TransformationMethods = () => {
	const [map, { filter, map: mapValues, find, findKey, findValue }] = useMap<string, number>({
		initialValue: [
			['apple', 1],
			['banana', 2],
			['orange', 3],
			['grape', 4],
		],
	});

	const handleFilter = () => {
		const filtered = filter((key, value) => value > 2);
		alert('2보다 큰 값들: ' + JSON.stringify(filtered));
	};

	const handleMap = () => {
		const mapped = mapValues((key, value) => `${key}: ${value * 2}`);
		alert('값을 2배로 변환: ' + JSON.stringify(mapped));
	};

	const handleFind = () => {
		const found = find((key, value) => value === 3);
		alert('값이 3인 엔트리: ' + JSON.stringify(found));
	};

	const handleFindKey = () => {
		const foundKey = findKey((key, value) => value === 2);
		alert('값이 2인 키: ' + foundKey);
	};

	const handleFindValue = () => {
		const foundValue = findValue((key, value) => key === 'banana');
		alert('키가 banana인 값: ' + foundValue);
	};

	return (
		<ToggleComponent
			title='변환 메서드들'
			description='useMap의 변환 메서드들을 사용하는 예제입니다.'
			code={transformationMethodsCode}
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>변환 메서드들</h3>
				<p>useMap의 변환 메서드들을 사용하는 예제입니다.</p>

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
							<strong>현재 Map:</strong> {JSON.stringify(Array.from(map.entries()))}
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>변환 조작</h4>
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
								backgroundColor: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🔄 변환
						</button>
						<button
							onClick={handleFind}
							style={{
								padding: '10px 15px',
								backgroundColor: '#ffc107',
								color: 'black',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🔎 찾기
						</button>
						<button
							onClick={handleFindKey}
							style={{
								padding: '10px 15px',
								backgroundColor: '#fd7e14',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🔑 키 찾기
						</button>
						<button
							onClick={handleFindValue}
							style={{
								padding: '10px 15px',
								backgroundColor: '#6f42c1',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							💎 값 찾기
						</button>
					</div>
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

	const [map, { set, get, has, delete: deleteValue }] = useMap<number, User>();

	const user1 = { id: 1, name: 'Alice', age: 25 };
	const user2 = { id: 2, name: 'Bob', age: 30 };

	const handleAddUser = () => {
		set(1, user1);
		set(2, user2);
	};

	const handleGetUser = () => {
		const user = get(1);
		alert('User 1: ' + JSON.stringify(user));
	};

	const handleCheckUser = () => {
		alert('User 2가 있나요? ' + has(2));
	};

	const handleDeleteUser = () => {
		deleteValue(1);
	};

	return (
		<ToggleComponent
			title='복잡한 객체'
			description='useMap에서 복잡한 객체를 키-값으로 사용하는 예제입니다.'
			code={complexObjectsCode}
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>복잡한 객체</h3>
				<p>useMap에서 복잡한 객체를 키-값으로 사용하는 예제입니다.</p>

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
							<strong>현재 Map:</strong> {JSON.stringify(Array.from(map.entries()))}
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>사용자 관리</h4>
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
							👤 사용자 추가
						</button>
						<button
							onClick={handleGetUser}
							style={{
								padding: '10px 15px',
								backgroundColor: '#17a2b8',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🔍 사용자 조회
						</button>
						<button
							onClick={handleCheckUser}
							style={{
								padding: '10px 15px',
								backgroundColor: '#ffc107',
								color: 'black',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							✅ 사용자 확인
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
							🗑️ 사용자 제거
						</button>
					</div>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const DebugMode = () => {
	const [map, { set, delete: deleteValue }] = useMap<string, number>({ debug: true });

	const handleAdd = () => set('apple', 1);
	const handleDelete = () => deleteValue('apple');

	return (
		<ToggleComponent
			title='디버그 모드'
			description='useMap의 디버그 모드를 사용하는 예제입니다. 콘솔을 확인하여 로그를 보세요!'
			code={debugModeCode}
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>디버그 모드</h3>
				<p>useMap의 디버그 모드를 사용하는 예제입니다. 콘솔을 확인하여 로그를 보세요!</p>

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
							<strong>현재 Map:</strong> {JSON.stringify(Array.from(map.entries()))}
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#fff3cd',
							border: '1px solid #ffeaa7',
							borderRadius: '4px',
							color: '#856404',
						}}
					>
						<p style={{ margin: '0', fontSize: '0.9rem' }}>
							⚠️ 콘솔을 확인하여 디버그 로그를 보세요!
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>디버그 조작</h4>
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
					</div>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const EdgeCases = () => {
	const [map, { set, get, has }] = useMap<any, any>();

	const handleAddNull = () => set(null, 'null value');
	const handleAddUndefined = () => set(undefined, 'undefined value');
	const handleAddEmptyString = () => set('', 'empty string key');
	const handleAddNaN = () => set(NaN, 'NaN key');
	const handleAddInfinity = () => set(Infinity, 'Infinity key');
	const handleAddObject = () => set({ id: 1 }, 'object key');
	const handleAddArray = () => set([1, 2, 3], 'array key');

	const handleCheckNull = () => alert('null이 있나요? ' + has(null));
	const handleCheckUndefined = () => alert('undefined가 있나요? ' + has(undefined));
	const handleCheckEmptyString = () => alert('빈 문자열이 있나요? ' + has(''));
	const handleCheckNaN = () => alert('NaN이 있나요? ' + has(NaN));
	const handleCheckInfinity = () => alert('Infinity가 있나요? ' + has(Infinity));

	return (
		<ToggleComponent
			title='엣지 케이스들'
			description='useMap에서 다양한 엣지 케이스를 처리하는 예제입니다.'
			code={edgeCasesCode}
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>엣지 케이스들</h3>
				<p>useMap에서 다양한 엣지 케이스를 처리하는 예제입니다.</p>

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
							<strong>현재 Map:</strong> {JSON.stringify(Array.from(map.entries()))}
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>특수 값 추가</h4>
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
								padding: '8px 12px',
								backgroundColor: '#6c757d',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
								fontSize: '0.9rem',
							}}
						>
							null 추가
						</button>
						<button
							onClick={handleAddUndefined}
							style={{
								padding: '8px 12px',
								backgroundColor: '#6c757d',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
								fontSize: '0.9rem',
							}}
						>
							undefined 추가
						</button>
						<button
							onClick={handleAddEmptyString}
							style={{
								padding: '8px 12px',
								backgroundColor: '#17a2b8',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
								fontSize: '0.9rem',
							}}
						>
							빈 문자열 추가
						</button>
						<button
							onClick={handleAddNaN}
							style={{
								padding: '8px 12px',
								backgroundColor: '#ffc107',
								color: 'black',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
								fontSize: '0.9rem',
							}}
						>
							NaN 추가
						</button>
						<button
							onClick={handleAddInfinity}
							style={{
								padding: '8px 12px',
								backgroundColor: '#fd7e14',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
								fontSize: '0.9rem',
							}}
						>
							Infinity 추가
						</button>
						<button
							onClick={handleAddObject}
							style={{
								padding: '8px 12px',
								backgroundColor: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
								fontSize: '0.9rem',
							}}
						>
							객체 추가
						</button>
						<button
							onClick={handleAddArray}
							style={{
								padding: '8px 12px',
								backgroundColor: '#6f42c1',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
								fontSize: '0.9rem',
							}}
						>
							배열 추가
						</button>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>특수 값 확인</h4>
					<div
						style={{
							display: 'flex',
							gap: '10px',
							marginBottom: '15px',
							flexWrap: 'wrap',
						}}
					>
						<button
							onClick={handleCheckNull}
							style={{
								padding: '8px 12px',
								backgroundColor: '#6c757d',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
								fontSize: '0.9rem',
							}}
						>
							null 확인
						</button>
						<button
							onClick={handleCheckUndefined}
							style={{
								padding: '8px 12px',
								backgroundColor: '#6c757d',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
								fontSize: '0.9rem',
							}}
						>
							undefined 확인
						</button>
						<button
							onClick={handleCheckEmptyString}
							style={{
								padding: '8px 12px',
								backgroundColor: '#17a2b8',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
								fontSize: '0.9rem',
							}}
						>
							빈 문자열 확인
						</button>
						<button
							onClick={handleCheckNaN}
							style={{
								padding: '8px 12px',
								backgroundColor: '#ffc107',
								color: 'black',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
								fontSize: '0.9rem',
							}}
						>
							NaN 확인
						</button>
						<button
							onClick={handleCheckInfinity}
							style={{
								padding: '8px 12px',
								backgroundColor: '#fd7e14',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
								fontSize: '0.9rem',
							}}
						>
							Infinity 확인
						</button>
					</div>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const ComprehensiveExample = () => {
	const [map, operations] = useMap<string, number>({
		initialValue: [
			['apple', 1],
			['banana', 2],
		],
		debug: true,
	});

	const handleComplexOperations = () => {
		// 기본 작업
		operations.set('orange', 3);
		operations.set('grape', 4);

		// 편의 메서드
		operations.toggle('apple', 1);
		operations.setMultiple([
			['mango', 5],
			['kiwi', 6],
		]);
		operations.update('banana', (value) => (value || 0) * 2);

		// 변환 메서드
		const filtered = operations.filter((key, value) => value > 3);
		const mapped = operations.map((key, value) => `${key}: ${value * 2}`);
		const found = operations.find((key, value) => value === 6);

		alert(`필터링 결과: ${JSON.stringify(filtered)}`);
		alert(`변환 결과: ${JSON.stringify(mapped)}`);
		alert(`찾기 결과: ${JSON.stringify(found)}`);
	};

	const handleReset = () => {
		operations.clear();
		operations.setMultiple([
			['apple', 1],
			['banana', 2],
		]);
	};

	return (
		<ToggleComponent
			title='종합 예제'
			description='useMap의 모든 기능을 종합적으로 사용하는 예제입니다.'
			code={comprehensiveExampleCode}
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>종합 예제</h3>
				<p>useMap의 모든 기능을 종합적으로 사용하는 예제입니다.</p>

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
							<strong>현재 Map:</strong> {JSON.stringify(Array.from(map.entries()))}
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>Map 정보</h4>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
							gap: '10px',
						}}
					>
						<div
							style={{
								padding: '10px',
								backgroundColor: '#e3f2fd',
								borderRadius: '4px',
								border: '1px solid #bbdefb',
							}}
						>
							<strong>크기:</strong> {operations.size}
						</div>
						<div
							style={{
								padding: '10px',
								backgroundColor: operations.isEmpty ? '#ffebee' : '#e8f5e8',
								borderRadius: '4px',
								border: operations.isEmpty ? '1px solid #ffcdd2' : '1px solid #c8e6c9',
							}}
						>
							<strong>비어있나요?</strong> {operations.isEmpty ? '예' : '아니오'}
						</div>
						<div
							style={{
								padding: '10px',
								backgroundColor: '#fff3e0',
								borderRadius: '4px',
								border: '1px solid #ffcc80',
							}}
						>
							<strong>키들:</strong> {JSON.stringify(operations.keys)}
						</div>
						<div
							style={{
								padding: '10px',
								backgroundColor: '#f3e5f5',
								borderRadius: '4px',
								border: '1px solid #e1bee7',
							}}
						>
							<strong>값들:</strong> {JSON.stringify(operations.values)}
						</div>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>종합 조작</h4>
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
								padding: '12px 20px',
								backgroundColor: '#6f42c1',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
								fontWeight: 'bold',
							}}
						>
							🚀 복잡한 작업
						</button>
						<button
							onClick={handleReset}
							style={{
								padding: '12px 20px',
								backgroundColor: '#6c757d',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
								fontWeight: 'bold',
							}}
						>
							🔄 초기화
						</button>
					</div>
				</div>
			</div>
		</ToggleComponent>
	);
};

import { useArray } from '@/utility/useArray';
import { ToggleComponent } from '../../components/ToggleComponent';

const basicCode = `const [array, { push, pop, clear }] = useArray<number>([1, 2, 3]);

const handlePush = () => push(Math.floor(Math.random() * 100));
const handlePop = () => pop();
const handleClear = () => clear();

return (
  <div>
    <p>배열: {JSON.stringify(array)}</p>
    <button onClick={handlePush}>추가</button>
    <button onClick={handlePop}>제거</button>
    <button onClick={handleClear}>초기화</button>
  </div>
);`;

const arrayOperationsCode = `const [array, operations] = useArray<number>([1, 2, 3]);

const handleUnshift = () => operations.unshift(0);
const handleShift = () => operations.shift();
const handleRemoveAt = () => operations.removeAt(1);
const handleUpdateAt = () => operations.updateAt(1, 10);
const handleInsertAt = () => operations.insertAt(1, 5);

return (
  <div>
    <p>배열: {JSON.stringify(array)}</p>
    <button onClick={handleUnshift}>앞에 추가</button>
    <button onClick={handleShift}>앞에서 제거</button>
    <button onClick={handleRemoveAt}>인덱스 1 제거</button>
    <button onClick={handleUpdateAt}>인덱스 1을 10으로 변경</button>
    <button onClick={handleInsertAt}>인덱스 1에 5 삽입</button>
  </div>
);`;

const searchAndFilterCode = `const [array, operations] = useArray<number>([1, 2, 3, 4, 5, 6]);

const handleFind = () => {
  const found = operations.find(item => item > 3);
  alert('3보다 큰 첫 번째 아이템: ' + found);
};

const handleFindIndex = () => {
  const index = operations.findIndex(item => item > 3);
  alert('3보다 큰 첫 번째 인덱스: ' + index);
};

const handleIncludes = () => {
  const hasThree = operations.includes(3);
  alert('3이 포함되어 있나요? ' + hasThree);
};

const handleRemove = () => {
  operations.remove(item => item % 2 === 0);
};

const handleFilter = () => {
  operations.filter(item => item > 3);
};

return (
  <div>
    <p>배열: {JSON.stringify(array)}</p>
    <button onClick={handleFind}>3보다 큰 첫 번째 아이템 찾기</button>
    <button onClick={handleFindIndex}>3보다 큰 첫 번째 인덱스 찾기</button>
    <button onClick={handleIncludes}>3 포함 여부 확인</button>
    <button onClick={handleRemove}>짝수 제거</button>
    <button onClick={handleFilter}>3보다 큰 것만 남기기</button>
  </div>
);`;

const sortAndTransformCode = `const [array, operations] = useArray<number>([3, 1, 4, 1, 5, 9, 2, 6]);

const handleSort = () => operations.sort((a, b) => a - b);
const handleReverse = () => operations.reverse();
const handleSet = () => operations.set([10, 20, 30, 40, 50]);

return (
  <div>
    <p>배열: {JSON.stringify(array)}</p>
    <button onClick={handleSort}>오름차순 정렬</button>
    <button onClick={handleReverse}>순서 뒤집기</button>
    <button onClick={handleSet}>새로운 배열로 교체</button>
  </div>
);`;

const utilityMethodsCode = `const [array, operations] = useArray<number>([1, 2, 3, 4, 5]);

const handleGet = () => {
  const item = operations.get(2);
  alert('인덱스 2의 아이템: ' + item);
};

const handleFirst = () => {
  const first = operations.first();
  alert('첫 번째 아이템: ' + first);
};

const handleLast = () => {
  const last = operations.last();
  alert('마지막 아이템: ' + last);
};

return (
  <div>
    <p>배열: {JSON.stringify(array)}</p>
    <p>길이: {operations.length}</p>
    <p>비어있나요? {operations.isEmpty ? '예' : '아니오'}</p>
    <p>비어있지 않나요? {operations.isNotEmpty ? '예' : '아니오'}</p>
    <button onClick={handleGet}>인덱스 2 가져오기</button>
    <button onClick={handleFirst}>첫 번째 아이템</button>
    <button onClick={handleLast}>마지막 아이템</button>
  </div>
);`;

const complexObjectCode = `interface User {
  id: number;
  name: string;
  age: number;
}

const [array, operations] = useArray<User>([
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 35 }
]);

const handleAddUser = () => {
  operations.push({ id: 4, name: 'David', age: 28 });
};

const handleRemoveUser = () => {
  operations.remove(user => user.age > 30);
};

const handleUpdateUser = () => {
  operations.updateAt(0, { id: 1, name: 'Alice Updated', age: 26 });
};

const handleFindUser = () => {
  const user = operations.find(user => user.name === 'Bob');
  alert('Bob 찾기: ' + (user ? JSON.stringify(user) : '찾을 수 없음'));
};

return (
  <div>
    <p>사용자 목록:</p>
    <ul>
      {array.map(user => (
        <li key={user.id}>
          {user.name} ({user.age}세)
        </li>
      ))}
    </ul>
    <button onClick={handleAddUser}>사용자 추가</button>
    <button onClick={handleRemoveUser}>30세 이상 제거</button>
    <button onClick={handleUpdateUser}>Alice 정보 업데이트</button>
    <button onClick={handleFindUser}>Bob 찾기</button>
  </div>
);`;

const debugModeCode = `const [array, operations] = useArray<number>({
  initialValue: [1, 2, 3],
  debug: true
});

const handlePush = () => operations.push(Math.floor(Math.random() * 100));
const handlePop = () => operations.pop();

return (
  <div>
    <p>배열: {JSON.stringify(array)}</p>
    <p>콘솔을 열어서 로그를 확인하세요!</p>
    <button onClick={handlePush}>추가 (로그 출력)</button>
    <button onClick={handlePop}>제거 (로그 출력)</button>
  </div>
);`;

const comprehensiveExampleCode = `const [array, operations] = useArray<number>([1, 2, 3]);

const handleComplexOperations = () => {
  // 여러 연속 작업 수행
  operations.push(4);
  operations.unshift(0);
  operations.insertAt(2, 10);
  operations.sort((a, b) => a - b);
  operations.reverse();
};

const handleReset = () => {
  operations.set([1, 2, 3]);
};

return (
  <div>
    <p>배열: {JSON.stringify(array)}</p>
    <p>길이: {operations.length}</p>
    <p>첫 번째: {operations.first()}</p>
    <p>마지막: {operations.last()}</p>
    <p>비어있나요? {operations.isEmpty ? '예' : '아니오'}</p>
    <button onClick={handleComplexOperations}>복합 작업 실행</button>
    <button onClick={handleReset}>초기화</button>
  </div>
);`;

export default {
	title: 'Utility/useArray',
	parameters: {
		docs: {
			description: {
				component:
					'배열 상태를 관리하는 훅입니다. 배열 조작, 검색, 필터링, 정렬 등의 기능을 제공합니다.',
			},
		},
	},
};

export const Default = () => {
	const [array, { push, pop, clear }] = useArray<number>({ initialValue: [1, 2, 3] });

	const handlePush = () => push(Math.floor(Math.random() * 100));
	const handlePop = () => pop();
	const handleClear = () => clear();

	return (
		<ToggleComponent
			code={basicCode}
			title='기본 사용법'
			description='useArray의 기본적인 사용법을 보여줍니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>기본 사용법</h3>
				<p>useArray의 기본적인 사용법을 보여줍니다.</p>

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
							<strong>현재 배열:</strong> {JSON.stringify(array)}
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
							onClick={handlePush}
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
							onClick={handlePop}
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
						<li>배열 끝에 아이템 추가/제거</li>
						<li>전체 배열 초기화</li>
						<li>타입 안전성 보장</li>
						<li>불변성 유지</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const ArrayOperations = () => {
	const [array, operations] = useArray<number>({ initialValue: [1, 2, 3] });

	const handleUnshift = () => operations.unshift(0);
	const handleShift = () => operations.shift();
	const handleRemoveAt = () => operations.removeAt(1);
	const handleUpdateAt = () => operations.updateAt(1, 10);
	const handleInsertAt = () => operations.insertAt(1, 5);

	return (
		<ToggleComponent
			code={arrayOperationsCode}
			title='배열 조작 메서드'
			description='인덱스 기반 배열 조작 메서드들을 보여줍니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>배열 조작 메서드</h3>
				<p>인덱스 기반 배열 조작 메서드들을 보여줍니다.</p>

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
							<strong>현재 배열:</strong> {JSON.stringify(array)}
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>배열 조작</h4>
					<div
						style={{
							display: 'flex',
							gap: '10px',
							marginBottom: '15px',
							flexWrap: 'wrap',
						}}
					>
						<button
							onClick={handleUnshift}
							style={{
								padding: '10px 15px',
								backgroundColor: '#17a2b8',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							⬆️ 앞에 추가
						</button>
						<button
							onClick={handleShift}
							style={{
								padding: '10px 15px',
								backgroundColor: '#ffc107',
								color: 'black',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							⬇️ 앞에서 제거
						</button>
						<button
							onClick={handleRemoveAt}
							style={{
								padding: '10px 15px',
								backgroundColor: '#dc3545',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🗑️ 인덱스 1 제거
						</button>
						<button
							onClick={handleUpdateAt}
							style={{
								padding: '10px 15px',
								backgroundColor: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							✏️ 인덱스 1을 10으로 변경
						</button>
						<button
							onClick={handleInsertAt}
							style={{
								padding: '10px 15px',
								backgroundColor: '#6f42c1',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							📌 인덱스 1에 5 삽입
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
						<strong>🔧 메서드 설명:</strong>
					</p>
					<ul>
						<li>
							<code>unshift(item)</code> - 배열 시작에 아이템 추가
						</li>
						<li>
							<code>shift()</code> - 배열 시작에서 아이템 제거
						</li>
						<li>
							<code>removeAt(index)</code> - 특정 인덱스의 아이템 제거
						</li>
						<li>
							<code>updateAt(index, item)</code> - 특정 인덱스의 아이템 업데이트
						</li>
						<li>
							<code>insertAt(index, item)</code> - 특정 인덱스에 아이템 삽입
						</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const SearchAndFilter = () => {
	const [array, operations] = useArray<number>({ initialValue: [1, 2, 3, 4, 5, 6] });

	const handleFind = () => {
		const found = operations.find((item) => item > 3);
		alert('3보다 큰 첫 번째 아이템: ' + found);
	};

	const handleFindIndex = () => {
		const index = operations.findIndex((item) => item > 3);
		alert('3보다 큰 첫 번째 인덱스: ' + index);
	};

	const handleIncludes = () => {
		const hasThree = operations.includes(3);
		alert('3이 포함되어 있나요? ' + hasThree);
	};

	const handleRemove = () => {
		operations.remove((item) => item % 2 === 0);
	};

	const handleFilter = () => {
		operations.filter((item) => item > 3);
	};

	return (
		<ToggleComponent
			code={searchAndFilterCode}
			title='검색 및 필터링'
			description='배열 검색 및 필터링 기능을 보여줍니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>검색 및 필터링</h3>
				<p>배열 검색 및 필터링 기능을 보여줍니다.</p>

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
							<strong>현재 배열:</strong> {JSON.stringify(array)}
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>검색 및 필터링</h4>
					<div
						style={{
							display: 'flex',
							gap: '10px',
							marginBottom: '15px',
							flexWrap: 'wrap',
						}}
					>
						<button
							onClick={handleFind}
							style={{
								padding: '10px 15px',
								backgroundColor: '#17a2b8',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🔍 3보다 큰 첫 번째 아이템 찾기
						</button>
						<button
							onClick={handleFindIndex}
							style={{
								padding: '10px 15px',
								backgroundColor: '#6f42c1',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							📍 3보다 큰 첫 번째 인덱스 찾기
						</button>
						<button
							onClick={handleIncludes}
							style={{
								padding: '10px 15px',
								backgroundColor: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							✅ 3 포함 여부 확인
						</button>
						<button
							onClick={handleRemove}
							style={{
								padding: '10px 15px',
								backgroundColor: '#dc3545',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🗑️ 짝수 제거
						</button>
						<button
							onClick={handleFilter}
							style={{
								padding: '10px 15px',
								backgroundColor: '#ffc107',
								color: 'black',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🔧 3보다 큰 것만 남기기
						</button>
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
						<strong>🔍 검색 메서드:</strong>
					</p>
					<ul>
						<li>
							<code>find(predicate)</code> - 조건에 맞는 첫 번째 아이템 찾기
						</li>
						<li>
							<code>findIndex(predicate)</code> - 조건에 맞는 첫 번째 인덱스 찾기
						</li>
						<li>
							<code>includes(item)</code> - 아이템 포함 여부 확인
						</li>
						<li>
							<code>remove(predicate)</code> - 조건에 맞는 아이템들 제거
						</li>
						<li>
							<code>filter(predicate)</code> - 조건에 맞는 아이템들만 남기기
						</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const SortAndTransform = () => {
	const [array, operations] = useArray<number>({ initialValue: [3, 1, 4, 1, 5, 9, 2, 6] });

	const handleSort = () => operations.sort((a, b) => a - b);
	const handleReverse = () => operations.reverse();
	const handleSet = () => operations.set([10, 20, 30, 40, 50]);

	return (
		<ToggleComponent
			code={sortAndTransformCode}
			title='정렬 및 변환'
			description='배열 정렬 및 변환 기능을 보여줍니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>정렬 및 변환</h3>
				<p>배열 정렬 및 변환 기능을 보여줍니다.</p>

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
							<strong>현재 배열:</strong> {JSON.stringify(array)}
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>정렬 및 변환</h4>
					<div
						style={{
							display: 'flex',
							gap: '10px',
							marginBottom: '15px',
							flexWrap: 'wrap',
						}}
					>
						<button
							onClick={handleSort}
							style={{
								padding: '10px 15px',
								backgroundColor: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							📈 오름차순 정렬
						</button>
						<button
							onClick={handleReverse}
							style={{
								padding: '10px 15px',
								backgroundColor: '#6f42c1',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🔄 순서 뒤집기
						</button>
						<button
							onClick={handleSet}
							style={{
								padding: '10px 15px',
								backgroundColor: '#17a2b8',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🔄 새로운 배열로 교체
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
						<strong>🔄 변환 메서드:</strong>
					</p>
					<ul>
						<li>
							<code>sort(compareFn?)</code> - 배열 정렬 (기본: 문자열 정렬)
						</li>
						<li>
							<code>reverse()</code> - 배열 순서 뒤집기
						</li>
						<li>
							<code>set(items)</code> - 전체 배열 교체
						</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const UtilityMethods = () => {
	const [array, operations] = useArray<number>({ initialValue: [1, 2, 3, 4, 5] });

	const handleGet = () => {
		const item = operations.get(2);
		alert('인덱스 2의 아이템: ' + item);
	};

	const handleFirst = () => {
		const first = operations.first();
		alert('첫 번째 아이템: ' + first);
	};

	const handleLast = () => {
		const last = operations.last();
		alert('마지막 아이템: ' + last);
	};

	return (
		<ToggleComponent
			code={utilityMethodsCode}
			title='유틸리티 메서드'
			description='배열 유틸리티 메서드들을 보여줍니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>유틸리티 메서드</h3>
				<p>배열 유틸리티 메서드들을 보여줍니다.</p>

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
							<strong>현재 배열:</strong> {JSON.stringify(array)}
						</p>
						<p>
							<strong>길이:</strong> {operations.length}
						</p>
						<p>
							<strong>비어있나요?</strong> {operations.isEmpty ? '예' : '아니오'}
						</p>
						<p>
							<strong>비어있지 않나요?</strong> {operations.isNotEmpty ? '예' : '아니오'}
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>유틸리티 메서드</h4>
					<div
						style={{
							display: 'flex',
							gap: '10px',
							marginBottom: '15px',
							flexWrap: 'wrap',
						}}
					>
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
							📋 인덱스 2 가져오기
						</button>
						<button
							onClick={handleFirst}
							style={{
								padding: '10px 15px',
								backgroundColor: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🥇 첫 번째 아이템
						</button>
						<button
							onClick={handleLast}
							style={{
								padding: '10px 15px',
								backgroundColor: '#6f42c1',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🥉 마지막 아이템
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
						<strong>🔧 유틸리티 속성:</strong>
					</p>
					<ul>
						<li>
							<code>length</code> - 배열 길이
						</li>
						<li>
							<code>isEmpty</code> - 빈 배열 여부
						</li>
						<li>
							<code>isNotEmpty</code> - 비어있지 않은 배열 여부
						</li>
						<li>
							<code>get(index)</code> - 특정 인덱스의 아이템
						</li>
						<li>
							<code>first()</code> - 첫 번째 아이템
						</li>
						<li>
							<code>last()</code> - 마지막 아이템
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

	const [array, operations] = useArray<User>({
		initialValue: [
			{ id: 1, name: 'Alice', age: 25 },
			{ id: 2, name: 'Bob', age: 30 },
			{ id: 3, name: 'Charlie', age: 35 },
		],
	});

	const handleAddUser = () => {
		operations.push({ id: 4, name: 'David', age: 28 });
	};

	const handleRemoveUser = () => {
		operations.remove((user) => user.age > 30);
	};

	const handleUpdateUser = () => {
		operations.updateAt(0, { id: 1, name: 'Alice Updated', age: 26 });
	};

	const handleFindUser = () => {
		const user = operations.find((user) => user.name === 'Bob');
		alert('Bob 찾기: ' + (user ? JSON.stringify(user) : '찾을 수 없음'));
	};

	return (
		<ToggleComponent
			code={complexObjectCode}
			title='복잡한 객체 배열'
			description='복잡한 객체 배열에서의 사용법을 보여줍니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>복잡한 객체 배열</h3>
				<p>복잡한 객체 배열에서의 사용법을 보여줍니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<h4>사용자 목록</h4>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
						}}
					>
						{array.length === 0 ? (
							<p>사용자가 없습니다.</p>
						) : (
							<ul style={{ margin: 0, paddingLeft: '20px' }}>
								{array.map((user) => (
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
							onClick={handleRemoveUser}
							style={{
								padding: '10px 15px',
								backgroundColor: '#dc3545',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🗑️ 30세 이상 제거
						</button>
						<button
							onClick={handleUpdateUser}
							style={{
								padding: '10px 15px',
								backgroundColor: '#ffc107',
								color: 'black',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							✏️ Alice 정보 업데이트
						</button>
						<button
							onClick={handleFindUser}
							style={{
								padding: '10px 15px',
								backgroundColor: '#17a2b8',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🔍 Bob 찾기
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
						<strong>💡 객체 배열 특징:</strong>
					</p>
					<ul>
						<li>타입 안전성: 제네릭 타입으로 객체 구조 정의</li>
						<li>조건부 검색: 객체 속성을 기준으로 검색</li>
						<li>조건부 제거: 객체 속성을 기준으로 필터링</li>
						<li>부분 업데이트: 특정 인덱스의 객체 속성 변경</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const DebugMode = () => {
	const [array, operations] = useArray<number>({
		initialValue: [1, 2, 3],
		debug: true,
	});

	const handlePush = () => operations.push(Math.floor(Math.random() * 100));
	const handlePop = () => operations.pop();

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
							<strong>현재 배열:</strong> {JSON.stringify(array)}
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
							onClick={handlePush}
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
							onClick={handlePop}
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
						<li>모든 배열 조작이 콘솔에 로그 출력</li>
						<li>개발 중 문제 해결에 유용</li>
						<li>배열 상태 변화 추적 가능</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const ComprehensiveExample = () => {
	const [array, operations] = useArray<number>({ initialValue: [1, 2, 3] });

	const handleComplexOperations = () => {
		// 여러 연속 작업 수행
		operations.push(4);
		operations.unshift(0);
		operations.insertAt(2, 10);
		operations.sort((a, b) => a - b);
		operations.reverse();
	};

	const handleReset = () => {
		operations.set([1, 2, 3]);
	};

	return (
		<ToggleComponent
			code={comprehensiveExampleCode}
			title='종합 예제'
			description='useArray의 모든 기능을 종합적으로 보여주는 예제입니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>종합 예제</h3>
				<p>useArray의 모든 기능을 종합적으로 보여주는 예제입니다.</p>

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
							<strong>현재 배열:</strong> {JSON.stringify(array)}
						</p>
						<p>
							<strong>길이:</strong> {operations.length}
						</p>
						<p>
							<strong>첫 번째:</strong> {operations.first()}
						</p>
						<p>
							<strong>마지막:</strong> {operations.last()}
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
						<li>배열 조작: push, unshift, insertAt</li>
						<li>정렬 및 변환: sort, reverse</li>
						<li>유틸리티: length, first, last, isEmpty</li>
						<li>상태 관리: set으로 초기화</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

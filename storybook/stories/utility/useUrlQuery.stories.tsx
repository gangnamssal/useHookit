// import type { Meta, StoryObj } from '@storybook/react';
import { useUrlQuery } from '@/utility/useUrlQuery';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'Utility/useUrlQuery',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
A React hook that provides declarative URL query parameter management with comprehensive query manipulation methods. Simplifies URL query operations like getting, setting, removing, and synchronizing query parameters while maintaining type safety and performance.

### API

#### Parameters
- **initialQuery**: T extends Record<string, any> - Initial query parameters object (URL query overrides initial values)
- **options**: UseUrlQueryOptions (optional) - Configuration options for URL query management
- **options.syncWithUrl**: boolean (optional, default: true) - Whether to automatically sync with URL
- **options.historyMode**: 'push' | 'replace' (optional, default: 'push') - History API mode for URL updates
- **options.encoding**: 'decodeURIComponent' | 'decodeURI' | 'none' (optional, default: 'decodeURIComponent') - Encoding method for query parsing
- **options.batchUpdates**: boolean (optional, default: false) - Enable batch updates for performance optimization
- **Usage Example**: useUrlQuery({ page: 1, search: '' }, { historyMode: 'replace', batchUpdates: true });

#### Return Value
- **Type**: UseUrlQueryReturn<T>
- **Description**: Returns query state and operations object
- **Usage Example**: const { query, set, get, clear } = useUrlQuery({ page: 1, search: '' });

#### Return Value Properties

**State Properties:**
- **query**: T - Current query parameters object
- **isEmpty**: boolean - Is query empty (memoized)
- **queryString**: string - Current URL query string (memoized)

**Basic Operations:**
- **get(key)**: (key: keyof T) => T[keyof T] \| undefined - Get specific query parameter value
- **set(key, value)**: (key: keyof T, value: T[keyof T]) => void - Set specific query parameter
- **remove(key)**: (key: keyof T) => void - Remove specific query parameter
- **clear()**: () => void - Clear all query parameters

**Convenience Operations:**
- **setMultiple(params)**: (params: Partial<T>) => void - Set multiple query parameters at once
- **removeMultiple(keys)**: (keys: (keyof T)[]) => void - Remove multiple query parameters at once
- **batchUpdate(updates)**: (updates: Array<{ key: keyof T; value: T[keyof T] \| undefined }>) => void - Batch update function (when batchUpdates is true)

#### Query Operations

**Basic Operations:**
- **get(key)**: Get specific query parameter value
- **set(key, value)**: Set specific query parameter
- **remove(key)**: Remove specific query parameter
- **clear()**: Clear all query parameters

**Convenience Methods:**
- **setMultiple(params)**: Set multiple query parameters at once
- **removeMultiple(keys)**: Remove multiple query parameters at once
- **batchUpdate(updates)**: Batch update multiple parameters (when enabled)

**Query State:**
- **isEmpty**: boolean - Is query empty (memoized)
- **queryString**: string - Current URL query string (memoized)

**URL Synchronization:**
- **Automatic URL sync**: Query changes automatically update URL
- **History management**: Support for push/replace history modes
- **Encoding options**: Flexible encoding for query parameter parsing (decodeURIComponent, decodeURI, none)

- **Popstate handling**: Browser back/forward button support
- **Hash preservation**: URL hash is preserved during query updates
- **Initial URL parsing**: URL query parameters override initial values on mount
- **Key validation**: Only keys present in initialQuery are processed from URL

**Performance Features:**
- **Safe JSON handling**: Robust JSON serialization/deserialization with fallback
- **Batch updates**: Multiple changes in single state update (when enabled)
- **Memoization**: Optimized computed values (isEmpty, queryString)
- **Memory optimization**: Minimal memory footprint
- **Type conversion**: Automatic type conversion for numbers, booleans, arrays
- **Empty value handling**: Consistent empty value detection (undefined, null, '', empty arrays)
- **Conditional rendering**: batchUpdate only available when batchUpdates: true
- **URL filtering**: Only non-empty values are added to URL query string


### Usage Examples

\`\`\`tsx
// Basic URL query management
const { query, set, get, clear, isEmpty, queryString } = useUrlQuery({
  page: 1,
  search: '',
  category: 'all',
  isActive: false
});

const handlePageChange = () => set('page', 2);
const handleSearch = () => set('search', 'new search');
const handleClear = () => clear();
const currentPage = get('page');

return (
  <div>
    <p>Query: {JSON.stringify(query)}</p>
    <p>Current Page: {currentPage}</p>
    <p>Query String: {queryString}</p>
    <p>Empty: {isEmpty ? 'Yes' : 'No'}</p>
    <p>URL automatically updates when query changes</p>
    <p>Initial values are merged with URL query parameters</p>
    <button onClick={handlePageChange}>Next Page</button>
    <button onClick={handleSearch}>Search</button>
    <button onClick={handleClear}>Clear</button>
  </div>
);

// Multiple parameter operations
const { query, setMultiple, removeMultiple, isEmpty } = useUrlQuery({
  page: 1,
  search: '',
  category: 'all',
  sortBy: 'name',
  filters: { price: { min: 0, max: 100 }, brand: [] },
  tags: []
});

const handleBulkUpdate = () => {
  setMultiple({
    page: 5,
    search: 'advanced search',
    category: 'electronics',
    sortBy: 'price',
    filters: { price: { min: 10, max: 500 }, brand: ['apple', 'samsung'] },
    tags: ['premium', 'new']
  });
};

const handleRemoveFilters = () => {
  removeMultiple(['filters', 'sortBy']);
};

return (
  <div>
    <p>Query: {JSON.stringify(query)}</p>
    <p>Empty: {isEmpty ? 'Yes' : 'No'}</p>
    <button onClick={handleBulkUpdate}>Bulk Update</button>
    <button onClick={handleRemoveFilters}>Remove Filters</button>
  </div>
);

// Options and configuration
const { query, set, clear } = useUrlQuery(
  { page: 1, search: '' },
  { 
    historyMode: 'replace', 
    syncWithUrl: true,
    encoding: 'decodeURIComponent',
    batchUpdates: true
  }
);

const handleReplaceMode = () => set('page', 10);
const handleClear = () => clear();

return (
  <div>
    <p>Query: {JSON.stringify(query)}</p>
    <button onClick={handleReplaceMode}>Set Page 10</button>
    <button onClick={handleClear}>Clear</button>
  </div>
);

// Batch updates for performance (only available when batchUpdates: true)
const { query, batchUpdate } = useUrlQuery(
  { page: 1, search: '', category: '' },
  { batchUpdates: true }
);

const handleBatchUpdate = () => {
  batchUpdate([
    { key: 'page', value: 5 },
    { key: 'search', value: 'batch update' },
    { key: 'category', value: undefined }
  ]);
};

return (
  <div>
    <p>Query: {JSON.stringify(query)}</p>
    <button onClick={handleBatchUpdate}>Batch Update</button>
  </div>
);

// Complex objects and arrays with safe JSON handling
const { query, set, get } = useUrlQuery({
  page: 1,
  filters: { category: 'all', price: { min: 0, max: 100 } },
  tags: [],
  data: null
});

const handleComplexUpdate = () => {
  set('filters', { category: 'electronics', price: { min: 10, max: 500 } });
  set('tags', ['premium', 'new']);
  set('data', { nested: { deep: { array: [1, 2, 3] } } });
};

const handleSafeJsonUpdate = () => {
  // Circular reference handling with safeStringify
  try {
    const circularObj = { name: 'test' };
    circularObj.self = circularObj;
    set('data', circularObj);
  } catch (error) {
    // safeStringify가 순환 참조를 안전하게 처리
    set('data', '[Circular Reference]');
  }
};

const handleEmptyValues = () => {
  // Empty values are filtered from URL
  set('search', '');
  set('data', null);
  set('tags', []);
};

return (
  <div>
    <p>Query: {JSON.stringify(query)}</p>
    <p>Empty values are excluded from URL query string</p>
    <button onClick={handleComplexUpdate}>Complex Update</button>
    <button onClick={handleSafeJsonUpdate}>Safe JSON Update</button>
    <button onClick={handleEmptyValues}>Empty Values</button>
  </div>
);

// URL synchronization and popstate handling
const { query, queryString, isEmpty } = useUrlQuery({
  page: 1,
  search: '',
  category: 'all'
});

return (
  <div>
    <p>Query: {JSON.stringify(query)}</p>
    <p>Query String: {queryString}</p>
    <p>Empty: {isEmpty ? 'Yes' : 'No'}</p>
    <p>URL automatically syncs with query changes</p>
    <p>Browser back/forward buttons work correctly</p>
    <p>URL hash is preserved during updates</p>
  </div>
);

// Edge cases and error handling
const { query, set, get } = useUrlQuery({
  page: 1,
  search: '',
  data: null
});

const handleEdgeCases = () => {
  set('search', 'special chars: &?=#'); // URL encoding handled automatically
  set('data', { nested: { deep: { array: [1, 2, 3] } } });
  set('page', 0); // Zero values are handled correctly
};

const handleInvalidJson = () => {
  // safeParse handles invalid JSON gracefully
  set('data', 'invalid-json-string');
};

const handleEmptyValues = () => {
  set('search', ''); // Empty string
  set('data', null); // Null value
  set('page', undefined); // Undefined value
};

const handleTypeConversion = () => {
  set('page', '5'); // String to number conversion
  set('isActive', 'true'); // String to boolean conversion
  set('tags', 'apple,banana'); // String to array conversion
};

return (
  <div>
    <p>Query: {JSON.stringify(query)}</p>
    <button onClick={handleEdgeCases}>Edge Cases</button>
    <button onClick={handleInvalidJson}>Invalid JSON</button>
    <button onClick={handleEmptyValues}>Empty Values</button>
    <button onClick={handleTypeConversion}>Type Conversion</button>
  </div>
);

// Encoding options example
const { query, set } = useUrlQuery(
  { page: 1, search: '' },
  { encoding: 'decodeURIComponent' }
);

const handleEncodingTest = () => {
  set('page', 5);
  set('search', 'special chars: &?=#');
};

const handleDifferentEncoding = () => {
  // Different encoding options available
  set('search', 'special chars: &?=#');
};

return (
  <div>
    <p>Query: {JSON.stringify(query)}</p>
    <p>Supports different encoding options</p>
    <button onClick={handleEncodingTest}>Encoding Test</button>
    <button onClick={handleDifferentEncoding}>Special Characters</button>
  </div>
);

// Initial URL parsing and key validation
const { query, set } = useUrlQuery({
  page: 1,
  search: '',
  category: 'all'
});

// Only keys in initialQuery are processed from URL
// URL query parameters override initial values
const handleKeyValidation = () => {
  // This will be ignored if 'unknown' is not in initialQuery
  set('unknown' as any, 'value');
};

return (
  <div>
    <p>Query: {JSON.stringify(query)}</p>
    <p>Only initialQuery keys are processed from URL</p>
    <button onClick={handleKeyValidation}>Test Key Validation</button>
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
	tags: ['utility', 'url', 'query', 'state-management', 'autodocs'],
};

// 코드 예시 문자열
const basicCode = `const { query, set, get, clear, isEmpty, queryString } = useUrlQuery({
  page: 1,
  search: '',
  category: 'all',
  isActive: false
});

// 기본 조작
set('page', 2);
const currentPage = get('page');
clear();

// 상태 확인
console.log('Query:', query);
console.log('Query String:', queryString);
console.log('Is Empty:', isEmpty);`;

const advancedCode = `const { query, setMultiple, removeMultiple, isEmpty } = useUrlQuery({
  page: 1,
  search: '',
  category: 'all',
  sortBy: 'name',
  filters: { price: { min: 0, max: 100 }, brand: [] },
  tags: []
});

// 여러 파라미터 한번에 설정
setMultiple({
  page: 5,
  search: '고급 검색',
  category: 'electronics',
  sortBy: 'price',
  filters: { price: { min: 10, max: 500 }, brand: ['apple', 'samsung'] },
  tags: ['premium', 'new']
});

// 여러 파라미터 한번에 제거
removeMultiple(['filters', 'tags']);

// 상태 확인
console.log('Query:', query);
console.log('Is Empty:', isEmpty);`;

const optionsCode = `const { query, set, clear } = useUrlQuery(
  { page: 1, search: '' },
  { 
    historyMode: 'replace', 
    syncWithUrl: true,
    encoding: 'decodeURIComponent',
    batchUpdates: false
  }
);

// 옵션을 사용한 조작
set('page', 10);
set('search', '옵션 테스트');
clear();

// 상태 확인
console.log('Query:', query);`;

const performanceCode = `// 배치 업데이트 사용 (batchUpdates: true 필요)
const { query, batchUpdate } = useUrlQuery(
  { page: 1, search: '', category: '' },
  { batchUpdates: true }
);

// 여러 변경사항을 한 번에 처리
batchUpdate([
  { key: 'page', value: 5 },
  { key: 'search', value: '배치 업데이트' },
  { key: 'category', value: undefined }
]);

// 안전한 JSON 처리
const { query, set } = useUrlQuery({ data: null });

// 순환 참조가 있는 객체도 안전하게 처리
try {
  const circularObj = { name: 'test' };
  circularObj.self = circularObj;
  set('data', circularObj);
} catch (error) {
  // safeStringify가 순환 참조를 안전하게 처리
  set('data', '[Circular Reference]');
}

// 상태 확인
console.log('Query:', query);`;

// 기본 사용법 컴포넌트
const BasicExample = () => {
	const { query, set, get, clear, isEmpty, queryString } = useUrlQuery({
		page: 1,
		search: '',
		category: 'all',
		isActive: false,
	});

	return (
		<ToggleComponent
			code={basicCode}
			title='기본 사용법'
			description='useUrlQuery의 기본적인 사용법을 보여줍니다.'
		>
			<div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
				<h3>URL 쿼리 파라미터 관리</h3>

				<div style={{ marginBottom: '20px' }}>
					<h4>현재 쿼리 상태:</h4>
					<pre
						style={{
							background: '#f5f5f5',
							padding: '10px',
							borderRadius: '4px',
							fontSize: '12px',
						}}
					>
						{JSON.stringify(query, null, 2)}
					</pre>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>쿼리 스트링:</h4>
					<code
						style={{
							background: '#e8f4fd',
							padding: '5px',
							borderRadius: '3px',
							fontSize: '12px',
						}}
					>
						{queryString || '(empty)'}
					</code>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>상태 정보:</h4>
					<p>비어있음: {isEmpty ? '예' : '아니오'}</p>
					<p>현재 페이지: {get('page')}</p>
					<p>검색어: {get('search') || '(없음)'}</p>
					<p>카테고리: {get('category')}</p>
					<p>활성화됨: {get('isActive') ? '예' : '아니오'}</p>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>액션:</h4>
					<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
						<button
							onClick={() => set('page', ((get('page') as number) || 1) + 1)}
							style={{
								padding: '8px 12px',
								background: '#007bff',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
							}}
						>
							페이지 증가
						</button>

						<button
							onClick={() => set('search', '새로운 검색어')}
							style={{
								padding: '8px 12px',
								background: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
							}}
						>
							검색어 설정
						</button>

						<button
							onClick={() => set('category', 'electronics')}
							style={{
								padding: '8px 12px',
								background: '#ffc107',
								color: 'black',
								border: 'none',
								borderRadius: '4px',
							}}
						>
							카테고리 변경
						</button>

						<button
							onClick={() => set('isActive', !get('isActive'))}
							style={{
								padding: '8px 12px',
								background: '#6f42c1',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
							}}
						>
							활성화 토글
						</button>

						<button
							onClick={clear}
							style={{
								padding: '8px 12px',
								background: '#dc3545',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
							}}
						>
							모두 초기화
						</button>
					</div>
				</div>
			</div>
		</ToggleComponent>
	);
};

// 고급 사용법 컴포넌트
const AdvancedExample = () => {
	const { query, setMultiple, removeMultiple, isEmpty, queryString } = useUrlQuery<{
		page: number;
		search: string;
		category: string;
		sortBy: string;
		filters: { price: { min: number; max: number }; brand: string[] };
		tags: string[];
	}>({
		page: 1,
		search: '',
		category: 'all',
		sortBy: 'name',
		filters: { price: { min: 0, max: 100 }, brand: [] },
		tags: [],
	});

	const handleBulkUpdate = () => {
		setMultiple({
			page: 5,
			search: '고급 검색',
			category: 'electronics',
			sortBy: 'price',
			filters: { price: { min: 10, max: 500 }, brand: ['apple', 'samsung'] },
			tags: ['premium', 'new'],
		});
	};

	const handleRemoveFilters = () => {
		removeMultiple(['filters', 'tags']);
	};

	return (
		<ToggleComponent
			code={advancedCode}
			title='고급 사용법'
			description='복잡한 객체와 배열을 포함한 고급 사용법을 보여줍니다.'
		>
			<div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
				<h3>고급 사용법 - 복잡한 객체와 배열</h3>

				<div style={{ marginBottom: '20px' }}>
					<h4>현재 쿼리 상태:</h4>
					<pre
						style={{
							background: '#f5f5f5',
							padding: '10px',
							borderRadius: '4px',
							fontSize: '11px',
							maxHeight: '200px',
							overflow: 'auto',
						}}
					>
						{JSON.stringify(query, null, 2)}
					</pre>
				</div>

				{/* 쿼리 스트링 표시 */}
				<div style={{ marginBottom: '20px' }}>
					<h4>쿼리 스트링:</h4>
					<code
						style={{
							background: '#e8f4fd',
							padding: '5px',
							borderRadius: '3px',
							fontSize: '12px',
						}}
					>
						{queryString || '(empty)'}
					</code>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>액션:</h4>
					<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
						<button
							onClick={handleBulkUpdate}
							style={{
								padding: '8px 12px',
								background: '#007bff',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
							}}
						>
							복잡한 필터 설정
						</button>

						<button
							onClick={handleRemoveFilters}
							style={{
								padding: '8px 12px',
								background: '#dc3545',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
							}}
						>
							필터 제거
						</button>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>상태 정보:</h4>
					<p>비어있음: {isEmpty ? '예' : '아니오'}</p>
					<p>페이지: {query.page}</p>
					<p>검색어: {query.search || '(없음)'}</p>
					<p>카테고리: {query.category}</p>
					<p>정렬 기준: {query.sortBy}</p>
					<p>필터 개수: {query.filters ? Object.keys(query.filters).length : 0}</p>
					<p>태그 개수: {Array.isArray(query.tags) ? query.tags.length : 0}</p>
				</div>
			</div>
		</ToggleComponent>
	);
};

// 옵션 사용법 컴포넌트
const OptionsExample = () => {
	const { query, set, clear } = useUrlQuery(
		{ page: 1, search: '' },
		{
			historyMode: 'replace',
			syncWithUrl: true,
			encoding: 'decodeURIComponent',
			batchUpdates: false,
		},
	);

	return (
		<ToggleComponent
			code={optionsCode}
			title='옵션 사용법'
			description='다양한 옵션을 사용한 고급 설정을 보여줍니다.'
		>
			<div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
				<h3>옵션 사용법</h3>
				<p>
					<strong>historyMode: 'replace'</strong> - URL 변경 시 replaceState 사용
				</p>

				<div style={{ marginBottom: '20px' }}>
					<h4>현재 쿼리:</h4>
					<pre
						style={{
							background: '#f5f5f5',
							padding: '10px',
							borderRadius: '4px',
							fontSize: '12px',
						}}
					>
						{JSON.stringify(query, null, 2)}
					</pre>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>액션:</h4>
					<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
						<button
							onClick={() => set('page', 10)}
							style={{
								padding: '8px 12px',
								background: '#007bff',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
							}}
						>
							페이지 10으로 설정
						</button>

						<button
							onClick={() => set('search', '옵션 테스트')}
							style={{
								padding: '8px 12px',
								background: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
							}}
						>
							검색어 설정
						</button>

						<button
							onClick={clear}
							style={{
								padding: '8px 12px',
								background: '#dc3545',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
							}}
						>
							초기화
						</button>
					</div>
				</div>
			</div>
		</ToggleComponent>
	);
};

// 성능 최적화 예시 컴포넌트
const PerformanceExample = () => {
	const { query, batchUpdate } = useUrlQuery(
		{ page: 1, search: '', category: '', data: null as any },
		{ batchUpdates: true },
	);

	const handleBatchUpdate = () => {
		// batchUpdate는 batchUpdates: true일 때만 사용 가능
		if (batchUpdate) {
			batchUpdate([
				{ key: 'page', value: 5 },
				{ key: 'search', value: '배치 업데이트 테스트' },
				{ key: 'category', value: 'electronics' },
				{ key: 'data', value: undefined },
			]);
		}
	};

	const handleSafeJsonUpdate = () => {
		try {
			// 순환 참조가 있는 객체 생성
			const circularObj: any = { name: '순환 참조 테스트', items: [] };
			circularObj.self = circularObj;
			circularObj.items.push(circularObj);

			if (batchUpdate) {
				batchUpdate([{ key: 'data', value: circularObj }]);
			}
		} catch (error) {
			console.log('순환 참조 객체 처리 중 에러:', error);
			// 에러가 발생해도 안전하게 처리됨
			if (batchUpdate) {
				batchUpdate([{ key: 'data', value: '[Circular Reference]' }]);
			}
		}
	};

	const handleComplexObjectUpdate = () => {
		const complexObj = {
			nested: {
				deep: {
					array: [1, 2, 3],
					object: { key: 'value' },
				},
			},
			items: [
				{ id: 1, name: '아이템 1' },
				{ id: 2, name: '아이템 2' },
			],
		};

		if (batchUpdate) {
			batchUpdate([{ key: 'data', value: complexObj }]);
		}
	};

	return (
		<ToggleComponent
			code={performanceCode}
			title='성능 최적화 예시'
			description='배치 업데이트와 안전한 JSON 처리를 보여줍니다.'
		>
			<div style={{ padding: '20px' }}>
				<h3>성능 최적화 기능</h3>
				<p>배치 업데이트와 안전한 JSON 처리를 통한 성능 최적화를 보여줍니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<h4>현재 상태:</h4>
					<pre style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
						{JSON.stringify(query, null, 2)}
					</pre>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>액션:</h4>
					<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
						<button
							onClick={handleBatchUpdate}
							style={{
								padding: '8px 12px',
								background: '#007bff',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
							}}
						>
							배치 업데이트 실행
						</button>

						<button
							onClick={handleSafeJsonUpdate}
							style={{
								padding: '8px 12px',
								background: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
							}}
						>
							안전한 JSON 처리 테스트
						</button>

						<button
							onClick={handleComplexObjectUpdate}
							style={{
								padding: '8px 12px',
								background: '#ffc107',
								color: 'black',
								border: 'none',
								borderRadius: '4px',
							}}
						>
							복잡한 객체 처리
						</button>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>특징:</h4>
					<ul>
						<li>
							<strong>배치 업데이트:</strong> 여러 변경사항을 한 번에 처리하여 성능 향상
						</li>
						<li>
							<strong>안전한 JSON 처리:</strong> 순환 참조나 복잡한 객체도 안전하게 처리
						</li>
						<li>
							<strong>메모리 최적화:</strong> 불필요한 리렌더링 방지
						</li>
						<li>
							<strong>에러 처리:</strong> 잘못된 JSON도 fallback으로 처리
						</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const Basic = {
	render: () => <BasicExample />,
	parameters: {
		docs: {
			description: {
				story: '기본적인 URL 쿼리 파라미터 관리 사용법을 보여줍니다.',
			},
		},
		layout: 'centered',
		viewport: {
			defaultViewport: 'desktop',
		},
	},
};

export const Advanced = {
	render: () => <AdvancedExample />,
	parameters: {
		docs: {
			description: {
				story: '복잡한 객체와 배열을 포함한 고급 사용법을 보여줍니다.',
			},
		},
		layout: 'centered',
		viewport: {
			defaultViewport: 'desktop',
		},
	},
};

export const WithOptions = {
	render: () => <OptionsExample />,
	parameters: {
		docs: {
			description: {
				story: '다양한 옵션을 사용한 고급 설정을 보여줍니다.',
			},
		},
		layout: 'centered',
		viewport: {
			defaultViewport: 'desktop',
		},
	},
};

export const Performance = {
	render: () => <PerformanceExample />,
	parameters: {
		docs: {
			description: {
				story: '배치 업데이트와 안전한 JSON 처리를 통한 성능 최적화를 보여줍니다.',
			},
		},
		layout: 'centered',
		viewport: {
			defaultViewport: 'desktop',
		},
	},
};

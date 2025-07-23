import React, { useState } from 'react';
import { useLoading } from '../../src/utility/useLoading';
import { ToggleComponent } from '../components/ToggleComponent';

export default {
	title: 'Utility/useLoading',
	parameters: {
		layout: 'centered',
	},
};

// 코드 스니펫들
const basicCode = `const { isLoading, withLoading, wrapAsync } = useLoading();

// withLoading 사용
const handleWithLoading = async () => {
  const result = await withLoading(someAsyncTask());
  setResult(result);
};

// wrapAsync 사용
const handleWrapAsync = async () => {
  const result = await wrapAsync(async () => {
    return await someAsyncTask();
  });
  setResult(result);
};`;

const delayAndMinTimeCode = `const { isLoading, withLoading } = useLoading({
  delay: 500,
  minLoadingTime: 2000,
});

const handleTask = async () => {
  const result = await withLoading(someTask());
  setResult(result);
};`;

function UseLoadingDemo() {
	const [result, setResult] = useState<string>('');

	const { isLoading, startLoading, stopLoading, toggleLoading, state, withLoading, wrapAsync } =
		useLoading({
			delay: 0, // 즉시 로딩 상태 변경
			minLoadingTime: 0, // 최소 로딩 시간 없음
			onLoadingChange: (loading) => {
				console.log('로딩 상태 변경:', loading ? '시작' : '종료');
			},
		});

	const simulateAsyncTask = async (duration: number = 2000) => {
		return new Promise<string>((resolve) => {
			setTimeout(() => {
				resolve(`작업이 ${duration}ms 후에 완료되었습니다!`);
			}, duration);
		});
	};

	const handleManualLoading = async () => {
		console.log('수동 로딩 시작, 현재 상태:', isLoading);
		startLoading();
		console.log('startLoading 호출 후 상태:', isLoading);

		try {
			console.log('비동기 작업 시작');
			const result = await simulateAsyncTask(3000);
			console.log('비동기 작업 완료:', result);
			setResult(result);
		} catch (error) {
			console.error('수동 로딩 중 오류:', error);
		} finally {
			console.log('수동 로딩 종료, 현재 상태:', isLoading);
			stopLoading();
			console.log('stopLoading 호출 후 상태:', isLoading);
		}
	};

	const handleWithLoading = async () => {
		console.log('withLoading 시작');
		try {
			const result = await withLoading(simulateAsyncTask(2500));
			console.log('withLoading 완료:', result);
			setResult(result);
		} catch (error) {
			console.error('withLoading 중 오류:', error);
		}
	};

	const handleWrapAsync = async () => {
		try {
			const result = await wrapAsync(async () => {
				return await simulateAsyncTask(2000);
			});
			setResult(result);
		} catch (err) {
			console.error('wrapAsync 실행 실패:', err);
		}
	};

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>useLoading 훅 데모</h3>
			<p>로딩 상태를 선언적으로 관리하는 훅입니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<h4>상태 정보</h4>
				<div
					style={{
						padding: '15px',
						backgroundColor: '#f8f9fa',
						borderRadius: '4px',
						border: '1px solid #dee2e6',
					}}
				>
					<p>
						<strong>로딩 상태:</strong> {isLoading ? '🔄 로딩 중...' : '⏸️ 대기 중'} (
						{isLoading ? 'true' : 'false'})
					</p>
					<p>
						<strong>상태 변경 시간:</strong> {new Date().toLocaleTimeString()}
					</p>
					<p>
						<strong>시작 시간:</strong>{' '}
						{state.startTime ? state.startTime.toLocaleTimeString() : '없음'}
					</p>
					<p>
						<strong>지속 시간:</strong> {state.duration}ms
					</p>
					<p>
						<strong>종료 시간:</strong>{' '}
						{state.endTime ? state.endTime.toLocaleTimeString() : '없음'}
					</p>
				</div>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>수동 제어</h4>
				<div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
					<button
						onClick={handleManualLoading}
						disabled={isLoading}
						style={{
							padding: '10px 20px',
							backgroundColor: isLoading ? '#6c757d' : '#007bff',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: isLoading ? 'not-allowed' : 'pointer',
							opacity: isLoading ? 0.6 : 1,
						}}
					>
						{isLoading ? '🔄 처리 중...' : '📝 수동 로딩'}
					</button>

					<button
						onClick={toggleLoading}
						style={{
							padding: '10px 20px',
							backgroundColor: '#ffc107',
							color: 'black',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						🔄 토글
					</button>
				</div>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>withLoading 사용</h4>
				<div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
					<button
						onClick={handleWithLoading}
						disabled={isLoading}
						style={{
							padding: '10px 20px',
							backgroundColor: isLoading ? '#6c757d' : '#28a745',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: isLoading ? 'not-allowed' : 'pointer',
							opacity: isLoading ? 0.6 : 1,
						}}
					>
						{isLoading ? '🔄 처리 중...' : '⚡ withLoading'}
					</button>
				</div>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>wrapAsync 사용</h4>
				<div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
					<button
						onClick={handleWrapAsync}
						disabled={isLoading}
						style={{
							padding: '10px 20px',
							backgroundColor: isLoading ? '#6c757d' : '#17a2b8',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: isLoading ? 'not-allowed' : 'pointer',
							opacity: isLoading ? 0.6 : 1,
						}}
					>
						{isLoading ? '🔄 처리 중...' : '🎯 wrapAsync'}
					</button>
				</div>
			</div>

			{result && (
				<div
					style={{
						padding: '15px',
						backgroundColor: '#d4edda',
						borderRadius: '4px',
						border: '1px solid #c3e6cb',
						marginBottom: '20px',
					}}
				>
					<p>
						<strong>결과:</strong> {result}
					</p>
				</div>
			)}

			<div
				style={{
					padding: '15px',
					backgroundColor: '#e7f3ff',
					borderRadius: '4px',
					border: '1px solid #b3d9ff',
				}}
			>
				<p>
					<strong>💡 사용법:</strong>
				</p>
				<ul>
					<li>
						<strong>수동 제어:</strong> startLoading() / stopLoading() 직접 호출
					</li>
					<li>
						<strong>withLoading:</strong> Promise를 자동으로 로딩 상태로 감싸기
					</li>
					<li>
						<strong>wrapAsync:</strong> async 함수를 로딩 상태로 감싸기
					</li>
					<li>
						<strong>토글:</strong> toggleLoading()으로 상태 전환
					</li>
				</ul>
			</div>
		</div>
	);
}

export const Default = () => (
	<ToggleComponent
		code={basicCode}
		title='기본 사용법'
		description='useLoading 훅의 기본적인 사용법을 보여줍니다. 수동 제어, withLoading, wrapAsync 기능을 포함합니다.'
	>
		<UseLoadingDemo />
	</ToggleComponent>
);

export const ManualLoadingTest = () => {
	const [manualResult, setManualResult] = useState<string>('');

	// 수동 로딩 전용 훅
	const {
		isLoading: isManualLoading,
		startLoading,
		stopLoading,
	} = useLoading({
		delay: 0,
		minLoadingTime: 0,
		onLoadingChange: (loading) => {
			console.log('수동 로딩 상태 변경:', loading ? '시작' : '종료');
		},
	});

	const simulateAsyncTask = async (duration: number = 2000) => {
		return new Promise<string>((resolve) => {
			setTimeout(() => {
				resolve(`작업이 ${duration}ms 후에 완료되었습니다!`);
			}, duration);
		});
	};

	const handleManualTest = async () => {
		console.log('=== 수동 로딩 테스트 시작 ===');
		console.log('초기 상태:', isManualLoading);

		startLoading();
		console.log('startLoading 호출 후:', isManualLoading);

		try {
			const result = await simulateAsyncTask(3000);
			setManualResult(result);
			console.log('작업 완료:', result);
		} finally {
			stopLoading();
			console.log('stopLoading 호출 후:', isManualLoading);
		}
	};

	return (
		<ToggleComponent
			code={`const { isLoading, startLoading, stopLoading } = useLoading({
  delay: 0,
  minLoadingTime: 0,
});

const handleManualTest = async () => {
  startLoading();
  try {
    const result = await someAsyncTask();
    setResult(result);
  } finally {
    stopLoading();
  }
};`}
			title='수동 로딩 테스트'
			description='수동 로딩 기능을 독립적으로 테스트합니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>수동 로딩 테스트</h3>
				<p>수동 로딩 기능을 독립적으로 테스트합니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<h4>상태 정보</h4>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
						}}
					>
						<p>
							<strong>로딩 상태:</strong> {isManualLoading ? '🔄 로딩 중...' : '⏸️ 대기 중'} (
							{isManualLoading ? 'true' : 'false'})
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>수동 로딩 테스트</h4>
					<button
						onClick={handleManualTest}
						disabled={isManualLoading}
						style={{
							padding: '10px 20px',
							backgroundColor: isManualLoading ? '#6c757d' : '#007bff',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: isManualLoading ? 'not-allowed' : 'pointer',
							opacity: isManualLoading ? 0.6 : 1,
						}}
					>
						{isManualLoading ? '🔄 처리 중...' : '📝 수동 로딩 테스트'}
					</button>
				</div>

				{manualResult && (
					<div
						style={{
							padding: '15px',
							backgroundColor: '#d4edda',
							borderRadius: '4px',
							border: '1px solid #c3e6cb',
							marginBottom: '20px',
						}}
					>
						<p>
							<strong>결과:</strong> {manualResult}
						</p>
					</div>
				)}

				<div
					style={{
						padding: '15px',
						backgroundColor: '#fff3cd',
						borderRadius: '4px',
						border: '1px solid #ffeaa7',
					}}
				>
					<p>
						<strong>💡 테스트 방법:</strong>
					</p>
					<ul>
						<li>버튼을 클릭하면 즉시 로딩 상태가 시작됩니다</li>
						<li>3초 후 작업이 완료되면 로딩 상태가 종료됩니다</li>
						<li>개발자 도구 콘솔에서 상태 변화를 확인할 수 있습니다</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithDelayAndMinTime = () => {
	const [result, setResult] = useState<string>('');

	const { isLoading, withLoading } = useLoading({
		delay: 500, // 500ms 지연
		minLoadingTime: 2000, // 최소 2초 로딩 표시
	});

	const simulateQuickTask = async () => {
		return new Promise<string>((resolve) => {
			setTimeout(() => {
				resolve('빠른 작업이 완료되었습니다!');
			}, 100); // 100ms만 걸리는 빠른 작업
		});
	};

	const simulateSlowTask = async () => {
		return new Promise<string>((resolve) => {
			setTimeout(() => {
				resolve('느린 작업이 완료되었습니다!');
			}, 3000); // 3초 걸리는 느린 작업
		});
	};

	return (
		<ToggleComponent
			code={delayAndMinTimeCode}
			title='지연 시간과 최소 로딩 시간'
			description='로딩 상태 변경에 지연 시간과 최소 표시 시간을 설정하는 예제입니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>지연 시간과 최소 로딩 시간 예제</h3>
				<p>로딩 상태 변경에 지연 시간과 최소 표시 시간을 설정합니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<p>
						<strong>로딩 상태:</strong> {isLoading ? '🔄 로딩 중...' : '⏸️ 대기 중'}
					</p>
					<p>
						<strong>설정:</strong> 500ms 지연, 최소 2초 로딩 표시
					</p>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<button
						onClick={async () => {
							const result = await withLoading(simulateQuickTask());
							setResult(result);
						}}
						disabled={isLoading}
						style={{
							padding: '10px 20px',
							backgroundColor: '#28a745',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: isLoading ? 'not-allowed' : 'pointer',
							marginRight: '10px',
							opacity: isLoading ? 0.6 : 1,
						}}
					>
						{isLoading ? '🔄 처리 중...' : '⚡ 빠른 작업'}
					</button>

					<button
						onClick={async () => {
							const result = await withLoading(simulateSlowTask());
							setResult(result);
						}}
						disabled={isLoading}
						style={{
							padding: '10px 20px',
							backgroundColor: '#dc3545',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: isLoading ? 'not-allowed' : 'pointer',
							opacity: isLoading ? 0.6 : 1,
						}}
					>
						{isLoading ? '🔄 처리 중...' : '🐌 느린 작업'}
					</button>
				</div>

				{result && (
					<div
						style={{
							padding: '15px',
							backgroundColor: '#d4edda',
							borderRadius: '4px',
							border: '1px solid #c3e6cb',
						}}
					>
						<p>
							<strong>결과:</strong> {result}
						</p>
					</div>
				)}

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
						<li>빠른 작업도 최소 2초간 로딩 상태가 표시됩니다</li>
						<li>로딩 시작에 500ms 지연이 있습니다</li>
						<li>사용자 경험을 개선하기 위한 설정입니다</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

// withLoading과 wrapAsync에 대한 자세한 설명 스토리들
const withLoadingCode = `import React, { useState } from 'react';
import { useLoading } from '../../src/utility/useLoading';

export const WithLoadingExample = () => {
	const [result, setResult] = useState<string>('');
	const { isLoading, withLoading } = useLoading();

	const fetchData = async () => {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		return '데이터 로딩 완료!';
	};

	const handleWithLoading = async () => {
		try {
			const data = await withLoading(fetchData());
			setResult(data);
		} catch (error) {
			setResult('오류 발생: ' + error);
		}
	};

	return (
		<div>
			<button onClick={handleWithLoading} disabled={isLoading}>
				{isLoading ? '로딩 중...' : '데이터 가져오기'}
			</button>
			{result && <p>결과: {result}</p>}
		</div>
	);
};`;

const wrapAsyncCode = `import React, { useState } from 'react';
import { useLoading } from '../../src/utility/useLoading';

export const WrapAsyncExample = () => {
	const [result, setResult] = useState<string>('');
	const { isLoading, wrapAsync } = useLoading();

	const handleWrapAsync = async () => {
		try {
			const data = await wrapAsync(async () => {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				return '데이터 처리 완료!';
			});
			setResult(data);
		} catch (error) {
			setResult('오류 발생: ' + error);
		}
	};

	return (
		<div>
			<button onClick={handleWrapAsync} disabled={isLoading}>
				{isLoading ? '처리 중...' : '데이터 처리'}
			</button>
			{result && <p>결과: {result}</p>}
		</div>
	);
};`;

const comparisonCode = `import React, { useState } from 'react';
import { useLoading } from '../../src/utility/useLoading';

export const ComparisonExample = () => {
	const [result1, setResult1] = useState<string>('');
	const [result2, setResult2] = useState<string>('');
	const [result3, setResult3] = useState<string>('');
	
	const { isLoading: isLoading1, withLoading } = useLoading();
	const { isLoading: isLoading2, wrapAsync } = useLoading();
	const { isLoading: isLoading3, startLoading, stopLoading } = useLoading();

	const fetchData = async () => {
		await new Promise((resolve) => setTimeout(resolve, 1500));
		return '데이터 로딩 완료!';
	};

	// 1. withLoading 사용
	const handleWithLoading = async () => {
		const data = await withLoading(fetchData());
		setResult1(data);
	};

	// 2. wrapAsync 사용
	const handleWrapAsync = async () => {
		await wrapAsync(async () => {
			const data = await fetchData();
			setResult2(data);
		});
	};

	// 3. 수동 제어
	const handleManual = async () => {
		startLoading();
		try {
			const data = await fetchData();
			setResult3(data);
		} finally {
			stopLoading();
		}
	};

	return (
		<div>
			<button onClick={handleWithLoading} disabled={isLoading1}>
				{isLoading1 ? '로딩 중...' : 'withLoading'}
			</button>
			<button onClick={handleWrapAsync} disabled={isLoading2}>
				{isLoading2 ? '로딩 중...' : 'wrapAsync'}
			</button>
			<button onClick={handleManual} disabled={isLoading3}>
				{isLoading3 ? '로딩 중...' : '수동 제어'}
			</button>
			{result1 && <p>withLoading 결과: {result1}</p>}
			{result2 && <p>wrapAsync 결과: {result2}</p>}
			{result3 && <p>수동 제어 결과: {result3}</p>}
		</div>
	);
};`;

const advancedUsageCode = `import React, { useState } from 'react';
import { useLoading } from '../../src/utility/useLoading';

export const AdvancedUsageExample = () => {
	const [results, setResults] = useState<string[]>([]);
	
	const { isLoading: isLoading1, withLoading: withLoading1 } = useLoading({
		delay: 200,
		minLoadingTime: 1000,
	});
	
	const { isLoading: isLoading2, wrapAsync: wrapAsync2 } = useLoading({
		delay: 0,
		minLoadingTime: 500,
		onLoadingChange: (loading) => {
			console.log('로딩 상태 변경:', loading);
		},
	});

	const fetchUserData = async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return '사용자 데이터';
	};

	const fetchProductData = async () => {
		await new Promise((resolve) => setTimeout(resolve, 800));
		return '상품 데이터';
	};

	const handleMultipleOperations = async () => {
		try {
			const userData = await withLoading1(fetchUserData());
			const productData = await wrapAsync2(async () => {
				const data = await fetchProductData();
				return { product: data };
			});

			setResults([userData, JSON.stringify(productData)]);
		} catch (error) {
			setResults(['오류 발생: ' + error]);
		}
	};

	return (
		<div>
			<button
				onClick={handleMultipleOperations}
				disabled={isLoading1 || isLoading2}
			>
				{(isLoading1 || isLoading2) ? '처리 중...' : '다중 작업 실행'}
			</button>
			{results.length > 0 && (
				<div>
					{results.map((result, index) => (
						<p key={index}>결과 {index + 1}: {result}</p>
					))}
				</div>
			)}
		</div>
	);
};`;

function WithLoadingExample() {
	const [result, setResult] = useState<string>('');
	const { isLoading, withLoading } = useLoading();

	// API 호출 시뮬레이션
	const fetchData = async () => {
		await new Promise((resolve) => setTimeout(resolve, 2000));
		return '데이터 로딩 완료!';
	};

	const handleWithLoading = async () => {
		try {
			const data = await withLoading(fetchData());
			setResult(data);
		} catch (error) {
			setResult('오류 발생: ' + error);
		}
	};

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>withLoading 사용 예제</h3>
			<p>Promise를 직접 감싸서 로딩 상태를 자동으로 관리합니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<button
					onClick={handleWithLoading}
					disabled={isLoading}
					style={{
						padding: '10px 20px',
						backgroundColor: isLoading ? '#6c757d' : '#007bff',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: isLoading ? 'not-allowed' : 'pointer',
					}}
				>
					{isLoading ? '로딩 중...' : 'withLoading으로 데이터 가져오기'}
				</button>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<p>
					<strong>로딩 상태:</strong> {isLoading ? '🔄 로딩 중...' : '✅ 완료'}
				</p>
			</div>

			{result && (
				<div
					style={{
						padding: '10px',
						backgroundColor: '#d4edda',
						border: '1px solid #c3e6cb',
						borderRadius: '4px',
						color: '#155724',
					}}
				>
					<strong>결과:</strong> {result}
				</div>
			)}
		</div>
	);
}

function WrapAsyncExample() {
	const [result, setResult] = useState<string>('');
	const { isLoading, wrapAsync } = useLoading();

	// 비동기 함수를 wrapAsync로 감싸기
	const handleSubmit = async () => {
		// 복잡한 비동기 로직
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// 추가 처리
		const processedData = await processData();

		// 결과 반환
		return processedData;
	};

	const processData = async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return '데이터 처리 완료!';
	};

	const handleWrapAsync = async () => {
		try {
			const data = await wrapAsync(handleSubmit);
			setResult(data);
		} catch (error) {
			setResult('오류 발생: ' + error);
		}
	};

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>wrapAsync 사용 예제</h3>
			<p>비동기 함수를 감싸서 로딩 상태를 자동으로 관리합니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<button
					onClick={handleWrapAsync}
					disabled={isLoading}
					style={{
						padding: '10px 20px',
						backgroundColor: isLoading ? '#6c757d' : '#007bff',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: isLoading ? 'not-allowed' : 'pointer',
					}}
				>
					{isLoading ? '처리 중...' : 'wrapAsync로 데이터 처리'}
				</button>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<p>
					<strong>로딩 상태:</strong> {isLoading ? '🔄 처리 중...' : '✅ 완료'}
				</p>
			</div>

			{result && (
				<div
					style={{
						padding: '10px',
						backgroundColor: '#d4edda',
						border: '1px solid #c3e6cb',
						borderRadius: '4px',
						color: '#155724',
					}}
				>
					<strong>결과:</strong> {result}
				</div>
			)}
		</div>
	);
}

function ComparisonExample() {
	const [result1, setResult1] = useState<string>('');
	const [result2, setResult2] = useState<string>('');
	const [result3, setResult3] = useState<string>('');

	const { isLoading: isLoading1, withLoading } = useLoading();
	const { isLoading: isLoading2, wrapAsync } = useLoading();
	const { isLoading: isLoading3, startLoading, stopLoading } = useLoading();

	// API 호출 시뮬레이션
	const fetchData = async () => {
		await new Promise((resolve) => setTimeout(resolve, 1500));
		return '데이터 로딩 완료!';
	};

	// 1. withLoading 사용
	const handleWithLoading = async () => {
		try {
			const data = await withLoading(fetchData());
			setResult1(data);
		} catch (error) {
			setResult1('오류: ' + error);
		}
	};

	// 2. wrapAsync 사용
	const handleWrapAsync = async () => {
		try {
			await wrapAsync(async () => {
				const data = await fetchData();
				setResult2(data);
			});
		} catch (error) {
			setResult2('오류: ' + error);
		}
	};

	// 3. 수동 제어
	const handleManual = async () => {
		startLoading();
		try {
			const data = await fetchData();
			setResult3(data);
		} catch (error) {
			setResult3('오류: ' + error);
		} finally {
			stopLoading();
		}
	};

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>세 가지 방법 비교</h3>
			<p>withLoading, wrapAsync, 수동 제어의 차이점을 확인해보세요.</p>

			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
					gap: '20px',
				}}
			>
				{/* withLoading */}
				<div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '15px' }}>
					<h4>1. withLoading</h4>
					<p style={{ fontSize: '14px', color: '#666' }}>Promise를 직접 감싸서 사용</p>
					<button
						onClick={handleWithLoading}
						disabled={isLoading1}
						style={{
							padding: '8px 16px',
							backgroundColor: isLoading1 ? '#6c757d' : '#007bff',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: isLoading1 ? 'not-allowed' : 'pointer',
							fontSize: '12px',
						}}
					>
						{isLoading1 ? '로딩 중...' : 'withLoading'}
					</button>
					{result1 && (
						<div style={{ marginTop: '10px', fontSize: '12px', color: '#28a745' }}>{result1}</div>
					)}
				</div>

				{/* wrapAsync */}
				<div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '15px' }}>
					<h4>2. wrapAsync</h4>
					<p style={{ fontSize: '14px', color: '#666' }}>함수를 감싸서 사용</p>
					<button
						onClick={handleWrapAsync}
						disabled={isLoading2}
						style={{
							padding: '8px 16px',
							backgroundColor: isLoading2 ? '#6c757d' : '#007bff',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: isLoading2 ? 'not-allowed' : 'pointer',
							fontSize: '12px',
						}}
					>
						{isLoading2 ? '로딩 중...' : 'wrapAsync'}
					</button>
					{result2 && (
						<div style={{ marginTop: '10px', fontSize: '12px', color: '#28a745' }}>{result2}</div>
					)}
				</div>

				{/* 수동 제어 */}
				<div style={{ border: '1px solid #dee2e6', borderRadius: '8px', padding: '15px' }}>
					<h4>3. 수동 제어</h4>
					<p style={{ fontSize: '14px', color: '#666' }}>startLoading/stopLoading 직접 호출</p>
					<button
						onClick={handleManual}
						disabled={isLoading3}
						style={{
							padding: '8px 16px',
							backgroundColor: isLoading3 ? '#6c757d' : '#007bff',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: isLoading3 ? 'not-allowed' : 'pointer',
							fontSize: '12px',
						}}
					>
						{isLoading3 ? '로딩 중...' : '수동 제어'}
					</button>
					{result3 && (
						<div style={{ marginTop: '10px', fontSize: '12px', color: '#28a745' }}>{result3}</div>
					)}
				</div>
			</div>

			<div
				style={{
					marginTop: '20px',
					padding: '15px',
					backgroundColor: '#f8f9fa',
					borderRadius: '8px',
				}}
			>
				<h4>각 방법의 특징</h4>
				<ul style={{ margin: 0, paddingLeft: '20px' }}>
					<li>
						<strong>withLoading:</strong> Promise를 직접 감싸서 간단하게 사용
					</li>
					<li>
						<strong>wrapAsync:</strong> 함수를 감싸서 재사용 가능한 핸들러 생성
					</li>
					<li>
						<strong>수동 제어:</strong> 세밀한 제어가 필요한 경우 사용
					</li>
				</ul>
			</div>
		</div>
	);
}

function AdvancedUsageExample() {
	const [results, setResults] = useState<string[]>([]);

	// 여러 로딩 상태 관리
	const { isLoading: isLoading1, withLoading: withLoading1 } = useLoading({
		delay: 200,
		minLoadingTime: 1000,
	});

	const { isLoading: isLoading2, wrapAsync: wrapAsync2 } = useLoading({
		delay: 0,
		minLoadingTime: 500,
		onLoadingChange: (loading) => {
			console.log('로딩 상태 변경:', loading);
		},
	});

	// 여러 API 호출 시뮬레이션
	const fetchUserData = async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return '사용자 데이터';
	};

	const fetchProductData = async () => {
		await new Promise((resolve) => setTimeout(resolve, 800));
		return '상품 데이터';
	};

	const processData = async () => {
		await new Promise((resolve) => setTimeout(resolve, 600));
		return '처리된 데이터';
	};

	const handleMultipleOperations = async () => {
		try {
			// withLoading 사용
			const userData = await withLoading1(fetchUserData());

			// wrapAsync 사용
			const productData = await wrapAsync2(async () => {
				const data = await fetchProductData();
				const processed = await processData();
				return { product: data, processed };
			});

			setResults([userData, JSON.stringify(productData)]);
		} catch (error) {
			setResults(['오류 발생: ' + error]);
		}
	};

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>고급 사용법</h3>
			<p>여러 로딩 상태와 다양한 옵션을 조합하여 사용합니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<button
					onClick={handleMultipleOperations}
					disabled={isLoading1 || isLoading2}
					style={{
						padding: '10px 20px',
						backgroundColor: isLoading1 || isLoading2 ? '#6c757d' : '#007bff',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: isLoading1 || isLoading2 ? 'not-allowed' : 'pointer',
					}}
				>
					{isLoading1 || isLoading2 ? '처리 중...' : '다중 작업 실행'}
				</button>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
					<div>
						<p>
							<strong>사용자 데이터 로딩:</strong>
						</p>
						<p>{isLoading1 ? '🔄 로딩 중...' : '✅ 완료'}</p>
					</div>
					<div>
						<p>
							<strong>상품 데이터 처리:</strong>
						</p>
						<p>{isLoading2 ? '🔄 처리 중...' : '✅ 완료'}</p>
					</div>
				</div>
			</div>

			{results.length > 0 && (
				<div style={{ marginTop: '20px' }}>
					<h4>결과:</h4>
					{results.map((result, index) => (
						<div
							key={index}
							style={{
								padding: '10px',
								backgroundColor: '#d4edda',
								border: '1px solid #c3e6cb',
								borderRadius: '4px',
								color: '#155724',
								marginBottom: '10px',
							}}
						>
							<strong>결과 {index + 1}:</strong> {result}
						</div>
					))}
				</div>
			)}

			<div
				style={{
					marginTop: '20px',
					padding: '15px',
					backgroundColor: '#f8f9fa',
					borderRadius: '8px',
				}}
			>
				<h4>사용된 옵션들</h4>
				<ul style={{ margin: 0, paddingLeft: '20px' }}>
					<li>
						<strong>delay:</strong> 로딩 상태 표시 지연 시간
					</li>
					<li>
						<strong>minLoadingTime:</strong> 최소 로딩 표시 시간
					</li>
					<li>
						<strong>onLoadingChange:</strong> 로딩 상태 변경 콜백
					</li>
				</ul>
			</div>
		</div>
	);
}

export const WithLoading = () => (
	<ToggleComponent
		title='withLoading 사용법'
		description='Promise를 직접 감싸서 로딩 상태를 자동으로 관리하는 방법입니다.'
		code={withLoadingCode}
	>
		<WithLoadingExample />
	</ToggleComponent>
);

export const WrapAsync = () => (
	<ToggleComponent
		title='wrapAsync 사용법'
		description='비동기 함수를 감싸서 로딩 상태를 자동으로 관리하는 방법입니다.'
		code={wrapAsyncCode}
	>
		<WrapAsyncExample />
	</ToggleComponent>
);

export const Comparison = () => (
	<ToggleComponent
		title='세 가지 방법 비교'
		description='withLoading, wrapAsync, 수동 제어의 차이점을 비교해봅니다.'
		code={comparisonCode}
	>
		<ComparisonExample />
	</ToggleComponent>
);

export const AdvancedUsage = () => (
	<ToggleComponent
		title='고급 사용법'
		description='여러 로딩 상태와 다양한 옵션을 조합하여 사용하는 방법입니다.'
		code={advancedUsageCode}
	>
		<AdvancedUsageExample />
	</ToggleComponent>
);

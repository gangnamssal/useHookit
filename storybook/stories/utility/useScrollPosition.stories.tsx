import { useState, useRef } from 'react';
import { useScrollPosition } from '@/utility/useScrollPosition';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'Utility/useScrollPosition',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
A React hook that provides comprehensive scroll position tracking with throttling support and scroll control utilities. Simplifies scroll position monitoring in React components with automatic cleanup and real-time updates.

### API

#### Parameters
- **options**: UseScrollPositionOptions (optional) - Configuration options for scroll tracking
- **options.element**: HTMLElement | null (optional, default: window) - Element to track scroll position for
- **options.throttle**: number (optional, default: 16) - Throttle delay in milliseconds (60fps)
- **options.onChange**: (position: ScrollPosition) => void (optional) - Callback function called when scroll position changes
- **options.enabled**: boolean (optional, default: true) - Whether to enable scroll tracking
- **Usage Example**: useScrollPosition({ element: containerRef.current, throttle: 100 });

#### Return Value
- **Type**: { x: number; y: number; isScrolling: boolean; scrollTo: (x: number, y: number, behavior?: ScrollBehavior) => void; scrollToTop: (behavior?: ScrollBehavior) => void; scrollToBottom: (behavior?: ScrollBehavior) => void; scrollToLeft: (behavior?: ScrollBehavior) => void; scrollToRight: (behavior?: ScrollBehavior) => void; }
- **Description**: Returns current scroll position and utility functions
- **Usage Example**: const { x, y, isScrolling } = useScrollPosition();

#### Return Value Properties
- **x**: number - Current horizontal scroll position
- **y**: number - Current vertical scroll position
- **isScrolling**: boolean - Whether currently scrolling (auto-reset after 150ms)
- **scrollTo**: (x: number, y: number, behavior?: ScrollBehavior) => void - Scroll to specific position
- **scrollToTop**: (behavior?: ScrollBehavior) => void - Scroll to top
- **scrollToBottom**: (behavior?: ScrollBehavior) => void - Scroll to bottom
- **scrollToLeft**: (behavior?: ScrollBehavior) => void - Scroll to left
- **scrollToRight**: (behavior?: ScrollBehavior) => void - Scroll to right

### Usage Examples

\`\`\`tsx
// Basic scroll position tracking
const { x, y, isScrolling } = useScrollPosition();

return (
  <div>
    <p>X: {x}px, Y: {y}px</p>
    <p>스크롤 중: {isScrolling ? '🔄 스크롤 중' : '⏸️ 정지'}</p>
  </div>
);

// Scroll control utilities
const { x, y, scrollTo, scrollToTop, scrollToBottom, scrollToLeft, scrollToRight } = useScrollPosition();

return (
  <div>
    <p>현재 위치: X={x}px, Y={y}px</p>
    <button onClick={() => scrollToTop()}>맨 위로</button>
    <button onClick={() => scrollToBottom()}>맨 아래로</button>
    <button onClick={() => scrollTo(0, 500)}>특정 위치로</button>
    <button onClick={() => scrollToLeft()}>맨 왼쪽으로</button>
    <button onClick={() => scrollToRight()}>맨 오른쪽으로</button>
  </div>
);

// Custom element with throttling
const containerRef = useRef(null);
const { x, y, isScrolling } = useScrollPosition({
  element: containerRef.current,
  throttle: 50
});

return (
  <div>
    <p>컨테이너 스크롤: X={x}px, Y={y}px</p>
    <div ref={containerRef} style={{ height: '200px', overflow: 'auto' }}>
      {/* 긴 콘텐츠 */}
    </div>
  </div>
);

// onChange callback with scroll history
const [scrollHistory, setScrollHistory] = useState([]);

const { x, y } = useScrollPosition({
  throttle: 100,
  onChange: (position) => {
    setScrollHistory(prev => [
      ...prev.slice(-9),
      { ...position, timestamp: Date.now() }
    ]);
  }
});

return (
  <div>
    <p>현재: X={x}px, Y={y}px</p>
    <div>히스토리: {scrollHistory.length}개 기록</div>
  </div>
);

// Horizontal scroll tracking
const containerRef = useRef(null);
const { x, y, scrollToLeft, scrollToRight } = useScrollPosition({
  element: containerRef.current
});

return (
  <div>
    <p>가로 스크롤: X={x}px, Y={y}px</p>
    <button onClick={() => scrollToLeft()}>맨 왼쪽</button>
    <button onClick={() => scrollToRight()}>맨 오른쪽</button>
    <div ref={containerRef} style={{ width: '300px', overflow: 'auto' }}>
      {/* 넓은 콘텐츠 */}
    </div>
  </div>
);

// Disabled scroll tracking
const { x, y } = useScrollPosition({
  enabled: false
});

return (
  <div>
    <p>스크롤 추적 비활성화: X={x}px, Y={y}px</p>
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
};

// 코드 스니펫들
const basicCode = `const { x, y, isScrolling } = useScrollPosition();

return (
  <div>
    <p>X: {x}px, Y: {y}px</p>
    <p>스크롤 중: {isScrolling ? '🔄 스크롤 중' : '⏸️ 정지'}</p>
  </div>
);`;

const scrollToCode = `const { x, y, scrollTo, scrollToTop, scrollToBottom, scrollToLeft, scrollToRight } = useScrollPosition();

return (
  <div>
    <p>현재 위치: X={x}px, Y={y}px</p>
    <button onClick={() => scrollToTop()}>맨 위로</button>
    <button onClick={() => scrollToBottom()}>맨 아래로</button>
    <button onClick={() => scrollTo(0, 500)}>특정 위치로</button>
    <button onClick={() => scrollToLeft()}>맨 왼쪽으로</button>
    <button onClick={() => scrollToRight()}>맨 오른쪽으로</button>
  </div>
);`;

const customElementCode = `const containerRef = useRef(null);
const { x, y, isScrolling } = useScrollPosition({
  element: containerRef.current,
  throttle: 50
});

return (
  <div>
    <p>컨테이너 스크롤: X={x}px, Y={y}px</p>
    <div ref={containerRef} style={{ height: '200px', overflow: 'auto' }}>
      {/* 긴 콘텐츠 */}
    </div>
  </div>
);`;

const onChangeCode = `const [scrollHistory, setScrollHistory] = useState([]);

const { x, y } = useScrollPosition({
  throttle: 100,
  onChange: (position) => {
    setScrollHistory(prev => [
      ...prev.slice(-9),
      { ...position, timestamp: Date.now() }
    ]);
  }
});

return (
  <div>
    <p>현재: X={x}px, Y={y}px</p>
    <div>히스토리: {scrollHistory.length}개 기록</div>
  </div>
);`;

const horizontalScrollCode = `const containerRef = useRef(null);
const { x, y, scrollToLeft, scrollToRight } = useScrollPosition({
  element: containerRef.current
});

return (
  <div>
    <p>가로 스크롤: X={x}px, Y={y}px</p>
    <button onClick={() => scrollToLeft()}>맨 왼쪽</button>
    <button onClick={() => scrollToRight()}>맨 오른쪽</button>
    <div ref={containerRef} style={{ width: '300px', overflow: 'auto' }}>
      {/* 넓은 콘텐츠 */}
    </div>
  </div>
);`;

export const Default = () => {
	const { x, y, isScrolling } = useScrollPosition();

	return (
		<ToggleComponent
			code={basicCode}
			title='기본 사용법'
			description='useScrollPosition 훅의 기본적인 사용법을 보여줍니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>기본 사용법</h3>
				<p>페이지 스크롤 위치를 추적합니다.</p>

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
							<strong>X 위치:</strong> {x}px
						</p>
						<p>
							<strong>Y 위치:</strong> {y}px
						</p>
						<p>
							<strong>스크롤 상태:</strong> {isScrolling ? '🔄 스크롤 중...' : '⏸️ 정지'}
						</p>
					</div>
				</div>

				<div
					style={{
						padding: '15px',
						backgroundColor: '#fff3cd',
						borderRadius: '4px',
						border: '1px solid #ffeaa7',
						marginBottom: '20px',
					}}
				>
					<p>
						<strong>💡 테스트:</strong> 페이지를 스크롤하여 위치 변화를 확인하세요.
					</p>
				</div>

				<div
					style={{
						padding: '15px',
						backgroundColor: '#f8f9fa',
						borderRadius: '4px',
						border: '1px solid #dee2e6',
					}}
				>
					<p>
						<strong>사용 사례:</strong>
					</p>
					<ul>
						<li>스크롤 기반 애니메이션</li>
						<li>무한 스크롤 구현</li>
						<li>스크롤 진행률 표시</li>
						<li>스크롤 위치 기반 UI 변경</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithScrollTo = () => {
	const { x, y, scrollTo, scrollToTop, scrollToBottom } = useScrollPosition();

	return (
		<ToggleComponent
			code={scrollToCode}
			title='스크롤 이동'
			description='스크롤 위치를 프로그래밍 방식으로 제어하는 예제입니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>스크롤 이동 예제</h3>
				<p>스크롤 위치를 프로그래밍 방식으로 제어합니다.</p>

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
							<strong>현재 위치:</strong> X={x}px, Y={y}px
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>스크롤 제어</h4>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
							gap: '10px',
						}}
					>
						<button
							onClick={() => scrollToTop()}
							style={{
								padding: '10px 15px',
								backgroundColor: '#007bff',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							⬆️ 맨 위로
						</button>
						<button
							onClick={() => scrollToBottom()}
							style={{
								padding: '10px 15px',
								backgroundColor: '#28a745',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							⬇️ 맨 아래로
						</button>
						<button
							onClick={() => scrollTo(0, 1000)}
							style={{
								padding: '10px 15px',
								backgroundColor: '#dc3545',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							🎯 특정 위치
						</button>
					</div>
				</div>

				{/* 긴 콘텐츠 추가 */}
				<div style={{ marginBottom: '20px' }}>
					<h4>스크롤 테스트 영역</h4>
					<p>아래 콘텐츠를 스크롤하여 버튼들이 제대로 작동하는지 테스트하세요.</p>

					{Array.from({ length: 20 }, (_, i) => (
						<div
							key={i}
							style={{
								padding: '20px',
								margin: '15px 0',
								backgroundColor: i % 2 === 0 ? '#f8f9fa' : '#ffffff',
								borderRadius: '8px',
								border: '1px solid #dee2e6',
							}}
						>
							<h5>섹션 {i + 1}</h5>
							<p>
								이것은 스크롤 테스트를 위한 샘플 콘텐츠입니다. "맨 아래로" 버튼을 클릭하면 이
								섹션까지 스크롤됩니다.
							</p>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
								incididunt ut labore et dolore magna aliqua.
							</p>
						</div>
					))}
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
						<strong>📝 기능:</strong>
					</p>
					<ul>
						<li>
							<code>scrollToTop()</code>: 페이지 맨 위로 스크롤
						</li>
						<li>
							<code>scrollToBottom()</code>: 페이지 맨 아래로 스크롤
						</li>
						<li>
							<code>scrollToLeft()</code>: 페이지 맨 왼쪽으로 스크롤
						</li>
						<li>
							<code>scrollToRight()</code>: 페이지 맨 오른쪽으로 스크롤
						</li>
						<li>
							<code>scrollTo(x, y)</code>: 특정 위치로 스크롤
						</li>
						<li>모든 스크롤은 부드러운 애니메이션으로 실행됩니다</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithCustomElement = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const { x, y, isScrolling } = useScrollPosition({
		element: containerRef.current,
		throttle: 50,
	});

	return (
		<ToggleComponent
			code={customElementCode}
			title='커스텀 엘리먼트'
			description='특정 엘리먼트의 스크롤 위치를 추적하는 예제입니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>커스텀 엘리먼트 예제</h3>
				<p>특정 엘리먼트의 스크롤 위치를 추적합니다.</p>

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
							<strong>컨테이너 X:</strong> {x}px
						</p>
						<p>
							<strong>컨테이너 Y:</strong> {y}px
						</p>
						<p>
							<strong>스크롤 상태:</strong> {isScrolling ? '🔄 스크롤 중...' : '⏸️ 정지'}
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>스크롤 가능한 컨테이너</h4>
					<div
						ref={containerRef}
						style={{
							width: '100%',
							height: '300px',
							border: '2px solid #007bff',
							borderRadius: '8px',
							overflow: 'auto',
							backgroundColor: '#f8f9fa',
						}}
					>
						<div style={{ padding: '20px' }}>
							<h4>스크롤 테스트 영역</h4>
							<p>이 영역을 스크롤하여 위치 변화를 확인하세요.</p>

							{Array.from({ length: 15 }, (_, i) => (
								<div
									key={i}
									style={{
										padding: '15px',
										margin: '10px 0',
										backgroundColor: i % 2 === 0 ? '#e9ecef' : '#ffffff',
										borderRadius: '4px',
										border: '1px solid #dee2e6',
									}}
								>
									<h5>섹션 {i + 1}</h5>
									<p>
										이것은 스크롤 테스트를 위한 샘플 콘텐츠입니다. 스크롤 위치가 실시간으로
										업데이트됩니다.
									</p>
									<p>
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
										incididunt ut labore et dolore magna aliqua.
									</p>
								</div>
							))}
						</div>
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
						<li>특정 엘리먼트의 스크롤만 추적합니다</li>
						<li>Throttle을 통해 성능을 최적화할 수 있습니다</li>
						<li>스크롤 중 상태를 실시간으로 감지합니다</li>
						<li>모달, 사이드바 등에서 유용합니다</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithOnChange = () => {
	const [scrollHistory, setScrollHistory] = useState<
		Array<{ x: number; y: number; timestamp: number }>
	>([]);

	const { x, y } = useScrollPosition({
		throttle: 100,
		onChange: (position) => {
			setScrollHistory((prev) => [
				...prev.slice(-9), // 최근 10개만 유지
				{ ...position, timestamp: Date.now() },
			]);
		},
	});

	return (
		<ToggleComponent
			code={onChangeCode}
			title='onChange 콜백'
			description='스크롤 위치 변경 시 콜백을 실행하는 예제입니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>onChange 콜백 예제</h3>
				<p>스크롤 위치 변경 시 콜백을 실행합니다.</p>

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
							<strong>현재 위치:</strong> X={x}px, Y={y}px
						</p>
						<p>
							<strong>히스토리:</strong> {scrollHistory.length}개 기록
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>스크롤 히스토리 (최근 10개)</h4>
					<div
						style={{
							maxHeight: '200px',
							overflow: 'auto',
							padding: '10px',
							backgroundColor: '#f8f9fa',
							borderRadius: '4px',
							border: '1px solid #dee2e6',
						}}
					>
						{scrollHistory.length === 0 ? (
							<p>스크롤을 시작하면 히스토리가 표시됩니다.</p>
						) : (
							scrollHistory.map((entry, index) => (
								<div
									key={index}
									style={{
										padding: '8px',
										margin: '4px 0',
										backgroundColor: '#ffffff',
										borderRadius: '4px',
										fontSize: '12px',
										border: '1px solid #dee2e6',
									}}
								>
									<strong>X:</strong> {entry.x}px, <strong>Y:</strong> {entry.y}px
									<span style={{ color: '#6c757d', marginLeft: '10px' }}>
										{new Date(entry.timestamp).toLocaleTimeString()}
									</span>
								</div>
							))
						)}
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
						<strong>📝 설명:</strong>
					</p>
					<ul>
						<li>페이지를 스크롤하면 onChange 콜백이 실행됩니다</li>
						<li>스크롤 위치와 타임스탬프가 히스토리에 기록됩니다</li>
						<li>최근 10개의 스크롤 이벤트만 표시됩니다</li>
						<li>Throttle을 통해 콜백 실행 빈도를 제어할 수 있습니다</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

export const WithHorizontalScroll = () => {
	const containerRef = useRef<HTMLDivElement>(null);

	const { x, y, scrollToLeft, scrollToRight } = useScrollPosition({
		element: containerRef.current,
	});

	return (
		<ToggleComponent
			code={horizontalScrollCode}
			title='가로 스크롤'
			description='가로 스크롤을 지원하는 예제입니다.'
		>
			<div
				style={{
					padding: '20px',
					border: '1px solid #ccc',
					borderRadius: '8px',
					maxWidth: '600px',
				}}
			>
				<h3>가로 스크롤 예제</h3>
				<p>가로 스크롤을 지원하는 예제입니다.</p>

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
							<strong>가로 스크롤 위치:</strong> X={x}px, Y={y}px
						</p>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>가로 스크롤 제어</h4>
					<div
						style={{
							display: 'flex',
							gap: '10px',
							marginBottom: '15px',
						}}
					>
						<button
							onClick={() => scrollToLeft()}
							style={{
								padding: '10px 15px',
								backgroundColor: '#17a2b8',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							⬅️ 맨 왼쪽으로
						</button>
						<button
							onClick={() => scrollToRight()}
							style={{
								padding: '10px 15px',
								backgroundColor: '#6f42c1',
								color: 'white',
								border: 'none',
								borderRadius: '4px',
								cursor: 'pointer',
							}}
						>
							➡️ 맨 오른쪽으로
						</button>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<h4>가로 스크롤 테스트 영역</h4>
					<div
						ref={containerRef}
						style={{
							width: '100%',
							height: '200px',
							border: '2px solid #007bff',
							borderRadius: '8px',
							overflow: 'auto',
							backgroundColor: '#f8f9fa',
						}}
					>
						<div style={{ width: '2000px', padding: '20px' }}>
							<h4>가로 스크롤 테스트</h4>
							<p>이 영역을 가로로 스크롤하여 위치 변화를 확인하세요.</p>

							{Array.from({ length: 10 }, (_, i) => (
								<div
									key={i}
									style={{
										display: 'inline-block',
										width: '180px',
										padding: '15px',
										margin: '10px',
										backgroundColor: i % 2 === 0 ? '#e9ecef' : '#ffffff',
										borderRadius: '4px',
										border: '1px solid #dee2e6',
									}}
								>
									<h5>카드 {i + 1}</h5>
									<p>
										이것은 가로 스크롤 테스트를 위한 샘플 카드입니다. 가로 스크롤 위치가 실시간으로
										업데이트됩니다.
									</p>
								</div>
							))}
						</div>
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
						<li>가로 스크롤 위치를 실시간으로 추적합니다</li>
						<li>맨 왼쪽/오른쪽으로 스크롤할 수 있습니다</li>
						<li>세로 스크롤과 동시에 사용 가능합니다</li>
						<li>모바일 터치 스크롤도 지원합니다</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

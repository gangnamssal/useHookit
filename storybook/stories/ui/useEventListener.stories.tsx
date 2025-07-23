import { useState, useRef } from 'react';
import {
	useEventListener,
	useClick,
	useMouseUp,
	useMouseDown,
	useMouseMove,
	useKeyDown,
	useKeyUp,
	useTouchStart,
	useTouchMove,
	useTouchEnd,
} from '@/ui/useEventListener';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'UI/useEventListener',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
## useEventListener 훅

DOM 이벤트 리스너를 관리하는 훅입니다.

### 기본 사용법

\`\`\`tsx
import { useEventListener } from 'useHookit';

function MyComponent() {
  const [key, setKey] = useState('');

  useEventListener('keydown', (event) => {
    setKey(event.key);
  });

  return (
    <div>
      <p>마지막 누른 키: {key}</p>
    </div>
  );
}
\`\`\`

### 매개변수

- \`eventName\`: 이벤트 이름
- \`handler\`: 이벤트 핸들러 함수
- \`element\`: 이벤트를 감지할 요소 (기본값: window)

### 반환값

없음
				`,
			},
		},
	},
};

function UseEventListenerDemo() {
	const [key, setKey] = useState('');
	const [clickCount, setClickCount] = useState(0);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	useEventListener(
		'keydown',
		(event) => {
			setKey((event as KeyboardEvent).key);
		},
		window,
	);

	useEventListener(
		'click',
		() => {
			setClickCount((prev) => prev + 1);
		},
		window,
	);

	useEventListener(
		'mousemove',
		(event) => {
			const mouseEvent = event as MouseEvent;
			setMousePosition({ x: mouseEvent.clientX, y: mouseEvent.clientY });
		},
		window,
	);

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<h4>키보드 이벤트</h4>
				<p>
					<strong>마지막 누른 키:</strong> {key || '(없음)'}
				</p>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>클릭 이벤트</h4>
				<p>
					<strong>클릭 횟수:</strong> {clickCount}
				</p>
				<button
					style={{
						padding: '8px 16px',
						backgroundColor: '#28a745',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
					}}
				>
					클릭해보세요
				</button>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>마우스 이벤트</h4>
				<p>
					<strong>마우스 위치:</strong> X: {mousePosition.x}, Y: {mousePosition.y}
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
					<strong>💡 useEventListener의 활용:</strong>
				</p>
				<ul>
					<li>키보드 이벤트 감지</li>
					<li>마우스 이벤트 추적</li>
					<li>윈도우 리사이즈 감지</li>
					<li>스크롤 이벤트 처리</li>
				</ul>
			</div>
		</div>
	);
}

function WindowResizeExample() {
	const [windowSize, setWindowSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEventListener(
		'resize',
		() => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		},
		window,
	);

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<h4>윈도우 크기 감지</h4>
				<p>
					<strong>현재 크기:</strong> {windowSize.width} × {windowSize.height}
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
					<strong>💡 윈도우 리사이즈:</strong>
				</p>
				<ul>
					<li>브라우저 창 크기 변경 감지</li>
					<li>반응형 디자인 구현</li>
					<li>레이아웃 조정</li>
				</ul>
			</div>
		</div>
	);
}

function ScrollEventsExample() {
	const [scrollY, setScrollY] = useState(0);
	const [scrollDirection, setScrollDirection] = useState('none');
	const [lastScrollY, setLastScrollY] = useState(0);

	useEventListener(
		'scroll',
		() => {
			const currentScrollY = window.scrollY;
			setScrollY(currentScrollY);

			if (currentScrollY > lastScrollY) {
				setScrollDirection('down');
			} else if (currentScrollY < lastScrollY) {
				setScrollDirection('up');
			}

			setLastScrollY(currentScrollY);
		},
		window,
	);

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<h4>스크롤 위치</h4>
				<p>
					<strong>현재 Y 위치:</strong> {scrollY}px
				</p>
				<p>
					<strong>스크롤 방향:</strong> {scrollDirection}
				</p>
			</div>

			<div style={{ height: '200px', overflow: 'auto', border: '1px solid #ccc', padding: '20px' }}>
				<p>스크롤해보세요!</p>
				{[...Array(20)].map((_, i) => (
					<p key={i}>스크롤 테스트 라인 {i + 1}</p>
				))}
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
					<strong>💡 스크롤 이벤트 활용:</strong>
				</p>
				<ul>
					<li>무한 스크롤 구현</li>
					<li>스크롤 기반 애니메이션</li>
					<li>스크롤 위치에 따른 UI 변경</li>
				</ul>
			</div>
		</div>
	);
}

function FocusEventsExample() {
	const [focusedElement, setFocusedElement] = useState('');
	const [focusHistory, setFocusHistory] = useState<string[]>([]);

	useEventListener(
		'focusin',
		(event) => {
			const target = event.target as HTMLElement;
			setFocusedElement(target.tagName.toLowerCase());
			setFocusHistory((prev) => [...prev, `포커스 진입: ${target.tagName.toLowerCase()}`]);
		},
		window,
	);

	useEventListener(
		'focusout',
		(event) => {
			const target = event.target as HTMLElement;
			setFocusHistory((prev) => [...prev, `포커스 해제: ${target.tagName.toLowerCase()}`]);
		},
		window,
	);

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<h4>포커스 이벤트</h4>
				<p>
					<strong>현재 포커스된 요소:</strong> {focusedElement || '(없음)'}
				</p>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>포커스 히스토리</h4>
				<div
					style={{
						maxHeight: '150px',
						overflow: 'auto',
						border: '1px solid #ccc',
						padding: '10px',
					}}
				>
					{focusHistory.slice(-5).map((item, index) => (
						<p key={index} style={{ margin: '2px 0', fontSize: '12px' }}>
							{item}
						</p>
					))}
				</div>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>테스트 요소들</h4>
				<input type='text' placeholder='텍스트 입력' style={{ margin: '5px', padding: '5px' }} />
				<button style={{ margin: '5px', padding: '5px' }}>버튼</button>
				<select style={{ margin: '5px', padding: '5px' }}>
					<option>옵션 1</option>
					<option>옵션 2</option>
				</select>
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
					<strong>💡 포커스 이벤트 활용:</strong>
				</p>
				<ul>
					<li>접근성 개선</li>
					<li>폼 유효성 검사</li>
					<li>키보드 네비게이션</li>
				</ul>
			</div>
		</div>
	);
}

function TouchEventsExample() {
	const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
	const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
	const [touchHistory, setTouchHistory] = useState<string[]>([]);

	useEventListener(
		'touchstart',
		(event) => {
			const touchEvent = event as TouchEvent;
			const touch = touchEvent.touches[0];
			setTouchStart({ x: touch.clientX, y: touch.clientY });
			setTouchHistory((prev) => [...prev, `터치 시작: (${touch.clientX}, ${touch.clientY})`]);
		},
		window,
	);

	useEventListener(
		'touchmove',
		(event) => {
			const touchEvent = event as TouchEvent;
			const touch = touchEvent.touches[0];
			setTouchHistory((prev) => [...prev, `터치 이동: (${touch.clientX}, ${touch.clientY})`]);
		},
		window,
	);

	useEventListener(
		'touchend',
		(event) => {
			const touchEvent = event as TouchEvent;
			const touch = touchEvent.changedTouches[0];
			setTouchEnd({ x: touch.clientX, y: touch.clientY });
			setTouchHistory((prev) => [...prev, `터치 종료: (${touch.clientX}, ${touch.clientY})`]);
		},
		window,
	);

	const getSwipeDirection = () => {
		const deltaX = touchEnd.x - touchStart.x;
		const deltaY = touchEnd.y - touchStart.y;

		if (Math.abs(deltaX) > Math.abs(deltaY)) {
			return deltaX > 0 ? '오른쪽' : '왼쪽';
		} else {
			return deltaY > 0 ? '아래쪽' : '위쪽';
		}
	};

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<h4>터치 이벤트</h4>
				<p>
					<strong>터치 시작:</strong> ({touchStart.x}, {touchStart.y})
				</p>
				<p>
					<strong>터치 종료:</strong> ({touchEnd.x}, {touchEnd.y})
				</p>
				<p>
					<strong>스와이프 방향:</strong>{' '}
					{touchStart.x !== 0 && touchEnd.x !== 0 ? getSwipeDirection() : '(없음)'}
				</p>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>터치 히스토리</h4>
				<div
					style={{
						maxHeight: '150px',
						overflow: 'auto',
						border: '1px solid #ccc',
						padding: '10px',
					}}
				>
					{touchHistory.slice(-5).map((item, index) => (
						<p key={index} style={{ margin: '2px 0', fontSize: '12px' }}>
							{item}
						</p>
					))}
				</div>
			</div>

			<div
				style={{
					padding: '20px',
					backgroundColor: '#e9ecef',
					borderRadius: '4px',
					textAlign: 'center',
					marginBottom: '20px',
				}}
			>
				<p>이 영역을 터치해보세요!</p>
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
					<strong>💡 터치 이벤트 활용:</strong>
				</p>
				<ul>
					<li>모바일 제스처 인식</li>
					<li>스와이프 네비게이션</li>
					<li>터치 기반 인터랙션</li>
				</ul>
			</div>
		</div>
	);
}

function CustomElementEventsExample() {
	const [elementRef, setElementRef] = useState<HTMLDivElement | null>(null);
	const [hoverCount, setHoverCount] = useState(0);
	const [doubleClickCount, setDoubleClickCount] = useState(0);
	const [contextMenuCount, setContextMenuCount] = useState(0);

	useEventListener(
		'mouseenter',
		() => {
			setHoverCount((prev) => prev + 1);
		},
		elementRef,
	);

	useEventListener(
		'dblclick',
		() => {
			setDoubleClickCount((prev) => prev + 1);
		},
		elementRef,
	);

	useEventListener(
		'contextmenu',
		(event) => {
			event.preventDefault();
			setContextMenuCount((prev) => prev + 1);
		},
		elementRef,
	);

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<h4>커스텀 요소 이벤트</h4>
				<p>
					<strong>마우스 진입 횟수:</strong> {hoverCount}
				</p>
				<p>
					<strong>더블클릭 횟수:</strong> {doubleClickCount}
				</p>
				<p>
					<strong>우클릭 횟수:</strong> {contextMenuCount}
				</p>
			</div>

			<div
				ref={setElementRef}
				style={{
					padding: '40px',
					backgroundColor: '#007bff',
					color: 'white',
					borderRadius: '8px',
					textAlign: 'center',
					cursor: 'pointer',
					marginBottom: '20px',
				}}
			>
				<p>이 요소에 마우스를 올리거나</p>
				<p>더블클릭하거나 우클릭해보세요!</p>
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
					<strong>💡 커스텀 요소 이벤트 활용:</strong>
				</p>
				<ul>
					<li>특정 요소에만 이벤트 적용</li>
					<li>복잡한 인터랙션 구현</li>
					<li>성능 최적화</li>
				</ul>
			</div>
		</div>
	);
}

function HelperFunctionsExample() {
	const [clickCount, setClickCount] = useState(0);
	const [mouseUpCount, setMouseUpCount] = useState(0);
	const [mouseDownCount, setMouseDownCount] = useState(0);
	const [mouseMoveCount, setMouseMoveCount] = useState(0);

	useClick(() => {
		setClickCount((prev) => prev + 1);
	});

	useMouseUp(() => {
		setMouseUpCount((prev) => prev + 1);
	});

	useMouseDown(() => {
		setMouseDownCount((prev) => prev + 1);
	});

	useMouseMove(() => {
		setMouseMoveCount((prev) => prev + 1);
	});

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<h4>헬퍼 함수 이벤트 카운터</h4>
				<p>
					<strong>클릭 횟수:</strong> {clickCount}
				</p>
				<p>
					<strong>마우스 업 횟수:</strong> {mouseUpCount}
				</p>
				<p>
					<strong>마우스 다운 횟수:</strong> {mouseDownCount}
				</p>
				<p>
					<strong>마우스 이동 횟수:</strong> {mouseMoveCount}
				</p>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>테스트 영역</h4>
				<div
					style={{
						padding: '40px',
						backgroundColor: '#28a745',
						color: 'white',
						borderRadius: '8px',
						textAlign: 'center',
						cursor: 'pointer',
					}}
				>
					<p>이 영역을 클릭하거나 마우스를 움직여보세요!</p>
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
					<strong>💡 헬퍼 함수의 장점:</strong>
				</p>
				<ul>
					<li>더 간결하고 읽기 쉬운 코드</li>
					<li>타입 안전성 보장</li>
					<li>특정 이벤트에 최적화된 API</li>
					<li>일관된 사용 패턴</li>
				</ul>
			</div>
		</div>
	);
}

function ElementRefExampleComponent() {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const divRef = useRef<HTMLDivElement>(null);
	const [buttonClickCount, setButtonClickCount] = useState(0);
	const [divHoverCount, setDivHoverCount] = useState(0);

	useClick(() => {
		setButtonClickCount((prev) => prev + 1);
	}, buttonRef.current);

	useEventListener(
		'mouseenter',
		() => {
			setDivHoverCount((prev) => prev + 1);
		},
		divRef.current,
	);

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<h4>Element Ref 이벤트</h4>
				<p>
					<strong>버튼 클릭 횟수:</strong> {buttonClickCount}
				</p>
				<p>
					<strong>div 마우스 진입 횟수:</strong> {divHoverCount}
				</p>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>테스트 요소들</h4>
				<button
					ref={buttonRef}
					style={{
						padding: '10px 20px',
						backgroundColor: '#007bff',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
						marginRight: '10px',
					}}
				>
					클릭해보세요
				</button>
				<div
					ref={divRef}
					style={{
						padding: '20px',
						backgroundColor: '#ffc107',
						color: 'black',
						borderRadius: '4px',
						display: 'inline-block',
						cursor: 'pointer',
					}}
				>
					마우스를 올려보세요
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
					<strong>💡 Element Ref 활용:</strong>
				</p>
				<ul>
					<li>특정 DOM 요소에만 이벤트 적용</li>
					<li>성능 최적화</li>
					<li>정확한 이벤트 타겟팅</li>
					<li>복잡한 인터랙션 구현</li>
				</ul>
			</div>
		</div>
	);
}

function KeyboardHelpersExample() {
	const [keyDown, setKeyDown] = useState('');
	const [keyUp, setKeyUp] = useState('');
	const [keyHistory, setKeyHistory] = useState<string[]>([]);

	useKeyDown((event) => {
		setKeyDown(event.key);
		setKeyHistory((prev) => [...prev, `키 다운: ${event.key}`]);
	});

	useKeyUp((event) => {
		setKeyUp(event.key);
		setKeyHistory((prev) => [...prev, `키 업: ${event.key}`]);
	});

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<h4>키보드 헬퍼 함수</h4>
				<p>
					<strong>마지막 키 다운:</strong> {keyDown || '(없음)'}
				</p>
				<p>
					<strong>마지막 키 업:</strong> {keyUp || '(없음)'}
				</p>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>키보드 히스토리</h4>
				<div
					style={{
						maxHeight: '150px',
						overflow: 'auto',
						border: '1px solid #ccc',
						padding: '10px',
					}}
				>
					{keyHistory.slice(-8).map((item, index) => (
						<p key={index} style={{ margin: '2px 0', fontSize: '12px' }}>
							{item}
						</p>
					))}
				</div>
			</div>

			<div
				style={{
					padding: '20px',
					backgroundColor: '#e9ecef',
					borderRadius: '4px',
					textAlign: 'center',
					marginBottom: '20px',
				}}
			>
				<p>이 영역을 클릭한 후 키보드를 눌러보세요!</p>
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
					<strong>💡 키보드 헬퍼 함수 활용:</strong>
				</p>
				<ul>
					<li>게임 컨트롤 구현</li>
					<li>키보드 단축키</li>
					<li>폼 입력 처리</li>
					<li>접근성 개선</li>
				</ul>
			</div>
		</div>
	);
}

function TouchHelpersExample() {
	const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
	const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
	const [touchHistory, setTouchHistory] = useState<string[]>([]);

	useTouchStart((event) => {
		const touch = event.touches[0];
		setTouchStart({ x: touch.clientX, y: touch.clientY });
		setTouchHistory((prev) => [...prev, `터치 시작: (${touch.clientX}, ${touch.clientY})`]);
	});

	useTouchMove((event) => {
		const touch = event.touches[0];
		setTouchHistory((prev) => [...prev, `터치 이동: (${touch.clientX}, ${touch.clientY})`]);
	});

	useTouchEnd((event) => {
		const touch = event.changedTouches[0];
		setTouchEnd({ x: touch.clientX, y: touch.clientY });
		setTouchHistory((prev) => [...prev, `터치 종료: (${touch.clientX}, ${touch.clientY})`]);
	});

	const getSwipeDirection = () => {
		const deltaX = touchEnd.x - touchStart.x;
		const deltaY = touchEnd.y - touchStart.y;

		if (Math.abs(deltaX) > Math.abs(deltaY)) {
			return deltaX > 0 ? '오른쪽' : '왼쪽';
		} else {
			return deltaY > 0 ? '아래쪽' : '위쪽';
		}
	};

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<h4>터치 헬퍼 함수</h4>
				<p>
					<strong>터치 시작:</strong> ({touchStart.x}, {touchStart.y})
				</p>
				<p>
					<strong>터치 종료:</strong> ({touchEnd.x}, {touchEnd.y})
				</p>
				<p>
					<strong>스와이프 방향:</strong>{' '}
					{touchStart.x !== 0 && touchEnd.x !== 0 ? getSwipeDirection() : '(없음)'}
				</p>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h4>터치 히스토리</h4>
				<div
					style={{
						maxHeight: '150px',
						overflow: 'auto',
						border: '1px solid #ccc',
						padding: '10px',
					}}
				>
					{touchHistory.slice(-5).map((item, index) => (
						<p key={index} style={{ margin: '2px 0', fontSize: '12px' }}>
							{item}
						</p>
					))}
				</div>
			</div>

			<div
				style={{
					padding: '40px',
					backgroundColor: '#6f42c1',
					color: 'white',
					borderRadius: '8px',
					textAlign: 'center',
					marginBottom: '20px',
				}}
			>
				<p>이 영역을 터치해보세요!</p>
				<p style={{ fontSize: '14px', marginTop: '10px' }}>
					스와이프, 탭, 드래그 등 다양한 터치 제스처를 시도해보세요
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
					<strong>💡 터치 헬퍼 함수 활용:</strong>
				</p>
				<ul>
					<li>모바일 제스처 인식</li>
					<li>스와이프 네비게이션</li>
					<li>터치 기반 게임</li>
					<li>모바일 최적화 UI</li>
				</ul>
			</div>
		</div>
	);
}

// 코드 스니펫들
const basicCode = `const [key, setKey] = useState('');
const [clickCount, setClickCount] = useState(0);

useEventListener('keydown', (event) => {
  setKey(event.key);
});

useEventListener('click', () => {
  setClickCount(prev => prev + 1);
});

// 키보드, 마우스, 윈도우 이벤트 등 다양한 이벤트 감지 가능`;

const resizeCode = `const [windowSize, setWindowSize] = useState({
  width: window.innerWidth,
  height: window.innerHeight,
});

useEventListener('resize', () => {
  setWindowSize({
    width: window.innerWidth,
    height: window.innerHeight,
  });
});

// 윈도우 크기 변경 시 자동으로 상태 업데이트`;

const scrollCode = `const [scrollY, setScrollY] = useState(0);
const [scrollDirection, setScrollDirection] = useState('none');

useEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  setScrollY(currentScrollY);
  
  // 스크롤 방향 감지 로직
});

// 스크롤 위치와 방향 감지`;

const focusCode = `const [focusedElement, setFocusedElement] = useState('');

useEventListener('focusin', (event) => {
  const target = event.target as HTMLElement;
  setFocusedElement(target.tagName.toLowerCase());
});

useEventListener('focusout', (event) => {
  // 포커스 해제 처리
});

// 포커스 진입/해제 이벤트 감지`;

const touchCode = `const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });

useEventListener('touchstart', (event) => {
  const touch = event.touches[0];
  setTouchStart({ x: touch.clientX, y: touch.clientY });
});

useEventListener('touchend', (event) => {
  const touch = event.changedTouches[0];
  setTouchEnd({ x: touch.clientX, y: touch.clientY });
});

// 터치 이벤트 감지 및 스와이프 방향 계산`;

const customElementCode = `const [elementRef, setElementRef] = useState<HTMLDivElement | null>(null);
const [hoverCount, setHoverCount] = useState(0);

useEventListener('mouseenter', () => {
  setHoverCount(prev => prev + 1);
}, elementRef);

useEventListener('dblclick', () => {
  // 더블클릭 처리
}, elementRef);

// 특정 요소에 대한 이벤트 감지`;

const helperFunctionsCode = `const [clickCount, setClickCount] = useState(0);
const [mouseUpCount, setMouseUpCount] = useState(0);
const [mouseDownCount, setMouseDownCount] = useState(0);

useClick(() => {
  setClickCount(prev => prev + 1);
});

useMouseUp(() => {
  setMouseUpCount(prev => prev + 1);
});

useMouseDown(() => {
  setMouseDownCount(prev => prev + 1);
});

// 헬퍼 함수들을 사용하여 더 간결한 코드 작성`;

const elementRefCode = `const buttonRef = useRef<HTMLButtonElement>(null);
const [clickCount, setClickCount] = useState(0);

useClick(() => {
  setClickCount(prev => prev + 1);
}, buttonRef.current);

return (
  <button ref={buttonRef}>
    클릭 횟수: {clickCount}
  </button>
);

// useRef를 활용한 특정 요소 이벤트 감지`;

const keyboardHelpersCode = `const [keyDown, setKeyDown] = useState('');
const [keyUp, setKeyUp] = useState('');

useKeyDown((event) => {
  setKeyDown(event.key);
});

useKeyUp((event) => {
  setKeyUp(event.key);
});

// 키보드 이벤트 헬퍼 함수 활용`;

const touchHelpersCode = `const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });

useTouchStart((event) => {
  const touch = event.touches[0];
  setTouchStart({ x: touch.clientX, y: touch.clientY });
});

useTouchEnd((event) => {
  const touch = event.changedTouches[0];
  setTouchEnd({ x: touch.clientX, y: touch.clientY });
});

// 터치 이벤트 헬퍼 함수 활용`;

export const Default = () => (
	<ToggleComponent
		title='기본 사용법'
		description='키보드, 마우스, 클릭 이벤트를 감지하는 예제입니다.'
		code={basicCode}
	>
		<UseEventListenerDemo />
	</ToggleComponent>
);

export const WindowResize = () => (
	<ToggleComponent
		title='윈도우 리사이즈 예제'
		description='윈도우 크기 변경을 감지하는 예제입니다.'
		code={resizeCode}
	>
		<WindowResizeExample />
	</ToggleComponent>
);

export const ScrollEvents = () => (
	<ToggleComponent
		title='스크롤 이벤트 예제'
		description='스크롤 위치와 방향을 감지하는 예제입니다.'
		code={scrollCode}
	>
		<ScrollEventsExample />
	</ToggleComponent>
);

export const FocusEvents = () => (
	<ToggleComponent
		title='포커스 이벤트 예제'
		description='포커스 진입/해제 이벤트를 감지하는 예제입니다.'
		code={focusCode}
	>
		<FocusEventsExample />
	</ToggleComponent>
);

export const TouchEvents = () => (
	<ToggleComponent
		title='터치 이벤트 예제'
		description='터치 이벤트를 감지하는 예제입니다.'
		code={touchCode}
	>
		<TouchEventsExample />
	</ToggleComponent>
);

export const CustomElementEvents = () => (
	<ToggleComponent
		title='커스텀 요소 이벤트 예제'
		description='특정 요소에 대한 이벤트를 감지하는 예제입니다.'
		code={customElementCode}
	>
		<CustomElementEventsExample />
	</ToggleComponent>
);

export const HelperFunctions = () => (
	<ToggleComponent
		title='헬퍼 함수 예제'
		description='useClick, useMouseUp 등의 헬퍼 함수들을 활용하는 예제입니다.'
		code={helperFunctionsCode}
	>
		<HelperFunctionsExample />
	</ToggleComponent>
);

export const ElementRefExample = () => (
	<ToggleComponent
		title='Element Ref 예제'
		description='useRef를 활용한 특정 요소 이벤트 감지 예제입니다.'
		code={elementRefCode}
	>
		<ElementRefExampleComponent />
	</ToggleComponent>
);

export const KeyboardHelpers = () => (
	<ToggleComponent
		title='키보드 헬퍼 함수 예제'
		description='useKeyDown, useKeyUp 헬퍼 함수를 활용하는 예제입니다.'
		code={keyboardHelpersCode}
	>
		<KeyboardHelpersExample />
	</ToggleComponent>
);

export const TouchHelpers = () => (
	<ToggleComponent
		title='터치 헬퍼 함수 예제'
		description='useTouchStart, useTouchMove, useTouchEnd 헬퍼 함수를 활용하는 예제입니다.'
		code={touchHelpersCode}
	>
		<TouchHelpersExample />
	</ToggleComponent>
);

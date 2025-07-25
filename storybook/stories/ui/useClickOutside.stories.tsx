import { useState } from 'react';
import { useClickOutside } from '@/ui/useClickOutside';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'UI/useClickOutside',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
A React hook that detects clicks outside of a specified element. It provides functionality to automatically close UI elements like modals, dropdowns, and popups when clicking outside.

### API

#### Parameters
- **callback**: () => void - Callback function to execute when clicking outside
- **options**: Object (optional) - Configuration options
  - **enabled**: boolean (optional, default: true) - Whether the hook is enabled
  - **eventType**: 'mousedown' | 'click' | 'touchstart' (optional, default: 'mousedown') - Event type to detect
- **Usage Example**: const ref = useClickOutside(() => setIsOpen(false), { enabled: true, eventType: 'click' });

#### Return Value
- **Type**: RefObject<T>
- **Description**: Returns a ref object to attach to the element to monitor
- **Usage Example**: const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

### Usage Examples

\`\`\`tsx
// Basic usage
const [isOpen, setIsOpen] = useState(false);
const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

return (
  <div>
    <button onClick={() => setIsOpen(!isOpen)}>
      {isOpen ? 'Close Menu' : 'Open Menu'}
    </button>
    {isOpen && (
      <div ref={ref} style={{ border: '2px solid #007bff', padding: '20px' }}>
        Menu content
      </div>
    )}
  </div>
);

// Custom options usage
const [isModalOpen, setIsModalOpen] = useState(false);
const modalRef = useClickOutside<HTMLDivElement>(() => setIsModalOpen(false), {
  enabled: isModalOpen,
  eventType: 'click'
});

return (
  <div>
    <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
    {isModalOpen && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div ref={modalRef} style={{ backgroundColor: 'white', padding: '30px' }}>
          Modal content
        </div>
      </div>
    )}
  </div>
);

// Conditional hook usage
const [isActive, setIsActive] = useState(false);
const ref = useClickOutside<HTMLDivElement>(() => setIsActive(false), {
  enabled: isActive,
  eventType: 'mousedown'
});

return (
  <div ref={ref}>
    {isActive ? 'Active' : 'Inactive'}
  </div>
);
\`\`\`

### Related Hooks

#### useClickOutsideMultiple
A hook that detects clicks outside of multiple specified elements. It executes a callback when clicking outside all monitored elements.

**Usage Example**:
\`\`\`tsx
// Basic usage
const ref1 = useRef(null);
const ref2 = useRef(null);

useClickOutsideMultiple(() => setOpen(false), [ref1, ref2]);

return (
  <>
    <div ref={ref1}>첫 번째 요소</div>
    <div ref={ref2}>두 번째 요소</div>
  </>
);

// Custom options usage
const refs = [ref1, ref2, ref3];

useClickOutsideMultiple(() => {
  console.log('모든 요소 외부 클릭됨');
}, refs, {
  enabled: isActive,
  eventType: 'click'
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

function UseClickOutsideDemo() {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<button
					onClick={() => setIsOpen(!isOpen)}
					style={{
						padding: '10px 20px',
						backgroundColor: '#007bff',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
					}}
				>
					{isOpen ? '메뉴 닫기' : '메뉴 열기'}
				</button>
			</div>

			{isOpen && (
				<div
					ref={ref}
					style={{
						border: '2px solid #007bff',
						borderRadius: '8px',
						padding: '20px',
						backgroundColor: 'white',
						boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
						position: 'relative',
					}}
				>
					<h4>메뉴 내용</h4>
					<p>이 영역 외부를 클릭하면 메뉴가 닫힙니다.</p>
					<ul>
						<li>메뉴 항목 1</li>
						<li>메뉴 항목 2</li>
						<li>메뉴 항목 3</li>
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
					<strong>💡 useClickOutside의 활용:</strong>
				</p>
				<ul>
					<li>드롭다운 메뉴 닫기</li>
					<li>모달 창 닫기</li>
					<li>팝업 닫기</li>
					<li>사용자 경험 개선</li>
				</ul>
			</div>
		</div>
	);
}

function ModalExampleComponent() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const modalRef = useClickOutside<HTMLDivElement>(() => setIsModalOpen(false));

	return (
		<div>
			<div style={{ marginBottom: '20px' }}>
				<button
					onClick={() => setIsModalOpen(true)}
					style={{
						padding: '10px 20px',
						backgroundColor: '#28a745',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
					}}
				>
					모달 열기
				</button>
			</div>

			{isModalOpen && (
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						zIndex: 1000,
					}}
				>
					<div
						ref={modalRef}
						style={{
							backgroundColor: 'white',
							padding: '30px',
							borderRadius: '8px',
							boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
							maxWidth: '400px',
							width: '90%',
						}}
					>
						<h3>모달 제목</h3>
						<p>이 모달 외부를 클릭하면 닫힙니다.</p>
						<div style={{ marginTop: '20px' }}>
							<button
								onClick={() => setIsModalOpen(false)}
								style={{
									padding: '8px 16px',
									backgroundColor: '#6c757d',
									color: 'white',
									border: 'none',
									borderRadius: '4px',
									cursor: 'pointer',
								}}
							>
								닫기
							</button>
						</div>
					</div>
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
					<strong>💡 모달에서의 활용:</strong>
				</p>
				<ul>
					<li>모달 외부 클릭 시 자동 닫기</li>
					<li>사용자 경험 향상</li>
					<li>직관적인 인터페이스</li>
				</ul>
			</div>
		</div>
	);
}

// 코드 스니펫들
const basicCode = `const [isOpen, setIsOpen] = useState(false);
const ref = useClickOutside(() => setIsOpen(false));

return (
  <div>
    <button onClick={() => setIsOpen(!isOpen)}>
      {isOpen ? '메뉴 닫기' : '메뉴 열기'}
    </button>
    {isOpen && (
      <div ref={ref} style={{ border: '2px solid #007bff', padding: '20px' }}>
        메뉴 내용
      </div>
    )}
  </div>
);`;

const modalCode = `const [isModalOpen, setIsModalOpen] = useState(false);
const modalRef = useClickOutside(() => setIsModalOpen(false));

return (
  <div>
    <button onClick={() => setIsModalOpen(true)}>모달 열기</button>
    {isModalOpen && (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div ref={modalRef} style={{ backgroundColor: 'white', padding: '30px' }}>
          모달 내용
        </div>
      </div>
    )}
  </div>
);`;

export const Default = () => (
	<ToggleComponent
		title='기본 사용법'
		description='요소 외부 클릭을 감지하여 메뉴를 닫는 예제입니다.'
		code={basicCode}
	>
		<UseClickOutsideDemo />
	</ToggleComponent>
);

export const ModalExample = () => (
	<ToggleComponent
		title='모달 예제'
		description='모달 외부 클릭 시 자동으로 닫히는 예제입니다.'
		code={modalCode}
	>
		<ModalExampleComponent />
	</ToggleComponent>
);

import { useState } from 'react';
import { useHover } from '@/ui/useHover';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'UI/useHover',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
A React hook that detects mouse hover state on DOM elements. Provides comprehensive hover management with callbacks, delays, and touch device support.

### API

#### Parameters
- **options**: UseHoverOptions (optional) - Configuration options for hover detection
- **options.onHoverStart**: () => void (optional) - Callback when hover starts
- **options.onHoverEnd**: () => void (optional) - Callback when hover ends
- **options.onHoverChange**: (isHovered: boolean) => void (optional) - Callback when hover state changes
- **options.delay**: number (optional, default: 0) - Delay before hover starts (ms)
- **options.delayEnd**: number (optional, default: 0) - Delay before hover ends (ms)
- **options.enabled**: boolean (optional, default: true) - Whether hover detection is enabled
- **Usage Example**: useHover({ onHoverStart: () => console.log('Hover started'), delay: 200 });

#### Return Value
- **Type**: { ref: React.RefObject<HTMLElement>, isHovered: boolean, hoverProps: object }
- **Description**: Returns ref for DOM element, current hover state, and event handlers
- **Usage Example**: const { ref, isHovered, hoverProps } = useHover();

#### Return Value Properties
- **ref**: React.RefObject<HTMLElement> - Ref to assign to DOM element
- **isHovered**: boolean - Current hover state (true when hovering, false otherwise)
- **hoverProps**: object - Event handlers for mouse and touch events

### Usage Examples

\`\`\`tsx
// Basic usage
const { ref, isHovered, hoverProps } = useHover<HTMLDivElement>();

return (
  <div ref={ref} {...hoverProps} className={isHovered ? 'hovered' : ''}>
    {isHovered ? 'Hovered!' : 'Hover me'}
  </div>
);

// With callbacks
const { ref, isHovered, hoverProps } = useHover<HTMLDivElement>({
  onHoverStart: () => console.log('Hover start'),
  onHoverEnd: () => console.log('Hover end'),
  onHoverChange: (hovered) => console.log('Hover state:', hovered)
});

return <div ref={ref} {...hoverProps}>Hover test</div>;

// With delays
const { ref, isHovered, hoverProps } = useHover<HTMLDivElement>({
  delay: 200,    // 200ms before hover starts
  delayEnd: 100  // 100ms before hover ends
});

return <div ref={ref} {...hoverProps}>Delayed hover</div>;

// With event handlers
const { ref, isHovered, hoverProps } = useHover<HTMLDivElement>();
return <div ref={ref} {...hoverProps}>Hover event handler usage</div>;
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

export const Basic = {
	render: () => {
		const { ref, isHovered, hoverProps } = useHover<HTMLDivElement>();

		return (
			<ToggleComponent
				title='기본 호버 감지'
				description='마우스를 올려보세요!'
				code={`
const { ref, isHovered, hoverProps } = useHover<HTMLDivElement>();

return (
  <div ref={ref} {...hoverProps} className={isHovered ? 'hovered' : ''}>
    {isHovered ? '호버됨!' : '호버해보세요'}
  </div>
);
`}
			>
				<div
					ref={ref}
					{...hoverProps}
					style={{
						padding: '20px',
						border: '2px solid #ccc',
						borderRadius: '8px',
						backgroundColor: isHovered ? '#e3f2fd' : '#f5f5f5',
						transition: 'all 0.3s ease',
						cursor: 'pointer',
						minWidth: '200px',
						textAlign: 'center',
					}}
				>
					{isHovered ? '🎉 호버됨!' : '👆 호버해보세요'}
				</div>
			</ToggleComponent>
		);
	},
};

export const WithCallbacks = {
	render: () => {
		const [hoverCount, setHoverCount] = useState(0);
		const [lastAction, setLastAction] = useState('');

		const { ref, isHovered, hoverProps } = useHover<HTMLDivElement>({
			onHoverStart: () => {
				setHoverCount((prev) => prev + 1);
				setLastAction('호버 시작');
			},
			onHoverEnd: () => {
				setLastAction('호버 종료');
			},
			onHoverChange: (hovered) => {
				console.log('호버 상태 변경:', hovered);
			},
		});

		return (
			<ToggleComponent
				title='콜백과 함께 사용'
				description='호버 시작/종료 시 콜백이 실행됩니다.'
				code={`
const [hoverCount, setHoverCount] = useState(0);
const [lastAction, setLastAction] = useState('');

const { ref, isHovered, hoverProps } = useHover<HTMLDivElement>({
  onHoverStart: () => {
    setHoverCount(prev => prev + 1);
    setLastAction('호버 시작');
  },
  onHoverEnd: () => {
    setLastAction('호버 종료');
  },
  onHoverChange: (hovered) => {
    console.log('호버 상태 변경:', hovered);
  },
});

return (
  <div ref={ref} {...hoverProps}>
    {isHovered ? '호버됨!' : '호버해보세요'}
  </div>
);
`}
			>
				<div style={{ marginBottom: '20px' }}>
					<div
						ref={ref}
						{...hoverProps}
						style={{
							padding: '20px',
							border: '2px solid #4caf50',
							borderRadius: '8px',
							backgroundColor: isHovered ? '#e8f5e8' : '#f9f9f9',
							transition: 'all 0.3s ease',
							cursor: 'pointer',
							minWidth: '200px',
							textAlign: 'center',
						}}
					>
						{isHovered ? '✅ 호버됨!' : '🖱️ 호버해보세요'}
					</div>
				</div>
				<div style={{ fontSize: '14px', color: '#666' }}>
					<p>호버 횟수: {hoverCount}</p>
					<p>마지막 액션: {lastAction}</p>
					<p>현재 상태: {isHovered ? '호버 중' : '호버 안함'}</p>
				</div>
			</ToggleComponent>
		);
	},
};

export const WithDelays = {
	render: () => {
		const { ref, isHovered, hoverProps } = useHover<HTMLDivElement>({
			delay: 300, // 300ms 후 호버 시작
			delayEnd: 200, // 200ms 후 호버 종료
		});

		return (
			<ToggleComponent
				title='지연 시간과 함께 사용'
				description='호버 시작/종료에 지연 시간이 적용됩니다.'
				code={`
const { ref, isHovered, hoverProps } = useHover<HTMLDivElement>({
  delay: 300,    // 300ms 후 호버 시작
  delayEnd: 200, // 200ms 후 호버 종료
});

return (
  <div ref={ref} {...hoverProps}>
    {isHovered ? '지연 호버!' : '지연 호버 테스트'}
  </div>
);
`}
			>
				<div
					ref={ref}
					{...hoverProps}
					style={{
						padding: '20px',
						border: '2px solid #ff9800',
						borderRadius: '8px',
						backgroundColor: isHovered ? '#fff3e0' : '#f9f9f9',
						transition: 'all 0.3s ease',
						cursor: 'pointer',
						minWidth: '200px',
						textAlign: 'center',
					}}
				>
					{isHovered ? '⏰ 지연 호버!' : '⏳ 지연 호버 테스트'}
				</div>
				<div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
					<p>호버 시작: 300ms 지연</p>
					<p>호버 종료: 200ms 지연</p>
				</div>
			</ToggleComponent>
		);
	},
};

export const WithEventHandlers = {
	render: () => {
		const { ref, isHovered, hoverProps } = useHover<HTMLDivElement>({
			onHoverStart: () => console.log('호버 시작'),
			onHoverEnd: () => console.log('호버 종료'),
		});

		return (
			<ToggleComponent
				title='이벤트 핸들러 사용'
				description='hoverProps를 통해 이벤트 핸들러를 직접 사용할 수 있습니다.'
				code={`
const { ref, isHovered, hoverProps } = useHover<HTMLDivElement>({
  onHoverStart: () => console.log('호버 시작'),
  onHoverEnd: () => console.log('호버 종료'),
});

return (
  <div ref={ref} {...hoverProps}>
    {isHovered ? '이벤트 핸들러 호버!' : '이벤트 핸들러 테스트'}
  </div>
);
`}
			>
				<div
					ref={ref}
					{...hoverProps}
					style={{
						padding: '20px',
						border: '2px solid #9c27b0',
						borderRadius: '8px',
						backgroundColor: isHovered ? '#f3e5f5' : '#f9f9f9',
						transition: 'all 0.3s ease',
						cursor: 'pointer',
						minWidth: '200px',
						textAlign: 'center',
					}}
				>
					{isHovered ? '🚀 이벤트 핸들러 호버!' : '🔧 이벤트 핸들러 테스트'}
				</div>
			</ToggleComponent>
		);
	},
};

export const DisabledHover = {
	render: () => {
		const [enabled, setEnabled] = useState(true);
		const { ref, isHovered, hoverProps } = useHover<HTMLDivElement>({
			enabled,
			onHoverStart: () => console.log('호버 시작'),
		});

		return (
			<ToggleComponent
				title='호버 비활성화'
				description='호버 감지를 켜고 끌 수 있습니다.'
				code={`
const [enabled, setEnabled] = useState(true);
const { ref, isHovered, hoverProps } = useHover<HTMLDivElement>({
  enabled,
  onHoverStart: () => console.log('호버 시작'),
});

return (
  <div ref={ref} {...hoverProps}>
    {enabled ? (isHovered ? '호버됨!' : '호버해보세요') : '호버 비활성화됨'}
  </div>
);
`}
			>
				<div style={{ marginBottom: '20px' }}>
					<button
						onClick={() => setEnabled(!enabled)}
						style={{
							padding: '10px 20px',
							backgroundColor: enabled ? '#f44336' : '#4caf50',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							marginBottom: '10px',
						}}
					>
						{enabled ? '호버 비활성화' : '호버 활성화'}
					</button>
				</div>
				<div
					ref={ref}
					{...hoverProps}
					style={{
						padding: '20px',
						border: '2px solid #ccc',
						borderRadius: '8px',
						backgroundColor: isHovered ? '#e3f2fd' : '#f5f5f5',
						transition: 'all 0.3s ease',
						cursor: enabled ? 'pointer' : 'default',
						minWidth: '200px',
						textAlign: 'center',
						opacity: enabled ? 1 : 0.5,
					}}
				>
					{enabled ? (isHovered ? '✅ 호버됨!' : '👆 호버해보세요') : '❌ 호버 비활성화됨'}
				</div>
				<div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
					<p>상태: {enabled ? '활성화' : '비활성화'}</p>
					<p>호버: {isHovered ? '예' : '아니오'}</p>
				</div>
			</ToggleComponent>
		);
	},
};

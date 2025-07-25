import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		docs: {
			// 자동 문서 생성 활성화 (tag가 있는 스토리에만)
			autodocs: 'tag',
			// 기본 문서 이름 설정
			defaultName: 'Documentation',
			// 테이블 of contents 활성화
			toc: true,
			// 코드 블록을 기본적으로 보이게 설정
			canvas: {
				sourceState: 'none',
				hidden: true,
			}, // 스토리 렌더링 비활성화
			story: {
				iframeHeight: '0px',
				inline: false,
			},
		},
	},
	// 모든 스토리에 autodocs 태그 추가
	tags: ['autodocs'],
};

export default preview;

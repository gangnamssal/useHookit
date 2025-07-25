import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
	stories: [
		'../stories/**/*.mdx', // MDX 파일 지원 추가
		'../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
	],
	addons: ['@storybook/addon-docs', '@storybook/addon-onboarding'],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
};

export default config;

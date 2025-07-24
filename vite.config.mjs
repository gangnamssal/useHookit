import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
	build: {
		lib: {
			entry: {
				index: resolve(__dirname, 'src/index.ts'),
				ui: resolve(__dirname, 'src/ui/index.ts'),
				utility: resolve(__dirname, 'src/utility/index.ts'),
				lifecycle: resolve(__dirname, 'src/lifecycle/index.ts'),
				performance: resolve(__dirname, 'src/performance/index.ts'),
				storage: resolve(__dirname, 'src/storage/index.ts'),
			},
			name: 'useHookit',
			fileName: (format, entryName) => `${entryName}.${format}.js`,
		},
		rollupOptions: {
			external: ['react'],
			output: {
				globals: {
					react: 'React',
				},
			},
		},
	},
	plugins: [
		{
			name: 'generate-types',
			writeBundle() {
				// TypeScript 타입 정의 파일 생성을 위한 플러그인
				// 실제 타입 정의는 별도 스크립트로 생성
			},
		},
	],
});

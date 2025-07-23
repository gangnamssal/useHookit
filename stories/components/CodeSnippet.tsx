import React, { useState, useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

interface CodeSnippetProps {
	code: string;
	language?: string;
	title?: string;
}

export function CodeSnippet({ code, language = 'tsx', title }: CodeSnippetProps) {
	const [copied, setCopied] = useState(false);
	const [highlightedCode, setHighlightedCode] = useState('');

	useEffect(() => {
		// Prism.js로 코드 하이라이팅
		const highlighted = Prism.highlight(
			code,
			Prism.languages[language] || Prism.languages.tsx,
			language,
		);
		setHighlightedCode(highlighted);
	}, [code, language]);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('복사 실패:', err);
		}
	};

	// 복사 아이콘 SVG
	const CopyIcon = () => (
		<svg
			width='16'
			height='16'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		>
			<rect x='9' y='9' width='13' height='13' rx='2' ry='2' />
			<path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' />
		</svg>
	);

	// 체크 아이콘 SVG
	const CheckIcon = () => (
		<svg
			width='16'
			height='16'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		>
			<polyline points='20,6 9,17 4,12' />
		</svg>
	);

	return (
		<div style={{ position: 'relative' }}>
			{title && (
				<div
					style={{
						marginBottom: '8px',
						fontSize: '14px',
						fontWeight: 'bold',
						color: '#495057',
					}}
				>
					{title}
				</div>
			)}
			<button
				onClick={handleCopy}
				style={{
					position: 'absolute',
					top: title ? '32px' : '10px',
					right: '10px',
					padding: '8px',
					backgroundColor: copied ? '#28a745' : 'rgba(108, 117, 125, 0.8)',
					color: 'white',
					border: 'none',
					borderRadius: '4px',
					cursor: 'pointer',
					zIndex: 1,
					transition: 'all 0.2s ease',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: '32px',
					height: '32px',
				}}
				title={copied ? '복사됨' : '복사'}
			>
				{copied ? <CheckIcon /> : <CopyIcon />}
			</button>
			<pre
				style={{
					backgroundColor: '#1e1e1e', // VSCode 다크 테마 배경색
					padding: '16px 48px 16px 16px', // 오른쪽 여백 추가
					borderRadius: '6px',
					border: '1px solid #3c3c3c',
					overflow: 'auto',
					fontSize: '13px',
					margin: 0,
					position: 'relative',
					maxHeight: '400px',
					lineHeight: '1.5',
					fontFamily:
						'"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
					// 스크롤바 숨기기
					scrollbarWidth: 'none', // Firefox
					msOverflowStyle: 'none', // IE/Edge
				}}
			>
				<code
					className={`language-${language}`}
					dangerouslySetInnerHTML={{ __html: highlightedCode }}
					style={{
						color: '#d4d4d4', // VSCode 기본 텍스트 색상
						background: 'transparent',
						padding: 0,
						borderRadius: 0,
						fontSize: 'inherit',
						fontFamily: 'inherit',
					}}
				/>
			</pre>
			{/* 스크롤바 숨기기 (Webkit) */}
			<style
				dangerouslySetInnerHTML={{
					__html: `
					pre::-webkit-scrollbar {
						display: none;
					}
				`,
				}}
			/>
		</div>
	);
}

import React, { useState } from 'react';
import { CodeSnippet } from './CodeSnippet';

interface ToggleComponentProps {
	children: React.ReactNode;
	code: string;
	title: string;
	description: string;
}

export function ToggleComponent({ children, code, title, description }: ToggleComponentProps) {
	const [showCode, setShowCode] = useState(false);

	return (
		<div style={{ marginBottom: '30px' }}>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '15px',
				}}
			>
				<div>
					<h3 style={{ margin: 0 }}>{title}</h3>
				</div>
				<div style={{ display: 'flex', gap: '8px' }}>
					<button
						onClick={() => setShowCode(false)}
						style={{
							padding: '8px 16px',
							backgroundColor: !showCode ? '#007bff' : '#f8f9fa',
							color: !showCode ? 'white' : '#495057',
							border: `1px solid ${!showCode ? '#007bff' : '#dee2e6'}`,
							borderRadius: '6px',
							cursor: 'pointer',
							fontSize: '13px',
							fontWeight: '500',
							transition: 'all 0.2s ease',
						}}
					>
						Preview
					</button>
					<button
						onClick={() => setShowCode(true)}
						style={{
							padding: '8px 16px',
							backgroundColor: showCode ? '#007bff' : '#f8f9fa',
							color: showCode ? 'white' : '#495057',
							border: `1px solid ${showCode ? '#007bff' : '#dee2e6'}`,
							borderRadius: '6px',
							cursor: 'pointer',
							fontSize: '13px',
							fontWeight: '500',
							transition: 'all 0.2s ease',
						}}
					>
						Code
					</button>
				</div>
			</div>

			{showCode ? (
				<CodeSnippet code={code} />
			) : (
				<div>
					<p style={{ marginBottom: '15px', color: '#6c757d' }}>{description}</p>
					{children}
				</div>
			)}
		</div>
	);
}

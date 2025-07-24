import { useState } from 'react';
import { useCopyToClipboard } from '@/utility/useCopyToClipboard';
import { ToggleComponent } from '../../components/ToggleComponent';

export default {
	title: 'Utility/useCopyToClipboard',
	parameters: {
		layout: 'centered',
	},
};

// 코드 스니펫들
const basicCode = `const { copyToClipboard, isCopied, message } = useCopyToClipboard();

const handleCopy = async () => {
  try {
    await copyToClipboard(text);
  } catch (err) {
    console.error('복사 실패:', err);
  }
};

return (
  <button onClick={handleCopy}>
    {isCopied ? '✅ 복사됨' : '📋 복사하기'}
  </button>
);`;

const presetTextsCode = `const { copyToClipboard, isCopied } = useCopyToClipboard();

const presetTexts = [
  '안녕하세요! 반갑습니다.',
  '이메일: example@email.com',
  '전화번호: 010-1234-5678',
];

const handleCopy = async (text: string) => {
  await copyToClipboard(text);
};

return (
  <div>
    {presetTexts.map((text, index) => (
      <button key={index} onClick={() => handleCopy(text)}>
        복사
      </button>
    ))}
  </div>
);`;

const formDataCode = `const { copyToClipboard, isCopied } = useCopyToClipboard();
const [formData, setFormData] = useState({
  name: '', email: '', phone: '', address: ''
});

const handleCopyFormData = async () => {
  const formattedData = \`
이름: \${formData.name}
이메일: \${formData.email}
전화번호: \${formData.phone}
주소: \${formData.address}
  \`.trim();

  await copyToClipboard(formattedData);
};

return (
  <button onClick={handleCopyFormData}>
    {isCopied ? '복사됨' : '폼 데이터 복사'}
  </button>
);`;

function UseCopyToClipboardDemo() {
	const [copyText, setCopyText] = useState('');
	const { copyToClipboard, isCopied, message } = useCopyToClipboard();

	const handleCopy = async () => {
		try {
			await copyToClipboard(copyText);
		} catch (err) {
			console.error('복사 실패:', err);
		}
	};

	return (
		<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
			<h3>useCopyToClipboard 훅 데모</h3>
			<p>텍스트를 클립보드에 복사하는 훅입니다.</p>

			<div style={{ marginBottom: '20px' }}>
				<h4>텍스트 입력</h4>
				<textarea
					value={copyText}
					onChange={(e) => setCopyText(e.target.value)}
					placeholder='복사할 텍스트를 입력하세요'
					style={{
						width: '100%',
						height: '100px',
						padding: '10px',
						border: '1px solid #ccc',
						borderRadius: '4px',
						resize: 'vertical',
						marginBottom: '10px',
					}}
				/>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<button
					onClick={handleCopy}
					disabled={!copyText.trim()}
					style={{
						padding: '10px 20px',
						backgroundColor: isCopied ? '#28a745' : '#007bff',
						color: 'white',
						border: 'none',
						borderRadius: '4px',
						cursor: !copyText.trim() ? 'not-allowed' : 'pointer',
						opacity: !copyText.trim() ? 0.6 : 1,
					}}
				>
					{isCopied ? '✅ 복사됨' : '📋 복사하기'}
				</button>
			</div>

			{message && (
				<div
					style={{
						padding: '10px',
						backgroundColor: isCopied ? '#d4edda' : '#f8d7da',
						color: isCopied ? '#155724' : '#721c24',
						borderRadius: '4px',
						border: `1px solid ${isCopied ? '#c3e6cb' : '#f5c6cb'}`,
						marginBottom: '20px',
					}}
				>
					<p>
						<strong>상태:</strong> {message}
					</p>
				</div>
			)}

			<div
				style={{
					padding: '15px',
					backgroundColor: '#f8f9fa',
					borderRadius: '4px',
					border: '1px solid #dee2e6',
				}}
			>
				<p>
					<strong>사용법:</strong>
				</p>
				<ul>
					<li>텍스트를 입력하고 복사 버튼을 클릭하세요</li>
					<li>복사가 성공하면 버튼이 변경됩니다</li>
					<li>브라우저에서 클립보드 접근을 허용해야 합니다</li>
				</ul>
			</div>
		</div>
	);
}

export const Default = () => (
	<ToggleComponent
		code={basicCode}
		title='기본 사용법'
		description='useCopyToClipboard 훅의 기본적인 사용법을 보여줍니다. 텍스트를 클립보드에 복사하는 기능을 포함합니다.'
	>
		<UseCopyToClipboardDemo />
	</ToggleComponent>
);

export const WithPresetTexts = () => {
	const { copyToClipboard, isCopied, message } = useCopyToClipboard();

	const presetTexts = [
		'안녕하세요! 반갑습니다.',
		'이메일: example@email.com',
		'전화번호: 010-1234-5678',
		'https://example.com',
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
	];

	const handleCopy = async (text: string) => {
		try {
			await copyToClipboard(text);
		} catch (err) {
			console.error('복사 실패:', err);
		}
	};

	return (
		<ToggleComponent
			code={presetTextsCode}
			title='미리 정의된 텍스트 복사'
			description='자주 사용하는 텍스트를 빠르게 복사할 수 있는 예제입니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>미리 정의된 텍스트 복사</h3>
				<p>자주 사용하는 텍스트를 빠르게 복사할 수 있습니다.</p>

				<div style={{ marginBottom: '20px' }}>
					{presetTexts.map((text, index) => (
						<div
							key={index}
							style={{
								padding: '10px',
								margin: '5px 0',
								backgroundColor: '#f8f9fa',
								borderRadius: '4px',
								border: '1px solid #dee2e6',
							}}
						>
							<p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>{text}</p>
							<button
								onClick={() => handleCopy(text)}
								style={{
									padding: '5px 10px',
									backgroundColor: '#007bff',
									color: 'white',
									border: 'none',
									borderRadius: '4px',
									cursor: 'pointer',
									fontSize: '12px',
								}}
							>
								복사
							</button>
						</div>
					))}
				</div>

				{message && (
					<div
						style={{
							padding: '10px',
							backgroundColor: isCopied ? '#d4edda' : '#f8d7da',
							color: isCopied ? '#155724' : '#721c24',
							borderRadius: '4px',
							border: `1px solid ${isCopied ? '#c3e6cb' : '#f5c6cb'}`,
						}}
					>
						<p>
							<strong>상태:</strong> {message}
						</p>
					</div>
				)}
			</div>
		</ToggleComponent>
	);
};

export const WithFormData = () => {
	const { copyToClipboard, isCopied, message } = useCopyToClipboard();
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		address: '',
	});

	const handleCopyFormData = async () => {
		const formattedData = `
이름: ${formData.name}
이메일: ${formData.email}
전화번호: ${formData.phone}
주소: ${formData.address}
		`.trim();

		try {
			await copyToClipboard(formattedData);
		} catch (err) {
			console.error('복사 실패:', err);
		}
	};

	const handleInputChange =
		(field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
			setFormData((prev) => ({ ...prev, [field]: e.target.value }));
		};

	return (
		<ToggleComponent
			code={formDataCode}
			title='폼 데이터 복사'
			description='입력한 폼 데이터를 포맷팅하여 복사하는 예제입니다.'
		>
			<div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
				<h3>폼 데이터 복사</h3>
				<p>입력한 폼 데이터를 포맷팅하여 복사합니다.</p>

				<div style={{ marginBottom: '20px' }}>
					<div style={{ marginBottom: '10px' }}>
						<label>
							<strong>이름:</strong>
							<input
								type='text'
								value={formData.name}
								onChange={handleInputChange('name')}
								style={{
									marginLeft: '10px',
									padding: '5px',
									border: '1px solid #ccc',
									borderRadius: '4px',
									width: '200px',
								}}
							/>
						</label>
					</div>

					<div style={{ marginBottom: '10px' }}>
						<label>
							<strong>이메일:</strong>
							<input
								type='email'
								value={formData.email}
								onChange={handleInputChange('email')}
								style={{
									marginLeft: '10px',
									padding: '5px',
									border: '1px solid #ccc',
									borderRadius: '4px',
									width: '200px',
								}}
							/>
						</label>
					</div>

					<div style={{ marginBottom: '10px' }}>
						<label>
							<strong>전화번호:</strong>
							<input
								type='tel'
								value={formData.phone}
								onChange={handleInputChange('phone')}
								style={{
									marginLeft: '10px',
									padding: '5px',
									border: '1px solid #ccc',
									borderRadius: '4px',
									width: '200px',
								}}
							/>
						</label>
					</div>

					<div style={{ marginBottom: '10px' }}>
						<label>
							<strong>주소:</strong>
							<input
								type='text'
								value={formData.address}
								onChange={handleInputChange('address')}
								style={{
									marginLeft: '10px',
									padding: '5px',
									border: '1px solid #ccc',
									borderRadius: '4px',
									width: '300px',
								}}
							/>
						</label>
					</div>
				</div>

				<div style={{ marginBottom: '20px' }}>
					<button
						onClick={handleCopyFormData}
						disabled={!Object.values(formData).some((value) => value.trim())}
						style={{
							padding: '10px 20px',
							backgroundColor: isCopied ? '#28a745' : '#007bff',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: !Object.values(formData).some((value) => value.trim())
								? 'not-allowed'
								: 'pointer',
							opacity: !Object.values(formData).some((value) => value.trim()) ? 0.6 : 1,
						}}
					>
						{isCopied ? '✅ 폼 데이터 복사됨' : '📋 폼 데이터 복사'}
					</button>
				</div>

				{message && (
					<div
						style={{
							padding: '10px',
							backgroundColor: isCopied ? '#d4edda' : '#f8d7da',
							color: isCopied ? '#155724' : '#721c24',
							borderRadius: '4px',
							border: `1px solid ${isCopied ? '#c3e6cb' : '#f5c6cb'}`,
						}}
					>
						<p>
							<strong>상태:</strong> {message}
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
						<li>폼 데이터를 포맷팅하여 복사합니다</li>
						<li>빈 필드는 자동으로 제외됩니다</li>
						<li>복사된 데이터는 다른 곳에 붙여넣기할 수 있습니다</li>
					</ul>
				</div>
			</div>
		</ToggleComponent>
	);
};

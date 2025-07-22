import { useState, useCallback } from 'react';

/**
 * useCopyToClipboard 훅 옵션 타입
 *
 * @property {number} [timeout] - 복사 성공 상태를 유지할 시간(ms) (기본값: 2000)
 *
 * @property {string} [successMessage] - 복사 성공 시 표시할 메시지 (기본값: '복사되었습니다')
 *
 * @property {string} [errorMessage] - 복사 실패 시 표시할 메시지 (기본값: '복사에 실패했습니다')
 *
 */
interface UseCopyToClipboardOptions {
	timeout?: number;
	successMessage?: string;
	errorMessage?: string;
}

/**
 *
 * 텍스트를 클립보드에 복사하고 복사 성공 여부를 반환하는 커스텀 훅입니다.
 *
 * A custom hook that copies text to clipboard and returns the copy success status.
 *
 * @param {UseCopyToClipboardOptions} [options] - 훅 옵션 / Hook options
 *
 * @param {number} [options.timeout] - 복사 성공 상태를 유지할 시간(ms) (기본값: 2000) / Time to keep success status (ms) (default: 2000)
 *
 * @param {string} [options.successMessage] - 복사 성공 시 표시할 메시지 (기본값: '복사되었습니다') / Success message to display (default: '복사되었습니다')
 *
 * @param {string} [options.errorMessage] - 복사 실패 시 표시할 메시지 (기본값: '복사에 실패했습니다') / Error message to display (default: '복사에 실패했습니다')
 *
 * @returns {Object} 복사 관련 상태와 함수들을 포함한 객체 / Object containing copy-related states and functions
 *
 * @returns {boolean} isCopied - 복사 성공 여부 / Whether copy was successful
 *
 * @returns {boolean} isCopying - 복사 진행 중 여부 / Whether copy is in progress
 *
 * @returns {string} message - 현재 상태 메시지 / Current status message
 *
 * @returns {(text: string) => Promise<boolean>} copyToClipboard - 클립보드에 복사하는 함수 / Function to copy to clipboard
 *
 * @returns {() => void} reset - 상태를 초기화하는 함수 / Function to reset state
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
 * const { isCopied, isCopying, message, copyToClipboard, reset } = useCopyToClipboard();
 *
 * const handleCopy = async () => {
 *   const success = await copyToClipboard('복사할 텍스트');
 *   if (success) {
 *     console.log('복사 성공!');
 *   }
 * };
 *
 * return (
 *   <div>
 *     <button onClick={handleCopy} disabled={isCopying}>
 *       {isCopying ? '복사 중...' : '복사'}
 *     </button>
 *     {message && <span>{message}</span>}
 *     {isCopied && <button onClick={reset}>초기화</button>}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // 커스텀 옵션 사용 / Custom options usage
 * const { isCopied, copyToClipboard } = useCopyToClipboard({
 *   timeout: 3000,
 *   successMessage: '클립보드에 복사되었습니다!',
 *   errorMessage: '복사할 수 없습니다'
 * });
 *
 * const handleCopyUrl = async () => {
 *   await copyToClipboard(window.location.href);
 * };
 * ```
 *
 * @example
 * ```tsx
 * // 복잡한 데이터 복사 / Copy complex data
 * const { copyToClipboard } = useCopyToClipboard();
 *
 * const handleCopyObject = async () => {
 *   const data = {
 *     name: 'John Doe',
 *     email: 'john@example.com',
 *     phone: '010-1234-5678'
 *   };
 *
 *   await copyToClipboard(JSON.stringify(data, null, 2));
 * };
 * ```
 *
 */
export function useCopyToClipboard(options: UseCopyToClipboardOptions = {}): {
	isCopied: boolean;
	isCopying: boolean;
	message: string;
	copyToClipboard: (text: string) => Promise<boolean>;
	reset: () => void;
} {
	const {
		timeout = 2000,
		successMessage = '복사되었습니다',
		errorMessage = '복사에 실패했습니다',
	} = options;

	const [isCopied, setIsCopied] = useState(false);
	const [isCopying, setIsCopying] = useState(false);
	const [message, setMessage] = useState('');

	/**
	 * 클립보드에 텍스트를 복사하는 함수
	 * @param {string} text - 복사할 텍스트
	 * @returns {Promise<boolean>} 복사 성공 여부
	 */
	const copyToClipboard = useCallback(
		async (text: string): Promise<boolean> => {
			// navigator.clipboard 지원 여부 체크
			if (!navigator.clipboard) {
				console.warn('useCopyToClipboard: navigator.clipboard is not supported in this browser');
				setMessage(errorMessage);
				return false;
			}

			// 텍스트 유효성 검사
			if (!text || typeof text !== 'string') {
				console.warn('useCopyToClipboard: text must be a non-empty string');
				setMessage(errorMessage);
				return false;
			}

			// timeout 유효성 검사
			if (timeout < 0) {
				console.warn('useCopyToClipboard: timeout must be non-negative');
			}

			setIsCopying(true);
			setMessage('');

			try {
				await navigator.clipboard.writeText(text);
				setIsCopied(true);
				setMessage(successMessage);

				// timeout 후에 성공 상태 초기화
				if (timeout > 0) {
					setTimeout(() => {
						setIsCopied(false);
						setMessage('');
					}, timeout);
				}

				return true;
			} catch (error) {
				console.error('useCopyToClipboard: Failed to copy to clipboard:', error);
				setIsCopied(false);
				setMessage(errorMessage);
				return false;
			} finally {
				setIsCopying(false);
			}
		},
		[timeout, successMessage, errorMessage],
	);

	/**
	 * 상태를 초기화하는 함수
	 */
	const reset = useCallback(() => {
		setIsCopied(false);
		setIsCopying(false);
		setMessage('');
	}, []);

	return {
		isCopied,
		isCopying,
		message,
		copyToClipboard,
		reset,
	};
}

import { useState, useCallback } from 'react';
import { useIsMounted } from '../lifecycle/useIsMounted';

/**
 * useCopyToClipboard hook options type
 *
 * @property {number} [timeout] - Time to keep success status (ms) (default: 2000)
 *
 * @property {string} [successMessage] - Success message to display (default: 'Copied!')
 *
 * @property {string} [errorMessage] - Error message to display (default: 'Copy failed')
 *
 */
interface UseCopyToClipboardOptions {
	/** Time to keep success status (ms) */
	timeout?: number;

	/** Success message to display */
	successMessage?: string;

	/** Error message to display */
	errorMessage?: string;
}

/**
 * A custom hook that copies text to clipboard and returns the copy success status.
 *
 * @param {UseCopyToClipboardOptions} [options] - Hook options
 *
 * @param {number} [options.timeout] - Time to keep success status (ms) (default: 2000)
 *
 * @param {string} [options.successMessage] - Success message to display (default: 'Copied!')
 *
 * @param {string} [options.errorMessage] - Error message to display (default: 'Copy failed')
 *
 * @returns {boolean} isCopied - Whether copy was successful
 *
 * @returns {boolean} isCopying - Whether copy is in progress
 *
 * @returns {string} message - Current status message
 *
 * @returns {(text: string) => Promise<boolean>} copyToClipboard - Function to copy to clipboard
 *
 * @returns {() => void} reset - Function to reset state
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { isCopied, isCopying, message, copyToClipboard, reset } = useCopyToClipboard();
 *
 * const handleCopy = async () => {
 *   const success = await copyToClipboard('Text to copy');
 *   if (success) {
 *     console.log('Copy successful!');
 *   }
 * };
 *
 * return (
 *   <div>
 *     <button onClick={handleCopy} disabled={isCopying}>
 *       {isCopying ? 'Copying...' : 'Copy'}
 *     </button>
 *     {message && <span>{message}</span>}
 *     {isCopied && <button onClick={reset}>Reset</button>}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Custom options usage
 * const { isCopied, copyToClipboard } = useCopyToClipboard({
 *   timeout: 3000,
 *   successMessage: 'Copied to clipboard!',
 *   errorMessage: 'Cannot copy'
 * });
 *
 * const handleCopyUrl = async () => {
 *   await copyToClipboard(window.location.href);
 * };
 * ```
 *
 * @example
 * ```tsx
 * // Copy complex data
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
 * @link https://use-hookit.vercel.app/?path=/docs/utility-usecopytoclipboard--docs
 */
export function useCopyToClipboard(options: UseCopyToClipboardOptions = {}): {
	isCopied: boolean;
	isCopying: boolean;
	message: string;
	copyToClipboard: (text: string) => Promise<boolean>;
	reset: () => void;
} {
	const { timeout = 2000, successMessage = 'Copied!', errorMessage = 'Copy failed' } = options;

	const isMounted = useIsMounted();

	const [isCopied, setIsCopied] = useState(false);
	const [isCopying, setIsCopying] = useState(false);
	const [message, setMessage] = useState('');

	/**
	 * Function to copy text to clipboard
	 * @param {string} text - Text to copy
	 * @returns {Promise<boolean>} Copy success status
	 */
	const copyToClipboard = useCallback(
		async (text: string): Promise<boolean> => {
			if (!isMounted) {
				return false;
			}

			// Check if navigator.clipboard is supported
			if (!navigator.clipboard) {
				if (isMounted) {
					console.warn('useCopyToClipboard: navigator.clipboard is not supported in this browser');
				}
				setMessage(errorMessage);
				return false;
			}

			// Validate text
			if (!text || typeof text !== 'string') {
				if (isMounted) {
					console.warn('useCopyToClipboard: text must be a non-empty string');
				}
				setMessage(errorMessage);
				return false;
			}

			// Validate timeout
			if (timeout < 0) {
				if (isMounted) {
					console.warn('useCopyToClipboard: timeout must be non-negative');
				}
			}

			setIsCopying(true);
			setMessage('');

			try {
				await navigator.clipboard.writeText(text);
				setIsCopied(true);
				setMessage(successMessage);

				// Reset success state after timeout
				if (timeout > 0) {
					setTimeout(() => {
						if (isMounted) {
							setIsCopied(false);
							setMessage('');
						}
					}, timeout);
				}

				return true;
			} catch (error) {
				if (isMounted) {
					console.error('useCopyToClipboard: Failed to copy to clipboard:', error);
				}
				setIsCopied(false);
				setMessage(errorMessage);
				return false;
			} finally {
				setIsCopying(false);
			}
		},
		[timeout, successMessage, errorMessage, isMounted],
	);

	/**
	 * Function to reset state
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

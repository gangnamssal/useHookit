import { useCallback, useEffect, useRef, useState } from 'react';
import { useIsMounted } from '../lifecycle/useIsMounted';

/**
 * Configuration options for the useKeyPress hook.
 */
interface UseKeyPressOptions {
	/** Target element to listen for key events (default: document) */
	target?: EventTarget | null;

	/** Whether to prevent default behavior (default: false) */
	preventDefault?: boolean;

	/** Whether the hook is enabled (default: true) */
	enabled?: boolean;

	/** Whether to listen for keydown events (default: true) */
	keydown?: boolean;

	/** Whether to listen for keyup events (default: true) */
	keyup?: boolean;

	/** Custom key mappings for different keyboard layouts */
	keyMappings?: Record<string, string>;
}

/**
 * Return value from the useKeyPress hook.
 */
interface UseKeyPressReturn {
	/** Whether the key is currently pressed */
	isPressed: boolean;

	/** Key code of the pressed key (null when not pressed) */
	keyCode: string | null;

	/** Timestamp when the key was pressed (null when not pressed) */
	pressedAt: number | null;

	/** Duration the key has been held in milliseconds (null when not pressed) */
	holdDuration: number | null;
}

/**
 * A custom hook that detects keyboard key presses with comprehensive event handling.
 * Supports single keys, key combinations, and various event types (keydown/keyup).
 * Features automatic cleanup, key normalization, and hold duration tracking.
 *
 * @param {string | string[]} key - Key(s) to listen for (case insensitive)
 *
 * @param {UseKeyPressOptions} [options] - Configuration options
 *
 * @param {EventTarget | null} [options.target] - Target element (default: document)
 *
 * @param {boolean} [options.preventDefault] - Prevent default behavior (default: false)
 *
 * @param {boolean} [options.enabled] - Whether the hook is enabled (default: true)
 *
 * @param {boolean} [options.keydown] - Listen for keydown events (default: true)
 *
 * @param {boolean} [options.keyup] - Listen for keyup events (default: true)
 *
 * @param {Record<string, string>} [options.keyMappings] - Custom key mappings for different keyboard layouts
 *
 * @returns {boolean} isPressed - Whether the key is currently pressed
 *
 * @returns {string | null} keyCode - Key code of the pressed key (null when not pressed)
 *
 * @returns {number | null} pressedAt - Timestamp when the key was pressed (null when not pressed)
 *
 * @returns {number | null} holdDuration - Duration the key has been held in milliseconds (null when not pressed)
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { isPressed, keyCode, holdDuration } = useKeyPress('Enter');
 *
 * return (
 *   <div>
 *     <p>Status: {isPressed ? 'Pressed' : 'Released'}</p>
 *     <p>Key: {keyCode || 'None'}</p>
 *     <p>Hold Duration: {holdDuration ? `${holdDuration}ms` : '0ms'}</p>
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Key combination usage
 * const { isPressed, keyCode } = useKeyPress(['Control', 'a']);
 *
 * return (
 *   <div>
 *     {isPressed ? 'Ctrl+A detected!' : 'Press Ctrl+A'}
 *     <p>Detected key: {keyCode || 'None'}</p>
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Custom key mappings for international keyboards
 * const { isPressed } = useKeyPress('a', {
 *   keyMappings: { 'ㅁ': 'a' }
 * });
 *
 * return (
 *   <div>
 *     <p>A key status: {isPressed ? 'Detected' : 'None'}</p>
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Target element usage
 * const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
 *
 * const { isPressed } = useKeyPress('Escape', {
 *   target: inputRef
 * });
 *
 * return (
 *   <div>
 *     <input ref={setInputRef} placeholder="Press Escape" />
 *     <p>Escape key status: {isPressed ? 'Pressed' : 'Released'}</p>
 *   </div>
 * );
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/ui-usekeypress--docs
 */
export function useKeyPress(
	key: string | string[],
	options: UseKeyPressOptions = {},
): UseKeyPressReturn {
	const {
		target,
		preventDefault = false,
		enabled = true,
		keydown = true,
		keyup = true,
		keyMappings = {},
	} = options;

	const isMounted = useIsMounted();

	const [isPressed, setIsPressed] = useState(false);
	const [keyCode, setKeyCode] = useState<string | null>(null);
	const [pressedAt, setPressedAt] = useState<number | null>(null);
	const [holdDuration, setHoldDuration] = useState<number | null>(null);

	// Refs for internal state management
	const pressedKeysRef = useRef<Set<string>>(new Set());
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const startTimeRef = useRef<number | null>(null);
	const normalizedKeysRef = useRef<string[]>([]);

	const actualTarget = isMounted ? target ?? document : null;

	// Normalize key function
	const normalizeKey = useCallback((key: string): string => {
		if (!key) return '';
		const normalized = key.toLowerCase();
		return normalized === 'control' || normalized === 'ctrl' ? 'ctrl' : normalized;
	}, []);

	// Apply key mappings
	const applyKeyMappings = useCallback(
		(key: string): string => {
			const normalized = key.toLowerCase();
			return keyMappings[normalized]?.toLowerCase() || normalized;
		},
		[Object.keys(keyMappings).join(',')],
	);

	// Reset all state
	const resetState = useCallback(() => {
		setIsPressed(false);
		setKeyCode(null);
		setPressedAt(null);
		setHoldDuration(null);
		startTimeRef.current = null;
		pressedKeysRef.current.clear();
		if (intervalRef.current && isMounted) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, [isMounted]);

	// Check if all required keys are pressed
	const checkAllKeysPressed = useCallback(() => {
		return normalizedKeysRef.current.every((k) => pressedKeysRef.current.has(k));
	}, []);

	// Activate key (when all keys are pressed)
	const activateKey = useCallback(
		(keyboardEvent: KeyboardEvent) => {
			if (!isMounted) return;

			const now = Date.now();
			setKeyCode(keyboardEvent.key);
			setPressedAt(now);
			startTimeRef.current = now;
			setIsPressed(true);
			setHoldDuration(0);

			// Clear existing interval
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}

			// Start hold duration tracking with captured startTime
			intervalRef.current = setInterval(() => {
				if (startTimeRef.current && isMounted) {
					const newDuration = Date.now() - startTimeRef.current;
					setHoldDuration(newDuration);
				}
			}, 16); // Update every 16ms for better performance
		},
		[isMounted],
	);

	// Deactivate key (when any key is released)
	const deactivateKey = useCallback(() => {
		// Only reset holdDuration if all keys are released
		if (pressedKeysRef.current.size === 0) {
			setHoldDuration(null);
		}
		setIsPressed(false);
		setKeyCode(null);
		setPressedAt(null);
		startTimeRef.current = null;
		if (intervalRef.current && isMounted) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, [isMounted]);

	// Handle keydown events
	const handleKeyDown = useCallback(
		(event: Event) => {
			if (!enabled || !isMounted) return;

			const keyboardEvent = event as KeyboardEvent;
			const eventKey = normalizeKey(keyboardEvent.key);
			const mappedKey = applyKeyMappings(eventKey);

			if (!normalizedKeysRef.current.includes(mappedKey)) return;

			if (preventDefault) {
				keyboardEvent.preventDefault();
			}

			// Check if key is already pressed (prevent key repeat events)
			if (pressedKeysRef.current.has(mappedKey)) {
				return;
			}

			pressedKeysRef.current.add(mappedKey);

			if (checkAllKeysPressed()) {
				activateKey(keyboardEvent);
			}
		},
		[
			enabled,
			preventDefault,
			normalizeKey,
			applyKeyMappings,
			checkAllKeysPressed,
			activateKey,
			isMounted,
		],
	);

	// Handle keyup events
	const handleKeyUp = useCallback(
		(event: Event) => {
			if (!enabled || !isMounted) return;

			const keyboardEvent = event as KeyboardEvent;
			const eventKey = normalizeKey(keyboardEvent.key);
			const mappedKey = applyKeyMappings(eventKey);

			if (!normalizedKeysRef.current.includes(mappedKey)) return;

			if (preventDefault) {
				keyboardEvent.preventDefault();
			}

			pressedKeysRef.current.delete(mappedKey);

			if (!checkAllKeysPressed()) {
				deactivateKey();
			}
		},
		[
			enabled,
			preventDefault,
			normalizeKey,
			applyKeyMappings,
			checkAllKeysPressed,
			deactivateKey,
			isMounted,
		],
	);

	// Update normalized keys when key prop changes
	useEffect(() => {
		const keys = Array.isArray(key) ? key : [key];
		const newNormalizedKeys = keys.map(normalizeKey);

		// Check if keys have actually changed
		const keysChanged =
			newNormalizedKeys.length !== normalizedKeysRef.current.length ||
			newNormalizedKeys.some((key, index) => key !== normalizedKeysRef.current[index]);

		if (keysChanged) {
			normalizedKeysRef.current = newNormalizedKeys;
			resetState();
		}
	}, [key, normalizeKey, resetState]);

	useEffect(() => {
		if (!actualTarget || !isMounted) return;

		if (keydown) {
			actualTarget.addEventListener('keydown', handleKeyDown);
		}
		if (keyup) {
			actualTarget.addEventListener('keyup', handleKeyUp);
		}

		return () => {
			if (keydown) {
				actualTarget.removeEventListener('keydown', handleKeyDown);
			}
			if (keyup) {
				actualTarget.removeEventListener('keyup', handleKeyUp);
			}
		};
	}, [actualTarget, keydown, keyup, handleKeyDown, handleKeyUp, isMounted]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (intervalRef.current && isMounted) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [isMounted]);

	return {
		isPressed,
		keyCode,
		pressedAt,
		holdDuration,
	};
}

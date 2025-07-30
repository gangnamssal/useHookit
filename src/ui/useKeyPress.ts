import { useCallback, useEffect, useRef, useState } from 'react';

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
 * @param {UseKeyPressOptions} [options] - Configuration options
 * @param {EventTarget | null} [options.target] - Target element (default: document)
 * @param {boolean} [options.preventDefault] - Prevent default behavior (default: false)
 * @param {boolean} [options.enabled] - Whether the hook is enabled (default: true)
 * @param {boolean} [options.keydown] - Listen for keydown events (default: true)
 * @param {boolean} [options.keyup] - Listen for keyup events (default: true)
 * @param {Record<string, string>} [options.keyMappings] - Custom key mappings for different keyboard layouts
 *
 * @returns {UseKeyPressReturn} Object containing key press state and metadata
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { isPressed, keyCode, holdDuration } = useKeyPress('Enter');
 *
 * return (
 *   <div>
 *     <p>상태: {isPressed ? '눌림' : '떼어짐'}</p>
 *     <p>키: {keyCode || '없음'}</p>
 *     <p>홀드 시간: {holdDuration ? `${holdDuration}ms` : '0ms'}</p>
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
 *     {isPressed ? 'Ctrl+A 감지됨!' : 'Ctrl+A를 눌러보세요'}
 *     <p>감지된 키: {keyCode || '없음'}</p>
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
 *     <p>A 키 상태: {isPressed ? '감지됨' : '없음'}</p>
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
 *     <input ref={setInputRef} placeholder="Escape를 눌러보세요" />
 *     <p>Escape 키 상태: {isPressed ? '눌림' : '떼어짐'}</p>
 *   </div>
 * );
 * ```
 */
export function useKeyPress(
	key: string | string[],
	options: UseKeyPressOptions = {},
): UseKeyPressReturn {
	const {
		target = document,
		preventDefault = false,
		enabled = true,
		keydown = true,
		keyup = true,
		keyMappings = {},
	} = options;

	const [isPressed, setIsPressed] = useState(false);
	const [keyCode, setKeyCode] = useState<string | null>(null);
	const [pressedAt, setPressedAt] = useState<number | null>(null);
	const [holdDuration, setHoldDuration] = useState<number | null>(null);

	// Refs for internal state management
	const pressedKeysRef = useRef<Set<string>>(new Set());
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const startTimeRef = useRef<number | null>(null);
	const normalizedKeysRef = useRef<string[]>([]);

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
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	// Check if all required keys are pressed
	const checkAllKeysPressed = useCallback(() => {
		return normalizedKeysRef.current.every((k) => pressedKeysRef.current.has(k));
	}, []);

	// Activate key (when all keys are pressed)
	const activateKey = useCallback((keyboardEvent: KeyboardEvent) => {
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
			if (startTimeRef.current) {
				const newDuration = Date.now() - startTimeRef.current;
				setHoldDuration(newDuration);
			}
		}, 16); // Update every 100ms for better performance
	}, []);

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
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	// Handle keydown events
	const handleKeyDown = useCallback(
		(event: Event) => {
			if (!enabled) return;

			const keyboardEvent = event as KeyboardEvent;
			const eventKey = normalizeKey(keyboardEvent.key);
			const mappedKey = applyKeyMappings(eventKey);

			if (!normalizedKeysRef.current.includes(mappedKey)) return;

			if (preventDefault) {
				keyboardEvent.preventDefault();
			}

			// 이미 눌린 키인지 확인 (키 반복 이벤트 방지)
			if (pressedKeysRef.current.has(mappedKey)) {
				return;
			}

			pressedKeysRef.current.add(mappedKey);

			if (checkAllKeysPressed()) {
				activateKey(keyboardEvent);
			}
		},
		[enabled, preventDefault, normalizeKey, applyKeyMappings, checkAllKeysPressed, activateKey],
	);

	// Handle keyup events
	const handleKeyUp = useCallback(
		(event: Event) => {
			if (!enabled) return;

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
		[enabled, preventDefault, normalizeKey, applyKeyMappings, checkAllKeysPressed, deactivateKey],
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

	// Set up event listeners
	useEffect(() => {
		if (!target) return;

		if (keydown) {
			target.addEventListener('keydown', handleKeyDown);
		}
		if (keyup) {
			target.addEventListener('keyup', handleKeyUp);
		}

		return () => {
			if (keydown) {
				target.removeEventListener('keydown', handleKeyDown);
			}
			if (keyup) {
				target.removeEventListener('keyup', handleKeyUp);
			}
		};
	}, [target, keydown, keyup, handleKeyDown, handleKeyUp]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, []);

	return {
		isPressed,
		keyCode,
		pressedAt,
		holdDuration,
	};
}

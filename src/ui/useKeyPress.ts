import { useCallback, useEffect, useRef, useState } from 'react';

interface UseKeyPressOptions {
	/** Target element to listen for key events (default: document) */
	target?: EventTarget | null;
	/** Whether to prevent default behavior */
	preventDefault?: boolean;
	/** Whether the hook is enabled */
	enabled?: boolean;
	/** Whether to listen for keydown events (default: true) */
	keydown?: boolean;
	/** Whether to listen for keyup events (default: false) */
	keyup?: boolean;
	/** Whether to listen for keypress events (default: false) */
	keypress?: boolean;
	/** Custom key mappings for different keyboard layouts */
	keyMappings?: Record<string, string>;
}

interface UseKeyPressReturn {
	/** Whether the key is currently pressed */
	isPressed: boolean;
	/** Key code of the pressed key */
	keyCode: string | null;
	/** Timestamp when the key was pressed */
	pressedAt: number | null;
	/** Duration the key has been held (ms) */
	holdDuration: number | null;
}

/**
 * React hook for detecting keyboard key presses.
 * Supports single keys, key combinations, and various event types.
 *
 * @param {string | string[]} key - Key(s) to listen for
 * @param {UseKeyPressOptions} [options] - Hook options
 * @param {EventTarget | null} [options.target] - Target element (default: document)
 * @param {boolean} [options.preventDefault] - Prevent default behavior (default: false)
 * @param {boolean} [options.enabled] - Whether the hook is enabled (default: true)
 * @param {boolean} [options.keydown] - Listen for keydown events (default: true)
 * @param {boolean} [options.keyup] - Listen for keyup events (default: false)
 * @param {boolean} [options.keypress] - Listen for keypress events (default: false)
 * @param {Record<string, string>} [options.keyMappings] - Custom key mappings for different keyboard layouts
 *
 * @returns {UseKeyPressReturn} Object containing key press state and metadata
 * @returns {boolean} isPressed - Whether the key is currently pressed
 * @returns {string | null} keyCode - Key code of the pressed key
 * @returns {number | null} pressedAt - Timestamp when the key was pressed
 * @returns {number | null} holdDuration - Duration the key has been held (ms)
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { isPressed } = useKeyPress('Enter');
 *
 * return (
 *   <div>
 *     {isPressed ? 'Enter pressed!' : 'Press Enter'}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Key combination
 * const { isPressed } = useKeyPress(['Control', 's'], {
 *   preventDefault: true
 * });
 *
 * return (
 *   <div>
 *     {isPressed ? 'Ctrl+S pressed!' : 'Press Ctrl+S to save'}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Multiple event types
 * const { isPressed, holdDuration } = useKeyPress('Space', {
 *   keydown: true,
 *   keyup: true,
 *   preventDefault: true
 * });
 *
 * return (
 *   <div>
 *     {isPressed ? `Space held for ${holdDuration}ms` : 'Hold Space'}
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Target specific element
 * const { isPressed } = useKeyPress('Escape', {
 *   target: inputRef.current,
 *   preventDefault: true
 * });
 *
 * return (
 *   <input ref={inputRef} />
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Korean keyboard support
 * const { isPressed } = useKeyPress('a', {
 *   keyMappings: { 'ㅁ': 'a', 'ㅠ': 'b', 'ㅊ': 'c' }
 * });
 *
 * return (
 *   <div>
 *     {isPressed ? 'A key pressed!' : 'Press A (or ㅁ on Korean keyboard)'}
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
		keyup = false,
		keypress = false,
		keyMappings = {},
	} = options;

	const [isPressed, setIsPressed] = useState(false);
	const [keyCode, setKeyCode] = useState<string | null>(null);
	const [pressedAt, setPressedAt] = useState<number | null>(null);
	const [holdDuration, setHoldDuration] = useState<number | null>(null);

	const pressedKeysRef = useRef<Set<string>>(new Set());
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const startTimeRef = useRef<number | null>(null);

	// 키 배열 정규화 (메모이제이션)
	const normalizedKeys = useRef<string[]>([]);

	// 키 정규화 함수 (성능 최적화)
	const normalizeKey = useCallback((key: string): string => {
		const normalized = key.toLowerCase();
		// Control 키의 다양한 형태를 모두 'ctrl'로 정규화
		if (normalized === 'control' || normalized === 'ctrl') {
			return 'ctrl';
		}
		return normalized;
	}, []);

	// 키 매핑 적용 함수
	const applyKeyMappings = useCallback(
		(key: string): string => {
			const normalized = key.toLowerCase();
			// 사용자 정의 키 매핑 적용
			if (keyMappings[normalized]) {
				return keyMappings[normalized].toLowerCase();
			}
			return normalized;
		},
		[keyMappings],
	);

	// 키 변경 감지 함수 (성능 최적화)
	const keysChanged = useCallback((newKeys: string[], oldKeys: string[]): boolean => {
		if (newKeys.length !== oldKeys.length) return true;
		for (let i = 0; i < newKeys.length; i++) {
			if (newKeys[i] !== oldKeys[i]) return true;
		}
		return false;
	}, []);

	// 상태 초기화 함수 (중복 제거)
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

	// 키 정규화 및 변경 감지
	useEffect(() => {
		const keys = Array.isArray(key) ? key : [key];
		const newNormalizedKeys = keys.map(normalizeKey);

		if (keysChanged(newNormalizedKeys, normalizedKeys.current)) {
			normalizedKeys.current = newNormalizedKeys;
			resetState();
		}
	}, [key, normalizeKey, keysChanged, resetState]);

	// 모든 키가 눌려있는지 확인 (통합된 함수)
	const checkAllKeysPressed = useCallback(() => {
		return normalizedKeys.current.every((k) => pressedKeysRef.current.has(k));
	}, []);

	// 홀드 시간 업데이트 함수
	const updateHoldDuration = useCallback(() => {
		if (startTimeRef.current) {
			setHoldDuration(Date.now() - startTimeRef.current);
		}
	}, []);

	// 키 활성화 함수 (중복 제거)
	const activateKey = useCallback(
		(keyboardEvent: KeyboardEvent) => {
			const now = Date.now();
			// 항상 keyCode, pressedAt 갱신
			setKeyCode(keyboardEvent.key);
			setPressedAt(now);
			startTimeRef.current = now;

			if (!isPressed) {
				setIsPressed(true);
			}

			// 홀드 시간 계산을 위한 인터벌 시작 (keyup이 활성화된 경우에만)
			if (keyup) {
				setHoldDuration(0);
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
				}
				intervalRef.current = setInterval(updateHoldDuration, 16); // 60fps
			}
		},
		[isPressed, keyup, updateHoldDuration],
	);

	// 키 비활성화 함수 (중복 제거)
	const deactivateKey = useCallback(() => {
		resetState();
	}, [resetState]);

	// 키 누름 처리
	const handleKeyDown = useCallback(
		(event: Event) => {
			if (!enabled) return;

			const keyboardEvent = event as KeyboardEvent;
			const eventKey = normalizeKey(keyboardEvent.key);
			const mappedKey = applyKeyMappings(eventKey);
			const isTargetKey = normalizedKeys.current.includes(mappedKey);

			if (!isTargetKey) return;

			if (preventDefault) {
				keyboardEvent.preventDefault();
			}

			pressedKeysRef.current.add(mappedKey);

			// 모든 키가 눌려있는지 확인하고, 매번 activateKey 호출
			if (checkAllKeysPressed()) {
				activateKey(keyboardEvent);
			}
		},
		[enabled, preventDefault, checkAllKeysPressed, activateKey, normalizeKey, applyKeyMappings],
	);

	// 키 뗌 처리
	const handleKeyUp = useCallback(
		(event: Event) => {
			if (!enabled) return;

			const keyboardEvent = event as KeyboardEvent;
			const eventKey = normalizeKey(keyboardEvent.key);
			const mappedKey = applyKeyMappings(eventKey);
			const isTargetKey = normalizedKeys.current.includes(mappedKey);

			if (!isTargetKey) return;

			if (preventDefault) {
				keyboardEvent.preventDefault();
			}

			pressedKeysRef.current.delete(mappedKey);

			// 모든 키가 떼어졌는지 확인하고 비활성화
			if (!checkAllKeysPressed()) {
				deactivateKey();
			}
		},
		[enabled, preventDefault, checkAllKeysPressed, deactivateKey, normalizeKey, applyKeyMappings],
	);

	// 키프레스 처리 (keypress 이벤트)
	const handleKeyPress = useCallback(
		(event: Event) => {
			if (!enabled || !keypress) return;

			const keyboardEvent = event as KeyboardEvent;
			const eventKey = normalizeKey(keyboardEvent.key);
			const mappedKey = applyKeyMappings(eventKey);
			const isTargetKey = normalizedKeys.current.includes(mappedKey);

			if (!isTargetKey) return;

			if (preventDefault) {
				keyboardEvent.preventDefault();
			}

			// keypress는 문자 키에만 반응
			if (keyboardEvent.key.length === 1) {
				activateKey(keyboardEvent);

				// 짧은 시간 후 자동으로 해제
				setTimeout(() => {
					deactivateKey();
				}, 100);
			}
		},
		[enabled, keypress, preventDefault, activateKey, deactivateKey, normalizeKey, applyKeyMappings],
	);

	// 이벤트 리스너 등록
	useEffect(() => {
		if (!target) return;

		if (keydown) {
			target.addEventListener('keydown', handleKeyDown);
		}
		if (keyup) {
			target.addEventListener('keyup', handleKeyUp);
		}
		if (keypress) {
			target.addEventListener('keypress', handleKeyPress);
		}

		// 클린업
		return () => {
			if (keydown) {
				target.removeEventListener('keydown', handleKeyDown);
			}
			if (keyup) {
				target.removeEventListener('keyup', handleKeyUp);
			}
			if (keypress) {
				target.removeEventListener('keypress', handleKeyPress);
			}
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [target, keydown, keyup, keypress, handleKeyDown, handleKeyUp, handleKeyPress]);

	// 컴포넌트 언마운트 시 정리
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

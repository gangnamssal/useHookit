import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useKeyPress } from '../../src/ui/useKeyPress';

describe('useKeyPress', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.spyOn(Date, 'now').mockImplementation(() => 1000);
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	it('should return initial state', () => {
		const { result } = renderHook(() => useKeyPress('Enter'));

		expect(result.current.isPressed).toBe(false);
		expect(result.current.keyCode).toBe(null);
		expect(result.current.pressedAt).toBe(null);
		expect(result.current.holdDuration).toBe(null);
	});

	it('should detect single key press', () => {
		const { result } = renderHook(() => useKeyPress('Enter'));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);
		expect(result.current.keyCode).toBe('Enter');
		expect(result.current.pressedAt).toBeTypeOf('number');
		expect(result.current.holdDuration).toBe(null);
	});

	it('should detect key release', () => {
		const { result } = renderHook(() => useKeyPress('Enter', { keyup: true }));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);

		act(() => {
			const keyupEvent = new KeyboardEvent('keyup', { key: 'Enter' });
			document.dispatchEvent(keyupEvent);
		});

		expect(result.current.isPressed).toBe(false);
		expect(result.current.keyCode).toBe(null);
		expect(result.current.pressedAt).toBe(null);
		expect(result.current.holdDuration).toBe(null);
	});

	it('should handle key combinations', () => {
		const { result } = renderHook(() => useKeyPress(['Control', 's'], { keyup: true }));

		act(() => {
			const ctrlDown = new KeyboardEvent('keydown', { key: 'Control' });
			document.dispatchEvent(ctrlDown);
		});

		expect(result.current.isPressed).toBe(false);

		act(() => {
			const sDown = new KeyboardEvent('keydown', { key: 's' });
			document.dispatchEvent(sDown);
		});

		expect(result.current.isPressed).toBe(true);
		expect(result.current.keyCode).toBe('s');

		act(() => {
			const sUp = new KeyboardEvent('keyup', { key: 's' });
			document.dispatchEvent(sUp);
		});

		expect(result.current.isPressed).toBe(false);
	});

	it('should handle case insensitive keys', () => {
		const { result } = renderHook(() => useKeyPress('ENTER'));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);
		expect(result.current.keyCode).toBe('Enter');
	});

	it('should ignore non-target keys', () => {
		const { result } = renderHook(() => useKeyPress('Enter'));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Space' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(false);
		expect(result.current.keyCode).toBe(null);
	});

	it('should handle preventDefault option', () => {
		const preventDefaultSpy = vi.fn();
		const { result } = renderHook(() => useKeyPress('Enter', { preventDefault: true }));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			keydownEvent.preventDefault = preventDefaultSpy;
			document.dispatchEvent(keydownEvent);
		});

		expect(preventDefaultSpy).toHaveBeenCalled();
		expect(result.current.isPressed).toBe(true);
	});

	it('should handle enabled option', () => {
		const { result, rerender } = renderHook(({ enabled }) => useKeyPress('Enter', { enabled }), {
			initialProps: { enabled: true },
		});

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);

		rerender({ enabled: false });

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true); // 상태는 유지되지만 새로운 이벤트는 무시
	});

	it('should handle keypress events', () => {
		const { result } = renderHook(() => useKeyPress('a', { keypress: true }));

		act(() => {
			const keypressEvent = new KeyboardEvent('keypress', { key: 'a', code: 'KeyA' });
			document.dispatchEvent(keypressEvent);
		});

		expect(result.current.isPressed).toBe(true);
		expect(result.current.keyCode).toBe('a');

		// 자동 해제 확인
		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(result.current.isPressed).toBe(false);
		expect(result.current.keyCode).toBe(null);
	});

	it('should handle hold duration with keyup', () => {
		const { result } = renderHook(() => useKeyPress('Space', { keyup: true }));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Space' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.holdDuration).toBe(0);

		act(() => {
			const keyupEvent = new KeyboardEvent('keyup', { key: 'Space' });
			document.dispatchEvent(keyupEvent);
		});

		expect(result.current.holdDuration).toBe(null);
	});

	it('should not calculate hold duration without keyup', () => {
		const { result } = renderHook(() => useKeyPress('Space'));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Space' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.holdDuration).toBe(null);

		act(() => {
			const keyupEvent = new KeyboardEvent('keyup', { key: 'Space' });
			document.dispatchEvent(keyupEvent);
		});

		expect(result.current.holdDuration).toBe(null);
	});

	it('should not calculate hold duration without keyup', () => {
		const { result } = renderHook(() => useKeyPress('Space', { keydown: true }));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Space' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.holdDuration).toBe(null);

		act(() => {
			vi.advanceTimersByTime(100);
		});

		// keyup이 비활성화되면 홀드 시간이 계산되지 않음
		expect(result.current.holdDuration).toBe(null);
	});

	it('should not calculate hold duration without keyup', () => {
		const { result } = renderHook(() => useKeyPress('Space', { keydown: true, keyup: false }));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Space' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.holdDuration).toBe(null);

		act(() => {
			vi.advanceTimersByTime(100);
		});

		// keyup이 비활성화되면 홀드 시간이 계산되지 않음
		expect(result.current.holdDuration).toBe(null);
	});

	it('should handle target element', () => {
		const div = document.createElement('div');
		const { result } = renderHook(() => useKeyPress('Enter', { target: div }));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			div.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);
	});

	it('should handle multiple event types', () => {
		const { result } = renderHook(() => useKeyPress('Enter', { keydown: true, keyup: true }));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);

		act(() => {
			const keyupEvent = new KeyboardEvent('keyup', { key: 'Enter' });
			document.dispatchEvent(keyupEvent);
		});

		expect(result.current.isPressed).toBe(false);
	});

	it('should handle rapid key presses', () => {
		const { result } = renderHook(() => useKeyPress('Enter'));

		act(() => {
			const keydownEvent1 = new KeyboardEvent('keydown', { key: 'Enter' });
			document.dispatchEvent(keydownEvent1);
		});

		expect(result.current.isPressed).toBe(true);

		act(() => {
			const keydownEvent2 = new KeyboardEvent('keydown', { key: 'Enter' });
			document.dispatchEvent(keydownEvent2);
		});

		// 이미 눌려있는 상태라면 추가 처리하지 않음
		expect(result.current.isPressed).toBe(true);
	});

	it('should handle key combinations with partial release', () => {
		const { result } = renderHook(() => useKeyPress(['Control', 'Shift', 'A'], { keyup: true }));

		act(() => {
			const ctrlDown = new KeyboardEvent('keydown', { key: 'Control' });
			document.dispatchEvent(ctrlDown);
		});

		act(() => {
			const shiftDown = new KeyboardEvent('keydown', { key: 'Shift' });
			document.dispatchEvent(shiftDown);
		});

		act(() => {
			const aDown = new KeyboardEvent('keydown', { key: 'A' });
			document.dispatchEvent(aDown);
		});

		expect(result.current.isPressed).toBe(true);

		act(() => {
			const aUp = new KeyboardEvent('keyup', { key: 'A' });
			document.dispatchEvent(aUp);
		});

		expect(result.current.isPressed).toBe(false);
	});

	it('should handle empty key array', () => {
		const { result } = renderHook(() => useKeyPress([]));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(false);
	});

	it('should handle undefined options', () => {
		const { result } = renderHook(() => useKeyPress('Enter', undefined));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);
	});

	it('should handle empty options object', () => {
		const { result } = renderHook(() => useKeyPress('Enter', {}));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);
	});

	it('should handle key changes', () => {
		const { result, rerender } = renderHook(({ key }) => useKeyPress(key), {
			initialProps: { key: 'Enter' },
		});

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);

		rerender({ key: 'Space' });

		// 키가 변경되면 상태가 초기화됨 (정상적인 동작)
		expect(result.current.isPressed).toBe(false);

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Space' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);
	});

	it('should handle options changes', () => {
		const { result, rerender } = renderHook(({ options }) => useKeyPress('Enter', options), {
			initialProps: { options: { preventDefault: false } },
		});

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);

		rerender({ options: { preventDefault: true } });

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);
	});

	it('should handle cleanup on unmount', () => {
		const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
		const { unmount } = renderHook(() => useKeyPress('Space', { keyup: true }));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Space' });
			document.dispatchEvent(keydownEvent);
		});

		unmount();

		expect(clearIntervalSpy).toHaveBeenCalled();
	});

	it('should handle non-character keys in keypress', () => {
		const { result } = renderHook(() => useKeyPress('Enter', { keypress: true }));

		act(() => {
			const keypressEvent = new KeyboardEvent('keypress', { key: 'Enter' });
			document.dispatchEvent(keypressEvent);
		});

		expect(result.current.isPressed).toBe(false);
	});

	it('should handle character keys in keypress', () => {
		const { result } = renderHook(() => useKeyPress('a', { keypress: true }));

		act(() => {
			const keypressEvent = new KeyboardEvent('keypress', { key: 'a' });
			document.dispatchEvent(keypressEvent);
		});

		expect(result.current.isPressed).toBe(true);
	});

	it('should maintain state stability across re-renders', () => {
		const { result, rerender } = renderHook(() => useKeyPress('Enter'));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			document.dispatchEvent(keydownEvent);
		});

		const initialState = { ...result.current };

		rerender();

		expect(result.current).toEqual(initialState);
	});

	it('should handle mixed case key combinations', () => {
		const { result } = renderHook(() => useKeyPress(['Control', 'S'], { keyup: true }));

		act(() => {
			const ctrlDown = new KeyboardEvent('keydown', { key: 'Control' });
			document.dispatchEvent(ctrlDown);
		});

		act(() => {
			const sDown = new KeyboardEvent('keydown', { key: 's' });
			document.dispatchEvent(sDown);
		});

		expect(result.current.isPressed).toBe(true);
	});

	it('should handle numeric keys', () => {
		const { result } = renderHook(() => useKeyPress('1'));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: '1' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);
		expect(result.current.keyCode).toBe('1');
	});

	it('should handle special keys', () => {
		const { result } = renderHook(() => useKeyPress('Escape'));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Escape' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);
		expect(result.current.keyCode).toBe('Escape');
	});

	it('should handle function keys', () => {
		const { result } = renderHook(() => useKeyPress('F1'));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'F1' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);
		expect(result.current.keyCode).toBe('F1');
	});

	it('should handle arrow keys', () => {
		const { result } = renderHook(() => useKeyPress('ArrowUp'));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);
		expect(result.current.keyCode).toBe('ArrowUp');
	});

	// 추가된 엣지 케이스 테스트들
	it('should handle very long key names', () => {
		const longKeyName = 'a'.repeat(1000);
		const { result } = renderHook(() => useKeyPress(longKeyName));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: longKeyName });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);
		expect(result.current.keyCode).toBe(longKeyName);
	});

	it('should handle special character keys', () => {
		const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '=', '+'];

		specialChars.forEach((char) => {
			const { result } = renderHook(() => useKeyPress(char));

			act(() => {
				const keydownEvent = new KeyboardEvent('keydown', { key: char });
				document.dispatchEvent(keydownEvent);
			});

			expect(result.current.isPressed).toBe(true);
			expect(result.current.keyCode).toBe(char);
		});
	});

	it('should handle duplicate keys in array', () => {
		const { result } = renderHook(() => useKeyPress(['Control', 'Control', 's'], { keyup: true }));

		act(() => {
			const ctrlDown1 = new KeyboardEvent('keydown', { key: 'Control' });
			document.dispatchEvent(ctrlDown1);
		});

		act(() => {
			const ctrlDown2 = new KeyboardEvent('keydown', { key: 'Control' });
			document.dispatchEvent(ctrlDown2);
		});

		act(() => {
			const sDown = new KeyboardEvent('keydown', { key: 's' });
			document.dispatchEvent(sDown);
		});

		expect(result.current.isPressed).toBe(true);
	});

	it('should handle invalid event types gracefully', () => {
		const { result } = renderHook(() =>
			useKeyPress('Enter', { keydown: false, keyup: false, keypress: false }),
		);

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(false);
	});

	it('should handle memory leak scenarios', () => {
		const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
		const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

		const { unmount } = renderHook(() => useKeyPress('Space', { keyup: true }));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Space' });
			document.dispatchEvent(keydownEvent);
		});

		unmount();

		expect(clearIntervalSpy).toHaveBeenCalled();
		expect(removeEventListenerSpy).toHaveBeenCalled();
	});

	it('should handle concurrent key presses', () => {
		const { result } = renderHook(() => useKeyPress(['Control', 'Shift', 'Alt'], { keyup: true }));

		// 동시에 여러 키를 누름
		act(() => {
			const ctrlDown = new KeyboardEvent('keydown', { key: 'Control' });
			const shiftDown = new KeyboardEvent('keydown', { key: 'Shift' });
			const altDown = new KeyboardEvent('keydown', { key: 'Alt' });

			document.dispatchEvent(ctrlDown);
			document.dispatchEvent(shiftDown);
			document.dispatchEvent(altDown);
		});

		expect(result.current.isPressed).toBe(true);

		// 동시에 여러 키를 뗌
		act(() => {
			const ctrlUp = new KeyboardEvent('keyup', { key: 'Control' });
			const shiftUp = new KeyboardEvent('keyup', { key: 'Shift' });
			const altUp = new KeyboardEvent('keyup', { key: 'Alt' });

			document.dispatchEvent(ctrlUp);
			document.dispatchEvent(shiftUp);
			document.dispatchEvent(altUp);
		});

		expect(result.current.isPressed).toBe(false);
	});

	it('should handle timeout cleanup failures', () => {
		const clearIntervalSpy = vi.spyOn(window, 'clearInterval');
		renderHook(() => useKeyPress('Space', { keyup: true }));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Space' });
			document.dispatchEvent(keydownEvent);
		});

		act(() => {
			const keyupEvent = new KeyboardEvent('keyup', { key: 'Space' });
			document.dispatchEvent(keyupEvent);
		});

		// 인터벌이 정리되었는지 확인
		expect(clearIntervalSpy).toHaveBeenCalled();
	});

	it('should handle empty string key', () => {
		const { result } = renderHook(() => useKeyPress(''));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: '' });
			document.dispatchEvent(keydownEvent);
		});

		// 빈 문자열 키는 정상적으로 처리됨 (브라우저 동작에 따라)
		expect(result.current.isPressed).toBe(true);
	});

	it('should handle whitespace keys', () => {
		const { result } = renderHook(() => useKeyPress(' '));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: ' ' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);
		expect(result.current.keyCode).toBe(' ');
	});

	it('should handle Space key specifically', () => {
		const { result } = renderHook(() => useKeyPress('Space', { keyup: true }));

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Space' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);
		expect(result.current.keyCode).toBe('Space');

		act(() => {
			const keyupEvent = new KeyboardEvent('keyup', { key: 'Space' });
			document.dispatchEvent(keyupEvent);
		});

		expect(result.current.isPressed).toBe(false);
		expect(result.current.keyCode).toBe(null);
	});

	it('should handle unicode keys', () => {
		const unicodeKeys = ['é', 'ñ', 'ü', 'ß', 'α', 'β', 'γ'];

		unicodeKeys.forEach((key) => {
			const { result } = renderHook(() => useKeyPress(key));

			act(() => {
				const keydownEvent = new KeyboardEvent('keydown', { key });
				document.dispatchEvent(keydownEvent);
			});

			expect(result.current.isPressed).toBe(true);
			expect(result.current.keyCode).toBe(key);
		});
	});

	it('should handle key combinations with modifier keys only', () => {
		const { result } = renderHook(() => useKeyPress(['Control', 'Shift'], { keyup: true }));

		act(() => {
			const ctrlDown = new KeyboardEvent('keydown', { key: 'Control' });
			document.dispatchEvent(ctrlDown);
		});

		act(() => {
			const shiftDown = new KeyboardEvent('keydown', { key: 'Shift' });
			document.dispatchEvent(shiftDown);
		});

		expect(result.current.isPressed).toBe(true);

		act(() => {
			const shiftUp = new KeyboardEvent('keyup', { key: 'Shift' });
			document.dispatchEvent(shiftUp);
		});

		expect(result.current.isPressed).toBe(false);
	});

	it('should handle rapid key combination changes', () => {
		const { result, rerender } = renderHook(({ keys }) => useKeyPress(keys, { keyup: true }), {
			initialProps: { keys: ['Control', 's'] },
		});

		act(() => {
			const ctrlDown = new KeyboardEvent('keydown', { key: 'Control' });
			document.dispatchEvent(ctrlDown);
		});

		act(() => {
			const sDown = new KeyboardEvent('keydown', { key: 's' });
			document.dispatchEvent(sDown);
		});

		expect(result.current.isPressed).toBe(true);

		// 키 조합을 빠르게 변경
		rerender({ keys: ['Control', 'z'] });

		// 키가 변경되면 상태가 초기화됨 (정상적인 동작)
		expect(result.current.isPressed).toBe(false);

		act(() => {
			const ctrlDown = new KeyboardEvent('keydown', { key: 'Control' });
			document.dispatchEvent(ctrlDown);
		});

		act(() => {
			const zDown = new KeyboardEvent('keydown', { key: 'z' });
			document.dispatchEvent(zDown);
		});

		expect(result.current.isPressed).toBe(true);
	});

	it('should handle target element changes', () => {
		const div1 = document.createElement('div');
		const div2 = document.createElement('div');

		const { result, rerender } = renderHook(({ target }) => useKeyPress('Enter', { target }), {
			initialProps: { target: div1 },
		});

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			div1.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);

		// 타겟 요소 변경
		rerender({ target: div2 });

		// 타겟이 변경되어도 현재 상태는 유지됨 (정상적인 동작)
		expect(result.current.isPressed).toBe(true);

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			div2.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);
	});

	it('should handle disabled state properly', () => {
		const { result, rerender } = renderHook(({ enabled }) => useKeyPress('Enter', { enabled }), {
			initialProps: { enabled: true },
		});

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			document.dispatchEvent(keydownEvent);
		});

		expect(result.current.isPressed).toBe(true);

		// 비활성화
		rerender({ enabled: false });

		act(() => {
			const keyupEvent = new KeyboardEvent('keyup', { key: 'Enter' });
			document.dispatchEvent(keyupEvent);
		});

		// 비활성화 상태에서는 이벤트를 무시하지만 상태는 유지
		expect(result.current.isPressed).toBe(true);
	});

	it('should handle preventDefault with all event types', () => {
		const preventDefaultSpy = vi.fn();
		renderHook(() =>
			useKeyPress('Enter', { preventDefault: true, keydown: true, keyup: true, keypress: true }),
		);

		act(() => {
			const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
			keydownEvent.preventDefault = preventDefaultSpy;
			document.dispatchEvent(keydownEvent);
		});

		expect(preventDefaultSpy).toHaveBeenCalled();

		act(() => {
			const keyupEvent = new KeyboardEvent('keyup', { key: 'Enter' });
			keyupEvent.preventDefault = preventDefaultSpy;
			document.dispatchEvent(keyupEvent);
		});

		expect(preventDefaultSpy).toHaveBeenCalledTimes(2);

		act(() => {
			const keypressEvent = new KeyboardEvent('keypress', { key: 'Enter' });
			keypressEvent.preventDefault = preventDefaultSpy;
			document.dispatchEvent(keypressEvent);
		});

		expect(preventDefaultSpy).toHaveBeenCalledTimes(3);
	});

	// 스토리 예시 테스트들
	describe('Story Examples', () => {
		it('should handle Default story Space key example', () => {
			const { result } = renderHook(() =>
				useKeyPress('Space', {
					keydown: true,
					keyup: true,
					preventDefault: true,
				}),
			);

			// Space 키 누름
			act(() => {
				const keydownEvent = new KeyboardEvent('keydown', { key: 'Space' });
				document.dispatchEvent(keydownEvent);
			});

			expect(result.current.isPressed).toBe(true);
			expect(result.current.keyCode).toBe('Space');

			// Space 키 뗌
			act(() => {
				const keyupEvent = new KeyboardEvent('keyup', { key: 'Space' });
				document.dispatchEvent(keyupEvent);
			});

			expect(result.current.isPressed).toBe(false);
			expect(result.current.keyCode).toBe(null);
		});

		it('should handle WithKeyCombination story Ctrl+S example', () => {
			const { result } = renderHook(() =>
				useKeyPress(['Control', 's'], {
					keydown: true,
					keyup: true,
					preventDefault: true,
				}),
			);

			// Control 키 누름
			act(() => {
				const ctrlDown = new KeyboardEvent('keydown', { key: 'Control' });
				document.dispatchEvent(ctrlDown);
			});

			expect(result.current.isPressed).toBe(false); // 아직 s 키가 눌리지 않음

			// S 키 누름
			act(() => {
				const sDown = new KeyboardEvent('keydown', { key: 's' });
				document.dispatchEvent(sDown);
			});

			expect(result.current.isPressed).toBe(true);
			expect(result.current.keyCode).toBe('s');

			// S 키 뗌
			act(() => {
				const sUp = new KeyboardEvent('keyup', { key: 's' });
				document.dispatchEvent(sUp);
			});

			expect(result.current.isPressed).toBe(false);

			// Control 키 뗌
			act(() => {
				const ctrlUp = new KeyboardEvent('keyup', { key: 'Control' });
				document.dispatchEvent(ctrlUp);
			});

			expect(result.current.isPressed).toBe(false);
		});

		it('should handle WithHoldDuration story ArrowUp example', () => {
			const { result } = renderHook(() =>
				useKeyPress('ArrowUp', {
					keydown: true,
					keyup: true,
					preventDefault: true,
				}),
			);

			// ArrowUp 키 누름
			act(() => {
				const keydownEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
				document.dispatchEvent(keydownEvent);
			});

			expect(result.current.isPressed).toBe(true);
			expect(result.current.holdDuration).toBe(0);

			// 홀드 시간이 계산되는지 확인 (인터벌이 시작되었는지)
			expect(result.current.holdDuration).toBe(0);

			// ArrowUp 키 뗌
			act(() => {
				const keyupEvent = new KeyboardEvent('keyup', { key: 'ArrowUp' });
				document.dispatchEvent(keyupEvent);
			});

			expect(result.current.isPressed).toBe(false);
			expect(result.current.holdDuration).toBe(null);
		});

		it('should handle WithMultipleEventTypes story example', () => {
			// keydown 이벤트 테스트
			const { result: keydownResult } = renderHook(() =>
				useKeyPress('a', {
					keydown: true,
					keyup: true,
					keypress: false,
				}),
			);

			act(() => {
				const keydownEvent = new KeyboardEvent('keydown', { key: 'a' });
				document.dispatchEvent(keydownEvent);
			});

			expect(keydownResult.current.isPressed).toBe(true);

			act(() => {
				const keyupEvent = new KeyboardEvent('keyup', { key: 'a' });
				document.dispatchEvent(keyupEvent);
			});

			expect(keydownResult.current.isPressed).toBe(false);

			// keypress 이벤트 테스트
			const { result: keypressResult } = renderHook(() =>
				useKeyPress('d', {
					keydown: true,
					keyup: true,
					keypress: true,
				}),
			);

			act(() => {
				const keypressEvent = new KeyboardEvent('keypress', { key: 'd' });
				document.dispatchEvent(keypressEvent);
			});

			expect(keypressResult.current.isPressed).toBe(true);

			// 자동 해제 확인
			act(() => {
				vi.advanceTimersByTime(100);
			});

			expect(keypressResult.current.isPressed).toBe(false);
		});

		it('should handle WithPreventDefault story Enter example', () => {
			const preventDefaultSpy = vi.fn();
			const { result } = renderHook(() =>
				useKeyPress('Enter', {
					keydown: true,
					keyup: true,
					preventDefault: true,
				}),
			);

			act(() => {
				const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
				keydownEvent.preventDefault = preventDefaultSpy;
				document.dispatchEvent(keydownEvent);
			});

			expect(result.current.isPressed).toBe(true);
			expect(preventDefaultSpy).toHaveBeenCalled();

			act(() => {
				const keyupEvent = new KeyboardEvent('keyup', { key: 'Enter' });
				keyupEvent.preventDefault = preventDefaultSpy;
				document.dispatchEvent(keyupEvent);
			});

			expect(result.current.isPressed).toBe(false);
			expect(preventDefaultSpy).toHaveBeenCalledTimes(2);
		});

		it('should handle SimpleKeyDemo component examples', () => {
			// Space 키 테스트
			const { result: spaceResult } = renderHook(() =>
				useKeyPress('Space', {
					keydown: true,
					keyup: true,
					preventDefault: true,
				}),
			);

			act(() => {
				const keydownEvent = new KeyboardEvent('keydown', { key: 'Space' });
				document.dispatchEvent(keydownEvent);
			});

			expect(spaceResult.current.isPressed).toBe(true);
			expect(spaceResult.current.keyCode).toBe('Space');

			// Enter 키 테스트
			const { result: enterResult } = renderHook(() =>
				useKeyPress('Enter', {
					keydown: true,
					keyup: true,
					preventDefault: true,
				}),
			);

			act(() => {
				const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' });
				document.dispatchEvent(keydownEvent);
			});

			expect(enterResult.current.isPressed).toBe(true);
			expect(enterResult.current.keyCode).toBe('Enter');

			// Escape 키 테스트
			const { result: escapeResult } = renderHook(() =>
				useKeyPress('Escape', {
					keydown: true,
					keyup: true,
					preventDefault: true,
				}),
			);

			act(() => {
				const keydownEvent = new KeyboardEvent('keydown', { key: 'Escape' });
				document.dispatchEvent(keydownEvent);
			});

			expect(escapeResult.current.isPressed).toBe(true);
			expect(escapeResult.current.keyCode).toBe('Escape');
		});

		it('should handle keyMappings option', () => {
			// 한국어 키보드 매핑 테스트 (ㅁ → a)
			const { result } = renderHook(() =>
				useKeyPress('a', {
					keydown: true,
					keyup: true,
					preventDefault: true,
					keyMappings: { ㅁ: 'a' },
				}),
			);

			// ㅁ 키를 눌렀을 때 a로 인식되는지 테스트
			act(() => {
				const keydownEvent = new KeyboardEvent('keydown', { key: 'ㅁ' });
				document.dispatchEvent(keydownEvent);
			});

			expect(result.current.isPressed).toBe(true);
			expect(result.current.keyCode).toBe('ㅁ');

			act(() => {
				const keyupEvent = new KeyboardEvent('keyup', { key: 'ㅁ' });
				document.dispatchEvent(keyupEvent);
			});

			expect(result.current.isPressed).toBe(false);
		});

		it('should handle multiple keyMappings', () => {
			// 여러 키 매핑 테스트
			const { result } = renderHook(() =>
				useKeyPress('a', {
					keydown: true,
					keyup: true,
					preventDefault: true,
					keyMappings: { ㅁ: 'a', ㅠ: 'b', ㅊ: 'c' },
				}),
			);

			// ㅁ 키 테스트
			act(() => {
				const keydownEvent = new KeyboardEvent('keydown', { key: 'ㅁ' });
				document.dispatchEvent(keydownEvent);
			});

			expect(result.current.isPressed).toBe(true);

			act(() => {
				const keyupEvent = new KeyboardEvent('keyup', { key: 'ㅁ' });
				document.dispatchEvent(keyupEvent);
			});

			expect(result.current.isPressed).toBe(false);

			// ㅠ 키 테스트 (b로 매핑되어 있지만 a를 찾고 있으므로 감지되지 않아야 함)
			act(() => {
				const keydownEvent = new KeyboardEvent('keydown', { key: 'ㅠ' });
				document.dispatchEvent(keydownEvent);
			});

			expect(result.current.isPressed).toBe(false);
		});

		it('should handle case insensitive keyMappings', () => {
			// 대소문자 구분 없는 키 매핑 테스트
			const { result } = renderHook(() =>
				useKeyPress('a', {
					keydown: true,
					keyup: true,
					preventDefault: true,
					keyMappings: { ㅁ: 'a' },
				}),
			);

			act(() => {
				const keydownEvent = new KeyboardEvent('keydown', { key: 'ㅁ' });
				document.dispatchEvent(keydownEvent);
			});

			expect(result.current.isPressed).toBe(true);
		});

		it('should handle keyMappings with key combinations', () => {
			// 키 조합에서 키 매핑 테스트
			const { result } = renderHook(() =>
				useKeyPress(['Control', 'a'], {
					keydown: true,
					keyup: true,
					preventDefault: true,
					keyMappings: { ㅁ: 'a' },
				}),
			);

			// Control 키 누름
			act(() => {
				const ctrlDown = new KeyboardEvent('keydown', { key: 'Control' });
				document.dispatchEvent(ctrlDown);
			});

			expect(result.current.isPressed).toBe(false);

			// ㅁ 키 누름 (a로 매핑되어 조합 완성)
			act(() => {
				const aDown = new KeyboardEvent('keydown', { key: 'ㅁ' });
				document.dispatchEvent(aDown);
			});

			expect(result.current.isPressed).toBe(true);
			expect(result.current.keyCode).toBe('ㅁ');
		});
	});
});

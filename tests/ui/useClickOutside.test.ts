import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useClickOutside, useClickOutsideMultiple } from '../../src/ui/useClickOutside';

describe('useClickOutside', () => {
	let mockCallback: ReturnType<typeof vi.fn>;
	let addEventListenerSpy: ReturnType<typeof vi.fn>;
	let removeEventListenerSpy: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockCallback = vi.fn();
		addEventListenerSpy = vi.fn();
		removeEventListenerSpy = vi.fn();

		Object.defineProperty(document, 'addEventListener', {
			value: addEventListenerSpy,
			writable: true,
		});
		Object.defineProperty(document, 'removeEventListener', {
			value: removeEventListenerSpy,
			writable: true,
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('ref 객체를 반환한다', () => {
		const { result } = renderHook(() => useClickOutside(mockCallback));

		expect(result.current).toBeDefined();
		expect(result.current.current).toBeNull();
	});

	it('마운트 시 이벤트 리스너를 등록하고 언마운트 시 해제한다', () => {
		const { unmount } = renderHook(() => useClickOutside(mockCallback));

		expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

		unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
	});

	it('외부 클릭 시 콜백을 호출한다', () => {
		const { result } = renderHook(() => useClickOutside(mockCallback));

		const div = document.createElement('div');
		Object.defineProperty(result.current, 'current', { value: div, writable: true });

		const outsideElement = document.createElement('span');
		const event = new MouseEvent('mousedown', { bubbles: true });
		Object.defineProperty(event, 'target', { value: outsideElement });

		const handler = addEventListenerSpy.mock.calls[0][1];

		act(() => {
			handler(event);
		});

		expect(mockCallback).toHaveBeenCalledTimes(1);
	});

	it('내부 클릭 시 콜백을 호출하지 않는다', () => {
		const { result } = renderHook(() => useClickOutside(mockCallback));

		const div = document.createElement('div');
		const innerElement = document.createElement('span');
		div.appendChild(innerElement);
		Object.defineProperty(result.current, 'current', { value: div, writable: true });

		const event = new MouseEvent('mousedown', { bubbles: true });
		Object.defineProperty(event, 'target', { value: innerElement });

		const handler = addEventListenerSpy.mock.calls[0][1];

		act(() => {
			handler(event);
		});

		expect(mockCallback).not.toHaveBeenCalled();
	});

	it('ref.current가 null일 때 콜백을 호출하지 않는다', () => {
		const { result } = renderHook(() => useClickOutside(mockCallback));

		Object.defineProperty(result.current, 'current', { value: null, writable: true });

		const outsideElement = document.createElement('span');
		const event = new MouseEvent('mousedown', { bubbles: true });
		Object.defineProperty(event, 'target', { value: outsideElement });

		const handler = addEventListenerSpy.mock.calls[0][1];

		act(() => {
			handler(event);
		});

		expect(mockCallback).not.toHaveBeenCalled();
	});

	it('event.target이 null일 때 콜백을 호출한다 (contains(null)은 false를 반환)', () => {
		const { result } = renderHook(() => useClickOutside(mockCallback));

		const div = document.createElement('div');
		Object.defineProperty(result.current, 'current', { value: div, writable: true });

		const event = new MouseEvent('mousedown', { bubbles: true });
		Object.defineProperty(event, 'target', { value: null });

		const handler = addEventListenerSpy.mock.calls[0][1];

		act(() => {
			handler(event);
		});

		expect(mockCallback).toHaveBeenCalledTimes(1);
	});

	it('enabled가 false일 때 이벤트 리스너를 등록하지 않는다', () => {
		renderHook(() => useClickOutside(mockCallback, { enabled: false }));

		expect(addEventListenerSpy).not.toHaveBeenCalled();
	});

	it('enabled가 false에서 true로 변경될 때 이벤트 리스너를 등록한다', () => {
		const { rerender } = renderHook(({ enabled }) => useClickOutside(mockCallback, { enabled }), {
			initialProps: { enabled: false },
		});

		expect(addEventListenerSpy).not.toHaveBeenCalled();

		rerender({ enabled: true });

		expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
	});

	it('eventType 옵션을 변경할 때 이벤트 리스너를 재설정한다', () => {
		type EventType = 'mousedown' | 'click' | 'touchstart';
		const { rerender } = renderHook(
			({ eventType }: { eventType: EventType }) => useClickOutside(mockCallback, { eventType }),
			{ initialProps: { eventType: 'mousedown' as EventType } },
		);

		expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

		rerender({ eventType: 'click' as EventType });

		expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
		expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
	});

	it('callback이 변경될 때 이벤트 리스너를 재설정한다', () => {
		const newCallback = vi.fn();
		const { rerender } = renderHook(({ callback }) => useClickOutside(callback), {
			initialProps: { callback: mockCallback },
		});

		rerender({ callback: newCallback });

		expect(removeEventListenerSpy).toHaveBeenCalled();
		expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
	});
});

describe('useClickOutsideMultiple', () => {
	let mockCallback: ReturnType<typeof vi.fn>;
	let addEventListenerSpy: ReturnType<typeof vi.fn>;
	let removeEventListenerSpy: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockCallback = vi.fn();
		addEventListenerSpy = vi.fn();
		removeEventListenerSpy = vi.fn();

		Object.defineProperty(document, 'addEventListener', {
			value: addEventListenerSpy,
			writable: true,
		});
		Object.defineProperty(document, 'removeEventListener', {
			value: removeEventListenerSpy,
			writable: true,
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('마운트 시 이벤트 리스너를 등록하고 언마운트 시 해제한다', () => {
		const refs = [{ current: null }];
		const { unmount } = renderHook(() => useClickOutsideMultiple(mockCallback, refs));

		expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));

		unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
	});

	it('모든 ref 외부 클릭 시 콜백을 호출한다', () => {
		const div1 = document.createElement('div');
		const div2 = document.createElement('div');
		const refs = [{ current: div1 }, { current: div2 }];

		renderHook(() => useClickOutsideMultiple(mockCallback, refs));

		const outsideElement = document.createElement('span');
		const event = new MouseEvent('mousedown', { bubbles: true });
		Object.defineProperty(event, 'target', { value: outsideElement });

		const handler = addEventListenerSpy.mock.calls[0][1];

		act(() => {
			handler(event);
		});

		expect(mockCallback).toHaveBeenCalledTimes(1);
	});

	it('하나라도 내부 클릭 시 콜백을 호출하지 않는다', () => {
		const div1 = document.createElement('div');
		const div2 = document.createElement('div');
		const refs = [{ current: div1 }, { current: div2 }];

		renderHook(() => useClickOutsideMultiple(mockCallback, refs));

		const innerElement = document.createElement('span');
		div1.appendChild(innerElement);

		const event = new MouseEvent('mousedown', { bubbles: true });
		Object.defineProperty(event, 'target', { value: innerElement });

		const handler = addEventListenerSpy.mock.calls[0][1];

		act(() => {
			handler(event);
		});

		expect(mockCallback).not.toHaveBeenCalled();
	});

	it('모든 ref가 null일 때 외부 클릭 시 콜백을 호출한다', () => {
		const refs = [{ current: null }, { current: null }];

		renderHook(() => useClickOutsideMultiple(mockCallback, refs));

		const outsideElement = document.createElement('span');
		const event = new MouseEvent('mousedown', { bubbles: true });
		Object.defineProperty(event, 'target', { value: outsideElement });

		const handler = addEventListenerSpy.mock.calls[0][1];

		act(() => {
			handler(event);
		});

		expect(mockCallback).toHaveBeenCalledTimes(1);
	});

	it('일부 ref가 null이고 나머지 외부 클릭 시 콜백을 호출한다', () => {
		const div = document.createElement('div');
		const refs = [{ current: null }, { current: div }];

		renderHook(() => useClickOutsideMultiple(mockCallback, refs));

		const outsideElement = document.createElement('span');
		const event = new MouseEvent('mousedown', { bubbles: true });
		Object.defineProperty(event, 'target', { value: outsideElement });

		const handler = addEventListenerSpy.mock.calls[0][1];

		act(() => {
			handler(event);
		});

		expect(mockCallback).toHaveBeenCalledTimes(1);
	});

	it('enabled가 false일 때 이벤트 리스너를 등록하지 않는다', () => {
		const refs = [{ current: null }];

		renderHook(() => useClickOutsideMultiple(mockCallback, refs, { enabled: false }));

		expect(addEventListenerSpy).not.toHaveBeenCalled();
	});

	it('refs 배열이 변경될 때 이벤트 리스너를 재설정한다', () => {
		const refs1 = [{ current: document.createElement('div') }];
		const refs2 = [{ current: document.createElement('div') }];

		const { rerender } = renderHook(({ refs }) => useClickOutsideMultiple(mockCallback, refs), {
			initialProps: { refs: refs1 },
		});

		expect(addEventListenerSpy).toHaveBeenCalledTimes(1);

		rerender({ refs: refs2 });

		expect(removeEventListenerSpy).toHaveBeenCalled();
		expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
	});
});

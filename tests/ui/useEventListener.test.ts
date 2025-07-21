import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
	useEventListener,
	useKeyDown,
	useClick,
	useResize,
	useScroll,
} from '../../src/ui/useEventListener';

describe('useEventListener', () => {
	let mockHandler: ReturnType<typeof vi.fn>;
	let addEventListenerSpy: ReturnType<typeof vi.fn>;
	let removeEventListenerSpy: ReturnType<typeof vi.fn>;
	let mockElement: HTMLElement;

	beforeEach(() => {
		mockHandler = vi.fn();
		addEventListenerSpy = vi.fn();
		removeEventListenerSpy = vi.fn();
		mockElement = document.createElement('div');

		Object.defineProperty(mockElement, 'addEventListener', {
			value: addEventListenerSpy,
			writable: true,
		});
		Object.defineProperty(mockElement, 'removeEventListener', {
			value: removeEventListenerSpy,
			writable: true,
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('이벤트 리스너를 등록하고 언마운트 시 해제한다', () => {
		const { unmount } = renderHook(() => useEventListener('click', mockHandler, mockElement));

		expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function), undefined);

		unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function), undefined);
	});

	it('handler가 변경될 때 최신 핸들러가 호출된다', () => {
		const { rerender } = renderHook(
			({ handler }) => useEventListener('click', handler, mockElement),
			{ initialProps: { handler: mockHandler } },
		);

		const newHandler = vi.fn();
		rerender({ handler: newHandler });

		const event = new Event('click');
		const registeredHandler = addEventListenerSpy.mock.calls[0][1];

		act(() => {
			registeredHandler(event);
		});

		expect(newHandler).toHaveBeenCalledWith(event);
		expect(mockHandler).not.toHaveBeenCalled();
	});

	it('element가 null일 때 이벤트 리스너를 등록하지 않는다', () => {
		renderHook(() => useEventListener('click', mockHandler, null));

		expect(addEventListenerSpy).not.toHaveBeenCalled();
	});

	it('element가 undefined일 때 window에 이벤트 리스너를 등록한다', () => {
		const windowAddEventListenerSpy = vi.fn();
		const windowRemoveEventListenerSpy = vi.fn();

		Object.defineProperty(window, 'addEventListener', {
			value: windowAddEventListenerSpy,
			writable: true,
		});
		Object.defineProperty(window, 'removeEventListener', {
			value: windowRemoveEventListenerSpy,
			writable: true,
		});

		const { unmount } = renderHook(() => useEventListener('click', mockHandler, undefined));

		expect(windowAddEventListenerSpy).toHaveBeenCalledWith(
			'click',
			expect.any(Function),
			undefined,
		);

		unmount();

		expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith(
			'click',
			expect.any(Function),
			undefined,
		);
	});

	it('options가 전달될 때 addEventListener에 옵션을 전달한다', () => {
		const options = { capture: true, once: true };
		renderHook(() => useEventListener('click', mockHandler, mockElement, options));

		expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function), options);
	});

	it('element에 addEventListener가 없을 때 에러가 발생하지 않는다', () => {
		const elementWithoutAddEventListener = document.createElement('div');
		delete (elementWithoutAddEventListener as any).addEventListener;

		expect(() => {
			renderHook(() => useEventListener('click', mockHandler, elementWithoutAddEventListener));
		}).not.toThrow();
	});

	it('이벤트 발생 시 핸들러가 호출된다', () => {
		renderHook(() => useEventListener('click', mockHandler, mockElement));

		const event = new Event('click');
		const registeredHandler = addEventListenerSpy.mock.calls[0][1];

		act(() => {
			registeredHandler(event);
		});

		expect(mockHandler).toHaveBeenCalledWith(event);
	});
});

describe('useKeyDown', () => {
	let mockHandler: ReturnType<typeof vi.fn>;
	let addEventListenerSpy: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockHandler = vi.fn();
		addEventListenerSpy = vi.fn();

		Object.defineProperty(window, 'addEventListener', {
			value: addEventListenerSpy,
			writable: true,
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('keydown 이벤트를 등록하고 KeyboardEvent를 전달한다', () => {
		renderHook(() => useKeyDown(mockHandler));

		expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), undefined);

		const event = new KeyboardEvent('keydown', { key: 'Enter' });
		const registeredHandler = addEventListenerSpy.mock.calls[0][1];

		act(() => {
			registeredHandler(event);
		});

		expect(mockHandler).toHaveBeenCalledWith(event);
	});
});

describe('useClick', () => {
	let mockHandler: ReturnType<typeof vi.fn>;
	let addEventListenerSpy: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockHandler = vi.fn();
		addEventListenerSpy = vi.fn();

		Object.defineProperty(window, 'addEventListener', {
			value: addEventListenerSpy,
			writable: true,
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('click 이벤트를 등록하고 MouseEvent를 전달한다', () => {
		renderHook(() => useClick(mockHandler));

		expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function), undefined);

		const event = new MouseEvent('click', { button: 0 });
		const registeredHandler = addEventListenerSpy.mock.calls[0][1];

		act(() => {
			registeredHandler(event);
		});

		expect(mockHandler).toHaveBeenCalledWith(event);
	});
});

describe('useResize', () => {
	let mockHandler: ReturnType<typeof vi.fn>;
	let addEventListenerSpy: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockHandler = vi.fn();
		addEventListenerSpy = vi.fn();

		Object.defineProperty(window, 'addEventListener', {
			value: addEventListenerSpy,
			writable: true,
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('resize 이벤트를 등록하고 UIEvent를 전달한다', () => {
		renderHook(() => useResize(mockHandler));

		expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function), undefined);

		const event = new UIEvent('resize');
		const registeredHandler = addEventListenerSpy.mock.calls[0][1];

		act(() => {
			registeredHandler(event);
		});

		expect(mockHandler).toHaveBeenCalledWith(event);
	});
});

describe('useScroll', () => {
	let mockHandler: ReturnType<typeof vi.fn>;
	let addEventListenerSpy: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockHandler = vi.fn();
		addEventListenerSpy = vi.fn();

		Object.defineProperty(window, 'addEventListener', {
			value: addEventListenerSpy,
			writable: true,
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('scroll 이벤트를 등록하고 Event를 전달한다', () => {
		renderHook(() => useScroll(mockHandler));

		expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), undefined);

		const event = new Event('scroll');
		const registeredHandler = addEventListenerSpy.mock.calls[0][1];

		act(() => {
			registeredHandler(event);
		});

		expect(mockHandler).toHaveBeenCalledWith(event);
	});
});

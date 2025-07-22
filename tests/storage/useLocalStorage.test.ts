import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useLocalStorage } from '../../src/storage/useLocalStorage';

// localStorage 모킹
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
	length: 0,
	key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
});

describe('useLocalStorage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorageMock.getItem.mockReturnValue(null);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('초기값을 올바르게 설정한다', () => {
		const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

		expect(result.current[0]).toBe('initial-value');
		expect(typeof result.current[1]).toBe('function');
		expect(typeof result.current[2]).toBe('function');
	});

	it('localStorage에 저장된 값이 있으면 그것을 사용한다', () => {
		localStorageMock.getItem.mockReturnValue('"stored-value"');
		const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

		expect(result.current[0]).toBe('stored-value');
	});

	it('값을 설정하면 localStorage에 저장된다', () => {
		const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

		act(() => {
			result.current[1]('new-value');
		});

		expect(result.current[0]).toBe('new-value');
		expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '"new-value"');
	});

	it('함수형 업데이트가 정상적으로 작동한다', () => {
		const { result } = renderHook(() => useLocalStorage('test-key', 0));

		act(() => {
			result.current[1]((prev) => prev + 1);
		});

		expect(result.current[0]).toBe(1);
		expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', '1');
	});

	it('removeValue가 정상적으로 작동한다', () => {
		const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

		act(() => {
			result.current[2]();
		});

		expect(result.current[0]).toBe('initial-value');
		expect(localStorageMock.removeItem).toHaveBeenCalledWith('test-key');
	});

	it('복잡한 객체도 정상적으로 처리한다', () => {
		const initialValue = { name: 'test', count: 0 };
		const { result } = renderHook(() => useLocalStorage('test-key', initialValue));

		act(() => {
			result.current[1]({ name: 'updated', count: 1 });
		});

		expect(result.current[0]).toEqual({ name: 'updated', count: 1 });
		expect(localStorageMock.setItem).toHaveBeenCalledWith(
			'test-key',
			'{"name":"updated","count":1}',
		);
	});

	it('localStorage 읽기 오류 시 초기값을 반환한다', () => {
		localStorageMock.getItem.mockImplementation(() => {
			throw new Error('localStorage error');
		});

		const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

		expect(result.current[0]).toBe('initial-value');
	});

	it('localStorage 쓰기 오류 시 콘솔에 경고가 출력된다', () => {
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		localStorageMock.setItem.mockImplementation(() => {
			throw new Error('localStorage error');
		});

		const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

		act(() => {
			result.current[1]('new-value');
		});

		expect(consoleSpy).toHaveBeenCalledWith(
			'Error setting localStorage key "test-key":',
			expect.any(Error),
		);
		consoleSpy.mockRestore();
	});

	it('removeValue 오류 시 콘솔에 경고가 출력된다', () => {
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		localStorageMock.removeItem.mockImplementation(() => {
			throw new Error('localStorage error');
		});

		const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

		act(() => {
			result.current[2]();
		});

		expect(consoleSpy).toHaveBeenCalledWith(
			'Error removing localStorage key "test-key":',
			expect.any(Error),
		);
		consoleSpy.mockRestore();
	});

	it('커스텀 serializer/deserializer가 정상적으로 작동한다', () => {
		const customSerializer = vi.fn((value) => `custom-${value}`);
		const customDeserializer = vi.fn((value) => value.replace('custom-', ''));

		const { result } = renderHook(() =>
			useLocalStorage('test-key', 'initial-value', {
				serializer: customSerializer,
				deserializer: customDeserializer,
			}),
		);

		act(() => {
			result.current[1]('new-value');
		});

		expect(customSerializer).toHaveBeenCalledWith('new-value');
		expect(localStorageMock.setItem).toHaveBeenCalledWith('test-key', 'custom-new-value');
	});

	it('다른 탭에서 localStorage 변경 시 동기화된다', () => {
		const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

		// storage 이벤트 시뮬레이션
		const storageEvent = new StorageEvent('storage', {
			key: 'test-key',
			newValue: '"updated-from-other-tab"',
			oldValue: null,
		});

		act(() => {
			window.dispatchEvent(storageEvent);
		});

		expect(result.current[0]).toBe('updated-from-other-tab');
	});

	it('다른 키의 storage 이벤트는 무시된다', () => {
		const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

		const storageEvent = new StorageEvent('storage', {
			key: 'other-key',
			newValue: '"updated-from-other-tab"',
			oldValue: null,
		});

		act(() => {
			window.dispatchEvent(storageEvent);
		});

		expect(result.current[0]).toBe('initial-value');
	});

	it('storage 이벤트에서 null 값은 무시된다', () => {
		const { result } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

		const storageEvent = new StorageEvent('storage', {
			key: 'test-key',
			newValue: null,
			oldValue: '"old-value"',
		});

		act(() => {
			window.dispatchEvent(storageEvent);
		});

		expect(result.current[0]).toBe('initial-value');
	});

	it('storage 이벤트 파싱 오류 시 콘솔에 경고가 출력된다', () => {
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		renderHook(() => useLocalStorage('test-key', 'initial-value'));

		const storageEvent = new StorageEvent('storage', {
			key: 'test-key',
			newValue: '{"name": "test", "invalid": }',
			oldValue: null,
		});

		act(() => {
			window.dispatchEvent(storageEvent);
		});

		expect(consoleSpy).toHaveBeenCalledWith(
			'Error parsing localStorage key "test-key":',
			expect.any(Error),
		);
		consoleSpy.mockRestore();
	});

	it('컴포넌트 언마운트 시 이벤트 리스너가 정리된다', () => {
		const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
		const { unmount } = renderHook(() => useLocalStorage('test-key', 'initial-value'));

		unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
		removeEventListenerSpy.mockRestore();
	});
});

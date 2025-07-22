import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useCopyToClipboard } from '../../src/utility/useCopyToClipboard';

// navigator.clipboard 모킹
const mockClipboard = {
	writeText: vi.fn(),
};

Object.defineProperty(navigator, 'clipboard', {
	value: mockClipboard,
	writable: true,
});

describe('useCopyToClipboard', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockClipboard.writeText.mockResolvedValue(undefined);
	});

	afterEach(() => {
		vi.clearAllTimers();
	});

	it('기본 옵션으로 훅을 초기화해야 함', () => {
		const { result } = renderHook(() => useCopyToClipboard());

		expect(result.current.isCopied).toBe(false);
		expect(result.current.isCopying).toBe(false);
		expect(result.current.message).toBe('');
		expect(typeof result.current.copyToClipboard).toBe('function');
		expect(typeof result.current.reset).toBe('function');
	});

	it('커스텀 옵션으로 훅을 초기화해야 함', () => {
		const options = {
			timeout: 3000,
			successMessage: '커스텀 성공 메시지',
			errorMessage: '커스텀 에러 메시지',
		};

		const { result } = renderHook(() => useCopyToClipboard(options));

		expect(result.current.isCopied).toBe(false);
		expect(result.current.isCopying).toBe(false);
		expect(result.current.message).toBe('');
	});

	it('텍스트를 성공적으로 복사해야 함', async () => {
		const { result } = renderHook(() => useCopyToClipboard());

		await act(async () => {
			const success = await result.current.copyToClipboard('테스트 텍스트');
			expect(success).toBe(true);
		});

		expect(mockClipboard.writeText).toHaveBeenCalledWith('테스트 텍스트');
		expect(result.current.isCopied).toBe(true);
		expect(result.current.message).toBe('복사되었습니다');
	});

	it('복사 실패 시 에러 상태를 반환해야 함', async () => {
		mockClipboard.writeText.mockRejectedValue(new Error('복사 실패'));
		const { result } = renderHook(() => useCopyToClipboard());

		await act(async () => {
			const success = await result.current.copyToClipboard('테스트 텍스트');
			expect(success).toBe(false);
		});

		expect(result.current.isCopied).toBe(false);
		expect(result.current.message).toBe('복사에 실패했습니다');
	});

	it('빈 문자열 복사 시 실패해야 함', async () => {
		const { result } = renderHook(() => useCopyToClipboard());

		await act(async () => {
			const success = await result.current.copyToClipboard('');
			expect(success).toBe(false);
		});

		expect(result.current.isCopied).toBe(false);
		expect(result.current.message).toBe('복사에 실패했습니다');
	});

	it('null 값 복사 시 실패해야 함', async () => {
		const { result } = renderHook(() => useCopyToClipboard());

		await act(async () => {
			const success = await result.current.copyToClipboard(null as any);
			expect(success).toBe(false);
		});

		expect(result.current.isCopied).toBe(false);
		expect(result.current.message).toBe('복사에 실패했습니다');
	});

	it('복사 중에는 isCopying이 true여야 함', async () => {
		// 복사 지연을 위한 Promise
		let resolveCopy: (value: any) => void;
		const copyPromise = new Promise((resolve) => {
			resolveCopy = resolve;
		});
		mockClipboard.writeText.mockReturnValue(copyPromise);

		const { result } = renderHook(() => useCopyToClipboard());

		act(() => {
			result.current.copyToClipboard('테스트 텍스트');
		});

		expect(result.current.isCopying).toBe(true);

		// 복사 완료
		act(() => {
			resolveCopy!(undefined);
		});

		await act(async () => {
			await copyPromise;
		});

		expect(result.current.isCopying).toBe(false);
	});

	it('timeout 후에 성공 상태가 초기화되어야 함', async () => {
		vi.useFakeTimers();
		const { result } = renderHook(() => useCopyToClipboard({ timeout: 1000 }));

		await act(async () => {
			await result.current.copyToClipboard('테스트 텍스트');
		});

		expect(result.current.isCopied).toBe(true);
		expect(result.current.message).toBe('복사되었습니다');

		// timeout 후 상태 초기화
		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(result.current.isCopied).toBe(false);
		expect(result.current.message).toBe('');

		vi.useRealTimers();
	});

	it('timeout이 0이면 성공 상태가 유지되어야 함', async () => {
		vi.useFakeTimers();
		const { result } = renderHook(() => useCopyToClipboard({ timeout: 0 }));

		await act(async () => {
			await result.current.copyToClipboard('테스트 텍스트');
		});

		expect(result.current.isCopied).toBe(true);
		expect(result.current.message).toBe('복사되었습니다');

		// 시간이 지나도 상태 유지
		act(() => {
			vi.advanceTimersByTime(5000);
		});

		expect(result.current.isCopied).toBe(true);
		expect(result.current.message).toBe('복사되었습니다');

		vi.useRealTimers();
	});

	it('reset 함수가 상태를 초기화해야 함', async () => {
		const { result } = renderHook(() => useCopyToClipboard());

		await act(async () => {
			await result.current.copyToClipboard('테스트 텍스트');
		});

		expect(result.current.isCopied).toBe(true);
		expect(result.current.message).toBe('복사되었습니다');

		act(() => {
			result.current.reset();
		});

		expect(result.current.isCopied).toBe(false);
		expect(result.current.isCopying).toBe(false);
		expect(result.current.message).toBe('');
	});

	it('커스텀 성공 메시지를 사용해야 함', async () => {
		const customMessage = '커스텀 성공 메시지';
		const { result } = renderHook(() => useCopyToClipboard({ successMessage: customMessage }));

		await act(async () => {
			await result.current.copyToClipboard('테스트 텍스트');
		});

		expect(result.current.message).toBe(customMessage);
	});

	it('커스텀 에러 메시지를 사용해야 함', async () => {
		mockClipboard.writeText.mockRejectedValue(new Error('복사 실패'));
		const customMessage = '커스텀 에러 메시지';
		const { result } = renderHook(() => useCopyToClipboard({ errorMessage: customMessage }));

		await act(async () => {
			await result.current.copyToClipboard('테스트 텍스트');
		});

		expect(result.current.message).toBe(customMessage);
	});

	it('복잡한 텍스트도 정상적으로 복사해야 함', async () => {
		const complexText = `{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "010-1234-5678",
  "address": {
    "street": "123 Main St",
    "city": "Seoul",
    "country": "Korea"
  }
}`;

		const { result } = renderHook(() => useCopyToClipboard());

		await act(async () => {
			const success = await result.current.copyToClipboard(complexText);
			expect(success).toBe(true);
		});

		expect(mockClipboard.writeText).toHaveBeenCalledWith(complexText);
	});

	it('여러 번 연속으로 복사해도 정상 작동해야 함', async () => {
		const { result } = renderHook(() => useCopyToClipboard());

		await act(async () => {
			await result.current.copyToClipboard('첫 번째 텍스트');
		});

		expect(result.current.isCopied).toBe(true);

		await act(async () => {
			await result.current.copyToClipboard('두 번째 텍스트');
		});

		expect(result.current.isCopied).toBe(true);
		expect(mockClipboard.writeText).toHaveBeenCalledTimes(2);
	});

	it('navigator.clipboard가 지원되지 않는 환경에서 실패해야 함', async () => {
		// navigator.clipboard를 undefined로 설정
		Object.defineProperty(navigator, 'clipboard', {
			value: undefined,
			writable: true,
		});

		const { result } = renderHook(() => useCopyToClipboard());

		await act(async () => {
			const success = await result.current.copyToClipboard('테스트 텍스트');
			expect(success).toBe(false);
		});

		expect(result.current.isCopied).toBe(false);
		expect(result.current.message).toBe('복사에 실패했습니다');

		// 원래대로 복원
		Object.defineProperty(navigator, 'clipboard', {
			value: mockClipboard,
			writable: true,
		});
	});
});

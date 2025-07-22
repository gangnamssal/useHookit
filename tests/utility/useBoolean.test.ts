import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useBoolean } from '../../src/utility/useBoolean';

describe('useBoolean', () => {
	describe('기본 기능', () => {
		it('초기값이 false로 설정되어야 한다', () => {
			const { result } = renderHook(() => useBoolean());

			expect(result.current.value).toBe(false);
		});

		it('초기값을 설정할 수 있어야 한다', () => {
			const { result } = renderHook(() => useBoolean({ initialValue: true }));

			expect(result.current.value).toBe(true);
		});

		it('toggle이 값을 토글해야 한다', () => {
			const { result } = renderHook(() => useBoolean());

			expect(result.current.value).toBe(false);

			act(() => {
				result.current.toggle();
			});

			expect(result.current.value).toBe(true);

			act(() => {
				result.current.toggle();
			});

			expect(result.current.value).toBe(false);
		});

		it('setTrue가 값을 true로 설정해야 한다', () => {
			const { result } = renderHook(() => useBoolean());

			expect(result.current.value).toBe(false);

			act(() => {
				result.current.setTrue();
			});

			expect(result.current.value).toBe(true);
		});

		it('setFalse가 값을 false로 설정해야 한다', () => {
			const { result } = renderHook(() => useBoolean({ initialValue: true }));

			expect(result.current.value).toBe(true);

			act(() => {
				result.current.setFalse();
			});

			expect(result.current.value).toBe(false);
		});

		it('setValue가 값을 직접 설정해야 한다', () => {
			const { result } = renderHook(() => useBoolean());

			expect(result.current.value).toBe(false);

			act(() => {
				result.current.setValue(true);
			});

			expect(result.current.value).toBe(true);

			act(() => {
				result.current.setValue(false);
			});

			expect(result.current.value).toBe(false);
		});
	});

	describe('콜백 기능', () => {
		it('onChange 콜백이 값 변경 시 호출되어야 한다', () => {
			const onChange = vi.fn();
			const { result } = renderHook(() => useBoolean({ onChange }));

			act(() => {
				result.current.toggle();
			});

			expect(onChange).toHaveBeenCalledWith(true);

			act(() => {
				result.current.toggle();
			});

			expect(onChange).toHaveBeenCalledWith(false);
		});

		it('setTrue 호출 시 onChange 콜백이 호출되어야 한다', () => {
			const onChange = vi.fn();
			const { result } = renderHook(() => useBoolean({ onChange }));

			act(() => {
				result.current.setTrue();
			});

			expect(onChange).toHaveBeenCalledWith(true);
		});

		it('setFalse 호출 시 onChange 콜백이 호출되어야 한다', () => {
			const onChange = vi.fn();
			const { result } = renderHook(() => useBoolean({ initialValue: true, onChange }));

			act(() => {
				result.current.setFalse();
			});

			expect(onChange).toHaveBeenCalledWith(false);
		});

		it('setValue 호출 시 onChange 콜백이 호출되어야 한다', () => {
			const onChange = vi.fn();
			const { result } = renderHook(() => useBoolean({ onChange }));

			act(() => {
				result.current.setValue(true);
			});

			expect(onChange).toHaveBeenCalledWith(true);
		});

		it('onChange 콜백이 비동기 함수여도 정상 동작해야 한다', async () => {
			const onChange = vi.fn().mockImplementation(async (value: boolean) => {
				await new Promise((resolve) => setTimeout(resolve, 10));
				return value;
			});
			const { result } = renderHook(() => useBoolean({ onChange }));

			act(() => {
				result.current.toggle();
			});

			expect(result.current.value).toBe(true);
			expect(onChange).toHaveBeenCalledWith(true);
		});

		it('onChange 콜백에서 에러가 발생해도 훅이 정상 동작해야 한다', () => {
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const onChange = vi.fn().mockImplementation(() => {
				throw new Error('onChange error');
			});
			const { result } = renderHook(() => useBoolean({ onChange }));

			act(() => {
				result.current.toggle();
			});

			expect(result.current.value).toBe(true);
			expect(onChange).toHaveBeenCalledWith(true);
			expect(consoleSpy).toHaveBeenCalledWith(
				'useBoolean: onChange callback threw an error:',
				expect.any(Error),
			);

			consoleSpy.mockRestore();
		});
	});

	describe('최적화', () => {
		it('이미 true인 상태에서 setTrue를 호출해도 onChange가 호출되지 않아야 한다', () => {
			const onChange = vi.fn();
			const { result } = renderHook(() => useBoolean({ initialValue: true, onChange }));

			act(() => {
				result.current.setTrue();
			});

			expect(onChange).not.toHaveBeenCalled();
		});

		it('이미 false인 상태에서 setFalse를 호출해도 onChange가 호출되지 않아야 한다', () => {
			const onChange = vi.fn();
			const { result } = renderHook(() => useBoolean({ onChange }));

			act(() => {
				result.current.setFalse();
			});

			expect(onChange).not.toHaveBeenCalled();
		});

		it('같은 값으로 setValue를 호출해도 onChange가 호출되지 않아야 한다', () => {
			const onChange = vi.fn();
			const { result } = renderHook(() => useBoolean({ onChange }));

			act(() => {
				result.current.setValue(false);
			});

			expect(onChange).not.toHaveBeenCalled();
		});

		it('onChange가 null이어도 정상 동작해야 한다', () => {
			const { result } = renderHook(() => useBoolean({ onChange: null as any }));

			expect(() => {
				act(() => {
					result.current.toggle();
				});
			}).not.toThrow();

			expect(result.current.value).toBe(true);
		});
	});

	describe('타입 안전성', () => {
		it('setValue에 truthy 값이 전달되면 true로 변환되어야 한다', () => {
			const { result } = renderHook(() => useBoolean());

			// 의도적으로 잘못된 타입 전달
			act(() => {
				(result.current.setValue as any)('truthy string');
			});

			expect(result.current.value).toBe(true);
		});

		it('setValue에 falsy 값이 전달되면 false로 변환되어야 한다', () => {
			const { result } = renderHook(() => useBoolean({ initialValue: true }));

			// 의도적으로 잘못된 타입 전달
			act(() => {
				(result.current.setValue as any)('');
			});

			expect(result.current.value).toBe(false);
		});

		it('setValue에 숫자 0이 전달되면 false로 변환되어야 한다', () => {
			const { result } = renderHook(() => useBoolean({ initialValue: true }));

			// 의도적으로 잘못된 타입 전달
			act(() => {
				(result.current.setValue as any)(0);
			});

			expect(result.current.value).toBe(false);
		});

		it('setValue에 숫자 1이 전달되면 true로 변환되어야 한다', () => {
			const { result } = renderHook(() => useBoolean());

			// 의도적으로 잘못된 타입 전달
			act(() => {
				(result.current.setValue as any)(1);
			});

			expect(result.current.value).toBe(true);
		});
	});

	describe('엣지 케이스', () => {
		it('onChange가 undefined여도 정상 동작해야 한다', () => {
			const { result } = renderHook(() => useBoolean({ onChange: undefined }));

			expect(() => {
				act(() => {
					result.current.toggle();
				});
			}).not.toThrow();

			expect(result.current.value).toBe(true);
		});

		it('여러 번 연속으로 toggle을 호출해도 정상 동작해야 한다', () => {
			const { result } = renderHook(() => useBoolean());

			act(() => {
				result.current.toggle();
				result.current.toggle();
				result.current.toggle();
			});

			expect(result.current.value).toBe(true);
		});

		it('여러 번 연속으로 setTrue를 호출해도 정상 동작해야 한다', () => {
			const { result } = renderHook(() => useBoolean());

			act(() => {
				result.current.setTrue();
				result.current.setTrue();
				result.current.setTrue();
			});

			expect(result.current.value).toBe(true);
		});

		it('여러 번 연속으로 setFalse를 호출해도 정상 동작해야 한다', () => {
			const { result } = renderHook(() => useBoolean({ initialValue: true }));

			act(() => {
				result.current.setFalse();
				result.current.setFalse();
				result.current.setFalse();
			});

			expect(result.current.value).toBe(false);
		});

		it('매우 큰 초기값이 설정되어도 정상 동작해야 한다', () => {
			const { result } = renderHook(() => useBoolean({ initialValue: true }));

			expect(result.current.value).toBe(true);

			act(() => {
				result.current.toggle();
			});

			expect(result.current.value).toBe(false);
		});

		it('빈 옵션 객체로 호출해도 정상 동작해야 한다', () => {
			const { result } = renderHook(() => useBoolean({}));

			expect(result.current.value).toBe(false);

			act(() => {
				result.current.toggle();
			});

			expect(result.current.value).toBe(true);
		});
	});

	describe('실제 사용 시나리오', () => {
		it('모달 상태 관리 시나리오', () => {
			const { result } = renderHook(() => useBoolean());

			// 모달 열기
			act(() => {
				result.current.setTrue();
			});
			expect(result.current.value).toBe(true);

			// 모달 닫기
			act(() => {
				result.current.setFalse();
			});
			expect(result.current.value).toBe(false);

			// 토글로 모달 열기
			act(() => {
				result.current.toggle();
			});
			expect(result.current.value).toBe(true);
		});

		it('체크박스 상태 관리 시나리오', () => {
			const { result } = renderHook(() => useBoolean());

			// 체크박스 체크
			act(() => {
				result.current.setValue(true);
			});
			expect(result.current.value).toBe(true);

			// 체크박스 해제
			act(() => {
				result.current.setValue(false);
			});
			expect(result.current.value).toBe(false);
		});

		it('드롭다운 상태 관리 시나리오', () => {
			const { result } = renderHook(() => useBoolean());

			// 드롭다운 열기
			act(() => {
				result.current.toggle();
			});
			expect(result.current.value).toBe(true);

			// 드롭다운 닫기
			act(() => {
				result.current.setFalse();
			});
			expect(result.current.value).toBe(false);
		});

		it('스위치 토글 시나리오', () => {
			const { result } = renderHook(() => useBoolean({ initialValue: false }));

			// 스위치 켜기
			act(() => {
				result.current.toggle();
			});
			expect(result.current.value).toBe(true);

			// 스위치 끄기
			act(() => {
				result.current.toggle();
			});
			expect(result.current.value).toBe(false);
		});

		it('복잡한 폼 상태 관리 시나리오', () => {
			const { result } = renderHook(() => useBoolean({ initialValue: false }));

			// 여러 상태 변경 연속 실행
			act(() => {
				result.current.setTrue();
				result.current.setFalse();
				result.current.toggle();
				result.current.setValue(true);
				result.current.setValue(false);
				result.current.toggle();
			});

			expect(result.current.value).toBe(true);
		});
	});

	describe('함수 참조 안정성', () => {
		it('함수 참조가 안정적이어야 한다', () => {
			const { result, rerender } = renderHook(() => useBoolean());

			const initialToggle = result.current.toggle;
			const initialSetTrue = result.current.setTrue;
			const initialSetFalse = result.current.setFalse;
			const initialSetValue = result.current.setValue;

			rerender();

			expect(result.current.toggle).toBe(initialToggle);
			expect(result.current.setTrue).toBe(initialSetTrue);
			expect(result.current.setFalse).toBe(initialSetFalse);
			expect(result.current.setValue).toBe(initialSetValue);
		});

		it('onChange가 변경되어도 기본 기능이 정상 동작해야 한다', () => {
			const onChange1 = vi.fn();
			const { result, rerender } = renderHook(({ onChange }) => useBoolean({ onChange }), {
				initialProps: { onChange: onChange1 },
			});

			// 첫 번째 onChange로 테스트
			act(() => {
				result.current.toggle();
			});
			expect(result.current.value).toBe(true);
			expect(onChange1).toHaveBeenCalledWith(true);

			const onChange2 = vi.fn();
			rerender({ onChange: onChange2 });

			// 두 번째 onChange로 테스트
			act(() => {
				result.current.toggle();
			});
			expect(result.current.value).toBe(false);
			expect(onChange2).toHaveBeenCalledWith(false);
		});
	});
});

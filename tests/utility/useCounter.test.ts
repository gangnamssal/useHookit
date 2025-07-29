import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useCounter } from '../../src/utility/useCounter';

describe('useCounter', () => {
	it('should return initial state', () => {
		const { result } = renderHook(() => useCounter());

		expect(result.current.value).toBe(0);
		expect(result.current.isMin).toBe(false);
		expect(result.current.isMax).toBe(false);
	});

	it('should use custom initial value', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 5 }));

		expect(result.current.value).toBe(5);
	});

	it('should increment value', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 0 }));

		act(() => {
			result.current.increment();
		});

		expect(result.current.value).toBe(1);
	});

	it('should decrement value', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 5 }));

		act(() => {
			result.current.decrement();
		});

		expect(result.current.value).toBe(4);
	});

	it('should reset to initial value', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 10 }));

		act(() => {
			result.current.increment();
		});
		expect(result.current.value).toBe(11);

		act(() => {
			result.current.increment();
		});
		expect(result.current.value).toBe(12);

		act(() => {
			result.current.reset();
		});

		expect(result.current.value).toBe(10);
	});

	it('should set value directly', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 0 }));

		act(() => {
			result.current.setValue(15);
		});

		expect(result.current.value).toBe(15);
	});

	it('should handle custom step', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 0, step: 5 }));

		act(() => {
			result.current.increment();
		});

		expect(result.current.value).toBe(5);

		act(() => {
			result.current.decrement();
		});

		expect(result.current.value).toBe(0);
	});

	it('should respect minimum bound', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 5, min: 0 }));

		expect(result.current.isMin).toBe(false);

		act(() => {
			result.current.setValue(0);
		});

		expect(result.current.value).toBe(0);
		expect(result.current.isMin).toBe(true);

		act(() => {
			result.current.decrement();
		});

		expect(result.current.value).toBe(0); // Should not go below min
		expect(result.current.isMin).toBe(true);
	});

	it('should respect maximum bound', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 5, max: 10 }));

		expect(result.current.isMax).toBe(false);

		act(() => {
			result.current.setValue(10);
		});

		expect(result.current.value).toBe(10);
		expect(result.current.isMax).toBe(true);

		act(() => {
			result.current.increment();
		});

		expect(result.current.value).toBe(10); // Should not go above max
		expect(result.current.isMax).toBe(true);
	});

	it('should clamp value within bounds', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 5, min: 0, max: 10 }));

		act(() => {
			result.current.setValue(-5);
		});

		expect(result.current.value).toBe(0); // Clamped to min

		act(() => {
			result.current.setValue(15);
		});

		expect(result.current.value).toBe(10); // Clamped to max
	});

	it('should call onChange callback', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() => useCounter({ initialValue: 0, onChange }));

		act(() => {
			result.current.increment();
		});

		expect(onChange).toHaveBeenCalledWith(1);
	});

	it('should call onMin callback', () => {
		const onMin = vi.fn();
		const { result } = renderHook(() => useCounter({ initialValue: 5, min: 0, onMin }));

		act(() => {
			result.current.setValue(0);
		});

		expect(onMin).toHaveBeenCalledWith(0);
	});

	it('should call onMax callback', () => {
		const onMax = vi.fn();
		const { result } = renderHook(() => useCounter({ initialValue: 5, max: 10, onMax }));

		act(() => {
			result.current.setValue(10);
		});

		expect(onMax).toHaveBeenCalledWith(10);
	});

	it('should not call callbacks when value does not change', () => {
		const onChange = vi.fn();
		const onMin = vi.fn();
		const onMax = vi.fn();
		const { result } = renderHook(() =>
			useCounter({ initialValue: 5, min: 0, max: 10, onChange, onMin, onMax }),
		);

		act(() => {
			result.current.setValue(5); // Same value
		});

		expect(onChange).not.toHaveBeenCalled();
		expect(onMin).not.toHaveBeenCalled();
		expect(onMax).not.toHaveBeenCalled();
	});

	it('should handle callback errors gracefully', () => {
		const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const onChange = vi.fn().mockImplementation(() => {
			throw new Error('Callback error');
		});
		const { result } = renderHook(() => useCounter({ initialValue: 0, onChange }));

		act(() => {
			result.current.increment();
		});

		expect(result.current.value).toBe(1); // Should still work
		expect(consoleSpy).toHaveBeenCalled();

		consoleSpy.mockRestore();
	});

	it('should handle non-numeric values in setValue', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 5 }));

		act(() => {
			result.current.setValue('invalid' as any);
		});

		expect(result.current.value).toBe(5); // Should not change
	});

	it('should handle NaN values in setValue', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 5 }));

		act(() => {
			result.current.setValue(NaN);
		});

		expect(result.current.value).toBe(5); // Should not change
	});

	it('should handle Infinity values in setValue', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 5 }));

		act(() => {
			result.current.setValue(Infinity);
		});

		expect(result.current.value).toBe(5); // Should not change
	});

	it('should handle undefined options', () => {
		const { result } = renderHook(() => useCounter(undefined as any));

		expect(result.current.value).toBe(0);
		expect(result.current.isMin).toBe(false);
		expect(result.current.isMax).toBe(false);
	});

	it('should handle empty options object', () => {
		const { result } = renderHook(() => useCounter({}));

		expect(result.current.value).toBe(0);
		expect(result.current.isMin).toBe(false);
		expect(result.current.isMax).toBe(false);
	});

	it('should maintain state stability across re-renders', () => {
		const { result, rerender } = renderHook(() => useCounter({ initialValue: 5 }));

		act(() => {
			result.current.increment();
		});

		expect(result.current.value).toBe(6);

		rerender();

		expect(result.current.value).toBe(6);
		expect(result.current.increment).toBe(result.current.increment);
		expect(result.current.decrement).toBe(result.current.decrement);
	});

	it('should handle negative step values', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 10, step: -2 }));

		act(() => {
			result.current.increment();
		});

		expect(result.current.value).toBe(8); // 10 + (-2) = 8

		act(() => {
			result.current.decrement();
		});

		expect(result.current.value).toBe(10); // 8 - (-2) = 8 + 2 = 10
	});

	it('should handle zero step value', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 5, step: 0 }));

		act(() => {
			result.current.increment();
		});

		expect(result.current.value).toBe(5); // No change with step 0
	});

	it('should handle decimal step values', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 0, step: 0.5 }));

		act(() => {
			result.current.increment();
		});

		expect(result.current.value).toBe(0.5);

		act(() => {
			result.current.increment();
		});

		expect(result.current.value).toBe(1);
	});

	it('should handle very large step values', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 0, step: 1000 }));

		act(() => {
			result.current.increment();
		});

		expect(result.current.value).toBe(1000);
	});

	it('should handle min and max being the same', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 5, min: 5, max: 5 }));

		expect(result.current.value).toBe(5);
		expect(result.current.isMin).toBe(true);
		expect(result.current.isMax).toBe(true);

		act(() => {
			result.current.increment();
		});

		expect(result.current.value).toBe(5); // Should not change
	});

	it('should handle min greater than max', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 5, min: 10, max: 5 }));

		expect(result.current.value).toBe(10); // Should clamp to min
		expect(result.current.isMin).toBe(true);
		expect(result.current.isMax).toBe(true); // When min > max, value clamped to min should also be >= max
	});

	it('should handle initial value at min boundary', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 0, min: 0, max: 10 }));

		expect(result.current.value).toBe(0);
		expect(result.current.isMin).toBe(true);
		expect(result.current.isMax).toBe(false);
	});

	it('should handle initial value at max boundary', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 10, min: 0, max: 10 }));

		expect(result.current.value).toBe(10);
		expect(result.current.isMin).toBe(false);
		expect(result.current.isMax).toBe(true);
	});

	it('should handle negative step with bounds', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 5, min: 0, max: 10, step: -2 }));

		act(() => {
			result.current.increment();
		});

		expect(result.current.value).toBe(3);

		act(() => {
			result.current.decrement();
		});

		expect(result.current.value).toBe(5);
	});

	it('should handle initial value outside bounds with callbacks', () => {
		const onChange = vi.fn();
		const onMin = vi.fn();
		const onMax = vi.fn();

		renderHook(() =>
			useCounter({
				initialValue: 15,
				min: 0,
				max: 10,
				onChange,
				onMin,
				onMax,
			}),
		);

		// Initial value should be clamped and callbacks should be called
		expect(onChange).toHaveBeenCalledWith(10);
		expect(onMax).toHaveBeenCalledWith(10);
	});

	it('should handle reset after bounds change', () => {
		const { result, rerender } = renderHook(
			({ min, max }) => useCounter({ initialValue: 5, min, max }),
			{ initialProps: { min: 0, max: 10 } },
		);

		act(() => {
			result.current.setValue(15);
		});

		expect(result.current.value).toBe(10); // Clamped to max

		rerender({ min: 0, max: 20 });

		act(() => {
			result.current.reset();
		});

		expect(result.current.value).toBe(5); // Should reset to initial value
	});

	it('should handle multiple rapid operations', () => {
		const { result } = renderHook(() => useCounter({ initialValue: 0 }));

		act(() => {
			result.current.increment();
		});
		expect(result.current.value).toBe(1);

		act(() => {
			result.current.increment();
		});
		expect(result.current.value).toBe(2);

		act(() => {
			result.current.increment();
		});
		expect(result.current.value).toBe(3);

		act(() => {
			result.current.decrement();
		});
		expect(result.current.value).toBe(2);
	});
});

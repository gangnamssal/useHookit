import { useState, useCallback, useRef, useMemo, useEffect } from 'react';

interface UseCounterOptions {
	/** Initial counter value (default: 0) */
	initialValue?: number;
	/** Minimum value limit */
	min?: number;
	/** Maximum value limit */
	max?: number;
	/** Step value for increment/decrement (default: 1) */
	step?: number;
	/** Callback when value changes */
	onChange?: (value: number) => void;
	/** Callback when reaching min value */
	onMin?: (value: number) => void;
	/** Callback when reaching max value */
	onMax?: (value: number) => void;
}

/**
 * A hook for declaratively managing counter states with bounds and step control
 *
 * @param options - Hook options
 * @param options.initialValue - Initial counter value (default: 0)
 * @param options.min - Minimum value limit
 * @param options.max - Maximum value limit
 * @param options.step - Step value for increment/decrement (default: 1)
 * @param options.onChange - Callback when value changes
 * @param options.onMin - Callback when reaching min value
 * @param options.onMax - Callback when reaching max value
 *
 * @returns Counter state management object
 * @returns {number} value - Current counter value
 * @returns {() => void} increment - Function to increment the value
 * @returns {() => void} decrement - Function to decrement the value
 * @returns {() => void} reset - Function to reset to initial value
 * @returns {(value: number) => void} setValue - Function to set value directly
 * @returns {boolean} isMin - Whether the value is at minimum
 * @returns {boolean} isMax - Whether the value is at maximum
 *
 * @example
 * ```tsx
 * const { value, increment, decrement, reset, isMin, isMax } = useCounter({
 *   initialValue: 0,
 *   min: 0,
 *   max: 10,
 *   step: 1
 * });
 *
 * return (
 *   <div>
 *     <p>Count: {value}</p>
 *     <button onClick={increment} disabled={isMax}>Increment</button>
 *     <button onClick={decrement} disabled={isMin}>Decrement</button>
 *     <button onClick={reset}>Reset</button>
 *   </div>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // With callbacks
 * const { value, increment, decrement } = useCounter({
 *   initialValue: 5,
 *   min: 0,
 *   max: 100,
 *   onChange: (value) => console.log('Value changed:', value),
 *   onMin: (value) => console.log('Reached minimum:', value),
 *   onMax: (value) => console.log('Reached maximum:', value)
 * });
 * ```
 */
export function useCounter(options: UseCounterOptions = {}): {
	value: number;
	increment: () => void;
	decrement: () => void;
	reset: () => void;
	setValue: (value: number) => void;
	isMin: boolean;
	isMax: boolean;
} {
	const { initialValue = 0, min, max, step = 1, onChange, onMin, onMax } = options;

	// Memoize clamp function to avoid recreation
	const clampValue = useCallback(
		(newValue: number): number => {
			if (min !== undefined && newValue < min) {
				return min;
			}
			if (max !== undefined && newValue > max) {
				return max;
			}
			return newValue;
		},
		[min, max],
	);

	// Memoize initial clamped value
	const initialClampedValue = useMemo(() => clampValue(initialValue), [clampValue, initialValue]);

	const [value, setValueState] = useState(initialClampedValue);

	// Call initial callbacks if value was clamped
	useEffect(() => {
		if (initialClampedValue !== initialValue) {
			// onChange callback
			if (onChangeRef.current) {
				try {
					onChangeRef.current(initialClampedValue);
				} catch (error) {
					console.warn('useCounter: onChange callback threw an error:', error);
				}
			}

			// onMin callback
			if (onMinRef.current && min !== undefined && initialClampedValue <= min) {
				try {
					onMinRef.current(initialClampedValue);
				} catch (error) {
					console.warn('useCounter: onMin callback threw an error:', error);
				}
			}

			// onMax callback
			if (onMaxRef.current && max !== undefined && initialClampedValue >= max) {
				try {
					onMaxRef.current(initialClampedValue);
				} catch (error) {
					console.warn('useCounter: onMax callback threw an error:', error);
				}
			}
		}
	}, []); // Only run once on mount

	// Use refs for callbacks to avoid unnecessary re-renders
	const onChangeRef = useRef(onChange);
	const onMinRef = useRef(onMin);
	const onMaxRef = useRef(onMax);

	// Update refs only when callbacks change
	onChangeRef.current = onChange;
	onMinRef.current = onMin;
	onMaxRef.current = onMax;

	// Memoize isMin and isMax calculations
	const isMin = useMemo(() => (min !== undefined ? value <= min : false), [value, min]);
	const isMax = useMemo(() => (max !== undefined ? value >= max : false), [value, max]);

	/**
	 * Common function to update value
	 */
	const updateValue = useCallback(
		(newValue: number) => {
			const clampedValue = clampValue(newValue);
			const oldValue = value;

			// Only update if value actually changed
			if (clampedValue !== oldValue) {
				setValueState(clampedValue);

				// onChange callback
				if (onChangeRef.current) {
					try {
						onChangeRef.current(clampedValue);
					} catch (error) {
						console.warn('useCounter: onChange callback threw an error:', error);
					}
				}

				// onMin callback
				if (onMinRef.current && min !== undefined && clampedValue <= min) {
					try {
						onMinRef.current(clampedValue);
					} catch (error) {
						console.warn('useCounter: onMin callback threw an error:', error);
					}
				}

				// onMax callback
				if (onMaxRef.current && max !== undefined && clampedValue >= max) {
					try {
						onMaxRef.current(clampedValue);
					} catch (error) {
						console.warn('useCounter: onMax callback threw an error:', error);
					}
				}
			}
		},
		[value, clampValue, min, max],
	);

	/**
	 * Function to increment value
	 */
	const increment = useCallback(() => {
		if (!isMax) {
			updateValue(value + step);
		}
	}, [value, step, isMax, updateValue]);

	/**
	 * Function to decrement value
	 */
	const decrement = useCallback(() => {
		if (!isMin) {
			updateValue(value - step);
		}
	}, [value, step, isMin, updateValue]);

	/**
	 * Function to reset to initial value
	 */
	const reset = useCallback(() => {
		updateValue(initialClampedValue);
	}, [initialClampedValue, updateValue]);

	/**
	 * Function to set value directly
	 */
	const setValue = useCallback(
		(newValue: number) => {
			// Ensure it's a valid finite number
			const numericValue = Number(newValue);
			if (!isNaN(numericValue) && isFinite(numericValue)) {
				updateValue(numericValue);
			}
		},
		[updateValue],
	);

	return {
		value,
		increment,
		decrement,
		reset,
		setValue,
		isMin,
		isMax,
	};
}

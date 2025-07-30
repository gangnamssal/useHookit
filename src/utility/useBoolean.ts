import { useState, useCallback, useRef } from 'react';

interface UseBooleanOptions {
	/** Initial boolean value (default: false) */
	initialValue?: boolean;

	/** Callback when value changes */
	onChange?: (value: boolean) => void;
}

/**
 * A hook for declaratively managing boolean states
 *
 * @param {UseBooleanOptions} [options] - Hook options
 *
 * @param {boolean} [options.initialValue] - Initial boolean value (default: false)
 *
 * @param {Function} [options.onChange] - Callback when value changes
 *
 * @returns {Object} Object containing boolean state management methods
 *
 * @returns {boolean} value - Current boolean value
 *
 * @returns {() => void} toggle - Function to toggle the value
 *
 * @returns {() => void} setTrue - Function to set value to true
 *
 * @returns {() => void} setFalse - Function to set value to false
 *
 * @returns {(value: boolean) => void} setValue - Function to set value directly
 *
 * @example
 * ```tsx
 * const { value, toggle, setTrue, setFalse, setValue } = useBoolean();
 *
 * return (
 *   <div>
 *     <p>Status: {value ? 'On' : 'Off'}</p>
 *     <button onClick={toggle}>Toggle</button>
 *     <button onClick={setTrue}>Turn On</button>
 *     <button onClick={setFalse}>Turn Off</button>
 *   </div>
 * );
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/utility-useboolean--docs
 */
export function useBoolean(options: UseBooleanOptions = {}): {
	value: boolean;
	toggle: () => void;
	setTrue: () => void;
	setFalse: () => void;
	setValue: (value: boolean) => void;
} {
	const { initialValue = false, onChange } = options;

	const [value, setValueState] = useState(initialValue);
	const onChangeRef = useRef(onChange);

	// Update onChange ref
	onChangeRef.current = onChange;

	/**
	 * Common function to update value
	 */
	const updateValue = useCallback((newValue: boolean) => {
		setValueState(newValue);

		// Only call if onChange callback exists
		if (onChangeRef.current) {
			try {
				onChangeRef.current(newValue);
			} catch (error) {
				// Hook continues to work even if onChange callback throws an error
				console.warn('useBoolean: onChange callback threw an error:', error);
			}
		}
	}, []);

	/**
	 * Function to toggle value
	 */
	const toggle = useCallback(() => {
		updateValue(!value);
	}, [value, updateValue]);

	/**
	 * Function to set value to true
	 */
	const setTrue = useCallback(() => {
		if (value !== true) {
			updateValue(true);
		}
	}, [value, updateValue]);

	/**
	 * Function to set value to false
	 */
	const setFalse = useCallback(() => {
		if (value !== false) {
			updateValue(false);
		}
	}, [value, updateValue]);

	/**
	 * Function to set value directly
	 */
	const setValue = useCallback(
		(newValue: boolean) => {
			// Force boolean type for type safety
			const booleanValue = Boolean(newValue);
			if (value !== booleanValue) {
				updateValue(booleanValue);
			}
		},
		[value, updateValue],
	);

	return {
		value,
		toggle,
		setTrue,
		setFalse,
		setValue,
	};
}

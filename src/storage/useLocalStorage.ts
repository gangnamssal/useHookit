import { useStorage, UseStorageOptions } from './useStorage';

/**
 * useLocalStorage hook options type
 */
export interface UseLocalStorageOptions extends UseStorageOptions {}

/**
 * A custom hook that synchronizes localStorage with React state.
 *
 * @template T - Type of the value to store
 *
 * @param {string} key - Key to store in localStorage
 *
 * @param {T} initialValue - Initial value
 *
 * @param {UseLocalStorageOptions} [options] - Serialization/deserialization function options
 *
 * @returns {T} value - Current value
 *
 * @returns {(value: T | ((val: T) => T)) => void} setValue - Function to set value
 *
 * @returns {() => void} removeValue - Function to remove value
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [value, setValue, removeValue] = useLocalStorage('my-key', 0);
 *
 * const handleIncrement = () => {
 *   setValue(prev => prev + 1);
 * };
 *
 * const handleReset = () => {
 *   removeValue();
 * };
 * ```
 *
 * @example
 * ```tsx
 * // Store objects
 * const [user, setUser, removeUser] = useLocalStorage('user', {
 *   name: '',
 *   email: ''
 * });
 *
 * const handleLogin = (userData) => {
 *   setUser(userData);
 * };
 * ```
 *
 * @example
 * ```tsx
 * // Use custom serialization
 * const [date, setDate] = useLocalStorage('date', new Date(), {
 *   serializer: (value) => value.toISOString(),
 *   deserializer: (value) => new Date(value)
 * });
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/storage-uselocalstorage--docs
 */
export function useLocalStorage<T>(
	key: string,
	initialValue: T,
	options: UseLocalStorageOptions = {},
): [T, (value: T | ((val: T) => T)) => void, () => void] {
	return useStorage('localStorage', key, initialValue, options);
}

import { useStorage, UseStorageOptions } from './useStorage';

/**
 * useSessionStorage hook options type
 */
export interface UseSessionStorageOptions extends UseStorageOptions {}

/**
 * A custom hook that synchronizes sessionStorage with React state.
 *
 * @template T - Type of the value to store
 *
 * @param {string} key - Key to store in sessionStorage
 *
 * @param {T} initialValue - Initial value. Used when no value exists in sessionStorage.
 *
 * @param {UseSessionStorageOptions} [options] - Serialization/deserialization function customization options
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
 * const [value, setValue, removeValue] = useSessionStorage('my-key', 'default');
 *
 * const handleUpdate = () => {
 *   setValue('new-value');
 * };
 *
 * const handleClear = () => {
 *   removeValue();
 * };
 * ```
 *
 * @example
 * ```tsx
 * // Temporary form data storage
 * const [formData, setFormData, clearFormData] = useSessionStorage('form-data', {
 *   name: '',
 *   email: '',
 *   message: ''
 * });
 *
 * const handleInputChange = (field, value) => {
 *   setFormData(prev => ({
 *     ...prev,
 *     [field]: value
 *   }));
 * };
 * ```
 *
 * @example
 * ```tsx
 * // Use custom serialization
 * const [theme, setTheme] = useSessionStorage('theme', 'light', {
 *   serializer: (value) => value.toString(),
 *   deserializer: (value) => value
 * });
 * ```
 *
 * @link https://use-hookit.vercel.app/?path=/docs/storage-usesessionstorage--docs
 */
export function useSessionStorage<T>(
	key: string,
	initialValue: T,
	options: UseSessionStorageOptions = {},
): [T, (value: T | ((val: T) => T)) => void, () => void] {
	return useStorage('sessionStorage', key, initialValue, options);
}

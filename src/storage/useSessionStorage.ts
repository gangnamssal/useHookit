import { useStorage, UseStorageOptions } from './useStorage';

/**
 * useSessionStorage 훅 옵션 타입
 */
export interface UseSessionStorageOptions extends UseStorageOptions {}

/**
 *
 * 세션 스토리지(sessionStorage)와 React 상태를 동기화하는 커스텀 훅입니다.
 *
 * A custom hook that synchronizes sessionStorage with React state.
 *
 * @template T - 저장할 값의 타입 / Type of the value to store
 *
 * @param {string} key - sessionStorage에 저장할 키 / Key to store in sessionStorage
 *
 * @param {T} initialValue - 초기값. sessionStorage에 값이 없을 때 사용됩니다. / Initial value. Used when no value exists in sessionStorage.
 *
 * @param {UseSessionStorageOptions} [options] - 직렬화/역직렬화 함수 커스터마이즈 옵션 / Serialization/deserialization function customization options
 *
 * @returns {[T, (value: T | ((val: T) => T)) => void, () => void]} [저장된 값, 값 설정 함수, 값 제거 함수] / [Stored value, set value function, remove value function]
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
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
 * // 폼 데이터 임시 저장 / Temporary form data storage
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
 * // 커스텀 직렬화 사용 / Use custom serialization
 * const [theme, setTheme] = useSessionStorage('theme', 'light', {
 *   serializer: (value) => value.toString(),
 *   deserializer: (value) => value
 * });
 * ```
 *
 */
export function useSessionStorage<T>(
	key: string,
	initialValue: T,
	options: UseSessionStorageOptions = {},
): [T, (value: T | ((val: T) => T)) => void, () => void] {
	return useStorage('sessionStorage', key, initialValue, options);
}

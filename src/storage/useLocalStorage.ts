import { useStorage, UseStorageOptions } from './useStorage';

/**
 * useLocalStorage 훅 옵션 타입
 */
export interface UseLocalStorageOptions extends UseStorageOptions {}

/**
 *
 * 로컬 스토리지(localStorage)와 React 상태를 동기화하는 커스텀 훅입니다.
 *
 * A custom hook that synchronizes localStorage with React state.
 *
 * @template T - 저장할 값의 타입 / Type of the value to store
 *
 * @param {string} key - localStorage에 저장할 키 / Key to store in localStorage
 *
 * @param {T} initialValue - 초기값 / Initial value
 *
 * @param {UseLocalStorageOptions} [options] - 직렬화/역직렬화 함수 옵션 / Serialization/deserialization function options
 *
 * @returns {[T, (value: T | ((val: T) => T)) => void, () => void]} [현재 값, 값 설정 함수, 값 제거 함수] 형태의 배열 / Array in [current value, set value function, remove value function] format
 *
 * @example
 * ```tsx
 * // 기본 사용법 / Basic usage
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
 * // 객체 저장 / Store objects
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
 * // 커스텀 직렬화 사용 / Use custom serialization
 * const [date, setDate] = useLocalStorage('date', new Date(), {
 *   serializer: (value) => value.toISOString(),
 *   deserializer: (value) => new Date(value)
 * });
 * ```
 *
 */
export function useLocalStorage<T>(
	key: string,
	initialValue: T,
	options: UseLocalStorageOptions = {},
): [T, (value: T | ((val: T) => T)) => void, () => void] {
	return useStorage('localStorage', key, initialValue, options);
}

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useObject } from '../../src/utility/useObject';

interface TestObject {
	name: string;
	age: number;
	isActive: boolean;
	email?: string;
}

describe('useObject', () => {
	it('기본 옵션으로 훅을 초기화해야 함', () => {
		const { result } = renderHook(() => useObject<TestObject>());
		const [object, operations] = result.current;

		expect(object).toEqual({});
		expect(operations.size).toBe(0);
		expect(operations.isEmpty).toBe(true);
		expect(operations.isNotEmpty).toBe(false);
	});

	it('초기값으로 훅을 초기화해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [object, operations] = result.current;

		expect(object).toEqual(initialValue);
		expect(operations.size).toBe(3);
		expect(operations.isEmpty).toBe(false);
		expect(operations.isNotEmpty).toBe(true);
	});

	it('set 메서드가 객체에 속성을 설정해야 함', () => {
		const { result } = renderHook(() => useObject<TestObject>());
		const [, operations] = result.current;

		act(() => {
			operations.set('name', 'Jane');
		});

		expect(result.current[0]).toEqual({ name: 'Jane' });
	});

	it('set 메서드가 기존 속성을 덮어써야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		act(() => {
			operations.set('name', 'Jane');
		});

		expect(result.current[0]).toEqual({ name: 'Jane', age: 30, isActive: true });
	});

	it('setMultiple 메서드가 여러 속성을 한 번에 설정해야 함', () => {
		const { result } = renderHook(() => useObject<TestObject>());
		const [, operations] = result.current;

		act(() => {
			operations.setMultiple({ name: 'Jane', age: 25 });
		});

		expect(result.current[0]).toEqual({ name: 'Jane', age: 25 });
	});

	it('remove 메서드가 속성을 제거해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		act(() => {
			operations.remove('age');
		});

		expect(result.current[0]).toEqual({ name: 'John', isActive: true });
	});

	it('remove 메서드가 존재하지 않는 속성을 안전하게 처리해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		act(() => {
			operations.remove('nonexistent' as keyof TestObject);
		});

		expect(result.current[0]).toEqual(initialValue);
	});

	it('removeMultiple 메서드가 여러 속성을 한 번에 제거해야 함', () => {
		const initialValue: TestObject = {
			name: 'John',
			age: 30,
			isActive: true,
			email: 'john@example.com',
		};
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		act(() => {
			operations.removeMultiple(['age', 'email']);
		});

		expect(result.current[0]).toEqual({ name: 'John', isActive: true });
	});

	it('removeMultiple 메서드가 빈 배열을 안전하게 처리해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		act(() => {
			operations.removeMultiple([]);
		});

		expect(result.current[0]).toEqual(initialValue);
	});

	it('removeMultiple 메서드가 존재하지 않는 키들을 안전하게 처리해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		act(() => {
			operations.removeMultiple([
				'nonexistent1',
				'nonexistent2',
			] as unknown as (keyof TestObject)[]);
		});

		expect(result.current[0]).toEqual(initialValue);
	});

	it('update 메서드가 함수를 사용하여 속성을 업데이트해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		act(() => {
			operations.update('age', (age) => (age as number) + 1);
		});

		expect(result.current[0]).toEqual({ name: 'John', age: 31, isActive: true });
	});

	it('update 메서드가 존재하지 않는 속성을 안전하게 처리해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		act(() => {
			operations.update('nonexistent' as keyof TestObject, (value) => value);
		});

		expect(result.current[0]).toEqual(initialValue);
	});

	it('updateMultiple 메서드가 여러 속성을 함수로 업데이트해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		act(() => {
			operations.updateMultiple({
				age: (age) => (age as number) + 1,
				name: (name) => (name as string).toUpperCase(),
			});
		});

		expect(result.current[0]).toEqual({ name: 'JOHN', age: 31, isActive: true });
	});

	it('updateMultiple 메서드가 빈 객체를 안전하게 처리해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		act(() => {
			operations.updateMultiple({});
		});

		expect(result.current[0]).toEqual(initialValue);
	});

	it('updateMultiple 메서드가 존재하지 않는 키들을 안전하게 처리해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		act(() => {
			operations.updateMultiple({
				nonexistent: (value: any) => value,
			} as unknown as { [K in keyof TestObject]?: (value: TestObject[K]) => TestObject[K] });
		});

		expect(result.current[0]).toEqual(initialValue);
	});

	it('toggle 메서드가 불린 속성을 토글해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		act(() => {
			operations.toggle('isActive');
		});

		expect(result.current[0]).toEqual({ name: 'John', age: 30, isActive: false });
	});

	it('toggle 메서드가 불린이 아닌 속성을 무시해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		act(() => {
			operations.toggle('name');
		});

		expect(result.current[0]).toEqual(initialValue);
	});

	it('toggle 메서드가 undefined 값을 안전하게 처리해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true, email: undefined };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		act(() => {
			operations.toggle('email');
		});

		expect(result.current[0]).toEqual(initialValue);
	});

	it('clear 메서드가 모든 속성을 제거해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		act(() => {
			operations.clear();
		});

		expect(result.current[0]).toEqual({});
		expect(result.current[1].isEmpty).toBe(true);
	});

	it('clear 메서드가 빈 객체에서도 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useObject<TestObject>());
		const [, operations] = result.current;

		act(() => {
			operations.clear();
		});

		expect(result.current[0]).toEqual({});
		expect(result.current[1].isEmpty).toBe(true);
	});

	it('replace 메서드가 전체 객체를 교체해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		const newObject: TestObject = { name: 'Jane', age: 25, isActive: false };
		act(() => {
			operations.replace(newObject);
		});

		expect(result.current[0]).toEqual(newObject);
	});

	it('replace 메서드가 빈 객체를 안전하게 처리해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		act(() => {
			operations.replace({} as TestObject);
		});

		expect(result.current[0]).toEqual({});
	});

	it('merge 메서드가 다른 객체와 병합해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		act(() => {
			operations.merge({ age: 31, email: 'john@example.com' });
		});

		expect(result.current[0]).toEqual({
			name: 'John',
			age: 31,
			isActive: true,
			email: 'john@example.com',
		});
	});

	it('merge 메서드가 빈 객체를 안전하게 처리해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		act(() => {
			operations.merge({});
		});

		expect(result.current[0]).toEqual(initialValue);
	});

	it('has 메서드가 속성 존재 여부를 확인해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		expect(operations.has('name')).toBe(true);
		expect(operations.has('age')).toBe(true);
		expect(operations.has('nonexistent' as keyof TestObject)).toBe(false);
	});

	it('keys 메서드가 모든 키를 반환해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		const keys = operations.keys();
		expect(keys).toContain('name');
		expect(keys).toContain('age');
		expect(keys).toContain('isActive');
		expect(keys).toHaveLength(3);
	});

	it('values 메서드가 모든 값을 반환해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		const values = operations.values();
		expect(values).toContain('John');
		expect(values).toContain(30);
		expect(values).toContain(true);
		expect(values).toHaveLength(3);
	});

	it('entries 메서드가 모든 키-값 쌍을 반환해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		const entries = operations.entries();
		expect(entries).toContainEqual(['name', 'John']);
		expect(entries).toContainEqual(['age', 30]);
		expect(entries).toContainEqual(['isActive', true]);
		expect(entries).toHaveLength(3);
	});

	it('pick 메서드가 특정 속성들만 선택해야 함', () => {
		const initialValue: TestObject = {
			name: 'John',
			age: 30,
			isActive: true,
			email: 'john@example.com',
		};
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		const picked = operations.pick(['name', 'age']);
		expect(picked).toEqual({ name: 'John', age: 30 });
	});

	it('pick 메서드가 존재하지 않는 속성을 무시해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		const picked = operations.pick(['name']);
		expect(picked).toEqual({ name: 'John' });
	});

	it('pick 메서드가 빈 배열을 안전하게 처리해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		const picked = operations.pick([]);
		expect(picked).toEqual({});
	});

	it('omit 메서드가 특정 속성들을 제외해야 함', () => {
		const initialValue: TestObject = {
			name: 'John',
			age: 30,
			isActive: true,
			email: 'john@example.com',
		};
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		const omitted = operations.omit(['age', 'email']);
		expect(omitted).toEqual({ name: 'John', isActive: true });
	});

	it('omit 메서드가 빈 배열을 안전하게 처리해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		const omitted = operations.omit([]);
		expect(omitted).toEqual(initialValue);
	});

	it('transform 메서드가 객체를 변환해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		const transformed = operations.transform((obj) => ({
			fullName: obj.name,
			yearsOld: obj.age,
			status: obj.isActive ? 'active' : 'inactive',
		}));

		expect(transformed).toEqual({
			fullName: 'John',
			yearsOld: 30,
			status: 'active',
		});
	});

	it('filter 메서드가 조건에 맞는 속성들만 필터링해야 함', () => {
		const initialValue: TestObject = {
			name: 'John',
			age: 30,
			isActive: true,
			email: 'john@example.com',
		};
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		const filtered = operations.filter((value, key) => typeof value === 'string');
		expect(filtered).toEqual({ name: 'John', email: 'john@example.com' });
	});

	it('filter 메서드가 빈 객체를 안전하게 처리해야 함', () => {
		const { result } = renderHook(() => useObject<TestObject>());
		const [, operations] = result.current;

		const filtered = operations.filter((value, key) => true);
		expect(filtered).toEqual({});
	});

	it('filter 메서드가 모든 조건을 만족하지 않는 경우를 처리해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		const filtered = operations.filter((value, key) => false);
		expect(filtered).toEqual({});
	});

	it('map 메서드가 객체 값을 변환해야 함', () => {
		const initialValue: TestObject = { name: 'John', age: 30, isActive: true };
		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		const mapped = operations.map((value, key) => {
			if (typeof value === 'string') return value.toUpperCase();
			if (typeof value === 'number') return value * 2;
			return value;
		});

		expect(mapped).toEqual({
			name: 'JOHN',
			age: 60,
			isActive: true,
		});
	});

	it('map 메서드가 빈 객체를 안전하게 처리해야 함', () => {
		const { result } = renderHook(() => useObject<TestObject>());
		const [, operations] = result.current;

		const mapped = operations.map((value, key) => value);
		expect(mapped).toEqual({});
	});

	it('debug 옵션이 활성화되면 로그를 출력해야 함', () => {
		const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
		const { result } = renderHook(() =>
			useObject({ debug: true, initialValue: { name: 'John', age: 25 } }),
		);
		const [, operations] = result.current;

		act(() => {
			operations.set('age', 30);
		});

		expect(consoleSpy).toHaveBeenCalledWith('useObject set:', 'age', 30, '->', {
			name: 'John',
			age: 30,
		});

		consoleSpy.mockRestore();
	});

	it('복잡한 객체에서도 정상적으로 작동해야 함', () => {
		interface ComplexObject {
			user: {
				id: number;
				profile: {
					name: string;
					avatar: string;
				};
			};
			settings: {
				theme: string;
				notifications: boolean;
			};
		}

		const initialValue: ComplexObject = {
			user: {
				id: 1,
				profile: {
					name: 'John',
					avatar: 'avatar.jpg',
				},
			},
			settings: {
				theme: 'dark',
				notifications: true,
			},
		};

		const { result } = renderHook(() => useObject({ initialValue }));
		const [, operations] = result.current;

		act(() => {
			operations.set('user', {
				id: 2,
				profile: {
					name: 'Jane',
					avatar: 'new-avatar.jpg',
				},
			});
		});

		expect(result.current[0].user.profile.name).toBe('Jane');
		expect(result.current[0].user.id).toBe(2);
	});

	it('여러 연속 작업이 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useObject<TestObject>());
		const [, operations] = result.current;

		act(() => {
			operations.set('name', 'John');
			operations.set('age', 30);
			operations.set('isActive', true);
			operations.remove('age');
		});

		expect(result.current[0]).toEqual({ name: 'John', isActive: true });
	});

	it('메모이제이션이 제대로 작동해야 함', () => {
		const { result } = renderHook(() => useObject({ initialValue: { name: 'John', age: 30 } }));
		const [, operations] = result.current;

		// 첫 번째 렌더링에서의 값들
		const initialSize = operations.size;
		const initialIsEmpty = operations.isEmpty;
		const initialIsNotEmpty = operations.isNotEmpty;

		// 객체를 변경
		act(() => {
			operations.set('age', 31);
		});

		// 값들이 업데이트되었는지 확인
		expect(result.current[1].size).toBe(2); // age가 변경되어도 size는 동일
		expect(result.current[1].isEmpty).toBe(false);
		expect(result.current[1].isNotEmpty).toBe(true);
	});

	it('빈 객체에서 모든 메서드가 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useObject<TestObject>());
		const [, operations] = result.current;

		// 읽기 전용 메서드들
		expect(operations.size).toBe(0);
		expect(operations.isEmpty).toBe(true);
		expect(operations.isNotEmpty).toBe(false);
		expect(operations.keys()).toEqual([]);
		expect(operations.values()).toEqual([]);
		expect(operations.entries()).toEqual([]);
		expect(operations.has('name')).toBe(false);

		// 수정 메서드들
		act(() => {
			operations.set('name', 'John');
		});
		expect(result.current[0]).toEqual({ name: 'John' });
		expect(result.current[1].isEmpty).toBe(false);
	});

	it('타입 안전성이 보장되어야 함', () => {
		// 문자열 키 객체
		const stringObject = renderHook(() =>
			useObject({ initialValue: { name: 'John', city: 'Seoul' } }),
		);
		expect(stringObject.result.current[0]).toEqual({ name: 'John', city: 'Seoul' });

		// 숫자 값 객체
		const numberObject = renderHook(() => useObject({ initialValue: { count: 1, score: 100 } }));
		expect(numberObject.result.current[0]).toEqual({ count: 1, score: 100 });

		// 혼합 타입 객체
		const mixedObject = renderHook(() =>
			useObject({ initialValue: { name: 'John', age: 30, active: true } }),
		);
		expect(mixedObject.result.current[0]).toEqual({ name: 'John', age: 30, active: true });
	});

	it('undefined와 null 값을 올바르게 처리해야 함', () => {
		interface TestObjectWithNulls {
			name: string;
			age: number | null;
			email: string | undefined;
		}

		const { result } = renderHook(() => useObject<TestObjectWithNulls>());
		const [, operations] = result.current;

		act(() => {
			operations.set('name', 'John');
			operations.set('age', null);
			operations.set('email', undefined);
		});

		expect(result.current[0]).toEqual({ name: 'John', age: null, email: undefined });
		// get 메서드는 현재 객체 상태를 반영해야 함
		expect(result.current[0].name).toBe('John');
		expect(result.current[0].age).toBe(null);
		expect(result.current[0].email).toBe(undefined);
	});

	it('함수형 프로그래밍 패턴에서도 정상적으로 작동해야 함', () => {
		const { result } = renderHook(() => useObject({ initialValue: { a: 1, b: 2, c: 3 } }));
		const [, operations] = result.current;

		// 체이닝 패턴 테스트
		const filtered = operations.filter((value) => (value as number) > 1);
		const mapped = operations.map((value) => (value as number) * 2);

		expect(filtered).toEqual({ b: 2, c: 3 });
		expect(mapped).toEqual({ a: 2, b: 4, c: 6 });
	});
});

# useHookit

useHookit is a collection of useful custom React Hooks designed to boost your development productivity. It helps you build faster and more efficiently by providing reusable hooks for common UI patterns and complex logic.

## Installation

```bash
npm install use-hookit
# or
yarn add use-hookit
# or
pnpm add use-hookit
```

## Usage

### Import all hooks

```typescript
import { useClickOutside, useDebounce, useLocalStorage } from 'use-hookit';
```

### Import specific categories

```typescript
// UI hooks
import { useClickOutside, useEventListener } from 'use-hookit/ui';

// Utility hooks
import { useMediaQuery, useInterval } from 'use-hookit/utility';

// Lifecycle hooks
import { useIsMounted, usePrevious } from 'use-hookit/lifecycle';

// Performance hooks
import { useDebounce, useThrottle } from 'use-hookit/performance';

// Storage hooks
import { useLocalStorage, useSessionStorage } from 'use-hookit/storage';
```

## API Documentation

### UI Hooks

#### `useClickOutside`

Detects clicks outside of a specified element.

```typescript
import { useClickOutside } from 'use-hookit/ui';

const ref = useClickOutside(() => {
	console.log('Clicked outside!');
});
```

#### `useEventListener`

Attaches event listeners to DOM elements.

```typescript
import { useEventListener } from 'use-hookit/ui';

useEventListener('click', handleClick, element);
```

#### `useIntersectionObserver`

Detects when an element enters or leaves the viewport using Intersection Observer API.

```typescript
import { useIntersectionObserver } from 'use-hookit/ui';

const { isIntersecting, ref } = useIntersectionObserver({
	threshold: 0.5,
	rootMargin: '50px',
});

return <div ref={ref}>{isIntersecting ? '보임!' : '안 보임'}</div>;
```

### Utility Hooks

#### `useMediaQuery`

Responds to media query changes.

```typescript
import { useMediaQuery } from 'use-hookit/utility';

const isMobile = useMediaQuery('(max-width: 768px)');
```

#### `useInterval`

Manages intervals with automatic cleanup.

```typescript
import { useInterval } from 'use-hookit/utility';

useInterval(() => {
	console.log('Tick!');
}, 1000);
```

#### `useWindowSize`

Detects browser window size changes in real-time.

```typescript
import { useWindowSize } from 'use-hookit/utility';

const { width, height, isMobile, isDesktop } = useWindowSize();

return (
	<div>
		윈도우 크기: {width} x {height}
		{isMobile && <MobileLayout />}
		{isDesktop && <DesktopLayout />}
	</div>
);
```

#### `useCopyToClipboard`

Copies text to clipboard and returns copy success status.

```typescript
import { useCopyToClipboard } from 'use-hookit/utility';

const { isCopied, isCopying, message, copyToClipboard, reset } = useCopyToClipboard();

const handleCopy = async () => {
	const success = await copyToClipboard('복사할 텍스트');
	if (success) {
		console.log('복사 성공!');
	}
};

return (
	<div>
		<button onClick={handleCopy} disabled={isCopying}>
			{isCopying ? '복사 중...' : '복사'}
		</button>
		{message && <span>{message}</span>}
		{isCopied && <button onClick={reset}>초기화</button>}
	</div>
);
```

### Lifecycle Hooks

#### `useIsMounted`

Tracks component mount status.

```typescript
import { useIsMounted } from 'use-hookit/lifecycle';

const isMounted = useIsMounted();
```

#### `usePrevious`

Tracks the previous value of a prop or state.

```typescript
import { usePrevious } from 'use-hookit/lifecycle';

const previousValue = usePrevious(currentValue);
```

### Performance Hooks

#### `useDebounce`

Debounces a value with a delay.

```typescript
import { useDebounce } from 'use-hookit/performance';

const debouncedValue = useDebounce(value, 500);
```

#### `useThrottle`

Throttles function calls or values.

```typescript
import { useThrottle } from 'use-hookit/performance';

const throttledCallback = useThrottle(callback, 1000);
```

### Storage Hooks

#### `useLocalStorage`

Manages localStorage with React state synchronization.

```typescript
import { useLocalStorage } from 'use-hookit/storage';

const [value, setValue, removeValue] = useLocalStorage('key', 'initial');
```

#### `useSessionStorage`

Manages sessionStorage with React state synchronization.

```typescript
import { useSessionStorage } from 'use-hookit/storage';

const [value, setValue, removeValue] = useSessionStorage('key', 'initial');
```

## Requirements

- React 18.0.0 or higher

## License

MIT

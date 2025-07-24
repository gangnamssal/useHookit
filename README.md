# useHookit 🚀

> **Modern React Hooks Library** - Boost your development with powerful, type-safe custom hooks

A comprehensive collection of **40+ production-ready React hooks** designed to accelerate your development workflow. Built with TypeScript, optimized for performance, and crafted for real-world applications.

## ✨ Features

- **Zero Dependencies** - Pure React hooks, no external dependencies
- **Performance Optimized** - Built with React best practices and memoization
- **Type Safe** - Full TypeScript support with comprehensive type definitions
- **Tree Shakeable** - Import only what you need, keep your bundle size minimal
- **Interactive Docs** - Live examples and documentation with Storybook

## 🚀 Quick Start

```bash
npm install use-hookit
# or
pnpm add use-hookit
# or
yarn add use-hookit
```

```typescript
import { useDebounce, useLocalStorage, useClickOutside } from 'use-hookit';

// Debounce search input
const debouncedSearch = useDebounce(searchTerm, 300);

// Persistent state
const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');

// Click outside detection
const ref = useClickOutside(() => setModalOpen(false));
```

## 📚 Hook Categories

### UI Hooks - DOM Interactions

```typescript
import {
	useClickOutside,
	useEventListener,
	useIntersectionObserver,
	useLongPress,
} from 'use-hookit/ui';
```

### Utility Hooks - Data Management

```typescript
import {
	useArray,
	useObject,
	useSet,
	useMap, // Data structures
	useBoolean,
	useLoading,
	useCopyToClipboard, // State management
	useWindowSize,
	useMediaQuery,
	useNetworkStatus,
	useGeolocation, // Browser APIs
} from 'use-hookit/utility';
```

### Performance Hooks - Optimization

```typescript
import { useDebounce, useThrottle } from 'use-hookit/performance';
```

### Lifecycle Hooks - Component Lifecycle

```typescript
import { useIsMounted, usePrevious } from 'use-hookit/lifecycle';
```

### Storage Hooks - Persistence

```typescript
import { useLocalStorage, useSessionStorage } from 'use-hookit/storage';
```

## 🎯 Featured Hooks

### Data Structure Hooks

```typescript
// Array management with 20+ methods
const [array, { push, pop, filter, map, sort, reverse }] = useArray([1, 2, 3]);

// Object state management
const [obj, { set, get, has, remove, merge, pick, omit }] = useObject({ name: 'John' });

// Set operations
const [set, { add, delete, union, intersection, difference }] = useSet(['apple', 'banana']);

// Map key-value management
const [map, { set, get, has, delete, filter, map: mapValues }] = useMap([['key', 'value']]);
```

### UI Interaction Hooks

```typescript
// Click outside detection
const ref = useClickOutside(() => setOpen(false));

// Long press detection
const { handlers, isLongPressing } = useLongPress({
	onLongPress: () => console.log('Long pressed!'),
	delay: 500,
});

// Intersection observer
const { isIntersecting, ref } = useIntersectionObserver({
	threshold: 0.5,
});
```

### Performance Hooks

```typescript
// Debounce values
const debouncedSearch = useDebounce(searchTerm, 300);

// Throttle callbacks
const throttledScroll = useThrottle(handleScroll, 100);
```

### Browser API Hooks

```typescript
// Window size with breakpoints
const { width, height, isMobile, isDesktop } = useWindowSize();

// Media queries
const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

// Network status
const { isOnline, isOffline } = useNetworkStatus();

// Geolocation
const { position, loading, error } = useGeolocation();
```

## 📖 Documentation

Explore all hooks with live examples at our [Storybook documentation](https://use-hookit.vercel.app/).

## 📦 Bundle Size

- **Core**: ~2KB gzipped
- **Individual hooks**: ~0.5-2KB each
- **Tree-shakeable**: Only import what you use

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run Storybook locally
pnpm run storybook

# Build library
pnpm run build
```

## 📋 Requirements

- React 18.0.0 or higher
- TypeScript 4.5+ (recommended)

## 📄 License

MIT © [useHookit](https://github.com/usehookit)

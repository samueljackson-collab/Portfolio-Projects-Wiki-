import '@testing-library/jest-dom';

// Mock IntersectionObserver used in ProjectDetail's Section component.
// Must be a class (constructor), not an arrow function, since it's used with `new`.
class IntersectionObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
global.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

// Mock navigator.clipboard used in CodeBlock copy feature
Object.assign(navigator, {
  clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
});

// Mock window.scrollTo used in App.handleSelectProject
window.scrollTo = vi.fn();

// Mock window.location.reload used in ErrorBoundary refresh button
Object.defineProperty(window, 'location', {
  configurable: true,
  value: { reload: vi.fn() },
});

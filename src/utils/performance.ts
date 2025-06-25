import React, { useCallback, useMemo, useRef } from 'react';

/**
 * Enterprise-grade performance utilities
 */

// Debounce hook with cleanup
export const useDebounce = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
};

// Memoized computation with deep comparison
export const useDeepMemo = <T>(factory: () => T, deps: unknown[]): T => {
  return useMemo(factory, [factory, ...deps]);
};

// Throttle hook for performance-critical operations
export const useThrottle = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T => {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallRef.current;
    
    if (timeSinceLastCall >= delay) {
      lastCallRef.current = now;
      callback(...args);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now();
        callback(...args);
      }, delay - timeSinceLastCall);
    }
  }, [callback, delay]) as T;
};

// Performance measurement utilities
export class PerformanceTracker {
  private static instance: PerformanceTracker;
  private measurements: Map<string, number> = new Map();
  
  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }
  
  startMeasurement(key: string): void {
    this.measurements.set(key, performance.now());
  }
  
  endMeasurement(key: string): number {
    const start = this.measurements.get(key);
    if (!start) {
      console.warn(`No start measurement found for key: ${key}`);
      return 0;
    }
    
    const duration = performance.now() - start;
    this.measurements.delete(key);
    
    if (process.env.NODE_ENV === 'development' && duration > 16) {
      console.warn(`Slow operation detected: ${key} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }
  
  measureAsync<T>(key: string, operation: () => Promise<T>): Promise<T> {
    this.startMeasurement(key);
    return operation().finally(() => {
      this.endMeasurement(key);
    });
  }
}

// Memory leak prevention utilities
export const createAbortController = (): AbortController => {
  return new AbortController();
};

export const withAbortSignal = <T>(
  promise: Promise<T>,
  signal: AbortSignal
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      signal.addEventListener('abort', () => {
        reject(new Error('Operation aborted'));
      });
    })
  ]);
};

// Bundle size optimization helper
export const lazyWithPreload = <T extends React.ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>
) => {
  const LazyComponent = React.lazy(factory);
  const preload = () => factory();
  
  return { LazyComponent, preload };
};


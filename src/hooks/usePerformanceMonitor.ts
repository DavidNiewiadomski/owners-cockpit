
import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  componentName: string;
  renderTime: number;
  props?: any;
  timestamp: number;
}

interface UsePerformanceMonitorOptions {
  enabled?: boolean;
  threshold?: number; // Log if render time exceeds this (ms)
  logProps?: boolean;
}

export function usePerformanceMonitor(
  componentName: string,
  options: UsePerformanceMonitorOptions = {}
) {
  const {
    enabled = process.env.NODE_ENV === 'development',
    threshold = 16, // 16ms = 60fps
    logProps = false
  } = options;

  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);
  const totalRenderTime = useRef<number>(0);

  const startMeasurement = useCallback(() => {
    if (!enabled) return;
    renderStartTime.current = performance.now();
  }, [enabled]);

  const endMeasurement = useCallback((props?: any) => {
    if (!enabled || renderStartTime.current === 0) return;

    const renderTime = performance.now() - renderStartTime.current;
    renderCount.current++;
    totalRenderTime.current += renderTime;

    const metrics: PerformanceMetrics = {
      componentName,
      renderTime,
      timestamp: Date.now(),
      ...(logProps && props && { props })
    };

    // Log slow renders
    if (renderTime > threshold) {
      console.warn(`Slow render detected in ${componentName}:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        threshold: `${threshold}ms`,
        renderCount: renderCount.current,
        averageRenderTime: `${(totalRenderTime.current / renderCount.current).toFixed(2)}ms`,
        ...(logProps && props && { props })
      });
    }

    // Optional: Send to analytics service
    if (process.env.NODE_ENV === 'production' && renderTime > threshold * 2) {
      // Example: sendPerformanceMetrics(metrics);
    }

    renderStartTime.current = 0;
  }, [enabled, componentName, threshold, logProps]);

  // Start measurement on each render
  useEffect(() => {
    startMeasurement();
  });

  return {
    startMeasurement,
    endMeasurement,
    getStats: () => ({
      renderCount: renderCount.current,
      totalRenderTime: totalRenderTime.current,
      averageRenderTime: renderCount.current > 0 
        ? totalRenderTime.current / renderCount.current 
        : 0
    })
  };
}

// HOC for easy performance monitoring
export function withPerformanceMonitor<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  componentName?: string
) {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name;
  
  const MemoizedComponent = React.memo((props: T) => {
    const { endMeasurement } = usePerformanceMonitor(displayName);
    
    useEffect(() => {
      endMeasurement(props);
    });

    return <WrappedComponent {...props} />;
  });

  MemoizedComponent.displayName = `withPerformanceMonitor(${displayName})`;
  
  return MemoizedComponent;
}

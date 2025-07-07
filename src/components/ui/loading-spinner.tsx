import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'sm' | 'lg';
}

export function LoadingSpinner({
  size = 'default',
  className,
  ...props
}: LoadingSpinnerProps) {
  return (
    <div role="status" {...props}>
      <Loader2
        className={cn(
          'animate-spin',
          {
            'h-4 w-4': size === 'sm',
            'h-6 w-6': size === 'default',
            'h-8 w-8': size === 'lg',
          },
          className
        )}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

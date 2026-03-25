import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, helperText, id, ...props }, ref) => {
    const inputId = id || React.useId();
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--text-primary)]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            'flex h-10 w-full rounded-lg border px-3 py-2 text-sm',
            'bg-[var(--bg-input)] text-[var(--text-primary)]',
            'border-transparent placeholder:text-[var(--text-tertiary)]',
            'transition-all duration-200',
            'focus:outline-none focus:border-[var(--border-hover)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-[var(--color-sell)] focus:border-[var(--color-sell)]',
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          {...props}
        />
        {error && (
          <p id={errorId} className="text-xs text-[var(--color-sell)]" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="text-xs text-[var(--text-secondary)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };

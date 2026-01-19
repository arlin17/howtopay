"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  useId,
} from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-4 py-3 text-base",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      size = "md",
      icon,
      iconPosition = "left",
      fullWidth = false,
      disabled,
      className = "",
      id: providedId,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const hasError = !!error;
    const describedBy = [
      ariaDescribedBy,
      hasError ? errorId : null,
      helperText ? helperId : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === "left" && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            className={`
              block w-full rounded-lg
              bg-[#0a0f1a] border
              text-[#f0fdf4] placeholder:text-[#6ee7b7]/50
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#030712]
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#111827]
              ${sizeStyles[size]}
              ${icon && iconPosition === "left" ? "pl-10" : ""}
              ${icon && iconPosition === "right" ? "pr-10" : ""}
              ${
                hasError
                  ? "border-[#f87171] focus:ring-[#f87171] focus:border-[#f87171]"
                  : "border-[#1f2937] hover:border-[#374151] focus:ring-[#10b981] focus:border-[#10b981]"
              }
              ${className}
            `}
            {...props}
          />
          {icon && iconPosition === "right" && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-error" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-sm text-foreground-muted">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

import { type HTMLAttributes, forwardRef } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = "text",
      width,
      height,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      text: "rounded-md h-4",
      circular: "rounded-full",
      rectangular: "rounded-lg",
    };

    return (
      <div
        ref={ref}
        className={`
          animate-pulse bg-background-muted
          ${variantStyles[variant]}
          ${className}
        `}
        style={{
          width: width ? (typeof width === "number" ? `${width}px` : width) : undefined,
          height: height ? (typeof height === "number" ? `${height}px` : height) : undefined,
          ...style,
        }}
        role="status"
        aria-label="Loading"
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

export function PaymentMethodSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton width="40%" height={16} />
        <Skeleton width="60%" height={14} />
      </div>
    </div>
  );
}

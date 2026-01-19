import { type HTMLAttributes, type ReactNode, forwardRef } from "react";

type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: ContainerSize;
  centered?: boolean;
  padding?: boolean;
}

const sizeStyles: Record<ContainerSize, string> = {
  sm: "max-w-sm",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  full: "max-w-full",
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      children,
      size = "lg",
      centered = true,
      padding = true,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`
          w-full
          ${sizeStyles[size]}
          ${centered ? "mx-auto" : ""}
          ${padding ? "px-4 sm:px-6 lg:px-8" : ""}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

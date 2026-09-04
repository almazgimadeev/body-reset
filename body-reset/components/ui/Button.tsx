"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", fullWidth, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex min-h-[52px] items-center justify-center rounded-2xl px-6 text-[15px] font-medium transition-transform active:scale-[0.98] disabled:opacity-40 disabled:active:scale-100",
          variant === "primary" && "bg-primary text-white",
          variant === "secondary" && "bg-card text-primary border border-border",
          variant === "ghost" && "bg-transparent text-primary underline underline-offset-4",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={clsx(
        "w-full min-h-[52px] rounded-2xl border border-border bg-card px-4 text-[16px] text-primary outline-none focus:border-accent",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

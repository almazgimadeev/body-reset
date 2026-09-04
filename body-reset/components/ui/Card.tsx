import { HTMLAttributes } from "react";
import clsx from "clsx";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("rounded-2xl border border-border bg-card p-4 shadow-card", className)} {...props}>
      {children}
    </div>
  );
}

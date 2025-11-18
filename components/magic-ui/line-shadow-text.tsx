"use client";

import { cn } from "@/lib/utils";

interface LineShadowTextProps {
  text: string;
  className?: string;
  shadowClassName?: string;
}

export function LineShadowText({
  text,
  className,
  shadowClassName,
}: LineShadowTextProps) {
  return (
    <span className={cn("relative inline-block", className)}>
      <span className="relative z-10">{text}</span>
      <span
        className={cn(
          "absolute inset-0 blur-sm opacity-50",
          shadowClassName
        )}
        aria-hidden="true"
      >
        {text}
      </span>
    </span>
  );
}

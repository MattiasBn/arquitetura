import * as React from "react";
import { cn } from "@/lib/utils";

export function Container({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto max-w-7xl px-6 sm:px-8 lg:px-12", className)}
      {...props}
    />
  );
}
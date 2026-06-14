import type { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  return <div className="min-h-[calc(100vh-0px)]">{children}</div>;
}

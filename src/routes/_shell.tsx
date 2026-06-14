import { Outlet, useRouterState, createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { FloatingNav } from "@/components/shell/FloatingNav";
import { DemoFab } from "@/components/shell/DemoFab";
import { PageTransition } from "@/components/shell/PageTransition";
import { ReplayEngine } from "@/components/shell/ReplayEngine";
import { CommandPalette } from "@/components/shell/CommandPalette";
import { ReplayBanner } from "@/components/shell/ReplayBanner";

export const Route = createFileRoute("/_shell")({
  component: ShellLayout,
});

function ShellLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="relative min-h-screen">
      <FloatingNav />
      <ReplayBanner />
      <main className="pl-24 pr-6 py-6">
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
      </main>
      <DemoFab />
      <CommandPalette />
      <ReplayEngine />
      <Toaster theme="dark" richColors position="top-right" />
    </div>
  );
}

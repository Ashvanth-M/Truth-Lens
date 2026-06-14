import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, X } from "lucide-react";
import { useTruthLensStore } from "@/store/useTruthLensStore";

export function ReplayBanner() {
  const active = useTruthLensStore((s) => s.replayActive);
  const stop = useTruthLensStore((s) => s.stopReplay);
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          className="fixed top-4 left-1/2 z-40 -translate-x-1/2"
        >
          <div className="glass-strong flex items-center gap-3 rounded-full px-4 py-2 text-xs">
            <span className="relative grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-sky-500 text-[#0B1020]">
              <PlayCircle className="h-3 w-3" />
              <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/40" />
            </span>
            <span className="font-medium text-white">Replay in progress · NEET Mock 2026</span>
            <button onClick={stop} className="ml-2 rounded-full p-1 text-[color:var(--color-text-muted)] hover:bg-white/10 hover:text-white">
              <X className="h-3 w-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

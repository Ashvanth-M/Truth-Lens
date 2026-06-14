import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, CameraOff, AlertTriangle } from "lucide-react";

/**
 * Webcam viewport — uses getUserMedia. Overlays are simulated detection.
 */
export function WebcamViewport({ overlays }: { overlays: { face?: boolean; phone?: boolean; gaze?: boolean } }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "live" | "denied" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);

  const start = async () => {
    setState("loading");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 400, facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setState("live");
    } catch (e) {
      const msg = (e as Error).message || "Camera unavailable";
      setErr(msg);
      setState(msg.toLowerCase().includes("denied") || msg.toLowerCase().includes("permission") ? "denied" : "error");
    }
  };

  const stop = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setState("idle");
  };

  useEffect(() => () => stop(), []);

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[color:var(--color-hairline)] bg-gradient-to-br from-[#101631] to-[#1a2247]">
      <video ref={videoRef} className="absolute inset-0 h-full w-full object-cover opacity-90" muted playsInline />

      {/* Gaze heatmap */}
      {state === "live" && overlays.gaze && (
        <>
          <div className="absolute left-[18%] top-[60%] h-24 w-24 rounded-full bg-rose-500/30 blur-2xl" />
          <div className="absolute left-[55%] top-[40%] h-32 w-32 rounded-full bg-amber-400/20 blur-2xl" />
          <div className="absolute left-[40%] top-[50%] h-40 w-40 rounded-full bg-emerald-400/10 blur-2xl" />
        </>
      )}

      {/* Phone box */}
      {state === "live" && overlays.phone && (
        <div className="absolute left-[10%] top-[70%] flex h-12 w-20 items-end rounded border border-rose-400/80 p-1">
          <span className="rounded bg-rose-500/85 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">phone · 92%</span>
        </div>
      )}

      {/* Face box */}
      {state === "live" && overlays.face && (
        <div className="absolute left-[36%] top-[14%] flex h-44 w-36 items-start rounded border border-emerald-400/80 p-1">
          <span className="rounded bg-emerald-500/85 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#0B1020]">face · 92.4%</span>
        </div>
      )}

      {/* Scan line */}
      {state === "live" && (
        <motion.div
          initial={{ y: "-100%" }} animate={{ y: "100%" }} transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-accent-2)] to-transparent opacity-70"
        />
      )}

      {/* HUD */}
      <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1 text-[10px] text-white backdrop-blur">
        <span className={`h-1.5 w-1.5 rounded-full ${state === "live" ? "bg-rose-500 animate-pulse" : "bg-white/40"}`} />
        {state === "live" ? "LIVE · ON-DEVICE" : state === "loading" ? "STARTING…" : state === "denied" ? "CAMERA DENIED" : state === "error" ? "OFFLINE" : "STANDBY"}
      </div>
      <div className="absolute right-3 top-3 rounded-full bg-black/40 px-2 py-1 text-[10px] text-white backdrop-blur">Centre 07 · Mumbai</div>

      {/* Idle / error state */}
      {state !== "live" && (
        <div className="absolute inset-0 grid place-items-center bg-[#0B1020]/60 backdrop-blur-sm">
          <div className="text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/[0.06]">
              {state === "denied" || state === "error" ? <AlertTriangle className="h-5 w-5 text-amber-300" /> : <Camera className="h-5 w-5 text-white" />}
            </div>
            <div className="mt-3 max-w-xs text-xs text-[color:var(--color-text-muted)]">
              {state === "denied"
                ? "Camera permission denied. Live demo will use simulated detection."
                : state === "error"
                  ? err
                  : "Engage on-device proctoring. No video leaves this browser."}
            </div>
            <div className="mt-3 flex justify-center gap-2">
              {state === "loading" ? (
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] text-white">Requesting camera…</span>
              ) : (
                <button
                  onClick={start}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-2)] px-3 py-1.5 text-[11px] font-semibold text-[#0B1020]"
                >
                  <Camera className="h-3 w-3" /> Engage camera
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {state === "live" && (
        <button
          onClick={stop}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-[11px] text-white backdrop-blur hover:bg-black/70"
        >
          <CameraOff className="h-3 w-3" /> Disengage
        </button>
      )}
    </div>
  );
}

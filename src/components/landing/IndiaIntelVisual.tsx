import { motion } from "framer-motion";
import { centres } from "@/data/mock";

// Stylised India outline — simplified polygon for ambience, not cartographic accuracy.
const INDIA_PATH = "M420,140 L470,130 L520,150 L560,180 L600,170 L650,200 L690,250 L720,310 L760,360 L820,400 L860,450 L870,510 L820,540 L780,560 L740,610 L720,680 L680,740 L640,790 L600,840 L560,890 L520,930 L480,950 L460,920 L450,880 L430,830 L410,790 L390,760 L360,720 L340,680 L320,640 L300,580 L290,520 L300,460 L320,410 L350,370 L370,310 L380,260 L390,210 L400,170 Z";

export function IndiaIntelVisual() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(124,123,255,0.18),transparent_60%)]" />
      <svg viewBox="0 0 1000 1100" className="h-full w-full">
        <defs>
          <linearGradient id="indiaFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7C7BFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.10" />
          </linearGradient>
          <radialGradient id="centreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
          </radialGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
          </pattern>
        </defs>
        <rect width="1000" height="1100" fill="url(#grid)" />
        <motion.path
          d={INDIA_PATH}
          fill="url(#indiaFill)"
          stroke="rgba(124,123,255,0.4)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />

        {centres.slice(0, 22).map((c, i) => {
          const risk = c.risk;
          const color =
            risk === "critical" ? "#FF3D6E" :
            risk === "elevated" ? "#F59E0B" :
            risk === "watch" ? "#FBBF24" : "#34D399";
          return (
            <g key={c.id} transform={`translate(${c.x},${c.y})`}>
              <circle r="22" fill="url(#centreGlow)" />
              <motion.circle
                r="3.5"
                fill={color}
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2 + (i % 3) * 0.4, repeat: Infinity, delay: i * 0.08 }}
              />
              {(risk === "critical" || risk === "elevated") && (
                <motion.circle
                  r="6"
                  fill="none"
                  stroke={color}
                  strokeWidth="1.2"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: [1, 3, 3], opacity: [0.8, 0, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.15 }}
                />
              )}
            </g>
          );
        })}

        {/* Threat connections between centres */}
        <g stroke="rgba(255,61,110,0.4)" strokeWidth="1" fill="none">
          <motion.line
            x1={centres[1].x} y1={centres[1].y} x2={centres[2].x} y2={centres[2].y}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, delay: 1 }}
            strokeDasharray="4 4"
          />
        </g>
      </svg>

      {/* Live activity feed overlay */}
      <div className="glass-strong pointer-events-none absolute bottom-6 left-6 right-6 max-w-md p-4">
        <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-subtle)]">Live activity</div>
        <ul className="mt-2 space-y-1.5 text-xs">
          {[
            ["15:02", "Phone detected · Mumbai 07", "critical"],
            ["15:01", "Cluster forming · Bengaluru 12", "high"],
            ["15:00", "Identity verified · 24,118 students", "ok"],
          ].map(([t, msg, sev]) => (
            <li key={msg} className="flex items-center gap-2">
              <span className="text-[color:var(--color-text-subtle)]">{t}</span>
              <span className={
                sev === "critical" ? "text-[color:var(--color-critical)]" :
                sev === "high" ? "text-rose-300" : "text-emerald-300"
              }>•</span>
              <span className="text-white/80">{msg}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

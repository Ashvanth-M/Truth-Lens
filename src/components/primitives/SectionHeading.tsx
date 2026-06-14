export function SectionHeading({ eyebrow, title, subtitle, right }: { eyebrow?: string; title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {eyebrow && <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-subtle)]">{eyebrow}</div>}
        <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-[color:var(--color-text-muted)]">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

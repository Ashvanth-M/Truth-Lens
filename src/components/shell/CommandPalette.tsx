import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Activity, Eye, Fingerprint, GitBranch, ScrollText, Settings as SettingsIcon, PlayCircle, Smartphone, Users, UserX, FileText, Sparkles } from "lucide-react";
import { useTruthLensStore } from "@/store/useTruthLensStore";
import { toast } from "sonner";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const startReplay = useTruthLensStore((s) => s.startReplay);
  const push = useTruthLensStore((s) => s.pushAnomaly);
  const generate = useTruthLensStore((s) => s.generateReport);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (to: string) => {
    setOpen(false);
    navigate({ to });
  };
  const sim = (k: Parameters<typeof push>[0], label: string) => {
    setOpen(false);
    push(k);
    toast.success(`Simulated: ${label}`);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, simulations, actions…  (⌘K)" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/command-centre")}><Activity className="mr-2 h-4 w-4" /> Command Centre</CommandItem>
          <CommandItem onSelect={() => go("/identity-vault")}><Fingerprint className="mr-2 h-4 w-4" /> Identity Vault</CommandItem>
          <CommandItem onSelect={() => go("/live-guard")}><Eye className="mr-2 h-4 w-4" /> Live Guard</CommandItem>
          <CommandItem onSelect={() => go("/pattern-investigator")}><GitBranch className="mr-2 h-4 w-4" /> Pattern Investigator</CommandItem>
          <CommandItem onSelect={() => go("/audit-intelligence")}><ScrollText className="mr-2 h-4 w-4" /> Audit Intelligence</CommandItem>
          <CommandItem onSelect={() => go("/settings")}><SettingsIcon className="mr-2 h-4 w-4" /> Settings</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => { setOpen(false); startReplay(); toast("Replay started"); }}>
            <PlayCircle className="mr-2 h-4 w-4" /> Replay NEET Mock 2026
          </CommandItem>
          <CommandItem onSelect={() => { setOpen(false); generate(); toast.success("Audit report generated"); navigate({ to: "/audit-intelligence" }); }}>
            <FileText className="mr-2 h-4 w-4" /> Generate audit report
          </CommandItem>
          <CommandItem onSelect={() => go("/identity-vault")}>
            <Sparkles className="mr-2 h-4 w-4" /> Launch enrolment
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Simulate">
          <CommandItem onSelect={() => sim("Phone detected", "Phone detected")}><Smartphone className="mr-2 h-4 w-4" /> Phone detected</CommandItem>
          <CommandItem onSelect={() => sim("Second person", "Second person")}><Users className="mr-2 h-4 w-4" /> Second person</CommandItem>
          <CommandItem onSelect={() => sim("Proxy attempt", "Proxy attempt")}><UserX className="mr-2 h-4 w-4" /> Proxy attempt</CommandItem>
          <CommandItem onSelect={() => sim("Leak cluster", "Leak cluster")}><GitBranch className="mr-2 h-4 w-4" /> Leak cluster</CommandItem>
          <CommandItem onSelect={() => sim("Suspicious gaze", "Suspicious gaze")}><Eye className="mr-2 h-4 w-4" /> Suspicious gaze</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

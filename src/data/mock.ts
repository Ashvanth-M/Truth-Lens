// TruthLens mock data — realistic Indian exam context
export type Severity = "info" | "low" | "medium" | "high" | "critical";
export type AnomalyKind =
  | "Phone detected"
  | "Second person"
  | "Suspicious gaze"
  | "Proxy attempt"
  | "Face mismatch"
  | "Voice anomaly"
  | "Leak cluster";

export interface Centre {
  id: string;
  name: string;
  city: string;
  state: string;
  // Approximate map coords on a 1000×1100 SVG of India
  x: number;
  y: number;
  capacity: number;
  online: number;
  risk: "calm" | "watch" | "elevated" | "critical";
}

export interface Anomaly {
  id: string;
  ts: string;
  centreId: string;
  studentId: string;
  kind: AnomalyKind;
  severity: Severity;
  confidence: number;
  reviewer?: string;
  note?: string;
  dismissed?: boolean;
}

export interface Session {
  id: string;
  studentId: string;
  studentName: string;
  centreId: string;
  status: "stable" | "watching" | "flagged";
  faceConfidence: number;
  gazeDrift: number;
  objects: string[];
  startedAt: string;
}

export interface ClusterNode {
  id: string;
  studentId: string;
  centreId: string;
  cluster: string | null;
  similarity: number;
}

export interface ClusterEdge {
  source: string;
  target: string;
  weight: number;
  flagged: boolean;
}

export const centres: Centre[] = [
  { id: "C-DEL-01", name: "Centre 01", city: "Delhi", state: "DL", x: 470, y: 320, capacity: 240, online: 238, risk: "watch" },
  { id: "C-MUM-07", name: "Centre 07", city: "Mumbai", state: "MH", x: 360, y: 660, capacity: 220, online: 217, risk: "critical" },
  { id: "C-BLR-12", name: "Centre 12", city: "Bengaluru", state: "KA", x: 470, y: 830, capacity: 200, online: 196, risk: "critical" },
  { id: "C-CHN-18", name: "Centre 18", city: "Chennai", state: "TN", x: 540, y: 870, capacity: 180, online: 178, risk: "elevated" },
  { id: "C-HYD-23", name: "Centre 23", city: "Hyderabad", state: "TG", x: 490, y: 740, capacity: 190, online: 188, risk: "watch" },
  { id: "C-KOL-31", name: "Centre 31", city: "Kolkata", state: "WB", x: 720, y: 510, capacity: 210, online: 205, risk: "calm" },
  { id: "C-PUN-04", name: "Centre 04", city: "Pune", state: "MH", x: 390, y: 660, capacity: 160, online: 159, risk: "calm" },
  { id: "C-JAI-09", name: "Centre 09", city: "Jaipur", state: "RJ", x: 400, y: 400, capacity: 150, online: 148, risk: "calm" },
  { id: "C-LKO-15", name: "Centre 15", city: "Lucknow", state: "UP", x: 555, y: 410, capacity: 170, online: 168, risk: "watch" },
  { id: "C-AHM-22", name: "Centre 22", city: "Ahmedabad", state: "GJ", x: 320, y: 540, capacity: 160, online: 158, risk: "calm" },
  { id: "C-CHD-27", name: "Centre 27", city: "Chandigarh", state: "CH", x: 460, y: 270, capacity: 130, online: 129, risk: "calm" },
  { id: "C-BHO-33", name: "Centre 33", city: "Bhopal", state: "MP", x: 470, y: 540, capacity: 140, online: 139, risk: "watch" },
  { id: "C-IND-19", name: "Centre 19", city: "Indore", state: "MP", x: 420, y: 540, capacity: 150, online: 149, risk: "calm" },
  { id: "C-PAT-29", name: "Centre 29", city: "Patna", state: "BR", x: 660, y: 450, capacity: 170, online: 168, risk: "watch" },
  { id: "C-GHY-36", name: "Centre 36", city: "Guwahati", state: "AS", x: 820, y: 460, capacity: 110, online: 109, risk: "calm" },
  { id: "C-KOC-25", name: "Centre 25", city: "Kochi", state: "KL", x: 460, y: 900, capacity: 120, online: 119, risk: "calm" },
  { id: "C-NAG-14", name: "Centre 14", city: "Nagpur", state: "MH", x: 500, y: 620, capacity: 130, online: 128, risk: "calm" },
  { id: "C-VAR-21", name: "Centre 21", city: "Varanasi", state: "UP", x: 610, y: 440, capacity: 140, online: 138, risk: "watch" },
  { id: "C-VIZ-26", name: "Centre 26", city: "Visakhapatnam", state: "AP", x: 590, y: 720, capacity: 130, online: 128, risk: "calm" },
  { id: "C-COI-30", name: "Centre 30", city: "Coimbatore", state: "TN", x: 480, y: 880, capacity: 120, online: 119, risk: "calm" },
];
// Pad to 38 centres with derived satellite ones
for (let i = centres.length; i < 38; i++) {
  const base = centres[i % 10];
  centres.push({
    id: `C-SAT-${String(i).padStart(2, "0")}`,
    name: `Centre ${i.toString().padStart(2, "0")}`,
    city: base.city,
    state: base.state,
    x: base.x + ((i * 17) % 40) - 20,
    y: base.y + ((i * 23) % 40) - 20,
    capacity: 100 + ((i * 7) % 80),
    online: 99 + ((i * 5) % 70),
    risk: "calm",
  });
}

const firstNames = ["Aarav","Diya","Vihaan","Ananya","Arjun","Saanvi","Ishaan","Myra","Kabir","Anika","Reyansh","Aadhya","Vivaan","Kiara","Aryan","Riya","Shaurya","Aditi","Krishna","Pari"];
const lastNames  = ["Sharma","Patel","Kumar","Singh","Reddy","Iyer","Gupta","Nair","Mehta","Joshi","Rao","Das","Bose","Menon","Pillai","Bhat","Kapoor","Verma","Jain","Shah"];

export function sampleStudentName(i: number) {
  return `${firstNames[i % firstNames.length]} ${lastNames[(i * 7) % lastNames.length]}`;
}

export const TOTAL_STUDENTS = 3000;
export const LIVE_SESSIONS = 143;

export const seedSessions: Session[] = Array.from({ length: 24 }).map((_, i) => {
  const score = [12, 8, 78, 22, 45, 91, 18, 33, 67, 14, 52, 88, 9, 28, 71, 19, 41, 7, 64, 35, 82, 16, 53, 24][i];
  const status: Session["status"] = score > 70 ? "flagged" : score > 40 ? "watching" : "stable";
  const centre = centres[i % centres.length];
  return {
    id: `S-${1000 + i}`,
    studentId: `NEET-2026-${(24000 + i).toString()}`,
    studentName: sampleStudentName(i),
    centreId: centre.id,
    status,
    faceConfidence: 99 - Math.round(score / 4),
    gazeDrift: Math.round(score * 0.6),
    objects: status === "flagged" ? (i % 2 === 0 ? ["mobile-phone"] : ["secondary-screen"]) : [],
    startedAt: "14:00",
  };
});

export const seedAnomalies: Anomaly[] = [
  { id: "A-1", ts: "15:02:11", centreId: "C-MUM-07", studentId: "NEET-2026-24007", kind: "Phone detected", severity: "critical", confidence: 92, note: "Rectangular device beside notebook" },
  { id: "A-2", ts: "15:01:48", centreId: "C-BLR-12", studentId: "NEET-2026-24012", kind: "Second person", severity: "high", confidence: 84, note: "Background motion detected for 4s" },
  { id: "A-3", ts: "15:00:31", centreId: "C-DEL-01", studentId: "NEET-2026-24003", kind: "Suspicious gaze", severity: "medium", confidence: 71 },
  { id: "A-4", ts: "14:58:09", centreId: "C-CHN-18", studentId: "NEET-2026-24015", kind: "Face mismatch", severity: "high", confidence: 83, reviewer: "R. Menon" },
  { id: "A-5", ts: "14:54:22", centreId: "C-HYD-23", studentId: "NEET-2026-24009", kind: "Voice anomaly", severity: "low", confidence: 38, dismissed: true, reviewer: "A. Iyer" },
  { id: "A-6", ts: "14:51:02", centreId: "C-MUM-07", studentId: "NEET-2026-24019", kind: "Suspicious gaze", severity: "medium", confidence: 56 },
  { id: "A-7", ts: "14:49:44", centreId: "C-BLR-12", studentId: "NEET-2026-24024", kind: "Phone detected", severity: "critical", confidence: 88 },
  { id: "A-8", ts: "14:47:18", centreId: "C-KOL-31", studentId: "NEET-2026-24031", kind: "Face mismatch", severity: "medium", confidence: 64 },
  { id: "A-9", ts: "14:43:55", centreId: "C-PAT-29", studentId: "NEET-2026-24029", kind: "Suspicious gaze", severity: "low", confidence: 42, dismissed: true },
  { id: "A-10", ts: "14:40:11", centreId: "C-JAI-09", studentId: "NEET-2026-24006", kind: "Second person", severity: "high", confidence: 76 },
  { id: "A-11", ts: "14:36:02", centreId: "C-LKO-15", studentId: "NEET-2026-24011", kind: "Phone detected", severity: "high", confidence: 79 },
  { id: "A-12", ts: "14:30:48", centreId: "C-AHM-22", studentId: "NEET-2026-24008", kind: "Voice anomaly", severity: "low", confidence: 33, dismissed: true },
];

// Collusion graph — 2 dense clusters + scattered background
export const clusterNodes: ClusterNode[] = [
  // Cluster Alpha — Mumbai Centre 07
  { id: "n1", studentId: "NEET-2026-24007", centreId: "C-MUM-07", cluster: "Alpha", similarity: 0.93 },
  { id: "n2", studentId: "NEET-2026-24019", centreId: "C-MUM-07", cluster: "Alpha", similarity: 0.91 },
  { id: "n3", studentId: "NEET-2026-24044", centreId: "C-MUM-07", cluster: "Alpha", similarity: 0.88 },
  { id: "n4", studentId: "NEET-2026-24051", centreId: "C-MUM-07", cluster: "Alpha", similarity: 0.85 },
  // Cluster Bravo — Bengaluru Centre 12
  { id: "n5", studentId: "NEET-2026-24012", centreId: "C-BLR-12", cluster: "Bravo", similarity: 0.87 },
  { id: "n6", studentId: "NEET-2026-24024", centreId: "C-BLR-12", cluster: "Bravo", similarity: 0.84 },
  { id: "n7", studentId: "NEET-2026-24061", centreId: "C-BLR-12", cluster: "Bravo", similarity: 0.82 },
  // Background
  { id: "n8", studentId: "NEET-2026-24002", centreId: "C-DEL-01", cluster: null, similarity: 0.21 },
  { id: "n9", studentId: "NEET-2026-24003", centreId: "C-DEL-01", cluster: null, similarity: 0.18 },
  { id: "n10", studentId: "NEET-2026-24015", centreId: "C-CHN-18", cluster: null, similarity: 0.25 },
  { id: "n11", studentId: "NEET-2026-24029", centreId: "C-PAT-29", cluster: null, similarity: 0.19 },
  { id: "n12", studentId: "NEET-2026-24008", centreId: "C-JAI-09", cluster: null, similarity: 0.22 },
  { id: "n13", studentId: "NEET-2026-24011", centreId: "C-LKO-15", cluster: null, similarity: 0.17 },
  { id: "n14", studentId: "NEET-2026-24033", centreId: "C-KOL-31", cluster: null, similarity: 0.20 },
  { id: "n15", studentId: "NEET-2026-24037", centreId: "C-HYD-23", cluster: null, similarity: 0.24 },
  { id: "n16", studentId: "NEET-2026-24042", centreId: "C-AHM-22", cluster: null, similarity: 0.16 },
  { id: "n17", studentId: "NEET-2026-24046", centreId: "C-NAG-14", cluster: null, similarity: 0.19 },
  { id: "n18", studentId: "NEET-2026-24053", centreId: "C-VAR-21", cluster: null, similarity: 0.23 },
  { id: "n19", studentId: "NEET-2026-24058", centreId: "C-IND-19", cluster: null, similarity: 0.18 },
  { id: "n20", studentId: "NEET-2026-24066", centreId: "C-COI-30", cluster: null, similarity: 0.21 },
];

export const clusterEdges: ClusterEdge[] = [
  { source: "n1", target: "n2", weight: 0.93, flagged: true },
  { source: "n1", target: "n3", weight: 0.88, flagged: true },
  { source: "n1", target: "n4", weight: 0.85, flagged: true },
  { source: "n2", target: "n3", weight: 0.90, flagged: true },
  { source: "n2", target: "n4", weight: 0.82, flagged: true },
  { source: "n3", target: "n4", weight: 0.87, flagged: true },
  { source: "n5", target: "n6", weight: 0.86, flagged: true },
  { source: "n5", target: "n7", weight: 0.83, flagged: true },
  { source: "n6", target: "n7", weight: 0.89, flagged: true },
  { source: "n8", target: "n9", weight: 0.31, flagged: false },
  { source: "n10", target: "n11", weight: 0.27, flagged: false },
  { source: "n12", target: "n13", weight: 0.25, flagged: false },
  { source: "n14", target: "n15", weight: 0.29, flagged: false },
  { source: "n16", target: "n17", weight: 0.24, flagged: false },
  { source: "n18", target: "n19", weight: 0.22, flagged: false },
  { source: "n19", target: "n20", weight: 0.20, flagged: false },
];

export const reviewQueue = [
  { id: "RQ-1", studentId: "NEET-2026-24007", centreId: "C-MUM-07", kind: "Phone detected", waited: "00:42", priority: "critical" },
  { id: "RQ-2", studentId: "NEET-2026-24012", centreId: "C-BLR-12", kind: "Second person", waited: "01:08", priority: "high" },
  { id: "RQ-3", studentId: "NEET-2026-24015", centreId: "C-CHN-18", kind: "Face mismatch", waited: "02:11", priority: "high" },
  { id: "RQ-4", studentId: "NEET-2026-24019", centreId: "C-MUM-07", kind: "Suspicious gaze", waited: "02:44", priority: "medium" },
  { id: "RQ-5", studentId: "NEET-2026-24024", centreId: "C-BLR-12", kind: "Phone detected", waited: "03:02", priority: "critical" },
];

export const auditFindings = [
  { id: "F-01", category: "Identity", finding: "0.04% face-match challenges flagged; 100% resolved within 90s.", severity: "info" as const },
  { id: "F-02", category: "Live Defence", finding: "12 anomalies surfaced; 9 confirmed, 3 dismissed by human reviewers.", severity: "low" as const },
  { id: "F-03", category: "Forensics", finding: "2 collusion clusters detected — Centres Mumbai 07 and Bengaluru 12.", severity: "high" as const },
  { id: "F-04", category: "Privacy", finding: "All biometric inference performed on-device. Zero raw biometrics persisted.", severity: "info" as const },
  { id: "F-05", category: "Fairness", finding: "Demographic parity Δ = 0.011 across cohorts — within DPDP tolerance.", severity: "info" as const },
];

export const anomalyTrend = [4,3,5,6,4,7,8,6,9,7,10,8,12,9,11,14,12,10,13,11,9,12,10,8];

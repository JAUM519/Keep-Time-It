import { collection, getDocs, query, Timestamp, where } from "firebase/firestore";
import { db } from "../config/firebase";

export type ReportRow = { roomName: string; itemName: string; totalMs: number };

export async function getReport(params: {
  homeId: string;
  from: Date;
  to: Date;
}): Promise<ReportRow[]> {
  const { homeId, from, to } = params;

  const fromTs = Timestamp.fromDate(from);
  const toTs = Timestamp.fromDate(to);

  const q = query(
    collection(db, "homes", homeId, "sessions"),
    where("endedAt", ">=", fromTs),
    where("endedAt", "<=", toTs)
  );

  const snap = await getDocs(q);

  const map = new Map<string, ReportRow>();

  snap.docs.forEach((d) => {
    const s = d.data() as any;
    const key = `${s.roomName}|||${s.itemName}`;
    const prev = map.get(key);
    const dur = Number(s.durationMs ?? 0);

    if (!prev) map.set(key, { roomName: String(s.roomName), itemName: String(s.itemName), totalMs: dur });
    else prev.totalMs += dur;
  });

  return Array.from(map.values()).sort((a, b) => {
    const r = a.roomName.localeCompare(b.roomName);
    if (r !== 0) return r;
    return a.itemName.localeCompare(b.itemName);
  });
}

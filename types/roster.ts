export type ShiftType = "D" | "N" | "OFF" | "C";

export interface ShiftDay {
  date: string;
  shift: string;
}

export interface OperatorRoster {
  operator: string;
  unit: string;
  period: string;
  roster: ShiftDay[];
}

export const SHIFT_LABELS: Record<string, string> = {
  D: "Shift Siang",
  N: "Shift Malam",
  OFF: "Off",
  C: "Cuti",
};

export function getShiftCategory(shift: string): ShiftType {
  if (shift.startsWith("D")) return "D";
  if (shift.startsWith("N")) return "N";
  if (shift === "OFF") return "OFF";
  return "C";
}

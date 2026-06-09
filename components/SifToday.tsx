"use client";

import { useMemo } from "react";
import { OperatorRoster } from "@/types/roster";

function getTodayMakassar(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Makassar",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  return `${y}-${m}-${d}`;
}

function getShiftBaseType(shift: string): "D" | "N" | "OFF" | "C" {
  if (shift.startsWith("D")) return "D";
  if (shift.startsWith("N")) return "N";
  if (shift === "OFF") return "OFF";
  return "C";
}

function formatDateShort(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  return `${parseInt(d)}/${parseInt(m)}/${y}`;
}

export default function SifToday({ data }: { data: OperatorRoster[] }) {
  const today = getTodayMakassar();

  const sifGroups = useMemo(() => {
    const sif1: OperatorRoster[] = []; // D = Siang
    const sif2: OperatorRoster[] = []; // N = Malam
    const off: OperatorRoster[] = [];
    const cuti: OperatorRoster[] = [];

    data.forEach((op) => {
      const todayEntry = op.roster.find((r) => r.date === today);
      if (todayEntry) {
        const type = getShiftBaseType(todayEntry.shift);
        if (type === "D") sif1.push(op);
        else if (type === "N") sif2.push(op);
        else if (type === "OFF") off.push(op);
        else cuti.push(op);
      }
    });

    return { sif1, sif2, off, cuti, today };
  }, [data, today]);

  return (
    <div className="roster-card p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Hari Ini</h2>
          <p className="text-lg font-medium text-slate-900 tracking-tight">{formatDateShort(today)}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* SIF 1 - Shift Siang */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Shift 1 — Siang</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">
            {sifGroups.sif1.length} personil
          </span>
        </div>
        {sifGroups.sif1.length > 0 ? (
          <div className="space-y-2">
            {sifGroups.sif1.map((op) => {
              const shiftToday = op.roster.find((r) => r.date === today)?.shift || "";
              return (
                <div key={op.operator} className="flex items-center justify-between p-3 rounded-xl bg-yellow-50/50 border border-yellow-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-white font-bold text-xs">
                      {op.operator.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-900">{op.operator}</div>
                      <div className="text-[11px] text-slate-500">{op.unit}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-yellow-700 px-2 py-1 rounded-lg bg-yellow-100">
                    {shiftToday}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-3 px-3 bg-slate-50 rounded-xl">Tidak ada personil</p>
        )}
      </div>

      {/* SIF 2 - Shift Malam */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Shift 2 — Malam</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
            {sifGroups.sif2.length} personil
          </span>
        </div>
        {sifGroups.sif2.length > 0 ? (
          <div className="space-y-2">
            {sifGroups.sif2.map((op) => {
              const shiftToday = op.roster.find((r) => r.date === today)?.shift || "";
              return (
                <div key={op.operator} className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-white font-bold text-xs">
                      {op.operator.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-900">{op.operator}</div>
                      <div className="text-[11px] text-slate-500">{op.unit}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-700 px-2 py-1 rounded-lg bg-blue-100">
                    {shiftToday}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-3 px-3 bg-slate-50 rounded-xl">Tidak ada personil</p>
        )}
      </div>

      {/* OFF & Cuti */}
      {(sifGroups.off.length > 0 || sifGroups.cuti.length > 0) && (
        <div className="pt-3 border-t border-slate-100">
          <div className="flex flex-wrap gap-2">
            {sifGroups.off.map((op) => (
              <span key={op.operator} className="text-[10px] px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium">
                {op.operator} — Off
              </span>
            ))}
            {sifGroups.cuti.map((op) => (
              <span key={op.operator} className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                {op.operator} — Cuti
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

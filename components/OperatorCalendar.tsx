"use client";

import { useMemo } from "react";

interface ShiftDay {
  date: string;
  shift: string;
}

interface OperatorRoster {
  operator: string;
  unit: string;
  period: string;
  roster: ShiftDay[];
}

const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function getShiftCategory(shift: string): "D" | "N" | "OFF" | "C" {
  if (shift.startsWith("D")) return "D";
  if (shift.startsWith("N")) return "N";
  if (shift === "OFF") return "OFF";
  return "C";
}

const SHIFT_BG: Record<string, string> = {
  D: "bg-yellow-300/70 text-yellow-900",
  N: "bg-blue-500 text-white",
  OFF: "bg-red-500 text-white",
  C: "bg-gray-500 text-white",
};

const SHIFT_BORDER: Record<string, string> = {
  D: "border-yellow-400",
  N: "border-blue-600",
  OFF: "border-red-600",
  C: "border-gray-600",
};

export default function OperatorCalendar({ data }: { data: OperatorRoster }) {
  const today = "2026-06-08";

  const shiftMap = useMemo(() => {
    const map = new Map<string, ShiftDay>();
    data.roster.forEach((d) => map.set(d.date, d));
    return map;
  }, [data.roster]);

  const stats = useMemo(() => {
    let d = 0, n = 0, off = 0, c = 0;
    data.roster.forEach((day) => {
      const cat = getShiftCategory(day.shift);
      if (cat === "D") d++;
      else if (cat === "N") n++;
      else if (cat === "OFF") off++;
      else c++;
    });
    return { d, n, off, c, total: data.roster.length };
  }, [data.roster]);

  // Build calendar grid for June 2026 (1 June = Monday)
  const calendarDays = useMemo(() => {
    const days: { date: string | null; shift: string | null }[] = [];
    // 1 June 2026 = Monday, so no padding needed
    for (let day = 1; day <= 30; day++) {
      const dateStr = `2026-06-${String(day).padStart(2, "0")}`;
      const shiftData = shiftMap.get(dateStr);
      days.push({
        date: dateStr,
        shift: shiftData ? shiftData.shift : null,
      });
    }
    return days;
  }, [shiftMap]);

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
            {data.operator.charAt(0)}
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{data.operator}</h1>
            <p className="text-xs text-gray-500">{data.unit} &middot; {data.period}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        <StatBox label="Siang" value={stats.d} color="bg-yellow-300/70 text-yellow-900" />
        <StatBox label="Malam" value={stats.n} color="bg-blue-500 text-white" />
        <StatBox label="Off" value={stats.off} color="bg-red-500 text-white" />
        <StatBox label="Cuti" value={stats.c} color="bg-gray-500 text-white" />
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold text-gray-400 uppercase py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, idx) => {
            if (!day.date) {
              return <div key={idx} className="aspect-square" />;
            }
            const dayNum = parseInt(day.date.split("-")[2]);
            const isToday = day.date === today;
            const cat = day.shift ? getShiftCategory(day.shift) : null;
            const bgClass = cat ? SHIFT_BG[cat] : "bg-gray-50 text-gray-300";
            const borderClass = cat ? SHIFT_BORDER[cat] : "border-transparent";

            return (
              <div
                key={day.date}
                className={`
                  aspect-square rounded-lg border-2 flex flex-col items-center justify-center text-xs font-bold
                  ${bgClass} ${borderClass}
                  ${isToday ? "ring-2 ring-offset-1 ring-gray-900" : ""}
                `}
              >
                <span className="text-[10px] opacity-70">{dayNum}</span>
                {day.shift ? (
                  <span className="text-sm">{day.shift}</span>
                ) : (
                  <span className="text-xs">-</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Keterangan Shift</h3>
        <div className="grid grid-cols-2 gap-2">
          <LegendItem label="Shift Siang (D)" className="bg-yellow-300/70 text-yellow-900" />
          <LegendItem label="Shift Malam (N)" className="bg-blue-500 text-white" />
          <LegendItem label="Off" className="bg-red-500 text-white" />
          <LegendItem label="Cuti (C)" className="bg-gray-500 text-white" />
        </div>
      </div>

      {/* Today's Detail */}
      {shiftMap.has(today) && (
        <div className="mt-4 p-4 bg-gray-900 text-white rounded-2xl">
          <p className="text-xs text-gray-400 mb-1">Hari Ini — 8 Juni 2026</p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">{shiftMap.get(today)!.shift}</span>
            <span className="text-sm px-2 py-1 rounded bg-white/10">
              {getShiftCategory(shiftMap.get(today)!.shift) === "D"
                ? "Shift Siang"
                : getShiftCategory(shiftMap.get(today)!.shift) === "N"
                ? "Shift Malam"
                : getShiftCategory(shiftMap.get(today)!.shift) === "OFF"
                ? "Off"
                : "Cuti"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`rounded-xl p-2 text-center ${color}`}>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-[10px] opacity-80">{label}</div>
    </div>
  );
}

function LegendItem({ label, className }: { label: string; className: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded ${className} border border-black/5 shrink-0`} />
      <span className="text-xs text-gray-600">{label}</span>
    </div>
  );
}

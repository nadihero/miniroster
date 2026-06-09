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
  D: "bg-yellow-300/80 text-yellow-900 shadow-yellow-300/30",
  N: "bg-blue-400/80 text-white shadow-blue-400/30",
  OFF: "bg-red-400/80 text-white shadow-red-400/30",
  C: "bg-gray-400/80 text-white shadow-gray-400/30",
};

const SHIFT_BORDER: Record<string, string> = {
  D: "border-yellow-400/50",
  N: "border-blue-400/50",
  OFF: "border-red-400/50",
  C: "border-gray-400/50",
};

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

function formatDateId(dateStr: string): string {
  const [y, m, d] = dateStr.split("-");
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

export default function OperatorCalendar({ data }: { data: OperatorRoster }) {
  const today = getTodayMakassar();

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

  const calendarDays = useMemo(() => {
    const days: { date: string | null; shift: string | null }[] = [];
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
      <div className="glass-strong rounded-2xl p-5 mb-5 shadow-xl shadow-black/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center text-white font-bold text-lg shadow-lg border border-white/20">
            {data.operator.charAt(0)}
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">{data.operator}</h1>
            <p className="text-xs text-white/60">{data.unit} &middot; {data.period}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        <StatBox label="Siang" value={stats.d} gradient="from-yellow-300/40 to-yellow-400/20" />
        <StatBox label="Malam" value={stats.n} gradient="from-blue-400/40 to-blue-500/20" />
        <StatBox label="Off" value={stats.off} gradient="from-red-400/40 to-red-500/20" />
        <StatBox label="Cuti" value={stats.c} gradient="from-gray-400/40 to-gray-500/20" />
      </div>

      {/* Calendar Grid */}
      <div className="glass-strong rounded-3xl shadow-xl shadow-black/10 p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1.5 mb-3">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-bold text-white/50 uppercase py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map((day, idx) => {
            if (!day.date) {
              return <div key={idx} className="aspect-square" />;
            }
            const dayNum = parseInt(day.date.split("-")[2]);
            const isToday = day.date === today;
            const cat = day.shift ? getShiftCategory(day.shift) : null;
            const bgClass = cat ? `${SHIFT_BG[cat]} shadow-lg` : "bg-white/5 text-white/30";
            const borderClass = cat ? SHIFT_BORDER[cat] : "border-transparent";

            return (
              <div
                key={day.date}
                className={`
                  aspect-square rounded-xl border flex flex-col items-center justify-center text-xs font-bold
                  ${bgClass} ${borderClass}
                  ${isToday ? "ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110 z-10" : ""}
                `}
              >
                <span className="text-[9px] opacity-70 font-normal">{dayNum}</span>
                {day.shift ? (
                  <span className="text-[11px] font-bold">{day.shift}</span>
                ) : (
                  <span className="text-[10px]">-</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 glass rounded-2xl p-4 border border-white/10">
        <h3 className="text-[10px] font-bold text-white/50 uppercase mb-3 tracking-wider">Keterangan Shift</h3>
        <div className="grid grid-cols-2 gap-2">
          <LegendItem label="Shift Siang (D)" className="bg-yellow-300/70 text-yellow-900" />
          <LegendItem label="Shift Malam (N)" className="bg-blue-400/70 text-white" />
          <LegendItem label="Off" className="bg-red-400/70 text-white" />
          <LegendItem label="Cuti (C)" className="bg-gray-400/70 text-white" />
        </div>
      </div>

      {/* Today's Detail */}
      {shiftMap.has(today) && (
        <div className="mt-4 glass-dark rounded-2xl p-5 border border-white/10">
          <p className="text-[10px] text-white/40 mb-2 uppercase tracking-wider font-bold">Hari Ini — {formatDateId(today)}</p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-2xl text-white">{shiftMap.get(today)!.shift}</span>
            <span className="text-sm px-4 py-2 rounded-xl glass border border-white/20 font-bold">
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
  gradient,
}: {
  label: string;
  value: number;
  gradient: string;
}) {
  return (
    <div className={`rounded-2xl p-3 text-center bg-gradient-to-br ${gradient} border border-white/20 shadow-lg shadow-black/5`}>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-[10px] text-white/70 font-medium">{label}</div>
    </div>
  );
}

function LegendItem({ label, className }: { label: string; className: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3.5 h-3.5 rounded-md ${className} shadow-sm`} />
      <span className="text-[11px] text-white/70">{label}</span>
    </div>
  );
}

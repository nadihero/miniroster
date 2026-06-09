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
    <div className="space-y-5">
      {/* Header Card */}
      <div className="roster-card p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-950 flex items-center justify-center text-white font-bold text-xl tracking-tight">
            {data.operator.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-medium text-slate-900 tracking-tight">{data.operator}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{data.unit} &middot; {data.period}</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        <StatBox label="Siang" value={stats.d} variant="siang" />
        <StatBox label="Malam" value={stats.n} variant="malam" />
        <StatBox label="Off" value={stats.off} variant="off" />
        <StatBox label="Cuti" value={stats.c} variant="cuti" />
      </div>

      {/* Calendar Grid */}
      <div className="roster-card p-6">
        {/* Month header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-slate-900 tracking-tight">Juni 2026</h2>
          <span className="text-xs text-slate-400 font-medium">{stats.total} hari</span>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[10px] font-medium text-slate-400 uppercase py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, idx) => {
            const dayNum = parseInt(day.date!.split("-")[2]);
            const isToday = day.date === today;
            const cat = day.shift ? getShiftCategory(day.shift) : null;
            
            return (
              <div
                key={day.date}
                className={`
                  aspect-square rounded-2xl flex flex-col items-center justify-center text-xs font-medium
                  ${isToday 
                    ? "today-highlight" 
                    : ""
                  }
                  ${cat === "D" ? "shift-siang" : ""}
                  ${cat === "N" ? "shift-malam" : ""}
                  ${cat === "OFF" ? "shift-off" : ""}
                  ${cat === "C" ? "shift-cuti" : ""}
                  ${!cat ? "bg-slate-50 text-slate-300 border border-slate-100" : ""}
                `}
              >
                <span className={`text-[9px] font-normal ${cat ? "opacity-60" : "opacity-40"}`}>
                  {dayNum}
                </span>
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
      <div className="roster-card p-5">
        <h3 className="text-[10px] font-medium text-slate-400 uppercase mb-3 tracking-wider">Keterangan</h3>
        <div className="grid grid-cols-2 gap-3">
          <LegendItem label="Shift Siang (D)" className="shift-siang" />
          <LegendItem label="Shift Malam (N)" className="shift-malam" />
          <LegendItem label="Off" className="shift-off" />
          <LegendItem label="Cuti (C)" className="shift-cuti" />
        </div>
      </div>

      {/* Today's Detail */}
      {shiftMap.has(today) && (
        <div className="roster-card p-6 border-slate-950/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                Hari Ini — {formatDateId(today)}
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-medium text-slate-900 tracking-tight">
                  {shiftMap.get(today)!.shift}
                </span>
              </div>
            </div>
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-slate-950 text-white">
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
  variant,
}: {
  label: string;
  value: number;
  variant: "siang" | "malam" | "off" | "cuti";
}) {
  const variants = {
    siang: "shift-siang",
    malam: "shift-malam",
    off: "shift-off",
    cuti: "shift-cuti",
  };

  return (
    <div className={`rounded-2xl p-3 text-center ${variants[variant]}`}>
      <div className="text-2xl font-medium text-slate-900 tracking-tight">{value}</div>
      <div className="text-[10px] font-medium text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}

function LegendItem({ label, className }: { label: string; className: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${className}`} />
      <span className="text-xs text-slate-600">{label}</span>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRosterData } from "@/hooks/useRosterData";
import OperatorCalendar from "@/components/OperatorCalendar";

export default function Home() {
  const { data, loaded, getByName } = useRosterData();
  const [selectedName, setSelectedName] = useState("");
  const [showing, setShowing] = useState(false);

  const selectedData = selectedName ? getByName(selectedName) : null;

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400 text-sm font-medium animate-pulse tracking-tight">
          Memuat data...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Particle clusters - left side decorative */}
      <div className="particle-cluster left-[-10%] top-[15%] w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/8 via-purple-500/8 to-red-500/4 blur-3xl rounded-full" />
      <div className="particle-cluster left-[5%] bottom-[10%] w-[300px] h-[300px] bg-gradient-to-br from-blue-400/6 via-purple-400/6 to-transparent blur-3xl rounded-full" />
      <div className="particle-cluster right-[-5%] top-[30%] w-[400px] h-[400px] bg-gradient-to-bl from-red-500/5 via-purple-500/5 to-transparent blur-3xl rounded-full" />

      {/* Header - minimal */}
      <header className="relative z-10 px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-800 tracking-tight">Roster Viewer</span>
          </div>
          <Link
            href="/edit"
            className="pill-btn pill-secondary text-xs"
          >
            Edit Data
          </Link>
        </div>
      </header>

      {/* Main content - centered */}
      <main className="relative z-10 px-6 py-12">
        {!showing || !selectedData ? (
          <div className="max-w-lg mx-auto text-center">
            {/* Hero text */}
            <div className="mb-16">
              <h1 className="text-4xl sm:text-5xl font-medium text-slate-900 tracking-tight mb-4 leading-tight">
                Pilih operator
              </h1>
              <p className="text-base text-slate-500 font-normal tracking-tight">
                {data.length > 0
                  ? `${data.length} operator tersedia untuk bulan ini`
                  : "Belum ada data. Klik Edit Data untuk menambah."}
              </p>
            </div>

            {/* Selector */}
            {data.length > 0 && (
              <div className="space-y-4 max-w-sm mx-auto">
                <div className="relative">
                  <select
                    value={selectedName}
                    onChange={(e) => setSelectedName(e.target.value)}
                    className="w-full px-6 py-4 rounded-full bg-white border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="">Pilih nama operator</option>
                    {data.map((op) => (
                      <option key={op.operator} value={op.operator}>
                        {op.operator} ({op.unit})
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <button
                  onClick={() => selectedName && setShowing(true)}
                  disabled={!selectedName}
                  className="pill-btn pill-primary w-full disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Tampilkan Roster
                </button>
              </div>
            )}

            {data.length === 0 && (
              <Link
                href="/edit"
                className="pill-btn pill-primary inline-block"
              >
                + Tambah Data Roster
              </Link>
            )}
          </div>
        ) : (
          /* Roster View */
          <div className="max-w-lg mx-auto">
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowing(false);
                  setSelectedName("");
                }}
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Kembali
              </button>
            </div>
            <OperatorCalendar data={selectedData} />
          </div>
        )}
      </main>
    </div>
  );
}

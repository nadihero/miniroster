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
        <div className="glass-strong rounded-2xl px-8 py-6 animate-pulse">
          <span className="text-white/80 text-sm font-medium">Memuat data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Decorative floating elements */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-float" />
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl animate-float-delayed" />
      <div className="fixed top-1/2 left-1/3 w-24 h-24 bg-pink-300/15 rounded-full blur-2xl animate-float" />

      {/* Header Bar */}
      <div className="relative z-10 glass-strong border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-tight">Roster Viewer</h1>
              <p className="text-xs text-white/60">Tim Tambang</p>
            </div>
          </div>
          <Link
            href="/edit"
            className="glass px-4 py-2 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/25 transition-all"
          >
            Edit Data
          </Link>
        </div>
      </div>

      {/* Selector */}
      {!showing || !selectedData ? (
        <div className="relative z-10 max-w-lg mx-auto px-4 py-12">
          <div className="glass-strong rounded-3xl shadow-2xl shadow-black/20 p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-white/30 to-white/10 flex items-center justify-center shadow-lg shadow-white/10">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 text-shadow">Pilih Operator</h2>
            <p className="text-sm text-white/70 mb-8">
              {data.length > 0
                ? `${data.length} operator tersedia`
                : "Belum ada data. Klik Edit Data untuk menambah."}
            </p>

            {data.length > 0 && (
              <div className="space-y-4">
                <div className="relative">
                  <select
                    value={selectedName}
                    onChange={(e) => setSelectedName(e.target.value)}
                    className="glass-input w-full px-4 py-4 rounded-xl text-white text-sm appearance-none cursor-pointer"
                  >
                    <option value="" className="text-gray-800">-- Pilih nama operator --</option>
                    {data.map((op) => (
                      <option key={op.operator} value={op.operator} className="text-gray-800">
                        {op.operator} ({op.unit})
                      </option>
                    ))}
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                <button
                  onClick={() => selectedName && setShowing(true)}
                  disabled={!selectedName}
                  className="w-full py-4 bg-white/20 hover:bg-white/30 text-white text-sm font-bold rounded-xl transition-all border border-white/30 hover:border-white/50 shadow-lg shadow-black/10 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Tampilkan Roster
                </button>
              </div>
            )}

            {data.length === 0 && (
              <Link
                href="/edit"
                className="inline-block px-6 py-3 bg-white/20 hover:bg-white/30 text-white text-sm font-bold rounded-xl transition-all border border-white/30"
              >
                + Tambah Data Roster
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* Roster View */
        <div className="relative z-10">
          <div className="max-w-lg mx-auto px-4 pt-4">
            <button
              onClick={() => {
                setShowing(false);
                setSelectedName("");
              }}
              className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white transition-colors mb-2 glass px-3 py-2 rounded-xl"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Pilih operator lain
            </button>
          </div>
          <OperatorCalendar data={selectedData} />
        </div>
      )}
    </div>
  );
}

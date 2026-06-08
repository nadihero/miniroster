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
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Memuat data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-bold text-gray-900">Roster Viewer</h1>
          <Link
            href="/edit"
            className="text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            Edit Data
          </Link>
        </div>
      </div>

      {/* Selector */}
      {!showing || !selectedData ? (
        <div className="max-w-lg mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
            <div className="w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Pilih Operator</h2>
            <p className="text-sm text-gray-500 mb-6">
              {data.length > 0
                ? `${data.length} operator tersedia`
                : "Belum ada data. Klik Edit Data untuk menambah."}
            </p>

            {data.length > 0 && (
              <div className="space-y-3">
                <select
                  value={selectedName}
                  onChange={(e) => setSelectedName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">-- Pilih nama --</option>
                  {data.map((op) => (
                    <option key={op.operator} value={op.operator}>
                      {op.operator} ({op.unit})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => selectedName && setShowing(true)}
                  disabled={!selectedName}
                  className="w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Tampilkan Roster
                </button>
              </div>
            )}

            {data.length === 0 && (
              <Link
                href="/edit"
                className="inline-block px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors"
              >
                + Tambah Data Roster
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* Roster View */
        <div>
          <div className="max-w-lg mx-auto px-4 pt-4">
            <button
              onClick={() => {
                setShowing(false);
                setSelectedName("");
              }}
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors mb-2"
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

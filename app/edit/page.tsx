"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { OperatorRoster } from "@/types/roster";
import { useRosterData } from "@/hooks/useRosterData";

export default function EditPage() {
  const { data, loaded, save, removeOperator } = useRosterData();
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState("");
  const [savedOk, setSavedOk] = useState(false);

  useEffect(() => {
    if (loaded) {
      setJsonText(JSON.stringify(data, null, 2));
    }
  }, [loaded, data]);

  const handleChange = (val: string) => {
    setJsonText(val);
    setError("");
    setSavedOk(false);
  };

  const validate = (): OperatorRoster[] | null => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        setError("JSON harus berupa array");
        return null;
      }
      for (const item of parsed) {
        if (!item.operator || !item.unit || !item.period || !Array.isArray(item.roster)) {
          setError(`Struktur invalid di operator: ${item.operator || "?"}`);
          return null;
        }
      }
      return parsed;
    } catch (e) {
      setError("JSON tidak valid: " + (e as Error).message);
      return null;
    }
  };

  const handleSave = () => {
    const parsed = validate();
    if (parsed) {
      save(parsed);
      setSavedOk(true);
      setTimeout(() => setSavedOk(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roster-db.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (confirm("Reset ke data default? Perubahan lokal akan hilang.")) {
      localStorage.removeItem("roster-db");
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen">
      {/* Decorative floating elements */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-float" />
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl animate-float-delayed" />

      {/* Header */}
      <div className="relative z-10 glass-strong border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">Edit Data Roster</h1>
              <p className="text-xs text-white/60">JSON Editor</p>
            </div>
          </div>
          <Link
            href="/"
            className="glass px-4 py-2 rounded-xl text-xs font-medium text-white/80 hover:text-white hover:bg-white/25 transition-all"
          >
            Kembali
          </Link>
        </div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">
        {/* Info Card */}
        <div className="glass rounded-2xl p-4 mb-4 border border-white/10">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-white/60 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-white/70 leading-relaxed">
              Masukkan JSON array operator. Format: <code className="bg-white/20 px-1.5 py-0.5 rounded text-white/90 text-[10px]">operator, unit, period, roster[]</code> dengan <code className="bg-white/20 px-1.5 py-0.5 rounded text-white/90 text-[10px]">date, shift</code>
            </p>
          </div>
        </div>

        {/* Textarea */}
        <div className="glass-strong rounded-2xl p-4 mb-3 shadow-xl shadow-black/10">
          <textarea
            value={jsonText}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full h-80 p-4 rounded-xl bg-black/20 text-xs font-mono text-white/90 placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 border border-white/10 resize-none"
            spellCheck={false}
          />
        </div>

        {/* Error / Success */}
        {error && (
          <div className="mb-3 p-4 glass rounded-xl border border-red-400/30 text-xs text-red-200">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {savedOk && (
          <div className="mb-3 p-4 glass rounded-xl border border-green-400/30 text-xs text-green-200">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Data berhasil disimpan!
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={handleSave}
            className="px-5 py-3 bg-white/20 hover:bg-white/30 text-white text-sm font-bold rounded-xl transition-all border border-white/30 shadow-lg shadow-black/10"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Simpan
            </div>
          </button>
          <button
            onClick={handleDownload}
            className="px-5 py-3 glass hover:bg-white/20 text-white/90 text-sm font-medium rounded-xl transition-all border border-white/20"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download JSON
            </div>
          </button>
          <button
            onClick={handleReset}
            className="px-5 py-3 glass hover:bg-red-500/20 text-red-200 text-sm font-medium rounded-xl transition-all border border-red-400/20"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Default
            </div>
          </button>
        </div>

        {/* Operators List */}
        <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Operator Tersimpan ({data.length})
        </h2>
        <div className="space-y-2">
          {data.map((op) => (
            <div
              key={op.operator}
              className="glass rounded-xl px-4 py-3 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                    {op.operator.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">{op.operator}</div>
                    <div className="text-[11px] text-white/50">
                      {op.unit} &middot; {op.period} &middot; {op.roster.length} hari
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm(`Hapus ${op.operator}?`)) removeOperator(op.operator);
                  }}
                  className="text-xs text-white/50 hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-all"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
    <div className="relative min-h-screen">
      {/* Particle clusters */}
      <div className="particle-cluster left-[-10%] top-[15%] w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/8 via-purple-500/8 to-red-500/4 blur-3xl rounded-full" />
      <div className="particle-cluster right-[-5%] bottom-[10%] w-[400px] h-[400px] bg-gradient-to-bl from-blue-400/6 via-purple-400/6 to-transparent blur-3xl rounded-full" />

      {/* Header */}
      <header className="relative z-10 px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-800 tracking-tight">Edit Data</span>
          </div>
          <Link
            href="/"
            className="pill-btn pill-secondary text-xs"
          >
            Kembali
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-6">
        {/* Info */}
        <div className="roster-card p-5 mb-5">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-slate-600 leading-relaxed">
              Masukkan JSON array operator. Format: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs text-slate-700 font-mono">operator, unit, period, roster[]</code> dengan <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs text-slate-700 font-mono">date, shift</code>
            </p>
          </div>
        </div>

        {/* Textarea */}
        <div className="roster-card p-5 mb-4">
          <textarea
            value={jsonText}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full h-72 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 resize-none"
            spellCheck={false}
          />
        </div>

        {/* Error / Success */}
        {error && (
          <div className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {savedOk && (
          <div className="mb-4 p-4 rounded-2xl bg-green-50 border border-green-200 text-xs text-green-700">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Data berhasil disimpan!
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button onClick={handleSave} className="pill-btn pill-primary">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Simpan
            </div>
          </button>
          <button onClick={handleDownload} className="pill-btn pill-secondary">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </div>
          </button>
          <button onClick={handleReset} className="pill-btn pill-secondary text-red-600 hover:bg-red-50 hover:border-red-200">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </div>
          </button>
        </div>

        {/* Operators List */}
        <h2 className="text-sm font-medium text-slate-800 mb-4 tracking-tight flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Operator Tersimpan ({data.length})
        </h2>
        <div className="space-y-2">
          {data.map((op) => (
            <div
              key={op.operator}
              className="roster-card p-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-950 flex items-center justify-center text-white font-bold text-sm">
                    {op.operator.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-slate-900">{op.operator}</div>
                    <div className="text-[11px] text-slate-500">
                      {op.unit} &middot; {op.period} &middot; {op.roster.length} hari
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm(`Hapus ${op.operator}?`)) removeOperator(op.operator);
                  }}
                  className="text-xs text-slate-400 hover:text-red-600 px-3 py-1.5 rounded-full hover:bg-red-50 transition-all"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

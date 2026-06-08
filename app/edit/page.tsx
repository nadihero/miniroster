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
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Edit Data Roster</h1>
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          Kembali
        </Link>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
        <p className="text-xs text-blue-700">
          Masukkan JSON array operator. Format per operator:
          {" "}
          <code className="bg-blue-100 px-1 rounded">
            operator, unit, period, roster[] {"{date, shift}"}
          </code>
        </p>
      </div>

      <textarea
        value={jsonText}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full h-80 p-3 rounded-xl border border-gray-200 bg-gray-50 font-mono text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
        spellCheck={false}
      />

      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
          {error}
        </div>
      )}

      {savedOk && (
        <div className="mb-3 p-3 bg-green-50 border border-green-100 rounded-lg text-xs text-green-600">
          Data berhasil disimpan!
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors"
        >
          Simpan
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          Download JSON
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-white border border-gray-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors"
        >
          Reset Default
        </button>
      </div>

      <h2 className="text-sm font-bold text-gray-900 mb-3">Operator Tersimpan ({data.length})</h2>
      <div className="space-y-2">
        {data.map((op) => (
          <div
            key={op.operator}
            className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3"
          >
            <div>
              <div className="font-semibold text-sm text-gray-900">{op.operator}</div>
              <div className="text-xs text-gray-500">
                {op.unit} &middot; {op.period} &middot; {op.roster.length} hari
              </div>
            </div>
            <button
              onClick={() => {
                if (confirm(`Hapus ${op.operator}?`)) removeOperator(op.operator);
              }}
              className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

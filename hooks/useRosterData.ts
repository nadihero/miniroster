"use client";

import { useState, useEffect, useCallback } from "react";
import { OperatorRoster } from "@/types/roster";
import defaultData from "@/data/roster-db.json";

const STORAGE_KEY = "roster-db";

export function useRosterData() {
  const [data, setData] = useState<OperatorRoster[]>(defaultData as OperatorRoster[]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setData(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const save = useCallback(
    (newData: OperatorRoster[]) => {
      setData(newData);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      } catch {
        // storage full or unavailable
      }
    },
    []
  );

  const addOperator = useCallback(
    (operator: OperatorRoster) => {
      const filtered = data.filter((d) => d.operator !== operator.operator);
      save([...filtered, operator]);
    },
    [data, save]
  );

  const removeOperator = useCallback(
    (name: string) => {
      save(data.filter((d) => d.operator !== name));
    },
    [data, save]
  );

  const getByName = useCallback(
    (name: string) => data.find((d) => d.operator === name) || null,
    [data]
  );

  return { data, loaded, save, addOperator, removeOperator, getByName };
}

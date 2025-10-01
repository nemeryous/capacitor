import { useState, useEffect } from "react";

const LS_ATTENDANCE = "attendance";

export default function useQRAttendance() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(LS_ATTENDANCE);
    if (saved) setRecords(JSON.parse(saved));
  }, []);

  const persist = (next) => {
    localStorage.setItem(LS_ATTENDANCE, JSON.stringify(next));
    setRecords(next);
  };

  const addRecord = (studentId) => {
    if (records.some((r) => r.studentId === studentId)) {
      console.warn(`Student ${studentId} already checked in.`);
      return false;
    }
    const rec = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      studentId,
      timestamp: Date.now(),
    };
    persist([rec, ...records]);
    return true;
  };

  const reset = () => persist([]);

  return { records, addRecord, reset };
}

export default function exportToCSV(records) {
  if (!records || records.length === 0) {
    alert("No records to export.");
    return;
  }

  const headers = "Student ID,Date,Time\n";
  const rows = records
    .map((r) => {
      const d = new Date(r.timestamp);
      return `${
        r.studentId
      },${d.toLocaleDateString()},${d.toLocaleTimeString()}`;
    })
    .join("\n");

  const csv = headers + rows;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `attendance_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

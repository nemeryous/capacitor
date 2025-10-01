import React, { useState } from "react";
import QRScanner from "./components/QRScanner";
import exportToCSV from "./utils/csvExporter";
import useQRAttendance from "./hooks/useQRAttendance";

export default function App() {
  const { records, addRecord, reset } = useQRAttendance();
  const [toast, setToast] = useState(null);

  const handleScanned = (studentId) => {
    const success = addRecord(studentId);
    if (success) {
      setToast(`Checked in: ${studentId}`);
    } else {
      setToast(`Error: ${studentId} already checked in!`);
    }
    setTimeout(() => setToast(null), 2000);
  };

  const handleExport = () => {
    exportToCSV(records);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <header
        style={{ 
          background: "rgba(255, 255, 255, 0.95)", 
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.18)"
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "20px",
              fontWeight: "bold"
            }}>
              📋
            </div>
            <h1 style={{ 
              fontSize: 28, 
              fontWeight: 700, 
              color: "#1a202c",
              margin: 0,
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              QR Attendance System
            </h1>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={handleExport}
              style={{
                background: "linear-gradient(45deg, #4ade80, #22c55e)",
                color: "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: 16,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "14px",
                boxShadow: "0 4px 15px rgba(34, 197, 94, 0.4)",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(34, 197, 94, 0.6)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(34, 197, 94, 0.4)";
              }}
            >
              📊 Xuất CSV
            </button>
            <button
              onClick={reset}
              style={{
                background: "linear-gradient(45deg, #f87171, #ef4444)",
                color: "#fff",
                border: "none",
                padding: "12px 24px",
                borderRadius: 16,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "14px",
                boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(239, 68, 68, 0.6)";
              }}
              onMouseOut={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(239, 68, 68, 0.4)";
              }}
            >
              🗑️ Reset
            </button>
          </div>
        </div>
      </header>

      <main
        className="main-grid"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: 24,
          display: "grid",
          gap: 24,
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <div>
          <QRScanner onScanned={handleScanned} />
        </div>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
          }}
        >
          <div
            style={{
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              color: "#fff",
              padding: "20px 24px",
              fontWeight: 700,
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <span style={{ fontSize: "24px" }}>📊</span>
            Lịch sử điểm danh ({records.length})
          </div>
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {records.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 24px",
                  color: "#64748b",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px"
                }}
              >
                <div style={{ fontSize: "48px", opacity: 0.5 }}>📝</div>
                <p style={{ margin: 0, fontSize: "16px", fontWeight: 500 }}>
                  Chưa có lượt điểm danh nào
                </p>
                <p style={{ margin: 0, fontSize: "14px", opacity: 0.7 }}>
                  Hãy quét mã QR để bắt đầu điểm danh
                </p>
              </div>
            )}
            {records.map((r, index) => (
              <div
                key={r.id}
                style={{
                  padding: "16px 24px",
                  borderBottom: index < records.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.2s ease",
                  background: index % 2 === 0 ? "rgba(255,255,255,0.5)" : "transparent"
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "rgba(102, 126, 234, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = index % 2 === 0 ? "rgba(255,255,255,0.5)" : "transparent";
                }}
              >
                <div>
                  <div style={{ 
                    fontWeight: 700, 
                    color: "#1a202c",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <span style={{ 
                      width: "8px", 
                      height: "8px", 
                      borderRadius: "50%", 
                      background: "#22c55e" 
                    }}></span>
                    {r.studentId}
                  </div>
                  <div style={{ 
                    fontSize: 14, 
                    color: "#64748b",
                    marginTop: "4px",
                    fontWeight: 500
                  }}>
                    🕒 {new Date(r.timestamp).toLocaleString('vi-VN')}
                  </div>
                </div>
                <div style={{
                  background: "linear-gradient(45deg, #22c55e, #16a34a)",
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: 600
                }}>
                  ✓ Đã điểm danh
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {toast && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 32,
            background: "rgba(17, 24, 39, 0.95)",
            backdropFilter: "blur(10px)",
            color: "#fff",
            padding: "16px 24px",
            borderRadius: 16,
            boxShadow: "0 10px 40px rgba(0,0,0,.3)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            fontSize: "16px",
            fontWeight: 600,
            zIndex: 1000,
            animation: "slideUp 0.3s ease-out"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>
              {toast.includes("Error") ? "❌" : "✅"}
            </span>
            {toast}
          </div>
        </div>
      )}
      
      <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }
          
          @media (max-width: 768px) {
            .main-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
}

import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";

const QRScanner = ({ onScanned }) => {
  const videoRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState();
  const [error, setError] = useState(null);
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const trackRef = useRef(null);
  const lastScanAtRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        const all = await navigator.mediaDevices.enumerateDevices();
        const cams = all.filter((d) => d.kind === "videoinput");
        if (!mounted) return;
        setDevices(cams);
        const preferBack =
          cams.find((d) => /back|environment/i.test(d.label || ""))?.deviceId ||
          cams[0]?.deviceId;
        setSelectedDeviceId(preferBack);
      } catch {
        if (!mounted) return;
        setError("Không thể truy cập camera. Hãy cấp quyền cho ứng dụng.");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedDeviceId || !videoRef.current) {
      return;
    }

    const codeReader = new BrowserMultiFormatReader();
    const videoElement = videoRef.current;

    codeReader
      .decodeFromVideoDevice(selectedDeviceId, videoElement, (result, err) => {
        if (result) {
          const now = Date.now();
          if (now - lastScanAtRef.current > 1500) {
            lastScanAtRef.current = now;
            const text = result.getText();

            const m = text.match(/^ATTEND:(.+)$/);
            if (m) {
              onScanned(m[1].trim());
              setError(null);
            } else {
              setError("QR không hợp lệ. Định dạng: ATTEND:<MSSV>");
            }
          }
        }

        if (err && !(err instanceof NotFoundException)) {
          console.error(err);
          setError("Lỗi khi quét mã. Vui lòng thử lại.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Không thể khởi tạo camera. Hãy cấp quyền và thử lại.");
      });

    // Lấy stream để điều khiển đèn pin
    navigator.mediaDevices
      .getUserMedia({
        video: { deviceId: { exact: selectedDeviceId } },
      })
      .then((stream) => {
        const track = stream.getVideoTracks()[0];
        trackRef.current = track;
        const cap = track.getCapabilities?.();
        const canTorch = !!cap && "torch" in cap;
        setHasTorch(Boolean(canTorch));
      });

    return () => {
      codeReader.reset();
      if (trackRef.current) {
        trackRef.current.stop();
      }
    };
  }, [selectedDeviceId, onScanned]);

  const toggleTorch = async () => {
    const track = trackRef.current;
    if (!track) return;
    try {
      await track.applyConstraints({ advanced: [{ torch: !torchOn }] });
      setTorchOn((v) => !v);
    } catch {
      try {
        const imageCapture = new ImageCapture(track);
        const photoCaps = await imageCapture.getPhotoCapabilities();
        if (photoCaps.fillLightMode.includes("torch")) {
          await imageCapture.setOptions({
            fillLightMode: torchOn ? "off" : "torch",
          });
          setTorchOn((v) => !v);
        } else {
          setError("Thiết bị không hỗ trợ đèn.");
        }
      } catch {
        setError("Không thể bật/tắt đèn trên thiết bị này.");
      }
    }
  };

  return (
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
          display: "flex",
          gap: 12,
          alignItems: "center",
          padding: "20px 24px",
          background: "linear-gradient(45deg, #667eea, #764ba2)",
          color: "white"
        }}
      >
        <span style={{ fontSize: "24px" }}>📱</span>
        <strong style={{ fontSize: "18px", fontWeight: 700 }}>QR Scanner</strong>
        <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          <select
            style={{
              padding: "8px 12px",
              borderRadius: 12,
              border: "none",
              background: "rgba(255, 255, 255, 0.9)",
              color: "#1a202c",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              outline: "none"
            }}
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value)}
          >
            {devices.map((d, i) => (
              <option key={d.deviceId || i} value={d.deviceId}>
                {d.label || `Camera ${i + 1}`}
              </option>
            ))}
          </select>
          <button
            onClick={toggleTorch}
            disabled={!hasTorch}
            style={{
              padding: "8px 16px",
              borderRadius: 12,
              border: "none",
              color: "#fff",
              background: hasTorch
                ? torchOn
                  ? "linear-gradient(45deg, #f87171, #ef4444)"
                  : "linear-gradient(45deg, #fbbf24, #f59e0b)"
                : "rgba(255, 255, 255, 0.3)",
              cursor: hasTorch ? "pointer" : "not-allowed",
              fontWeight: 600,
              fontSize: "14px",
              transition: "all 0.3s ease",
              opacity: hasTorch ? 1 : 0.5
            }}
            title={hasTorch ? "Bật/Tắt đèn" : "Thiết bị không hỗ trợ đèn"}
            onMouseOver={(e) => {
              if (hasTorch) {
                e.target.style.transform = "translateY(-1px)";
              }
            }}
            onMouseOut={(e) => {
              if (hasTorch) {
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            {torchOn ? "🔦 Tắt đèn" : "💡 Bật đèn"}
          </button>
        </div>
      </div>

      <div style={{ 
        background: "linear-gradient(135deg, #1e293b, #334155)", 
        position: "relative",
        borderRadius: "0 0 16px 16px",
        overflow: "hidden"
      }}>
        <video
          ref={videoRef}
          className="scanner-video"
          style={{ 
            width: "100%", 
            height: 400, 
            objectFit: "cover",
            borderRadius: "0 0 16px 16px"
          }}
          playsInline
          muted
        />
        <div
          style={{
            pointerEvents: "none",
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 250,
              height: 250,
              border: "3px solid #22c55e",
              borderRadius: 16,
              boxShadow: "0 0 30px rgba(34,197,94,.8), inset 0 0 30px rgba(34,197,94,.3)",
              background: "rgba(34,197,94,.1)",
              position: "relative"
            }}
          >
            {/* Corner decorations */}
            <div style={{
              position: "absolute",
              top: "-3px",
              left: "-3px",
              width: "30px",
              height: "30px",
              border: "3px solid #22c55e",
              borderRight: "none",
              borderBottom: "none",
              borderRadius: "16px 0 0 0"
            }}></div>
            <div style={{
              position: "absolute",
              top: "-3px",
              right: "-3px",
              width: "30px",
              height: "30px",
              border: "3px solid #22c55e",
              borderLeft: "none",
              borderBottom: "none",
              borderRadius: "0 16px 0 0"
            }}></div>
            <div style={{
              position: "absolute",
              bottom: "-3px",
              left: "-3px",
              width: "30px",
              height: "30px",
              border: "3px solid #22c55e",
              borderRight: "none",
              borderTop: "none",
              borderRadius: "0 0 0 16px"
            }}></div>
            <div style={{
              position: "absolute",
              bottom: "-3px",
              right: "-3px",
              width: "30px",
              height: "30px",
              border: "3px solid #22c55e",
              borderLeft: "none",
              borderTop: "none",
              borderRadius: "0 0 16px 0"
            }}></div>
          </div>
        </div>
        
        {/* Scanning animation */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "250px",
          height: "2px",
          background: "linear-gradient(90deg, transparent, #22c55e, transparent)",
          animation: "scan 2s ease-in-out infinite"
        }}></div>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{
          background: "linear-gradient(45deg, #f0f9ff, #e0f2fe)",
          padding: "16px 20px",
          borderRadius: 16,
          border: "1px solid #bae6fd",
          marginBottom: 16
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ fontSize: "20px" }}>ℹ️</span>
            <strong style={{ color: "#0369a1", fontSize: "16px" }}>Hướng dẫn sử dụng</strong>
          </div>
          <small style={{ color: "#0c4a6e", lineHeight: 1.5 }}>
            Hãy đưa mã QR chứa chuỗi:{" "}
            <code
              style={{
                background: "rgba(3, 105, 161, 0.1)",
                padding: "4px 8px",
                borderRadius: 8,
                fontWeight: 600,
                color: "#0369a1"
              }}
            >
              ATTEND:&lt;MSSV&gt;
            </code>{" "}
            vào khung quét phía trên.
          </small>
        </div>
        
        {error && (
          <div style={{ 
            background: "linear-gradient(45deg, #fef2f2, #fee2e2)",
            border: "1px solid #fecaca",
            borderRadius: 16,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <span style={{ fontSize: "20px" }}>⚠️</span>
            <div>
              <div style={{ color: "#dc2626", fontSize: 16, fontWeight: 600, marginBottom: "4px" }}>
                Có lỗi xảy ra
              </div>
              <div style={{ color: "#b91c1c", fontSize: 14 }}>
                {error}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style>
        {`
          @keyframes scan {
            0% { transform: translate(-50%, -125px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translate(-50%, 125px); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default QRScanner;

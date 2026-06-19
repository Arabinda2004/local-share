import { useState, useEffect } from "react";
import { useAppStore } from "../stores/appStore";
import socketService from "../services/socketService";
import ConnectionForm from "../components/ConnectionForm";
import QRScanner from "../components/QRScanner";
import ConnectionStatus from "../components/ConnectionStatus";
import { parseQRData, extractConnectionDetails } from "../utils/qrParser";

export default function ConnectionPage({ onConnected }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { setConnectionStatus, setCurrentDevice } = useAppStore();

  const handleConnect = async (ip, port, deviceName) => {
    setLoading(true);
    setError(null);

    try {
      setConnectionStatus("connecting");

      const url = `http://${ip}:${port}`;
      await socketService.connect();

      // Register device
      const device = await socketService.registerDevice(deviceName, "web");

      setCurrentDevice(device);
      setConnectionStatus("connected");
      setLoading(false);

      onConnected();
    } catch (err) {
      setError(err.message || "Failed to connect");
      setConnectionStatus("disconnected");
      setLoading(false);
    }
  };

  const handleQRScan = (qrValue) => {
    try {
      const qrData = parseQRData(qrValue);
      const { ip, port, deviceName } = extractConnectionDetails(qrData);
      setShowQRScanner(false);
      handleConnect(ip, port, deviceName);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">LocalShare</h1>
        <p className="text-gray-600 mb-8">Offline File Sharing</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <ConnectionForm onConnect={handleConnect} loading={loading} />

        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
          <button
            onClick={() => setShowQRScanner(true)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            📱 Or scan QR code
          </button>
        </div>

        {showQRScanner && (
          <QRScanner
            onScan={handleQRScan}
            onClose={() => setShowQRScanner(false)}
          />
        )}
      </div>
    </div>
  );
}

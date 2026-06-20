import { useState } from "react";
import ConnectionForm from "../components/ConnectionForm";
import QRScanner from "../components/QRScanner";
import socketService from "../services/socketService";
import { useAppStore } from "../stores/appStore";

export default function ConnectionPage({ onConnected }) {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setConnectionStatus, setCurrentDevice } = useAppStore();

  const handleConnect = async (ip, port, deviceName) => {
    setLoading(true);
    setError(null);

    try {
      setConnectionStatus("connecting");

      // Connect to the backend socket
      await socketService.connect();

      // Register device and get the server-assigned device info
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">LocalShare</h1>
            <p className="text-sm text-gray-500">Secure offline file sharing</p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 text-sm text-red-800 bg-red-50 rounded-lg border border-red-100">
              <svg className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          <ConnectionForm
            onConnect={handleConnect}
            loading={loading}
          />

          <div className="mt-8 text-center">
            <button
              onClick={() => setShowQRScanner(true)}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
            >
              Scan QR Code
            </button>
          </div>
        </div>
      </div>

      {showQRScanner && (
        <QRScanner
          onScan={(data) => {
            console.log("Scanned:", data);
            setShowQRScanner(false);
            // Handle QR data integration here later
          }}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
}

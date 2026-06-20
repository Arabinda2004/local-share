import { useState } from "react";
import { validateIP, validatePort } from "../utils/validators";

export default function ConnectionForm({ onConnect, loading }) {
  const [ip, setIp] = useState("localhost");
  const [port, setPort] = useState("3000");
  const [deviceName, setDeviceName] = useState("My Laptop");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateIP(ip)) newErrors.ip = "Invalid IP address or hostname";
    if (!validatePort(port)) newErrors.port = "Port must be 1-65535";
    if (!deviceName.trim()) newErrors.deviceName = "Device name required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onConnect(ip, port, deviceName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Device Name
        </label>
        <input
          type="text"
          value={deviceName}
          onChange={(e) => setDeviceName(e.target.value)}
          placeholder="My Laptop"
          disabled={loading}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-colors disabled:opacity-60 outline-none"
        />
        {errors.deviceName && (
          <p className="text-red-500 text-sm mt-1">{errors.deviceName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Backend IP or Hostname
        </label>
        <input
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="localhost or 192.168.1.x"
          disabled={loading}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-colors disabled:opacity-60 outline-none"
        />
        {errors.ip && <p className="text-red-500 text-sm mt-1">{errors.ip}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Port
        </label>
        <input
          type="number"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          placeholder="3000"
          disabled={loading}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-colors disabled:opacity-60 outline-none"
        />
        {errors.port && (
          <p className="text-red-500 text-sm mt-1">{errors.port}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </>
        ) : (
          "Connect"
        )}
      </button>
    </form>
  );
}


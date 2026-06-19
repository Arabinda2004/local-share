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
    <form onSubmit={handleSubmit} className="space-y-4">
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        />
        {errors.deviceName && (
          <p className="text-red-600 text-xs mt-1">{errors.deviceName}</p>
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        />
        {errors.ip && <p className="text-red-600 text-xs mt-1">{errors.ip}</p>}
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
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        />
        {errors.port && (
          <p className="text-red-600 text-xs mt-1">{errors.port}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
      >
        {loading ? "Connecting..." : "Connect"}
      </button>
    </form>
  );
}

import { useAppStore } from "../stores/appStore";
import { formatTimestamp } from "../utils/validators";

export default function DeviceList() {
  const { connectedDevices, selectedPeer, setSelectedPeer, trustedDevices } =
    useAppStore();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-2">
        <h3 className="text-xs font-semibold text-gray-600 px-2 py-2 uppercase">
          Connected Devices ({connectedDevices.length})
        </h3>
        {connectedDevices.length === 0 ? (
          <p className="text-xs text-gray-500 px-4 py-2">
            No devices connected
          </p>
        ) : (
          connectedDevices.map((device) => (
            <button
              key={device.id}
              onClick={() => setSelectedPeer(device.id)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition flex items-center justify-between ${
                selectedPeer === device.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-800 hover:bg-gray-100"
              }`}
            >
              <div>
                <p className="font-medium">{device.name}</p>
                <p className="text-xs opacity-75">{device.type}</p>
              </div>
              {trustedDevices.includes(device.id) && (
                <span className="text-lg">✓</span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

import { useAppStore } from "../stores/appStore";

export default function ConnectionStatus() {
  const { connectionStatus, currentDevice } = useAppStore();

  const statusColor = {
    connecting: "bg-yellow-100 text-yellow-800",
    connected: "bg-green-100 text-green-800",
    disconnected: "bg-red-100 text-red-800",
  };

  const statusText = {
    connecting: "Connecting...",
    connected: "Connected",
    disconnected: "Disconnected",
  };

  return (
    <div
      className={`px-4 py-2 rounded-lg ${statusColor[connectionStatus] || statusColor.disconnected}`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            connectionStatus === "connected"
              ? "bg-green-600"
              : connectionStatus === "connecting"
                ? "bg-yellow-600"
                : "bg-red-600"
          }`}
        ></div>
        <span className="font-medium text-sm">
          {statusText[connectionStatus]}
        </span>
        {currentDevice && (
          <span className="text-xs ml-2">• {currentDevice.name}</span>
        )}
      </div>
    </div>
  );
}

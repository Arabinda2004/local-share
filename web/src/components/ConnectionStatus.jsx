import { useAppStore } from "../stores/appStore";

export default function ConnectionStatus() {
  const { connectionStatus, currentDevice } = useAppStore();

  const statusColor = {
    connecting: "bg-amber-500",
    connected: "bg-emerald-500",
    disconnected: "bg-red-500",
  };

  const statusText = {
    connecting: "Connecting...",
    connected: "Connected",
    disconnected: "Disconnected",
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex h-2.5 w-2.5">
        {connectionStatus === "connecting" && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusColor[connectionStatus] || statusColor.disconnected}`}></span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900 leading-tight">
          {statusText[connectionStatus]}
        </span>
        {currentDevice && (
          <span className="text-xs text-gray-500 leading-tight truncate max-w-[150px]">
            {currentDevice.name}
          </span>
        )}
      </div>
    </div>
  );
}

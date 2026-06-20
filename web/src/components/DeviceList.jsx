import { useAppStore } from "../stores/appStore";

export default function DeviceList() {
  const { connectedDevices, selectedPeer, setSelectedPeer } = useAppStore();

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-3">
      <div className="mb-3 px-3 flex items-center justify-between">
        <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
          Devices
        </h3>
        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
          {connectedDevices.length}
        </span>
      </div>
      
      {connectedDevices.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-gray-500">
          No other devices found.
        </div>
      ) : (
        <ul className="space-y-1">
          {connectedDevices.map((device) => {
            const isSelected = selectedPeer === device.id;
            const initial = device.name.charAt(0).toUpperCase();
            
            return (
              <li key={device.id}>
                <button
                  onClick={() => setSelectedPeer(device.id)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all border border-transparent ${
                    isSelected
                      ? "bg-blue-50 border-blue-100"
                      : "hover:bg-gray-50 hover:border-gray-100"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                      {initial}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                      {device.name}
                    </p>
                    <p className={`text-xs truncate ${isSelected ? 'text-blue-600/80' : 'text-gray-500'}`}>
                      {device.type}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

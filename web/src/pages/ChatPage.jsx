import { useEffect } from "react";
import { useAppStore } from "../stores/appStore";
import socketService from "../services/socketService";
import DeviceList from "../components/DeviceList";
import ChatBox from "../components/ChatBox";
import MessageInput from "../components/MessageInput";
import ConnectionStatus from "../components/ConnectionStatus";

export default function ChatPage({ onDisconnect }) {
  const { selectedPeer, setConnectedDevices, onMessageReceived } =
    useAppStore();

  useEffect(() => {
    // Listen for device list updates
    socketService.onDeviceList((devices) => {
      const { currentDevice } = useAppStore.getState();
      const myId = currentDevice?.id;
      const otherDevices = devices.filter(d => d.id !== myId);
      setConnectedDevices(otherDevices);
    });
    
    // Request initial list
    socketService.requestDeviceList();

    // Listen for incoming messages
    socketService.onMessageReceived((msg) => {
      const { addMessage } = useAppStore.getState();
      addMessage(msg.from, msg.to, msg.content);
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleDisconnect = () => {
    socketService.disconnect();
    onDisconnect();
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-900 font-sans">
      {/* Sidebar */}
      <div className="w-[280px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col z-10 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight text-gray-900">LocalShare</h1>
          </div>
          <ConnectionStatus />
        </div>

        <DeviceList />

        <div className="p-4 border-t border-gray-100 bg-white mt-auto">
          <button
            onClick={handleDisconnect}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Disconnect
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50/50">
        <ChatBox />
        <MessageInput selectedPeer={selectedPeer} />
      </div>
    </div>
  );
}


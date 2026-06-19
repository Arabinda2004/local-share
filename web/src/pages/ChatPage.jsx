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
      setConnectedDevices(devices);
    });

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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="mb-3">
            <ConnectionStatus />
          </div>
          <h2 className="text-lg font-bold text-gray-800">LocalShare</h2>
        </div>

        <DeviceList />

        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={handleDisconnect}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Disconnect
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatBox />
        <MessageInput selectedPeer={selectedPeer} />
      </div>
    </div>
  );
}

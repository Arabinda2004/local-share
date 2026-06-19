import { useAppStore } from "../stores/appStore";
import { formatTimestamp } from "../utils/validators";

export default function ChatBox() {
  const { connectedDevices, selectedPeer, messages } = useAppStore();
  const currentDevice = connectedDevices.find((d) => d.id === selectedPeer);

  if (!selectedPeer) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="text-center text-gray-500">
          <p className="text-lg">Select a device to start chatting</p>
        </div>
      </div>
    );
  }

  const messageKey = [selectedPeer].sort().join("-");
  const currentMessages = messages[messageKey] || [];

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h2 className="text-xl font-bold text-gray-800">
          {currentDevice?.name || selectedPeer}
        </h2>
        <p className="text-sm text-gray-600">{currentDevice?.type}</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentMessages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg">No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          currentMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.from === "self" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.from === "self"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                <p>{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {formatTimestamp(msg.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

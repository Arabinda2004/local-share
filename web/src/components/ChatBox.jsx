import { useAppStore } from "../stores/appStore";
import { formatTimestamp } from "../utils/validators";

export default function ChatBox() {
  const { connectedDevices, selectedPeer, messages, currentDevice } = useAppStore();
  const selectedDevice = connectedDevices.find((d) => d.id === selectedPeer);

  if (!selectedPeer) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Your Messages</h3>
        <p className="text-sm text-gray-500 max-w-sm">
          Select a device from the sidebar to start a secure, offline conversation.
        </p>
      </div>
    );
  }

  const myId = currentDevice?.id;
  const key = myId ? [myId, selectedPeer].sort().join("-") : null;
  const currentMessages = key ? (messages[key] || []) : [];

  return (
    <div className="flex-1 flex flex-col bg-transparent h-full">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-10 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
          {selectedDevice?.name?.charAt(0).toUpperCase() || selectedPeer.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 leading-tight">
            {selectedDevice?.name || selectedPeer}
          </h2>
          <p className="text-xs text-emerald-600 font-medium">{selectedDevice?.type || 'Unknown device'}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {currentMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center mt-12">
            <p className="text-sm font-medium text-gray-900 mb-1">No messages yet</p>
            <p className="text-xs text-gray-500">Send a message to start the conversation.</p>
          </div>
        ) : (
          currentMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex w-full ${msg.isMine ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex flex-col ${msg.isMine ? "items-end" : "items-start"} max-w-[75%]`}>
                <div
                  className={`px-4 py-2.5 shadow-sm ${
                    msg.isMine
                      ? "bg-blue-600 text-white rounded-2xl rounded-br-sm"
                      : "bg-white border border-gray-100 text-gray-900 rounded-2xl rounded-bl-sm"
                  }`}
                >
                  <p className="text-[15px] leading-relaxed break-words">{msg.content}</p>
                </div>
                <span className="text-[11px] text-gray-400 mt-1.5 px-1 font-medium">
                  {formatTimestamp(msg.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


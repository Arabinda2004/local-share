import { useState } from "react";
import { validateMessage } from "../utils/validators";
import { useAppStore } from "../stores/appStore";
import socketService from "../services/socketService";

export default function MessageInput({ selectedPeer }) {
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const { addMessage, currentDevice } = useAppStore();

  const handleSend = async () => {
    if (!validateMessage(messageText) || !selectedPeer || !currentDevice) return;

    setSending(true);
    try {
      socketService.sendMessage(selectedPeer, messageText);
      addMessage(currentDevice.id, selectedPeer, messageText);
      setMessageText("");
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Write a message..."
            disabled={!selectedPeer || sending}
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-full text-[15px] focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-colors disabled:opacity-60 outline-none"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!validateMessage(messageText) || !selectedPeer || sending}
          className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-200 disabled:text-gray-400 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Send message"
        >
          {sending ? (
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

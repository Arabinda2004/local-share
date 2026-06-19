import { useState } from "react";
import { validateMessage } from "../utils/validators";
import { useAppStore } from "../stores/appStore";
import socketService from "../services/socketService";

export default function MessageInput({ selectedPeer }) {
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const { addMessage } = useAppStore();

  const handleSend = async () => {
    if (!validateMessage(messageText) || !selectedPeer) return;

    setSending(true);
    try {
      socketService.sendMessage(selectedPeer, messageText);
      addMessage("self", selectedPeer, messageText);
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
    <div className="bg-white border-t border-gray-200 p-4 flex gap-2">
      <input
        type="text"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        disabled={!selectedPeer || sending}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
      />
      <button
        onClick={handleSend}
        disabled={!validateMessage(messageText) || !selectedPeer || sending}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
      >
        {sending ? "..." : "Send"}
      </button>
    </div>
  );
}

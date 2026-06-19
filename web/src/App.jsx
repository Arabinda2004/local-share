import { useState } from "react";
import ConnectionPage from "./pages/ConnectionPage";
import ChatPage from "./pages/ChatPage";

function App() {
  const [connected, setConnected] = useState(false);

  return (
    <div className="App">
      {!connected ? (
        <ConnectionPage onConnected={() => setConnected(true)} />
      ) : (
        <ChatPage onDisconnect={() => setConnected(false)} />
      )}
    </div>
  );
}

export default App;

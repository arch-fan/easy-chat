import { type FormEvent, useState, useRef, useEffect } from "react";

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [ws, setWs] = useState<WebSocket>();
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ws = new WebSocket(`wss://${location.host}/ws`);

    ws.onmessage = (payload) => {
      setMessages((prev) => [...prev, payload.data]);
    };

    setWs(ws);

    return () => ws.close();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage) return;
    ws?.send(newMessage);
    setNewMessage("");
  };

  useEffect(() => {
    inputRef.current!.value = newMessage;
  }, [newMessage]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <main className="flex flex-col h-screen gap-4 max-w-xl mx-auto p-2">
      <div
        ref={messagesContainerRef}
        className="flex flex-col gap-2 p-2 flex-1 border border-zinc-500 rounded overflow-y-scroll overflow-x-hidden"
      >
        {messages.map((m) => (
          <p className="bg-green-500 text-white w-fit py-1 px-2 rounded-xl break-all">
            {m}
          </p>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          onChange={(e) => setNewMessage(e.target.value)}
          type="text"
          className="px-4 py-2 w-full rounded-full border"
        />
      </form>
    </main>
  );
}

export default App;

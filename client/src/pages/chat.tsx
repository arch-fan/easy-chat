import { type FormEvent, useState, useRef, useEffect } from "react";
import type { AppWS } from "types";
import { useLocation } from "wouter";
import { MdiLogout } from "../icons/logout";

export default function Chat() {
  const [messages, setMessages] = useState<AppWS.MessageReceive[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [ws, setWs] = useState<WebSocket>();
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  localStorage.getItem("user") || navigate("/");

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const username = localStorage.getItem("user");
    const ws = new WebSocket(`ws://${location.host}/ws?user=${username}`);

    ws.onmessage = (payload) => {
      const message = JSON.parse(payload.data) as AppWS.MessageReceive;
      setMessages((prev) => [...prev, message]);
    };

    setWs(ws);

    return () => ws.close();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage) return;
    ws?.send(
      JSON.stringify({
        type: "messageSend",
        text: newMessage,
      } as AppWS.MessageSend)
    );
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
          <div className="bg-green-500 flex flex-col gap-0.5 text-white w-fit py-1 px-2 rounded-xl break-all">
            <span className="text-xs text-zinc-200">{m.username}</span>
            <p>{m.text}</p>
          </div>
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
      <button className="absolute bottom-4 left-4 border p-1 rounded">
        <MdiLogout onClick={logout} className="p-1 size-6" />
      </button>
    </main>
  );
}

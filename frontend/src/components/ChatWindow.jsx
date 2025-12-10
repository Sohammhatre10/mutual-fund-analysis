import React, { useState, useRef, useEffect } from "react";
import { BoltIcon } from "./icons";

export default function ChatWindow({ messages, onSend }) {
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput("");
  };

  return (
    <main className="flex-1 flex flex-col">
      {/* header */}
      <header className="px-6 py-4 bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-lg font-semibold">AI Assistant</div>
          <div className="text-sm text-gray-500">chat / assistant</div>
        </div>
      </header>

      {/* messages area */}
      <div className="flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          className="max-w-4xl mx-auto h-full p-6 overflow-auto flex flex-col gap-4"
        >
          {/* spacer to center chat vertically when few messages */}
          <div className="flex-1" />

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "bot" && (
                <div className="w-8 h-8 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center mr-2 mt-1">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  </svg>
                </div>
              )}
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl break-words ${m.role === "user" ? "bg-gray-200 text-gray-900 rounded-br-sm" : "bg-white border text-gray-900 rounded-bl-sm shadow-sm"}`}
              >
                {m.role === "bot" ? (
                  <BotMessageContent message={m.text} />
                ) : (
                  m.text
                )}
              </div>
              {m.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-purple-500 flex-shrink-0 flex items-center justify-center ml-2 mt-1 text-white text-xs font-semibold">
                  U
                </div>
              )}
            </div>
          ))}

          {/* small bottom padding so input doesn't overlap */}
          <div className="h-8" />
        </div>
      </div>

      {/* input bar — centered and with elevated style */}
      <div className="bg-transparent py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 bg-white shadow-md border rounded-full px-3 py-2">
            <button className="text-gray-600 p-2 rounded-full hover:bg-gray-100">
              {/* mic icon placeholder */}
              <span role="img" aria-label="mic">🎤</span>
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 outline-none px-3 py-2 bg-transparent"
              placeholder="Ask anything..."
            />

            <button
              onClick={handleSend}
              className="ml-2 px-5 py-2 bg-black text-white rounded-full font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function BotMessageContent({ message }) {
  try {
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.mongo_data || parsedMessage.yfinance_data) {
      return (
        <div className="flex flex-col gap-2">
          {parsedMessage.mongo_data && (
            <div>
              <h3 className="font-semibold">MongoDB Data:</h3>
              {Object.entries(parsedMessage.mongo_data).map(([key, value]) => (
                <p key={key}><strong>{key}:</strong> {JSON.stringify(value)}</p>
              ))}
            </div>
          )}
          {parsedMessage.yfinance_data && (
            <div>
              <h3 className="font-semibold mt-2">Yahoo Finance Data:</h3>
              {Object.entries(parsedMessage.yfinance_data).map(([key, value]) => (
                <p key={key}><strong>{key}:</strong> {JSON.stringify(value)}</p>
              ))}
            </div>
          )}
           {parsedMessage.message && (
            <p>{parsedMessage.message}</p>
          )}
        </div>
      );
    } else if (parsedMessage.message) {
      return <p>{parsedMessage.message}</p>;
    } else {
      return <pre>{message}</pre>; // Fallback for unexpected JSON structure
    }
  } catch (e) {
    return <p>{message}</p>; // Render as plain text if not valid JSON
  }
}

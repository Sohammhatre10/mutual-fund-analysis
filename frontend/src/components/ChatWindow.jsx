import React, { useState, useRef, useEffect } from "react";
import { BoltIcon } from "./icons";

export default function ChatWindow({ messages, onSend, readonly = false, futuristic = false }) {
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
    <main className="w-full min-h-full flex flex-col">
      {/* header */}
      <header className={futuristic ? "px-6 py-6 bg-gradient-to-r from-[#191e31ef] to-[#13191fff] border-b border-[#2ef88c] shadow-lg" : "px-6 py-4 bg-white border-b shadow-sm"}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className={futuristic ? "text-2xl font-black tracking-wider text-[#2ef88c] [text-shadow:_0_2px_16px_#2ef88c40]" : "text-lg font-semibold"}>AI Assistant</div>
          <div className="text-sm text-[#2ef88c] font-semibold lowercase tracking-wider">chat / assistant</div>
        </div>
      </header>

      {/* messages area */}
      <div className="flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          className={futuristic ? "max-w-4xl mx-auto h-full p-12 overflow-auto flex flex-col gap-8" : "max-w-4xl mx-auto h-full p-6 overflow-auto flex flex-col gap-4"}
        >
          <div className="flex-1" />
          {messages.map((m, idx) => (
            <div
              key={m.id || idx}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "bot" && (
                <div className="w-10 h-10 rounded-[18px] bg-gradient-to-tr from-[#2ef88c] to-[#168eec] shadow-lg flex-shrink-0 flex items-center justify-center mr-3 text-white font-extrabold text-xl">
                  <span>🤖</span>
                </div>
              )}
              <div
                className={`relative ${futuristic ?
                  (m.role === "bot"
                    ? "max-w-2xl px-10 py-9 bg-[#1d2338dd] border-2 border-[#2ef88c]/60 shadow-[0_4px_24px_#168eec22] rounded-[2rem] text-white text-lg mb-8 backdrop-blur-sm"
                    : "max-w-2xl px-8 py-7 bg-[#23284d88] border border-[#2ef88c]/20 shadow rounded-[2rem] text-white text-lg mb-8 backdrop-blur-sm")
                  :
                  (m.role === "bot"
                    ? "bg-white border text-gray-900 rounded-bl-sm shadow-sm max-w-[70%] px-4 py-3 rounded-2xl break-words"
                    : "bg-gray-200 text-gray-900 rounded-br-sm max-w-[70%] px-4 py-3 rounded-2xl break-words")
                }`}
              >
                {m.role === "bot" ? (
                  <FuturisticPriceBotBubble message={m.text} />
                ) : (
                  <span className="whitespace-pre-line font-medium">{typeof m.text === "object" ? JSON.stringify(m.text) : m.text}</span>
                )}
              </div>
              {m.role === "user" && (
                <div className="w-10 h-10 rounded-[16px] bg-gradient-to-tr from-[#168eec] to-[#2ef88c] flex-shrink-0 flex items-center justify-center ml-3 mt-1 text-[#131724] font-bold text-[20px] shadow-lg">
                  U
                </div>
              )}
            </div>
          ))}
          <div className="h-6" />
        </div>
      </div>

      {/* If NOT readonly, show input bar */}
      {!readonly && (
        <div className="bg-transparent py-10">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-3 bg-[#21263a] shadow-[0_4px_32px_#168eec11] border border-[#23284d] rounded-full px-5 py-3">
              <button className="text-[#31e06b] p-3 rounded-full text-xl hover:bg-[#282e47]">
                <span role="img" aria-label="mic">🎤</span>
              </button>

              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                className="flex-1 outline-none px-4 py-2 bg-transparent text-white font-medium"
                placeholder="Ask anything…"
                autoFocus
              />

              <button
                onClick={handleSend}
                className="ml-2 px-8 py-3 bg-gradient-to-r from-[#2ef88c] to-[#168eec] text-[#191e31] rounded-full font-bold text-lg tracking-wide shadow hover:scale-105 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function FuturisticPriceBotBubble({ message }) {
  // message = {ticker, mongo_data, yfinance_data, ...}
  const [showMeta, setShowMeta] = useState(false);
  let price = null;
  if (message && typeof message === "object" && message.yfinance_data && message.yfinance_data.currentPrice) {
    price = message.yfinance_data.currentPrice;
  }
  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex flex-col items-center">
        {price !== null && (
          <div className="mb-2 text-[2.6rem] leading-none font-extrabold text-[#20f980] neon-glow drop-shadow-[0_2px_16px_rgba(46,248,140,0.7)] tracking-tight animate-price-pulse">
            {price}
          </div>
        )}
        <button
          className="text-indigo-500 underline text-base mb-2 hover:text-[#2ef88c] font-semibold opacity-70"
          onClick={() => setShowMeta(v => !v)}
        >
          {showMeta ? "Hide Details" : "Response Metadata"}
        </button>
        {showMeta && (
          <pre className="rounded-xl bg-[#222846ea] border border-[#2ef88c77] p-4 mt-1 text-xs max-w-2xl text-[#dadada] overflow-auto whitespace-pre-wrap text-left shadow-inner">
            {JSON.stringify(message, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

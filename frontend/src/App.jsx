import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { getUserHistory, searchStock } from "./services/api";

function convertTurnToMessages(turn) {
  // Helper: takes one turn array [{"0": ...}, {"1": ...}] and returns two messages (user then bot)
  return [
    { id: "user", role: "user", text: turn[0]["0"] },
    { id: "bot", role: "bot", text: turn[1]["1"] }
  ];
}

export default function App() {
  const [currentMessages, setCurrentMessages] = useState([
    { id: 1, role: "bot", text: "Hello — I'm your assistant. Ask me anything." }
  ]);
  const [sidebarHistory, setSidebarHistory] = useState([]); // All turns from backend
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
  const [inputName, setInputName] = useState("");
  const [nameError, setNameError] = useState("");
  const [viewingHistoryTurn, setViewingHistoryTurn] = useState(null); // for modal or dedicated view

  // Fetch chat history for sidebar on login/user change
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getUserHistory(user)
      .then(res => {
        // Handle both object response and array fallback
        const history = res?.history || (Array.isArray(res) ? res : []);
        setSidebarHistory(history);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to load user history:", error);
        setSidebarHistory([]);
        setLoading(false); // Always set loading to false, even on error
      });
  }, [user]);

  const addMessage = async (role, text) => {
    if (role === "user") {
      setCurrentMessages(prev => [...prev, { id: Date.now(), role: "user", text }]);
      try {
        const botResponse = await searchStock(user, text);
        setCurrentMessages(prev => [...prev, { id: Date.now() + 1, role: "bot", text: botResponse }]);
        // refresh sidebar so new turn shows up
        const res = await getUserHistory(user);
        setSidebarHistory(res.history || []);
      } catch {
        setCurrentMessages(prev => [...prev, { id: Date.now() + 2, role: "bot", text: { message: "Error: Could not get a response from the bot." } }]);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#10131c]">
        <form onSubmit={e => {
          e.preventDefault();
          if (!inputName.trim()) {
            setNameError("Please enter a username");
          } else {
            setUser(inputName.trim());
            localStorage.setItem("userName", inputName.trim());
            setNameError("");
          }
        }} className="bg-[#171c2a] border border-[#22263a] p-8 rounded-xl flex flex-col gap-4 min-w-[320px] shadow-lg">
          <label htmlFor="userName" className="font-bold text-2xl text-white mb-2">Welcome to Fund Analyser</label>
          <input
            id="userName"
            className="border-2 border-[#344363] bg-[#21263a] px-3 py-2 rounded-md text-lg text-white focus:outline-[#31e06b]"
            value={inputName}
            onChange={e => setInputName(e.target.value)}
            placeholder="Enter your username"
            autoFocus
          />
          {nameError && <div className="text-[#ff5757] text-sm">{nameError}</div>}
          <button type="submit" className="mt-2 bg-gradient-to-r from-[#2ef88c] to-[#168eec] text-black px-4 py-2 rounded-lg font-bold text-lg shadow hover:scale-105 transition">Continue →</button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (<div className="min-h-screen flex items-center justify-center bg-[#10131c]"><div className="text-gray-300 text-lg animate-pulse">Loading…</div></div>);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10131c] to-[#21263a] flex text-white font-sans transition-all duration-300">
      <Sidebar
        user={user}
        history={sidebarHistory}
        onSelectTurn={turn => setViewingHistoryTurn(turn)}
      />
      <main className="flex-1 flex items-center justify-center">
        {!viewingHistoryTurn ? (
      <ChatWindow 
            messages={currentMessages}
            onSend={text => addMessage("user", text)}
            futuristic
          />
        ) : (
          <div className="fixed inset-0 flex items-center justify-center bg-[#161b22cc] z-40">
            <div className="bg-[#171c2a] border border-[#2ef88c] rounded-2xl p-8 shadow-xl max-w-xl w-full relative animate-fade-in">
              <button
                className="absolute top-2 right-2 text-[#2ef88c] text-lg rounded px-2 py-1 border border-[#2ef88c] hover:bg-[#282e47] transition"
                onClick={() => setViewingHistoryTurn(null)}
              >
                ← Back
              </button>
              <ChatWindow
                messages={convertTurnToMessages(viewingHistoryTurn)}
                onSend={() => {}}  // Disable new sends in history view
                futuristic
                readonly
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

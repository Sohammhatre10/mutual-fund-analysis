import React from "react";

export default function Sidebar({ user, history, onSelectTurn }) {
  return (
    <aside className="w-80 bg-[#171c2a] border-r border-[#2ef88c] h-screen flex flex-col glass shadow-2xl">
      <div className="px-6 py-4 border-b border-[#2ef88c]/25 flex justify-between items-center">
        <div className="text-2xl font-black tracking-wide bg-gradient-to-r from-[#2ef88c] to-[#168eec] bg-clip-text text-transparent py-1 px-2 [text-shadow:_0_2px_16px_#2ef88c55]">Fund Analyser</div>
        <button className="text-[#168eec] bg-[#1c2134] p-2 rounded-xl font-black hover:bg-[#282e47] transition shadow">+ New chat</button>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-2">
        {(history || []).map((turn, i) => (
          <button key={i}
                  className="flex items-center px-4 py-3 shadow rounded-lg bg-[#23284d] hover:bg-[#282e47] border border-[#2ef88c]/15 text-left text-white font-semibold transition-all cursor-pointer group"
                  onClick={() => onSelectTurn && onSelectTurn(turn)}
                  title={turn[0]["0"]}
          >
            <span className="truncate text-[#2ef88c] font-extrabold mr-2">⏳</span>
            <span className="truncate">{turn[0]["0"].slice(0, 36) + (turn[0]["0"].length > 36 ? '...' : '')}</span>
          </button>
        ))}
      </nav>
      <div className="px-6 py-5 border-t border-[#2ef88c]/25 bg-[#131724] flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2ef88c] to-[#168eec] flex items-center justify-center text-2xl font-extrabold text-[#131724] drop-shadow-2xl">
          {user?.[0]?.toUpperCase() || "?"}
        </div>
        <div>
          <div className="text-lg font-bold">{user}</div>
          <div className="text-xs text-[#2ef88c] mt-1">Active</div>
        </div>
      </div>
    </aside>
  );
}

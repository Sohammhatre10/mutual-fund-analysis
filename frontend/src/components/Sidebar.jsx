import React from "react";

export default function Sidebar() {
  const chats = [
    "Sentence correction",
    "Project comparison",
    "Personal collaborator",
    "Shirt color suggestions",
    "PPT guidance",
  ];

  return (
    <aside className="w-72 bg-white border-r h-screen flex flex-col">
      <div className="p-4 border-b">
        <div className="text-xl font-semibold">Fund Analyser</div>
      </div>

      <div className="p-4">
        <button className="w-full text-left px-3 py-2 bg-gray-100 rounded-md font-medium hover:bg-gray-200">
          + New chat
        </button>
      </div>

      <nav className="p-2 flex-1 overflow-auto">
        <ul className="space-y-2">
          {chats.map((c, i) => (
            <li
              key={i}
              className="px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm"
            >
              {c}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
            J
          </div>
          <div>
            <div className="text-sm font-medium">User</div>
            <div className="text-xs text-gray-500">Free</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

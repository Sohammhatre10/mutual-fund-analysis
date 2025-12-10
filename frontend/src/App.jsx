import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { getUserHistory, searchStock } from "./services/api";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(""); // New state for user name

  useEffect(() => {
    const initializeUserAndMessages = async () => {
      let currentUserName = localStorage.getItem("userName");
      if (!currentUserName) {
        currentUserName = prompt("Please enter your name:");
        if (currentUserName) {
          localStorage.setItem("userName", currentUserName);
        }
      }
      setUserName(currentUserName || "Guest"); // Set to Guest if no name entered

      try {
        setLoading(true);
        const history = await getUserHistory(currentUserName || "Guest");
        if (history.length === 0) {
          setMessages([{ id: 1, role: "bot", text: "Hello — I'm your assistant. Ask me anything." }]);
        } else {
          const normalizedMessages = history.map((msg, index) => ({
            id: index,
            role: msg.type === "human" ? "user" : "bot",
            text: JSON.stringify(msg.content) // Assuming bot content might be an object
          }));
          setMessages(normalizedMessages);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        setMessages([{ id: 1, role: "bot", text: "Hello — I'm your assistant. Ask me anything." }]);
      } finally {
        setLoading(false);
      }
    };

    initializeUserAndMessages();
  }, []);

  const addMessage = async (role, text) => {
    const newMessage = { id: Date.now(), role, text };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    if (role === "user") {
      try {
        const botResponse = await searchStock(userName, text);
        const botMessage = {
          id: Date.now() + 1,
          role: "bot",
          text: JSON.stringify(botResponse) // Assuming bot response is an object
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error fetching bot response:", error);
        setMessages((prevMessages) => [...prevMessages, { id: Date.now() + 1, role: "bot", text: "Error: Could not get a response from the bot." }]);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7f8] flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f8] flex text-gray-800">
      <Sidebar />
      <ChatWindow 
        messages={messages} 
        onSend={(text) => addMessage("user", text)}
      />
    </div>
  );
}

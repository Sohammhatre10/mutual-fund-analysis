import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatWindow } from "@/components/ChatWindow";
import { ChatInput } from "@/components/ChatInput";
import { HistoryModal } from "@/components/HistoryModal";
import { useAuth } from "@/contexts/AuthContext";
import { sendQuery, type Message, type HistoryTurn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export default function AppPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewingHistory, setViewingHistory] = useState<HistoryTurn[] | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSendMessage = async (text: string) => {
    if (!user) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await sendQuery(user, text);
      console.log("Backend Response:", response); // Add this line for logging
      const botMessage: Message = {
        id: Date.now() + 1,
        role: "bot",
        text: response.message,
        ticker: response.ticker,
        yfinanceData: response.yfinanceData,
        currentPrice: response.currentPrice,
        mongoData: response.mongo_data, // Add mongoData to botMessage
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleSelectHistory = (turn: HistoryTurn[]) => {
    setViewingHistory(turn);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar
        onSelectHistory={handleSelectHistory}
        onNewChat={handleNewChat}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-border flex items-center px-6">
          <h1 className="font-semibold">Chat</h1>
          {messages.length > 0 && (
            <span className="ml-2 text-sm text-muted-foreground">
              · {messages.length} messages
            </span>
          )}
        </header>

        {/* Chat Window */}
        <ChatWindow messages={messages} loading={loading} />

        {/* Input Area */}
        <ChatInput onSend={handleSendMessage} disabled={loading} />
      </main>

      {/* History Modal */}
      {viewingHistory && (
        <HistoryModal
          turn={viewingHistory}
          onClose={() => setViewingHistory(null)}
        />
      )}
    </div>
  );
}

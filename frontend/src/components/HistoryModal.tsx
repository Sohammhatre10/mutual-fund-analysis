import { X, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { ChatWindow } from "./ChatWindow";
import { convertTurnToMessages, type HistoryTurn } from "@/lib/api";

interface HistoryModalProps {
  turn: HistoryTurn[];
  onClose: () => void;
}

export function HistoryModal({ turn, onClose }: HistoryModalProps) {
  const messages = convertTurnToMessages(turn);

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-4 md:inset-8 lg:inset-16 bg-card rounded-2xl border border-border shadow-soft overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Button
            variant="ghost"
            onClick={onClose}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to chat
          </Button>
          <h3 className="font-semibold">Conversation History</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <ChatWindow messages={messages} />
      </div>
    </div>
  );
}

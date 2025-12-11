import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Plus,
  Settings,
  LogOut,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { fetchHistory, type HistoryTurn } from "@/lib/api";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  onSelectHistory: (turn: HistoryTurn[]) => void;
  onNewChat: () => void;
}

export function AppSidebar({ onSelectHistory, onNewChat }: AppSidebarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryTurn[][]>([]);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchHistory(user);
      setHistory(data);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  const getHistoryPreview = (turn: HistoryTurn[]): string => {
    const firstMessage = turn[0];
    if (firstMessage?.["0"]) {
      const text = firstMessage["0"];
      return text.length > 30 ? text.substring(0, 30) + "..." : text;
    }
    return "Conversation";
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <Logo size="sm" showText={!collapsed} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed ? "" : "rotate-180"
              )}
            />
          </Button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button
          onClick={onNewChat}
          variant="outline"
          className={cn(
            "w-full justify-start gap-2",
            collapsed && "justify-center px-0"
          )}
        >
          <Plus className="h-4 w-4" />
          {!collapsed && <span>New Chat</span>}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <Button
          variant="ghost"
          onClick={() => navigate("/app")}
          className={cn(
            "w-full justify-start gap-2 text-sidebar-foreground",
            collapsed && "justify-center px-0"
          )}
        >
          <Home className="h-4 w-4" />
          {!collapsed && <span>Home</span>}
        </Button>

        {!collapsed && history.length > 0 && (
          <div className="pt-4">
            <p className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Recent Chats
            </p>
            <div className="mt-2 space-y-1">
              {loading ? (
                <div className="flex items-center gap-2 px-2 py-2">
                  <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : (
                history.slice(0, 10).map((turn, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectHistory(turn)}
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-left"
                  >
                    <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">{getHistoryPreview(turn)}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          onClick={() => navigate("/settings")}
          className={cn(
            "w-full justify-start gap-2 text-sidebar-foreground",
            collapsed && "justify-center px-0"
          )}
        >
          <Settings className="h-4 w-4" />
          {!collapsed && <span>Settings</span>}
        </Button>

        {user && (
          <div
            className={cn(
              "flex items-center gap-3 px-2 py-2",
              collapsed && "justify-center"
            )}
          >
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
              {user.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user}</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Active
                </p>
              </div>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          onClick={handleSignOut}
          className={cn(
            "w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign out</span>}
        </Button>
      </div>
    </aside>
  );
}

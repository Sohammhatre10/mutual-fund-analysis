const BASE_URL = import.meta.env.VITE_API_URL;

export interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
  ticker?: string;
  yfinanceData?: Record<string, any>; // Changed from unknown to any for easier access
  mongoData?: Record<string, any>; // Add mongoData property
  currentPrice?: string;
}

export interface HistoryTurn {
  "0": string;
  "1": string | { message?: string; ticker?: string; yfinance_data?: Record<string, any>; mongo_data?: Record<string, any>; currentPrice?: string };
}

export async function fetchHistory(username: string): Promise<HistoryTurn[][]> {
  const response = await fetch(`${BASE_URL}/user_history/?user=${encodeURIComponent(username)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }
  const data = await response.json();
  return data.history || [];
}

export async function sendQuery(
  username: string,
  query: string
): Promise<{ message: string; ticker?: string; yfinanceData?: Record<string, any>; currentPrice?: string; mongoData?: Record<string, any> }> {
  const response = await fetch(`${BASE_URL}/search_stock/?user=${encodeURIComponent(username)}&query=${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new Error("Failed to send query");
  }

  const data = await response.json();
  
  // Ensure data.message is always a string
  const messageText = typeof data.message === "string" ? data.message : "";

  return {
    message: messageText,
    ticker: data.ticker,
    yfinanceData: data.yfinance_data,
    currentPrice: data.currentPrice,
    mongoData: data.mongo_data,
  };
}

export function convertTurnToMessages(turn: HistoryTurn[]): Message[] {
  return turn.map((item, index) => {
    const isUser = !!item["0"];
    let message: Message = {
      id: index,
      role: isUser ? "user" : "bot",
      text: "",
    };

    if (isUser) {
      message.text = item["0"];
    } else {
      const botResponse = item["1"];
      if (typeof botResponse === "string") {
        message.text = botResponse;
      } else if (typeof botResponse === "object" && botResponse !== null) {
        message.text = typeof botResponse.message === "string" ? botResponse.message : "";
        message.ticker = botResponse.ticker;
        message.yfinanceData = botResponse.yfinance_data;
        message.mongoData = botResponse.mongo_data;
        message.currentPrice = botResponse.currentPrice;
      }
    }
    return message;
  });
}

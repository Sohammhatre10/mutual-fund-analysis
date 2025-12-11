import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/api";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === "bot";

  return (
    <div
      className={cn(
        "flex gap-4 animate-fade-in",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Bot className="h-5 w-5 text-primary" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isBot
            ? "bg-card text-card-foreground border border-border"
            : "bg-primary text-primary-foreground"
        )}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
        {message.ticker && (
          <div className="mt-3 rounded-lg bg-secondary/50 p-3">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Stock Info
            </p>
            <p className="font-semibold">{message.ticker}
              {message.currentPrice && (
                <span className="ml-2 text-neon-green text-lg font-medium">${message.currentPrice}</span>
              )}
            </p>
            {message.yfinanceData?.previousClose && (
              <p className="text-sm text-muted-foreground">Previous Close: ${message.yfinanceData.previousClose}</p>
            )}
            {message.mongoData && (
              <div className="mt-3 rounded-lg bg-secondary/50 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  MongoDB Data
                </p>
                {message.mongoData.Security && (
                  <p>Security: {message.mongoData.Security}</p>
                )}
                {message.mongoData["GICS Sector"] && (
                  <p>GICS Sector: {message.mongoData["GICS Sector"]}</p>
                )}
                {message.mongoData["GICS Sub-Industry"] && (
                  <p>GICS Sub-Industry: {message.mongoData["GICS Sub-Industry"]}</p>
                )}
                {message.mongoData["Headquarters Location"] && (
                  <p>Headquarters: {message.mongoData["Headquarters Location"]}</p>
                )}
              </div>
            )}
            {message.yfinanceData && (
              <div className="mt-3 rounded-lg bg-secondary/50 p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Yahoo Finance Data
                </p>
                {message.yfinanceData.shortName && (
                  <p>Short Name: {message.yfinanceData.shortName}</p>
                )}
                {message.yfinanceData.sector && (
                  <p>Sector: {message.yfinanceData.sector}</p>
                )}
                {message.yfinanceData.industry && (
                  <p>Industry: {message.yfinanceData.industry}</p>
                )}
                {message.yfinanceData.marketCap && (
                  <p>Market Cap: {message.yfinanceData.marketCap.$numberLong ? message.yfinanceData.marketCap.$numberLong : message.yfinanceData.marketCap}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {!isBot && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary">
          <User className="h-5 w-5 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
}

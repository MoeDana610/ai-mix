import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
  provider?: string;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn("flex gap-4 mb-6", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      
      <Card className={cn(
        "max-w-[80%] p-4 transition-smooth",
        isUser 
          ? "bg-gradient-primary text-primary-foreground shadow-glow" 
          : "bg-gradient-card border-border shadow-card"
      )}>
        <div className="space-y-2">
          {!isUser && message.model && (
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {message.provider} • {message.model}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          )}
          
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          </div>
          
          {isUser && (
            <div className="text-xs text-primary-foreground/70 text-right">
              {message.timestamp.toLocaleTimeString()}
            </div>
          )}
        </div>
      </Card>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};
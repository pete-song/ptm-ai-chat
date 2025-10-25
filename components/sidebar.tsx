"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, MessageSquare, Trash2 } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId?: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

export function Sidebar({ 
  conversations, 
  currentConversationId, 
  onNewChat, 
  onSelectConversation,
  onDeleteConversation 
}: SidebarProps) {
  return (
    <div className="w-80 border-r bg-muted/30 flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 font-bold text-lg">
            PTM
          </div>
        </div>
        <Button onClick={onNewChat} className="w-full justify-start gap-2">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">
            Recent Conversations
          </h3>
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`p-3 cursor-pointer transition-colors hover:bg-accent ${
                  currentConversationId === conversation.id ? "bg-accent" : ""
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare className="h-3 w-3 text-muted-foreground shrink-0" />
                      <h4 className="text-sm font-medium truncate">
                        {conversation.title}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {conversation.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conversation.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground text-center">
          PTM AI
        </div>
      </div>
    </div>
  );
}

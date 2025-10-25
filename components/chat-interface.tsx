"use client";

import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar } from "@/components/sidebar";
import { ChatMessage } from "@/components/chat-message";
import { ChatInput } from "@/components/chat-input";
import { TypingIndicator } from "@/components/typing-indicator";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

export function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      lastMessage: "",
      timestamp: new Date(),
      messages: []
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentConversationId) {
      handleNewChat();
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date()
    };

    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? {
            ...conv,
            messages: [...conv.messages, userMessage],
            lastMessage: content,
            title: conv.title === "New Chat" ? content.slice(0, 30) + "..." : conv.title
          }
        : conv
    ));

    setIsLoading(true);

    try {
      const currentConv = conversations.find(c => c.id === currentConversationId);
      const conversationHistory = currentConv?.messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      })) || [];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: "assistant",
        timestamp: new Date()
      };

      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? {
              ...conv,
              messages: [...conv.messages, aiMessage],
              lastMessage: aiMessage.content.slice(0, 50) + "..."
            }
          : conv
      ));

      const usageEvent = new CustomEvent('ai-message-sent');
      window.dispatchEvent(usageEvent);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date()
      };

      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? {
              ...conv,
              messages: [...conv.messages, errorMessage],
              lastMessage: errorMessage.content
            }
          : conv
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {sidebarOpen && (
        <div className="lg:block fixed lg:relative inset-y-0 left-0 z-40 w-80">
          <Sidebar
            conversations={conversations}
            currentConversationId={currentConversationId}
            onNewChat={handleNewChat}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
          />
        </div>
      )}

      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col">
        {currentConversationId && currentConversation ? (
          <>
            <ScrollArea ref={scrollAreaRef} className="flex-1">
              <div className="space-y-0">
                {currentConversation.messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && <TypingIndicator />}
              </div>
            </ScrollArea>

            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-muted-foreground">
                Welcome to PTM AI
              </h2>
              <p className="text-muted-foreground">
                Your AI assistant for Patong Mart. Ask questions about products, data, or anything else!
              </p>
              <Button onClick={handleNewChat}>
                Start New Chat
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

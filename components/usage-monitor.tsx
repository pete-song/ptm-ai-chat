"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, DollarSign, MessageSquare } from "lucide-react";

export function UsageMonitor() {
  const [usage, setUsage] = useState({
    messages: 0,
    estimatedCost: 0,
    lastReset: new Date()
  });

  useEffect(() => {
    const savedUsage = localStorage.getItem('ptm-ai-usage');
    if (savedUsage) {
      setUsage(JSON.parse(savedUsage));
    }

    const handleMessageSent = () => {
      const currentUsage = JSON.parse(localStorage.getItem('ptm-ai-usage') || '{"messages":0,"estimatedCost":0,"lastReset":"' + new Date().toISOString() + '"}');
      const newUsage = {
        ...currentUsage,
        messages: currentUsage.messages + 1,
        estimatedCost: currentUsage.estimatedCost + 0.0001
      };
      setUsage(newUsage);
      localStorage.setItem('ptm-ai-usage', JSON.stringify(newUsage));
    };

    window.addEventListener('ai-message-sent', handleMessageSent);
    return () => window.removeEventListener('ai-message-sent', handleMessageSent);
  }, []);

  const updateUsage = () => {
    const newUsage = {
      ...usage,
      messages: usage.messages + 1,
      estimatedCost: usage.estimatedCost + 0.0001 
    };
    setUsage(newUsage);
    localStorage.setItem('ptm-ai-usage', JSON.stringify(newUsage));
  };

  const resetUsage = () => {
    const resetUsage = {
      messages: 0,
      estimatedCost: 0,
      lastReset: new Date()
    };
    setUsage(resetUsage);
    localStorage.setItem('ptm-ai-usage', JSON.stringify(resetUsage));
  };

  return (
    <Card className="p-4 m-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Usage Monitor</h3>
        <Button variant="outline" size="sm" onClick={resetUsage}>
          Reset
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Messages</span>
          </div>
          <Badge variant="secondary">{usage.messages}</Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Est. Cost</span>
          </div>
          <Badge variant="outline">${usage.estimatedCost.toFixed(4)}</Badge>
        </div>
        
        <div className="pt-2 border-t">
          <Button 
            variant="link" 
            size="sm" 
            className="p-0 h-auto text-xs"
            onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Check Google AI Usage
          </Button>
        </div>
      </div>
    </Card>
  );
}

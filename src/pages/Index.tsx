import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Settings, Trash2, Brain, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { ModelSelector, providers } from "@/components/ModelSelector";
import { ApiKeyManager } from "@/components/ApiKeyManager";
import { ChatMessage, Message } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { AIProviderService } from "@/lib/ai-providers";

const Index = () => {
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-5-2025-08-07');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const currentProvider = providers.find(p => p.id === selectedProvider);

  useEffect(() => {
    if (currentProvider && !currentProvider.models.includes(selectedModel)) {
      setSelectedModel(currentProvider.models[0]);
    }
  }, [selectedProvider, selectedModel, currentProvider]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const apiKey = localStorage.getItem(`${selectedProvider}_api_key`);
    
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: `Please configure your ${selectedProvider} API key first.`,
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await AIProviderService.sendMessage(
        selectedProvider,
        selectedModel,
        content,
        apiKey
      );

      if (response.error) {
        throw new Error(response.error);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        model: selectedModel,
        provider: selectedProvider,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    toast({
      title: "Chat Cleared",
      description: "All messages have been removed.",
    });
  };

  const hasApiKey = localStorage.getItem(`${selectedProvider}_api_key`);

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  AI Model Playground
                </h1>
                <p className="text-sm text-muted-foreground">
                  Connect to multiple AI providers with your own API keys
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="border-border"
              >
                <Settings className="w-4 h-4" />
              </Button>
              {messages.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearMessages}
                  className="border-border"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Panel */}
          {showSettings && (
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-gradient-card border-border shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-primary" />
                    AI Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ModelSelector
                    selectedProvider={selectedProvider}
                    selectedModel={selectedModel}
                    onProviderChange={setSelectedProvider}
                    onModelChange={setSelectedModel}
                  />
                </CardContent>
              </Card>

              <ApiKeyManager provider={selectedProvider} />
            </div>
          )}

          {/* Chat Area */}
          <div className={`${showSettings ? 'lg:col-span-3' : 'lg:col-span-4'} space-y-4`}>
            {/* Chat Messages */}
            <Card className="bg-gradient-card border-border shadow-card">
              <CardContent className="p-0">
                <ScrollArea className="h-[60vh]" ref={scrollAreaRef}>
                  <div className="p-6">
                    {messages.length === 0 ? (
                      <div className="text-center text-muted-foreground py-12">
                        <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <h3 className="font-medium mb-2">Ready to chat!</h3>
                        <p className="text-sm">
                          {hasApiKey 
                            ? "Send a message to start your conversation with AI"
                            : "Configure your API key and select a model to begin"
                          }
                        </p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                      ))
                    )}
                  </div>
                </ScrollArea>
                
                <Separator />
                
                <div className="p-6">
                  <ChatInput
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    disabled={!hasApiKey}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
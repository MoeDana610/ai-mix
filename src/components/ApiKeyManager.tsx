import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Key, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyManagerProps {
  provider: string;
}

export const ApiKeyManager = ({ provider }: ApiKeyManagerProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedKey = localStorage.getItem(`${provider}_api_key`);
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, [provider]);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem(`${provider}_api_key`, apiKey.trim());
      toast({
        title: "API Key Saved",
        description: `Your ${provider} API key has been saved locally.`,
      });
    }
  };

  const providerConfig = {
    openai: {
      name: "OpenAI",
      placeholder: "sk-...",
      description: "Enter your OpenAI API key from platform.openai.com"
    },
    anthropic: {
      name: "Anthropic",
      placeholder: "sk-ant-...",
      description: "Enter your Anthropic API key from console.anthropic.com"
    },
    perplexity: {
      name: "Perplexity",
      placeholder: "pplx-...",
      description: "Enter your Perplexity API key from perplexity.ai"
    }
  };

  const config = providerConfig[provider as keyof typeof providerConfig];

  if (!config) return null;

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Key className="w-4 h-4 text-primary" />
          {config.name} API Key
        </CardTitle>
        <CardDescription className="text-xs">
          {config.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Input
            type={showKey ? "text" : "password"}
            placeholder={config.placeholder}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="pr-10 bg-input border-border"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
        <Button 
          onClick={handleSave} 
          size="sm" 
          className="w-full bg-gradient-primary hover:shadow-glow transition-glow"
          disabled={!apiKey.trim()}
        >
          <Save className="w-4 h-4 mr-2" />
          Save API Key
        </Button>
      </CardContent>
    </Card>
  );
};
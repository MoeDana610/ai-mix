import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export interface AIProvider {
  id: string;
  name: string;
  models: string[];
  color: string;
}

const providers: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      'gpt-5-2025-08-07',
      'gpt-5-mini-2025-08-07', 
      'gpt-5-nano-2025-08-07',
      'gpt-4.1-2025-04-14',
      'o3-2025-04-16',
      'o4-mini-2025-04-16',
      'gpt-4.1-mini-2025-04-14',
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-3.5-turbo'
    ],
    color: 'bg-green-500'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: [
      'claude-opus-4-20250514',
      'claude-sonnet-4-20250514',
      'claude-3-5-haiku-20241022',
      'claude-3-7-sonnet-20250219',
      'claude-3-5-sonnet-20241022',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-3-haiku-20240307'
    ],
    color: 'bg-orange-500'
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    models: [
      'llama-3.1-sonar-huge-128k-online',
      'llama-3.1-sonar-large-128k-online',
      'llama-3.1-sonar-small-128k-online'
    ],
    color: 'bg-blue-500'
  }
];

interface ModelSelectorProps {
  selectedProvider: string;
  selectedModel: string;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
}

export const ModelSelector = ({ 
  selectedProvider, 
  selectedModel, 
  onProviderChange, 
  onModelChange 
}: ModelSelectorProps) => {
  const currentProvider = providers.find(p => p.id === selectedProvider);
  
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          AI Provider
        </label>
        <Select value={selectedProvider} onValueChange={onProviderChange}>
          <SelectTrigger className="bg-card border-border">
            <SelectValue placeholder="Select provider" />
          </SelectTrigger>
          <SelectContent>
            {providers.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${provider.color}`} />
                  {provider.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {currentProvider && (
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Model
          </label>
          <Select value={selectedModel} onValueChange={onModelChange}>
            <SelectTrigger className="bg-card border-border">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              {currentProvider.models.map((model) => (
                <SelectItem key={model} value={model}>
                  <div className="flex items-center justify-between w-full">
                    <span>{model}</span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {currentProvider.name}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export { providers };
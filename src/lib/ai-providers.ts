export interface AIResponse {
  content: string;
  error?: string;
}

export class AIProviderService {
  static async sendMessage(
    provider: string, 
    model: string, 
    message: string, 
    apiKey: string
  ): Promise<AIResponse> {
    try {
      switch (provider) {
        case 'openai':
          return await this.sendOpenAIMessage(model, message, apiKey);
        case 'anthropic':
          return await this.sendAnthropicMessage(model, message, apiKey);
        case 'perplexity':
          return await this.sendPerplexityMessage(model, message, apiKey);
        case 'google':
          return await this.sendGoogleMessage(model, message, apiKey);
        case 'xai':
          return await this.sendXAIMessage(model, message, apiKey);
        case 'deepseek':
          return await this.sendDeepSeekMessage(model, message, apiKey);
        case 'mistral':
          return await this.sendMistralMessage(model, message, apiKey);
        case 'cohere':
          return await this.sendCohereMessage(model, message, apiKey);
        default:
          return { content: '', error: 'Unsupported provider' };
      }
    } catch (error) {
      return { 
        content: '', 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  private static async sendOpenAIMessage(model: string, message: string, apiKey: string): Promise<AIResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: message }],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { content: data.choices[0]?.message?.content || 'No response received' };
  }

  private static async sendAnthropicMessage(model: string, message: string, apiKey: string): Promise<AIResponse> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 2000,
        messages: [{ role: 'user', content: message }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { content: data.content[0]?.text || 'No response received' };
  }

  private static async sendPerplexityMessage(model: string, message: string, apiKey: string): Promise<AIResponse> {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: message }],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { content: data.choices[0]?.message?.content || 'No response received' };
  }

  private static async sendGoogleMessage(model: string, message: string, apiKey: string): Promise<AIResponse> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { content: data.candidates[0]?.content?.parts[0]?.text || 'No response received' };
  }

  private static async sendXAIMessage(model: string, message: string, apiKey: string): Promise<AIResponse> {
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: message }],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Grok API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { content: data.choices[0]?.message?.content || 'No response received' };
  }

  private static async sendDeepSeekMessage(model: string, message: string, apiKey: string): Promise<AIResponse> {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: message }],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { content: data.choices[0]?.message?.content || 'No response received' };
  }

  private static async sendMistralMessage(model: string, message: string, apiKey: string): Promise<AIResponse> {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: message }],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { content: data.choices[0]?.message?.content || 'No response received' };
  }

  private static async sendCohereMessage(model: string, message: string, apiKey: string): Promise<AIResponse> {
    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        message: message,
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { content: data.text || 'No response received' };
  }
}
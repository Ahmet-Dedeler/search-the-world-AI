import { useState, useCallback } from 'react';
import OpenAI from 'openai';

interface OpenAIStreamState {
  isLoading: boolean;
  content: string;
  error: string | null;
  isStreaming: boolean;
}

const initialState: OpenAIStreamState = {
  isLoading: false,
  content: '',
  error: null,
  isStreaming: false,
};

export const useOpenAIStream = () => {
  const [state, setState] = useState<OpenAIStreamState>(initialState);

  const streamWebAnalysis = useCallback(async (websiteUrl: string) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      setState(prev => ({ ...prev, error: 'OpenAI API key not configured. Please add your API key in the settings.' }));
      return;
    }

    setState({
      isLoading: true,
      content: '',
      error: null,
      isStreaming: true,
    });

    try {
      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });

      const prompt = `I need you to analyze the website: ${websiteUrl}

Please provide a comprehensive analysis of this website including:
1. What the website is about (purpose, main services/products)
2. Key features and functionality
3. Target audience
4. Business model (if apparent)
5. Technology stack (if visible)
6. Unique value proposition
7. Overall assessment and insights

Please browse the website and provide detailed insights about what makes this website unique and interesting.`;

      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a web analyst expert. Provide detailed, insightful analysis of websites. Use web search capabilities to gather comprehensive information about the given website."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 2000,
      });

      let fullContent = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullContent += content;
          setState(prev => ({
            ...prev,
            content: fullContent,
            isLoading: false,
          }));
        }
      }

      setState(prev => ({
        ...prev,
        isStreaming: false,
        isLoading: false,
      }));

    } catch (error) {
      console.error('OpenAI streaming error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to analyze website',
        isLoading: false,
        isStreaming: false,
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    streamWebAnalysis,
    reset,
  };
}; 
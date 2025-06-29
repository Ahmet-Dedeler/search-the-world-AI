import { useState, useCallback, useEffect } from 'react';
import OpenAI from 'openai';

interface OpenAIDescriptionState {
  isLoading: boolean;
  content: string;
  error: string | null;
  isStreaming: boolean;
}

const initialState: OpenAIDescriptionState = {
  isLoading: false,
  content: '',
  error: null,
  isStreaming: false,
};

export const useOpenAIDescription = (query: string) => {
  const [state, setState] = useState<OpenAIDescriptionState>(initialState);

  const generateDescription = useCallback(async (searchQuery: string) => {
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

      const prompt = `Write an objective and informative description about ${searchQuery}. Include what ${searchQuery} is, its mission, key achievements, and impact in its industry. Make it engaging and educational, around 200-300 words. Focus on making it interesting for someone who might not be familiar with the company or organization.`;

      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a knowledgeable tech writer who explains complex topics in an accessible and engaging way. Write in a conversational tone that's informative but not overly technical."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        stream: true,
        temperature: 0.8,
        max_tokens: 400,
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
      console.error('OpenAI description generation error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to generate description',
        isLoading: false,
        isStreaming: false,
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  // Auto-generate when query changes
  useEffect(() => {
    if (query && query.trim()) {
      generateDescription(query);
    }
  }, [query, generateDescription]);

  return {
    ...state,
    generateDescription,
    reset,
  };
}; 
import { useState, useCallback } from 'react';
import OpenAI from 'openai';
import { 
  RedditService, 
  TechStackService, 
  CompanyService, 
  NewsService,
  RedditPost,
  TechStack,
  CompanyInfo,
  TwitterPost 
} from '../services/apiServices';

interface StreamingState {
  isLoading: boolean;
  content: string;
  error: string | null;
  isStreaming: boolean;
  rawData?: any[];
}

const initialState: StreamingState = {
  isLoading: false,
  content: '',
  error: null,
  isStreaming: false,
  rawData: undefined,
};

// Reddit Sentiment Analysis Hook
export const useRedditSentimentStream = () => {
  const [state, setState] = useState<StreamingState>(initialState);

  const analyzeRedditSentiment = useCallback(async (companyName: string) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      setState(prev => ({ ...prev, error: 'OpenAI API key not configured' }));
      return;
    }

    setState({
      isLoading: true,
      content: '',
      error: null,
      isStreaming: false,
      rawData: undefined,
    });

    try {
      // Get Reddit data
      const redditPosts = await RedditService.searchPosts(companyName);
      setState(prev => ({ ...prev, rawData: redditPosts, isStreaming: true }));

      if (redditPosts.length === 0) {
        setState(prev => ({ 
          ...prev, 
          content: 'No Reddit discussions found for this company.',
          isLoading: false,
          isStreaming: false 
        }));
        return;
      }

      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });

      const redditContext = redditPosts.map(post => 
        `Title: ${post.title}\nSubreddit: r/${post.subreddit}\nScore: ${post.score}\nComments: ${post.num_comments}\nContent: ${post.content.slice(0, 200)}...`
      ).join('\n\n');

      const prompt = `Analyze the sentiment and public opinion about "${companyName}" based on these Reddit discussions:

${redditContext}

Please provide a comprehensive sentiment analysis including:

1. **Overall Sentiment Score** (1-10 scale where 1=very negative, 10=very positive)
2. **Key Themes** - What are people mainly discussing?
3. **Positive Mentions** - What do people like about the company?
4. **Concerns & Criticisms** - What issues or complaints are raised?
5. **Community Perception** - How does the Reddit community view this company?
6. **Trending Topics** - What specific aspects are generating the most discussion?

Focus on extracting genuine public sentiment and provide actionable insights about how the company is perceived by the online community.`;

      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a social media sentiment analyst specializing in Reddit community analysis. Provide detailed, objective sentiment analysis with specific examples and insights. Always include a numerical sentiment score and specific quotes or examples from the discussions when relevant."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        stream: true,
        temperature: 0.4,
        max_tokens: 1500,
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
      console.error('Reddit sentiment analysis error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to analyze Reddit sentiment',
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
    analyzeRedditSentiment,
    reset,
  };
};

// Tech Stack Analysis Hook
export const useTechStackStream = () => {
  const [state, setState] = useState<StreamingState>(initialState);

  const analyzeTechStack = useCallback(async (companyName: string) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      setState(prev => ({ ...prev, error: 'OpenAI API key not configured' }));
      return;
    }

    setState({
      isLoading: true,
      content: '',
      error: null,
      isStreaming: false,
      rawData: undefined,
    });

    try {
      // Get tech stack data
      const domain = `${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
      const techStack = await TechStackService.analyzeTechStack(domain);
      setState(prev => ({ ...prev, rawData: techStack, isStreaming: true }));

      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });

      const techContext = techStack.map(tech => 
        `Technology: ${tech.technology}\nCategory: ${tech.category}\nDescription: ${tech.description}\nConfidence: ${tech.confidence}`
      ).join('\n\n');

      const prompt = `Analyze the technology stack for "${companyName}" based on this detected technology data:

${techContext}

Please provide a comprehensive technology analysis including:

1. **Technology Stack Overview** - Summarize the main technology choices
2. **Architecture Assessment** - What does this stack tell us about their technical approach?
3. **Scalability Analysis** - How well positioned are they for growth?
4. **Security Posture** - What security technologies and practices are evident?
5. **Performance Implications** - How do these choices affect performance?
6. **Innovation Level** - Are they using cutting-edge or proven technologies?
7. **Cost Efficiency** - What does their stack suggest about technical spending?
8. **Team Expertise** - What skills does their team likely possess?

Focus on providing strategic insights about what their technology choices reveal about the company's technical maturity, priorities, and capabilities.`;

      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a senior technology architect and consultant who analyzes company tech stacks to provide strategic insights. Focus on the business implications of technology choices, scalability considerations, and competitive advantages. Provide specific, actionable insights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        stream: true,
        temperature: 0.3,
        max_tokens: 1500,
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
      console.error('Tech stack analysis error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to analyze tech stack',
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
    analyzeTechStack,
    reset,
  };
};

// Company Intelligence Hook
export const useCompanyIntelligenceStream = () => {
  const [state, setState] = useState<StreamingState>(initialState);

  const analyzeCompany = useCallback(async (companyName: string) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      setState(prev => ({ ...prev, error: 'OpenAI API key not configured' }));
      return;
    }

    setState({
      isLoading: true,
      content: '',
      error: null,
      isStreaming: false,
      rawData: undefined,
    });

    try {
      // Get company data
      const companyInfo = await CompanyService.getCompanyInfo(companyName);
      setState(prev => ({ ...prev, rawData: companyInfo ? [companyInfo] : [], isStreaming: true }));

      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });

      const prompt = `Provide a comprehensive business intelligence analysis for "${companyName}". 

${companyInfo ? `Company Information:
Name: ${companyInfo.name}
Description: ${companyInfo.description}
Industry: ${companyInfo.industry}
Employee Count: ${companyInfo.employee_count}
Headquarters: ${companyInfo.headquarters}
Website: ${companyInfo.website}` : 'No specific company data available - provide general analysis.'}

Please provide detailed insights including:

1. **Company Overview** - Mission, vision, and core business
2. **Market Position** - Industry standing and competitive landscape
3. **Business Model** - How they generate revenue and create value
4. **Leadership & Culture** - Management team and organizational culture
5. **Financial Health** - Revenue trends, funding, profitability (if public)
6. **Growth Strategy** - Expansion plans and strategic initiatives
7. **Innovation Focus** - R&D investments and technological advancement
8. **Competitive Advantages** - What sets them apart from competitors
9. **Risks & Challenges** - Key business risks and market challenges
10. **Future Outlook** - Predictions and growth potential

Focus on providing strategic business insights that would be valuable for investors, partners, or competitors analyzing this company.`;

      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a senior business analyst and corporate intelligence expert. Provide comprehensive, strategic analysis of companies including market positioning, competitive advantages, financial insights, and growth prospects. Use professional business terminology and provide actionable insights."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        stream: true,
        temperature: 0.5,
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
      console.error('Company analysis error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to analyze company',
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
    analyzeCompany,
    reset,
  };
};

// News Analysis Hook
export const useNewsAnalysisStream = () => {
  const [state, setState] = useState<StreamingState>(initialState);

  const analyzeNews = useCallback(async (companyName: string) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      setState(prev => ({ ...prev, error: 'OpenAI API key not configured' }));
      return;
    }

    setState({
      isLoading: true,
      content: '',
      error: null,
      isStreaming: false,
      rawData: undefined,
    });

    try {
      // Get news data
      const newsArticles = await NewsService.getCompanyNews(companyName);
      setState(prev => ({ ...prev, rawData: newsArticles, isStreaming: true }));

      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });

      const newsContext = newsArticles.map(article => 
        `Article: ${article.text}\nSource: ${article.author}\nEngagement: ${article.metrics.like_count} likes, ${article.metrics.retweet_count} shares\nDate: ${article.created_at}`
      ).join('\n\n');

      const prompt = `Analyze the latest news and media coverage about "${companyName}" based on these recent articles and social media posts:

${newsContext}

Please provide comprehensive news analysis including:

1. **Breaking News Summary** - Key recent developments and announcements
2. **Media Sentiment** - How is the company being portrayed in the media?
3. **Market Impact** - What effect might this news have on the company's prospects?
4. **Industry Implications** - How does this news affect the broader industry?
5. **Stakeholder Reactions** - How are investors, customers, and partners responding?
6. **Trend Analysis** - What patterns emerge from recent coverage?
7. **Risk Assessment** - Any potential PR or business risks identified?
8. **Competitive Context** - How does this news position them vs competitors?
9. **Future Predictions** - What might happen next based on current trends?

Focus on providing timely, relevant insights about current events and their business implications.`;

      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a financial journalist and media analyst specializing in corporate news analysis. Provide timely, insightful analysis of current events and their business implications. Focus on market impact, investor sentiment, and strategic implications of news developments."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        stream: true,
        temperature: 0.4,
        max_tokens: 1500,
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
      console.error('News analysis error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to analyze news',
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
    analyzeNews,
    reset,
  };
}; 
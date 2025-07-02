// API Services for different data sources
// This replaces the Python backend with direct API calls

export interface RedditPost {
  title: string;
  content: string;
  subreddit: string;
  author: string;
  score: number;
  num_comments: number;
  url: string;
  created_utc: number;
}

export interface TwitterPost {
  text: string;
  author: string;
  created_at: string;
  metrics: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
  };
}

export interface CompanyInfo {
  name: string;
  description: string;
  industry: string;
  employee_count: string;
  headquarters: string;
  website: string;
}

export interface TechStack {
  technology: string;
  category: string;
  description: string;
  confidence: string;
}

// Reddit API Service (using public JSON endpoint)
export class RedditService {
  static async searchPosts(query: string): Promise<RedditPost[]> {
    try {
      const response = await fetch(`https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=10&sort=relevance`);
      const data = await response.json();
      
      return data.data.children.map((post: any) => ({
        title: post.data.title,
        content: post.data.selftext || '',
        subreddit: post.data.subreddit,
        author: post.data.author,
        score: post.data.score,
        num_comments: post.data.num_comments,
        url: `https://reddit.com${post.data.permalink}`,
        created_utc: post.data.created_utc
      }));
    } catch (error) {
      console.error('Reddit API error:', error);
      return [];
    }
  }
}

// Tech Stack Service (using BuiltWith-like functionality)
export class TechStackService {
  static async analyzeTechStack(domain: string): Promise<TechStack[]> {
    try {
      // We'll use a combination of public APIs and web scraping techniques
      // For demo purposes, we can use Wappalyzer API or similar services
      
      // Mock data for now - in real implementation, you'd call:
      // - Wappalyzer API
      // - BuiltWith API (if you have access)
      // - Or scrape meta tags and analyze headers
      
      const mockTechStack: TechStack[] = [
        {
          technology: "React",
          category: "JavaScript Framework",
          description: "A JavaScript library for building user interfaces",
          confidence: "High"
        },
        {
          technology: "Cloudflare",
          category: "CDN",
          description: "Content delivery network and security services",
          confidence: "Medium"
        },
        {
          technology: "Vercel",
          category: "Hosting",
          description: "Platform for frontend frameworks and static sites",
          confidence: "Medium"
        }
      ];
      
      return mockTechStack;
    } catch (error) {
      console.error('Tech Stack API error:', error);
      return [];
    }
  }
}

// Company Information Service
export class CompanyService {
  static async getCompanyInfo(companyName: string): Promise<CompanyInfo | null> {
    try {
      // For demo purposes, we'll create mock data
      // In real implementation, you could use:
      // - Companies House API (UK)
      // - SEC EDGAR API (US)
      // - Crunchbase API
      // - LinkedIn Company API (requires special access)
      
      const mockCompanyInfo: CompanyInfo = {
        name: companyName,
        description: `${companyName} is a leading technology company focused on innovation and digital transformation.`,
        industry: "Technology",
        employee_count: "1000-5000",
        headquarters: "San Francisco, CA",
        website: `https://${companyName.toLowerCase().replace(/\s+/g, '')}.com`
      };
      
      return mockCompanyInfo;
    } catch (error) {
      console.error('Company API error:', error);
      return null;
    }
  }
}

// News/Twitter Service (using alternative sources since Twitter API requires auth)
export class NewsService {
  static async getCompanyNews(companyName: string): Promise<TwitterPost[]> {
    try {
      // For demo purposes, we'll use mock data
      // In real implementation, you could use:
      // - News API
      // - Alpha Vantage News
      // - NewsAPI.org
      // - Reddit mentions
      
      const mockNews: TwitterPost[] = [
        {
          text: `Breaking: ${companyName} announces new AI initiative that could revolutionize the industry`,
          author: "TechCrunch",
          created_at: new Date().toISOString(),
          metrics: {
            retweet_count: 156,
            like_count: 423,
            reply_count: 89
          }
        },
        {
          text: `${companyName}'s latest quarterly results show strong growth in key markets`,
          author: "Bloomberg",
          created_at: new Date(Date.now() - 3600000).toISOString(),
          metrics: {
            retweet_count: 87,
            like_count: 234,
            reply_count: 45
          }
        }
      ];
      
      return mockNews;
    } catch (error) {
      console.error('News API error:', error);
      return [];
    }
  }
} 
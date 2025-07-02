import React, { useState } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { 
  RedditSentimentWidget,
  TechStackWidget,
  CompanyIntelligenceWidget,
  NewsAnalysisWidget 
} from './components/widgets';
import { 
  useRedditSentimentStream,
  useTechStackStream,
  useCompanyIntelligenceStream,
  useNewsAnalysisStream 
} from './hooks/useWidgetStreaming';

function App() {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize all streaming hooks
  const redditStream = useRedditSentimentStream();
  const techStackStream = useTechStackStream();
  const companyStream = useCompanyIntelligenceStream();
  const newsStream = useNewsAnalysisStream();

  const handleSubmit = async (newQuery: string, type: 'company' | 'person' = 'company') => {
    console.log('🚀 Starting simultaneous analysis for:', newQuery);
    setQuery(newQuery);
    setIsAnalyzing(true);

    // Reset all streams
    redditStream.reset();
    techStackStream.reset();
    companyStream.reset();
    newsStream.reset();

    // Start all analyses simultaneously - this is the key improvement!
    console.log('📡 Launching all analyses in parallel...');
    
    // All these calls happen simultaneously, not sequentially
    redditStream.analyzeRedditSentiment(newQuery);
    techStackStream.analyzeTechStack(newQuery);
    companyStream.analyzeCompany(newQuery);
    newsStream.analyzeNews(newQuery);

    console.log('✅ All analyses started - streaming in real-time!');
  };

  const handleStop = () => {
    console.log('⏹️ Stopping all analyses...');
    setIsAnalyzing(false);
    // Reset all streams
    redditStream.reset();
    techStackStream.reset();
    companyStream.reset();
    newsStream.reset();
  };

  const handleReset = () => {
    console.log('🔄 Resetting all data...');
    setQuery('');
    setIsAnalyzing(false);
    redditStream.reset();
    techStackStream.reset();
    companyStream.reset();
    newsStream.reset();
  };

  // Check if any stream is active
  const isAnyStreamActive = redditStream.isLoading || techStackStream.isLoading || 
                           companyStream.isLoading || newsStream.isLoading ||
                           redditStream.isStreaming || techStackStream.isStreaming ||
                           companyStream.isStreaming || newsStream.isStreaming;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Company Intelligence Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time analysis across multiple data sources with AI insights
          </p>
        </div>

        {/* Search Interface */}
        <div className="mb-8">
          <ChatInterface 
            onSubmit={handleSubmit}
            isAnalyzing={isAnyStreamActive}
            onStop={handleStop}
          />
        </div>

        {/* Current Query Display */}
        {query && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
              <span className="text-gray-500 text-sm">Analyzing:</span>
              <span className="font-semibold text-gray-800">{query}</span>
              {isAnyStreamActive && (
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        )}

        {/* Control Buttons */}
        {query && (
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              Reset All
            </button>
            {isAnyStreamActive && (
              <button
                onClick={handleStop}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
              >
                Stop All Analyses
              </button>
            )}
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
          {/* Reddit Sentiment Widget */}
          <RedditSentimentWidget
            content={redditStream.content}
            isLoading={redditStream.isLoading}
            isStreaming={redditStream.isStreaming}
            error={redditStream.error}
            rawData={redditStream.rawData}
          />

          {/* Tech Stack Widget */}
          <TechStackWidget
            content={techStackStream.content}
            isLoading={techStackStream.isLoading}
            isStreaming={techStackStream.isStreaming}
            error={techStackStream.error}
            rawData={techStackStream.rawData}
          />

          {/* Company Intelligence Widget */}
          <CompanyIntelligenceWidget
            content={companyStream.content}
            isLoading={companyStream.isLoading}
            isStreaming={companyStream.isStreaming}
            error={companyStream.error}
            rawData={companyStream.rawData}
          />

          {/* News Analysis Widget */}
          <NewsAnalysisWidget
            content={newsStream.content}
            isLoading={newsStream.isLoading}
            isStreaming={newsStream.isStreaming}
            error={newsStream.error}
            rawData={newsStream.rawData}
          />
        </div>

        {/* Status Footer */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className={`p-2 rounded ${redditStream.isStreaming ? 'bg-orange-100 text-orange-700' : redditStream.content ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              Reddit: {redditStream.isStreaming ? 'Streaming...' : redditStream.content ? 'Complete' : 'Ready'}
            </div>
            <div className={`p-2 rounded ${techStackStream.isStreaming ? 'bg-green-100 text-green-700' : techStackStream.content ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              Tech Stack: {techStackStream.isStreaming ? 'Analyzing...' : techStackStream.content ? 'Complete' : 'Ready'}
            </div>
            <div className={`p-2 rounded ${companyStream.isStreaming ? 'bg-blue-100 text-blue-700' : companyStream.content ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              Company: {companyStream.isStreaming ? 'Analyzing...' : companyStream.content ? 'Complete' : 'Ready'}
            </div>
            <div className={`p-2 rounded ${newsStream.isStreaming ? 'bg-purple-100 text-purple-700' : newsStream.content ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              News: {newsStream.isStreaming ? 'Analyzing...' : newsStream.content ? 'Complete' : 'Ready'}
            </div>
          </div>
        </div>

        {/* Instructions */}
        {!query && (
          <div className="mt-12 text-center">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
              <h3 className="font-semibold text-gray-800 mb-2">How it works</h3>
              <p className="text-gray-600 text-sm">
                Enter a company name above and watch as four AI agents simultaneously analyze:
              </p>
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div className="text-orange-600">📊 Reddit sentiment analysis</div>
                <div className="text-green-600">🔧 Technology stack insights</div>
                <div className="text-blue-600">🏢 Business intelligence</div>
                <div className="text-purple-600">📰 Latest news coverage</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
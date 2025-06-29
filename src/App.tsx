import React, { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { AnalysisCard } from './components/AnalysisCard';
import { MainContent } from './components/MainContent';
import { OpenAIStreamCard } from './components/OpenAIStreamCard';
import { useAnalysisSimulation } from './hooks/useAnalysisSimulation';
import { useOpenAIStream } from './hooks/useOpenAIStream';
import { 
  Globe, 
  Wrench, 
  MessageCircle, 
  Linkedin, 
  Twitter,
  Brain
} from 'lucide-react';

function App() {
  const [query, setQuery] = useState('');
  const [builtWithData, setBuiltWithData] = useState<any>(null);
  const [linkedinData, setLinkedinData] = useState<any>(null);
  const [redditData, setRedditData] = useState<any>(null);
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [linkedinStatus, setLinkedinStatus] = useState('');
  const [redditStatus, setRedditStatus] = useState('');
  const [twitterData, setTwitterData] = useState<any>(null);
  const [twitterStatus, setTwitterStatus] = useState('');
  const [analysisType, setAnalysisType] = useState<'company' | 'person'>('company');
  
  const {
    isAnalyzing,
    currentStep,
    steps,
    activeCards,
    stopAnalysis,
    resetAnalysis,
    setSteps,
    setIsAnalyzing,
    setActiveCards
  } = useAnalysisSimulation();

  const {
    content: openaiContent,
    isLoading: openaiLoading,
    isStreaming: openaiStreaming,
    error: openaiError,
    streamWebAnalysis,
    reset: resetOpenAI
  } = useOpenAIStream();

  // LinkedIn search function
  const searchLinkedIn = async (companyName: string) => {
    console.log('🔍 Starting LinkedIn search for:', companyName);
    setLinkedinStatus('Searching LinkedIn...');
    
    try {
      const response = await fetch("http://localhost:8000/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: companyName }),
      });

      if (!response.ok) {
        throw new Error(`LinkedIn API responded with ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setLinkedinData(result.data);
        setLinkedinStatus('LinkedIn search complete!');
        console.log('✅ LinkedIn search successful:', result.data.length, 'companies found');
      } else {
        throw new Error(result.error || 'LinkedIn search failed');
      }
    } catch (error) {
      console.error("💥 LinkedIn search failed:", error);
      setLinkedinStatus(`LinkedIn search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLinkedinData([]);
    }
  };

  // Reddit search function
  const searchReddit = async (searchTerm: string) => {
    console.log('🔍 Starting Reddit search for:', searchTerm);
    setRedditStatus('Searching Reddit...');
    
    try {
      const response = await fetch("http://localhost:8000/reddit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: searchTerm }),
      });

      if (!response.ok) {
        throw new Error(`Reddit API responded with ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setRedditData(result.data);
        setRedditStatus('Reddit search complete!');
        console.log('✅ Reddit search successful:', result.data.length, 'posts found');
      } else {
        throw new Error(result.error || 'Reddit search failed');
      }
    } catch (error) {
      console.error("💥 Reddit search failed:", error);
      setRedditStatus(`Reddit search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setRedditData([]);
    }
  };

  // Twitter search function
  const searchTwitter = async (searchTerm: string) => {
    console.log('🔍 Starting Twitter search for:', searchTerm);
    setTwitterStatus('Searching Twitter/X...');
    
    try {
      const response = await fetch("http://localhost:8000/twitter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: searchTerm }),
      });

      if (!response.ok) {
        throw new Error(`Twitter API responded with ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setTwitterData(result.data);
        setTwitterStatus('Twitter search complete!');
        console.log('✅ Twitter search successful:', result.data.length, 'posts found');
      } else {
        throw new Error(result.error || 'Twitter search failed');
      }
    } catch (error) {
      console.error("💥 Twitter search failed:", error);
      setTwitterStatus(`Twitter search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTwitterData([]);
    }
  };

  const handleSubmit = async (newQuery: string, type: 'company' | 'person' = 'company') => {
    console.log('🚀 Starting analysis for:', newQuery);
    setQuery(newQuery);
    setAnalysisType(type);
    setIsAnalyzing(true);
    setBuiltWithData(null);
    setLinkedinData(null);
    setRedditData(null);
    setTwitterData(null);
    setAnalysisStatus('Analyzing website...');
    setLinkedinStatus('');
    setRedditStatus('');
    setTwitterStatus('');
    resetOpenAI();
    setActiveCards(['builtwith', 'linkedin', 'reddit', 'twitter', 'openai']);
    setSteps([
      { id: 'builtwith', title: 'BuiltWith Analysis', status: 'active' },
      { id: 'linkedin', title: 'LinkedIn Search', status: 'active' },
      { id: 'reddit', title: 'Reddit Search', status: 'active' },
      { id: 'twitter', title: 'Twitter/X Search', status: 'active' },
      { id: 'openai', title: 'AI Web Analysis', status: 'active' }
    ]);

    // Start all searches immediately
    searchLinkedIn(newQuery);
    searchReddit(newQuery);
    searchTwitter(newQuery);
    
    // Start OpenAI analysis
    streamWebAnalysis(newQuery);
    
    try {
      console.log('📡 Making fetch request to backend...');
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newQuery }),
      });

      console.log('📡 Response status:', response.status, response.statusText);
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      // Read the entire response as text
      const fullResponse = await response.text();
      console.log('📦 Full response received:', fullResponse.length, 'characters');
      
      // Extract JSON from the response
      const resultsMatch = fullResponse.match(/RESULTS:\s*(\[[\s\S]*?\])/);
      
      if (resultsMatch && resultsMatch[1]) {
        const jsonString = resultsMatch[1].trim();
        console.log('💾 Extracted JSON:', jsonString);
        
        try {
          const parsedData = JSON.parse(jsonString);
          setBuiltWithData(parsedData);
          setAnalysisStatus('Analysis complete!');
          console.log('✅ Successfully parsed JSON data:', parsedData.length, 'items');
        } catch (parseError) {
          console.warn('Failed to parse JSON, storing as string:', parseError);
          setBuiltWithData(jsonString);
          setAnalysisStatus('Analysis complete (raw data)');
        }
      } else {
        console.warn('No RESULTS found in response');
        setBuiltWithData(fullResponse);
        setAnalysisStatus('Analysis complete (no structured data)');
      }
      
      setIsAnalyzing(false);
    } catch (error) {
      console.error("💥 Fetch request failed:", error);
      setIsAnalyzing(false);
      setAnalysisStatus(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleReset = () => {
    setQuery('');
    setBuiltWithData(null);
    setLinkedinData(null);
    setRedditData(null);
    setTwitterData(null);
    setAnalysisStatus('');
    setLinkedinStatus('');
    setRedditStatus('');
    setTwitterStatus('');
    resetAnalysis();
    resetOpenAI();
  };

  // Initial state - just the chat interface
  if (!query && !isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full">
          <ChatInterface 
            onSubmit={handleSubmit}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </div>
    );
  }

  // Analysis state - full layout
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-2rem)]">
          {/* Left sidebar - Analysis cards */}
          <div className="col-span-3 space-y-3">
            <OpenAIStreamCard
              title="AI Web Analysis"
              content={openaiContent}
              isLoading={openaiLoading}
              isStreaming={openaiStreaming}
              error={openaiError}
            />

            <AnalysisCard
              title="Reddit Analysis"
              theme="orange"
              icon={MessageCircle}
              isActive={activeCards.includes('reddit')}
              isCompleted={!!redditData && redditData.length > 0}
              content={redditData}
              statusMessage={redditStatus}
            />

            <AnalysisCard
              title="LinkedIn"
              theme="blue"
              icon={Linkedin}
              isActive={activeCards.includes('linkedin')}
              isCompleted={!!linkedinData && linkedinData.length > 0}
              content={linkedinData}
              statusMessage={linkedinStatus}
            />
          </div>

          {/* Main content area */}
          <div className="col-span-6">
            <MainContent
              query={query}
              analysisType={analysisType}
              currentStep={currentStep}
              steps={steps}
            />
          </div>

          {/* Right sidebar - Analysis cards */}
          <div className="col-span-3 space-y-3">
            <AnalysisCard
              title="BuiltWith"
              theme="green"
              icon={Wrench}
              isActive={activeCards.includes('builtwith')}
              isCompleted={!isAnalyzing && !!builtWithData}
              content={builtWithData}
              statusMessage={analysisStatus}
            />

            <AnalysisCard
              title="Twitter/X"
              theme="red"
              icon={Twitter}
              isActive={activeCards.includes('twitter')}
              isCompleted={!!twitterData && twitterData.length > 0}
              content={twitterData}
              statusMessage={twitterStatus}
            />
          </div>
        </div>

        {/* Bottom chat interface */}
        <div className="fixed bottom-4 left-4 right-4">
          <div className="max-w-2xl mx-auto">
            <ChatInterface 
              onSubmit={handleSubmit}
              isAnalyzing={isAnalyzing}
              onStop={stopAnalysis}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
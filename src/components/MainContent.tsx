import React from 'react';
import { Search, ExternalLink, Brain, Sparkles } from 'lucide-react';
import { useOpenAIDescription } from '../hooks/useOpenAIDescription';

interface MainContentProps {
  query: string;
  analysisType: 'company' | 'person';
  currentStep: string;
  steps: Array<{
    id: string;
    title: string;
    status: 'pending' | 'active' | 'completed';
    results?: string[];
  }>;
}

export const MainContent: React.FC<MainContentProps> = ({ 
  query, 
  analysisType,
  currentStep, 
  steps 
}) => {
  const { content, isLoading, isStreaming, error } = useOpenAIDescription(query);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full overflow-hidden">
      <div className="p-6 h-full overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Search className="text-gray-600" size={20} />
            <h1 className="text-xl font-semibold text-gray-800">
              {query}
            </h1>
          </div>
          <p className="text-gray-500 text-sm">
            Gathering comprehensive information about {analysisType === 'company' ? 'the company' : 'this person'}, 
            {analysisType === 'company' ? ' people who work there,' : ' their professional background,'} 
            social media presence, and more.
          </p>
        </div>

        {/* OpenAI Description Section - Only show when there's a query */}
        {query && query.trim() && (
          <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="text-blue-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">About {query}</h2>
              {isStreaming && (
                <div className="flex items-center gap-1">
                  <Sparkles className="text-blue-500 animate-pulse" size={16} />
                  <span className="text-xs text-blue-600">Generating...</span>
                </div>
              )}
            </div>
            
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            
            {isLoading && !content && (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Generating AI description...</span>
              </div>
            )}
            
            {content && (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {content}
                  {isStreaming && (
                    <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1"></span>
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          {steps.map((step) => (
            <div key={step.id} className="border-l-2 border-gray-100 pl-4 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${
                  step.status === 'completed' ? 'bg-green-500' :
                  step.status === 'active' ? 'bg-blue-500 animate-pulse' :
                  'bg-gray-300'
                }`} />
                <h3 className={`font-medium text-sm ${
                  step.status === 'active' ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {step.title}
                </h3>
              </div>
              
              {step.status === 'active' && (
                <div className="text-xs text-gray-500 ml-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span>Searching...</span>
                  </div>
                </div>
              )}

              {step.results && step.results.length > 0 && (
                <div className="ml-4 space-y-1">
                  {step.results.map((result, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
                      <ExternalLink size={12} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{result}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {currentStep && (
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 text-blue-700">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              <span className="font-medium text-sm">Currently: {currentStep}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
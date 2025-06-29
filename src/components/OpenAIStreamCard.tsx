import React from 'react';
import { Brain, CheckCircle, AlertCircle } from 'lucide-react';

interface OpenAIStreamCardProps {
  title: string;
  content: string;
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
}

export const OpenAIStreamCard: React.FC<OpenAIStreamCardProps> = ({
  title,
  content,
  isLoading,
  isStreaming,
  error,
}) => {
  const formatContent = (text: string) => {
    // Split by numbered points and format nicely
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.match(/^\d+\./)) {
        return (
          <div key={index} className="mb-2">
            <span className="font-semibold text-blue-700">{line}</span>
          </div>
        );
      }
      if (line.trim() && !line.match(/^[#*-]/)) {
        return (
          <p key={index} className="mb-2 text-gray-700 leading-relaxed">
            {line}
          </p>
        );
      }
      if (line.match(/^[#]/)) {
        return (
          <h4 key={index} className="font-bold text-gray-800 mt-3 mb-2">
            {line.replace(/^#+\s*/, '')}
          </h4>
        );
      }
      return null;
    }).filter(Boolean);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Brain className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
              <p className="text-xs text-gray-500">AI-Powered Web Analysis</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isStreaming && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Streaming...</span>
              </div>
            )}
            {error && (
              <AlertCircle size={16} className="text-red-500" />
            )}
            {!isLoading && !isStreaming && !error && content && (
              <CheckCircle size={16} className="text-green-500" />
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle size={16} />
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {isLoading && !content && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Initializing AI analysis...</span>
          </div>
        )}

        {content && (
          <div 
            className="max-h-96 overflow-y-auto prose prose-sm max-w-none"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e1 #f1f5f9',
            }}
          >
            <div className="space-y-2">
              {formatContent(content)}
            </div>
            
            {isStreaming && (
              <div className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1"></div>
            )}
          </div>
        )}

        {!content && !isLoading && !error && (
          <div className="text-center py-8 text-gray-400">
            <Brain size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Ready to analyze website</p>
          </div>
        )}
      </div>
    </div>
  );
}; 
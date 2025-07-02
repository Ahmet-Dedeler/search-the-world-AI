import React from 'react';
import { Building, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';

interface CompanyIntelligenceWidgetProps {
  content: string;
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  rawData?: any[];
}

export const CompanyIntelligenceWidget: React.FC<CompanyIntelligenceWidgetProps> = ({
  content,
  isLoading,
  isStreaming,
  error,
  rawData
}) => {
  const formatBusinessContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      // Format numbered points
      if (line.match(/^\d+\.\s*\*\*/)) {
        const [, number, title, description] = line.match(/^(\d+\.\s*)\*\*(.*?)\*\*(.*)/) || [];
        return (
          <div key={index} className="mb-3">
            <div className="font-semibold text-blue-700 text-sm">
              {number}<span className="text-blue-800">{title}</span>
            </div>
            {description && (
              <div className="text-blue-600 text-sm ml-4">{description}</div>
            )}
          </div>
        );
      }
      
      // Format headers
      if (line.match(/^[#]/)) {
        return (
          <h4 key={index} className="font-bold text-blue-800 mt-4 mb-2 text-sm">
            {line.replace(/^#+\s*/, '')}
          </h4>
        );
      }
      
      // Format regular content
      if (line.trim() && !line.match(/^[*-]/)) {
        return (
          <p key={index} className="mb-2 text-blue-700 leading-relaxed text-sm">
            {line}
          </p>
        );
      }
      
      return null;
    }).filter(Boolean);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <Building className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Company Intelligence</h3>
              <p className="text-xs text-gray-500">Business insights & analysis</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isStreaming && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <Sparkles className="animate-pulse" size={16} />
                <span>Analyzing...</span>
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
        
        {/* Data summary */}
        {rawData && rawData.length > 0 && (
          <div className="mt-2 text-xs text-blue-600">
            🏢 Company data analyzed
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 overflow-hidden flex flex-col">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <div className="flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle size={16} />
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {isLoading && !content && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <span className="text-sm text-gray-500">Gathering company intelligence...</span>
            </div>
          </div>
        )}

        {content && (
          <div className="flex-1 overflow-y-auto space-y-2">
            {formatBusinessContent(content)}
            
            {isStreaming && (
              <div className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1"></div>
            )}
          </div>
        )}

        {!content && !isLoading && !error && (
          <div className="flex-1 flex items-center justify-center text-center text-gray-400">
            <div>
              <Building size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Ready to analyze company</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 
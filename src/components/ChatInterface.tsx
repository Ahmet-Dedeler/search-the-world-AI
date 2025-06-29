import React, { useState } from 'react';
import { Send, StopCircle, HardDrive, Globe, Building, User } from 'lucide-react';

interface ChatInterfaceProps {
  onSubmit: (query: string, type?: 'company' | 'person') => void;
  isAnalyzing: boolean;
  onStop?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onSubmit, 
  isAnalyzing, 
  onStop 
}) => {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'company' | 'person' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query.trim(), selectedType || 'company');
      setSelectedType(null);
    }
  };

  const handleTypeSelect = (type: 'company' | 'person') => {
    setSelectedType(type);
    if (query.trim()) {
      onSubmit(query.trim(), type);
      setSelectedType(null);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent p-4">
            {/* Input field at top */}
            <div className="mb-3">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ask anything"
                rows={1}
                className="w-full text-base bg-transparent border-none outline-none resize-none min-h-[24px] max-h-32 text-gray-500 placeholder-gray-500"
                disabled={isAnalyzing}
                style={{ 
                  lineHeight: '1.5'
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                }}
              />
            </div>
            
            {/* Button row */}
            <div className="flex items-stretch">
              {/* Left side buttons */}
              <div className="flex items-center gap-2 pr-3 border-r border-gray-100">
                <button
                  type="button"
                  onClick={() => handleTypeSelect('company')}
                  className={`p-2 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
                    selectedType === 'company' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'
                  }`}
                  title="Analyze Company"
                >
                  <Building size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeSelect('person')}
                  className={`p-2 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
                    selectedType === 'person' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'
                  }`}
                  title="Analyze Person"
                >
                  <User size={18} />
                </button>
              </div>

              {/* Spacer to push right buttons to the end */}
              <div className="flex-1"></div>

              {/* Right side buttons */}
              <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  title="Hardware Analysis"
                >
                  <HardDrive size={18} />
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                  title="Web Analysis"
                >
                  <Globe size={18} />
                </button>
                
                {isAnalyzing && onStop ? (
                  <button
                    type="button"
                    onClick={onStop}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                    title="Stop Analysis"
                  >
                    <StopCircle size={18} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!query.trim()}
                    className="p-2 bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
                    title="Send"
                  >
                    <Send size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
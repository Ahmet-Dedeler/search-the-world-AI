import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Settings } from 'lucide-react';

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
  initialApiKey?: string;
}


// good stuff
export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ 
  onApiKeyChange, 
  initialApiKey = '' 
}) => {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [showKey, setShowKey] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Load API key from localStorage or environment variable on component mount
    const savedApiKey = localStorage.getItem('openai_api_key') || 
                       import.meta.env.VITE_OPENAI_API_KEY || '';
    if (savedApiKey) {
      setApiKey(savedApiKey);
      onApiKeyChange(savedApiKey);
    }
  }, [onApiKeyChange]);

  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
    onApiKeyChange(newApiKey);
    
    // Save to localStorage
    if (newApiKey) {
      localStorage.setItem('openai_api_key', newApiKey);
    } else {
      localStorage.removeItem('openai_api_key');
    }
  };

  const hasApiKey = apiKey && apiKey.length > 0;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Settings size={16} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            OpenAI Settings
          </span>
          <div className={`text-xs px-2 py-1 rounded-full ${
            hasApiKey ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {hasApiKey ? 'Configured' : 'Not Set'}
          </div>
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-3">
          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-1">
              OpenAI API Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="api-key"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="sk-..."
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Your API key is stored locally in your browser</p>
            <p>• Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Platform</a></p>
            <p>• Make sure your API key has access to GPT-4o model</p>
          </div>
        </div>
      )}
    </div>
  );
}; 
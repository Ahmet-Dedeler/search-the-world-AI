import React from 'react';
import { LucideProps, CheckCircle, RefreshCw } from 'lucide-react';

interface AnalysisCardProps {
  title: string;
  theme: 'green' | 'blue' | 'orange' | 'red' | 'yellow';
  icon: React.ElementType<LucideProps>;
  isActive: boolean;
  isCompleted: boolean;
  isLarge?: boolean;
  content?: any;
  statusMessage?: string;
}

const themeClasses = {
  green: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    icon: 'text-green-500',
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    icon: 'text-blue-500',
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    icon: 'text-orange-500',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    icon: 'text-red-500',
  },
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    icon: 'text-yellow-500',
  },
};

export const AnalysisCard: React.FC<AnalysisCardProps> = ({
  title,
  theme,
  icon,
  isActive,
  isCompleted,
  isLarge = false,
  content,
  statusMessage,
}) => {
  const Icon = icon;

  return (
    <div className={`rounded-xl shadow-sm border border-gray-100 overflow-hidden ${isActive ? themeClasses[theme].bg : 'bg-white'}`}>
      {/* Header section - fixed height */}
      <div className="relative p-4 h-20 flex flex-col justify-between">
        <div>
          <Icon size={24} className={themeClasses[theme].icon} />
          <h3 className={`mt-1 font-semibold text-sm ${themeClasses[theme].text}`}>{title}</h3>
        </div>
        {isActive && !isCompleted && (
          <div className="absolute top-2 right-2 animate-spin">
            <RefreshCw size={14} className={themeClasses[theme].icon} />
          </div>
        )}
        {isCompleted && (
          <div className="absolute top-2 right-2">
            <CheckCircle size={14} className={themeClasses[theme].icon} />
          </div>
        )}
      </div>
      
      {/* Status message */}
      {isActive && !isCompleted && statusMessage && (
        <div className="px-4 pb-2">
          <p className="text-xs text-gray-500">{statusMessage}</p>
        </div>
      )}

      {/* Content section - scrollable */}
      {content && (
        <div className={`${isActive ? themeClasses[theme].bg : 'bg-gray-50'} border-t ${isActive ? 'border-green-200' : 'border-gray-100'}`}>
          <div 
            className="max-h-64 overflow-y-auto hover-scrollbar" 
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onMouseEnter={(e) => {
              // For Firefox and IE/Edge
              e.currentTarget.style.scrollbarWidth = 'thin';
              e.currentTarget.style.msOverflowStyle = 'auto';
            }}
            onMouseLeave={(e) => {
              // For Firefox and IE/Edge
              e.currentTarget.style.scrollbarWidth = 'none';
              e.currentTarget.style.msOverflowStyle = 'none';
            }}
          >
            {Array.isArray(content) ? (
              <div className="p-3 space-y-2">
                {content.map((item, index) => (
                  <div key={index} className={`${isActive ? 'bg-white bg-opacity-90 border-l-2 hover:bg-opacity-100' : 'bg-white border-l-2 border-blue-200 hover:bg-blue-50'} p-2 rounded transition-colors shadow-sm ${
                    isActive ? (theme === 'green' ? 'border-green-400' : theme === 'blue' ? 'border-blue-400' : 'border-gray-400') : ''
                  }`}>
                    {/* Handle BuiltWith data structure */}
                    {item.category ? (
                      <>
                        <div className={`font-medium text-xs ${isActive ? themeClasses[theme].text : 'text-gray-800'} flex items-center gap-1`}>
                          <span className="text-green-500">🔧</span>
                          {item.name}
                        </div>
                        <div className={`capitalize text-xs mt-0.5 ${isActive ? themeClasses[theme].icon : 'text-gray-500'} font-medium`}>
                          📂 {item.category}
                        </div>
                        {item.description && (
                          <div className={`text-xs mt-1 ${isActive ? 'text-green-600' : 'text-gray-600'} leading-tight`}>
                            {item.description.length > 120 ? `${item.description.substring(0, 120)}...` : item.description}
                          </div>
                        )}
                        {item.firstDetected && (
                          <div className={`text-xs mt-0.5 ${isActive ? 'text-green-400' : 'text-gray-400'} flex items-center gap-1`}>
                            📅 First detected: {item.firstDetected}
                          </div>
                        )}
                        {item.lastDetected && item.lastDetected !== item.firstDetected && (
                          <div className={`text-xs mt-0.5 ${isActive ? 'text-green-400' : 'text-gray-400'} flex items-center gap-1`}>
                            🔄 Last seen: {item.lastDetected}
                          </div>
                        )}
                        {item.tag && (
                          <div className={`inline-block mt-1 px-2 py-0.5 ${isActive ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-600'} rounded-full text-xs font-medium`}>
                            {item.tag}
                          </div>
                        )}
                      </>
                    ) : item.title ? (
                      /* Handle Reddit data structure */
                      <>
                        <div className={`font-medium text-xs ${isActive ? themeClasses[theme].text : 'text-gray-800'} leading-tight`}>
                          <span className="text-orange-500">🗣️</span>
                          {item.title.length > 100 ? `${item.title.substring(0, 100)}...` : item.title}
                        </div>
                        {item.communityName && (
                          <div className={`text-xs mt-0.5 ${isActive ? themeClasses[theme].icon : 'text-gray-500'} font-medium`}>
                            📍 {item.communityName}
                          </div>
                        )}
                        {item.username && (
                          <div className={`text-xs mt-0.5 ${isActive ? 'text-orange-400' : 'text-gray-400'}`}>
                            👤 u/{item.username}
                          </div>
                        )}
                        {item.body && item.body !== "Thumbnail: default" && (
                          <div className={`text-xs mt-1 ${isActive ? 'text-orange-600' : 'text-gray-600'} leading-tight`}>
                            {item.body.length > 150 ? `${item.body.substring(0, 150)}...` : item.body}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          {item.upVotes !== undefined && (
                            <span className={`${isActive ? 'text-orange-400' : 'text-gray-400'}`}>
                              ⬆️ {item.upVotes}
                            </span>
                          )}
                          {item.numberOfComments !== undefined && (
                            <span className={`${isActive ? 'text-orange-400' : 'text-gray-400'}`}>
                              💬 {item.numberOfComments}
                            </span>
                          )}
                        </div>
                        {item.flair && (
                          <div className={`inline-block mt-1 px-2 py-0.5 ${isActive ? 'bg-orange-200 text-orange-700' : 'bg-gray-200 text-gray-600'} rounded-full text-xs font-medium`}>
                            {item.flair}
                          </div>
                        )}
                      </>
                    ) : item.text || item.full_text ? (
                      /* Handle Twitter data structure */
                      <>
                        <div className={`font-medium text-xs ${isActive ? themeClasses[theme].text : 'text-gray-800'} leading-tight`}>
                          <span className="text-blue-500">🐦</span>
                          {(item.text || item.full_text).length > 120 ? `${(item.text || item.full_text).substring(0, 120)}...` : (item.text || item.full_text)}
                        </div>
                        {item.user && (
                          <div className={`text-xs mt-0.5 ${isActive ? themeClasses[theme].icon : 'text-gray-500'} font-medium`}>
                            👤 @{item.user.username || item.user.screen_name}
                            {item.user.name && ` (${item.user.name})`}
                          </div>
                        )}
                        {item.author && (
                          <div className={`text-xs mt-0.5 ${isActive ? themeClasses[theme].icon : 'text-gray-500'} font-medium`}>
                            👤 {item.author.name || item.author.username}
                            {item.author.username && ` (@${item.author.username})`}
                          </div>
                        )}
                        {item.created_at && (
                          <div className={`text-xs mt-0.5 ${isActive ? 'text-red-400' : 'text-gray-400'}`}>
                            📅 {new Date(item.created_at).toLocaleDateString()}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          {item.retweet_count !== undefined && (
                            <span className={`${isActive ? 'text-red-400' : 'text-gray-400'}`}>
                              🔄 {item.retweet_count}
                            </span>
                          )}
                          {item.favorite_count !== undefined && (
                            <span className={`${isActive ? 'text-red-400' : 'text-gray-400'}`}>
                              ❤️ {item.favorite_count}
                            </span>
                          )}
                          {item.reply_count !== undefined && (
                            <span className={`${isActive ? 'text-red-400' : 'text-gray-400'}`}>
                              💬 {item.reply_count}
                            </span>
                          )}
                        </div>
                        {item.hashtags && item.hashtags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.hashtags.slice(0, 3).map((hashtag: string, hashIndex: number) => (
                              <div key={hashIndex} className={`inline-block px-2 py-0.5 ${isActive ? 'bg-red-200 text-red-700' : 'bg-gray-200 text-gray-600'} rounded-full text-xs font-medium`}>
                                #{hashtag}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      /* Handle LinkedIn data structure */
                      <>
                        <div className={`font-medium text-xs ${isActive ? themeClasses[theme].text : 'text-gray-800'}`}>
                          {item.name || 'Unknown Company'}
                        </div>
                        {item.tagline && (
                          <div className={`text-xs mt-0.5 ${isActive ? themeClasses[theme].icon : 'text-gray-500'} italic`}>
                            {item.tagline}
                          </div>
                        )}
                        {item.industry && Array.isArray(item.industry) && (
                          <div className={`text-xs mt-0.5 ${isActive ? themeClasses[theme].icon : 'text-gray-500'}`}>
                            🏢 {item.industry.join(', ')}
                          </div>
                        )}
                        {item.headquarter && (
                          <div className={`text-xs mt-0.5 ${isActive ? 'text-blue-400' : 'text-gray-400'}`}>
                            📍 {item.headquarter.city}, {item.headquarter.country}
                          </div>
                        )}
                        {item.employeeCount && (
                          <div className={`text-xs mt-0.5 ${isActive ? 'text-blue-400' : 'text-gray-400'}`}>
                            👥 {item.employeeCount.toLocaleString()} employees
                          </div>
                        )}
                        {item.foundedOn && item.foundedOn.year && (
                          <div className={`text-xs mt-0.5 ${isActive ? 'text-blue-400' : 'text-gray-400'}`}>
                            📅 Founded {item.foundedOn.year}
                          </div>
                        )}
                        {item.description && (
                          <div className={`text-xs mt-1 ${isActive ? themeClasses[theme].text : 'text-gray-600'} leading-tight`}>
                            {item.description.length > 150 ? `${item.description.substring(0, 150)}...` : item.description}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : typeof content === 'string' ? (
              <div className="p-3">
                <div className={`whitespace-pre-wrap font-mono text-xs leading-relaxed ${isActive ? 'text-green-800' : 'text-gray-700'}`}>{content}</div>
              </div>
            ) : (
              <div className="p-3">
                <pre className={`whitespace-pre-wrap font-mono text-xs leading-relaxed ${isActive ? 'text-green-800' : 'text-gray-700'}`}>{JSON.stringify(content, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import VoiceResponsePlayer from "./VoiceResponsePlayer";

interface MessageItemProps {
  content: string;
  sender: 'user' | 'ai';
  senderName: string;
  isGenerating: boolean;
  isPlaying: boolean;
  onPlayAudio: (text: string) => void;
  scores?: {
    empathy_score: number;
    clarity_score: number;
    inclusion_score: number;
  };
  exchangeNumber?: number;
}

const MessageItem: React.FC<MessageItemProps> = ({
  content,
  sender,
  senderName,
  isGenerating,
  isPlaying,
  onPlayAudio,
  scores,
  exchangeNumber
}) => {
  const isUser = sender === 'user';
  
  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600 bg-green-100';
    if (score >= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreDescription = (score: number, category: string) => {
    const level = score >= 4 ? 'strong' : score >= 3 ? 'good' : 'needs improvement';
    return `${category} score: ${score} out of 5, ${level}`;
  };

  if (isUser) {
    return (
      <div 
        className="flex items-start gap-3 justify-end" 
        role="article" 
        aria-label={`Your response ${exchangeNumber || ''}`}
      >
        <div className="flex-1 text-right">
          <div className="bg-blue-500 text-white rounded-lg p-3 inline-block max-w-xs">
            <p className="text-sm" role="text">
              {content}
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-1" role="text">You</p>
        </div>
        <div 
          className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium"
          role="img"
          aria-label="Your avatar"
        >
          U
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex items-start gap-3" 
      role="article" 
      aria-label={`${senderName} ${exchangeNumber ? `response ${exchangeNumber}` : 'message'}`}
    >
      <div 
        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium"
        role="img"
        aria-label={`${senderName} avatar`}
      >
        {senderName.charAt(0) || 'A'}
      </div>
      <div className="flex-1">
        <div className="bg-gray-100 rounded-lg p-3">
          <div className="flex items-start justify-between">
            <p className="text-sm flex-1" role="text">
              {content}
            </p>
            <VoiceResponsePlayer
              text={content}
              isGenerating={isGenerating}
              isPlaying={isPlaying}
              onPlayAudio={() => onPlayAudio(content)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-gray-500" role="text">
            {senderName}
          </p>
          {scores && (
            <div 
              className="flex items-center gap-2 text-xs"
              role="group"
              aria-label="Performance scores for this exchange"
            >
              <span 
                className={`px-2 py-1 rounded ${getScoreColor(scores.empathy_score)}`}
                aria-label={getScoreDescription(scores.empathy_score, 'Empathy')}
                title={getScoreDescription(scores.empathy_score, 'Empathy')}
              >
                E:{scores.empathy_score}
              </span>
              <span 
                className={`px-2 py-1 rounded ${getScoreColor(scores.clarity_score)}`}
                aria-label={getScoreDescription(scores.clarity_score, 'Clarity')}
                title={getScoreDescription(scores.clarity_score, 'Clarity')}
              >
                C:{scores.clarity_score}
              </span>
              <span 
                className={`px-2 py-1 rounded ${getScoreColor(scores.inclusion_score)}`}
                aria-label={getScoreDescription(scores.inclusion_score, 'Inclusion')}
                title={getScoreDescription(scores.inclusion_score, 'Inclusion')}
              >
                I:{scores.inclusion_score}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;

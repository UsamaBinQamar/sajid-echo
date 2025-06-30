
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageItem from './MessageItem';

interface DialogueMessagesProps {
  exchanges: any[];
  scenario: any;
  aiCharacterState: any;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const DialogueMessages: React.FC<DialogueMessagesProps> = ({
  exchanges,
  scenario,
  aiCharacterState,
  messagesEndRef
}) => {
  return (
    <ScrollArea className="flex-1 panel-ai-scroll theme-transition">
      <div className="p-6 space-y-6">
        {/* Initial scenario message */}
        <div className="card-ai p-4 border-l-4 border-primary glow-ai-soft">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center glow-ai-soft">
              <span className="text-primary-foreground text-sm font-semibold">
                {scenario?.character_persona?.name?.charAt(0) || 'AI'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-primary mb-1">
                {scenario?.character_persona?.name || 'AI Character'}
              </p>
              <p className="text-foreground leading-relaxed">
                {scenario?.initial_situation}
              </p>
            </div>
          </div>
        </div>

        {/* Exchange messages */}
        {exchanges.map((exchange, index) => (
          <div key={exchange.id || index} className="space-y-4">
            {/* User message */}
            <div className="card-ai p-4">
              <MessageItem
                content={exchange.user_response}
                sender="user"
                senderName="You"
                isGenerating={false}
                isPlaying={false}
                onPlayAudio={() => {}}
                exchangeNumber={index + 1}
              />
            </div>
            
            {/* AI response */}
            {exchange.ai_response && (
              <div className="card-ai p-4 border-l-2 border-primary/30">
                <MessageItem
                  content={exchange.ai_response}
                  sender="ai"
                  senderName={scenario?.character_persona?.name || 'AI Character'}
                  isGenerating={false}
                  isPlaying={false}
                  onPlayAudio={() => {}}
                  scores={{
                    empathy_score: exchange.empathy_score,
                    clarity_score: exchange.clarity_score,
                    inclusion_score: exchange.inclusion_score
                  }}
                  exchangeNumber={index + 1}
                />
              </div>
            )}
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default DialogueMessages;

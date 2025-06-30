
import React from 'react';

interface LiveAnnouncementsProps {
  content: string;
}

const LiveAnnouncements: React.FC<LiveAnnouncementsProps> = ({ content }) => {
  return (
    <div 
      aria-live="polite" 
      aria-atomic="true" 
      className="sr-only"
      role="status"
    >
      {content}
    </div>
  );
};

export default LiveAnnouncements;

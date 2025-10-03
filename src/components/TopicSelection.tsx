import React from 'react';

interface TopicSelectionProps {
  onTopicSelect: (topic: string) => void;
}

const topics = [
  { id: 'wellness', name: 'Wellness', description: 'Health, fitness, and wellbeing topics' },
  { id: 'tech', name: 'Tech Trends', description: 'Latest technology and innovation trends' },
  { id: 'history', name: 'World History', description: 'Historical events and figures' },
  { id: 'science', name: 'Science', description: 'Scientific concepts and discoveries' },
  { id: 'arts', name: 'Arts & Culture', description: 'Art, music, and cultural topics' },
];

const TopicSelection: React.FC<TopicSelectionProps> = ({ onTopicSelect }) => {
  const getIconStyle = (id: string) => {
    const colors: { [key: string]: string } = {
      wellness: '#10b981',
      tech: '#3b82f6',
      history: '#f59e0b',
      science: '#8b5cf6',
      arts: '#ef4444',
    };
    return {
      backgroundColor: colors[id] || '#6b7280',
      width: '64px',
      height: '64px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 15px',
      fontSize: '24px',
      color: 'white',
    };
  };

  return (
    <div className="topic-selection">
      <div className="topic-header">
        <h1>Select a Quiz Topic</h1>
        <p>Choose a topic and AI will generate a personalized quiz for you</p>
      </div>
      
      <div className="topics-grid">
        {topics.map((topic) => (
          <div 
            key={topic.id} 
            className="topic-card"
            onClick={() => onTopicSelect(topic.name)}
          >
            <div className="topic-icon" style={getIconStyle(topic.id)}>
              {topic.id.charAt(0).toUpperCase()}
            </div>
            <h3>{topic.name}</h3>
            <p>{topic.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicSelection;
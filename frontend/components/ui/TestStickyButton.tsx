import React from 'react';
import { StickyNote } from 'lucide-react';

const TestStickyButton: React.FC = () => {
  return (
    <button
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        background: '#ff6b6b',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        zIndex: 9999,
      }}
      onClick={() => alert('Sticky Notes Button Clicked!')}
      title="Test Sticky Notes"
    >
      <StickyNote size={24} />
    </button>
  );
};

export default TestStickyButton;

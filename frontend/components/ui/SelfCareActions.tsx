import React from 'react';
import { Wind, Sun, Heart, Star } from 'lucide-react';
import styles from '../../styles/components/ui/SelfCareActions.module.css';

const SelfCareActions: React.FC = () => {
  const actions = [
    {
      icon: Wind,
      title: 'Breathing Break',
      description: 'Take a 2-min mindful breath',
    },
    {
      icon: Sun,
      title: 'Daily Affirmation',
      description: 'Embrace your strength',
    },
    {
      icon: Heart,
      title: 'Gratitude Note',
      description: 'What made you smile today?',
    },
    {
      icon: Star,
      title: 'Quick Journal',
      description: 'Write a small win',
    },
  ];

  return (
    <div className={styles.actionsGrid}>
      {actions.map((action) => {
        const IconComponent = action.icon;
        return (
          <button key={action.title} className={styles.actionCard}>
            <IconComponent className={styles.icon} />
            <h4>{action.title}</h4>
            <p>{action.description}</p>
          </button>
        );
      })}
    </div>
  );
};

export default SelfCareActions;
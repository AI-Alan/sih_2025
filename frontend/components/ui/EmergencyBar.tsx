import React from 'react';
import { AlertCircle } from 'lucide-react';
import styles from '../../styles/components/ui/EmergencyBar.module.css';

const EmergencyBar: React.FC = () => {
  return (
    <div className={styles.emergencyBar}>
      <AlertCircle className={styles.icon} />
      <span>Need immediate support?</span>
      <a href="/crisis-help" className={styles.helpButton}>
        Get Crisis Help
      </a>
    </div>
  );
};

export default EmergencyBar;
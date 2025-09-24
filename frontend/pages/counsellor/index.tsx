import React from 'react';
import CounsellorLayout from '../../components/counsellor/CounsellorLayout';

const CounsellorDashboardPage: React.FC = () => {
  return (
    <CounsellorLayout title="Counsellor Dashboard - Mann Mitra" description="Counsellor portal">
      <div style={{ display: 'grid', gap: 16 }}>
        <h1 style={{ margin: 0 }}>Counsellor Dashboard</h1>
        <p>This is a dummy counsellor dashboard page. Restrict access to users with role = counsellor.</p>
      </div>
    </CounsellorLayout>
  );
};

export default CounsellorDashboardPage;

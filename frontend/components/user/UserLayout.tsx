import React from 'react';
import Layout from '../layout/Layout';
import ProtectedRoute from '../auth/ProtectedRoute';
import UserHeader from './UserHeader';
import UserSidebar from './UserSidebar';

interface Props {
  title?: string;
  description?: string;
  children: React.ReactNode;
  withSidebar?: boolean;
}

const containerStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16, padding: '1rem 0', minHeight: '100%' };
const contentOnlyStyle: React.CSSProperties = { padding: '1rem 0', minHeight: '100%' };
const mainCard: React.CSSProperties = { background: '#fff', border: '1px solid #eaeef2', borderRadius: 12, padding: 16, minHeight: '100%' };

const UserLayout: React.FC<Props> = ({ title, description, children, withSidebar = true }) => {
  return (
    <ProtectedRoute>
      <Layout title={title} description={description} header={<UserHeader />}>
        {withSidebar ? (
          <div style={containerStyle}>
            <UserSidebar />
            <div style={mainCard}>{children}</div>
          </div>
        ) : (
          <div style={contentOnlyStyle}>{children}</div>
        )}
      </Layout>
    </ProtectedRoute>
  );
};

export default UserLayout;

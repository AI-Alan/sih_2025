import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Activity, BookOpen, MessageCircle } from 'lucide-react';

const itemStyle: React.CSSProperties = { display: 'flex', gap: 10, alignItems: 'center', padding: '10px 12px', borderRadius: 8, color: '#0f172a', textDecoration: 'none' };
const activeStyle: React.CSSProperties = { background: '#f0fdf4', color: '#16a34a' };

const UserSidebar: React.FC = () => {
  const router = useRouter();
  const isActive = (href: string) => router.pathname === href;

  return (
    <aside style={{ width: 260, padding: 16, borderRight: '1px solid #eaeef2', background: '#ffffff', borderRadius: 12, height: 'fit-content', position: 'sticky', top: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Home size={18} />
        <strong>My Space</strong>
      </div>
      <nav style={{ display: 'grid', gap: 6 }}>
        <Link href="/dashboard" style={{ ...itemStyle, ...(isActive('/dashboard') ? activeStyle : {}) }}>
          <Home size={16} /> Dashboard
        </Link>
        <Link href="/interventions" style={{ ...itemStyle, ...(isActive('/interventions') ? activeStyle : {}) }}>
          <Activity size={16} /> Wellness Kit
        </Link>
        <Link href="/resources" style={{ ...itemStyle, ...(isActive('/resources') ? activeStyle : {}) }}>
          <BookOpen size={16} /> Guides
        </Link>
        <Link href="/contact" style={{ ...itemStyle, ...(isActive('/contact') ? activeStyle : {}) }}>
          <MessageCircle size={16} /> Reach Out
        </Link>
      </nav>
    </aside>
  );
};

export default UserSidebar;

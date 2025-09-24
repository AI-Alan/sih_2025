import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { Home, Activity, BookOpen, MessageCircle, User as UserIcon, LogOut } from 'lucide-react';

const bar: React.CSSProperties = { background: '#ffffffcc', backdropFilter: 'saturate(180%) blur(8px)', borderBottom: '1px solid #eaeef2', position: 'sticky', top: 0, zIndex: 40 };
const inner: React.CSSProperties = { maxWidth: 1200, margin: '0 auto', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' };
const left: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10 };
const right: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10 };
const link: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 8, color: '#0f172a', textDecoration: 'none' };
const primary: React.CSSProperties = { background: '#14532d', color: '#fff' };

const UserHeader: React.FC = () => {
  const { logout, user } = useAuth();
  return (
    <header style={bar}>
      <div style={inner}>
        <div style={left}>
          <Link href="/" style={{ ...link, fontWeight: 700 }}>
            <Home size={18} /> Mann Mitra
          </Link>
          <nav style={{ display: 'flex', gap: 8 }}>
            <Link href="/dashboard" style={link}><UserIcon size={16} /> Dashboard</Link>
            <Link href="/interventions" style={link}><Activity size={16} /> Wellness Kit</Link>
            <Link href="/resources" style={link}><BookOpen size={16} /> Guides</Link>
            <Link href="/contact" style={link}><MessageCircle size={16} /> Reach Out</Link>
          </nav>
        </div>
        <div style={right}>
          <span style={{ opacity: 0.7, marginRight: 6 }}>{user?.firstName || 'you'}</span>
          <button onClick={logout} style={{ ...link, ...primary, border: 'none' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, Heart, User, LogIn, UserPlus, Home, Info, Activity, BookOpen, MessageCircle } from 'lucide-react';
import styles from '../../styles/components/layout/Header.module.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const navigation = [
    { name: 'My Space', href: '/', icon: Home, description: 'Your personal sanctuary' },
    { name: 'Our Story', href: '/about', icon: Info, description: 'Why we care' },
    { name: 'Wellness Kit', href: '/interventions', icon: Activity, description: 'Tools for you' },
    { name: 'Guides', href: '/resources', icon: BookOpen, description: 'Help & resources' },
    { name: 'Reach Out', href: '/contact', icon: MessageCircle, description: 'We\'re here for you' },
  ];

  const isActive = (href: string) => router.pathname === href;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <Heart className={styles.logoIcon} />
            <span className={styles.logoText}>Mann Mitra</span>
          </Link>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`${styles.navLink} ${isActive(item.href) ? styles.active : ''}`}
                    title={item.description}
                  >
                    <IconComponent size={16} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.authButtons}>
          <Link href="/login" className={styles.authButton}>
            <LogIn size={18} />
            Join In
          </Link>
          <Link href="/register" className={`${styles.authButton} ${styles.primary}`}>
            <UserPlus size={18} />
            Start My Journey
          </Link>
        </div>

        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            <ul className={styles.mobileNavList}>
              {navigation.map((item) => {
                const IconComponent = item.icon;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`${styles.mobileNavLink} ${isActive(item.href) ? styles.active : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <IconComponent size={18} />
                      <div>
                        <span>{item.name}</span>
                        <small>{item.description}</small>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className={styles.mobileAuthButtons}>
              <Link
                href="/login"
                className={styles.mobileAuthButton}
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn size={18} />
                Join In
              </Link>
              <Link
                href="/register"
                className={`${styles.mobileAuthButton} ${styles.primary}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <UserPlus size={18} />
                Start My Journey
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

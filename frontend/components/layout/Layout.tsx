import React from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import NatureBackground from '../ui/NatureBackground';
import ChatButton from '../ui/ChatButton';
import EmergencyBar from '../ui/EmergencyBar';
import styles from '../../styles/components/layout/Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  title = 'Mann Mitra - Digital Psychological Intervention Platform',
  description = 'A comprehensive digital platform providing psychological interventions and mental health support for college students.',
  keywords = 'mental health, psychological intervention, college students, therapy, counseling, mindfulness, CBT'
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.layout}>
        {/* <EmergencyBar /> */}
        <NatureBackground />
        <Header />
        <main className={styles.main}>
          {children}
        </main>
        <Footer />
        <ChatButton />
      </div>
    </>
  );
};

export default Layout;

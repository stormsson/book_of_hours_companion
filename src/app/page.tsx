'use client';

import React, { useState } from 'react';
import TabContainer from '../components/TabContainer';
import AppSettings from '../components/AppSettings';
import { TrackableType } from '../types';
import styles from './page.module.scss';

import { Settings } from '../types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TrackableType>('books');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('settings');
    if (!savedSettings) {
      localStorage.setItem('settings', JSON.stringify({ isSimplifiedView: false }));
      return { isSimplifiedView: false };
    }
    return savedSettings ? JSON.parse(savedSettings) : { isSimplifiedView: false };
  });

  return (
    <main className={styles.main}>
      <header className={styles.stickyHeader}>
        <AppSettings
          isSettingsOpen={isSettingsOpen}
          setIsSettingsOpen={setIsSettingsOpen}
          settings={settings}
          setSettings={setSettings}
        />
      </header>
      <h1 className={styles.title}>Trackable Items Companion</h1>
      <TabContainer 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        settings={settings}
      />
    </main>
  );
}
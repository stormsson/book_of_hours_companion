'use client';

import React, { useState, useEffect } from 'react';
import TabContainer from '../components/TabContainer';
import AppSettings from '../components/AppSettings';
import { TrackableType } from '../types';
import styles from './page.module.scss';

import { DBUserSettings } from '../types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TrackableType>('books');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<DBUserSettings>({ options: { isSimplifiedView: false }, known_books: [], known_craftable_items: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/userSettings');
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const userSettings = await response.json();
        console.log("userSettings", userSettings);
        setSettings(userSettings);
      } catch (error) {
        console.error('Error fetching user settings:', error);
        // Fallback to default settings if fetch fails
        // setSettings({ isSimplifiedView: false });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }

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
        setSettings={setSettings}

      />
    </main>
  );
}
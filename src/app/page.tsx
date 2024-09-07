'use client';

import React, { useState, useEffect } from 'react';
import TabContainer from '../components/TabContainer';
import AppSettings from '../components/AppSettings/AppSettings';
import TodoList from '../components/TodoList/TodoList'; // Add this import
import { TrackableType } from '../types';
import styles from './page.module.scss';

import { DBUserSettings } from '../types';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TrackableType>('books');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTodoOpen, setIsTodoOpen] = useState(false); // Add this state
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
        setSettings(userSettings);
      } catch (error) {
        console.error('Error fetching user settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className={styles.main}>
      <header className={styles.stickyHeader}>
        <div className={styles.headerIcons}>
          <TodoList
            isTodoOpen={isTodoOpen}
            setIsTodoOpen={setIsTodoOpen}
            settings={settings}
            setSettings={setSettings}
          />
          <AppSettings
            isSettingsOpen={isSettingsOpen}
            setIsSettingsOpen={setIsSettingsOpen}
            settings={settings}
            setSettings={setSettings}
          />
        </div>
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
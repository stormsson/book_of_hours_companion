import React from 'react';
import BooksTab from './BooksTab';
import CraftableItemsTab from './CraftableItemsTab';
import { TrackableType } from '../types';
import styles from './TabContainer.module.scss';
import { DBUserSettings } from '../types';
interface TabContainerProps {
  activeTab: TrackableType;
  setActiveTab: (tab: TrackableType) => void;
  settings: DBUserSettings;
  setSettings: (settings: DBUserSettings) => void;
}

function TabContainer({ activeTab, setActiveTab, settings, setSettings }: TabContainerProps) {
  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button onClick={() => setActiveTab('books')} className={activeTab === 'books' ? styles.active : ''}>
          Books
        </button>
        <button onClick={() => setActiveTab('craftableItems')} className={activeTab === 'craftableItems' ? styles.active : ''}>
          Craftable Items
        </button>
      </div>
      <div className={styles.tabContent}>
        {activeTab === 'books' && <BooksTab settings={settings} setSettings={setSettings} />}
        {activeTab === 'craftableItems' && <CraftableItemsTab settings={settings} setSettings={setSettings} />}
      </div>
    </div>
  );
}

export default TabContainer;
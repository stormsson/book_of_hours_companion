'use client';

import React, { useState } from 'react';
import TabContainer from '../components/TabContainer';
import { TrackableType } from '../types';
import styles from './page.module.scss';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TrackableType>('books');

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Trackable Items Companion</h1>
      <TabContainer activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  );
}
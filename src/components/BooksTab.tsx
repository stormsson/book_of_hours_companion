// import Papa from 'papaparse';
import React, { useEffect, useState } from 'react';
import TrackableTable from './TrackableTable';
import { Book } from '../types';
import styles from './Tab.module.scss';
import { DBUserSettings } from '../types';
import { book_columns } from '../utils/constants';

import { fetchBooks } from '../app/actions';

function BooksTab({ settings, setSettings }: { settings: DBUserSettings, setSettings: (settings: DBUserSettings) => void }) {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    // In a real application, you would fetch this data from the CSV file
    // For now, we'll use a placeholder fetch function
    fetchBooks().then(setBooks);
  }, []);



  return (
    <div className={styles.container}>
      <TrackableTable items={books} columns={book_columns} storageKey="knownBooks" isCraftableItems={false} settings={settings} setSettings={setSettings} />
    </div>
  );
}

export default BooksTab;
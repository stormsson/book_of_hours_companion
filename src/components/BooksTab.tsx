import Papa from 'papaparse';
import React, { useEffect, useState } from 'react';
import TrackableTable from './TrackableTable';
import { Book } from '../types';
import styles from './Tab.module.scss';
import { Settings } from '../types';
import { book_columns } from '../utils/constants';
function BooksTab({ settings }: { settings: Settings }) {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    // In a real application, you would fetch this data from the CSV file
    // For now, we'll use a placeholder fetch function
    fetchBooks().then(setBooks);
  }, []);



  return (
    <div className={styles.container}>
      <TrackableTable items={books} columns={book_columns} storageKey="knownBooks" isCraftableItems={false} isSimplifiedView={settings.isSimplifiedView} />
    </div>
  );
}

export default BooksTab;

// Placeholder function to simulate fetching books data
async function fetchBooks(): Promise<Book[]> {
  try {
    const response = await fetch('/data/books.csv');
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          const books: Book[] = results.data.map((book: any, index) => ({
            id: `book-${index}`,
            ...book
          }));
          resolve(books);
        },
        error: (error: any) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}
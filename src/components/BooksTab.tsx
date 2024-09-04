import Papa from 'papaparse';
import React, { useEffect, useState } from 'react';
import TrackableTable from './TrackableTable';
import { Book } from '../types';
import styles from './Tab.module.scss';

function BooksTab() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    // In a real application, you would fetch this data from the CSV file
    // For now, we'll use a placeholder fetch function
    fetchBooks().then(setBooks);
  }, []);

  const columns = ['Book', 'Aspect', 'Level', 'Memory', 'Memory Aspects', 'Lesson', 'Lessons', 'Lesson Aspects', 'Price', 'Language', 'Type', 'Period', 'Contaminated', 'Description'];

  return (
    <div className={styles.container}>
      <TrackableTable items={books} columns={columns} storageKey="knownBooks" isCraftableItems={false} />
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
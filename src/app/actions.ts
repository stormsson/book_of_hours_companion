'use server'

import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';
import { Book, CraftableItem } from '../types';

export async function fetchBooks(): Promise<Book[]> {
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', 'books.csv');
        const csvText = await fs.readFile(filePath, 'utf-8');
        
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

export async function fetchCraftableItems(): Promise<CraftableItem[]> {
    console.log('Fetching craftable items...');
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', 'crafting.csv');
        const csvText = await fs.readFile(filePath, 'utf-8');
        
        return new Promise((resolve, reject) => {
            Papa.parse(csvText, {
                header: true,
                complete: (results) => {
                    const craftableItems: CraftableItem[] = results.data.map((item: any, index) => ({
                        id: `craftable-${index}`,
                        ...item
                    }));
                    resolve(craftableItems);
                },
                error: (error: any) => {
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error('Error fetching craftable items:', error);
        return [];
    }
}
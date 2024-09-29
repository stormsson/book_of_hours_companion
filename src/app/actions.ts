'use server'

import fs from 'fs/promises';
import path from 'path';
import Papa from 'papaparse';
import { Book, CraftableItem } from '../types';
import { bulkInsertCraftingInfo, getCraftingInfo, updateCraftingInfo } from '@/utils/mongoUtils';
import { DBCraftingItem } from '../types';
import { generateCraftingInfoWithAnthropic, generateCraftingInfoWithOpenAI } from '@/utils/aiServices';
import { Omit } from 'utility-types';
import { getOption } from '@/utils/mongoUtils';

export async function fetchBooks(): Promise<Book[]> {
    try {

        const dataBooks = await getOption("data_books");
        if (dataBooks && dataBooks.option_value) {
            try {
                const books: Book[] = JSON.parse(dataBooks.option_value as string);
                return books;
            } catch (parseError) {
                console.error('Error parsing data_books JSON:', parseError);
                return [];
            }
        } else {
            console.error('data_books option not found or empty');
            return [];
        }


        // const filePath = path.join(process.cwd(),'src', 'app','data', 'books.csv');
        // const csvText = await fs.readFile(filePath, 'utf-8');
        
        // return new Promise((resolve, reject) => {
        //     Papa.parse(csvText, {
        //         header: true,
        //         complete: (results) => {
        //             const books: Book[] = results.data.map((book: any, index) => ({
        //                 id: `book-${index}`,
        //                 ...book
        //             }));
        //             resolve(books);
        //         },
        //         error: (error: any) => {
        //             reject(error);
        //         }
        //     });
        // });
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
}

// New function to handle bulk insert
const _bulkInsert = async (craftableItems: CraftableItem[]): Promise<boolean> => {
    const bulkInsertData = craftableItems.map(item => ({
        item_id: item.id,
        name: item.Item
    }));

    return await bulkInsertCraftingInfo(bulkInsertData);
};

export async function fetchCraftableItems(): Promise<CraftableItem[]> {
    try {

        const data_craftable_items = await getOption("data_craftable_items");
        if (data_craftable_items && data_craftable_items.option_value) {
            try {
                const items: CraftableItem[] = JSON.parse(data_craftable_items.option_value as string);
                return items;
            } catch (parseError) {
                console.error('Error parsing data_books JSON:', parseError);
                return [];
            }
        } else {
            console.error('data_books option not found or empty');
            return [];
        }


        // const filePath = path.join(process.cwd(),'src', 'app', 'data', 'crafting.csv');
        // const csvText = await fs.readFile(filePath, 'utf-8');
        
        // return new Promise((resolve, reject) => {
        //     Papa.parse(csvText, {
        //         header: true,
        //         complete: async (results) => {
        //             const craftableItems: CraftableItem[] = results.data.map((item: any, index) => ({
        //                 id: `craftable-${index}`,
        //                 ...item
        //             }));
        //             resolve(craftableItems);
        //         },
        //         error: (error: any) => {
        //             reject(error);
        //         }
        //     });
        // });
    } catch (error) {
        console.error('Error fetching craftable items:', error);
        return [];
    }
}

const checkParameter = (item_id: string): boolean => {
    const regexp = /^craftable-\d+$/;
    return regexp.test(item_id);
};

export async function fetchCraftingInfo(item_id: string, item_name: string): Promise<Omit<DBCraftingItem, '_id'> | null> {
    if (!checkParameter(item_id)) {
        console.error('Invalid item_id parameter:', item_id);
        return null;
    }

    try {
        let craftingInfo: DBCraftingItem | null = await getCraftingInfo(item_id);
        
        if (craftingInfo && !craftingInfo.crafting_info) {
            console.log("craftingInfo not found, generating")
            // Generate crafting info if it doesn't exist
            const generatedInfo = await generateCraftingInfoWithAnthropic(craftingInfo.name);
            
            // Update the record with the generated info
            const updateResult = await updateCraftingInfo(item_id, item_name, generatedInfo);
            
            if (updateResult) {
                // Fetch the updated record
                craftingInfo = await getCraftingInfo(item_id);
            } else {
                console.error('Failed to update crafting info');
            }
        }
        
        if (craftingInfo) {
            // Create a new object without the _id field
            const { _id, ...craftingInfoWithoutId } = craftingInfo;
            return craftingInfoWithoutId;
        }
        
        return null;
    } catch (error) {
        console.error('Error fetching or generating crafting info:', error);
        return null;
    }
}
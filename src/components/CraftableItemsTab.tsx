import Papa from 'papaparse';
import React, { useEffect, useState } from 'react';
import TrackableTable from './TrackableTable';
import { CraftableItem } from '../types';
import styles from './Tab.module.scss';

function CraftableItemsTab() {
  const [craftableItems, setCraftableItems] = useState<CraftableItem[]>([]);

  useEffect(() => {
    // In a real application, you would fetch this data from the CSV file
    // For now, we'll use a placeholder fetch function
    fetchCraftableItems().then(setCraftableItems);
  }, []);

  const columns = ['Item', 'Aspect', 'Level', 'Required Skill', 'Extra Requirement', 'Result Aspects'];

  const item_types = ['Beast', 'Beverage', 'Carnivore', 'Device', 'Fabric', 'Flower', 'Fruit', 'Herbivore', 'Liquid', 'Mark', 'Material', 'Memory', 'Orichalcum', 'Persistent Memory', 'Remains', 'Silver', 'Sustenance', 'Wood']

  return (
    <div className={styles.container}>
      <TrackableTable 
        items={craftableItems} 
        columns={columns} 
        storageKey="knownCraftableItems" 
        isCraftableItems={true} 
        item_types={item_types} // Pass the item_types prop
      />
    </div>
  );
}

export default CraftableItemsTab;

// Placeholder function to simulate fetching craftable items data
async function fetchCraftableItems(): Promise<CraftableItem[]> {
  try {
    const response = await fetch('/data/crafting.csv');
    const csvText = await response.text();
    
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
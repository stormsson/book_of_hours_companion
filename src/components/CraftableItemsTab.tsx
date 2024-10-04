import Papa from 'papaparse';
import React, { useEffect, useState } from 'react';
import TrackableTable from './TrackableTable';
import { CraftableItem } from '../types';
import styles from './Tab.module.scss';
import { DBUserSettings } from '../types';
import { fetchCraftableItems } from '../app/actions';

function CraftableItemsTab({ settings, setSettings }: { settings: DBUserSettings, setSettings: (settings: DBUserSettings) => void }) {
  const [craftableItems, setCraftableItems] = useState<CraftableItem[]>([]);


  useEffect(() => {
    const cachedItems = localStorage.getItem('cachedItems');
    if (cachedItems) {
      setCraftableItems(JSON.parse(cachedItems));
    } else {
      fetchCraftableItems().then(fetchedItems => {
        setCraftableItems(fetchedItems);
        localStorage.setItem('cachedItems', JSON.stringify(fetchedItems));
      });
    }
  }, []);

  const columns = ['Item', 'Aspect', 'Level', 'Required Skill', 'Extra Requirement', 'Result Aspects'];

  const item_types = ['Beast', 'Beverage', 'Carnivore', 'Device', 'Fabric', 'Flower', 'Fruit', 'Herbivore', 'Ink', 'Liquid', 'Mark', 'Material', 'Memory', 'Orichalcum', 'Persistent Memory', 'Remains', 'Silver', 'Sustenance', 'Thing', 'Wood']

  return (
    <div className={styles.container}>
      <TrackableTable 
        items={craftableItems} 
        columns={columns} 
        storageKey="knownCraftableItems" 
        isCraftableItems={true} 
        item_types={item_types} // Pass the item_types prop
        settings={settings}
        setSettings={setSettings}
      />
    </div>
  );
}

export default CraftableItemsTab;

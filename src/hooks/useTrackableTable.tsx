import { useState } from 'react';
import { DBUserSettings } from '../types';

export const useTrackableTable = (storageKey: string, settings: DBUserSettings, setSettings: (settings: DBUserSettings) => void) => {

  let defaultKnownItems: Set<string> = new Set();
  if (storageKey === 'knownBooks') {
    defaultKnownItems = new Set(settings.known_books);
  } else if (storageKey === 'knownCraftableItems') {
    defaultKnownItems = new Set(settings.known_craftable_items);
  }

  const [knownItems, setKnownItems] = useState<Set<string>>(defaultKnownItems);

  const toggleKnownItem = async (itemId: string) => {
    const updatedKnownItems = new Set(knownItems);
    if (updatedKnownItems.has(itemId)) {
      updatedKnownItems.delete(itemId);
    } else {
      updatedKnownItems.add(itemId);
    }
    setKnownItems(updatedKnownItems);
    
    try {
      // const response = await fetch('/api/userSettings');
      // const userSettings = await response.json();
      let userSettings = settings;
      if (userSettings) {
        if (storageKey === 'knownBooks') {
          userSettings.known_books = Array.from(updatedKnownItems);
          setSettings({ ...settings, known_books: Array.from(updatedKnownItems) });
        } else if (storageKey === 'knownCraftableItems') {
          userSettings.known_craftable_items = Array.from(updatedKnownItems);
        }
        await fetch('/api/userSettings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userSettings),
        });
      }
    } catch (error) {
      console.error('Error updating user settings:', error);
    }
  };

  return { knownItems, toggleKnownItem };
};
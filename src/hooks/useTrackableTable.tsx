import { useState, useEffect } from 'react';

export const useTrackableTable = (storageKey: string) => {
  const [knownItems, setKnownItems] = useState<Set<string>>(new Set());
  const [isSimplifiedView, setIsSimplifiedView] = useState(() => {
    const settings = localStorage.getItem(`settings`);
    const savedView = settings ? JSON.parse(settings).isSimplifiedView : false;
    return savedView ? JSON.parse(savedView) : false;
  });

  useEffect(() => {
    const storedKnownItems = localStorage.getItem(storageKey);
    if (storedKnownItems) {
      setKnownItems(new Set(JSON.parse(storedKnownItems)));
    }
  }, [storageKey]);

  const toggleKnownItem = (itemId: string) => {
    const updatedKnownItems = new Set(knownItems);
    if (updatedKnownItems.has(itemId)) {
      updatedKnownItems.delete(itemId);
    } else {
      updatedKnownItems.add(itemId);
    }
    setKnownItems(updatedKnownItems);
    localStorage.setItem(storageKey, JSON.stringify(Array.from(updatedKnownItems)));
  };

  return { knownItems, isSimplifiedView, toggleKnownItem };
};
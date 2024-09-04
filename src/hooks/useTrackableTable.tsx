import { useState, useEffect } from 'react';

export const useTrackableTable = (storageKey: string) => {
  const [knownItems, setKnownItems] = useState<Set<string>>(new Set());
  const [isSimplifiedView, setIsSimplifiedView] = useState(() => {
    const savedView = localStorage.getItem(`${storageKey}_simplifiedView`);
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

  const toggleSimplifiedView = () => {
    const newValue = !isSimplifiedView;
    setIsSimplifiedView(newValue);
    localStorage.setItem(`${storageKey}_simplifiedView`, JSON.stringify(newValue));
  };

  return { knownItems, isSimplifiedView, toggleKnownItem, toggleSimplifiedView };
};
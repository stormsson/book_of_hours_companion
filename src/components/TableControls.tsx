import React from 'react';
import styles from './TableControls.module.scss';

interface TableControlsProps {
  filterText: string;
  setFilterText: (text: string) => void;
  aspectFilter: string;
  setAspectFilter: (text: string) => void;
  showOnlyKnown: boolean;
  setShowOnlyKnown: (show: boolean) => void;
  isCraftableItems: boolean;
}

function TableControls({ 
  filterText, 
  setFilterText, 
  aspectFilter, 
  setAspectFilter, 
  showOnlyKnown, 
  setShowOnlyKnown,
  isCraftableItems
}: TableControlsProps) {
  return (
    <div className={styles.controls}>
      <input
        type="text"
        placeholder="Filter items..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className={styles.filterInput}
      />
      <input
        type="text"
        placeholder={isCraftableItems ? "Result Aspects filter..." : "Memory Aspects filter..."}
        value={aspectFilter}
        onChange={(e) => setAspectFilter(e.target.value)}
        className={styles.filterInput}
      />
      <label className={styles.showKnownLabel}>
        <input
          type="checkbox"
          checked={showOnlyKnown}
          onChange={() => setShowOnlyKnown(!showOnlyKnown)}
        />
        Show only known items
      </label>
    </div>
  );
}

export default TableControls;
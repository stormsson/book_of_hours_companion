import React, { useState, useEffect, useMemo } from 'react';
import { TrackableItem } from '../types';
import styles from './TrackableTable.module.scss';
import Tooltip from './Tooltip';
import TableControls from './TableControls';
import { useTrackableTable } from '../hooks/useTrackableTable';
import { WikiUrl, includesIgnoreCase } from '../utils/stringHelpers'; 
import { tooltip_columns, wiki_columns, ellipsis_columns } from '../utils/constants';
import { DBUserSettings } from '../types';
import { fetchCraftingInfo } from '../app/actions';
import Markdown from 'react-markdown';

interface TrackableTableProps {
  items: TrackableItem[];
  columns: string[];
  storageKey: string;
  isCraftableItems: boolean;
  item_types?: string[];
  settings: DBUserSettings;
  setSettings: (settings: DBUserSettings) => void;
}

function TrackableTable({ items, columns, storageKey, isCraftableItems, item_types, settings, setSettings }: TrackableTableProps) {
  const [showOnlyKnown, setShowOnlyKnown] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [aspectFilter, setAspectFilter] = useState('');
  const [itemTypeFilter, setItemTypeFilter] = useState('');
  const [openCraftingInfo, setOpenCraftingInfo] = useState<string | null>(null);
  const [craftingInfoContent, setCraftingInfoContent] = useState<string | null>(null);

  let isSimplifiedView = settings.options.isSimplifiedView;

  // Use the custom hook
  const { knownItems, toggleKnownItem } = useTrackableTable(storageKey, settings, setSettings);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (showOnlyKnown && !knownItems.has(item.id)) return false;
      if (filterText && !Object.values(item).some(value => 
        includesIgnoreCase(value, filterText) // Use the helper function
      )) return false;
      if (aspectFilter) {
        const aspectColumn = isCraftableItems ? 'Result Aspects' : 'Memory Aspects';
        if (!item[aspectColumn]?.toLowerCase().includes(aspectFilter.toLowerCase())) return false;
      }
      if (isCraftableItems && itemTypeFilter && !item['Item']?.toLowerCase().includes(itemTypeFilter.toLowerCase()) ) return false; // Filter by item type
      return true;
    });
  }, [items, showOnlyKnown, knownItems, filterText, aspectFilter, itemTypeFilter, isCraftableItems]);

  const sortedAndFilteredItems = useMemo(() => {
    return filteredItems.sort((a, b) => {
      const aKnown = knownItems.has(a.id);
      const bKnown = knownItems.has(b.id);
      if (aKnown !== bKnown) {
        return aKnown ? -1 : 1;
      }
      return a[columns[0]].localeCompare(b[columns[0]]);
    });
  }, [filteredItems, knownItems, columns]);

  const visibleColumns = useMemo(() => {
    if (isSimplifiedView) {
      if (isCraftableItems) {
        return columns.filter(column => !['Level', 'Extra Requirement'].includes(column));
      } else {
        return ['Book', 'Language', 'Memory', 'Memory Aspects', 'Lesson'];
      }
    }
    return columns;
  }, [isSimplifiedView, columns, isCraftableItems]);

  const handleFetchCraftingInfo = async (item_id: string, item_name: string) => {
    if (openCraftingInfo === item_id) {
      setOpenCraftingInfo(null);
      setCraftingInfoContent(null);
    } else {
      setOpenCraftingInfo(item_id);
      const info = await fetchCraftingInfo(item_id, item_name);
      setCraftingInfoContent(info?.crafting_info || 'No crafting information available.');
    }
  };

  const renderCell = (item: TrackableItem, column: string, index: number) => {
    if (tooltip_columns.includes(column)) {
      return (
        <Tooltip text={item[column]}>
          <span className={styles.descriptionIcon}>🔍</span>
        </Tooltip>
      );
    } else {
      return (
        <div className={ellipsis_columns.includes(column) ? styles.ellipsisCell : ''}>
          {wiki_columns.includes(column) && (
            <a href={WikiUrl(item[column])} target="_blank" rel="noopener noreferrer" className={styles.wikiLink}>
              [🔗]
            </a>
          )}

          {index === 0 && isCraftableItems && (
            <span>
              <a onClick={() => handleFetchCraftingInfo(item.id, item['Item'])}>
                <span className={styles.descriptionIcon}>[{openCraftingInfo === item.id ? '▼' : '❔'}]</span>
              </a>
            </span>
          )}
          <span> {item[column]}</span>
        </div>
      );
    }    
  };

  return (
    <div className={styles.wrapper}>
      <TableControls
        filterText={filterText}
        setFilterText={setFilterText}
        aspectFilter={aspectFilter}
        setAspectFilter={setAspectFilter}
        showOnlyKnown={showOnlyKnown}
        setShowOnlyKnown={setShowOnlyKnown}
        isCraftableItems={isCraftableItems}
      />
      {isCraftableItems && item_types && (
        <div className={styles.itemTypeFilter}>
          <select value={itemTypeFilter} onChange={(e) => setItemTypeFilter(e.target.value)}>
            <option value="">All Item Types</option>
            {item_types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      )}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.knownColumn}>Known</th>
              {visibleColumns.map((column, index) => (
                <th key={column} className={index === 0 ? styles.firstColumn : ''}>
                   {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredItems.map(item => (
              <React.Fragment key={item.id}>
                <tr>
                  <td className={styles.knownColumn}>
                    <input
                      type="checkbox"
                      checked={knownItems.has(item.id)}
                      onChange={() => toggleKnownItem(item.id, item['Item'])}
                      className={styles.knownCheckbox}
                    />
                  </td>
                  {visibleColumns.map((column, index) => (
                    <td key={`${item.id}-${column}`} className={index === 0 ? styles.firstColumn : ''}>
                      {renderCell(item, column, index)}
                    </td>
                  ))}
                </tr>
                {openCraftingInfo === item.id && (
                  <tr className={styles.craftingInfoRow}>
                    <td colSpan={visibleColumns.length + 1}>
                      <div className={styles.craftingInfoContent}>
                        <Markdown>{craftingInfoContent || ''}</Markdown>
                        <button onClick={() => {setOpenCraftingInfo(null); setCraftingInfoContent(null);}} className={styles.closeButton}>
                          Close
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TrackableTable;
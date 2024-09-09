import React, { useRef, useEffect } from 'react';
import styles from './AppSettings.module.scss';
import { DBUserSettings } from '../../types';

interface AppSettingsProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
  settings: DBUserSettings;
  setSettings: any;
}

function AppSettings({ isSettingsOpen, setIsSettingsOpen, settings, setSettings }: AppSettingsProps) {
  const settingsDrawerRef = useRef<HTMLDivElement>(null);


  const toggleSimplifiedView = async () => {
    const newSettings = {
      ...settings,
      options: {
        ...settings.options,
        isSimplifiedView: !settings.options.isSimplifiedView // Correctly update the nested property
      }
    };
    setSettings(newSettings);
    
    try {

      await fetch('/api/userSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });
      
    } catch (error) {
      console.error('Error updating user settings:', error);
    }
  };

  return (
    <>
      <div className={styles.settingsIcon} onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
        ⚙️
      </div>
      {isSettingsOpen && (
        <>
          <div className={styles.overlay} onClick={() => setIsSettingsOpen(false)} />
          <div className={styles.settingsDrawer} ref={settingsDrawerRef}>
            <h3>Settings</h3>
            <label>
              <input
                type="checkbox"
                checked={settings.options.isSimplifiedView}
                onChange={toggleSimplifiedView}
              />
              Simplified View
            </label>
          </div>
        </>
      )}
    </>
  );
}

export default AppSettings;
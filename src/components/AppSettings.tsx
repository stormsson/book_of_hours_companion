import React, { useRef, useEffect } from 'react';
import styles from './AppSettings.module.scss';
import { DBUserSettings } from '../types';

interface AppSettingsProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
  settings: DBUserSettings;
  setSettings: any;
}

function AppSettings({ isSettingsOpen, setIsSettingsOpen, settings, setSettings }: AppSettingsProps) {
  const settingsDrawerRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const fetchSettings = async () => {
  //     try {
  //       const response = await fetch('/api/userSettings');
  //       const userSettings = await response.json();
  //       if (userSettings) {
  //         setSettings({
  //           ...settings,
  //           isSimplifiedView: userSettings.options.isSimplifiedView
  //         });
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user settings:', error);
  //     }
  //   };
  //   fetchSettings();
  // }, [settings, setSettings]);

  const toggleSimplifiedView = async () => {
    const newSettings = {
      ...settings,
      isSimplifiedView: !settings.options.isSimplifiedView
    };
    setSettings(newSettings);

    try {
      const response = await fetch('/api/userSettings');
      const userSettings = await response.json();
      if (userSettings) {
        userSettings.options.isSimplifiedView = newSettings.isSimplifiedView;
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
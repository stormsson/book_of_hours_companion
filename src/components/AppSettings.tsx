import React, { useRef } from 'react';
import styles from './AppSettings.module.scss';
import { Settings } from '../types';

interface AppSettingsProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

function AppSettings({ isSettingsOpen, setIsSettingsOpen, settings, setSettings }: AppSettingsProps) {
  const settingsDrawerRef = useRef<HTMLDivElement>(null);

  const toggleSimplifiedView = () => {
    setSettings(prevSettings => ({
      ...prevSettings,
      isSimplifiedView: !prevSettings.isSimplifiedView
    }));
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
                checked={settings.isSimplifiedView}
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
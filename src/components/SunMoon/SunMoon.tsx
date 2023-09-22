import { useGlobalStore } from '@/providers/RootStoreProvider'
import { observer } from 'mobx-react-lite';
import React from 'react'
import { MoonIcon, SunIcon } from '../Icons/Icons';
import styles from './_SunMoon.module.scss';

const SunMoon: React.FC = (): JSX.Element => {
  const globalStore = useGlobalStore();

  const toggleSunMoon = () => {
    globalStore.sunMoon && (globalStore.sunMoon === 'sun' ? globalStore.setSunMoon('moon') : globalStore.setSunMoon('sun'))
  }

  return (
    <>
      {globalStore.sunMoon && (
        <div 
          className={`${styles['sun-moon-wrap']} ${globalStore.position === 'top' ? styles['lower-top'] : styles['normal-top']}`}
          onDoubleClick={toggleSunMoon}
        >
          {globalStore.sunMoon === 'sun' 
            ? (
              <SunIcon className={`${styles['sun-moon-icon']} ${styles['sun']}`}/>
            ) 
            : (
              <MoonIcon className={`${styles['sun-moon-icon']} ${styles['moon']}`}/>
            )
          }
        </div>
      )}
      
    </>
  )
}

export default observer(SunMoon)
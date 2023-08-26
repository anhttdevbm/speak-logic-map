import { SettingIcon } from '@/components/Icons/Icons';
import { useCountryStore, useGlobalStore } from '@/providers/RootStoreProvider';
import { observer } from 'mobx-react-lite';
import React, { memo } from 'react';
import ItemName from './TopItemName';
import styles from './_ToolItem.module.scss';

const HouseView: React.FC = (): JSX.Element => {
  const globalStore = useGlobalStore();
  const countryStore = useCountryStore();

  const toggleHouseView = (): void => {
    if (!globalStore.roomView && !globalStore.floorPlanView && !globalStore.boatView) {
      if (globalStore.map) {
        globalStore.toggleHouseView('house-world');
      }
      else {
        globalStore.toggleHouseView('house-countries');
      }
    }
    
  }

  return (
    <button 
      type="button" 
      className={`${styles['left-item-wrap']} ${globalStore.houseView !== '' ? styles['active'] : null}`}
      onClick={() => toggleHouseView()}
    >
      <SettingIcon />
      <ItemName btnName='House View'/>
    </button>
  )
}

export default observer(HouseView)
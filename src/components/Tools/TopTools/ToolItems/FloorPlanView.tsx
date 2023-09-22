import { PeopleIcon, SettingIcon, ThreeGearIcon } from '@/components/Icons/Icons';
import { useGlobalStore } from '@/providers/RootStoreProvider';
import { observer } from 'mobx-react-lite';
import React, { memo } from 'react';
import ItemName from './TopItemName';
import styles from './_ToolItem.module.scss';

const FloorPlanView: React.FC = (): JSX.Element => {
  const globalStore = useGlobalStore();

  const toggleFPView = (): void => {
    if (!globalStore.houseView
        && !globalStore.roomView
        && !globalStore.boatView
        && !globalStore.rectangularView
        // && !globalStore.mapView
        && !globalStore.tableView) {
      globalStore.toggleFloorPlanView('floorplan-countries');
    }
  }

  return (
    <button 
      type="button" 
      className={`${styles['left-item-wrap']} ${globalStore.floorPlanView !== '' ? styles['active'] : null}`}
      onClick={() => toggleFPView()}
    >
      <PeopleIcon />
      <ItemName btnName='Floor Plan View'/>
    </button>
  )
}

export default observer(FloorPlanView)
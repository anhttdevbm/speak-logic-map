import {BoatViewIcon} from '@/components/Icons/Icons';
import React, { memo } from 'react';
import ItemName from './TopItemName';
import styles from './_ToolItem.module.scss';
import { useGlobalStore } from '@/providers/RootStoreProvider';
import { observer } from 'mobx-react';

const BoatView: React.FC = (): JSX.Element => {
  const globalStore = useGlobalStore();

  const toggleBoatView = (): void => {
    if (!globalStore.houseView
        && !globalStore.roomView
        && !globalStore.floorPlanView
        && !globalStore.rectangularView
        // && !globalStore.mapView
        && !globalStore.tableView) {
      if (globalStore.map) {
        globalStore.toggleBoatView('boat-world');
      }
      else {
        globalStore.toggleBoatView('boat-countries');
      }
    }
  }
  return (
    <button 
      type="button" 
      className={`${styles['left-item-wrap']} ${globalStore.boatView !== '' ? styles['active'] : null}`}
      onClick={() => toggleBoatView()}
    >
      <BoatViewIcon />
      <ItemName btnName='Boat View'/>
    </button>
  )
}

export default observer(BoatView)

import { useGlobalStore } from '@/providers/RootStoreProvider';
import { observer } from 'mobx-react-lite';
import React, { memo } from 'react';
import ItemName from './TopItemName';
import styles from './_ToolItem.module.scss';
import {RoomIcon} from "@/components/Icons/Icons";

const RoomView: React.FC = (): JSX.Element => {
  const globalStore = useGlobalStore();

  const toggleRoomView = () => {
    if (!globalStore.houseView
        && !globalStore.floorPlanView
        && !globalStore.boatView
        && !globalStore.rectangularView
        // && !globalStore.mapView
        && !globalStore.tableView) {
      globalStore.toggleRoomView('room-countries');
    }
  }
  return (
    <button 
      type="button" 
      className={`${styles['left-item-wrap']} ${globalStore.roomView !== '' ? styles['active'] : null}`}
      onClick={() => toggleRoomView()}
    >
      <RoomIcon />
      <ItemName btnName='Room View'/>
    </button>
  )
}

export default observer(RoomView)

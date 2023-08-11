import { SettingIcon, ThreeGearIcon } from '@/components/Icons/Icons';
import { useGlobalStore } from '@/providers/RootStoreProvider';
import { observer } from 'mobx-react-lite';
import React, { memo } from 'react';
import ItemName from './TopItemName';
import styles from './_ToolItem.module.scss';



const RoomView: React.FC = (): JSX.Element => {
  const globalStore = useGlobalStore();

  const toggleRoomView = () => {
    if (!globalStore.houseView  && !globalStore.floorPlanView && !globalStore.boatView) {
      globalStore.toggleRoomView('room-countries');
    }
  }
  return (
    <button 
      type="button" 
      className={`${styles['left-item-wrap']} ${globalStore.roomView !== '' ? styles['active'] : null}`}
      onClick={() => toggleRoomView()}
    >
      <ThreeGearIcon />
      <ItemName btnName='Room View'/>
    </button>
  )
}

export default observer(RoomView)
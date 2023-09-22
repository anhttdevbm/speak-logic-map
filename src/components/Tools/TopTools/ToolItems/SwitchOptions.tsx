import SwitchComp from '@/components/Switch/SwitchComp';
import { useGlobalStore } from '@/providers/RootStoreProvider'
import { observer } from 'mobx-react';
import React from 'react';
import styles from './_ToolItem.module.scss';


const SwitchOptions: React.FC = (): JSX.Element => {
  const globalStore = useGlobalStore();

  return (
    <div className={`${styles['switch-wrap']}`}>
      <div className={`${styles['switch-item']}`}>
        <SwitchComp 
          checked={globalStore.map}
          title={{on: 'World', off: 'Country'}}
          handleOnChange={() => (!globalStore.houseView && !globalStore.roomView && !globalStore.floorPlanView && !globalStore.boatView) && globalStore.toggleMap()}
        />
        <span>Mode 1</span>
      </div>
      <div className={`${styles['switch-item']}`}>
        <SwitchComp 
          checked={globalStore.grid}
          title={{on: 'Grid On', off: 'Grid Off'}}
          handleOnChange={globalStore.toggleGrid}
        />
        <span>Mode 2</span>
      </div>
    </div>
  )
}

export default observer(SwitchOptions)
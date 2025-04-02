import SwitchComp from '@/components/Switch/SwitchComp';
import { useGlobalStore } from '@/providers/RootStoreProvider';
import { observer } from 'mobx-react';
import React from 'react';
import styles from './_ToolItems.module.scss';

interface Props {
  isExpanded: boolean;
}

const SwitchOptions: React.FC<Props> = ({isExpanded}: Props): JSX.Element => {
  const globalStore = useGlobalStore();
  return (
    <div className={`${styles['switch-wrap']} ${isExpanded ? styles['show'] : styles['hide']}`}>
      <div className={`${styles['switch-item']}`}>
        <SwitchComp 
          checked={globalStore.click}
          title={{on: 'Click', off: 'Drag'}}
          handleOnChange={globalStore.toggleClick}
        />
      </div>
      <div className={`${styles['switch-item']}`}>
        <SwitchComp 
          checked={globalStore.lock}
          title={{on: 'Lock', off: 'Unlock'}}
          handleOnChange={globalStore.toggleLock}
        />
      </div>
    </div>
  )
}

export default observer(SwitchOptions)
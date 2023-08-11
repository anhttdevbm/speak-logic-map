import { useGlobalStore } from '@/providers/RootStoreProvider';
import { observer } from 'mobx-react-lite';
import React, { memo } from 'react';
import styles from './_InfoOnMap.module.scss';

const InfoOnMap: React.FC = (): JSX.Element => {
  const globalStore = useGlobalStore();
  return (
    <div 
      className={`
        ${styles['info-wrap']} 
        ${styles[globalStore.position]} 
        ${(globalStore.position === 'top' || globalStore.position === 'down') ? styles['full-horizontal'] : null}
      `}>
      <ul className={`${styles['info-list']}`}>
        <li>Personal Responsibility</li>
        <li>Self - Contribution</li>
      </ul>
      <ul className={`${styles['info-list']}`}>
        <li>Averaging</li>
        <li>Feedback</li>
      </ul>
      <ul className={`${styles['info-list']}`}>
        <li>Correction</li>
        <li>Function Boundary</li>
      </ul>
    </div>
  )
}

export default observer(InfoOnMap)
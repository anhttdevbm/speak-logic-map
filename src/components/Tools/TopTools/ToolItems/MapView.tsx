import { LayerIcon, SettingIcon, ThreeGearIcon } from '@/components/Icons/Icons';
import React, { memo } from 'react';
import ItemName from './TopItemName';
import styles from './_ToolItem.module.scss';

const MapView: React.FC = (): JSX.Element => {
  return (
    <button type="button" className={`${styles['left-item-wrap']}`}>
      <LayerIcon />
      <ItemName btnName='Map View'/>
    </button>
  )
}

export default memo(MapView)
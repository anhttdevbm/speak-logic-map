import { MessageIcon, SettingIcon, ThreeGearIcon } from '@/components/Icons/Icons';
import React, { memo } from 'react';
import ItemName from './TopItemName';
import styles from './_ToolItem.module.scss';

const RectangularView: React.FC = (): JSX.Element => {
  return (
    <button type="button" className={`${styles['left-item-wrap']}`}>
      <MessageIcon />
      <ItemName btnName='Rectangular View'/>
    </button>
  )
}

export default memo(RectangularView)
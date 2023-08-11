import { BookIcon, SettingIcon, ThreeGearIcon } from '@/components/Icons/Icons';
import React, { memo } from 'react';
import ItemName from './TopItemName';
import styles from './_ToolItem.module.scss';

const TableView: React.FC = (): JSX.Element => {
  return (
    <button type="button" className={`${styles['left-item-wrap']}`}>
      <BookIcon />
      <ItemName btnName='Table View'/>
    </button>
  )
}

export default memo(TableView);
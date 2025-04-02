import { MenuIcon } from '@/components/Icons/Icons';
import React, { memo } from 'react';
import styles from './_ToolItem.module.scss';

const Menu: React.FC = (): JSX.Element => {
  return (
    <button type="button" className={`${styles['left-item-wrap']}`}>
      <MenuIcon />
      <ul className={`${styles['sub-menu-list']}`}>
        <li>Save</li>
        <li>Save As</li>
        <li>Save Map Image</li>
        <li>Open</li>
        <li>New</li>
        <li>Share Map</li>
        <li>Print</li>
        <li>Exit</li>
      </ul>
    </button>
  )
}

export default memo(Menu)
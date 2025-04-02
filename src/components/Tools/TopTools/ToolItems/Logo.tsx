import { LogoIcon } from '@/components/Icons/Icons'
import React, { memo } from 'react'
import styles from './_ToolItem.module.scss';

import pack from '@/../package.json';

const Logo: React.FC = (): JSX.Element => {
  return (
    <button type='button' className={`${styles['left-item-wrap']} ${styles['logo']}`}>
      <div className={`${styles['logo-wrap']}`} >
        <LogoIcon className={`${styles['logo-icon']}`} />
        <p>v{pack.version}</p>
      </div>
    </button>
  )
}

export default memo(Logo)
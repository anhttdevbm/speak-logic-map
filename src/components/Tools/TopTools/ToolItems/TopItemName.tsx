import React, { memo, useState } from 'react'
import styles from './_ToolItem.module.scss';

interface Props {
  btnName: string;
}

const ItemName: React.FC<Props> = ({btnName}: Props): JSX.Element => {
  return (
    <div className={`${styles['name']} `}>
      {btnName}
    </div>
  )
}

export default memo(ItemName)
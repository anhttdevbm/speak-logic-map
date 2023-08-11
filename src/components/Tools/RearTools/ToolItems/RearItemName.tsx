import React, { memo } from 'react';
import styles from './_ToolItems.module.scss';


interface Props {
  itemName: string;
}


const RearItemName: React.FC<Props> = ({itemName}: Props): JSX.Element => {
  return (
    <div className={`${styles['name']} `}>
      {itemName}
    </div>
  )
}

export default memo(RearItemName)
import React, { memo, useState } from 'react';
import styles from './_Loading.module.scss';

const LoadingMap: React.FC = (): JSX.Element => {
  return (
    <div 
      className={`${styles['loading-wrap']}`}
    >
      <h2>Loading Map...</h2>
    </div>
  )
};

export default memo(LoadingMap);
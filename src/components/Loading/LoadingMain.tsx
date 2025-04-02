import { useCountryStore, useGlobalStore } from '@/providers/RootStoreProvider';
import { observer } from 'mobx-react-lite';
import React, { memo, useEffect, useState } from 'react';
import styles from './_Loading.module.scss';

const LoadingMain: React.FC = (): JSX.Element => {
  const countryStore = useCountryStore();
  const globalStore = useGlobalStore();
  const [loadingProcess, setLoadingProcess] = useState<number>(0);
  const loadingRange = Array.from({length: 100}, (_, i) => i);

  useEffect(() => {
    if (globalStore.countryQuantity > 0) {
      setLoadingProcess(Math.ceil(countryStore.countries.length / globalStore.countryQuantity * 100))
    }
  }, [globalStore.countryQuantity, countryStore.countries]);
  return (
    <div 
      className={`${styles['loading-wrap']}`}
    >
      <h2>Loading Data...</h2>
      <div className={`${styles['loading-bar-wrap']}`}>
        <div className={`${styles['loading-bar']}`}>
          {loadingRange.map(part => (
            <span 
              key={part} 
              className={`${loadingProcess >= part ? styles['active'] : null}`}
            >
            </span>
          ))}
        </div>
        <p className={`${styles['loading-percent']} ${loadingProcess > 50 ? styles['active'] : null}`}>{loadingProcess}%</p>
      </div>
    </div>
  )
};

export default observer(LoadingMain);
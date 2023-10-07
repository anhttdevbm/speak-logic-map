import { useGlobalStore } from '@/providers/RootStoreProvider';
import { observer } from 'mobx-react-lite';
import React, { memo } from 'react';
import styles from './_InfoOnMap.module.scss';

const InfoOnMap: React.FC = (): JSX.Element => {
    const globalStore = useGlobalStore();

    const handleClickMapElement = (element: any) => {
        globalStore.setMapElementSelected(element);
    }

    return (
        <div
            className={`
        ${styles['info-wrap']} 
        ${styles[globalStore.position]} 
        ${(globalStore.position === 'top' || globalStore.position === 'down') ? styles['full-horizontal'] : null}
      `}>
            <ul className={`${styles['info-list']}`}>
                <li onClick={() => handleClickMapElement('Personal Responsibility')}>Personal Responsibility</li>
                <li onClick={() => handleClickMapElement('Self - Contribution')}>Self - Contribution</li>
            </ul>
            <ul className={`${styles['info-list']}`}>
                <li onClick={() => handleClickMapElement('Averaging')}>Averaging</li>
                <li onClick={() => handleClickMapElement('Feedback')}>Feedback</li>
            </ul>
            <ul className={`${styles['info-list']}`}>
                <li onClick={() => handleClickMapElement('Correction')}>Correction</li>
                <li onClick={() => handleClickMapElement('Function Boundary')}>Function Boundary</li>
            </ul>
        </div>
    )
}

export default observer(InfoOnMap)

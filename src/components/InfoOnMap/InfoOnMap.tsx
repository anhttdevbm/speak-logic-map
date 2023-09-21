import {useGlobalStore} from '@/providers/RootStoreProvider';
import {observer} from 'mobx-react-lite';
import React, {memo} from 'react';
import styles from './_InfoOnMap.module.scss';

const InfoOnMap: React.FC = (): JSX.Element => {
    const globalStore = useGlobalStore();

    const MapElements: any[] = [
        {
            key: 'personalResponsibility',
            value: 'Personal Responsibility'
        },
        {
            key: 'selfContribution',
            value: 'Self - Contribution'
        },
        {
            key: 'averaging',
            value: 'Averaging'
        },
        {
            key: 'feedback',
            value: 'Feedback'
        },
        {
            key: 'correction',
            value: 'Correction'
        },
        {
            key: 'functionBoundary',
            value: 'Function Boundary'
        }
    ]

    const handleClickMapElement = (element: any) => {
        globalStore.setMapElementSelected(element.value);
    }

    return (
        <div
            className={`
        ${styles['info-wrap']} 
        ${styles[globalStore.position]} 
        ${(globalStore.position === 'top' || globalStore.position === 'down') ? styles['full-horizontal'] : null}
      `}>
            <ul className={`${styles['info-list']}`}>
                {MapElements.map(item => <li key={item.key} onClick={() => handleClickMapElement(item)}>{item.value}</li>)}
            </ul>
        </div>
    )
}

export default observer(InfoOnMap)
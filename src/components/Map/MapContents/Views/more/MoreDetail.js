import React, {useState} from 'react';
import styles from './MoreDetail.module.scss'

const MoreDetail = ({listFunction}) => {
    return (
        <div className={styles.rectIcon}>
            <div className={styles.rectangularList}>
                {listFunction.map(item => <DetailItem key={item.key} fn={item}/>)}
            </div>
        </div>
    );
};

export default MoreDetail;

export const DetailItem = ({fn}) => {
    return (
        <div className={styles.moreItem}>
            <p className={styles.markerRectHouseName}>{fn.value}</p>
        </div>
    )
};

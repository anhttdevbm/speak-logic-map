import React, {useState} from 'react';
import styles from './MoreDetail.module.scss'
import Image from "next/image";
import ICON_USER from "@/assets/icons/user-icon.png";

const MoreDetailPopulationView = ({listPopulation}) => {
    return (
        <div className={styles.rectIcon}>
            <div className={styles.rectangularList}>
                {listPopulation.map(item => <DetailItemPopulationView key={item.key} population={item}/>)}
            </div>
        </div>
    );
};

export default MoreDetailPopulationView;

export const DetailItemPopulationView = ({population}) => {
    return (
        <div className={styles.moreItemPopulationView}>
            <Image src={ICON_USER.src} alt="User" width="50" height="50"/>
            <p className={styles.markerRectHouseName}>{population.value}</p>
        </div>
    );
};

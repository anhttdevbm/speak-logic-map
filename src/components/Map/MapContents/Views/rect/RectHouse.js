import React, {useState} from 'react';
// import styles from '../../_MapContents.module.scss';
import styles from './RectView.module.scss'
import ICON_HOUSE from "@/assets/icons/house-icon.png";
import ICON_THREE_DOTs_ICON from '@/assets/icons/three-dots-icon.png';
import ICON_PLUS from '@/assets/icons/plus-icon.png';
import Image from "next/image";
import Modal from 'react-modal';
import {useGlobalStore} from "@/providers/RootStoreProvider";

const RectHouse = ({listCountry, onClick}) => {
    return (
        <div className={styles.rectIcon}>
            <div className={styles.rectangularList}>
                {listCountry.map(item => <RectangularItem key={item} countryName={item}/>)}
                <div className={styles.divPlus}>
                    <button className={styles.plus} onClick={onClick} id='plus'>
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RectHouse;

export const RectangularItem = ({countryName}) => {
    return (
        <div className={styles.rectangularItem}>
            <Image src={ICON_HOUSE.src} alt="House" width="50" height="50"/>
            <p className={styles.markerRectHouseName}>{countryName}</p>
        </div>
    );
};

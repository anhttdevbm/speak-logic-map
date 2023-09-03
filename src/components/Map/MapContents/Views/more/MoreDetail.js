import React, {useState} from 'react';
// import styles from '../../_MapContents.module.scss';
import styles from './MoreDetail.module.scss'
import ICON_HOUSE from "@/assets/icons/house-icon.png";
import ICON_THREE_DOTs_ICON from '@/assets/icons/three-dots-icon.png';
import ICON_PLUS from '@/assets/icons/plus-icon.png';
import Image from "next/image";
import Modal from 'react-modal';
import {useGlobalStore} from "@/providers/RootStoreProvider";

const MoreDetail = ({listFunction, type}) => {
    return (
        <div className={styles.rectIcon}>
            <div className={styles.rectangularList}>
                {listFunction.map(item => <DetailItem key={item} functionName={item} type={type}/>)}
                {/*<div className={styles.divPlus}>*/}
                {/*    <button className={styles.plus} onClick={onClick} id='plus'>*/}
                {/*        +*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default MoreDetail;

export const DetailItem = ({functionName, type}) => {
    return (
        <div className={styles.rectangularItem}>
            <p className={styles.markerRectHouseName}>{functionName}</p>
        </div>
    );
};

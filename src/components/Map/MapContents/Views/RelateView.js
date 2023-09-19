import React, {useState} from 'react';
import {Col, Row} from "antd";
import styles from '../_MapContents.module.scss'
import {useGlobalStore} from "@/providers/RootStoreProvider";
import ICON_PERSON from "../../../../assets/icons/user-icon.png";
import Image from "next/image";

const RelateView = () => {
    const globalStore = useGlobalStore();
    return (
        <div className={styles.relatedArea}>
            <DetailItem style={{margin: '30px'}} element={globalStore.mapElementSelected}/>
            <div className={styles.horizontalLine}></div>
            <RelateCircle/>
            <DetailItem style={{margin: '30px'}} element={globalStore.mapElementRelate}/>
            <div className={styles.horizontalLine}></div>
        </div>
    );
};

export default RelateView;

export const DetailItem = ({element}) => {
    return (
        <div className={styles.moreItem}>
            <p className={styles.elementText}>{element}</p>
        </div>
    )
};

export const RelateCircle = () => {
    return (
        <div style={{position: "relative"}}>
            <div className={styles.verticalLineTop}></div>
            <div className={styles.arrowTop}></div>
            <div className={styles.relateCircle}>
                <p className={styles.relateText}>Relate</p>
            </div>
            <div className={styles.horizontalLineLeft}></div>
            <div className={styles.arrowLeft}></div>
            <div className={styles.verticalLineBottom}></div>
            <div className={styles.arrowBottom}></div>
            {/*<div>*/}

            {/*</div>*/}
        </div>
    )
};

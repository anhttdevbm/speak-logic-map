import React, {useState} from 'react';
import {Col, Image, Row} from "antd";
import styles from '../_MapContents.module.scss'
import {useGlobalStore} from "@/providers/RootStoreProvider";
import ICON_PERSON from "../../../../assets/icons/user-icon.png";

const RelateView = () => {
    const globalStore = useGlobalStore();
    return (
        <div className={styles.relatedArea}>
            {globalStore.mapElementSelected === 'Person'
                ? <PersonItem style={{margin: '30px'}} element={globalStore.mapElementSelected}/>
                : <DetailItem style={{margin: '30px'}} element={globalStore.mapElementSelected}/>
            }
            <div className={styles.horizontalLine}></div>
            <RelateCircle/>
            {globalStore.mapElementSelected === 'Person'
                ? <PersonItem style={{margin: '30px'}} element={globalStore.mapElementRelate}/>
                : <DetailItem style={{margin: '30px'}} element={globalStore.mapElementRelate}/>
            }
            <div className={styles.horizontalLine}></div>
        </div>
    );
};

export default RelateView;

export const PersonItem = ({element}) => {
    return (
        <div className={styles.personItem}>
            <Image alt='icon-person' className={styles.img} src={ICON_PERSON.src}/>
            <p className={styles.elementText}>{element}</p>
        </div>
    )
};

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

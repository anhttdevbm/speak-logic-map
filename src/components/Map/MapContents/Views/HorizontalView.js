import React, {useState} from 'react';
import {Col, Image, Row} from "antd";
import styles from '../_MapContents.module.scss'
import {useGlobalStore} from "@/providers/RootStoreProvider";
import ICON_PERSON from "../../../../assets/icons/user-icon.png";
import MAIN_SET_1 from "../../../../assets/icons/main-set-1.png";
import MAIN_SET_2 from "../../../../assets/icons/main-set-2.png";
import MAIN_SET_3 from "../../../../assets/icons/main-set-3.png";
import MAIN_SET_MORE from "../../../../assets/icons/main-set-more.png";

import HORIZONTAL_LINE_1 from "../../../../assets/icons/horizontal-1.png";
import HORIZONTAL_LINE_2 from "../../../../assets/icons/horizontal-2.png";
import HORIZONTAL_LINE_3 from "../../../../assets/icons/horizontal-3.png";
import HORIZONTAL_LINE_MORE from "../../../../assets/icons/horizontal-line.png";

const HorizontalView = () => {
    const globalStore = useGlobalStore();
    console.log(globalStore.numberPersonInHorizontalLine, globalStore.addIcon)
    return (
        <div className={styles.relatedArea}>
            {globalStore.addIcon === 'main-set' && globalStore.numberPersonInHorizontalLine === 1
                ? <Image preview={false} alt='icon-person' className={styles.img} src={MAIN_SET_1.src}/>
                : globalStore.addIcon === 'main-set' && globalStore.numberPersonInHorizontalLine === 2
                    ? <Image preview={false} alt='icon-person' className={styles.img} src={MAIN_SET_2.src}/>
                    : globalStore.addIcon === 'main-set' && globalStore.numberPersonInHorizontalLine === 3
                        ? <Image preview={false} alt='icon-person' className={styles.img} src={MAIN_SET_3.src}/>
                        : globalStore.addIcon === 'main-set' && globalStore.numberPersonInHorizontalLine > 3
                            ? <Image preview={false} alt='icon-person' className={styles.img} src={MAIN_SET_MORE.src}/>
                            : globalStore.addIcon === 'horizontal-line' && globalStore.numberPersonInHorizontalLine === 1
                                ? <Image preview={false} alt='icon-person' className={styles.img} src={HORIZONTAL_LINE_1.src}/>
                                : globalStore.addIcon === 'horizontal-line' && globalStore.numberPersonInHorizontalLine === 2
                                    ? <Image preview={false} alt='icon-person' className={styles.img} src={HORIZONTAL_LINE_2.src}/>
                                    : globalStore.addIcon === 'horizontal-line' && globalStore.numberPersonInHorizontalLine === 3
                                        ? <Image preview={false} alt='icon-person' className={styles.img} src={HORIZONTAL_LINE_3.src}/>
                                        : <Image preview={false} alt='icon-person' className={styles.img} src={HORIZONTAL_LINE_MORE.src}/>
            }
            {/*<div className={styles.horizontalLine}></div>*/}
            {/*<RelateCircle/>*/}
            {/*{globalStore.addIcon === 'main-set'*/}
            {/*    ? <PersonItem style={{margin: '30px'}} element={globalStore.mapElementRelate}/>*/}
            {/*    : <DetailItem style={{margin: '30px'}} element={globalStore.mapElementRelate}/>*/}
            {/*}*/}
            {/*<div className={styles.horizontalLine}></div>*/}
        </div>
    );
};

export default HorizontalView;

export const PersonItem = () => {
    return (
        <div className={styles.personItem}>
            <Image alt='icon-person' className={styles.img} src={ICON_PERSON.src}/>
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

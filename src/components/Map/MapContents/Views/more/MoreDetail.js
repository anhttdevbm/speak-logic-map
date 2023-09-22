import React, {useState} from 'react';
import styles from './MoreDetail.module.scss'
import {Col, Row} from "antd";
import {RectangularItem} from "@/components/Map/MapContents/Views/rect/RectHouse";
import {useGlobalStore} from "@/providers/RootStoreProvider";

const MoreDetail = ({listFunction}) => {
    const globalStore = useGlobalStore();
    return (
        <div className={styles.rectIcon}>
            <Row>
                {listFunction.map((item, index) =>
                    <Col className={styles.rowItem} span={4} key={index}>
                        <DetailItem key={item.key} fn={item}/>
                    </Col>)
                }
            </Row>
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

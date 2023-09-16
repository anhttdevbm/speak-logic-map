import React, {useState} from 'react';
import styles from './TableDetail.module.scss'
import {Popover, Button} from "antd";

const TableDetail = ({listFunction}) => {
    return (
        <div className={styles.rectIcon}>
            <div className={styles.rectangularList}>
                {listFunction.map(item => <TableDetailItem key={item.key} fn={item}/>)}
            </div>
        </div>
    );
};
export default TableDetail;

export const TableDetailItem = ({fn}) => {
    const [open, setOpen] = useState(false);

    const hide = () => {
        setOpen(false);
    };

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };
    const contentInPopup = () => {
        return (
            <div className={styles.popupWrap}>
                <div
                    className={styles.menuGeojson}
                >
                    Delete function
                </div>
            </div>
        )
    }

    return (
        <Popover
            content={<a onClick={hide}>x</a>}
            title={contentInPopup()}
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
        >
            <Button shape="round" size='large'>
                {fn.value}
            </Button>
        </Popover>
    )
};
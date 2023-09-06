import {observer} from "mobx-react-lite";
import styles from "./_ModalContents.module.scss";
import React, {useState} from "react";
import {useGlobalStore} from "@/providers/RootStoreProvider";
import {CloseIcon} from "@/components/Icons/Icons";


const ScrollFeatureViewM = () => {
    const [data, setData] = useState<any>();

    const globalStore = useGlobalStore();
    console.log(globalStore.positionOfScroll);
    const closeModal = () => {
        globalStore.resetPositionScroll();
    }
    const handleSave = () => {
        console.log('CLICK');
    }
    return (
        <div className={`${styles['simulation-setting-wrap']}`} onClick={e => e.stopPropagation()}>
            <div className={`${styles['header']}`}>
                <button onClick={closeModal}><CloseIcon/></button>
            </div>
            <div className={`${styles['main']}`}>
                <div className={`${styles['main-content']}`}>
                    <div className={`${styles['rename-input']}`}>
                        <label>First line:</label>
                        <input type='text' value={data} onChange={e => setData(e.target.value)}/>
                    </div>
                </div>
            </div>
            <div className={`${styles['footer']}`}>
                <small></small>
                <div className={`${styles['option-btns']}`}>
                    <button className='primary-btn' onClick={handleSave}>
                        OK
                    </button>
                    <button className='secondary-btn' onClick={closeModal}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default observer(ScrollFeatureViewM);
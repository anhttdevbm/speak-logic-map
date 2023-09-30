import React, {useState} from 'react';
import styles from './_ModalContents.module.scss';
import {useGlobalStore} from "@/providers/RootStoreProvider";
import {InputNumber} from "antd";

interface Props {
    setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const shortenName = (name: string): string => {
    let trimName = name.trim();
    return trimName.length > 6 ? `${trimName.slice(0, 6)}...` : trimName;
}

const InsertPersonM = () => {
    const globalStore = useGlobalStore();
    const [numberPerson, setNumberPerson] = useState<any>(0);

    const closeModal = (): void => {
        globalStore.toggleModalInsertNumberPerson();
    }

    const handleSetNumberCountry = () => {
        globalStore.setNumberPersonInHorizontalLine(numberPerson);
        globalStore.toggleModalInsertNumberPerson();
    }

    return (
        <div className={`${styles['rename-wrap']}`} onClick={e => e.stopPropagation()}>
            <div className={`${styles['rename-header']}`}>
                <h3 style={{marginBottom: '10px'}}>Insert number person</h3>
            </div>
            <div>
                <InputNumber style={{width: '100%'}} type='number' value={numberPerson} onChange={(e) => {setNumberPerson(e)}}/>
            </div>
            {/*<div className={`${styles['rename-input']}`}>*/}
            {/*    <Search/>*/}
            {/*</div>*/}
            <div className={`${styles['rename-btns']}`}>
                <button type='button' onClick={handleSetNumberCountry}>
                    OK
                </button>
                <button type='button' onClick={closeModal}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default InsertPersonM

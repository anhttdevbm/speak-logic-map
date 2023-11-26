import React, {useState} from 'react';
import styles from './_ModalContents.module.scss';
import {useGlobalStore} from "@/providers/RootStoreProvider";
import {InputNumber} from "antd";

interface Props {
    type: string,
    setToggleModal: any;
    setAction: React.Dispatch<React.SetStateAction<any>>;
}

const shortenName = (name: string): string => {
    let trimName = name.trim();
    return trimName.length > 6 ? `${trimName.slice(0, 6)}...` : trimName;
}

const InsertPersonM: React.FC<Props> = ({type, setToggleModal, setAction}: Props) => {
    const globalStore = useGlobalStore();
    const [numberPerson, setNumberPerson] = useState<any>(0);

    const closeModal = (): void => {
        setToggleModal();
    }

    const handleSetNumberCountry = () => {
        setAction(numberPerson);
        setToggleModal();
        if (type === 'function') {
            let indexList = globalStore.listMarkerFunction.map(item => item.key).filter(x => x !== 'dot' && x !== 'plus').sort((a, b) => a - b);
            console.log('index', indexList)
            let lastIndex = indexList[indexList.length - 1]
            for (let i = 1; i <= numberPerson; i++) {
                globalStore.addMarkerFnToList(lastIndex + i);
            }
        }
    }

    return (
        <div className={`${styles['rename-wrap']}`} onClick={e => e.stopPropagation()}>
            <div className={`${styles['rename-header']}`}>
                <h3 style={{marginBottom: '10px'}}>Insert number {type}</h3>
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

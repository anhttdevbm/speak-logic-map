import React, {useState} from 'react';
import styles from './_ModalContents.module.scss';
import {useGlobalStore} from "@/providers/RootStoreProvider";
import {InputNumber, notification} from "antd";
import {markerFnIndex, markerPrincipleLineIndex} from "@/components/Map/MapContents/Variables/Variables";

interface Props {
    type: string,
    setToggleModal: any;
    setAction: any;
}

const shortenName = (name: string): string => {
    let trimName = name.trim();
    return trimName.length > 6 ? `${trimName.slice(0, 6)}...` : trimName;
}

const InsertPersonM: React.FC<Props> = ({type, setToggleModal, setAction}: Props) => {
    const globalStore = useGlobalStore();
    const [numberPerson, setNumberPerson] = useState<any>(0);
    const [api, contextHolder] = notification.useNotification();

    const openNotification = () => {
        api.open({
            message: 'Warning',
            type: 'warning',
            duration: 3,
            description:
                'Number person for each principle line can not equal 0.',
        });
    }

    const closeModal = (): void => {
        setToggleModal();
    }

    const handleSetNumberCountry = () => {
        if (numberPerson === 0) {
            openNotification();
        } else {
            setAction(markerPrincipleLineIndex[0], numberPerson);
            setToggleModal();
            if (type === 'function') {
                let indexList = globalStore.listMarkerFunction.map(item => item.key).filter(x => x !== 'dot' && x !== 'plus').sort((a, b) => a - b);
                let lastIndex = indexList[indexList.length - 1]
                for (let i = 1; i <= numberPerson; i++) {
                    let key = lastIndex + i
                    globalStore.addMarkerFnToNearLast(key);
                    const minLat = -90;
                    const maxLat = 90;
                    const minLng = -180;
                    const maxLng = 180;
                    const randomLat = Math.random() * (maxLat - minLat) + minLat;
                    const randomLng = Math.random() * (maxLng - minLng) + minLng;
                    globalStore.setMapLayer(randomLat, randomLng, 'Function ' + key, 'function');
                }
            } else if (type === 'population-view') {
                let indexList = globalStore.listMarkerPopulation.map(item => item.key).filter(x => x !== 'dot' && x !== 'plus').sort((a, b) => a - b);
                let lastIndex = indexList[indexList.length - 1]
                for (let i = 1; i <= numberPerson; i++) {
                    let key = lastIndex + i;
                    globalStore.addMarkerPersonToNearLast(key);
                    const minLat = -90;
                    const maxLat = 90;
                    const minLng = -180;
                    const maxLng = 180;
                    const randomLat = Math.random() * (maxLat - minLat) + minLat;
                    const randomLng = Math.random() * (maxLng - minLng) + minLng;
                    globalStore.setMapLayer(randomLat, randomLng, 'Person ' + key, 'person');
                }
            } else if (type === 'problem-view') {
                let indexList = globalStore.listMarkerProblem.map(item => item.key).filter(x => x !== 'dot' && x !== 'plus').sort((a, b) => a - b);
                let lastIndex = indexList[indexList.length - 1]
                for (let i = 1; i <= numberPerson; i++) {
                    let key = lastIndex + i;
                    globalStore.addMarkerProblemToNearLast(key);
                    const minLat = -90;
                    const maxLat = 90;
                    const minLng = -180;
                    const maxLng = 180;
                    const randomLat = Math.random() * (maxLat - minLat) + minLat;
                    const randomLng = Math.random() * (maxLng - minLng) + minLng;
                    globalStore.setMapLayer(randomLat, randomLng, 'Problem ' + key, 'problem');
                }
            }
        }
    }

    return (
        <>
            {contextHolder}
            <div className={`${styles['rename-wrap']}`} onClick={e => e.stopPropagation()}>
                <div className={`${styles['rename-header']}`}>
                    <h3 style={{marginBottom: '15px'}}>Insert number {type}</h3>
                </div>
                <div>
                    <InputNumber style={{width: '100%'}} type='number' value={numberPerson} onChange={(e) => {
                        setNumberPerson(e)
                    }}/>
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
        </>
    )
}

export default InsertPersonM

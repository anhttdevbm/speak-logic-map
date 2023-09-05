import {useGlobalStore} from '@/providers/RootStoreProvider';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {
    AIcon,
    CircleIcon,
    ExtenderIcon,
    LineIcon,
    PalletIcon,
    PalletIcon2,
    PalletIcon3,
    PalletIcon4,
    PointerIcon,
    RectanglePallet
} from '../Icons/Icons';
import styles from './_Pallet.module.scss';

const Pallet: React.FC = (): JSX.Element => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const globalStore = useGlobalStore();
    return (
        <div
            className={`${styles['pallet-wrap']} ${globalStore.position === 'top' ? styles['lower-top'] : styles['normal-top']}`}>
            <div className={`${styles['pallet-expand']}`}>
                <button
                    className={`${isExpanded ? styles['active'] : styles['inactive']}`}
                    onClick={() => setIsExpanded(isExpanded => !isExpanded)}
                >
                    <p>➤</p>
                </button>
            </div>
            <div className={`${styles['pallet-main']} ${isExpanded ? styles['active'] : styles['inactive']}`}>
                <div id="pointer-event"
                     className={`${styles['pallet-item']} ${globalStore.palletOption === 'pointer' ? styles['active'] : null}`}>
                    <PointerIcon/>
                    <span>Pointer</span>
                </div>
                <div id="text-event"
                     className={`${styles['pallet-item']} ${globalStore.palletOption === 'text' ? styles['active'] : null}`}>
                    <AIcon/>
                    <span>Text</span>
                </div>
                <div id="line-event"
                     className={`${styles['pallet-item']} ${globalStore.palletOption === 'line' ? styles['active'] : null}`}>
                    <ExtenderIcon className={`${styles['extend-icon']}`}/>
                    <LineIcon/>
                    <span>Line</span>
                    <div className={`${styles['extend-options']}`}>
                        <div className={`${styles['pallet-item']}`}>
                            <LineIcon/>
                        </div>
                        <div className={`${styles['pallet-item']}`}>
                            <PalletIcon/>
                        </div>
                        <div className={`${styles['pallet-item']}`}>
                            <PalletIcon2/>
                        </div>
                        <div className={`${styles['pallet-item']}`}>
                            <PalletIcon3/>
                        </div>
                        <div className={`${styles['pallet-item']}`}>
                            <PalletIcon4/>
                        </div>
                    </div>
                </div>
                <div id="rectangle-event"
                     className={`${styles['pallet-item']} ${globalStore.palletOption === 'rectangle' ? styles['active'] : null}`}>
                    <RectanglePallet/>
                    <span>Rectangle</span>
                </div>
                <div id="ellipse-event"
                     className={`${styles['pallet-item']} ${globalStore.palletOption === 'circle' ? styles['active'] : null}`}>
                    <CircleIcon/>
                    <span>Circle</span>
                </div>
            </div>
        </div>
    )
}

export default observer(Pallet)
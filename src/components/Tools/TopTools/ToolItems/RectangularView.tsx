import {MessageIcon, SettingIcon, ThreeGearIcon} from '@/components/Icons/Icons';
import React, {memo} from 'react';
import ItemName from './TopItemName';
import styles from './_ToolItem.module.scss';
import {useGlobalStore} from "@/providers/RootStoreProvider";

const RectangularView: React.FC = (): JSX.Element => {
    const globalStore = useGlobalStore();
    const toggleRectangularView = () => {
        if (!globalStore.houseView  && !globalStore.floorPlanView && !globalStore.boatView) {
            globalStore.toggleRectangularView('rect-house');
        }
        console.log("globalStore.rectangularView", globalStore.rectangularView)
    }

    return (
        <button
            type="button"
            className={`${styles['left-item-wrap']} ${globalStore.rectangularView !== '' ? styles['active'] : null}`}
            onClick={() => toggleRectangularView()}
        >
            <MessageIcon/>
            <ItemName btnName='Rectangular View'/>
        </button>
    )
}

export default memo(RectangularView)
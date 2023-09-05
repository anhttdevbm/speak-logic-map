import {MessageIcon} from '@/components/Icons/Icons';
import React, {memo} from 'react';
import ItemName from './TopItemName';
import styles from './_ToolItem.module.scss';
import {useGlobalStore} from "@/providers/RootStoreProvider";
import {observer} from "mobx-react-lite";

const RectangularView: React.FC = (): JSX.Element => {
    const globalStore = useGlobalStore();
    const toggleRectangularView = () => {
        if (!globalStore.houseView
            && !globalStore.roomView
            && !globalStore.floorPlanView
            && !globalStore.boatView
            && !globalStore.mapView
            && !globalStore.tableView
        ) {
            globalStore.toggleRectangularView('rect-house');
        }
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

export default observer(RectangularView)
import {LayerIcon, SettingIcon, ThreeGearIcon} from '@/components/Icons/Icons';
import React, {memo} from 'react';
import ItemName from './TopItemName';
import styles from './_ToolItem.module.scss';
import {useGlobalStore} from "@/providers/RootStoreProvider";
import {observer} from "mobx-react";

const MapView: React.FC = (): JSX.Element => {
    const globalStore = useGlobalStore();
    const toggleMapView = (): void => {
        if (!globalStore.roomView
            && !globalStore.floorPlanView
            && !globalStore.boatView
            && !globalStore.rectangularView
            && !globalStore.houseView
            && !globalStore.tableView
            && !globalStore.moreView
        ) {
            if (globalStore.map) {
                globalStore.toggleMapView('map-world');
            } else {
                globalStore.toggleMapView('map-countries');
            }
        }

    }

    return (
        <button
            type="button"
            className={`${styles['left-item-wrap']} ${globalStore.mapView !== '' ? styles['active'] : null}`}
            onClick={() => toggleMapView()}
        >
            <LayerIcon/>
            <ItemName btnName='Map View'/>
        </button>
    )
}

export default observer(MapView)

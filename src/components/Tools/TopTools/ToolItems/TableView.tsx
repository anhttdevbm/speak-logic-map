import { BookIcon } from '@/components/Icons/Icons';
import React from 'react';
import ItemName from './TopItemName';
import styles from './_ToolItem.module.scss';
import {useGlobalStore} from "@/providers/RootStoreProvider";
import {observer} from "mobx-react";

const TableView: React.FC = (): JSX.Element => {
    const globalStore = useGlobalStore();
    const toggleTableView = (): void => {
        if (!globalStore.roomView
            && !globalStore.floorPlanView
            && !globalStore.boatView
            && !globalStore.rectangularView
            && !globalStore.houseView
            // && !globalStore.mapView
        ) {
            if (globalStore.map) {
                globalStore.toggleTableView('table-world');
            } else {
                globalStore.toggleTableView('table-countries');
            }
        }
    }
  return (
    <button
        type="button"
        className={`${styles['left-item-wrap']} ${globalStore.tableView !== '' ? styles['active'] : null}`}
        onClick={() => toggleTableView()}
    >
      <BookIcon />
      <ItemName btnName='Table View'/>
    </button>
  )
}

export default observer(TableView);
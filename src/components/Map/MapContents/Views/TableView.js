import {Marker, Popup, useMap} from "react-leaflet";
import {observer} from 'mobx-react-lite';
import {useGlobalStore} from "@/providers/RootStoreProvider";
import {useCallback, useEffect, useRef, useState} from "react";
import {allLayer, markerFnIndex} from "@/components/Map/MapContents/Variables/Variables";
import TableDetail from "@/components/Map/MapContents/Views/table/TableDetail";
import MoreDetailPopulationView from "@/components/Map/MapContents/Views/more/MoreDetailPopulationView";
// import './index.css'
const TableView = () => {
    const map = useMap();
    const globalStore = useGlobalStore();
    const markerRef = useRef(null);
    const position = [44.96479793033104-40, -6.416015625000001];
    const [listFunction, setListFunction] = useState([]);
    const VALUE_TABLE_VIEW = ['table-world', 'table-countries']

    useEffect(() => {
        if (VALUE_TABLE_VIEW.includes(globalStore.tableView)) {
            removeLayoutMap();
        }
    }, [globalStore.tableView])

    // useEffect(() => {
    //     setListFunction(globalStore.listMarkerFunction)
    // }, [markerFnIndex, globalStore.listMarkerFunction])

    const removeLayoutMap = () => {
        if (globalStore.tableView !== '') {
            map.dragging.disable();
            map.touchZoom.disable();
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();
            map.eachLayer(layer => {
                if (layer._arrowheads) {
                    layer.remove();
                }
                allLayer.push(layer);
            });

            map.eachLayer(layer => map.removeLayer(layer));
        }
    }

    if (VALUE_TABLE_VIEW.includes(globalStore.tableView)) {
        console.log('globalStore.tableView', globalStore.tableView)
        return (
            <Marker position={position}>
                <Popup autoOpen={true}>
                    <TableDetail listFunction={globalStore.listMarkerFunction}/>
                </Popup>
            </Marker>)
    }

    return null
}

export default observer(TableView);
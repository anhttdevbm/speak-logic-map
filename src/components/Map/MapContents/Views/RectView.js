import {Marker, Popup, useMap} from "react-leaflet";
import {observer} from 'mobx-react-lite';
import {useGlobalStore} from "@/providers/RootStoreProvider";
import {useCallback, useEffect, useRef, useState} from "react";
import RectHouse from "@/components/Map/MapContents/Views/rect/RectHouse";
import {allLayer} from "@/components/Map/MapContents/Variables/Variables";
// import './index.css'
const RectView = () => {
    const map = useMap();
    const globalStore = useGlobalStore();
    const markerRef = useRef(null);
    const position = [44.96479793033104, -6.416015625000001];
    const [listCountry, setListCountry] = useState(globalStore.listCountryInRect);

    useEffect(() => {
        globalStore.setListCountryInRect(['Canada', 'USA', 'Mexico'])
        setListCountry(globalStore.listCountryInRect)
    }, []);

    useEffect(() => {
        removeLayoutMap();
    }, [globalStore.rectangularView])

    useEffect(() => {
        console.log('globalStore.rectangularView', globalStore.rectangularView, globalStore.listCountryInRect)
        if (!globalStore.showModalInsertCountry) {
            setListCountry(globalStore.listCountryInRect);
        }
    }, [globalStore.listCountryInRect, globalStore.showModalInsertCountry])

    const removeLayoutMap = () => {
        if (globalStore.rectangularView === 'rect-name' || globalStore.rectangularView === 'rect-house') {
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

    const addNewRect = () => {
        console.log('CLICK VIEWWWWWWW')
        globalStore.toggleModalInsertCountry();
    }

    if (globalStore.rectangularView === 'rect-house') {
        return (
            <Marker position={position}>
                <Popup autoOpen={true}>
                    <RectHouse listCountry={listCountry} onClick={addNewRect}/>
                </Popup>
            </Marker>)
    }

    return null
}

export default observer(RectView);
import {Marker, Popup, useMap} from "react-leaflet";
import {observer} from 'mobx-react-lite';
import {useGlobalStore} from "@/providers/RootStoreProvider";
import {useCallback, useEffect, useRef, useState} from "react";
import RectHouse from "@/components/Map/MapContents/Views/rect/RectHouse";
import {allLayer, markerFnIndex} from "@/components/Map/MapContents/Variables/Variables";
import MoreDetail from "@/components/Map/MapContents/Views/more/MoreDetail";
// import './index.css'
const MoreView = () => {
    const map = useMap();
    const globalStore = useGlobalStore();
    const markerRef = useRef(null);
    const position = [44.96479793033104, -6.416015625000001];
    const [listCountry, setListCountry] = useState(globalStore.listCountryInRect);
    const [listFunction, setListFunction] = useState([]);

    useEffect(() => {
        // globalStore.setListCountryInRect(['Canada', 'USA', 'Mexico'])
        setListCountry(globalStore.listCountryInRect)
    }, []);

    useEffect(() => {
        removeLayoutMap();
    }, [globalStore.moreView])

    useEffect(() => {
        console.log('markerFnIndex', markerFnIndex, markerFnIndex[0])
        setListFunction(createArray(markerFnIndex[0]))
        console.log('list function', listFunction)
    }, [markerFnIndex])

    const createArray = (number) => {
        let myArray = [];

        for (let i = 1; i <= 6; i++) {
            myArray.push('Function ' + i);
        }
        return myArray
    }

    // useEffect(() => {
    //     console.log('globalStore.moreView', globalStore.moreView, globalStore.listCountryInRect)
    //     if (!globalStore.showModalInsertCountry) {
    //         setListCountry(globalStore.listCountryInRect);
    //     }
    // }, [globalStore.listCountryInRect, globalStore.showModalInsertCountry])

    const removeLayoutMap = () => {
        if (globalStore.moreView !== '') {
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

    if (globalStore.moreView === 'world-as-country') {
        return (
            <Marker position={position}>
                <Popup autoOpen={true}>
                    <MoreDetail listFunction={listFunction}/>
                </Popup>
            </Marker>)
    }

    return null
}

export default observer(MoreView);
import {Marker, Popup, useMap} from "react-leaflet";
import {observer} from 'mobx-react-lite';
import {useGlobalStore} from "@/providers/RootStoreProvider";
import {useCallback, useEffect, useRef, useState} from "react";
import RectHouse from "@/components/Map/MapContents/Views/rect/RectHouse";
import {allLayer, markerFnIndex} from "@/components/Map/MapContents/Variables/Variables";
import MoreDetail from "@/components/Map/MapContents/Views/more/MoreDetail";
import MoreDetailPopulationView from "@/components/Map/MapContents/Views/more/MoreDetailPopulationView";
// import './index.css'
const MoreView = () => {
    const map = useMap();
    const globalStore = useGlobalStore();
    const markerRef = useRef(null);
    const position = [44.96479793033104, -6.416015625000001];
    const [listFunction, setListFunction] = useState([]);
    const VALUE_MORE_VIEW = ['world-as-country', 'population-view', 'population-view-with-map', 'world-problem-view']

    useEffect(() => {
        // globalStore.setListCountryInRect(['Canada', 'USA', 'Mexico'])
        // setListCountry(globalStore.listCountryInRect)
    }, []);

    useEffect(() => {
        if (VALUE_MORE_VIEW.includes(globalStore.moreView)) {
            removeLayoutMap();
        }
    }, [globalStore.moreView])

    useEffect(() => {
        setListFunction(globalStore.listMarkerFunction)
    }, [markerFnIndex, globalStore.listMarkerFunction])

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

    if (VALUE_MORE_VIEW.includes(globalStore.moreView)) {
        console.log('globalStore.moreView', globalStore.moreView)
        return (
            <Marker position={position}>
                <Popup autoOpen={true}>
                    {globalStore.moreView === 'world-as-country'
                        ? <MoreDetail listFunction={globalStore.listMarkerFunction}/>
                        : globalStore.moreView === 'population-view'
                            ? <MoreDetailPopulationView listPopulation={globalStore.listMarkerPopulation}/>
                            : <></>
                    }
                </Popup>
            </Marker>)
    }

    return null
}

export default observer(MoreView);
import {Marker, Popup, useMap} from "react-leaflet";
import {observer} from 'mobx-react-lite';
import {useGlobalStore} from "@/providers/RootStoreProvider";
import {useEffect, useState} from "react";
import {markerFnIndex, markerProblemIndex} from "@/components/Map/MapContents/Variables/Variables";
import MoreDetail from "@/components/Map/MapContents/Views/more/MoreDetail";
import MoreDetailPopulationView from "@/components/Map/MapContents/Views/more/MoreDetailPopulationView";

const MoreView = () => {
    const globalStore = useGlobalStore();
    const [listFunction, setListFunction] = useState([]);
    const VALUE_MORE_VIEW = ['world-as-country', 'population-view', 'population-view-with-map', 'world-problem-view']

    useEffect(() => {
        setListFunction(globalStore.listMarkerFunction)
    }, [markerFnIndex, globalStore.listMarkerFunction])

    useEffect(() => {
        globalStore.addMarkerProblemToList(markerProblemIndex[0])
    }, [markerProblemIndex])

    if (VALUE_MORE_VIEW.includes(globalStore.moreView)) {
        console.log('globalStore.moreView', globalStore.moreView)
        return (
            <>
                {globalStore.moreView === 'world-as-country'
                    ? <MoreDetail listFunction={globalStore.listMarkerFunction}/>
                    : globalStore.moreView === 'population-view'
                        ? <MoreDetailPopulationView listPopulation={globalStore.listMarkerPopulation}/>
                        : globalStore.moreView === 'world-problem-view'
                            ? <MoreDetail listFunction={globalStore.listMarkerProblem}/>
                            : <></>
                }
            </>
        )
    }

    return null
}

export default observer(MoreView);

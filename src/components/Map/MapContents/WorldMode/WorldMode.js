import {useGlobalStore} from '@/providers/RootStoreProvider';
import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {GeoJSON, useMap} from 'react-leaflet';
import {MapContainer, TileLayer} from "react-leaflet";

const WorldMode = ({stateData}) => {
    const globalStore = useGlobalStore();
    const map = useMap();

    map.eachLayer(layer => {
        if (layer._container?.classList.contains('leaflet-popup')) {
            map.removeLayer(layer);
        }
        if (layer.options.target?.type === 'country-function') {
            map.removeLayer(layer);
        }
    });

    const geoJsonStyle = {
        radius: 8,
        fillColor: "#fff",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    return (
        <>
            {globalStore.blankMap
                ? <GeoJSON data={stateData} style={geoJsonStyle}/>
                : <TileLayer
                    zIndex={0}
                    noWrap={true}
                    attribution="Mile-2-23112022"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            }
        </>
    )
}

export default observer(WorldMode)

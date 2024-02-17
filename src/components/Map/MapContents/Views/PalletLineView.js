// /* eslint-disable react-hooks/exhaustive-deps */
import L from 'leaflet';
import {observer} from 'mobx-react-lite';
import {useMap} from 'react-leaflet';
import {useEffect, useState} from 'react';
import {useGlobalStore} from '@/providers/RootStoreProvider';
import {allLayer} from "@/components/Map/MapContents/Variables/Variables";
import {
    markerGivenSetIcon,
    markerRectHouseIcon,
    markerVerticalPersonIcon
} from "@/components/Map/MapContents/Markers/MarkerIcons";
import styles from "@/components/Map/MapContents/_MapContents.module.scss";
import {
    givenSetPopup,
    mainsetPopup,
    removeHorizontalIconPopup,
    removeRectIconPopup,
    removeVerticalPersonIconPopup
} from "@/components/Map/MapContents/Popups/Popups";

const PalletLineView = () => {
    const map = useMap();
    const globalStore = useGlobalStore();

    const LIST_COUNTRY = [
        {fullName: 'Canada', codeName: 'CAN'},
        {fullName: 'United States of America', codeName: 'USA'},
        {fullName: 'Mexico', codeName: 'MEX'},
    ]

    const [zoom, setZoom] = useState(map.getZoom());
    const [distance, setDistance] = useState(300);
    const [distancePerson, setDistancePerson] = useState(95);

    map.on('zoomend', () => {
        setZoom(map.getZoom());
    });

    useEffect(() => {
        globalStore.setListCountryInRect(LIST_COUNTRY)
    }, []);

    useEffect(() => {
        setDistance(globalStore.map ? 300 : 70)
    }, [globalStore.map]);

    useEffect(() => {
        if (globalStore.clear) {
            map.eachLayer(layer => {
                if (
                    layer.options.target?.status === 'add' || layer.options.status === 'add' ||
                    layer.options.type === 'distance' || layer.options.group?.status === 'add' ||
                    layer.options.type?.status === 'add' || layer.options.type === 'the-given-set'
                ) {
                    map.removeLayer(layer);
                }
            });

            globalStore.toggleClear();
        }
    }, [globalStore.clear]);

    const findLatLngPoint = (latLngElementSelected, latLngElementRelate, map) => {
        let pointElementSelected = map.latLngToContainerPoint(latLngElementSelected);
        let pointElementRelate = map.latLngToContainerPoint(latLngElementRelate);
        let centerX = (pointElementSelected.x + pointElementRelate.x) / 2;
        let centerY = (pointElementSelected.y + pointElementRelate.y) / 2;
        let centerPoint = {x: centerX, y: centerY};
        return map.containerPointToLatLng(centerPoint);
    }

    useEffect(() => {
        for (let i = 0; i < globalStore.listPrincipleLine.length; i++) {
            globalStore.setStatusGivenSetForPrincipleLine(globalStore.listPrincipleLine[i].id, false);
        }
    }, [globalStore.map])

    useEffect(() => {
        for (let i = 0; i < globalStore.listPositionOfPallet1.length; i++) {
            addPallet1(globalStore.listPositionOfPallet1[i]);
        }
        for (let i = 0; i < globalStore.listPositionOfPallet2.length; i++) {
            addPallet2(globalStore.listPositionOfPallet2[i]);
        }
        for (let i = 0; i < globalStore.listPositionOfPallet3.length; i++) {
            addPallet3(globalStore.listPositionOfPallet3[i]);
        }
        for (let i = 0; i < globalStore.listPositionOfPallet4.length; i++) {
            addPallet4(globalStore.listPositionOfPallet4[i]);
        }
    }, [globalStore.map, globalStore.listPositionOfPallet1.length, globalStore.listPositionOfPallet2.length,
        globalStore.listPositionOfPallet3.length, globalStore.listPositionOfPallet4.length]);

    const addPallet1 = (positionOfPallet1) => {
        let latLng1 = positionOfPallet1[0];
        let latLng2 = positionOfPallet1[1];
        L.polyline([[latLng1[0], latLng2[1]], latLng1], {weight: 2, color: 'black', status: 'add'})
            .arrowheads({size: '15px', color: 'red', type: 'arrow', status: 'add'})
            .addTo(map);
        L.polyline([[latLng1[0], latLng2[1]], latLng2], {weight: 2, color: 'black', status: 'add'})
            .arrowheads({size: '15px', color: 'red', type: 'arrow', status: 'add'})
            .addTo(map);
    }

    const addPallet2 = (positionOfPallet2) => {
        let latLng1 = positionOfPallet2[0];
        let latLng2 = positionOfPallet2[1];
        L.polyline([[latLng2[0], latLng1[1]], latLng1], {weight: 2, color: 'black', status: 'add'})
            .arrowheads({size: '15px', color: 'red', type: 'arrow', status: 'add'})
            .addTo(map);
        L.polyline([[latLng2[0], latLng1[1]], latLng2], {weight: 2, color: 'black', status: 'add'})
            .arrowheads({size: '15px', color: 'red', type: 'arrow', status: 'add'})
            .addTo(map);
    }

    const addPallet3 = (positionOfPallet3) => {
        let latLng1 = positionOfPallet3[0];
        let latLng2 = positionOfPallet3[1];
        let centerLatLng = findLatLngPoint(latLng1, [latLng1[0], latLng2[1]], map)
        L.polyline([[centerLatLng.lat, centerLatLng.lng], latLng1], {
            weight: 2,
            color: 'black',
            status: 'add'
        })
            .arrowheads({size: '15px', color: 'red', type: 'arrow', status: 'add'})
            .addTo(map);
        L.polyline([[centerLatLng.lat, centerLatLng.lng], [latLng2[0], centerLatLng.lng]], {
            weight: 2,
            color: 'black',
            status: 'add'
        }).addTo(map);
        L.polyline([[latLng2[0], centerLatLng.lng], latLng2], {weight: 2, color: 'black', status: 'add'})
            .arrowheads({size: '15px', color: 'red', type: 'arrow', status: 'add'})
            .addTo(map);
    }

    const addPallet4 = (positionOfPallet4) => {
        let latLng1 = positionOfPallet4[0];
        let latLng2 = positionOfPallet4[1];
        let centerLatLng = findLatLngPoint(latLng2, [latLng1[0], latLng2[1]], map)
        L.polyline([[centerLatLng.lat, centerLatLng.lng], latLng2], {
            weight: 2,
            color: 'black',
            status: 'add'
        })
            .arrowheads({size: '15px', color: 'red', type: 'arrow', status: 'add'})
            .addTo(map);
        L.polyline([[centerLatLng.lat, centerLatLng.lng], [centerLatLng.lat, latLng1[1]]], {
            weight: 2,
            color: 'black',
            status: 'add'
        }).addTo(map);
        L.polyline([[centerLatLng.lat, latLng1[1]], latLng1], {weight: 2, color: 'black', status: 'add'})
            .arrowheads({size: '15px', color: 'red', type: 'arrow', status: 'add'})
            .addTo(map);
    }

    return null
}

export default observer(PalletLineView)

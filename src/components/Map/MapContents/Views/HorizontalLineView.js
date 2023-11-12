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

const HorizontalLineView = () => {
    const map = useMap();
    const globalStore = useGlobalStore();

    const LIST_COUNTRY = [
        {fullName: 'Canada', codeName: 'CAN'},
        {fullName: 'United States of America', codeName: 'USA'},
        {fullName: 'Mexico', codeName: 'MEX'},
    ]

    const [zoom, setZoom] = useState(map.getZoom());

    map.on('zoomend', () => {
        setZoom(map.getZoom());
    });

    useEffect(() => {
        globalStore.setListCountryInRect(LIST_COUNTRY)
    }, []);

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

    useEffect(() => {
            let world = {};
            let fpBoundary;
            const countriesLayer = [];

            map.eachLayer(layer => {
                if (
                    layer.options.type === 'the-given-set'
                ) {
                    map.removeLayer(layer);
                }
            });

            if ((globalStore.addIcon === 'horizontal-line' || globalStore.addIcon === 'main-set') && globalStore.positionOfHorizontalLine.length > 0) {
                if (globalStore.map) {

                    const latHorizontalLine = globalStore.positionOfHorizontalLine[0];
                    const lngHorizontalLine = globalStore.positionOfHorizontalLine[1];
                    const leftHorizontalLine = [latHorizontalLine, lngHorizontalLine - 120]
                    const rightHorizontalLine = [latHorizontalLine, lngHorizontalLine + 120];

                    if (globalStore.chooseGivenSet) {
                        L.marker([latHorizontalLine, lngHorizontalLine], {
                            options: {
                                type: 'Main set',
                            },
                            icon: markerGivenSetIcon(`${styles['main-set-icon']}`),
                        }).on('contextmenu', e => givenSetPopup(map, e, globalStore.resetPositionOfHorizontalLine))
                            .addTo(map)
                    }

                    const horizontalLineLatLngs = [[leftHorizontalLine, rightHorizontalLine],]
                    const horizontalLine = L.polyline(horizontalLineLatLngs, {weight: 3, color: 'black'})
                        .on('contextmenu', e => removeHorizontalIconPopup(map, e, globalStore.removeHorizontalIcon));
                    horizontalLine.addTo(map);

                    countriesLayer.push(horizontalLine)

                    const dental = 240 / (globalStore.numberPersonInHorizontalLine + 1);

                    for (let i = 0; i < globalStore.numberPersonInHorizontalLine; i++) {
                        const lng = lngHorizontalLine - 120 + (i + 1) * dental;
                        let countryMarker = L.marker([latHorizontalLine, lng], {
                            options: {
                                type: 'Vertical ' + i,
                            },
                            icon: markerVerticalPersonIcon(`${styles['vertical-person-icon']}`),
                        })
                            .on('contextmenu', e => removeVerticalPersonIconPopup(map, e, globalStore.removeVerticalIcon))
                            .addTo(map);

                        countriesLayer.push(countryMarker);
                    }
                }
            } else {
                countriesLayer.forEach((layer) => {
                    map.removeLayer(layer);
                });
            }


            return () => {
                map.removeLayer(world);
                if (fpBoundary) {
                    map.removeLayer(fpBoundary);
                }
                countriesLayer.forEach((layer) => {
                    map.removeLayer(layer);
                });
            };
        }, [globalStore.map, globalStore.numberPersonInHorizontalLine, globalStore.showModalInsertNumberPerson,
            globalStore.positionOfHorizontalLine, globalStore.addIcon, globalStore.chooseGivenSet]
    );

    return null
}

export default observer(HorizontalLineView)

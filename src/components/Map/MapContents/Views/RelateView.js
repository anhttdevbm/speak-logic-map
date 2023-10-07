// /* eslint-disable react-hooks/exhaustive-deps */
import L from 'leaflet';
import {observer} from 'mobx-react-lite';
import {useMap} from 'react-leaflet';
import {useEffect, useState} from 'react';
import {useGlobalStore} from '@/providers/RootStoreProvider';
import {allLayer} from "@/components/Map/MapContents/Variables/Variables";
import {
    markerGivenSetIcon, markerMapElementIcon, markerPersonIcon,
    markerRectHouseIcon, markerRelateElementIcon, markerRelateIcon,
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

const RelateView = () => {
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

            if (globalStore.mapElementRelate !== '' && globalStore.mapView !== ''
                && globalStore.mapElementSelected !== '' && globalStore.positionOfMapElementSelected.length > 0) {
                if (globalStore.map) {
                    const latElementSelected = globalStore.positionOfMapElementSelected[0];
                    const lngElementSelected = globalStore.positionOfMapElementSelected[1];

                    const leftHorizontalLineTop = [latElementSelected, lngElementSelected]
                    const rightHorizontalLineTop = [latElementSelected, lngElementSelected + 150];
                    const topVerticalLine = [latElementSelected, lngElementSelected + 150]
                    const downVerticalLine = [latElementSelected - 30, lngElementSelected + 150];
                    const horizontalLineLatLngsTop = [[leftHorizontalLineTop, rightHorizontalLineTop],]
                    L.polyline(horizontalLineLatLngsTop, {weight: 2, color: 'black'})
                        .on('contextmenu', e => removeHorizontalIconPopup(map, e, globalStore.removeHorizontalIcon))
                        .addTo(map);
                    L.polyline([topVerticalLine, downVerticalLine], { status: 'add', weight: 2, color: 'black' })
                        .arrowheads({ size: '10px', color: 'black', type: 'arrow' })
                        .addTo(map);

                    L.marker([latElementSelected - 30, lngElementSelected + 150], {
                        options: {
                            type: 'Relationship',
                        },
                        icon: markerRelateElementIcon(`${styles['relate-icon']}`),
                    }).on('contextmenu', e => givenSetPopup(map, e, globalStore.resetPositionOfHorizontalLine))
                        .addTo(map)

                    const leftHorizontalLineBottom = [latElementSelected - 60, lngElementSelected];
                    const rightHorizontalLineBottom = [latElementSelected - 60, lngElementSelected + 150];
                    const topVerticalLine2 = [latElementSelected - 60, lngElementSelected + 150]
                    const downVerticalLine2 = [latElementSelected - 30, lngElementSelected + 150];
                    const horizontalLineLatLngsDown = [[leftHorizontalLineBottom, rightHorizontalLineBottom],]
                    L.polyline(horizontalLineLatLngsDown, {weight: 2, color: 'black'})
                        .on('contextmenu', e => removeHorizontalIconPopup(map, e, globalStore.removeHorizontalIcon))
                        .addTo(map);
                    L.polyline([topVerticalLine2, downVerticalLine2], { status: 'add', weight: 2, color: 'black' })
                        .arrowheads({ size: '10px', color: 'black', type: 'arrow' })
                        .addTo(map);

                    L.marker(leftHorizontalLineBottom, {
                        options: {
                            type: 'Relationship',
                        },
                        icon: globalStore.mapElementRelate === 'Person'
                            ? markerPersonIcon(``, 'Person', null)
                            : markerMapElementIcon(`${styles['rectangle-fn']} ${styles['map-element']}`, globalStore.mapElementRelate),
                    }).addTo(map)
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
        }, [globalStore.map, globalStore.mapElementRelate, globalStore.mapElementSelected,
            globalStore.positionOfMapElementSelected, globalStore.mapView]
    );

    return null
}

export default observer(RelateView)

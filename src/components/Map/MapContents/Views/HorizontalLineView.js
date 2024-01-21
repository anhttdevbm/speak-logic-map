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

            if (globalStore.listPrincipleLine.length > 0) {
                for (let i = 0; i < globalStore.listPrincipleLine.length; i++) {
                    let principleLine = globalStore.listPrincipleLine[i];
                    if (principleLine.position.length > 0 && principleLine.numberPerson > 0) {
                        const latHorizontalLine = principleLine.position[0];
                        const lngHorizontalLine = principleLine.position[1];
                        const leftHorizontalLine = [latHorizontalLine, lngHorizontalLine - 120]
                        const rightHorizontalLine = [latHorizontalLine, lngHorizontalLine + 120];

                        if (globalStore.chooseGivenSet && !principleLine.addGivenSetStatus) {
                            L.marker([latHorizontalLine, lngHorizontalLine], {
                                options: {
                                    type: 'the-given-set',
                                    status: 'add'
                                },
                                icon: markerGivenSetIcon(`${styles['main-set-icon']}`),
                            }).on('contextmenu', e => givenSetPopup(map, e, globalStore.resetPositionOfHorizontalLine))
                                .addTo(map);
                            globalStore.setStatusGivenSetForPrincipleLine(principleLine.id, true)
                        }

                        const horizontalLineLatLngs = [[leftHorizontalLine, rightHorizontalLine],]
                        const horizontalLine = L.polyline(horizontalLineLatLngs, {
                            weight: 3,
                            color: 'black',
                            status: 'add',
                            type: 'vertical-principle-line'
                        })
                            .on('contextmenu', e => removeHorizontalIconPopup(map, e, globalStore.removeHorizontalIcon));
                        horizontalLine.addTo(map);

                        countriesLayer.push(horizontalLine)

                        const dental = 240 / (principleLine.numberPerson + 1);

                        for (let i = 0; i < principleLine.numberPerson; i++) {
                            const lng = lngHorizontalLine - 120 + (i + 1) * dental;
                            let countryMarker = L.marker([latHorizontalLine, lng], {
                                options: {
                                    type: 'person-principle-line',
                                    status: 'add',
                                    draggable: false
                                },
                                icon: markerVerticalPersonIcon(`${styles['vertical-person-icon']}`),
                            })
                                .on('contextmenu', e => removeVerticalPersonIconPopup(map, e, globalStore.removeVerticalIcon))
                                .addTo(map);

                            countriesLayer.push(countryMarker);
                        }
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
        }, [globalStore.map, globalStore.listPrincipleLine, globalStore.showModalInsertNumberPerson, globalStore.chooseGivenSet]
    );

    return null
}

export default observer(HorizontalLineView)

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

    const convertLatLng = (lat, lng, delta) => {
        let point = map.latLngToContainerPoint(L.latLng([lat, lng]));
        return map.containerPointToLatLng({
            x: point.x - delta,
            y: point.y,
        })
    }

    useEffect(() => {
        for (let i = 0; i < globalStore.listPrincipleLine.length; i++) {
            globalStore.setStatusGivenSetForPrincipleLine(globalStore.listPrincipleLine[i].id, false);
        }
    }, [globalStore.map])

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
                    if (principleLine.position?.length > 0 && principleLine.numberPerson > 0) {
                        const id = principleLine.id;
                        const latHorizontalLine = principleLine.position[0];
                        const lngHorizontalLine = principleLine.position[1];
                        const leftHorizontalLine = [convertLatLng(latHorizontalLine, lngHorizontalLine, distance).lat, convertLatLng(latHorizontalLine, lngHorizontalLine, distance).lng];
                        const rightHorizontalLine = [convertLatLng(latHorizontalLine, lngHorizontalLine, -distance).lat, convertLatLng(latHorizontalLine, lngHorizontalLine, -distance).lng];

                        if (principleLine.haveGivenSet && !principleLine.addGivenSetStatus) {
                            L.marker([latHorizontalLine, lngHorizontalLine], {
                                target: {
                                    status: 'add'
                                },
                                options: {
                                    type: 'the-given-set',
                                },
                                icon: markerGivenSetIcon(`${styles['main-set-icon']}`),
                            }).on('contextmenu', e => givenSetPopup(map, e, globalStore.resetPositionOfHorizontalLine))
                                .addTo(map);
                            globalStore.setStatusGivenSetForPrincipleLine(principleLine.id, true)
                        }

                        const horizontalLineLatLngs = [leftHorizontalLine, rightHorizontalLine]
                        const horizontalLine = L.polyline([horizontalLineLatLngs], {
                            weight: 1.2,
                            color: 'black',
                            status: 'add',
                            type: 'vertical-principle-line',
                            draggable: true
                        })
                            .on('contextmenu', e => removeHorizontalIconPopup(map, e, globalStore.removeHorizontalIcon));
                        horizontalLine.addTo(map);

                        horizontalLine.on("dragend", function (event) {
                            let latlngs = event.target?._latlngs[0];
                            let lat = latlngs[0]?.lat;
                            let lng = (latlngs[0]?.lng + latlngs[1]?.lng) / 2;
                            globalStore.updatePositionListPrincipleLineById([lat, lng], id);
                            globalStore.toggleStatusDragPrincipleLine();
                        })

                        countriesLayer.push(horizontalLine);

                        let listPositionPerson = findListPositionLatLng(L.latLng(leftHorizontalLine), L.latLng(rightHorizontalLine), principleLine.numberPerson + 2);

                        for (let i = 0; i < principleLine.numberPerson; i++) {
                            let countryMarker = L.marker([listPositionPerson[i].lat, listPositionPerson[i].lng], {
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
        }, [globalStore.map, globalStore.listPrincipleLine, globalStore.showModalInsertNumberPerson,
            distance, globalStore.statusDragPrincipleLine]
    );

    const findListPositionLatLng = (latLngHorFirst, latLngHorLast, n) => {
        let pointFirst = map.latLngToContainerPoint(latLngHorFirst);
        let pointLast = map.latLngToContainerPoint(latLngHorLast);
        let listPositionLatLng = [];
        for (let i = 1; i < n-1; i++) {
            let centerX = pointFirst.x + i * (pointLast.x - pointFirst.x) / (n-1);
            let centerY = pointFirst.y + i * (pointLast.y - pointFirst.y) / (n-1);
            listPositionLatLng.push(map.containerPointToLatLng({x: centerX, y: centerY}))
        }
        return listPositionLatLng;
    }

    return null
}

export default observer(HorizontalLineView)

// /* eslint-disable react-hooks/exhaustive-deps */
import L from 'leaflet';
import {observer} from 'mobx-react-lite';
import {useMap} from 'react-leaflet';
import {allLayer, markerPersonIndex} from '../Variables/Variables';
import {useEffect, useState} from 'react';
import {useCountryStore, useGlobalStore} from '@/providers/RootStoreProvider';
import {
    markerDistancePointIcon,
    markerFnIcon,
    markerHouseIconWithName, markerPlusIcon,
    markerRectHouseIcon, markerRectNameIcon, markerRelateIcon,
    markerRoomIcon
} from '../Markers/MarkerIcons';
import styles from '../_MapContents.module.scss';
import {addStaticDistance} from '../Markers/AddMarkers';
import * as turf from '@turf/turf';
import {addSelectedItem} from '../Markers/HandleSelectItem';
import {
    addMarkerFn, addMarkerPerson, addSoluOrProbFn,
    addMarkerCountryFn, addMarkerCountryGroupFn
} from '../Markers/AddMarkers';
import {removeRectIconPopup, tempFnPopup} from "@/components/Map/MapContents/Popups/Popups";
import {getGeoMainLand} from "@/utils/get_geo_mainland";

const RView = ({selectedData}) => {
    const map = useMap();
    const globalStore = useGlobalStore();
    const countryStore = useCountryStore();

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
                    layer.options.type?.status === 'add'
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
            if (globalStore.rectangularView === 'rect-world') {
                map.eachLayer(layer => {
                    if (layer._arrowheads) {
                        layer.remove();
                    }
                    allLayer.push(layer);
                });

                map.eachLayer(layer => map.removeLayer(layer));

                if (globalStore.map) {
                    const firstLat = -50;
                    const firstLng = -120;
                    const latList = [40.5, -1, -42];
                    const lngList = [-99, -52, -4, 41, 88]
                    // Add the floor-plan boundary
                    let bounds = [[firstLat, firstLng], [-firstLat, -firstLng]];
                    fpBoundary = L.rectangle(bounds, {weight: 2, opacity: 1, fillOpacity: 0, color: 'black'});
                    fpBoundary.addTo(map);

                    let listCountry = globalStore.listCountryInRect;
                    let listCountryIncludedPlus = listCountry.filter(item => item.codeName === '');
                    if (listCountryIncludedPlus.length === 0) {
                        listCountry.push({codeName: '', fullName: ''});
                    }

                    listCountry.forEach((country, index) => {
                        let countryMarker;
                        const nameIcon = country.fullName.includes(" ") ? country.codeName : country.fullName;

                        if (globalStore.rectName === 'rect-distance') {
                            const latListt = [40.5, -1, -42];
                            const lngListt = [-99, -30, 41, 88];
                            if (country.codeName !== '') {
                                countryMarker = L.marker([latListt[Math.floor(index / lngListt.length)], lngListt[index % lngListt.length]], {
                                    options: {
                                        type: country.codeName,
                                    },
                                    icon: markerRectHouseIcon(
                                        `${styles['rect-house-icon']}`,
                                        nameIcon.toUpperCase()),
                                }).addTo(map)
                                if (index < listCountry.length - 2) {
                                    addStaticDistance(map, latListt[Math.floor(index / lngListt.length)], lngListt[index % lngListt.length],
                                        latListt[Math.floor((index + 1) / lngListt.length)], lngListt[(index + 1) % lngListt.length], true, 'rect-distance')
                                }
                            } else {
                                countryMarker = L.marker([latListt[Math.floor(index / lngListt.length)], lngListt[index % lngListt.length]], {
                                    options: {
                                        type: 'room',
                                    },
                                    icon: markerPlusIcon(
                                        `${styles['plus-icon']}`),
                                })
                                    .on('click', e => {
                                        globalStore.toggleModalInsertCountry();
                                    })
                                    .addTo(map);
                            }
                        } else {
                            const lat = latList[Math.floor(index / lngList.length)];
                            const lng = lngList[index % lngList.length];
                            if (country.codeName !== '') {
                                if (globalStore.rectName === 'rect-map') {
                                } else {
                                    countryMarker = L.marker([lat, lng], {
                                        options: {
                                            type: country.codeName,
                                        },
                                        icon: globalStore.rectName === 'rect-house'
                                            ? markerRectHouseIcon(
                                                `${styles['rect-house-icon']}`,
                                                nameIcon.toUpperCase())
                                            : globalStore.rectName === 'rect-house-no-border'
                                                ? markerRectHouseIcon(
                                                    `${styles['rect-house-icon-no-border']}`,
                                                    nameIcon.toUpperCase())
                                                : markerRectNameIcon(`${styles['rect-house-icon']}`,
                                                    nameIcon.toUpperCase()),
                                    })
                                        .on('contextmenu', e => removeRectIconPopup(map, e, globalStore.removeCountryToRect))
                                        .addTo(map);
                                }
                            } else {
                                countryMarker = L.marker([lat, lng], {
                                    options: {
                                        type: 'room',
                                    },
                                    icon: markerPlusIcon(
                                        `${styles['plus-icon']}`),
                                })
                                    .on('click', e => {
                                        globalStore.toggleModalInsertCountry();
                                    })
                                    .addTo(map);
                            }
                        }
                        countriesLayer.push(countryMarker);
                    })
                }
            } else if (globalStore.rectangularView === 'rect-country') {
                map.eachLayer(layer => {
                    if (layer._arrowheads) {
                        layer.remove();
                    }
                    allLayer.push(layer);
                });

                map.eachLayer(layer => map.removeLayer(layer));
                if (!globalStore.map) {
                    const firstLat = -50;
                    const firstLng = -120;
                    const latList = [40.5, -1, -42];
                    const lngList = [-99, -52, -4, 41, 88]
                    // Add the floor-plan boundary
                    let bounds = [[firstLat, firstLng], [-firstLat, -firstLng]];
                    fpBoundary = L.rectangle(bounds, {weight: 2, opacity: 1, fillOpacity: 0, color: 'black'});
                    fpBoundary.addTo(map);

                    let country = selectedData[0].features[0].properties;
                    console.log('country', country)

                    const lat = latList[0];
                    const lng = lngList[0];
                    const nameIcon = country.NAME.includes(" ") ? country.CODE : country.NAME;
                    let countryMarker = L.marker([lat, lng], {
                        options: {
                            type: country.CODE,
                        },
                        icon: globalStore.rectName === 'rect-house'
                            ? markerRectHouseIcon(
                                `${styles['rect-house-icon']}`,
                                nameIcon.toUpperCase())
                            : globalStore.rectName === 'rect-house-no-border'
                                ? markerRectHouseIcon(
                                    `${styles['rect-house-icon-no-border']}`,
                                    nameIcon.toUpperCase())
                                : markerRectNameIcon(`${styles['rect-house-icon']}`,
                                    nameIcon.toUpperCase()),
                    })
                        .on('contextmenu', e => removeRectIconPopup(map, e, globalStore.removeCountryToRect))
                        .addTo(map);
                    countriesLayer.push(countryMarker);
                }
            } else if (globalStore.rectangularView === '') {
                let orientation;
                let point1;
                let point2;
                let name;

                allLayer.forEach(layer => {
                    if (layer._text) {
                        delete layer._text;
                    }
                    map.addLayer(layer);
                });

                map.eachLayer(layer => {
                    if (
                        layer.setText && layer.options.color !== 'transparent' &&
                        (layer.options.type === 'arc' || layer.options.type === 'line')
                    ) {
                        if (layer.options.kind === 'distance') {
                            name = 'Distance';
                        } else {
                            name = (layer.options.type === 'arc') ? 'Arc-route' : 'Inter-route';
                        }

                        if (layer.options.type === 'line') {
                            point1 = layer.getLatLngs()[0].lng;
                            point2 = layer.getLatLngs()[1].lng;
                        } else {
                            point1 = layer.getLatLngs()[1][1];
                            point2 = layer.getLatLngs()[4][1];
                        }

                        orientation = (point1 < point2) ? 0 : 180;

                        if (!layer._text) {
                            layer.setText(name, {
                                center: true,
                                offset: -3,
                                orientation: orientation
                            });
                        }
                    }
                });
                allLayer.splice(0, allLayer.length);
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
        }, [globalStore.map, globalStore.rectangularView, globalStore.listCountryInRect, globalStore.rectName, selectedData]
    )
    ;

    const calculationDistaneBetweenCountry = () => {
        const earthRadius = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLng = (lng2 - lng1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c;
    }

    useEffect(() => {
        if (globalStore.showRoomDistance && globalStore.map && globalStore.floorPlanView && !globalStore.roomView) {
            const roomList = [];
            map.eachLayer(layer => {
                // console.log(layer)
                if (layer.options.options?.type === 'room') {
                    roomList.push(layer);
                }
            })

            if (roomList.length > 1) {
                for (let i = 0; i < roomList.length - 1; i++) {
                    for (let j = i + 1; j < roomList.length; j++) {
                        setTimeout(() => {
                            addStaticDistance(map, roomList[i]._latlng.lat, roomList[i]._latlng.lng, roomList[j]._latlng.lat, roomList[j]._latlng.lng, true, 'room-distance')
                        }, 1000)
                    }
                }
            }
        } else {
            map.eachLayer(layer => {
                if (layer.options.options?.type === 'room-distance') {
                    map.removeLayer(layer.parentLine);
                    map.removeLayer(layer.parentLine_1);
                    map.removeLayer(layer.parentArc);
                    if (layer.parentArcArrow) {
                        map.removeLayer(layer.parentArcArrow);
                    }
                    if (layer.parentArcArrow_1) {
                        map.removeLayer(layer.parentArcArrow_1);
                    }
                    map.removeLayer(layer);
                }
            })
        }
    }, [globalStore.showRoomDistance, globalStore.map, globalStore.floorPlanView])

// Change floor plan text size after zoo

    return null
}

export default observer(RView)

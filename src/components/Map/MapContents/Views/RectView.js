// /* eslint-disable react-hooks/exhaustive-deps */
import L from 'leaflet';
import {observer} from 'mobx-react-lite';
import {useMap} from 'react-leaflet';
import {allLayer} from '../Variables/Variables';
import {useEffect, useState} from 'react';
import {useCountryStore, useGlobalStore} from '@/providers/RootStoreProvider';
import {
    markerMapCountryIcon, markerPlusIcon,
    markerRectHouseIcon, markerRectNameIcon,
} from '../Markers/MarkerIcons';
import styles from '../_MapContents.module.scss';
import {addShotDistance, addStaticDistance} from '../Markers/AddMarkers';
import {removeRectIconPopup} from "@/components/Map/MapContents/Popups/Popups";

const RectView = ({selectedData}) => {
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
                map.eachLayer(layer => map.removeLayer(layer));
                map.eachLayer(layer => {
                    if (layer._arrowheads) {
                        layer.remove();
                    }
                    allLayer.push(layer);
                });

                if (globalStore.map) {
                    let firstLat = null;
                    let firstLng = null;
                    let latList = null;
                    let lngList = null;
                    // Rectangle View Non-linear
                    if (globalStore.rectViewSetting === 'rect-linear') {
                        firstLat = -25;
                        firstLng = -180;
                        latList = [12.5, 15];
                        lngList = [-155, -112, -70, -28, 14, 56, 98, 140];
                    } else {
                        firstLat = -60;
                        firstLng = -120;
                        latList = [53, 15, -32];
                        lngList = [-99, -52, -4, 41, 88];
                        if (zoom >= 3) {
                            latList = [53, 20, 0, -20 - 40];
                            lngList = [-99, -75, -52, -28, -4, 20, 44, 68, 94];
                        }
                    }

                    // Add the floor-plan boundary
                    let bounds = [[firstLat, firstLng], [-firstLat, -firstLng]];
                    fpBoundary = L.rectangle(bounds, {weight: 2, opacity: 1, fillOpacity: 0, color: 'black'});
                    fpBoundary.addTo(map);

                    let listCountry = globalStore.listCountryInRect;
                    let listCountryIncludedPlus = listCountry.filter(item => item.codeName === '');
                    if (listCountryIncludedPlus.length === 0) {
                        listCountry.push({codeName: '', fullName: ''});
                    }
                    moveToLast(listCountry);
                    listCountry.forEach((country, index) => {
                        let countryMarker;

                        if (globalStore.rectDistanceType === 'rect-distance') {
                            let latListt = [53, 15, -32];
                            let lngListt = [-99, -36, 29, 90];
                            if (zoom >= 3) {
                                latListt = [53, 20, 0, -20 - 40];
                                lngListt = [-99, -57, -18, 20, 60, 100];
                            }
                            if (country.codeName !== '') {
                                const nameIcon = country.fullName?.includes(" ") ? country.codeName : country.fullName;
                                countryMarker = L.marker([latList[Math.floor(index / lngList.length)], lngList[index % lngList.length]], {
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
                                            : globalStore.rectName === 'rect-map'
                                                ? markerMapCountryIcon(
                                                    `${styles['rect-house-icon']} ${styles['rect-house-icon-no-border']}`,
                                                    nameIcon.toUpperCase(), country.codeName.toUpperCase())
                                                : markerRectNameIcon(`${styles['rect-house-icon']}`,
                                                    nameIcon.toUpperCase()),
                                }).addTo(map)
                                if (index < listCountry.length - 2) {
                                    addStaticDistance(map, latList[Math.floor(index / lngList.length)], lngList[index % lngList.length],
                                        latList[Math.floor((index + 1) / lngList.length)], lngList[(index + 1) % lngList.length], true, 'rect-distance')
                                }
                            } else {
                                countryMarker = L.marker([latList[Math.floor(index / lngList.length)], lngList[index % lngList.length]], {
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
                        } else if (globalStore.rectDistanceType === 'rect-shot-distance') {
                            let latListt = [53, 15, -32];
                            let lngListt = [-99, -36, 29, 90];
                            if (zoom >= 3) {
                                latListt = [53, 20, 0, -20 - 40];
                                lngListt = [-99, -57, -18, 20, 60, 100];
                            }
                            if (country.codeName !== '') {
                                const nameIcon = country.fullName?.includes(" ") ? country.codeName : country.fullName;
                                countryMarker = L.marker([latList[Math.floor(index / lngList.length)], lngList[index % lngList.length]], {
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
                                            : globalStore.rectName === 'rect-map'
                                                ? markerMapCountryIcon(
                                                    `${styles['rect-house-icon']} ${styles['rect-house-icon-no-border']}`,
                                                    nameIcon.toUpperCase(), country.codeName.toUpperCase())
                                                : markerRectNameIcon(`${styles['rect-house-icon']}`,
                                                    nameIcon.toUpperCase()),
                                }).addTo(map)
                                if (index < listCountry.length - 2) {
                                    addShotDistance(map, latList[Math.floor(index / lngList.length)], lngList[index % lngList.length],
                                        latList[Math.floor((index + 1) / lngList.length)], lngList[(index + 1) % lngList.length], true, 'rect-distance')
                                }
                            } else {
                                countryMarker = L.marker([latList[Math.floor(index / lngList.length)], lngList[index % lngList.length]], {
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
                                const nameIcon = country.fullName?.includes(" ") ? country.codeName : country.fullName;
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
                                            : globalStore.rectName === 'rect-map'
                                                ? markerMapCountryIcon(
                                                    `${styles['rect-house-icon']} ${styles['rect-house-icon-no-border']}`,
                                                    nameIcon.toUpperCase(), country.codeName.toUpperCase())
                                                : markerRectNameIcon(`${styles['rect-house-icon']}`,
                                                    nameIcon.toUpperCase()),
                                })
                                    .on('contextmenu', e => removeRectIconPopup(map, e, globalStore.removeCountryToRect))
                                    .addTo(map);

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
                                : globalStore.rectName === 'rect-map'
                                    ? markerMapCountryIcon(
                                        `${styles['rect-house-icon']}`,
                                        nameIcon.toUpperCase(), country.CODE.toUpperCase())
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
        }, [globalStore.map, globalStore.listCountryInRect, globalStore.rectangularView, globalStore.rectName, globalStore.rectViewSetting,
            globalStore.rectDistanceType, selectedData, globalStore.showModalInsertCountry, zoom]
    );

    const moveToLast = (arr) => {
        let element = arr.filter(item => item.codeName === '');
        if (element.length > 0) {
            const index = arr.indexOf(element[0]);
            if (index !== -1) {
                arr.splice(index, 1);
                arr.push(element[0]);
            }
        }
    }

    return null
}

export default observer(RectView)

// /* eslint-disable react-hooks/exhaustive-deps */
import L from 'leaflet';
import {observer} from 'mobx-react-lite';
import {useMap} from 'react-leaflet';
import {allLayer} from '../Variables/Variables';
import {useEffect, useState} from 'react';
import {useCountryStore, useGlobalStore} from '@/providers/RootStoreProvider';
import {markerRectHouseIcon, markerRectNameIcon} from '../Markers/MarkerIcons';
import styles from '../_MapContents.module.scss';
import {addStaticDistance} from '../Markers/AddMarkers';
import * as turf from '@turf/turf';
import {getGeoMainLand} from "@/utils/get_geo_mainland";

const RectangularView = () => {
    const map = useMap();
    const globalStore = useGlobalStore();
    const countryStore = useCountryStore();

    const [zoom, setZoom] = useState(map.getZoom());
    const [boundingBox, setBoundingBox] = useState(map.getBounds());

    map.on('zoomend', () => {
        setZoom(map.getZoom());
    });

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
        addMarkerCountryToMap()
    }, [boundingBox, globalStore.map, globalStore.rectangularView, globalStore.countryQuantity, globalStore.fpRoomName]);

    // Change floor plan text size after zoom
    useEffect(() => {
        setBoundingBox(map.getBounds());
    }, [zoom])

    useEffect(() => {
        if (globalStore.showRoomDistance && globalStore.map && globalStore.rectangularView && !globalStore.roomView) {
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
    }, [globalStore.showRoomDistance, globalStore.map, globalStore.rectangularView])

    const isWithinBoundingBox = (markerLatLng) => {
        return markerLatLng[0] <= boundingBox._northEast.lng &&
            markerLatLng[0] >= boundingBox._southWest.lng &&
            markerLatLng[1] <= boundingBox._northEast.lat &&
            markerLatLng[1] >= boundingBox._southWest.lat;
    }

    const addMarkerCountryToMap = () => {
        let world = {};
        let fpBoundary;
        let fpBoundaryText;
        const countriesLayer = [];
        if (globalStore.countryQuantity > 0 && countryStore.countries.length === globalStore.countryQuantity) {
            if (globalStore.rectangularView === 'rect-name' || globalStore.rectangularView === 'rect-house') {
                map.eachLayer(layer => {
                    if (layer._arrowheads) {
                        layer.remove();
                    }
                    allLayer.push(layer);
                });

                map.eachLayer(layer => map.removeLayer(layer));

                if (globalStore.map) {
                    const firstLat = 83;
                    const firstLng = -175;
                    const latList = [81.5, 79, 75.8, 71.6, 66.4, 59.5, 51, 40.5, 28, 14, -1, -16, -29.7, -42, -52.2, -60.5, -67, -72.3, -76.3, -79.4, -81.8];
                    const lngList = [-156.5, -128, -99, -70, -42, -14, 14, 41, 69.5, 98, 127, 155.5]
                    // Add the floor-plan boundary
                    let bounds = [[firstLat, firstLng], [-firstLat, -firstLng]];
                    fpBoundary = L.rectangle(bounds, {weight: 1, opacity: 1, fillOpacity: 0});
                    fpBoundary.addTo(map);
                    console.log("fpBoundary", fpBoundary)
                    countryStore.countries.forEach((country, index) => {
                        // console.log('logcountry', country.data[0].features[0].geometry.coordinates[0][0][0], boundingBox)
                        if (!country.name.codeName.includes('-99')) {
                            const lat = latList[index % latList.length];
                            const lng = lngList[Math.floor(index / latList.length)];
                            // console.log('lat, lng', lat, lng, name)
                            const mainLand = getGeoMainLand(country.data[0]);
                            const center = turf.center(turf.points(mainLand.features[0].geometry.coordinates[0])).geometry.coordinates;
                            console.log('mainLand', mainLand)
                            console.log('center', center, isWithinBoundingBox(center))
                            const isInsideBoundingBox = isWithinBoundingBox(center);
                            if (isInsideBoundingBox) {
                                const countryMarker = L.marker([lat, lng], {
                                    options: {
                                        type: 'room',
                                    },
                                    icon: globalStore.rectangularView === 'rect-name'
                                        ? markerRectNameIcon(
                                            `${styles['rect-icon']}`,
                                            country.name.fullName)
                                        : globalStore.rectangularView === 'rect-house'
                                            ? markerRectHouseIcon(
                                                `${styles['rect-icon']}`,
                                                country.name.fullName
                                            ) : markerRectHouseIcon(
                                                `${styles['rect-icon-no-border']}`,
                                                country.name.fullName,)
                                })
                                    .on('click', e => {
                                        // addSelectedItem(e, map, globalStore.lock);
                                    })
                                    .addTo(map);

                                countriesLayer.push(countryMarker);
                            }
                        }
                    })
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
        }


        return () => {
            map.removeLayer(world);
            if (fpBoundary) {
                map.removeLayer(fpBoundary);
            }
            if (fpBoundaryText) {
                map.removeLayer(fpBoundaryText);
            }
            countriesLayer.forEach((layer) => {
                map.removeLayer(layer);
            });
        };
    }

    return null
}

export default observer(RectangularView)
// /* eslint-disable react-hooks/exhaustive-deps */
import L from 'leaflet';
import {observer} from 'mobx-react-lite';
import {useMap} from 'react-leaflet';
import {allLayer} from '../Variables/Variables';
import {useEffect, useState} from 'react';
import {useCountryStore, useGlobalStore} from '@/providers/RootStoreProvider';
import {markerRoomIcon} from '../Markers/MarkerIcons';
import styles from '../_MapContents.module.scss';
import {addShotDistance, addStaticDistance} from '../Markers/AddMarkers';
import * as turf from '@turf/turf';
import {addSelectedItem} from '../Markers/HandleSelectItem';
import {floorPopup, roomPopup} from "@/components/Map/MapContents/Popups/Popups";

const FloorPlanView = ({selectedData}) => {
    const map = useMap();
    const globalStore = useGlobalStore();
    const countryStore = useCountryStore();

    const [zoom, setZoom] = useState(map.getZoom());

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
            globalStore.clearFloorDistance();
        }
    }, [globalStore.clear]);

    useEffect(() => {
        let name = '';

        // Check room name option.
        if (globalStore.fpRoomName === 'room') {
            name = "Room";
        } else if (globalStore.fpRoomName === 'r') {
            name = 'R';
        }
        let world = {};
        let fpBoundary;
        let fpBoundaryText;
        const countriesLayer = [];
        if (globalStore.countryQuantity > 0 && countryStore.countries.length === globalStore.countryQuantity) {
            if (globalStore.floorPlanView === 'floorplan-countries') {
                map.eachLayer(layer => map.removeLayer(layer));

                map.eachLayer(layer => {
                    if (layer._arrowheads) {
                        layer.remove();
                    }
                    allLayer.push(layer);
                });


                if (globalStore.map) {
                    const firstLat = 83;
                    const firstLng = -175;
                    const latList = [81.5, 79, 75.8, 71.6, 66.4, 59.5, 51, 40.5, 28, 14, -1, -16, -29.7, -42, -52.2, -60.5, -67, -72.3, -76.3, -79.4, -81.8];
                    const lngList = [-156.5, -128, -99, -70, -42, -14, 14, 41, 69.5, 98, 127, 155.5]
                    // Add the floor-plan boundary
                    let bounds = [[firstLat, firstLng], [-firstLat, -firstLng]];
                    fpBoundary = L.rectangle(bounds, {weight: 1, opacity: 1, fillOpacity: 0});
                    fpBoundary.addTo(map);

                    countryStore.countries.forEach((country, index) => {
                        if (!country.name.codeName.includes('-99')) {
                            const lat = latList[index % latList.length];
                            const lng = lngList[Math.floor(index / latList.length)];
                            // const mainLand = getGeoMainLand(country.data[0]);
                            // const center = turf.center(turf.points(mainLand.features[0].geometry.coordinates[0])).geometry.coordinates;
                            const countryMarker = L.marker([lat, lng], {
                                options: {
                                    type: 'room',
                                },
                                icon: markerRoomIcon(
                                    `${styles['room-icon']}`,
                                    name ? `${name} ${index + 1}` : country.name.codeName.toUpperCase()),
                            })
                                .on('click', e => {
                                    addSelectedItem(e, map, globalStore.lock);
                                })
                                .on('contextmenu', (e) => floorPopup(map, e, lat, lng))
                                .addTo(map);

                            countriesLayer.push(countryMarker);
                        }
                    })
                } else {
                    // const mainLand = getGeoMainLand(selectedData[0]);
                    // const center = turf.center(turf.points(mainLand.features[0].geometry.coordinates[0])).geometry.coordinates;
                    // const lat = center.reverse()[0];
                    // const lng = center.reverse()[1];
                    let bounds = [[30, 30], [-30, -30]];
                    fpBoundary = L.rectangle(bounds, {weight: 1, opacity: 1, fillOpacity: 0});
                    fpBoundary.addTo(map);
                    const countryMarker = L.marker([0, 0], {
                        options: {
                            type: 'room',
                        },
                        icon: markerRoomIcon(
                            `${styles['room-icon']}`,
                            name ? `${name}` : selectedData[0].features[0].properties.CODE.toUpperCase()),
                    }).addTo(map);
                    countriesLayer.push(countryMarker);
                }
            } else if (globalStore.floorPlanView === '') {
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
    }, [globalStore.map, globalStore.floorPlanView, globalStore.countryQuantity, globalStore.fpRoomName]);

    //

    useEffect(() => {
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

        if (globalStore.showFloorPlanDistance !== '' && globalStore.map && globalStore.floorPlanView) {
            const latList = [81.5, 79, 75.8, 71.6, 66.4, 59.5, 51, 40.5, 28, 14, -1, -16, -29.7, -42, -52.2, -60.5, -67, -72.3, -76.3, -79.4, -81.8];
            const lngList = [-156.5, -128, -99, -70, -42, -14, 14, 41, 69.5, 98, 127, 155.5]
            const roomList = [];
            // map.eachLayer(layer => {
            //     // console.log(layer)
            //     if (layer.options.options?.type === 'room') {
            //         roomList.push(layer);
            //     }
            // })
            let latI = 0;
            let lngI = 0;
            let indexLng = 0;
            countryStore.countries.forEach((country, index) => {
                if (!country.name.codeName.includes('-99')) {
                    const lat = latList[index % latList.length];
                    const lng = lngList[Math.floor(index / latList.length)];
                    //distance row
                    if (latI !== 0 && lngI !== 0 && lng !== -81.8) {
                        if (globalStore.showFloorPlanDistance === 'plan-view-distance')
                            addStaticDistance(map, latI, lngI, lat, lngI, true, 'room-distance');
                        else if (globalStore.showFloorPlanDistance === 'plan-view-shot')
                            addShotDistance(map, latI, lngI, lat, lngI, true, 'room-distance');
                    }
                    //distance colum
                    if (lng !== -156.5) {
                        indexLng = lngList.indexOf(lng);
                        if (indexLng > 0) {
                            if (globalStore.showFloorPlanDistance === 'plan-view-distance')
                                addStaticDistance(map, lat, lng, lat, lngList[indexLng - 1], true, 'room-distance');
                            else if (globalStore.showFloorPlanDistance === 'plan-view-shot')
                                addShotDistance(map, lat, lng, lat, lngList[indexLng - 1], true, 'room-distance');
                        }
                    }
                    latI = lat;
                    lngI = lng;
                }
            })
        }
    }, [globalStore.showFloorPlanDistance, globalStore.map, globalStore.floorPlanView, map, countryStore.countries, globalStore.fpRoomName])

    // Change floor plan text size after zoom
    useEffect(() => {
        let fpBoundaryText;
        if (globalStore.floorPlanView === 'floorplan-countries' &&
            globalStore.countryQuantity > 0 && countryStore.countries.length === globalStore.countryQuantity) {
            if (globalStore.map) {
                let textLatLng = [-83, 0]
                map.eachLayer(layer => {
                    if (layer.options.target?.type === 'fp-boundary-text') {
                        map.removeLayer(layer);
                    }
                });

                fpBoundaryText = L.marker(textLatLng, {
                    target: {
                        type: 'fp-boundary-text',
                    },
                    draggable: false,
                    icon: L.divIcon({
                        iconSize: [100, 50],
                        iconAnchor: [50, 25],
                        className: styles['fp-boundary-text'],
                        html: `<p style="font-size: ${Math.round(16 * (zoom >= 2 ? zoom / 2 : 1))}px">Floor plan</p>`
                    })
                })
                fpBoundaryText.addTo(map);
            } else {
                fpBoundaryText = L.marker([-25 - zoom, 0], {
                    target: {
                        type: 'fp-boundary-text',
                    },
                    draggable: false,
                    icon: L.divIcon({
                        iconSize: [100, 50],
                        iconAnchor: [50, 25],
                        className: styles['fp-boundary-text'],
                        html: `<p style="font-size: ${Math.round(16 * (zoom >= 2 ? zoom / 2 : 1))}px">Floor plan</p>`
                    })
                }).addTo(map)
            }
        }
        return () => {
            if (fpBoundaryText) {
                map.removeLayer(fpBoundaryText);
            }
        }
    }, [zoom, globalStore.map, globalStore.floorPlanView, globalStore.countryQuantity, countryStore.countries.length, map])

    return null
}

export default observer(FloorPlanView)

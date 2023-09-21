/* eslint-disable react-hooks/exhaustive-deps */
import L from 'leaflet';
import "leaflet-ellipse";
import {observer} from 'mobx-react-lite';
import {Polygon, useMap} from 'react-leaflet';
import {allLayer} from '../Variables/Variables';
import React, {useEffect, useState} from 'react';
import {useCountryStore, useGlobalStore} from '@/providers/RootStoreProvider';
import {addMarkerFn} from '../Markers/AddMarkers';
import {getGeoMainLand} from '@/utils/get_geo_mainland';
import * as turf from '@turf/turf';

import IMG_WORLD_FLAG from '@/assets/images/world-flag.png';
import {countryFlagList} from '@/utils/country_flag_list';
import styles from "@/components/Map/MapContents/_MapContents.module.scss";
import IMG_WAVE from "@/assets/images/wave.png";

const RectangularView = ({selectedData, setModal, setModalType}) => {
    const map = useMap();
    const globalStore = useGlobalStore();
    const countryStore = useCountryStore();
    const [boatFG, setBoatFG] = useState();
    const [bodyRectLatLngsState, setBodyRectLatLngState] = useState();


    const generateBoat = (boatType, centerLatLng, boat, boatName) => {
        const isWorldBoat = boatType === 'world';
        const bodyBoatWidthPX = isWorldBoat ? 600 : 300;
        const bodyBoatTopWidthPX = isWorldBoat ? bodyBoatWidthPX + 200 : bodyBoatWidthPX + 100;
        const bodyBoatHeightPX = isWorldBoat ? 250 : 125;

        // Get the 4 sides's latlngs of the boat's body
        const centerPoint = map.latLngToContainerPoint(centerLatLng); // Convert center latlng to point
        const topLeftPoint = centerPoint.add([bodyBoatWidthPX / 2, bodyBoatHeightPX / 2]); // Calculate the bottom right point
        const topRightPoint = centerPoint.add([-bodyBoatWidthPX / 2, bodyBoatHeightPX / 2]);
        const bottomRightPoint = centerPoint.subtract([bodyBoatWidthPX / 2, bodyBoatHeightPX / 2]); // Calculate the bottom right point
        const bottomLeftPoint = centerPoint.subtract([-bodyBoatWidthPX / 2, bodyBoatHeightPX / 2]);
        const topLeftLatLng = map.containerPointToLatLng(topLeftPoint); // Convert top left point to lat lng
        const topRightLatLng = map.containerPointToLatLng(topRightPoint); // Convert top right point to lat lng
        const bottomRightLatLng = map.containerPointToLatLng(bottomRightPoint);  // Convert bottom right point to lat lng
        const bottomLeftLatLng = map.containerPointToLatLng(bottomLeftPoint); // Convert botom left point to lat lng

        // Create a boat's body from an array of LatLng points
        const bodyBoatLatLngs = [[bottomLeftLatLng, topLeftLatLng, topRightLatLng, bottomRightLatLng]];
        const bodyBoatPolygon = L.polygon(bodyBoatLatLngs, {weight: 5, color: 'black', fillColor: 'white', className: 'boat-body'});
        bodyBoatPolygon.addTo(boat);
        setBodyRectLatLngState(bodyBoatLatLngs);

        // handle click on boat
        bodyBoatPolygon.on('click', (e) => {
            if (globalStore.click) {
                if (globalStore.addIcon === 'function') {
                    // handleAddFuncToBoat(e.latlng, boat, bodyBoatLatLngs);
                } else if (globalStore.addIcon !== '') {
                    globalStore.addIconHandle('');
                }
            }
        });
    }

    // useEffect(() => {
    //     if (globalStore.clear) {
    //         map.eachLayer(layer => {
    //             if (
    //                 layer.options.target?.status === 'add' || layer.options.status === 'add' ||
    //                 layer.options.type === 'distance' || layer.options.group?.status === 'add' ||
    //                 layer.options.type?.status === 'add'
    //             ) {
    //                 map.removeLayer(layer);
    //             }
    //         });
    //
    //         globalStore.toggleClear();
    //     }
    // }, [globalStore.clear]);

    // Trigger Boat View
    useEffect(() => {
        map.setZoom(2)
        let name = '';

        const boat = L.featureGroup();
        // Array contains all boats
        const countriesLayer = [];

        if (globalStore.countryQuantity > 0 && countryStore.countries.length === globalStore.countryQuantity) {

            if (globalStore.rectangularView !== '') {
                map.eachLayer(layer => {
                    if (layer._arrowheads) {
                        layer.remove();
                    }
                    allLayer.push(layer);
                });

                map.eachLayer(layer => map.removeLayer(layer));

                if (globalStore.map) {
                    // Define the width and height in pixels
                    const center = L.latLng(0, 0); // Center lat lng of boat
                    generateBoat('world', center, boat, 'WORLD');
                    boat.addTo(map);
                    boat.options = {
                        type: 'boat'
                    };

                    setBoatFG(boat)
                    // zoom the map to the polygon
                    map.fitBounds(boat.getBounds());
                }
            } else if (globalStore.boatView === 'boat-countries') {
                map.eachLayer(layer => {
                    if (layer._arrowheads) {
                        layer.remove();
                    }
                    allLayer.push(layer);
                });

                map.eachLayer(layer => map.removeLayer(layer));
                if (!globalStore.map) {
                    const mainLand = getGeoMainLand(selectedData[0]);
                    const center = turf.center(turf.points(mainLand.features[0].geometry.coordinates[0])).geometry.coordinates;
                    center.reverse();
                    const countryCode = selectedData[0].features[0].properties.CODE.toUpperCase()
                    const boatName = name ? `${name}` : countryCode
                    generateBoat(countryCode, center, boat, boatName);
                    boat.addTo(map);
                    boat.options = {
                        type: 'boat'
                    }
                    setBoatFG(boat)
                    // zoom the map to the polygon
                    map.fitBounds(boat.getBounds());
                }
            } else if (globalStore.boatView === '') {
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
            map.removeLayer(boat);
            countriesLayer.forEach((layer) => {
                map.removeLayer(layer);
            });
        };
    }, [globalStore.map, globalStore.boatView, globalStore.boatName, selectedData]);

    useEffect(() => {
        if (!globalStore.click && boatFG && bodyRectLatLngsState) {
            const boatBody = document.querySelector('.boat-body');
            boatBody.ondragover = (e) => e.preventDefault();

            boatBody.ondrop = (e) => {
                const latlng = map.containerPointToLatLng(L.point(e.layerX, e.layerY));

                if (globalStore.addIcon === 'function') {
                    handleAddFuncToBoat(latlng, boatFG, bodyRectLatLngsState)
                } else if (globalStore.addIcon !== '') {
                    globalStore.addIconHandle('');
                }
            }
        }
    }, [globalStore.click, globalStore.addIcon])

    // console.log('bodyRectLatLngsState', bodyRectLatLngsState)
    //
    // return (
    //     {
    //         bodyRectLatLngsState : (
    //             <Polygon position={bodyRectLatLngsState}
    //                      pathOptions={{weight: 5, color: 'black', fillColor: 'white', className: 'boat-body'}}>
    //
    //             </Polygon>)
    //     }
    // )
    //     ;
    return null;
}

export default observer(RectangularView)

/* eslint-disable react-hooks/exhaustive-deps */
import L from 'leaflet';
import "leaflet-ellipse";
import { observer } from 'mobx-react-lite';
import { useMap } from 'react-leaflet';
import { allLayer } from '../Variables/Variables';
import { useEffect, useState } from 'react';
import { useCountryStore, useGlobalStore } from '@/providers/RootStoreProvider';
import { addMarkerFn } from '../Markers/AddMarkers';
import { getGeoMainLand } from '@/utils/get_geo_mainland';
import * as turf from '@turf/turf';

import IMG_WORLD_FLAG from '@/assets/images/world-flag.png';
import { countryFlagList } from '@/utils/country_flag_list';

const TableView = ({selectedData, setModal, setModalType}) => {
    const map = useMap();
    const globalStore = useGlobalStore();
    const countryStore = useCountryStore();
    const [tableFG, setTableFG] = useState();
    const [bodyTableLatLngsState, setBodyTableLatLngState] = useState();

    const generateTable = (tableType, centerLatLng, table, tableName) => {
        const isWorldTable = tableType === 'world';
        const bodyTableWidthPX = isWorldTable ? 200 : 200;
        const bodyTableTopWidthPX = isWorldTable ? bodyTableWidthPX + 200 : bodyTableWidthPX + 100;
        const bodyTableHeightPX = isWorldTable ? 250 : 125;
        const poleTableHeightPX = isWorldTable ? 250 : 200;
        const flagTableWidthPX = isWorldTable ? 200 : 100;
        const flagTableHeightPX = isWorldTable ? 100 : 50;
        const radiiOfEllipse = isWorldTable ? [12000000, 6000000] : [6000000, 3000000];
        const boatNamePoint = isWorldTable ? L.point(80, 0) : L.point(50, 0)

        // Get the 4 sides's latlngs of the table's body
        const centerPoint = map.latLngToContainerPoint(centerLatLng); // Convert center latlng to point
        const topLeftPoint = centerPoint.subtract([bodyTableTopWidthPX / 2, bodyTableHeightPX / 2]); // Calculate the top left point
        const topRightPoint = centerPoint.subtract([(-bodyTableTopWidthPX) / 2, (bodyTableHeightPX) / 2])
        const bottomRightPoint = centerPoint.add([bodyTableWidthPX / 2, bodyTableHeightPX / 2]); // Calculate the bottom right point
        const bottomLeftPoint = centerPoint.add([-bodyTableWidthPX / 2, bodyTableHeightPX / 2]);
        const topLeftLatLng = map.containerPointToLatLng(topLeftPoint); // Convert top left point to lat lng
        const topRightLatLng = map.containerPointToLatLng(topRightPoint); // Convert top right point to lat lng
        const bottomRightLatLng = map.containerPointToLatLng(bottomRightPoint);  // Convert bottom right point to lat lng
        const bottomLeftLatLng = map.containerPointToLatLng(bottomLeftPoint); // Convert botom left point to lat lng

        // Get the latlngs of the table's pole
        const topBounds = L.latLngBounds(topLeftLatLng, topRightLatLng);
        const bottomPoleLatLng = topBounds.getCenter();
        const bottomPolePoint = map.latLngToContainerPoint(bottomPoleLatLng);
        const topPolePoint = bottomPolePoint.subtract([0, poleTableHeightPX]);
        const topPoleLatLng = map.containerPointToLatLng(topPolePoint);
        console.log('pole', bottomPoleLatLng, topPoleLatLng, bottomPolePoint, topPolePoint)
        // Get the latlngs of the table's flag
        const topLeftFlagPoint = topPolePoint;
        const topRightFlagPoint = topLeftFlagPoint.add([flagTableWidthPX, 0]);
        const bottomLeftFlagPoint = topLeftFlagPoint.add([0, flagTableHeightPX]);
        const bottomRightFlagPoint = topLeftFlagPoint.add([flagTableWidthPX, flagTableHeightPX]);
        const topLeftFlagLatLng = map.containerPointToLatLng(topLeftFlagPoint); // Convert top left point to lat lng
        const topRightFlagLatLng = map.containerPointToLatLng(topRightFlagPoint); // Convert top right point to lat lng
        const bottomRightFlagLatLng = map.containerPointToLatLng(bottomRightFlagPoint);  // Convert bottom right point to lat lng
        const bottomLeftFlagLatLng = map.containerPointToLatLng(bottomLeftFlagPoint);; // Convert botom left point to lat lng

        // Create a table's body from an array of LatLng points
        const bodyTablePolygon = L.ellipse(centerLatLng, radiiOfEllipse);
        bodyTablePolygon.addTo(table);
        bodyTablePolygon.setStyle(
            {weight: 5, color: 'black', fillColor: 'transparent', className: 'table-body'}
        )
        //Create 4 legs of table

        let ellipseBounds = bodyTablePolygon.getBounds();
        setBodyTableLatLngState(ellipseBounds);
        let northTopLatLng = L.latLng(ellipseBounds.getNorth(), ellipseBounds.getCenter().lng);
        let westTopLatLng = L.latLng(ellipseBounds.getCenter().lat, ellipseBounds.getWest());
        const westTopPoint = map.latLngToContainerPoint(westTopLatLng);
        const westBottomPoint = westTopPoint.subtract([0, -poleTableHeightPX]);
        const westBottomLatLng = map.containerPointToLatLng(westBottomPoint);
        let eastTopLatLng = L.latLng(ellipseBounds.getCenter().lat, ellipseBounds.getEast());
        const eastTopPoint = map.latLngToContainerPoint(eastTopLatLng);
        const eastBottomPoint = eastTopPoint.subtract([0, -poleTableHeightPX]);
        const eastBottomLatLng = map.containerPointToLatLng(eastBottomPoint);
        let southTopLatLng = L.latLng(ellipseBounds.getSouth(), ellipseBounds.getCenter().lng);
        const southTopPoint = map.latLngToContainerPoint(southTopLatLng);
        const southBottomPoint = southTopPoint.subtract([0, -poleTableHeightPX + 100]);
        const southBottomLatLng = map.containerPointToLatLng(southBottomPoint);
        const rightLegTableLatLng = [[westTopLatLng, westBottomLatLng],]
        const leftLegTableLatLng = [[eastTopLatLng, eastBottomLatLng],]
        const centerLegTableLatLng = [[southTopLatLng, southBottomLatLng],]
        const rightLegLine = L.polyline(rightLegTableLatLng, {weight: 7, color: 'black'})
        const leftLegLine = L.polyline(leftLegTableLatLng, {weight: 7, color: 'black'})
        const centerLegLine = L.polyline(centerLegTableLatLng, {weight: 7, color: 'black'})
        rightLegLine.addTo(table);
        leftLegLine.addTo(table);
        centerLegLine.addTo(table)

        // Create a table's flag

        const flagImgSrc = tableType === 'world' ? IMG_WORLD_FLAG.src : countryFlagList[tableType]
        const flagTableLatLngs = [[bottomLeftFlagLatLng, topLeftFlagLatLng, topRightFlagLatLng, bottomRightFlagLatLng]];
        const flagTableImg = L.imageOverlay(flagImgSrc, flagTableLatLngs);
        flagTableImg.addTo(table).bringToBack();

        let group = new L.FeatureGroup([bodyTablePolygon, rightLegLine, leftLegLine, centerLegLine, flagTableImg]);
        map.fitBounds(group.getBounds());

        const bodyTableLatLng = [[northTopLatLng, westTopLatLng, southTopLatLng, eastTopLatLng]]

        const polygonForOnClick = L.polygon(bodyTableLatLng, {weight: 5, color: 'black', fillColor: 'transparent', className: 'table-body'});

        // handle click on table
        polygonForOnClick.on('click', (e) => {
            if (globalStore.click) {
                if (globalStore.addIcon === 'function') {
                    handleAddFuncToTable(e.latlng, table, bodyTableLatLng);
                }
                else if (globalStore.addIcon !== '') {
                    globalStore.addIconHandle('');
                }
            }
        });
    }

    const handleAddFuncToTable = (latlng, table, bodyTableLatLngs) => {
        let count = 0
        table.eachLayer(layer => {
            if (layer.options.target?.type === 'function') {
                count += 1;
            }
        });

        const markerFn = addMarkerFn(table, latlng.lat, latlng.lng, count + 1, globalStore.lock, setModal, setModalType)
        globalStore.addIconHandle('');

        const turfPol = []; // Create a turf polygon coordinates array
        // Add coordinates of body table to turf polygon array (turf array need lng before lat)
        bodyTableLatLngs[0].forEach(latlng => turfPol.push([latlng.lng, latlng.lat]));
        // Turf polygon need the last latlng to be exactly like the first
        turfPol.push([bodyTableLatLngs[0][0].lng, bodyTableLatLngs[0][0].lat]);

        let oldLatLng = markerFn._latlng;

        markerFn.on('dragstart', (e) => {
            oldLatLng = e.target._latlng;
        })

        markerFn.on('dragend', (e) => {
            if (!turf.booleanPointInPolygon(turf.point([e.target._latlng.lng, e.target._latlng.lat]), turf.polygon([turfPol]))) {
                e.target.setLatLng(oldLatLng);
            }
        })
    }

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

    // Trigger Table View
    useEffect(() => {
        map.setZoom(2)
        let name = '';

        // Check room name option.
        // if (globalStore.boatName === 'boat') {
        //     name = "Boat";
        // }
        // else if (globalStore.boatName === 'b') {
        //     name = 'B';
        // }

        const table = L.featureGroup();
        // Array contains all tables
        const countriesLayer = [];

        if (globalStore.countryQuantity > 0 && countryStore.countries.length === globalStore.countryQuantity) {

            if (globalStore.tableView === 'table-world') {
                map.eachLayer(layer => {
                    if (layer._arrowheads) {
                        layer.remove();
                    }
                    allLayer.push(layer);
                });

                map.eachLayer(layer => map.removeLayer(layer));

                if (globalStore.map) {
                    // Define the width and height in pixels
                    const center = L.latLng(0, 0); // Center lat lng of table
                    generateTable('world', center, table, 'WORLD');
                    table.addTo(map);
                    table.options = {
                        type: 'table'
                    };

                    setTableFG(table)
                    // zoom the map to the polygon
                    map.fitBounds(table.getBounds());
                }
            }
            else if (globalStore.tableView === 'table-countries') {
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
                    const tableName = name ? `${name}` : countryCode
                    generateTable(countryCode, center, table, tableName);
                    table.addTo(map);
                    table.options = {
                        type: 'table'
                    }
                    setTableFG(table)
                    // zoom the map to the polygon
                    map.fitBounds(table.getBounds());
                }
            }
            else if (globalStore.tableView === '') {
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
                        }
                        else {
                            name = (layer.options.type === 'arc') ? 'Arc-route': 'Inter-route';
                        }

                        if (layer.options.type === 'line') {
                            point1 = layer.getLatLngs()[0].lng;
                            point2 = layer.getLatLngs()[1].lng;
                        }
                        else {
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
            map.removeLayer(table);
            countriesLayer.forEach((layer) => {
                map.removeLayer(layer);
            });
        };
    }, [globalStore.map, globalStore.tableView, selectedData]);

    useEffect(() => {
        if (!globalStore.click && tableFG && bodyTableLatLngsState) {
            const tableBody = document.querySelector('.table-body');
            tableBody.ondragover = (e) => e.preventDefault();

            tableBody.ondrop = (e) => {
                console.log("OK")
                const latlng = map.containerPointToLatLng(L.point(e.layerX, e.layerY));

                if (globalStore.addIcon === 'function') {
                    handleAddFuncToTable(latlng, tableFG, bodyTableLatLngsState)
                }
                else if (globalStore.addIcon !== '') {
                    globalStore.addIconHandle('');
                }
            }
        }
    }, [globalStore.click, globalStore.addIcon])

    return null;
}

export default observer(TableView)
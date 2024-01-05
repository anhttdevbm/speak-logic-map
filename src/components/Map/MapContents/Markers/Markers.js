/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw/dist/leaflet.draw';
import "leaflet-image-transform/dist/L.ImageOverlay.Transform.min";
import "@elfalem/leaflet-curve";
import "leaflet-textpath";
import "leaflet-arrowheads";
import {observer} from "mobx-react-lite";
import {useMap, useMapEvents} from "react-leaflet";
import {useGlobalStore, useSimulationSettingStore} from '@/providers/RootStoreProvider';
import "@bopen/leaflet-area-selection/dist/index.css";
import {DrawAreaSelection} from "@bopen/leaflet-area-selection";
import * as turf from '@turf/turf';

import styles from '../_MapContents.module.scss';

import {boatPopup, worldPopup, wrappingPopup} from '../Popups/Popups'

import {
    markerPersonIndex,
    selectedList,
    markerProblemIndex,
    markerHouseIndex, markerCountryFnIndex,
    markerFnIndex
} from '../Variables/Variables';

import {
    addMarkerPerson,
    addMarkerFn,
    addHouseMarker,
    addRoute,
    addDistance,
    addMarkerScrollFeature,
    addMarkerMapElement,
    addMarkerFnEllipse,
    addRelateMarker,
    addMarkerGivenSet,
    addMarkerWelcomeSign,
    addPersonInMobility, addInputTextPallet, addMarkerPrincipleLine, addInputImagePallet, checkMarkerExist
} from './AddMarkers'
import {countryModePopupHTML} from "@/components/Map/MapContents/Popups/PopupHTMLs";


// Toggle boundary of selected item
export const toggleBoundaryFn = (e) => {
    e.originalEvent.stopPropagation();
    e.originalEvent.preventDefault();

    if (!e.target.options.boundary) {
        e.target._icon.classList.add(styles["boundary"]);
        e.target.options.boundary = true;
    } else {
        e.target._icon.classList.remove(styles["boundary"]);
        e.target.options.boundary = false;
    }
}

let areaSelection;

// Add selected item to group by use CTRL + left click

const Markers = ({setModal, setModalType}) => {
    const globalStore = useGlobalStore();
    const simulationSettingStore = useSimulationSettingStore();
    const map = useMap()

    map.doubleClickZoom.disable();

    // Active Simulation - Flash color of function marker
    useEffect(() => {
        if (globalStore.simulation) {
            let listLayer = [];
            let listNameFunction = [];
            const root = document.documentElement;
            root?.style.setProperty("--time-animation", simulationSettingStore.transitionTime ? simulationSettingStore.transitionTime / 1000 + 's' : '10s')
            map.eachLayer(layer => {
                if (layer.options.target?.type === 'function') {
                    if (!listNameFunction.includes(layer.options?.icon?.options?.html)) {
                        listNameFunction.push(layer.options?.icon?.options?.html);
                        listLayer.push(layer);
                    }
                } else {
                    setTimeout(() => {
                        layer._icon?.classList.add(styles[`hidden`]);
                    }, simulationSettingStore.discardTime)
                }
            });
            if (listLayer.length > 0) {
                if (simulationSettingStore.effectedFunction === 'Random') {
                    shuffleArray(listLayer);
                    animate(listLayer)
                } else {
                    let smallFunction = listNameFunction.sort()[0];
                    let smallFunctionLayer = listLayer.filter(item => item.options.icon.options.html === smallFunction)[0];
                    getListLayerSortedDistance(listLayer, smallFunctionLayer);
                    animate(listLayer)
                }
            }
        } else {
            map.eachLayer(layer => {
                if (layer.options.target?.type === 'function') {
                    // for (let i = 0; i < 6; i++) {
                    layer._icon.classList.remove(styles[`simulation-animate0`]);
                    layer._icon.classList.remove(styles["boundary"]);
                    // }
                }
            });
        }
    }, [globalStore.simulation]);

    const animate = (listLayer) => {
        listLayer.forEach((layer, index) => {
            setTimeout(() => {
                if (simulationSettingStore.boundary === 'Yes') {
                    layer._icon.classList.add(styles["boundary"]);
                } else {
                    layer._icon.classList.remove(styles["boundary"]);
                }
                layer._icon.classList.add(styles[`simulation-animate0`]);
            }, simulationSettingStore.transitionTime * index)
        })
    }

    const shuffleArray = (arr) => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    useEffect(() => {
        globalStore.setMapLayer(map);
    }, [map])

    // Toggle Lock - Unlock Markers
    useEffect(() => {
        if (globalStore.lock) {
            map.eachLayer((layer) => {
                layer._icon && layer.dragging.disable();
            })
        } else {
            map.eachLayer((layer) => {
                layer._icon && layer.dragging.enable();
                layer._icon?.src && layer.dragging.disable();
                layer.options?.infor && layer.dragging.disable();
            })
        }
    }, [globalStore.lock])

    let drawnItemsLine = new L.FeatureGroup();
    const drawControlLine = new L.Control.Draw({
        draw: {
            polyline: {
                shapeOptions: {
                    color: '#f06eaa', // Line color
                },
            }, rectangle: false, // Enable drawing rectangles
            marker: false, circle: false, polygon: false, circlemarker: false
        }, edit: {
            featureGroup: drawnItemsLine, // Create a feature group to store drawn rectangles
            remove: true, edit: false
        },
    });

    let drawnItemsRect = new L.FeatureGroup();
    const drawControlRect = new L.Control.Draw({
        draw: {
            rectangle: true, // Enable drawing rectangles
            polyline: false, marker: false, circle: false, polygon: false, circlemarker: false
        }, edit: {
            featureGroup: drawnItemsRect, // Create a feature group to store drawn rectangles
            remove: true, edit: false
        },
    });

    let drawnItemsCircle = new L.FeatureGroup();
    const drawControlCircle = new L.Control.Draw({
        draw: {
            rectangle: false, // Enable drawing rectangles
            marker: false, polyline: false, circle: true, polygon: false, circlemarker: false
        }, edit: {
            featureGroup: drawnItemsCircle, // Create a feature group to store drawn rectangles
            remove: true, edit: false
        },
    });

    // Clear all map element
    useEffect(() => {
        if (globalStore.clear) {
            map.removeLayer(drawnItemsRect);
            map.removeControl(drawControlRect);
            map.removeLayer(drawnItemsCircle);
            map.removeControl(drawControlCircle);
            map.removeLayer(drawnItemsLine);
            map.removeControl(drawControlLine);

            globalStore.resetListMarkerFunction();
            globalStore.resetListMarkerPopulation();
            globalStore.resetMapLayer();

            map.eachLayer(layer => {
                if (layer.options?.icon || layer.options.target?.status === 'add' || layer.options.status === 'add' ||
                    layer.options.type === 'distance' || layer.options.group?.status === 'add' ||
                    layer.options.type?.status === 'add' || layer.options?.attribution === 'imageTransform') {
                    map.removeLayer(layer);
                    markerFnIndex[0] = 1;
                    markerPersonIndex[0] = 1;
                    markerProblemIndex[0] = 1;
                    markerHouseIndex[0] = 1;
                    markerCountryFnIndex[0] = 1;
                    globalStore.valueOfImage = '';
                }
            });
        }
    }, [globalStore.clear]);

    // Get all function by wrapping in area (to add into a group)
    useEffect(() => {
        // if (globalStore.map) {
        const getButton = document.getElementById("pointer-event");
        const textEvent = document.getElementById("text-event");
        const lineEvent = document.getElementById("line-event");
        const rectEvent = document.getElementById("rectangle-event");
        const ellipseEvent = document.getElementById("ellipse-event");
        const imageEvent = document.getElementById("image-event");
        let restrictPopup = 0;
        areaSelection = new DrawAreaSelection({
            onPolygonReady: (polygon) => {
                if (polygon && polygon._latlngs) {
                    const arr = polygon._latlngs[0].map((e) => Object.values(e));

                    map.eachLayer(layer => {
                        if (layer._latlng) {
                            if (turf.booleanPointInPolygon(turf.point(Object.values(layer._latlng)), turf.polygon([[...arr, arr[0]]]))) {
                                if (layer.options.index || layer.options.target || layer.options.options?.shape || layer.options.group?.type === 'mainset') {
                                    selectedList.push(layer);
                                    layer._icon.classList.add('selected-icon');
                                    if (layer.options.group?.type === 'mainset') {
                                        restrictPopup = 1;
                                    }
                                }
                            }
                        }
                    });
                    if (selectedList.length > 0) {
                        wrappingPopup(map, arr[2][0], arr[2][1], globalStore.lock, selectedList, restrictPopup);
                    }
                    areaSelection.deactivate();
                    globalStore.changeActiveAreaSelection(false);
                }
            },
        });

        const showScanSelection = () => {
            refreshLayerAndControlRect(map, drawnItemsRect, drawControlRect);
            refreshLayerAndControlCircle(map, drawnItemsCircle, drawControlCircle);
            refreshLayerAndControlLine(map, drawnItemsLine, drawControlLine)
            globalStore.togglePalletOption('pointer')
            if (!globalStore.inAreaSelection && globalStore.palletOption === 'pointer') {
                globalStore.changeActiveAreaSelection(true);
                restrictPopup = 0;
                map.addControl(areaSelection);
                areaSelection.activate();
            } else {
                areaSelection?.deactivate();
                globalStore.changeActiveAreaSelection(false);
            }
        }

        const insertTextToMap = () => {
            refreshLayerAndControlRect(map, drawnItemsRect, drawControlRect);
            refreshLayerAndControlCircle(map, drawnItemsCircle, drawControlCircle);
            refreshLayerAndControlLine(map, drawnItemsLine, drawControlLine)
            globalStore.togglePalletOption('text')
        }

        const insertImageToMap = () => {
            refreshLayerAndControlRect(map, drawnItemsRect, drawControlRect);
            refreshLayerAndControlCircle(map, drawnItemsCircle, drawControlCircle);
            refreshLayerAndControlLine(map, drawnItemsLine, drawControlLine)
            globalStore.togglePalletOption('image')
        }

        const drawLine = () => {
            refreshLayerAndControlCircle(map, drawnItemsCircle, drawControlCircle);
            refreshLayerAndControlRect(map, drawnItemsRect, drawControlRect);
            if (globalStore.palletOption === 'pointer') {
                areaSelection?.deactivate();
            }
            globalStore.togglePalletOption('line');

            if (globalStore.palletOption === 'line') {
                map.addLayer(drawnItemsLine);
                map.addControl(drawControlLine);

                map.on(L.Draw.Event.CREATED, (event) => {
                    const layer = event.layer;
                    drawnItemsLine.addLayer(layer);
                });
            } else {
                refreshLayerAndControlLine(map, drawnItemsLine, drawControlLine);
            }
        }

        const drawRectangle = () => {
            refreshLayerAndControlCircle(map, drawnItemsCircle, drawControlCircle);
            refreshLayerAndControlLine(map, drawnItemsLine, drawControlLine);
            if (globalStore.palletOption === 'pointer') {
                areaSelection?.deactivate();
            }
            globalStore.togglePalletOption('rectangle');

            if (globalStore.palletOption === 'rectangle') {
                map.addLayer(drawnItemsRect);
                map.addControl(drawControlRect);

                map.on(L.Draw.Event.CREATED, (event) => {
                    const layer = event.layer;
                    drawnItemsRect.addLayer(layer);
                });
            } else {
                refreshLayerAndControlRect(map, drawnItemsRect, drawControlRect);
            }
        }

        const drawCircle = () => {
            refreshLayerAndControlRect(map, drawnItemsRect, drawControlRect);
            refreshLayerAndControlLine(map, drawnItemsLine, drawControlLine);
            if (globalStore.palletOption === 'pointer') {
                areaSelection?.deactivate();
            }
            globalStore.togglePalletOption('circle');
            if (globalStore.palletOption === 'circle') {
                map.addLayer(drawnItemsCircle);
                map.addControl(drawControlCircle);

                map.on(L.Draw.Event.CREATED, (event) => {
                    const layer = event.layer;
                    drawnItemsCircle.addLayer(layer);
                });
            } else {
                refreshLayerAndControlCircle(map, drawnItemsCircle, drawControlCircle);
            }
        }

        getButton?.addEventListener("click", showScanSelection);
        textEvent?.addEventListener("click", insertTextToMap);
        lineEvent?.addEventListener("click", drawLine);
        rectEvent?.addEventListener("click", drawRectangle);
        ellipseEvent?.addEventListener("click", drawCircle);
        imageEvent?.addEventListener("click", insertImageToMap);

        return () => {
            getButton?.removeEventListener("click", showScanSelection);
            textEvent?.removeEventListener("click", insertTextToMap);
            lineEvent?.removeEventListener("click", drawLine);
            rectEvent?.removeEventListener("click", drawRectangle);
            ellipseEvent?.removeEventListener("click", drawCircle);
            imageEvent?.removeEventListener("click", insertImageToMap);
        };
        // }
    }, [globalStore.map]);

    const calculateDistance = (lat1, lng1, lat2, lng2) => {
        const earthRadius = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLng = (lng2 - lng1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadius * c;
    }

    const getListLayerSortedDistance = (listLayer, smallFunctionLayer) => {
        const referenceLat = smallFunctionLayer?._latlng.lat; // Latitude of "Function 1"
        const referenceLng = smallFunctionLayer?._latlng.lng;

        listLayer.sort((a, b) => {
            const distanceA = calculateDistance(referenceLat, referenceLng, a?._latlng.lat, a?._latlng.lng);
            const distanceB = calculateDistance(referenceLat, referenceLng, b?._latlng.lat, b?._latlng.lng);
            return distanceA - distanceB; // Sort in ascending order of distance
        });
    }

    const refreshLayerAndControlLine = (map, drawnItems, drawControl) => {
        // map.removeLayer(drawnItemsRect);
        map.removeControl(drawControl)
    }

    const refreshLayerAndControlRect = (map, drawnItems, drawControl) => {
        // map.removeLayer(drawnItemsRect);
        map.removeControl(drawControl)
    }

    const refreshLayerAndControlCircle = (map, drawnItems, drawControl) => {
        // map.removeLayer(drawnItemsRect);
        map.removeControl(drawControl)
    }

    // Remove all temp item when clicking on map
    useEffect(() => {
        const onClick = (event) => {
            if (window.handleRemoveTempList && (!event.ctrlKey || !event.metaKey) && event.target.classList && !event.target.classList.contains(styles['rectangle-fn'])) {
                window.handleRemoveTempList();
            }
        };

        document.addEventListener('click', onClick);

        return () => {
            document.removeEventListener('click', onClick);
        }
    }, [])

    // Add markers to map by drag event
    useEffect(() => {
        if (!globalStore.click) {
            const mapContainer = document.querySelector('.leaflet-container');
            mapContainer.ondragover = (e) => e.preventDefault();

            mapContainer.ondrop = (e) => {
                const latlng = map.containerPointToLatLng(L.point(e.layerX, e.layerY));

                if (globalStore.addIcon === 'person') {
                    // addMarkerPerson(map, latlng.lat, latlng.lng, markerPersonIndex[0], globalStore.lock, setModal, setModalType,
                    //     globalStore.setPersonToListMapElementSelected, globalStore.resetNumberPersonMobility,
                    //     globalStore.updateMapLayerById)
                    let index = markerPersonIndex[0];
                    globalStore.setMapLayer(latlng.lat, latlng.lng, 'Person ' + index, 'person')
                    globalStore.addMarkerPopulationToList(index)
                    markerPersonIndex[0]++;
                    globalStore.addIconHandle('');
                } else if (globalStore.addIcon === 'function') {
                    // addMarkerFn(map, latlng.lat, latlng.lng, markerFnIndex[0], globalStore.lock, setModal, setModalType)
                    let index = markerFnIndex[0];
                    globalStore.addMarkerFnToList(index)
                    globalStore.setMapLayer(latlng.lat, latlng.lng, 'Function ' + index, 'function');
                    markerFnIndex[0]++;
                    globalStore.addIconHandle('');
                } else if (globalStore.addIcon === 'house') {
                    addHouseMarker(map, latlng.lat, latlng.lng, globalStore.lock)
                    globalStore.addIconHandle('');
                } else if (globalStore.addIcon === 'welcome-sign') {
                    addMarkerWelcomeSign(map, latlng.lat, latlng.lng, globalStore.lock);
                    globalStore.addIconHandle('');
                } else if (globalStore.addIcon === 'inter-route') {
                    addRoute(map, latlng.lat, latlng.lng, globalStore.lock);
                    globalStore.addIconHandle('');
                } else if (globalStore.addIcon === 'distance') {
                    addDistance(map, latlng.lat, latlng.lng, globalStore.lock);
                    globalStore.addIconHandle('');
                } else if (globalStore.addIcon === 'scroll-feature') {
                    globalStore.setPositionOfScroll(latlng.lat, latlng.lng);
                    globalStore.resetDataScroll();
                    globalStore.addIconHandle('');
                } else if (globalStore.addIcon === 'horizontal-line') {
                    // addMarkerPrincipleLine(map, latlng.lat, latlng.lng, globalStore.lock);
                    // globalStore.addIconHandle('');
                    if (globalStore.positionOfHorizontalLine.length === 0) {
                        globalStore.setPositionOfHorizontalLine(latlng.lat, latlng.lng);
                    }
                    globalStore.addIconHandle('');
                } else if (globalStore.addIcon === 'relate') {
                    addRelateMarker(map, latlng.lat, latlng.lng, globalStore.lock);
                    globalStore.addIconHandle('');
                } else if (globalStore.addIcon === 'main-set') {
                    globalStore.setChooseGivenSet(true);
                    addMarkerGivenSet(map, latlng.lat, latlng.lng, globalStore.lock, 'Main Set', globalStore.setChooseGivenSet,
                        globalStore.setPositionOfHorizontalLine, globalStore.resetPositionOfHorizontalLine)
                } else if (globalStore.addIcon === 'mobility') {
                    // if (globalStore.numberPersonMobility < 2 || globalStore.numberPersonMobility % 2 === 0) {
                        globalStore.setTypeMobility('path');
                        addPersonInMobility(map, latlng.lat, latlng.lng, globalStore.lock, globalStore.numberPersonMobility, globalStore.setNumberPersonMobility, globalStore.setPositionOfPreviewPerson, globalStore.positionOfPreviewPerson, globalStore.typeMobility);
                        globalStore.addIconHandle('');
                    // } else {
                    //     globalStore.addIconHandle('');
                    //     globalStore.resetNumberPersonMobility();
                    // }
                }
            }
            if (globalStore.mapView !== '' && globalStore.addIcon === '') {
                globalStore.mapLayer.forEach(fn => {
                    if (fn.type === 'function' && fn.name !== "" && !checkMarkerExist(map, fn.name.replace("Function ", ""), 'function')) {
                        addMarkerFn(map, fn.lat, fn.lng, fn.name.replace("Function ", ""), globalStore.lock, setModal, setModalType, null, null, null, globalStore.setShapeOfMarkerFn, globalStore.addMarkerProblemToList, globalStore.setShapeOfMarkerPl);
                    } else if (fn.type === 'person' && fn.name !== "" && !fn.mobility) {
                        let index = fn.name.replace("Person ", "");
                        if (!checkMarkerExist(map, index, 'person')) {
                            addMarkerPerson(map, fn.lat, fn.lng, index, globalStore.lock, setModal,
                                setModalType, globalStore.setPersonToListMapElementSelected, globalStore.resetNumberPersonMobility,
                                globalStore.updateMapLayerById);
                        }
                    }
                })
            }
        } else {
            if (globalStore.addIcon === 'horizontal-line') {
                if (globalStore.positionOfHorizontalLine.length > 0) {
                    globalStore.toggleModalInsertNumberPerson();
                }
            } else if (globalStore.addIcon === 'main-set') {
                if (globalStore.positionOfHorizontalLine.length > 0) {
                    globalStore.setChooseGivenSet(true)
                }
            } else {
                globalStore.mapLayer.forEach(fn => {
                    if (fn.type === 'function' && fn.name !== "" && !checkMarkerExist(map, fn.name.replace("Function ", ""), 'function')) {
                        if (globalStore.tableView !== '') {
                            addMarkerFnEllipse(map, fn.lat, fn.lng, fn.name.replace("Function ", ""), globalStore.lock, setModal, setModalType, null, null, null, globalStore.setShapeOfMarkerFn, globalStore.addMarkerProblemToList, globalStore.setShapeOfMarkerPl);
                        } else {
                            addMarkerFn(map, fn.lat, fn.lng, fn.name.replace("Function ", ""), globalStore.lock, setModal, setModalType, null, null, null, globalStore.setShapeOfMarkerFn, globalStore.addMarkerProblemToList, globalStore.setShapeOfMarkerPl);
                        }
                    } else if (fn.type === 'person' && fn.name !== "" && !fn.mobility) {
                        let index = fn.name.replace("Person ", "");
                        if (!checkMarkerExist(map, index, 'person')) {
                            addMarkerPerson(map, fn.lat, fn.lng, index, globalStore.lock, setModal,
                                setModalType, globalStore.setPersonToListMapElementSelected, globalStore.resetNumberPersonMobility,
                                globalStore.updateMapLayerById);
                        }
                    }
                })
            }
        }
    }, [globalStore.click, globalStore.addIcon, globalStore.mapView, globalStore.tableView, globalStore.rectangularView,
        globalStore.positionOfHorizontalLine, globalStore.mapLayer]);

    useEffect(() => {
        if (globalStore.positionOfImagePallet.length > 0 && globalStore.valueOfImage && globalStore.valueOfImage !== '') {
            let value = globalStore.valueOfImage;

            let imageBounds = [globalStore.positionOfImagePallet, [globalStore.positionOfImagePallet[0] - 20, globalStore.positionOfImagePallet[1] + 50]];
            let bounds = L.latLngBounds(imageBounds);

            let latLngs = [
                bounds.getSouthWest(),
                bounds.getNorthWest(),
                bounds.getNorthEast(),
                bounds.getSouthEast()
            ];
            let imageTransform = L.imageOverlay.transform(value, latLngs, {
                draggable: true,
                scalable: true,
                rotatable: false,
                keepRatio: false,
                fit: true,
                attribution: 'imageTransform'
            });
            imageTransform.addTo(map);
        }
    }, [globalStore.valueOfImage])

    useMapEvents({

        // Open right-click menu on map
        contextmenu(e) {
            if (globalStore.map && !globalStore.boatView && !globalStore.roomView && !globalStore.floorPlanView) {
                worldPopup(map, e, globalStore.map, globalStore.toggleHouseView, globalStore.setMapElementRelate, globalStore.setListMapElementSelected);
            } else if (globalStore.boatView) {
                boatPopup(map, e, globalStore.map, globalStore.toggleBoatView, globalStore.setMapElementRelate, globalStore.setListMapElementSelected);
            }
        },

        // Add markers to map by click event
        click(e) {
            console.log(`${e.latlng.lat} ${e.latlng.lng}`);

            if (globalStore.click) {
                // Add Person Marker
                if (globalStore.addIcon === 'person') {
                    // addMarkerPerson(map, e.latlng.lat, e.latlng.lng, markerPersonIndex[0], globalStore.lock, setModal,
                    //     setModalType, globalStore.setPersonToListMapElementSelected, globalStore.resetNumberPersonMobility,
                    //     globalStore.updateMapLayerById);
                    let index = markerPersonIndex[0];
                    globalStore.setMapLayer(e.latlng.lat, e.latlng.lng, 'Person ' + index, 'person')
                    globalStore.addMarkerPopulationToList(index)
                    markerPersonIndex[0]++;
                    globalStore.addIconHandle('');
                } else if (globalStore.addIcon === 'function') {
                    // if (globalStore.tableView !== '') {
                    //     globalStore.addMarkerFnToList(markerFnIndex[0])
                    //     // addMarkerFnEllipse(map, e.latlng.lat, e.latlng.lng, markerFnIndex[0], globalStore.lock, setModal, setModalType, null, null, null, globalStore.setShapeOfMarkerFn, globalStore.addMarkerProblemToList, globalStore.setShapeOfMarkerPl);
                    // } else {
                    //     // addMarkerFn(map, e.latlng.lat, e.latlng.lng, markerFnIndex[0], globalStore.lock, setModal, setModalType, null, null, null, globalStore.setShapeOfMarkerFn, globalStore.addMarkerProblemToList, globalStore.setShapeOfMarkerPl);
                    // }
                    globalStore.addMarkerFnToList(markerFnIndex[0])
                    globalStore.setMapLayer(e.latlng.lat, e.latlng.lng, 'Function ' + markerFnIndex[0], 'function');
                    // let index = markerFnIndex[0];
                    // globalStore.addMarkerFnToList(index)
                    markerFnIndex[0]++;
                    globalStore.addIconHandle('');
                } else if (globalStore.addIcon === 'house') {
                    addHouseMarker(map, e.latlng.lat, e.latlng.lng, globalStore.lock)
                    globalStore.addIconHandle('');
                } else if (globalStore.addIcon === 'welcome-sign') {
                    addMarkerWelcomeSign(map, e.latlng.lat, e.latlng.lng, globalStore.lock);
                    globalStore.addIconHandle('');
                } else if (globalStore.addIcon === 'inter-route') {
                    addRoute(map, e.latlng.lat, e.latlng.lng, globalStore.lock);
                    globalStore.addIconHandle('');
                } else if (globalStore.addIcon === 'distance') {
                    addDistance(map, e.latlng.lat, e.latlng.lng, globalStore.lock);
                    globalStore.addIconHandle('');
                } else if (globalStore.addIcon === 'relate') {
                    globalStore.resetPositionScroll();
                    addRelateMarker(map, e.latlng.lat, e.latlng.lng, globalStore.lock);
                    globalStore.addIconHandle('');
                } else if (globalStore.addIcon === 'mobility') {
                    globalStore.resetPositionScroll();
                    if (globalStore.numberPersonMobility < 2) {
                        globalStore.setTypeMobility('path');
                        addPersonInMobility(map, e.latlng.lat, e.latlng.lng, globalStore.lock, globalStore.numberPersonMobility, globalStore.setNumberPersonMobility, globalStore.setPositionOfPreviewPerson, globalStore.positionOfPreviewPerson, globalStore.typeMobility);
                    } else {
                        globalStore.addIconHandle('');
                        globalStore.resetNumberPersonMobility();
                    }
                } else if (globalStore.addIcon === 'scroll-feature') {
                    globalStore.setPositionOfScroll(e.latlng.lat, e.latlng.lng);
                    globalStore.resetDataScroll();
                    globalStore.addIconHandle('');
                } else if (globalStore.palletOption === 'text') {
                    addInputTextPallet(map, e.latlng.lat, e.latlng.lng, globalStore.lock, globalStore.togglePalletOption)
                } else if (globalStore.palletOption === 'image') {
                    globalStore.setPositionOfImagePallet(e.latlng.lat, e.latlng.lng);
                    addInputImagePallet(map, e.latlng.lat, e.latlng.lng, globalStore.lock, globalStore.togglePalletOption,
                        globalStore.setValueOfImage)
                } else if (globalStore.addIcon === 'horizontal-line') {
                    if (globalStore.positionOfHorizontalLine.length === 0) {
                        // globalStore.toggleModalInsertNumberPerson();
                        globalStore.setPositionOfHorizontalLine(e.latlng.lat, e.latlng.lng);
                    }
                } else if (globalStore.addIcon === 'main-set') {
                    globalStore.setChooseGivenSet(true);
                    addMarkerGivenSet(map, e.latlng.lat, e.latlng.lng, globalStore.lock, 'Main Set', globalStore.setChooseGivenSet,
                        globalStore.setPositionOfHorizontalLine, globalStore.resetPositionOfHorizontalLine)
                } else if (globalStore.listMapElementSelected.length > 0
                    && globalStore.listMapElementSelected.filter(item => !item.status).length === 1) {
                    console.log('globalStore.listMapElementSelected', globalStore.listMapElementSelected);
                    for (let i = 0; i < globalStore.listMapElementSelected.length; i++) {
                        const mapElement = globalStore.listMapElementSelected[i];
                        if (!mapElement.status) {
                            globalStore.changePositionOfMapElementSelected(e.latlng.lat, e.latlng.lng, mapElement.id);
                            addMarkerMapElement(map, e.latlng.lat, e.latlng.lng, globalStore.lock, mapElement,
                                globalStore.setMapElementRelate, globalStore.setPositionOfMapElementSelected);
                            globalStore.changeStatusOfMapElementSelected(true, mapElement.id);
                        }
                    }
                }
            }
        }
    })

    return null;
}

export default observer(Markers)

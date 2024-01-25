import React, {useEffect} from "react";
import L from 'leaflet';
import {useMap} from "react-leaflet";
import "leaflet-path-drag";
import {observer} from "mobx-react-lite";
import {useGlobalStore} from "@/providers/RootStoreProvider";
import {markerNavigationSignIcon} from "@/components/Map/MapContents/Markers/MarkerIcons";
import {addHouseMarker} from "@/components/Map/MapContents/Markers/AddMarkers";

const PalletGeoJsonContainer = () => {
    const map = useMap();
    const globalStore = useGlobalStore();

    useEffect(() => {
        for (let i = 0; i < globalStore.listRectPolygonPallet.length; i++) {
            globalStore.setStatusRectPolygonPallet(globalStore.listRectPolygonPallet[i].id, false)
        }
        for (let i = 0; i < globalStore.listCirclePolygonPallet.length; i++) {
            globalStore.setStatusCirclePolygonPallet(globalStore.listCirclePolygonPallet[i].id, false)
        }
        for (let i = 0; i < globalStore.listLinePallet.length; i++) {
            globalStore.setStatusLinePallet(globalStore.listLinePallet[i].id, false)
        }
    }, [globalStore.map]);

    const handleFeature = (layer, id) => {
        if (layer._bounds) {
            layer.makeDraggable();
            if (!layer.dragging.enabled()) {
                layer.dragging.enable();
                layer.on("dragend", function (e) {
                    requestAnimationFrame(() => {
                        let bound = globalStore.getRectPolygonPalletById(id).bound;
                        let point1 = globalStore.getRectPolygonPalletById(id).latlngs[0][0];
                        let point2 = e.target._latlngs[0][0];
                        for (let i = 0; i < globalStore.mapLayer.length; i++) {
                            let id = globalStore.mapLayer[i].id;
                            let type = globalStore.mapLayer[i].type;
                            let name = globalStore.mapLayer[i].name;
                            let lat = globalStore.mapLayer[i].lat;
                            let lng = globalStore.mapLayer[i].lng;
                            let point3 = L.latLng(lat, lng);
                            if (checkBoundContainMarker(bound, lat, lng)) {
                                let point4 = findLastPoint(point1, point2, point3);
                                globalStore.updateLatLngMapLayerById(point4.lat, point4.lng, id);
                                map.eachLayer(layer => {
                                    if (layer.options?.type?.type === 'the-given-set' && layer.options?.type?.type === type && layer.options?.type?.index.toString() === name.toString()) {
                                        layer.setLatLng(point4)
                                    } else {
                                        let nameMarker = layer.options?.target?.type + ' ' + layer.options?.target?.index
                                        if (name.toLowerCase() === nameMarker.toLowerCase() && layer.options?.target?.type === type) {
                                            layer.setLatLng(point4)
                                        }
                                    }
                                })
                            }
                        }
                        globalStore.updateBoundRectPolygonPallet(id, e.target._bounds, e.target._latlngs, e.target.toGeoJSON())
                    });
                });
            }
        }
    };

    const checkBoundContainMarker = (bound, lat, lng) => {
        let pointToCheck = L.latLng(lat, lng);
        return bound.contains(pointToCheck);
    }

    const findLastPoint = (point1, point2, point3) => {
        let pointA = map.latLngToContainerPoint(point1);
        let pointB = map.latLngToContainerPoint(point2);
        let pointC = map.latLngToContainerPoint(point3);
        let vectorAB = {x: pointB.x - pointA.x, y: pointB.y - pointA.y};
        let pointD = {x: pointC.x + vectorAB.x, y: pointC.y + vectorAB.y};
        return map.containerPointToLatLng(pointD);
    }

    function computeDistanceBetweenTwoPoint(lat1, lng1, lat2, lng2) {
        const R = 6371000; // Radius of the earth in m
        const dLat = toRadians(lat2 - lat1); // deg2rad below
        const dLon = toRadians(lng2 - lng1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    const toRadians = (degrees) => {
        return (degrees * Math.PI) / 180;
    };

    useEffect(() => {
        if (globalStore.listRectPolygonPallet.length > 0) {
            for (let i = 0; i < globalStore.listRectPolygonPallet.length; i++) {
                let id = globalStore.listRectPolygonPallet[i].id;
                let status = globalStore.listRectPolygonPallet[i].status;
                let type = globalStore.listRectPolygonPallet[i].type;
                if (!status && type === 'rect-polygon') {
                    let geoJson = [globalStore.listRectPolygonPallet[i].geoJson];
                    L.geoJSON(geoJson, {
                        status: 'add',
                        type: 'rect-polygon',
                        onEachFeature(feature, layer) {
                            if (type === 'rect-polygon') {
                                handleFeature(layer, id);
                            }
                        }
                    }).addTo(map);
                    globalStore.setStatusRectPolygonPallet(id, true)
                }
            }
        }

    }, [globalStore.listRectPolygonPallet.length])

    useEffect(() => {
        if (globalStore.listCirclePolygonPallet.length > 0) {
            for (let i = 0; i < globalStore.listCirclePolygonPallet.length; i++) {
                let circlePolygonPallet = globalStore.listCirclePolygonPallet[i]
                let id = circlePolygonPallet.id;
                let status = circlePolygonPallet.status;
                let radius = circlePolygonPallet.radius;
                let type = circlePolygonPallet.type;
                let lat = circlePolygonPallet.bound?.lat;
                let lng = circlePolygonPallet.bound?.lng;
                if (!status && lat && lat && type === 'circle-polygon') {
                    let circle = L.circle([lat, lng], {
                        radius: radius,
                        draggable: true,
                        status: 'add',
                        type: 'circle-polygon',
                    }).addTo(map);

                    circle.on('dragend', function (event) {
                        circle.setRadius(radius);
                        let newCenter = event.target.getLatLng();
                        console.log('event', event)
                        let currentCenter = globalStore.getCirclePolygonPalletById(id).bound;
                        for (let i = 0; i < globalStore.mapLayer.length; i++) {
                            let id = globalStore.mapLayer[i].id;
                            let type = globalStore.mapLayer[i].type;
                            let name = globalStore.mapLayer[i].name;
                            let lat = globalStore.mapLayer[i].lat;
                            let lng = globalStore.mapLayer[i].lng;
                            let point3 = L.latLng(lat, lng);
                            const distance = computeDistanceBetweenTwoPoint(lat, lng, currentCenter.lat, currentCenter.lng)
                            console.log(distance, radius)
                            if (distance < radius) {
                                let point4 = findLastPoint(currentCenter, newCenter, point3);
                                map.eachLayer(layer => {
                                    if (layer.options?.type?.type === 'the-given-set' && layer.options?.type?.type === type && layer.options?.type?.index.toString() === name.toString()) {
                                        layer.setLatLng(point4)
                                    } else {
                                        let nameMarker = layer.options?.target?.type + ' ' + layer.options?.target?.index
                                        if (name.toLowerCase() === nameMarker.toLowerCase() && layer.options?.target?.type === type) {
                                            layer.setLatLng(point4)
                                        }
                                    }
                                })
                                globalStore.updateLatLngMapLayerById(point4.lat, point4.lng, id);
                            }
                        }
                        globalStore.updateBoundCirclePolygonPallet(id, newCenter);
                    });
                    globalStore.setStatusCirclePolygonPallet(id, true)
                }
            }
        }

    }, [globalStore.listCirclePolygonPallet.length]);

    useEffect(() => {
        if (globalStore.listLinePallet.length > 0) {
            for (let i = 0; i < globalStore.listLinePallet.length; i++) {
                let linePallet = globalStore.listLinePallet[i]
                let id = linePallet.id;
                let status = linePallet.status;
                let type = linePallet.type;
                if (!status && type === 'line-pallet' && linePallet.latlng) {
                    let latlngs = linePallet.latlng.map(function (obj) {
                        return [obj.lat, obj.lng];
                    });
                    L.polyline(latlngs, {
                        draggable: true,
                        color: 'rgb(51, 136, 255)',
                        status: 'add',
                        type: 'line-pallet',
                    }).addTo(map);
                    globalStore.setStatusLinePallet(id, true)
                }
            }
        }

    }, [globalStore.listLinePallet.length]);

};

export default observer(PalletGeoJsonContainer)

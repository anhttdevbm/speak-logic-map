import React, {useEffect} from "react";
import L from 'leaflet';
import {useMap} from "react-leaflet";
import "leaflet-path-drag";
import {observer} from "mobx-react-lite";
import {useGlobalStore} from "@/providers/RootStoreProvider";
import {annotationPalletPopup} from "@/components/Map/MapContents/Popups/Popups";
import {computeDistanceBetweenTwoPoint, findLastPoint, toRadians} from "@/components/Map/MapContents/CommonUtil";

const PalletGeoJsonContainer = () => {
    const map = useMap();
    const globalStore = useGlobalStore();

    useEffect(() => {
        map.eachLayer(layer => {
            if (layer.options?.type === 'rect-polygon' || layer.options?.type === 'circle-polygon') {
                map.removeLayer(layer);
            }
        })
        for (let i = 0; i < globalStore.listRectPolygonPallet.length; i++) {
            globalStore.setStatusRectPolygonPallet(globalStore.listRectPolygonPallet[i].id, false)
        }
        for (let i = 0; i < globalStore.listCirclePolygonPallet.length; i++) {
            globalStore.setStatusCirclePolygonPallet(globalStore.listCirclePolygonPallet[i].id, false)
        }
        for (let i = 0; i < globalStore.listLinePallet.length; i++) {
            globalStore.setStatusLinePallet(globalStore.listLinePallet[i].id, false)
        }
    }, [globalStore.map, globalStore.showDialogEditShapeStyle]);

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
                                let point4 = findLastPoint(map, point1, point2, point3);
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

    useEffect(() => {
        if (globalStore.listRectPolygonPallet.length > 0) {
            for (let i = 0; i < globalStore.listRectPolygonPallet.length; i++) {
                let id = globalStore.listRectPolygonPallet[i].id;
                let status = globalStore.listRectPolygonPallet[i].status;
                let type = globalStore.listRectPolygonPallet[i].type;
                let fillColor = globalStore.listRectPolygonPallet[i].fillColor;
                let color = globalStore.listRectPolygonPallet[i].color;
                let weight = globalStore.listRectPolygonPallet[i].weight;
                if (!status && type === 'rect-polygon') {
                    let geoJson = [globalStore.listRectPolygonPallet[i].geoJson];
                    L.geoJSON(geoJson, {
                        status: 'add',
                        type: 'rect-polygon',
                        index: id,
                        style: {
                            fillColor: fillColor,
                            color: color,
                            weight: weight
                        },
                        onEachFeature(feature, layer) {
                            if (type === 'rect-polygon') {
                                handleFeature(layer, id);
                            }
                            layer.on('contextmenu', e => annotationPalletPopup(map, e, globalStore.removeRectPolygonPalletById,
                                globalStore.toggleShowDialogEditShapeStyle, globalStore.setItemAnnotationStyling))
                        }
                    })
                        .addTo(map);
                    globalStore.setStatusRectPolygonPallet(id, true)
                }
            }
        }

    }, [globalStore.listRectPolygonPallet.length, globalStore.showDialogEditShapeStyle])

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
                let fillColor = globalStore.listCirclePolygonPallet[i].fillColor;
                let color = globalStore.listCirclePolygonPallet[i].color;
                let weight = globalStore.listCirclePolygonPallet[i].weight;
                console.log(radius, toRadians(radius), lat, lng)
                if (!status && lat && lat && type === 'circle-polygon') {
                    let circle = L.circle([lat, lng], {
                        radius: radius,
                        draggable: true,
                        status: 'add',
                        type: 'circle-polygon',
                        index: id,
                    })
                        .setStyle({
                            fillColor: fillColor,
                            color: color,
                            weight: weight
                        })
                        .on('contextmenu', e => annotationPalletPopup(map, e, globalStore.removeCirclePolygonPalletById,
                            globalStore.toggleShowDialogEditShapeStyle, globalStore.setItemAnnotationStyling))
                        .addTo(map);

                    map.eachLayer(layer => {
                        if (layer.defaultOptions?.rotationOrigin) {
                            map.removeLayer(layer);
                        }
                    })

                    circle.on('dragend', function (event) {
                        // circle.setRadius(radius);
                        let newCenter = event.target.getLatLng();
                        console.log('Math.abs(lat)', Math.abs(lat))
                        let x = Math.abs(lat) < 50 ? 1 : 3
                        circle.setRadius((radius * x) * Math.cos(toRadians(Math.abs(newCenter.lat))));
                        console.log('event', newCenter.lat, (radius * x) * Math.cos(toRadians(Math.abs(newCenter.lat))))
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
                                let point4 = findLastPoint(map, currentCenter, newCenter, point3);
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

    }, [globalStore.listCirclePolygonPallet.length, globalStore.showDialogEditShapeStyle]);

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
                        color: 'black',
                        status: 'add',
                        type: 'line-pallet',
                        index: id
                    })
                        .on('contextmenu', e => annotationPalletPopup(map, e, globalStore.removeLinePalletById))
                        .addTo(map);
                    globalStore.setStatusLinePallet(id, true)
                }
            }
        }

    }, [globalStore.listLinePallet.length, globalStore.showDialogEditShapeStyle]);

};

export default observer(PalletGeoJsonContainer)

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

    let geojsonMarkerData = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [-104.05, 48.99],
                        [-97.22, 48.98],
                        [-96.58, 45.94],
                        [-104.03, 45.94],
                        [-104.05, 48.99]
                    ]]
                },
                "properties": {
                    "name": "Marker 1"
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [-109.05, 41.00],
                        [-102.06, 40.99],
                        [-102.03, 36.99],
                        [-109.04, 36.99],
                        [-109.05, 41.00]
                    ]]
                },
                "properties": {
                    "name": "Marker 2"
                }
            }
        ]
    };


    let geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    const setIcon = ({properties}, latlng) => {
        return L.marker(latlng, {icon: markerNavigationSignIcon()});
    };

    function onEachFeature(feature, layer) {
        // does this feature have a property named popupContent?
        if (feature.properties && feature.properties.popupContent) {
            layer.bindPopup(feature.properties.popupContent);
        }
    }

    const handleFeature = (layer, id) => {
        let bound = layer._bounds;
        if (bound) {
            layer.makeDraggable();
            if (!layer.dragging.enabled()) {
                layer.dragging.enable();
                let point1 = layer._latlngs[0][0];
                // L.marker(point1).addTo(map);
                layer.on("dragend", function (e) {
                    requestAnimationFrame(() => {
                        console.log('e', e)
                        let point2 = e.target._latlngs[0][0];
                        // L.marker(point2).addTo(map);
                        let distance = computeDistanceBetweenTwoPoint(point1.lat, point1.lng, point2.lat, point2.lng);
                        let bearing = calculateBearing(point1.lat, point1.lng, point2.lat, point2.lng);
                        for (let i = 0; i < globalStore.mapLayer.length; i++) {
                            let lat = globalStore.mapLayer[i].lat;
                            let lng = globalStore.mapLayer[i].lng;
                            if (checkBoundContainMarker(bound, lat, lng)) {
                                let newPoint = calculateDestinationPoint(lat, lng, bearing, distance * 1000)
                                if (newPoint.lat && newPoint.lng) {
                                    addHouseMarker(map, newPoint.lat, newPoint.lng, globalStore.lock);
                                    globalStore.changePositionOfMapElementSelected(newPoint.lat, newPoint.lng, globalStore.mapLayer[i].id);
                                    console.log('test', distance, computeDistanceBetweenTwoPoint(lat, lng, newPoint.lat, newPoint.lng), bearing, calculateBearing(lat, lng, newPoint.lat, newPoint.lng))
                                }
                            }
                        }
                        globalStore.updateBoundRectPolygonPallet(id, e.target._latlngs, e.target.toGeoJSON())
                    });
                });
            }
        }
    };

    const checkBoundContainMarker = (bound, lat, lng) => {
        let pointToCheck = L.latLng(lat, lng);
        return bound.contains(pointToCheck);
    }

    function computeDistanceBetweenTwoPoint(lat1, lng1, lat2, lng2) {
        const R = 6371; // Radius of the earth in km
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

    function calculateBearing(lat1, lon1, lat2, lon2) {
        let lat1Rad = (lat1 * Math.PI) / 180;
        let lon1Rad = (lon1 * Math.PI) / 180;
        let lat2Rad = (lat2 * Math.PI) / 180;
        let lon2Rad = (lon2 * Math.PI) / 180;

        let y = Math.sin(lon2Rad - lon1Rad) * Math.cos(lat2Rad);
        let x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lon2Rad - lon1Rad);

        let bearingRad = Math.atan2(y, x);
        let bearingDeg = (bearingRad * 180) / Math.PI;
        return (bearingDeg + 360) % 360;
    }

    function calculateDestinationPoint(lat, lng, bearing, distance) {
        let R = 6371000; // Radius of the Earth in meters

        let lat1 = lat * Math.PI / 180;
        let lon1 = lng * Math.PI / 180;
        let angularDistance = distance / R;
        let bearingRad = bearing * Math.PI / 180;

        let lat2 = Math.asin(Math.sin(lat1) * Math.cos(angularDistance) +
            Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearingRad));

        let lon2 = lon1 + Math.atan2(Math.sin(bearingRad) * Math.sin(angularDistance) * Math.cos(lat1),
            Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2));

        return {lat: lat2 * 180 / Math.PI, lng: lon2 * 180 / Math.PI};
    }

    const toRadians = (degrees) => {
        return (degrees * Math.PI) / 180;
    };

    const toDegree = (radians) => {
        return (radians * 180) / Math.PI;
    };

    useEffect(() => {
        // debugger
        if (globalStore.map) {
            if (globalStore.listRectPolygonPallet.length > 0) {
                for (let i = 0; i < globalStore.listRectPolygonPallet.length; i++) {
                    let id = globalStore.listRectPolygonPallet[i].id;
                    let status = globalStore.listRectPolygonPallet[i].status;
                    let type = globalStore.listRectPolygonPallet[i].type;
                    if (!status && type === 'rect-polygon') {
                        let geoJson = [globalStore.listRectPolygonPallet[i].geoJson];
                        console.log('geoJson', globalStore.listRectPolygonPallet[i])
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
        } else {
            for (let i = 0; i < globalStore.listRectPolygonPallet.length; i++) {
                globalStore.setStatusRectPolygonPallet(globalStore.listRectPolygonPallet[i].id, false)
            }
        }

    }, [globalStore.listRectPolygonPallet.length, globalStore.map])

    useEffect(() => {
        if (globalStore.map) {
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
                            let newLatLng = event.target.getLatLng();
                            // L.marker([newLatLng.lat, newLatLng.lng]).addTo(map);
                            let distance = computeDistanceBetweenTwoPoint(lat, lng, newLatLng.lat, newLatLng.lng);
                            let bearing = calculateBearing(lat, lng, newLatLng.lat, newLatLng.lng);
                            for (let i = 0; i < globalStore.mapLayer.length; i++) {
                                let latOfMarker = globalStore.mapLayer[i].lat;
                                let lngOfMarker = globalStore.mapLayer[i].lng;
                                // console.log('checkMarkerInCircle(circle, latOfMarker, lngOfMarker)', checkMarkerInCircle(circle, latOfMarker, lngOfMarker))
                                if (checkMarkerInCircle(circle, latOfMarker, lngOfMarker)) {
                                    let newPoint = calculateDestinationPoint(latOfMarker, lngOfMarker, bearing, distance * 1000)
                                    if (newPoint.lat && newPoint.lng) {
                                        addHouseMarker(map, newPoint.lat, newPoint.lng, globalStore.lock);
                                        globalStore.changePositionOfMapElementSelected(newPoint.lat, newPoint.lng, globalStore.mapLayer[i].id);
                                        console.log('test', distance, computeDistanceBetweenTwoPoint(latOfMarker, lngOfMarker, newPoint.lat, newPoint.lng), bearing, calculateBearing(latOfMarker, lngOfMarker, newPoint.lat, newPoint.lng))
                                    }
                                }
                            }
                            globalStore.updateBoundCirclePolygonPallet(id, newLatLng);
                        });
                        globalStore.setStatusCirclePolygonPallet(id, true)
                    }
                }
            }
        } else {
            for (let i = 0; i < globalStore.listCirclePolygonPallet.length; i++) {
                globalStore.setStatusCirclePolygonPallet(globalStore.listCirclePolygonPallet[i].id, false)
            }
        }

    }, [globalStore.listCirclePolygonPallet.length, globalStore.map]);

    useEffect(() => {
        if (globalStore.map) {
            if (globalStore.listLinePallet.length > 0) {
                for (let i = 0; i < globalStore.listLinePallet.length; i++) {
                    let linePallet = globalStore.listLinePallet[i]
                    let id = linePallet.id;
                    let status = linePallet.status;
                    let latlngs = linePallet.latlng.map(function(obj) {
                        return [obj.lat, obj.lng];
                    });
                    let type = linePallet.type;
                    if (!status && type === 'line-pallet') {
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
        } else {
            for (let i = 0; i < globalStore.listLinePallet.length; i++) {
                globalStore.setStatusLinePallet(globalStore.listLinePallet[i].id, false)
            }
        }

    }, [globalStore.listLinePallet.length, globalStore.map]);

    const checkMarkerInCircle = (circle, lat, lng) => {
        let marker = L.marker([lat, lng]);
        return circle.getBounds().contains(marker.getLatLng());
    }
};

export default observer(PalletGeoJsonContainer)

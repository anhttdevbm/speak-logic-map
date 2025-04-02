// /* eslint-disable react-hooks/exhaustive-deps */
import L from 'leaflet';
import {observer} from 'mobx-react-lite';
import {useMap} from 'react-leaflet';
import {useEffect, useState} from 'react';
import {useGlobalStore} from '@/providers/RootStoreProvider';
import {markerPersonIndex} from "@/components/Map/MapContents/Variables/Variables";
import {
    markerFnCircleIcon,
    markerMapElementIcon,
    markerPersonIcon
} from "@/components/Map/MapContents/Markers/MarkerIcons";
import styles from "@/components/Map/MapContents/_MapContents.module.scss";
import {givenSetPopup, personPopup, removeHorizontalIconPopup} from "@/components/Map/MapContents/Popups/Popups";
import 'leaflet-polylinedecorator';

const RelateView = ({setModal, setModalType}) => {
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
                    layer.options.type?.status === 'add' || layer.options.type === 'the-given-set'
                ) {
                    map.removeLayer(layer);
                }
            });

            globalStore.toggleClear();
        }
    }, [globalStore.clear]);

    const findLatLngPoint = (latLngElementSelected, latLngElementRelate) => {
        let pointElementSelected = map.latLngToContainerPoint(latLngElementSelected);
        let pointElementRelate = map.latLngToContainerPoint(latLngElementRelate);
        let centerX = (pointElementSelected.x + pointElementRelate.x) / 2;
        let centerY = (pointElementSelected.y + pointElementRelate.y) / 2;
        let centerPoint = {x: centerX, y: centerY};
        return map.containerPointToLatLng(centerPoint);
    }

    useEffect(() => {
        map.eachLayer(layer => {
            if (
                layer.options.options?.type === 'Relationship'
                || layer.options.type === 'line-relate'
                || layer.options.type === 'person-relate'
                || (layer.options.patterns && layer.options.patterns[0]?.symbol?.options?.pathOptions?.type === 'arrow')
            ) {
                map.removeLayer(layer);
            }
        });
        for (let i = 0; i < globalStore.listMapElementSelected.length; i++) {
            globalStore.changeStatusOfMapElementRelated(false, globalStore.listMapElementSelected[i].id)
        }
    }, [zoom])

    useEffect(() => {
            let world = {};
            let fpBoundary;
            const countriesLayer = [];

            for (let i = 0; i < globalStore.listMapElementSelected.length; i++) {
                let mapElementSelected = globalStore.listMapElementSelected[i];
                let mapElementRelate = mapElementSelected.related;
                let position = mapElementSelected.position;
                let id = mapElementSelected.id;
                if (mapElementRelate && !mapElementSelected.statusRelate && globalStore.mapView !== '' && position.length > 0) {
                    const latElementSelected = position[0];
                    const lngElementSelected = position[1];
                    const latElementRelated = position[0] - 30 * 2 / zoom;
                    const lng = lngElementSelected + 100 * 2 / zoom;
                    let centerLatLng = findLatLngPoint([latElementSelected, lng], [latElementRelated, lng])
                    const latCenter = centerLatLng.lat;

                    const leftHorizontalLineTop = [latElementSelected, lngElementSelected];
                    const rightHorizontalLineTop = [latElementSelected, lng];
                    const topVerticalLine = [latElementSelected, lng];
                    const downVerticalLine = [latCenter, lng];
                    const horizontalLineLatLngsTop = [[leftHorizontalLineTop, rightHorizontalLineTop],]
                    L.polyline(horizontalLineLatLngsTop, {weight: 2, color: 'black', status: 'add', type: 'line-relate'})
                        .on('contextmenu', e => removeHorizontalIconPopup(map, e, globalStore.removeHorizontalIcon))
                        .addTo(map);
                    L.polyline([topVerticalLine, downVerticalLine], {status: 'add', weight: 2, color: 'black', type: 'line-relate',})
                        .addTo(map);

                    L.marker([latCenter, lngElementSelected + 100 * 2 / zoom], {
                        target: {
                            status: 'add',
                        },
                        options: {
                            type: 'Relationship',
                        },
                        icon: markerFnCircleIcon(
                            `${styles['circle-relate']}`, 'Related'
                        ),
                    }).on('contextmenu', e => givenSetPopup(map, e, globalStore.resetPositionOfHorizontalLine))
                        .addTo(map);
                    let lineRelate = L.polyline([[latCenter, lng], [latCenter, lng + 30 * 2 / zoom]], {
                        status: 'add',
                        weight: 2,
                        color: 'black',
                        type: 'line-relate',
                    })
                        .addTo(map);

                    L.polylineDecorator(lineRelate, {
                        patterns: [
                            {offset: '100%', symbol: L.Symbol.arrowHead({pixelSize: 10, polygon: false, pathOptions: { color: 'black', type: 'arrow', status: 'add', } }) }
                        ]
                    }).addTo(map);

                    const leftHorizontalLineBottom = [latElementRelated, lngElementSelected];
                    const rightHorizontalLineBottom = [latElementRelated, lng];
                    const topVerticalLine2 = [latCenter, lng]
                    const downVerticalLine2 = [latElementRelated, lng];
                    const horizontalLineLatLngsDown = [[leftHorizontalLineBottom, rightHorizontalLineBottom],]
                    L.polyline(horizontalLineLatLngsDown, {weight: 2, color: 'black', status: 'add', type: 'line-relate',})
                        .on('contextmenu', e => removeHorizontalIconPopup(map, e, globalStore.removeHorizontalIcon))
                        .addTo(map);
                    L.polyline([topVerticalLine2, downVerticalLine2], {status: 'add', weight: 2, color: 'black', type: 'line-relate',})
                        .addTo(map);

                    let index = markerPersonIndex[0];
                    if (mapElementRelate === 'Person' && !mapElementSelected.relateName) {
                        markerPersonIndex[0]++;
                        globalStore.setMapLayer(leftHorizontalLineBottom[0], leftHorizontalLineBottom[1], 'Person ' + index, 'person')
                        globalStore.updateRelationshipMapLayerById(leftHorizontalLineBottom[0], leftHorizontalLineBottom[1], 'person', 'Person '+ index, true);
                        globalStore.changeRelateNameOfMapElementSelected(`Person ${index}`, id)
                        let newMarker = L.marker(leftHorizontalLineBottom, {
                            target: {
                                type: 'person',
                                index: index,
                                status: 'add',
                            },
                            type: 'person-relate',
                            icon: markerPersonIcon(``, `Person ${index}`, null),
                        })
                            .on('contextmenu', e => personPopup(map, newMarker, setModal, setModalType, globalStore.lock, e,
                                globalStore.setPersonToListMapElementSelected, globalStore.resetNumberPersonMobility,
                                globalStore.updateMapLayerById, globalStore.removeMapLayerById))
                            .addTo(map);
                    } else if (mapElementRelate === 'Person' && mapElementSelected.relateName) {
                        let newMarker = L.marker(leftHorizontalLineBottom, {
                            target: {
                                type: 'person',
                                index: mapElementSelected.relateName.split(' ')[1],
                                status: 'add',
                            },
                            type: 'person-relate',
                            icon: markerPersonIcon(``, mapElementSelected.relateName, null),
                        })
                            .on('contextmenu', e => personPopup(map, newMarker, setModal, setModalType, globalStore.lock, e,
                                globalStore.setPersonToListMapElementSelected, globalStore.resetNumberPersonMobility,
                                globalStore.updateMapLayerById, globalStore.removeMapLayerById))
                            .addTo(map);
                    } else {
                        L.marker(leftHorizontalLineBottom, {
                            options: {
                                type: 'Relationship',
                            },
                            type: 'map-element-relate',
                            icon: mapElementRelate === 'Person'
                                ? markerPersonIcon(``, `Person ${index}`, null)
                                : markerMapElementIcon(`${styles['rectangle-fn']} ${styles['map-element']}`, mapElementRelate),
                        }).addTo(map);
                    }
                    globalStore.changeStatusOfMapElementRelated(true, id);
                } else {
                    countriesLayer.forEach((layer) => {
                        map.removeLayer(layer);
                    });
                }
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
        }, [globalStore.map, globalStore.mapView, globalStore.listMapElementSelected.length, globalStore.listMapElementRelate.length, zoom]
    );

    return null
}

export default observer(RelateView)

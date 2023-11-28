// /* eslint-disable react-hooks/exhaustive-deps */
import L from 'leaflet';
import {observer} from 'mobx-react-lite';
import {useMap} from 'react-leaflet';
import {allLayer, markerPersonIndex} from '../Variables/Variables';
import {useEffect, useState} from 'react';
import {useCountryStore, useGlobalStore} from '@/providers/RootStoreProvider';
import {
    markerDistancePointIcon,
    markerFnIcon,
    markerHouseIconWithName, markerPersonIcon, markerPlusIcon, markerPlusMoreViewIcon, markerPopulationCountry,
    markerRectHouseIcon, markerRectNameIcon, markerRelateIcon,
    markerRoomIcon, markerThreeDotsIcon
} from '../Markers/MarkerIcons';
import styles from '../_MapContents.module.scss';
import {addStaticDistance} from '../Markers/AddMarkers';
import * as turf from '@turf/turf';
import {addSelectedItem} from '../Markers/HandleSelectItem';
import {
    addMarkerFn, addMarkerPerson, addSoluOrProbFn,
    addMarkerCountryFn, addMarkerCountryGroupFn
} from '../Markers/AddMarkers';
import {removeRectIconPopup, tempFnPopup} from "@/components/Map/MapContents/Popups/Popups";

const MoreView = ({selectedData}) => {
    const map = useMap();
    const globalStore = useGlobalStore();
    const countryStore = useCountryStore();

    const countriesToMoveToTop = ["CAN", "USA", "MEX"];

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
        }
    }, [globalStore.clear]);

    useEffect(() => {
        let world = {};
        let fpBoundary;
        const functionsLayer = [];
        // if (globalStore.countryQuantity > 0 && countryStore.countries.length === globalStore.countryQuantity) {
        if (globalStore.moreName !== '') {
            map.eachLayer(layer => {
                if (layer._arrowheads) {
                    layer.remove();
                }
                allLayer.push(layer);
            });

            map.eachLayer(layer => map.removeLayer(layer));

            const firstLat = -50;
            const firstLng = -120;
            const latList = [40.5, -1, -42];
            const lngList = [-99, -52, -4, 41, 88]
            // Add the floor-plan boundary
            let bounds = [[firstLat, firstLng], [-firstLat, -firstLng]];
            fpBoundary = L.rectangle(bounds, {weight: 2, opacity: 1, fillOpacity: 0, color: 'black'});
            fpBoundary.addTo(map);

            if (globalStore.moreName === 'world-as-function' && globalStore.listMarkerFunction.length > 0) {
                addItemDotDot(globalStore.listMarkerFunction).forEach((fn, index) => {
                    const lat = latList[Math.floor(index / lngList.length)];
                    const lng = lngList[index % lngList.length];
                    let functionMarker;
                    if (fn.key === 'dot') {
                        functionMarker = addIconDotDot(lat, lng);
                    } else if (fn.key === 'plus') {
                        functionMarker = L.marker([lat, lng], {
                            options: {
                                type: fn.value,
                            },
                            icon: markerPlusMoreViewIcon(
                                `${styles['plus-icon-more-view']}`)
                        })
                            .on('click', e => {
                                globalStore.toggleModalNumberFunctionMoreView();
                            })
                            .addTo(map);
                    } else {
                        functionMarker = L.marker([lat, lng], {
                            options: {
                                type: fn.value,
                            },
                            icon: markerFnIcon(
                                fn.shape === 'rectangle'
                                    ? `${styles['rect-house-icon']}` : fn.shape === 'ellipse'
                                        ? `${styles['ellipse-fn-icon']}` : `${styles['rect-house-icon']}`,
                                fn.value)
                        })
                            .addTo(map);
                    }

                    functionsLayer.push(functionMarker);
                })
            } else if (globalStore.moreName === 'world-problem-view' && globalStore.listMarkerProblem.length > 0) {
                addItemDotDot(globalStore.listMarkerProblem).forEach((pl, index) => {
                    const lat = latList[Math.floor(index / lngList.length)];
                    const lng = lngList[index % lngList.length];
                    let functionMarker;
                    if (pl.key !== '') {
                        functionMarker = L.marker([lat, lng], {
                            options: {
                                type: pl.value,
                            },
                            icon: markerFnIcon(
                                pl.shape === 'rectangle'
                                    ? `${styles['rect-house-icon']}` : pl.shape === 'ellipse'
                                        ? `${styles['ellipse-fn-icon']}` : `${styles['rect-house-icon']}`,
                                pl.value)
                        })
                            .addTo(map);
                    } else {
                        functionMarker = addIconDotDot(lat, lng)
                    }

                    functionsLayer.push(functionMarker);
                })
            } else if (globalStore.moreName === 'population-view' && globalStore.listMarkerPopulation.length > 0) {
                addItemDotDot(globalStore.listMarkerPopulation).forEach((person, index) => {
                    const lat = latList[Math.floor(index / lngList.length)];
                    const lng = lngList[index % lngList.length];
                    let functionMarker;
                    if (person.key !== '') {
                        functionMarker = L.marker([lat, lng], {
                            options: {
                                type: person.value,
                            },
                            icon: markerPersonIcon(`${styles['rectangleFn']}`, person.value, null)
                        })
                            .addTo(map);
                    } else {
                        functionMarker = addIconDotDot(lat, lng)
                    }
                    functionsLayer.push(functionMarker);
                })
            } else if (globalStore.moreName === 'population-view-with-country') {
                const latListt = [40.5, -1, -42];
                const lngListt = [-99, -30, 41, 88];
                if (globalStore.map) {
                    const numberPersonOfEachCountry = getNumberPopulationOfCountry();
                    if (numberPersonOfEachCountry.length > 0) {
                        addItemDotDot(numberPersonOfEachCountry).forEach((country, index) => {
                            const lat = latListt[Math.floor(index / latListt.length)];
                            const lng = lngListt[index % latListt.length];
                            let functionMarker;
                            if (country.country?.codeName !== '') {
                                functionMarker = L.marker([lat, lng], {
                                    options: {
                                        type: country.country?.codeName,
                                    },
                                    icon: markerPopulationCountry(
                                        `${styles['population-country-icon']}`,
                                        country.country?.fullName.includes(" ") ? country.country?.codeName : country.country?.fullName,
                                        country.numberPerson)
                                })
                                    .addTo(map);
                            } else {
                                functionMarker = addIconDotDot(lat, lng)
                            }
                            functionsLayer.push(functionMarker);
                        })
                    }
                } else {
                    const lat = latListt[0];
                    const lng = lngListt[0];
                    let country = selectedData[0].features[0].properties;
                    let functionMarker = L.marker([lat, lng], {
                        options: {
                            type: country.NAME,
                        },
                        icon: markerPopulationCountry(
                            `${styles['population-country-icon']}`,
                            country.NAME.includes(" ") ? country.CODE : country.NAME,
                            country.numberPerson)
                    })
                        .addTo(map);
                    functionsLayer.push(functionMarker);
                }

            }

        } else if (globalStore.moreName === '') {
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
            functionsLayer?.forEach((layer) => {
                if (layer) {
                    map.removeLayer(layer);
                }
            });
        };
    }, [globalStore.map, globalStore.moreName, selectedData, globalStore.numberFunctionMoreView]);

    const addItemDotDot = (listCountry) => {
        if (globalStore.moreName === 'population-view-with-country') {
            let listCountryIncludedPlus = listCountry.filter(item => item.country.codeName === '');
            if (listCountryIncludedPlus.length === 0) {
                listCountry.push({country: {fullName: '', codeName: ''}, numberPerson: 0});
            }
            return listCountry;
        }
        let listCountryIncludedDot = listCountry.filter(item => item.key === 'dot');
        let listCountryIncludedPlus = listCountry.filter(item => item.key === 'plus');
        if (listCountryIncludedDot.length === 0) {
            listCountry.push({key: 'dot', value: 'dot'});
        }
        if (listCountryIncludedPlus.length === 0) {
            listCountry.push({key: 'plus', value: 'plus'});
        }
        return listCountry;
    }

    const addIconDotDot = (lat, lng) => {
        return L.marker([lat, lng], {
            options: {
                type: 'room',
            },
            icon: markerThreeDotsIcon(
                globalStore.moreName === 'population-view-with-country' ? `${styles['dot-population-country-icon']}` : `${styles['dot-icon']}`),
        })
            .addTo(map);
    }

    const getNumberPopulationOfCountry = () => {
        let result = []
        if (globalStore.mapLayer.length > 0) {
            for (let i = 0; i < globalStore.mapLayer.length; i++) {
                let personName = globalStore.mapLayer[i].name
                if (personName?.startsWith('Person')) {
                    let lat = globalStore.mapLayer[i].lat;
                    let lng = globalStore.mapLayer[i].lng;

                    const point = turf.point([Number(lng), Number(lat)]);
                    countryStore.countries.forEach(country => {
                        let countryName = country.name

                        if (country.data[0].features[0].geometry.type === "MultiPolygon") {
                            country.data[0].features[0].geometry.coordinates.forEach(coordinate => {
                                const polygon = turf.polygon(coordinate)
                                if (turf.booleanPointInPolygon(point, polygon)) {
                                    result.push({
                                        country: countryName,
                                        personName: personName
                                    })
                                }
                            })
                        } else {
                            const polygon = turf.polygon(country.data[0].features[0].geometry.coordinates);
                            if (turf.booleanPointInPolygon(point, polygon)) {
                                result.push({
                                    country: countryName,
                                    personName: personName
                                })
                            }
                        }
                    })
                }
            }

        }
        return countNumberPersonOfEachCountry(result);
    }

    const countNumberPersonOfEachCountry = (result) => {
        const x = result.reduce((accumulator, item) => {
            const existingCountry = accumulator.find(entry => entry.country.codeName === item.country.codeName);

            if (existingCountry) {
                existingCountry.numberPerson += 1;
            } else {
                accumulator.push({
                    "country": {
                        "fullName": item.country.fullName,
                        "codeName": item.country.codeName
                    },
                    "numberPerson": 1
                });
            }

            return accumulator;
        }, []);

        // Sort the result array to move specific countries to the front
        return x.sort((a, b) => {
            if (countriesToMoveToTop.includes(a.country.codeName)) return -1;
            if (countriesToMoveToTop.includes(b.country.codeName)) return 1;
            return 0;
        });
    }

    return null
}

export default observer(MoreView)

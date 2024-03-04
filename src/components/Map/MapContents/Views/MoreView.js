// /* eslint-disable react-hooks/exhaustive-deps */
import L from 'leaflet';
import {observer} from 'mobx-react-lite';
import {useMap} from 'react-leaflet';
import {
    allLayer,
} from '../Variables/Variables';
import {useEffect, useState} from 'react';
import {useCountryStore, useGlobalStore} from '@/providers/RootStoreProvider';
import {
    markerFnIcon,
    markerGivenSetIcon,
    markerPersonIcon,
    markerPlusMoreViewIcon,
    markerPopulationCountry,
    markerProblemCountry,
    markerThreeDotsIcon, markerThreeDotsIconPrincipleLine
} from '../Markers/MarkerIcons';
import styles from '../_MapContents.module.scss';
import * as turf from '@turf/turf';
import {
    givenSetPopup,
} from "@/components/Map/MapContents/Popups/Popups";

const MoreView = ({selectedData}) => {
    const map = useMap();
    const globalStore = useGlobalStore();
    const countryStore = useCountryStore();

    const countriesToMoveToTop = ["CAN", "USA", "MEX"];

    const [zoom, setZoom] = useState(map.getZoom());

    map.on('zoomend', () => {
        setZoom(map.getZoom());
    });

    // useEffect(() => {
    //     if (globalStore.clear) {
    //         debugger
    //         if (globalStore.moreName === 'world-as-function') {
    //             globalStore.resetListMarkerFunction();
    //         } else if (globalStore.moreName === 'population-view') {
    //             globalStore.resetListMarkerPopulation();
    //         } else if (globalStore.moreName === 'world-problem-view') {
    //             globalStore.resetListMarkerProblem();
    //         }
    //         map.eachLayer(layer => {
    //             console.log('layer1', layer)
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

            let firstLat = -50;
            let firstLng = -120;
            let latList = [40.5, 3, -35];
            let lngList = [-99, -52, -4, 41, 88]
            // Add the floor-plan boundary
            let bounds = [[firstLat, firstLng], [-firstLat, -firstLng]];
            fpBoundary = L.rectangle(bounds, {weight: 2, opacity: 1, fillOpacity: 0, color: 'black'});
            fpBoundary.addTo(map);

            if (globalStore.moreName === 'world-as-function' && globalStore.listMarkerFunction.length > 0) {
                let listMarkerFnValid = globalStore.listMarkerFunction.filter(item => !(item.isShow === false));
                addItemDotDot(listMarkerFnValid).forEach((fn, index) => {
                    let lat = 0;
                    let lng = 0;
                    if (listMarkerFnValid.length < 16) {
                        lat = latList[Math.floor(index / lngList.length)];
                        lng = lngList[index % lngList.length];
                    } else {
                        let numberItemPerRow = Math.floor(listMarkerFnValid.length / 3) + 1;
                        lat = latList[Math.floor(index / numberItemPerRow)];
                        lng = -99 + 215 / numberItemPerRow * ((index) % numberItemPerRow);
                    }
                    let functionMarker;
                    if (fn.key === 'dot') {
                        functionMarker = addIconDotDot(lat, lng);
                    } else if (fn.key === 'plus') {
                        functionMarker = L.marker([lat, lng], {
                            // options: {
                            //     type: fn.value,
                            // },
                            icon: markerPlusMoreViewIcon(
                                `${styles['plus-icon-more-view']}`)
                        })
                            .on('click', e => {
                                globalStore.toggleModalNumberFunctionMoreView();
                            })
                            .addTo(map);
                    } else {
                        functionMarker = L.marker([lat, lng], {
                            target: {
                                type: fn.value,
                                status: 'add'
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
                let listMarkerPlValid = globalStore.listMarkerProblem.filter(item => !(item.isShow === false));
                addItemDotDot(listMarkerPlValid).forEach((pl, index) => {
                    let lat = 0;
                    let lng = 0;
                    if (listMarkerPlValid.length < 16) {
                        lat = latList[Math.floor(index / lngList.length)];
                        lng = lngList[index % lngList.length];
                    } else {
                        let numberItemPerRow = Math.floor(listMarkerPlValid.length / 3) + 1;
                        lat = latList[Math.floor(index / numberItemPerRow)];
                        lng = -99 + 215 / numberItemPerRow * ((index) % numberItemPerRow);
                    }
                    let functionMarker;
                    if (pl.key === 'dot') {
                        functionMarker = addIconDotDot(lat, lng);
                    } else if (pl.key === 'plus') {
                        functionMarker = L.marker([lat, lng], {
                            options: {
                                type: pl.value,
                            },
                            icon: markerPlusMoreViewIcon(
                                `${styles['plus-icon-more-view']}`)
                        })
                            .on('click', e => {
                                globalStore.toggleModalInsertNumberProblemMoreView();
                            })
                            .addTo(map);
                    } else {
                        functionMarker = L.marker([lat, lng], {
                            options: {
                                type: pl.value,
                            },
                            icon: markerFnIcon(
                                pl.shape === 'rectangle'
                                    ? `${styles['rect-house-icon']} ${styles['fn--red-important']}` : pl.shape === 'ellipse'
                                        ? `${styles['ellipse-fn-icon']} ${styles['fn--red-important']}` : `${styles['rect-house-icon']} ${styles['fn--red-important']}`,
                                pl.value)
                        })
                            .addTo(map);
                    }

                    functionsLayer.push(functionMarker);
                })
            } else if (globalStore.moreName === 'population-view' && globalStore.listMarkerPopulation.length > 0) {
                addItemDotDot(globalStore.listMarkerPopulation).forEach((person, index) => {
                    let lat = 0;
                    let lng = 0;
                    if (globalStore.listMarkerPopulation.length < 16) {
                        lat = latList[Math.floor(index / lngList.length)];
                        lng = lngList[index % lngList.length];
                    } else {
                        let numberItemPerRow = Math.floor(globalStore.listMarkerPopulation.length / 3) + 1;
                        lat = latList[Math.floor(index / numberItemPerRow)];
                        lng = -99 + 215 / numberItemPerRow * ((index) % numberItemPerRow);
                    }
                    let functionMarker;
                    if (person.key === 'dot') {
                        functionMarker = addIconDotDot(lat, lng);
                    } else if (person.key === 'plus') {
                        functionMarker = L.marker([lat, lng], {
                            options: {
                                type: person.value,
                            },
                            icon: markerPlusMoreViewIcon(
                                `${styles['plus-icon-more-view']}`)
                        })
                            .on('click', e => {
                                globalStore.toggleModalNumberPersonMoreView();
                            })
                            .addTo(map);
                    } else {
                        functionMarker = L.marker([lat, lng], {
                            options: {
                                type: person.value,
                            },
                            icon: markerPersonIcon(`${styles['rectangleFn']}`, person.value, null)
                        })
                            .addTo(map);
                    }
                    functionsLayer.push(functionMarker);
                })
            } else if (globalStore.moreName === 'population-view-with-country') {
                const latListt = [42.5, 10, -27];
                let lngListt = [-79, 0, 79];
                // if (globalStore.map) {
                const numberPersonOfEachCountry = getNumberPopulationOfCountry();
                if (numberPersonOfEachCountry.length > 8) {
                    lngListt = [];
                    let numberItemPerRow = Math.floor(numberPersonOfEachCountry.length / 3) + 1;
                    for (let i = 0; i < numberItemPerRow; i++) {
                        let res = -79 + 210 / numberItemPerRow * ((i) % numberItemPerRow)
                        lngListt.push(res);
                    }
                }
                if (numberPersonOfEachCountry.length > 0) {
                    addItemDotDot(numberPersonOfEachCountry).forEach((country, index) => {
                        const lat = latListt[Math.floor(index / lngListt.length)];
                        const lng = lngListt[index % lngListt.length];
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
                // } else {
                //     const lat = latListt[0];
                //     const lng = lngListt[0];
                //     let country = selectedData[0].features[0].properties;
                //     let functionMarker = L.marker([lat, lng], {
                //         options: {
                //             type: country.NAME,
                //         },
                //         icon: markerPopulationCountry(
                //             `${styles['population-country-icon']}`,
                //             country.NAME.includes(" ") ? country.CODE : country.NAME,
                //             country.numberPerson)
                //     })
                //         .addTo(map);
                //     functionsLayer.push(functionMarker);
                // }
            } else if (globalStore.moreName === 'problem-view-with-country') {
                map.removeLayer(fpBoundary);
                bounds = [[firstLat, -140], [-firstLat, 140]];
                fpBoundary = L.rectangle(bounds, {weight: 2, opacity: 1, fillOpacity: 0, color: 'black'});
                fpBoundary.addTo(map);
                const latListt = [43.5, 10, -26];
                let lngListt = [-99, -10, 79];
                const numberProblemOfEachCountry = getNumberProblemOfCountry();
                if (numberProblemOfEachCountry.length > 8) {
                    lngListt = [];
                    let numberItemPerRow = Math.floor(numberProblemOfEachCountry.length / 3) + 1;
                    for (let i = 0; i < numberItemPerRow; i++) {
                        let res = -99 + 240 / numberItemPerRow * ((i) % numberItemPerRow)
                        lngListt.push(res);
                    }
                }
                if (numberProblemOfEachCountry.length > 0) {
                    addItemDotDot(numberProblemOfEachCountry).forEach((country, index) => {
                        const lat = latListt[Math.floor(index / lngListt.length)];
                        const lng = lngListt[index % lngListt.length];
                        let functionMarker;
                        if (country.country?.codeName !== '') {
                            functionMarker = L.marker([lat, lng], {
                                target: {status: 'add'},
                                options: {
                                    type: country.country?.codeName,
                                },
                                icon: markerProblemCountry(
                                    `${styles['population-country-icon']}`,
                                    country.country?.fullName.includes(" ") ? country.country?.codeName : country.country?.fullName,
                                    country.numberPerson)
                            })
                                .addTo(map);
                        } else {
                            functionMarker = addIconDotDotPrincipleLine(lat, lng)
                        }
                        functionsLayer.push(functionMarker);
                    })
                }
                // } else {
                //     const lat = latListt[0];
                //     const lng = lngListt[0];
                //     let country = selectedData[0].features[0].properties;
                //     let functionMarker = L.marker([lat, lng], {
                //         target: {status: 'add'},
                //         options: {
                //             type: country.NAME,
                //         },
                //         icon: markerProblemCountry(
                //             `${styles['population-country-icon']}`,
                //             country.NAME.includes(" ") ? country.CODE : country.NAME,
                //             country.numberPerson)
                //     })
                //         .addTo(map);
                //     functionsLayer.push(functionMarker);
                // }
            } else if (globalStore.moreName === 'population-view-principle-line') {
                firstLng = -190;
                const numberPersonOfEachCountry = globalStore.listMarkerPopulation;
                const numberPerson = globalStore.listMarkerPopulation.filter(item => item.key !== 'dot' && item.key !== 'plus');
                latList = [35.5, 40];
                if (numberPerson.length === 1) {
                    lngList = [3];
                } else if (numberPerson.length === 2) {
                    lngList = [-110, 110];
                } else {
                    lngList = [];
                    for (let i = 0; i < numberPerson.length; i++) {
                        let res = -155 + (310 / (numberPerson.length - 1)) * i;
                        lngList.push(res);
                    }
                }
                map.removeLayer(fpBoundary);
                bounds = [[65, firstLng], [5, -firstLng]];
                fpBoundary = L.rectangle(bounds, {weight: 2, opacity: 1, fillOpacity: 0, color: 'black'});
                fpBoundary.addTo(map);
                if (numberPerson.length > 0) {
                    // if (globalStore.map) {
                    const latHorizontalLine = 60;
                    const lngHorizontalLine = 0;
                    const leftHorizontalLine = [latHorizontalLine, lngHorizontalLine - 170]
                    const rightHorizontalLine = [latHorizontalLine, lngHorizontalLine + 170];
                    const horizontalLineLatLngs = [[leftHorizontalLine, rightHorizontalLine],]
                    // Draw icon principle line
                    // let iconPrinciple = L.marker([latHorizontalLine + 5, lngHorizontalLine], {
                    //     target: {
                    //         status: 'add'
                    //     },
                    //     options: {
                    //         type: 'Main set',
                    //     },
                    //     icon: markerGivenSetIcon(`${styles['main-set-icon']}`),
                    // }).addTo(map)

                    let iconPrinciple = L.marker([latHorizontalLine + 15, lngHorizontalLine + 3], {
                        target: {
                            status: 'add'
                        },
                        type: 'more-view-main-set',
                        icon: markerFnIcon(
                            `${styles['rectangle-fn']} ${styles['the-given-set']}`,
                            `The Given Set`
                        ),
                    }).addTo(map);
                    let verticalLineTheGivenSet = L.polyline([[latHorizontalLine + 15, lngHorizontalLine + 3], [latHorizontalLine, lngHorizontalLine + 3]],
                        {
                            weight: 2,
                            color: 'black',
                            status: 'add',
                            type: 'vertical-line-the-given-set'
                        }).arrowheads({size: '15px', color: 'black', type: 'arrow', status: 'add'}).addTo(map);

                    //Draw line
                    const horizontalLine = L.polyline(horizontalLineLatLngs, {
                        weight: 2,
                        color: 'black',
                        target: {
                            status: 'add'
                        },
                    });
                    horizontalLine.addTo(map);
                    functionsLayer.push(iconPrinciple);
                    functionsLayer.push(horizontalLine);
                    functionsLayer.push(verticalLineTheGivenSet);

                    //Draw vertical line

                    //Draw population with country
                    if (numberPersonOfEachCountry.length > 0) {
                        addItemDotDot(numberPersonOfEachCountry).forEach((person, index) => {
                            const lat = latList[Math.floor(index / lngList.length)];
                            const lng = lngList[index % lngList.length];
                            let functionMarker;
                            if (person.key !== 'dot' && person.key !== 'plus') {
                                let verticalLine = L.polyline([[latHorizontalLine, lng], [lat + 2, lng]], {
                                    weight: 2,
                                    color: 'black',
                                    status: 'add'
                                }).arrowheads({size: '15px', color: 'black', type: 'arrow', status: 'add'}).addTo(map);
                                functionMarker = L.marker([lat, lng], {
                                    options: {
                                        type: person.value,
                                    },
                                    icon: markerPersonIcon(`${styles['rectangleFn']} ${styles['person-more-view-principle-line']}`, person.value, null)
                                })
                                    .addTo(map);
                                functionsLayer.push(verticalLine);
                            } else if (person.key === 'dot') {
                                // functionMarker = addIconDotDotPrincipleLine(lat, lng)
                            }
                            functionsLayer.push(functionMarker);
                        })
                    }
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
    }, [globalStore.map, globalStore.mapLayer.length, globalStore.moreName, selectedData, globalStore.numberFunctionMoreView,
        globalStore.numberPersonMoreView, globalStore.numberProblemMoreView]);

    const addItemDotDot = (listCountry) => {
        if (globalStore.moreName === 'population-view-with-country'
            || globalStore.moreName === 'problem-view-with-country') {
            let listCountryIncludedPlus = listCountry.filter(item => item.country.codeName === '');
            if (listCountryIncludedPlus.length === 0) {
                listCountry.push({country: {fullName: '', codeName: ''}, numberPerson: 0});
            }
            return listCountry;
        }
        if (listCountry.slice(0, -1).length !== 0) {
            let listCountryIncludedDot = listCountry.filter(item => item.key === 'dot');
            if (listCountryIncludedDot.length === 0) {
                // listCountry.push({key: 'dot', value: 'dot'});
                listCountry.splice(listCountry.length - 1, 0, {key: 'dot', value: 'dot'});
            }
        }
        let listCountryIncludedPlus = listCountry.filter(item => item.key === 'plus');

        if (listCountryIncludedPlus.length === 0) {
            listCountry.push({key: 'plus', value: 'plus'});
        }
        return listCountry;
    }

    const addIconDotDot = (lat, lng) => {
        return L.marker([lat, lng], {
            target: {
                type: 'dot',
                status: 'add'
            },
            icon: markerThreeDotsIcon(
                globalStore.moreName === 'population-view-with-country' ? `${styles['dot-population-country-icon']}` : `${styles['dot-icon']}`),
        })
            .addTo(map);
    }

    const addIconDotDotPrincipleLine = (lat, lng) => {
        return L.marker([lat, lng], {
            target: {
                type: 'dot',
                status: 'add'
            },
            icon: markerThreeDotsIconPrincipleLine(
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

    const getNumberProblemOfCountry = () => {
        let result = [];
        if (globalStore.mapLayer.length > 0) {
            for (let i = 0; i < globalStore.mapLayer.length; i++) {
                let personName = globalStore.mapLayer[i].name
                if (personName?.startsWith('Problem')) {
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

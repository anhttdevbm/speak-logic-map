// /* eslint-disable react-hooks/exhaustive-deps */
import L from 'leaflet';
import {observer} from 'mobx-react-lite';
import {useMap, useMapEvents} from 'react-leaflet';
import {allLayer} from '../Variables/Variables';
import {useEffect, useState} from 'react';
import {useCountryStore, useGlobalStore} from '@/providers/RootStoreProvider';
import {markerRectHouseIcon, markerRectNameIcon} from '../Markers/MarkerIcons';
import styles from '../_MapContents.module.scss';
import {addStaticDistance} from '../Markers/AddMarkers';
import * as turf from '@turf/turf';
import {getGeoMainLand} from "@/utils/get_geo_mainland";
import ICON_HOUSE from "@/assets/icons/house-icon.png";
import RectName from "@/components/Map/MapContents/Views/rect/RectName";
import ReactDOM from "react-dom";
import {renderToStaticMarkup, renderToString} from 'react-dom/server'
import RectHouse from "@/components/Map/MapContents/Views/rect/RectHouse";
import {groupPopupHTML} from "@/components/Map/MapContents/Popups/PopupHTMLs";
import {rectPopup, worldPopup} from "@/components/Map/MapContents/Popups/Popups";

const RectangularView = () => {
    const map = useMap();
    const globalStore = useGlobalStore();
    const countryStore = useCountryStore();

    const [zoom, setZoom] = useState();

    const currentPosition = [44.96479793033104 - 20, -6.416015625000001];

    map.on('zoomend', () => {
        setZoom(map.getZoom());
    });

    useEffect(() => {
        globalStore.setListCountryInRect(['Canada', 'USA', 'Mexico'])
    }, []);

    useEffect(() => {
        if (!globalStore.showModalInsertCountry) {
            console.log('globalStore.showModalInsertCountry', globalStore.showModalInsertCountry)
            addMarkerCountryToMap()
        }

    }, [globalStore.map, globalStore.rectangularView, globalStore.listCountryInRect, globalStore.showModalInsertCountry, globalStore.click]);

    useMapEvents({
        contextmenu(e) {
            console.log('1232')
            if (globalStore.map && !globalStore.boatView && !globalStore.roomView && !globalStore.floorPlanView) {
                console.log("879567")
                rectPopup(map, e, globalStore.map, globalStore.toggleModalInsertCountry());
            }
        }
    })

    const clickHandler = () => {
        console.count("click");
    };
    const test = () => {
        console.log('HUHU')
        const buttonEl = document.getElementById("plus");
        console.log('v', buttonEl)
        if (buttonEl) {
            buttonEl.addEventListener("click", clickHandler);
        }
    }

    const addMarkerCountryToMap = () => {
        let world = {};
        let fpBoundary;
        let fpBoundaryText;
        const countriesLayer = [];
        if (globalStore.countryQuantity > 0 && countryStore.countries.length === globalStore.countryQuantity) {
            if (globalStore.rectangularView === 'rect-name' || globalStore.rectangularView === 'rect-house') {
                map.dragging.disable();
                map.touchZoom.disable();
                map.doubleClickZoom.disable();
                map.scrollWheelZoom.disable();
                map.eachLayer(layer => {
                    if (layer._arrowheads) {
                        layer.remove();
                    }
                    allLayer.push(layer);
                });

                map.eachLayer(layer => map.removeLayer(layer));

                if (globalStore.map) {

                    // const rectHouse = renderToString(<RectHouse listCountry={globalStore.listCountryInRect}
                    //                                             openModal={openModal}/>);
                    console.log('globalStore.model', globalStore.showModalInsertCountry)
                    const popup = L.popup();
                    popup
                        .addEventListener("popupopen", test)
                        .setLatLng(currentPosition)
                        .setContent(renderToString(<RectHouse listCountry={globalStore.listCountryInRect}/>))
                        .addTo(map);
                    // console.log('23432')
                    // document.getElementById('plus').onclick = function (){
                    //         console.log('hu')
                    //         globalStore.toggleModalInsertCountry();
                    //     }
                }
            } else if (globalStore.rectangularView === '') {
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
    }

    return null
}

export default observer(RectangularView)
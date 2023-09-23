/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw/dist/leaflet.draw';
import "@elfalem/leaflet-curve";
import "leaflet-textpath";
import "leaflet-arrowheads";
import { observer } from "mobx-react-lite";
import { useMap, useMapEvents } from "react-leaflet";
import {useGlobalStore, useSimulationSettingStore} from '@/providers/RootStoreProvider';
import "@bopen/leaflet-area-selection/dist/index.css";
import { DrawAreaSelection } from "@bopen/leaflet-area-selection";
import * as turf from '@turf/turf';

import styles from '../_MapContents.module.scss';

import {worldPopup, wrappingPopup} from '../Popups/Popups'

import {markerPersonIndex, markerFnIndex, selectedList, listMarkerFn} from '../Variables/Variables';

import {
  addMarkerPerson,
  addMarkerFn,
  addHouseMarker,
  addRoute,
  addDistance,
  addMarkerScrollFeature,
  addMarkerMapElement,
  addMarkerFnEllipse,
  addRelateMarker
} from './AddMarkers'
import simulation from "@/components/Tools/TopTools/ToolItems/Simulation";


// Toggle boundary of selected item
export const toggleBoundaryFn = (e) => {
  e.originalEvent.stopPropagation();
  e.originalEvent.preventDefault();

  if (!e.target.options.boundary) {
    e.target._icon.classList.add(styles["boundary"]);
    e.target.options.boundary = true;
  }
  else {
    e.target._icon.classList.remove(styles["boundary"]);
    e.target.options.boundary = false;
  }
}

let areaSelection;

// Add selected item to group by use CTRL + left click

const Markers = ({ setModal, setModalType }) => {
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
      console.log('simulationSettingStore.transitionTime/1000 + \'s\'', simulationSettingStore.transitionTime/1000 + 's')
      root?.style.setProperty("--time-animation", simulationSettingStore.transitionTime ? simulationSettingStore.transitionTime/1000 + 's' : '10s')
      map.eachLayer(layer => {
        if (layer.options.target?.type === 'function') {
          if (simulationSettingStore.effectedFunction === 'Random') {
            if (simulationSettingStore.boundary === 'Yes') {
              layer._icon.classList.add(styles["boundary"]);
            } else {
              layer._icon.classList.remove(styles["boundary"]);
            }
            // const random = Math.round(Math.random() * 10) % 2;
            layer._icon.classList.add(styles[`simulation-animate${0}`]);
          } else {
            console.log('layer.options', layer)
            listNameFunction.push(layer.options?.icon?.options?.html);
            listLayer.push(layer);
          }
        } else {
          setTimeout(() => {
            layer._icon?.classList.add(styles[`hidden`]);
          }, simulationSettingStore.discardTime)
        }
      });
      let smallFunction = listNameFunction.sort()[0];
      let smallFunctionLayer = listLayer.filter(item => item.options.icon.options.html === smallFunction)[0];
      getListLayerSortedDistance(listLayer, smallFunctionLayer)
      listLayer.forEach(layer => {
        setTimeout(() => {
          if (simulationSettingStore.boundary === 'Yes') {
            layer._icon.classList.add(styles["boundary"]);
          } else {
            layer._icon.classList.remove(styles["boundary"]);
          }
          // const random = Math.round(Math.random() * 10) % 2;
          layer._icon.classList.add(styles[`simulation-animate${0}`]);
        }, simulationSettingStore.transitionTime)
      })
    }
    else {
      map.eachLayer(layer => {
        if (layer.options.target?.type === 'function') {
          for (let i = 0; i < 6; i++) {
            layer._icon.classList.remove(styles[`simulation-animate${i}`]);
            layer._icon.classList.remove(styles["boundary"]);
          }
        }
      });
    }
  }, [globalStore.simulation])

  useEffect(() => {
    globalStore.setMapLayer(map);
  }, [map])

  // Toggle Lock - Unlock Markers
  useEffect(() => {
    if (globalStore.lock) {
      map.eachLayer((layer) => {
        layer._icon && layer.dragging.disable();
      })
    }
    else {
      map.eachLayer((layer) => {
        layer._icon && layer.dragging.enable();
        layer._icon?.src && layer.dragging.disable();
        layer.options?.infor && layer.dragging.disable();
      })
    }
  }, [globalStore.lock])

  // Get all function by wrapping in area (to add into a group)
  useEffect(() => {
    if (globalStore.map) {
      const getButton = document.getElementById("pointer-event");
      const textEvent = document.getElementById("text-event");
      const lineEvent = document.getElementById("line-event");
      const rectEvent = document.getElementById("rectangle-event");
      const ellipseEvent = document.getElementById("ellipse-event");
      let restrictPopup = 0;
      areaSelection = new DrawAreaSelection({
        onPolygonReady: (polygon) => {
          if (polygon && polygon._latlngs) {
            const arr = polygon._latlngs[0].map((e) => Object.values(e));

            map.eachLayer(layer => {
              if (layer._latlng) {
                if (
                    turf.booleanPointInPolygon(
                        turf.point(Object.values(layer._latlng)),
                        turf.polygon([[...arr, arr[0]]])
                    )
                ) {
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

      let drawnItemsLine = new L.FeatureGroup();
      const drawControlLine = new L.Control.Draw({
        draw: {
          polyline: {
            shapeOptions: {
              color: '#f06eaa', // Line color
            },
          },
          rectangle: false, // Enable drawing rectangles
          marker: false,
          circle: false,
          polygon: false,
          circlemarker: false
        },
        edit: {
          featureGroup: drawnItemsLine, // Create a feature group to store drawn rectangles
          remove: true,
          edit: false
        },
      });

      let drawnItems = new L.FeatureGroup();
      const drawControl = new L.Control.Draw({
        draw: {
          rectangle: true, // Enable drawing rectangles
          polyline: false,
          marker: false,
          circle: false,
          polygon: false,
          circlemarker: false
        },
        edit: {
          featureGroup: drawnItems, // Create a feature group to store drawn rectangles
          remove: true,
          edit: false
        },
      });

      let drawnItemsCircle = new L.FeatureGroup();
      const drawControlCircle = new L.Control.Draw({
        draw: {
          rectangle: false, // Enable drawing rectangles
          marker: false,
          polyline: false,
          circle: true,
          polygon: false,
          circlemarker: false
        },
        edit: {
          featureGroup: drawnItemsCircle, // Create a feature group to store drawn rectangles
          remove: true,
          edit: false
        },
      });

      const showScanSelection = () => {
        refreshLayerAndControlRect(map, drawnItems, drawControl);
        refreshLayerAndControlCircle(map, drawnItemsCircle, drawControlCircle);
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
        refreshLayerAndControlRect(map, drawnItems, drawControl);
        refreshLayerAndControlCircle(map, drawnItemsCircle, drawControlCircle);
        refreshLayerAndControlLine(map, drawnItemsCircle, drawControlCircle)
        globalStore.togglePalletOption('text')
      }

      const drawLine = () => {
        refreshLayerAndControlCircle(map, drawnItemsCircle, drawControlCircle);
        refreshLayerAndControlRect(map, drawnItems, drawControl);
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
          refreshLayerAndControlLine(map, drawnItems, drawControl);
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
          map.addLayer(drawnItems);
          map.addControl(drawControl);

          map.on(L.Draw.Event.CREATED, (event) => {
            const layer = event.layer;
            drawnItems.addLayer(layer);
          });
        } else {
          refreshLayerAndControlRect(map, drawnItems, drawControl);
        }
      }

      const drawCircle = () => {
        refreshLayerAndControlRect(map, drawnItems, drawControl);
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
            drawnItems.addLayer(layer);
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

      return () => {
        getButton?.removeEventListener("click", showScanSelection);
        textEvent?.removeEventListener("click", insertTextToMap);
        lineEvent?.removeEventListener("click", drawLine);
        rectEvent?.removeEventListener("click", drawRectangle);
        ellipseEvent?.removeEventListener("click", drawCircle);
      };
    }
  }, []);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const earthRadius = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
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
    map.removeLayer(drawnItems);
    map.removeControl(drawControl)
  }

  const refreshLayerAndControlRect = (map, drawnItems, drawControl) => {
    map.removeLayer(drawnItems);
    map.removeControl(drawControl)
  }

  const refreshLayerAndControlCircle = (map, drawnItems, drawControl) => {
    map.removeLayer(drawnItems);
    map.removeControl(drawControl)
  }

  // Remove all temp item when clicking on map
  useEffect(() => {
    const onClick = (event) => {
      if (
        window.handleRemoveTempList && (!event.ctrlKey || !event.metaKey) &&
        event.target.classList && !event.target.classList.contains(styles['rectangle-fn'])
      ) {
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
          addMarkerPerson(map, latlng.lat, latlng.lng, markerPersonIndex[0], globalStore.lock, setModal, setModalType,
              globalStore.setMapElementRelate, globalStore.setMapElementSelected)
          markerPersonIndex[0]++;
          globalStore.addIconHandle('');
        }
        else if (globalStore.addIcon === 'function') {
          addMarkerFn(map, latlng.lat, latlng.lng, markerFnIndex[0], globalStore.lock, setModal, setModalType)
          markerFnIndex[0]++;
          globalStore.addIconHandle('');
        }
        else if (globalStore.addIcon === 'house') {
          addHouseMarker(map, latlng.lat, latlng.lng, globalStore.lock)
          globalStore.addIconHandle('');
        }
        else if (globalStore.addIcon === 'welcome-sign') {
          addMarkerWelcomeSign(map, latlng.lat, latlng.lng, globalStore.lock);
          globalStore.addIconHandle('');
        }
        else if (globalStore.addIcon === 'inter-route') {
          addRoute(map, latlng.lat, latlng.lng, globalStore.lock);
          globalStore.addIconHandle('');
        }
        else if (globalStore.addIcon === 'distance') {
          addDistance(map, latlng.lat, latlng.lng, globalStore.lock);
          globalStore.addIconHandle('');
        }
        else if (globalStore.addIcon === 'scroll-feature') {
          // addMarkerScrollFeature(map, e.latlng.lat, e.latlng.lng, globalStore.lock);
          // globalStore.addIconHandle('');
          globalStore.setPositionOfScroll(latlng.lat, latlng.lng);
          globalStore.resetDataScroll();
          globalStore.addIconHandle('');
        }
      }
    }
  }, [globalStore.click, globalStore.addIcon])

  // Handle events on map
  useMapEvents({

    // Open right-click menu on map
    contextmenu(e) {
      if (globalStore.map && !globalStore.boatView && !globalStore.roomView && !globalStore.floorPlanView) {
        worldPopup(map, e, globalStore.map, globalStore.toggleHouseView, globalStore.setMapElementRelate, globalStore.setMapElementSelected);
      }
    },

    // Add markers to map by click event
    click(e) {
      console.log(`${e.latlng.lat} ${e.latlng.lng}`);

      if (globalStore.click) {
        // Add Person Marker
        if (globalStore.addIcon === 'person') {
          addMarkerPerson(map, e.latlng.lat, e.latlng.lng, markerPersonIndex[0], globalStore.lock, setModal, setModalType,
              globalStore.setMapElementRelate, globalStore.setMapElementSelected)
          let index = markerPersonIndex[0];
          globalStore.setMapLayer(e.latlng.lat, e.latlng.lng,'Person ' + index)
          globalStore.addMarkerPopulationToList(index)
          markerPersonIndex[0]++;
          globalStore.addIconHandle('');
        }
        else if (globalStore.addIcon === 'function') {
          if (globalStore.tableView !== '') {
            addMarkerFnEllipse(map, e.latlng.lat, e.latlng.lng, markerFnIndex[0], globalStore.lock, setModal, setModalType);
          } else {
            globalStore.addMarkerFnToList(markerFnIndex[0])
            addMarkerFn(map, e.latlng.lat, e.latlng.lng, markerFnIndex[0], globalStore.lock, setModal, setModalType, null, null, null, globalStore.setShapeOfMarkerFn);
          }
          // let index = markerFnIndex[0];
          // globalStore.addMarkerFnToList(index)
          markerFnIndex[0]++;
          globalStore.addIconHandle('');
        }
        else if (globalStore.addIcon === 'house') {
          addHouseMarker(map, e.latlng.lat, e.latlng.lng, globalStore.lock)
          globalStore.addIconHandle('');
        }
        else if (globalStore.addIcon === 'welcome-sign') {
          addMarkerWelcomeSign(map, e.latlng.lat, e.latlng.lng, globalStore.lock);
          globalStore.addIconHandle('');
        }
        else if (globalStore.addIcon === 'inter-route') {
          addRoute(map, e.latlng.lat, e.latlng.lng, globalStore.lock);
          globalStore.addIconHandle('');
        }
        else if (globalStore.addIcon === 'distance') {
          addDistance(map, e.latlng.lat, e.latlng.lng, globalStore.lock);
          globalStore.addIconHandle(''); 
        }
        else if (globalStore.addIcon === 'relate') {
          globalStore.resetPositionScroll();
          addRelateMarker(map, e.latlng.lat, e.latlng.lng, globalStore.lock);
          globalStore.addIconHandle('');
        }
        else if (globalStore.addIcon === 'scroll-feature') {
          // addMarkerScrollFeature(map, e.latlng.lat, e.latlng.lng, globalStore.lock);
          // globalStore.addIconHandle('');
          globalStore.setPositionOfScroll(e.latlng.lat, e.latlng.lng);
          globalStore.resetDataScroll();
          globalStore.addIconHandle('');
        }
        else if (globalStore.mapElementSelected) {
          const mapElement = globalStore.mapElementSelected;
          addMarkerMapElement(map, e.latlng.lat, e.latlng.lng, globalStore.lock, mapElement);
        }
      }
    }
  })

  return null;
}

export default observer(Markers)

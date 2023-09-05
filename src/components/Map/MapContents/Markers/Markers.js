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
import { useGlobalStore } from '@/providers/RootStoreProvider';
import "@bopen/leaflet-area-selection/dist/index.css";
import { DrawAreaSelection } from "@bopen/leaflet-area-selection";
import * as turf from '@turf/turf';

import styles from '../_MapContents.module.scss';

import {worldPopup, wrappingPopup} from '../Popups/Popups'

import {markerPersonIndex, markerFnIndex, selectedList, listMarkerFn} from '../Variables/Variables';

import {
  addMarkerPerson, addMarkerFn, addMarkerWelcomeSign,
  addHouseMarker, addRoute, addDistance, addMarkerScrollFeature
} from './AddMarkers'


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
  const map = useMap()

  map.doubleClickZoom.disable();

  // Active Simulation - Flash color of function marker
  useEffect(() => {
    if (globalStore.simulation) {
      map.eachLayer(layer => {
        if (layer.options.target?.type === 'function') {
          const random = Math.round(Math.random() * 10) % 6;
          layer._icon.classList.add(styles[`simulation-animate${random}`]);
        }
      });
    }
    else {
      map.eachLayer(layer => {
        if (layer.options.target?.type === 'function') {
          for (let i = 0; i < 6; i++) {
            layer._icon.classList.remove(styles[`simulation-animate${i}`]);
          }
        }
      });
    }
  }, [globalStore.simulation])

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

      let drawnItems = new L.FeatureGroup();
      const drawControl = new L.Control.Draw({
        draw: {
          rectangle: true, // Enable drawing rectangles
          marker: true,
          polyline: false,
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
        globalStore.togglePalletOption('text')
      }

      const drawRectangle = () => {
        refreshLayerAndControlCircle(map, drawnItemsCircle, drawControlCircle);
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
      rectEvent?.addEventListener("click", drawRectangle);
      ellipseEvent?.addEventListener("click", drawCircle);

      return () => {
        getButton?.removeEventListener("click", showScanSelection);
        textEvent?.removeEventListener("click", insertTextToMap);
        rectEvent?.removeEventListener("click", drawRectangle);
        ellipseEvent?.removeEventListener("click", drawCircle);
      };
    }
  }, []);

  const refreshLayerAndControlRect = (map, drawnItemsCircle, drawControlCircle) => {
    map.removeLayer(drawnItemsCircle);
    map.removeControl(drawControlCircle)
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
          addMarkerPerson(map, latlng.lat, latlng.lng, markerPersonIndex[0], globalStore.lock, setModal, setModalType)
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
      }
    }
  }, [globalStore.click, globalStore.addIcon])

  // Handle events on map
  useMapEvents({
    // Open right-click menu on map
    contextmenu(e) {
      if (globalStore.map && !globalStore.boatView && !globalStore.roomView && !globalStore.floorPlanView) {
        worldPopup(map, e, globalStore.map, globalStore.toggleHouseView);
      }
    },
    // Add markers to map by click event
    click(e) {
      console.log(`${e.latlng.lat} ${e.latlng.lng}`);
      // console.log(e);
      // globalStore.addIconHandle('');
      if (globalStore.click) {
        // Add Person Marker
        if (globalStore.addIcon === 'person') {
          globalStore.resetPositionScroll();
          addMarkerPerson(map, e.latlng.lat, e.latlng.lng, markerPersonIndex[0], globalStore.lock, setModal, setModalType)
          let index = markerPersonIndex[0];
          globalStore.addMarkerPopulationToList(index)
          markerPersonIndex[0]++;
          globalStore.addIconHandle('');
        }
        else if (globalStore.addIcon === 'function') {
          globalStore.resetPositionScroll();
          addMarkerFn(map, e.latlng.lat, e.latlng.lng, markerFnIndex[0], globalStore.lock, setModal, setModalType);
          let index = markerFnIndex[0];
          globalStore.addMarkerFnToList(index)
          markerFnIndex[0]++;
          globalStore.addIconHandle('');
        }
        else if (globalStore.addIcon === 'house') {
          globalStore.resetPositionScroll();
          addHouseMarker(map, e.latlng.lat, e.latlng.lng, globalStore.lock)
          globalStore.addIconHandle('');
        }
        else if (globalStore.addIcon === 'welcome-sign') {
          globalStore.resetPositionScroll();
          addMarkerWelcomeSign(map, e.latlng.lat, e.latlng.lng, globalStore.lock);
          globalStore.addIconHandle('');
        }
        else if (globalStore.addIcon === 'inter-route') {
          globalStore.resetPositionScroll();
          addRoute(map, e.latlng.lat, e.latlng.lng, globalStore.lock);
          globalStore.addIconHandle('');
        }
        else if (globalStore.addIcon === 'distance') {
          globalStore.resetPositionScroll();
          addDistance(map, e.latlng.lat, e.latlng.lng, globalStore.lock);
          globalStore.addIconHandle(''); 
        }
        else if (globalStore.addIcon === 'scroll-feature') {
          // addMarkerScrollFeature(map, e.latlng.lat, e.latlng.lng, globalStore.lock);
          // globalStore.addIconHandle('');
          globalStore.setPositionOfScroll(e.latlng.lat, e.latlng.lng);
        }
      }
    }
  })

  return null;
}

export default observer(Markers)
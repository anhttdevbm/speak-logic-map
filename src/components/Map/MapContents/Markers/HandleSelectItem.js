/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import L from 'leaflet';
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

import {
  markerPersonIcon, markerHouseIcon, markerNavigationSignIcon, 
  markerFnIcon, markerDistancePointIcon,
} from './MarkerIcons';

import { groupPopup, fnAndPersonPopup, routePopup, mainsetPopup, wrappingPopup } from '../Popups/Popups';

import { 
  groupFnLayoutPopupHTML, groupPersonLayoutPopupHTML, wrappingPopupHTML, 
  worldPopupHTML, housePopupHTML,
} from '../Popups/PopupHTMLs'

import { markerPersonIndex, markerFnIndex, 
  markerProblemIndex, markerHouseIndex, groupFnIndex, groupPersonIndex,
  functionSelected, personSelected, defaultFunction, defaultPerson, textPath,
  selectedList, allLayer, mainsetIndex
} from '../Variables/Variables';

import {addStaticDistance} from './AddMarkers'

// Remove selected items (Cancel button)
export const removeTempList = (selectedList) => {
  selectedList.forEach((item, index) => {
    item._icon?.classList.remove('selected-icon');
    selectedList.splice(index, 1);
  });
}

// Show distance between selected items (Show Distance button)
export const showDistance = (selectedList, map, isLocked) => {
  const functionList = [];
  const personList = [];
  const mainsetList = [];
  const roomList = [];

  selectedList.forEach(item => {
    if (item.options.group?.type === 'mainset') {
      mainsetList.push(item);
    }
    else if (item.options.options?.type === 'room') {
      roomList.push(item);
    }
    else {
      if (item.options.target?.type === 'person') {
        personList.push(item);
      }
      else if (item.options.target?.type === 'function') {
        functionList.push(item);
      }
    }
  });

  if (roomList.length > 1) {
    for (let i = 0; i < roomList.length - 1; i++) {
      for (let j = i + 1; j < roomList.length; j ++) {
        addStaticDistance(map, roomList[i]._latlng.lat, roomList[i]._latlng.lng, roomList[j]._latlng.lat, roomList[j]._latlng.lng, true, 'room-distance');
      }
    }
  }

  if (mainsetList.length > 1) {
    for (let i = 0; i < mainsetList.length - 1; i++) {
      for (let j = i + 1; j < mainsetList.length; j ++) {
        addStaticDistance(map, mainsetList[i]._latlng.lat, mainsetList[i]._latlng.lng, mainsetList[j]._latlng.lat, mainsetList[j]._latlng.lng, true, 'world-distance');
      }
    }
  }

  if (functionList.length > 1) {
    for (let i = 0; i < functionList.length - 1; i++) {
      for (let j = i + 1; j < functionList.length; j ++) {
        addStaticDistance(map, functionList[i]._latlng.lat, functionList[i]._latlng.lng, functionList[j]._latlng.lat, functionList[j]._latlng.lng, true, 'world-distance');
      }
    }
  }

  if (personList.length > 1) {
    for (let i = 0; i < personList.length - 1; i++) {
      for (let j = i + 1; j < personList.length; j ++) {
        addStaticDistance(map, personList[i]._latlng.lat, personList[i]._latlng.lng, personList[j]._latlng.lat, personList[j]._latlng.lng, true, 'world-distance');
      }
    }
  }

  removeTempList(selectedList);
}

// Group all selected items (Group button)
export const setupGroup = (selectedList, map, lat, lng, isLocked) => {
  let groupShape = 'rectangle';
  selectedList.forEach(item => {
    if (item.options.target?.type === 'person') {
      personSelected.push(item.options.target.index);
    }
    else {
      functionSelected.push(item.options.target);
    }
  });

  if (functionSelected.length > 0) {
    if (functionSelected.every(item => item.shape === 'circle')) {
      groupShape = 'circle'
    }
    else if (functionSelected.every(item => item.shape === 'ellipse')) {
      groupShape = 'ellipse'
    }
    
    L.marker([lat, lng], {
      draggable: !isLocked,
      group: {
        group: [...functionSelected],
        index: groupFnIndex[0],
        status: 'add',
      },
      icon: markerFnIcon(`${styles[groupShape + '-fn-group']} ${styles['group-fn-border']}`, `Group function ${groupFnIndex[0]}`)
    })
      .addTo(map)
      .bindPopup(e => {
        return groupFnLayoutPopupHTML(e.options.group.group);
      },
      { 
        className: `${styles[`group-${groupShape}`]} id-group-${groupFnIndex[0]}`, 
        offset: L.point(30, -12),
        autoClose: false,
        closeOnClick: false,
      })
      .on('contextmenu', e => groupPopup(map, e))
      .on('popupclose', e => e.target._icon?.classList.add(`${styles['group-fn-border']}`))
      .on('popupopen', e => e.target._icon?.classList.remove(`${styles['group-fn-border']}`))
      .openPopup();
  }

  if (personSelected.length > 0) {
    L.marker(
      [
        lat, 
        functionSelected.length > 0 ? lng + 10 : lng
      ],
      {
        draggable: !isLocked,
        group: {
          group: [...personSelected].sort(),
          index: groupPersonIndex[0],
          status: 'add',
        },
        icon: markerFnIcon(
          `${styles['rectangle-fn']} ${styles['group-fn-border']}`,
          `Group person ${groupPersonIndex[0]}`
        ),
      }
    )
      .addTo(map)
      .bindPopup(e => {
        return groupPersonLayoutPopupHTML(e.options.group.group)
      }, 
      {
        className: `${styles['group-rectangle']} id-group-${groupFnIndex[0]}`,
        offset: L.point(30, -12),
        autoClose: false,
        closeOnClick: false,
      })
      .on('contextmenu', e => groupPopup(map, e))
      .on('popupclose', e => e.target?._icon?.classList.add(`${styles['group-fn-border']}`))
      .on('popupopen', e => e.target?._icon?.classList.remove(`${styles['group-fn-border']}`))
  }

  if (functionSelected.length > 0) {
    groupFnIndex[0]++;
    functionSelected.splice(0, functionSelected.length);
  }

  if (personSelected.length > 0) {
    groupPersonIndex[0]++;
    personSelected.splice(0, personSelected.length);
  }

  selectedList.forEach(item => map.removeLayer(item));
  selectedList.splice(0, selectedList.length);
}

// Create main set from one function and one person (Main Set button)
export const setupMainSet = (selectedList, map, lat, lng, isLocked) => {
  selectedList.forEach(item => {
    if (item.options.target?.type === 'person') {
      personSelected.push(item.options.target.index);
    }
    else {
      functionSelected.push(item.options.target);
    }
  });

  if (personSelected.length === 1 && functionSelected.length === 1) {
    L.marker(
      [lat, lng], 
      {
        draggable: !isLocked,
        group: {
          group: [...functionSelected, ...personSelected],
          index: mainsetIndex[0],
          type: 'mainset',
          status: 'add',
        },
        icon: markerFnIcon(`${styles['rectangle-fn-group']} ${styles['fn--blue']}`, `Main Set ${mainsetIndex[0]}`)
      }
    )
      .addTo(map)
      .bindPopup(e => {
        return `${groupFnLayoutPopupHTML([e.options.group.group[0]])} ${groupPersonLayoutPopupHTML([e.options.group.group[1]])}`;
      },
      { 
        className: `${styles[`group-ellipse`]} id-mainset-${mainsetIndex[0]}`, 
        offset: L.point(30, -12),
        autoClose: false,
        closeOnClick: false,
      })
      .on('contextmenu', e => mainsetPopup(map, e))
      .on('click', e => addSelectedItem(e, map, isLocked))
      .on('popupclose', e => e.target._icon?.classList.add(`${styles['group-fn-border']}`))
      .on('popupopen', e => e.target._icon?.classList.remove(`${styles['group-fn-border']}`))
      .openPopup();

    mainsetIndex[0]++;
    functionSelected.splice(0, functionSelected.length);
    personSelected.splice(0, personSelected.length);

    selectedList.forEach(item => map.removeLayer(item));
    selectedList.splice(0, selectedList.length);
  }
}

// Main popup when use CTRL + left click
export const addSelectedItem = (event, map, isLocked) => {
  console.log(event.target);
  let restrictPopup = 0;
  event.originalEvent.stopPropagation();
  event.originalEvent.preventDefault();
  if (event.originalEvent.ctrlKey || event.originalEvent.metaKey) {
    const existedItemIndex = selectedList.findIndex(item => item === event.target);
    if (existedItemIndex === -1) {
      // Add item to list
      event.target._icon.classList.add('selected-icon');
      selectedList.push(event.target);
      if (event.target.options.group?.type === 'mainset' || event.target.options.options?.type === 'room') {
        restrictPopup = 1;
      }
    }
    else {
      selectedList[existedItemIndex]._icon.classList.remove('selected-icon');
      selectedList.splice(existedItemIndex, 1);
    };

    if (selectedList.length > 0) {
      wrappingPopup(map, event.latlng.lat, event.latlng.lng, isLocked, selectedList, restrictPopup);
    }
  }
}
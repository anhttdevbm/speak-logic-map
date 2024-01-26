/* eslint-disable react-hooks/exhaustive-deps */
import L from 'leaflet';
import * as turf from '@turf/turf';
import "leaflet-boundary-canvas";
import "leaflet-textpath";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { useGlobalStore, useCountryStore } from '@/providers/RootStoreProvider';
import { observer } from "mobx-react-lite";
import styles from '../_MapContents.module.scss';
import { getGeoMainLand } from '@/utils/get_geo_mainland';
import { 
  groupFnIndex, defaultFunction, defaultPerson, defaultFunctionPerson,
  markerProblemIndex, groupPersonIndex, markerPersonIndex, markerFnIndex, allLayer, markerCountryFnIndex, groupCountryFnIndex
} from '../Variables/Variables'

import { 
  markerCountryFnIcon,
  markerFnIcon, markerThreeDotsIcon 
} from '../Markers/MarkerIcons'
import { groupPopup, clearAllPopups } from '../Popups/Popups';
import { groupFnLayoutPopupHTML, groupPersonLayoutPopupHTML, countryModePopupHTML } from '../Popups/PopupHTMLs';
import { 
  addMarkerFn, addMarkerPerson, addSoluOrProbFn, 
  addMarkerCountryFn, addMarkerCountryGroupFn
} from '../Markers/AddMarkers';
import { popupWorld } from '../Markers/Markers';

let y = 1;
const countryFnMinWidth = 160;
const countryFnMinHeight = 80;
const countryFnFontSize = 14;
const countryFnMaxZoom = 16;
const alllayer = [];
const countryPopup = L.popup();
let isShowBlankMap = false;

const getScaleValue = (zoom) => {
  return Math.round(Math.pow(zoom - 1, 2) / 2.5);
}

const getCountryFnSize = (scaleValue) => {
  // if (scaleValue <= 1) {
  //   return [countryFnMinWidth, countryFnMinHeight];
  // }
  // return [countryFnMinWidth * scaleValue, countryFnMinHeight * scaleValue];
  return [countryFnMinWidth, countryFnMinHeight];
}

const CountryMode = ({ setModal, setModalType, setPopulateCountry, selectedData }) => {
  const globalStore = useGlobalStore();
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  map.on('zoomend', () => {
    setZoom(map.getZoom());
  });

  let cellSide;
  let geoJson;

  map.eachLayer(layer => {
    if (layer._container?.classList.contains('leaflet-popup')) {
      map.removeLayer(layer);
    }
  });
  
  const selectedCode = globalStore.searchCode ? globalStore.searchCode : globalStore.code;

  const data = selectedData[0];

  console.log(selectedData)

  geoJson = JSON.parse(JSON.stringify(data));

  const geoJsonMainLand = getGeoMainLand(data);

  console.log('geoJsonMainLand', geoJsonMainLand)

  const geoBounds = L.geoJSON(geoJsonMainLand).getBounds();

  console.log('geoBounds', geoBounds)

  const centroid = turf.centroid(geoJsonMainLand);

  centroid.geometry.coordinates.reverse();

  // Show Main land only
  if (globalStore.mainLand) {
    geoJson.feature = getGeoMainLand(data);
  }

  const extent = [
    geoBounds.getSouthWest().lat,
    geoBounds.getSouthWest().lng,
    geoBounds.getNorthEast().lat,
    geoBounds.getNorthEast().lng,
  ];

  if (selectedCode === 'USA') {
    cellSide = 300;
  }
  else {
    cellSide = 50;
  }

  const options = { units: 'miles' };

  window.handlePopulateFn = (object, input) => {
    const grid = turf.pointGrid(extent, cellSide, options);

    grid.features.reverse();
    
    let newPol = geoJsonMainLand.features[0].geometry.coordinates[0].map(item => [...item].reverse());

    // ------------------------------------------------------------------------------------

    let newGrid = grid.features.filter(item => 
      turf.booleanPointInPolygon(item.geometry.coordinates, turf.polygon([newPol]))
    );
    console.log("new grid: ", newGrid);

    let newArray = [];
    newGrid.forEach(item => {
      newArray.push(item.geometry.coordinates);
    });

    let result = newArray.reduce((prev, cur) => {
      prev[cur[0]] = prev[cur[0]] || [];
      prev[cur[0]].push(cur);
      return prev;
    }, {});

    const lengthItem = newArray.length;
    const newResult = Object.values(result);


    if (+input > lengthItem) {
      input = lengthItem - 1;
      L.marker(newResult[newResult.length - 1][0], {
        icon: markerThreeDotsIcon(),
      }).addTo(map);
    }

    for (let i in result) {
      result[i].reverse();
      result[i].forEach(item => {
        if (y <= +input && turf.booleanPointInPolygon(item, turf.polygon([newPol]))) {
          if (object === 'function-person') {
            if (y % 2 !== 0) {
              addMarkerPerson(map, item[0], item[1], markerPersonIndex[0], globalStore.lock, setModal, setModalType,
                  globalStore.setPersonToListMapElementSelected, globalStore.resetNumberPersonMobility,
                  globalStore.updateMapLayerById, globalStore.removeMapLayerById);
              markerPersonIndex[0]++;
            }
            else {
              addMarkerFn(map, item[0], item[1], markerFnIndex[0], globalStore.lock, setModal, setModalType, null,
                  null, null, globalStore.setShapeOfMarkerFn, globalStore.addMarkerProblemToList,
                  globalStore.setShapeOfMarkerPl, globalStore.removeMapLayerById);
              markerFnIndex[0]++;
            }
          }
          else {
            if (object === 'function') {
              addMarkerFn(map, item[0], item[1], markerFnIndex[0], globalStore.lock, setModal, setModalType, null,
                  null, null, globalStore.setShapeOfMarkerFn, globalStore.addMarkerProblemToList,
                  globalStore.setShapeOfMarkerPl, globalStore.removeMapLayerById);
              markerFnIndex[0]++;
            }
            else if (object === 'person') {
              addMarkerPerson(map, item[0], item[1], markerPersonIndex[0], globalStore.lock, setModal, setModalType,
                  globalStore.setPersonToListMapElementSelected, globalStore.resetNumberPersonMobility,
                  globalStore.updateMapLayerById, globalStore.removeMapLayerById);
              markerPersonIndex[0]++;
            }
          }
          y++;
        }
      });
    }
    y = 1;
    map.removeLayer(countryPopup);
  };

  // Show a single function inside a country
  window.handleShowSingleFunction = () => {
    map.setMaxZoom(countryFnMaxZoom);
    map.setZoom(2);
    // map.eachLayer(layer => {
    //   if (layer._icon?.classList.contains(styles['country-fn'])) {
    //     map.removeLayer(layer);
    //   }
    // });

    const size = getCountryFnSize(getScaleValue(zoom));

    addMarkerCountryFn(
      map, 
      centroid.geometry.coordinates[0], 
      centroid.geometry.coordinates[1],
      `Function ${markerCountryFnIndex[0]}`,
      selectedCode,
      globalStore.lock,
      size[0], 
      size[1],
      countryFnFontSize,
      setModal,
      setModalType,
      // countryFnFontSize * (zoom - 1),
    );
    markerCountryFnIndex[0]++;
    map.removeLayer(countryPopup);
  }
  
  // Show Group Function of a Country
  window.handleShowGroupFunction = () => {
    map.setMaxZoom(countryFnMaxZoom);
    map.setZoom(2);
    // map.eachLayer(layer => {
    //   if (layer._icon?.classList.contains(styles['country-fn'])) {
    //     map.removeLayer(layer);
    //   }
    // });
    
    for (let i = 0; i < Number(defaultFunction[0]); i++) {
      addMarkerFn(map, centroid.geometry.coordinates[0], centroid.geometry.coordinates[1] + i, i + 1, false,
          setModal, setModalType, `${selectedCode} ${i + 1}`, null, 'country-group', globalStore.setShapeOfMarkerFn,
          globalStore.addMarkerProblemToList, globalStore.setShapeOfMarkerPl, globalStore.removeMapLayerById);
    }
    let selectedCountryFn = [];
    let countryFns = [];
    map.eachLayer(layer => {
      if (layer._icon?.classList.contains('country-group')) {
        layer._icon.classList.add(styles['ellipse-fn']);
        layer._icon.classList.remove(styles['rectangle-fn']);
        layer.options.target.shape = 'ellipse';

        selectedCountryFn.push(layer);
      }
    })
    if (selectedCountryFn.length > 0) {
      selectedCountryFn.forEach(item => {
        countryFns.push(item.options.target);
      });

      const size = getCountryFnSize(getScaleValue(zoom));

      addMarkerCountryGroupFn(
        map, 
        centroid.geometry.coordinates[0], 
        centroid.geometry.coordinates[1],
        `Group Function ${groupCountryFnIndex[0]}`,
        selectedCode,
        countryFns,
        globalStore.lock,
        size[0], 
        size[1],
        countryFnFontSize,
        setModal,
        setModalType,
        // countryFnFontSize * (zoom - 1),
      );
      groupCountryFnIndex[0]++;
      selectedCountryFn.forEach(item => map.removeLayer(item));
    }
    map.removeLayer(countryPopup);
  }

  // Change the map to selected location only
  useEffect(() => {
    if (!globalStore.boatView && !globalStore.houseView &&
        !globalStore.roomView && !globalStore.floorPlanView &&
        !globalStore.tableView && !globalStore.rectangularView && !globalStore.moreName) {
      const makeEvent = (e) => {
        window.openPopulateModal = () => {
          setModal(true);
          setModalType('populate')
          setPopulateCountry(selectedCode);
        }
  
        window.makeGroupFromCountry = (type) => {
          L.marker([e.latlng.lat, e.latlng.lng], {
            draggable: !globalStore.lock,
            group: {
              group: [],
              index: type === "function" ? groupFnIndex[0] : groupPersonIndex[0],
              status: "add",
            },
            icon: markerFnIcon(
              `${styles["rectangle-fn"]} ${styles["group-fn-border"]}`,
              `${type === "function" ? "Group Function" : "Group Person"} ${
                type === "function" ? groupFnIndex[0] : groupPersonIndex[0]
              }`
            ),
          })
            .addTo(map)
            .bindPopup(
              (e) => {
                return type === "function"
                  ? groupFnLayoutPopupHTML(e.options.group.group)
                  : groupPersonLayoutPopupHTML(e.options.group.group);
              },
              {
                className: `${styles["group-rectangle"]} id-group-${groupFnIndex[0]}`,
                offset: L.point(30, -12),
                autoClose: false,
                closeOnClick: false,
              }
            )
            .on("contextmenu", (e) => groupPopup(map, e))
            .on("popupclose", (e) => e.target?._icon?.classList.add(`${styles["group-fn-border"]}`))
            .on("popupopen", (e) => e.target?._icon?.classList.remove(`${styles["group-fn-border"]}`))
            .openPopup();
  
          type === "function" ? groupFnIndex[0]++ : groupPersonIndex[0]++;
        }
        
        // Add single function 
        window.handleAddFunction = (event, name, index) => {
          event.preventDefault();
          event.stopPropagation();
  
          addMarkerFn(map, e.latlng.lat, e.latlng.lng, markerFnIndex[0], globalStore.lock, setModal, setModalType, name, index,
              null, globalStore.setShapeOfMarkerFn, globalStore.addMarkerProblemToList,
              globalStore.setShapeOfMarkerPl, globalStore.removeMapLayerById);
          
          if (index) index[0]++;
          else markerFnIndex[0]++;
  
          map.removeLayer(countryPopup);
        }
  
        // Add Solution/Problem
        window.handleAddProblem = (name) => {
          markerProblemIndex[0] = globalStore.listMarkerProblem.map(item => item.key).filter(x => x !== 'dot' && x !== 'plus').length + 1;
          globalStore.addMarkerProblemToList(markerProblemIndex[0]);
          globalStore.setMapLayer(e.latlng.lat, e.latlng.lng, 'Problem ' + markerFnIndex[0], 'problem');
          addSoluOrProbFn(map, e.latlng.lat, e.latlng.lng, globalStore.lock, markerProblemIndex[0], name, setModal, setModalType, globalStore.setShapeOfMarkerPl);

          markerProblemIndex[0]++;
          map.removeLayer(countryPopup);
        }
  
        // Country Mode Popup
  
        setTimeout(() => {
          clearAllPopups(map);
          countryPopup
          .setLatLng([e.latlng.lat, e.latlng.lng])
          .setContent(countryModePopupHTML())
          .addTo(map);
        }, 10);
      }
  
      // Add GeoJSON border
      const countryGeo = L.geoJSON(geoJson, {
        options: 'countryGeo',
        onEachFeature(feature, layer) {
          layer.on('contextmenu', makeEvent);
        },
        style: () => {
          return {
            radius: 8,
            fillColor: "#fff",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          };
        },
      });

      const countryGeoLand = L.geoJSON(geoJson, {
        options: 'countryGeo',
        onEachFeature(feature, layer) {
          layer.on('contextmenu', makeEvent);
        },
        style: () => {
          return {
            weight: 1,
            fillColor: '#fff',
            color: 'black',
          };
        },
      });
  
      // Cut GeoJSON country
      const countryLand = L.TileLayer.boundaryCanvas(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", 
        {
          options: 'countryLand',
          noWrap: true,
          boundary: geoJson,
          zIndex: 0,
          attribution: "Mile-2-23112022",
        }
      );
  
      if (!globalStore.blankMap) {
        countryLand.addTo(map);
        countryGeoLand.addTo(map);
      } else {
        countryGeo.addTo(map);
      }
      
      map.fitBounds(countryGeo.getBounds(), map.getZoom());
  
      return () => {
        countryGeo && map.removeLayer(countryGeo);
        countryLand && map.removeLayer(countryLand);
      }
    }
  }, [globalStore.code, globalStore.searchCode, globalStore.mainLand, globalStore.lock, globalStore.blankMap]);

  // Update the country function's size.
  // useEffect(() => {
  //   // console.log(zoom);
  //   map.eachLayer(layer => {
  //     if (layer.options.target?.type === 'country-function') {
  //       const size = getCountryFnSize(getScaleValue(zoom));
  //       const className = layer.options.icon?.options?.className;
  //       const name = layer._icon.innerText;
  //       layer.setIcon(
  //         markerCountryFnIcon(
  //           className, 
  //           name, 
  //           size[0],
  //           size[1],
  //           getScaleValue(zoom) > 1 ? countryFnFontSize * getScaleValue(zoom) : countryFnFontSize,
  //         )
  //       );
  //     }
  //   });
  // }, [zoom]);

  // Delete country function when change targeted country
  // useEffect(() => {
  //   map.eachLayer(layer => {
  //     if (layer.options.target?.type === 'country-function') {
  //       map.removeLayer(layer);
  //     }
  //   });
  // }, [globalStore.code, globalStore.searchCode]);

  return null;
}

export default observer(CountryMode);

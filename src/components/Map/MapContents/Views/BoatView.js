/* eslint-disable react-hooks/exhaustive-deps */
import L from 'leaflet';
import { observer } from 'mobx-react-lite';
import { useMap } from 'react-leaflet';
import { allLayer } from '../Variables/Variables';
import { useEffect, useState } from 'react';
import { useCountryStore, useGlobalStore } from '@/providers/RootStoreProvider';
import { markerBoatWorldIcon, markerRoomIcon, markerThreeDotsIcon } from '../Markers/MarkerIcons';
import styles from '../_MapContents.module.scss';
import { addMarkerFn, addStaticDistance, createFnMarker } from '../Markers/AddMarkers';
import { getGeoMainLand } from '@/utils/get_geo_mainland';
import * as turf from '@turf/turf';

import IMG_WORLD_FLAG from '@/assets/images/world-flag.png';
import IMG_WAVE from '@/assets/images/wave.png';
import { countryFlagList } from '@/utils/country_flag_list';

const BoatView = ({selectedData, setModal, setModalType}) => {
  const map = useMap();
  const globalStore = useGlobalStore();
  const countryStore = useCountryStore();
  const [boatFG, setBoatFG] = useState();
  const [bodyBoatLatLngsState, setBodyBoatLatLngState] = useState();

  const generateBoat = (boatType, centerLatLng, boat, boatName) => {
    const isWorldBoat = boatType === 'world';
    const bodyBoatWidthPX = isWorldBoat ? 600 : 300;
    const bodyBoatTopWidthPX = isWorldBoat ? bodyBoatWidthPX + 200 : bodyBoatWidthPX + 100;
    const bodyBoatHeightPX = isWorldBoat ? 250 : 125; 
    const poleBoatHeightPX = isWorldBoat ? 300 : 150;
    const flagBoatWidthPX = isWorldBoat ? 200 : 100;
    const flagBoatHeightPX = isWorldBoat ? 100 : 50;
    const boatNamePoint = isWorldBoat ? L.point(80, 0) : L.point(50, 0)
    
    // Get the 4 sides's latlngs of the boat's body
    const centerPoint = map.latLngToContainerPoint(centerLatLng); // Convert center latlng to point
    const topLeftPoint = centerPoint.subtract([bodyBoatTopWidthPX / 2, bodyBoatHeightPX / 2]); // Calculate the top left point
    const topRightPoint = centerPoint.subtract([(-bodyBoatTopWidthPX) / 2, (bodyBoatHeightPX) / 2])
    const bottomRightPoint = centerPoint.add([bodyBoatWidthPX / 2, bodyBoatHeightPX / 2]); // Calculate the bottom right point
    const bottomLeftPoint = centerPoint.add([-bodyBoatWidthPX / 2, bodyBoatHeightPX / 2]);
    const topLeftLatLng = map.containerPointToLatLng(topLeftPoint); // Convert top left point to lat lng
    const topRightLatLng = map.containerPointToLatLng(topRightPoint); // Convert top right point to lat lng
    const bottomRightLatLng = map.containerPointToLatLng(bottomRightPoint);  // Convert bottom right point to lat lng
    const bottomLeftLatLng = map.containerPointToLatLng(bottomLeftPoint);; // Convert botom left point to lat lng
    
    // Get the latlngs of the boat's pole
    const topBounds = L.latLngBounds(topLeftLatLng, topRightLatLng);
    const bottomPoleLatLng = topBounds.getCenter()
    const bottomPolePoint = map.latLngToContainerPoint(bottomPoleLatLng);
    const topPolePoint = bottomPolePoint.subtract([0, poleBoatHeightPX]);
    const topPoleLatLng = map.containerPointToLatLng(topPolePoint);

    // Get the latlngs of the boat's flag
    const topLeftFlagPoint = topPolePoint;
    const topRightFlagPoint = topLeftFlagPoint.add([flagBoatWidthPX, 0]);
    const bottomLeftFlagPoint = topLeftFlagPoint.add([0, flagBoatHeightPX]);
    const bottomRightFlagPoint = topLeftFlagPoint.add([flagBoatWidthPX, flagBoatHeightPX]);
    const topLeftFlagLatLng = map.containerPointToLatLng(topLeftFlagPoint); // Convert top left point to lat lng
    const topRightFlagLatLng = map.containerPointToLatLng(topRightFlagPoint); // Convert top right point to lat lng
    const bottomRightFlagLatLng = map.containerPointToLatLng(bottomRightFlagPoint);  // Convert bottom right point to lat lng
    const bottomLeftFlagLatLng = map.containerPointToLatLng(bottomLeftFlagPoint);; // Convert botom left point to lat lng

    // Get the latlngs of the wave
    const centerWavePoint = centerPoint.add([0, bodyBoatHeightPX])
    const topLeftWavePoint = centerWavePoint.subtract([bodyBoatTopWidthPX / 2, bodyBoatHeightPX ]); // Calculate the top left Wavepoint
    const topRightWavePoint = centerWavePoint.subtract([(-bodyBoatTopWidthPX) / 2, bodyBoatHeightPX ])
    const bottomRightWavePoint = centerWavePoint.add([bodyBoatTopWidthPX / 2, bodyBoatHeightPX ]); // Calculate the bottom right Wavepoint
    const bottomLeftWavePoint = centerWavePoint.add([-bodyBoatTopWidthPX / 2, bodyBoatHeightPX ]);
    console.log(centerWavePoint, topLeftWavePoint, topRightWavePoint, bottomRightWavePoint, bottomLeftWavePoint)
    const topLeftWaveLatLng = map.containerPointToLatLng(topLeftWavePoint); // Convert top left point to lat lng
    const topRightWaveLatLng = map.containerPointToLatLng(topRightWavePoint); // Convert top right point to lat lng
    const bottomRightWaveLatLng = map.containerPointToLatLng(bottomRightWavePoint);  // Convert bottom right point to lat lng
    const bottomLeftWaveLatLng = map.containerPointToLatLng(bottomLeftWavePoint);; // Convert botom left point to lat lng
    // Create a boat's body from an array of LatLng points
    const bodyBoatLatLngs = [[bottomLeftLatLng, topLeftLatLng, topRightLatLng, bottomRightLatLng]];
    const bodyBoatPolygon = L.polygon(bodyBoatLatLngs, {weight: 5, color: 'black', fillColor: 'transparent', className: 'boat-body'});
    bodyBoatPolygon.addTo(boat);
    setBodyBoatLatLngState(bodyBoatLatLngs);

    // Create a boat's pole 
    const poleBoatLatLngs = [[bottomPoleLatLng, topPoleLatLng],]
    const poleBoatLine = L.polyline(poleBoatLatLngs, {weight: 7, color: 'black'})
    poleBoatLine.addTo(boat);

    // Create a boat's flag
    const flagImgSrc = boatType === 'world' ? IMG_WORLD_FLAG.src : countryFlagList[boatType]
    const flagBoatLatLngs = [[bottomLeftFlagLatLng, topLeftFlagLatLng, topRightFlagLatLng, bottomRightFlagLatLng]];
    const flagBoatImg = L.imageOverlay(flagImgSrc, flagBoatLatLngs);
    flagBoatImg.addTo(boat).bringToBack();

    poleBoatLine.bindTooltip(boatName, {permanent: true, direction:"center", offset: boatNamePoint, className: styles['boat-name']});
    poleBoatLine.openTooltip()

    const waveLatLngs =  [[bottomLeftWaveLatLng, topLeftWaveLatLng, topRightWaveLatLng, bottomRightWaveLatLng]];
    const waveImg = L.imageOverlay(IMG_WAVE.src, waveLatLngs)

    waveImg.addTo(boat).bringToBack();

    // handle click on boat
    bodyBoatPolygon.on('click', (e) => {
      if (globalStore.click) {
        if (globalStore.addIcon === 'function') {
          handleAddFuncToBoat(e.latlng, boat, bodyBoatLatLngs);
        }
        else if (globalStore.addIcon !== '') {
          globalStore.addIconHandle('');
        }
      }
    });
  }

  const handleAddFuncToBoat = (latlng, boat, bodyBoatLatLngs) => {
    let count = 0
    boat.eachLayer(layer => {
      if (layer.options.target?.type === 'function') {
        count += 1;
      }
    });

    const markerFn = addMarkerFn(boat, latlng.lat, latlng.lng, count + 1, globalStore.lock, setModal, setModalType)
    globalStore.addIconHandle('');

    const turfPol = []; // Create a turf polygon coordinates array
    // Add coordinates of body boat to turf polygon array (turf array need lng before lat)
    bodyBoatLatLngs[0].forEach(latlng => turfPol.push([latlng.lng, latlng.lat])); 
    // Turf polygon need the last latlng to be exactly like the first
    turfPol.push([bodyBoatLatLngs[0][0].lng, bodyBoatLatLngs[0][0].lat]);

    let oldLatLng = markerFn._latlng;

    markerFn.on('dragstart', (e) => {
      oldLatLng = e.target._latlng;
    })
    
    markerFn.on('dragend', (e) => {
      if (!turf.booleanPointInPolygon(turf.point([e.target._latlng.lng, e.target._latlng.lat]), turf.polygon([turfPol]))) {
        e.target.setLatLng(oldLatLng);
      }
    })
  }

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

  // Trigger Boat View
  useEffect(() => {
    map.setZoom(2)
    let name = '';

    // Check room name option.
    if (globalStore.boatName === 'boat') {
      name = "Boat";
    }
    else if (globalStore.boatName === 'b') {
      name = 'B';
    }

    const boat = L.featureGroup();
    // Array contains all boats
    const countriesLayer = [];

    if (globalStore.countryQuantity > 0 && countryStore.countries.length === globalStore.countryQuantity) {
      
      if (globalStore.boatView === 'boat-world') {
        map.eachLayer(layer => {
          if (layer._arrowheads) {
            layer.remove();
          }
          allLayer.push(layer);
        });

        map.eachLayer(layer => map.removeLayer(layer));

        if (globalStore.map) {
          // Define the width and height in pixels
          const center = L.latLng(0, 0); // Center lat lng of boat
          generateBoat('world', center, boat, 'WORLD');
          boat.addTo(map);
          boat.options = {
            type: 'boat'
          };

          setBoatFG(boat)
          // zoom the map to the polygon
          map.fitBounds(boat.getBounds());
        }
      }
      else if (globalStore.boatView === 'boat-countries') {
        map.eachLayer(layer => {
          if (layer._arrowheads) {
            layer.remove();
          }
          allLayer.push(layer);
        });
  
        map.eachLayer(layer => map.removeLayer(layer));
        if (!globalStore.map) {
          const mainLand = getGeoMainLand(selectedData[0]);
          const center = turf.center(turf.points(mainLand.features[0].geometry.coordinates[0])).geometry.coordinates;
          center.reverse();
          const countryCode = selectedData[0].features[0].properties.CODE.toUpperCase()
          const boatName = name ? `${name}` : countryCode
          generateBoat(countryCode, center, boat, boatName);
          boat.addTo(map);
          boat.options = {
            type: 'boat'
          }
          setBoatFG(boat)
          // zoom the map to the polygon
          map.fitBounds(boat.getBounds());
        }
      }
      else if (globalStore.boatView === '') {
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
            }
            else {
              name = (layer.options.type === 'arc') ? 'Arc-route': 'Inter-route';
            }
  
            if (layer.options.type === 'line') {
              point1 = layer.getLatLngs()[0].lng;
              point2 = layer.getLatLngs()[1].lng;
            }
            else {
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
      map.removeLayer(boat);
      countriesLayer.forEach((layer) => {
        map.removeLayer(layer);
      });
    };
  }, [globalStore.map, globalStore.boatView, globalStore.boatName, selectedData]);

  useEffect(() => {
    // console.log("boatFG: ", boatFG)
    // console.log('bodyBoatLatLngsState: ',bodyBoatLatLngsState)
    if (!globalStore.click && boatFG && bodyBoatLatLngsState) {
      const boatBody = document.querySelector('.boat-body');
      boatBody.ondragover = (e) => e.preventDefault();

      boatBody.ondrop = (e) => {
        const latlng = map.containerPointToLatLng(L.point(e.layerX, e.layerY));

        if (globalStore.addIcon === 'function') {
          handleAddFuncToBoat(latlng, boatFG, bodyBoatLatLngsState)
        }
        else if (globalStore.addIcon !== '') {
          globalStore.addIconHandle('');
        }
      }
    }
  }, [globalStore.click, globalStore.addIcon])
  // 
  // useEffect(() => {
  //   if (globalStore.map && globalStore.boatView) {
  //     const boatList = [];
  //     map.eachLayer(layer => {
  //       // console.log(layer)
  //       if (layer.options.options?.type === 'boat') {
  //         boatList.push(layer);
  //       }
  //     })

  //     if (boatList.length > 1) {
  //       for (let i = 0; i < boatList.length - 1; i++) {
  //         for (let j = i + 1; j < boatList.length; j++) {
  //           setTimeout(() => {
  //             addStaticDistance(map, boatList[i]._latlng.lat, boatList[i]._latlng.lng, boatList[j]._latlng.lat, boatList[j]._latlng.lng, true, 'boat-distance')
  //           }, 1000)
  //         }
  //       }
  //     }
  //   }
  //   else {
  //     map.eachLayer(layer => {
  //       if (layer.options.options?.type === 'boat-distance') {
  //         map.removeLayer(layer.parentLine);
  //         map.removeLayer(layer.parentLine_1);
  //         map.removeLayer(layer.parentArc);
  //         if (layer.parentArcArrow) {
  //           map.removeLayer(layer.parentArcArrow);
  //         }
  //         if (layer.parentArcArrow_1) {
  //           map.removeLayer(layer.parentArcArrow_1);
  //         }
  //         map.removeLayer(layer);
  //       }
  //     })
  //   }
  // }, [globalStore.showRoomDistance, globalStore.map, globalStore.roomView])

  return null;
}

export default observer(BoatView)

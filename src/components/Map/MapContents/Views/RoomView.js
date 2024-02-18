/* eslint-disable react-hooks/exhaustive-deps */
import L from 'leaflet';
import { observer } from 'mobx-react-lite';
import { useMap } from 'react-leaflet';
import { allLayer } from '../Variables/Variables';
import { useEffect } from 'react';
import { useCountryStore, useGlobalStore } from '@/providers/RootStoreProvider';
import { markerRoomIcon } from '../Markers/MarkerIcons';
import styles from '../_MapContents.module.scss';
import { addStaticDistance } from '../Markers/AddMarkers';
import { getGeoMainLand } from '@/utils/get_geo_mainland';
import * as turf from '@turf/turf';
import { addSelectedItem } from '../Markers/HandleSelectItem';
import { roomPopup } from '../Popups/Popups';

const RoomView = ({selectedData}) => {
  const map = useMap();
  const globalStore = useGlobalStore();
  const countryStore = useCountryStore();

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

  // Trigger Room View
  useEffect(() => {
    let name = '';

    // Check room name option.
    if (globalStore.roomName === 'room') {
      name = "Room";
    }
    else if (globalStore.roomName === 'r') {
      name = 'R';
    }

    let world = {};
    // Array contains all rooms
    const countriesLayer = [];

    if (globalStore.countryQuantity > 0 && countryStore.countries.length === globalStore.countryQuantity) {
      if (globalStore.roomView === 'room-countries') {
        map.eachLayer(layer => map.removeLayer(layer));
        map.eachLayer(layer => {
          if (layer._arrowheads) {
            layer.remove();
          }
          allLayer.push(layer);
        });
  
        // map.eachLayer(layer => map.removeLayer(layer));
  
        if (globalStore.map) {
          countryStore.countries.forEach((country, index) => {
            if (!country.name.codeName.includes('-99')) {
              // Get the center coordinates in main land of each country
              const countryName = country.name.codeName.toUpperCase();
              const rName = `R ${index + 1}`;
              const roomName = `Room ${index + 1}`;
              const mainLand = getGeoMainLand(country.data[0]);
              const center = turf.center(turf.points(mainLand.features[0].geometry.coordinates[0])).geometry.coordinates;
              
              const countryMarker = L.marker(center.reverse(), {
                options: {
                  type: 'room',
                  codeName: countryName,
                  rName: rName,
                  roomName: roomName
                },
                icon: markerRoomIcon(
                  `${styles['room-icon']}`, 
                  name ? `${name} ${index + 1}` : countryName
                ),
              })
                .on('click', e => addSelectedItem(e, map, globalStore.lock))
                .on('contextmenu', (e) => roomPopup(map, e))
                .addTo(map);
      
              countriesLayer.push(countryMarker);
            }
          })
        }
        else {
          const mainLand = getGeoMainLand(selectedData[0]);
          const center = turf.center(turf.points(mainLand.features[0].geometry.coordinates[0])).geometry.coordinates;

          const countryMarker = L.marker(center.reverse(), {
            options: {
              type: 'room',
            },
            icon: markerRoomIcon(
              `${styles['room-icon']}`,
              name ? `${name}` : selectedData[0].features[0].properties.CODE.toUpperCase()),
          })
            .addTo(map);

          countriesLayer.push(countryMarker);
        }
      }
      else if (globalStore.roomView === '') {
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
      map.removeLayer(world);
      countriesLayer.forEach((layer) => {
        map.removeLayer(layer);
      });
    };
  }, [globalStore.map, globalStore.roomView, globalStore.roomName]);

  // 
  useEffect(() => {
    if (globalStore.showRoomDistance && globalStore.map && globalStore.roomView) {
      const roomList = [];
      map.eachLayer(layer => {
        // console.log(layer)
        if (layer.options.options?.type === 'room') {
          roomList.push(layer);
        }
      })

      if (roomList.length > 1) {
        for (let i = 0; i < roomList.length - 1; i++) {
          for (let j = i + 1; j < roomList.length; j++) {
            setTimeout(() => {
              addStaticDistance(map, roomList[i]._latlng.lat, roomList[i]._latlng.lng, roomList[j]._latlng.lat, roomList[j]._latlng.lng, true, 'room-distance')
            }, 0.001)
          }
        }
      }
    }
    else {
      map.eachLayer(layer => {
        if (layer.options.options?.type === 'room-distance') {
          map.removeLayer(layer.parentLine);
          map.removeLayer(layer.parentLine_1);
          map.removeLayer(layer.parentArc);
          if (layer.parentArcArrow) {
            map.removeLayer(layer.parentArcArrow);
          }
          if (layer.parentArcArrow_1) {
            map.removeLayer(layer.parentArcArrow_1);
          }
          map.removeLayer(layer);
        }
      })
    }
  }, [globalStore.showRoomDistance, globalStore.map, globalStore.roomView])

  return null;
}

export default observer(RoomView)

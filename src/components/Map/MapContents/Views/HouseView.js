/* eslint-disable react-hooks/exhaustive-deps */
import L from 'leaflet';
import { observer } from 'mobx-react';
import { useMap } from 'react-leaflet';
import { allLayer } from '../Variables/Variables';
import { useEffect, useState } from 'react';
import { useCountryStore, useGlobalStore } from '@/providers/RootStoreProvider';
import { markerHouseIconWithName, markerHouseWorldIcon } from '../Markers/MarkerIcons';
import { getGeoMainLand } from '@/utils/get_geo_mainland';
import * as turf from '@turf/turf';

const HouseView = ({selectedData}) => {
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

  useEffect(() => {
    let index = 1;
    let name;

    if (globalStore.countryName === 'location') {
      name = "Location";
    }
    else if (globalStore.countryName === 'l') {
      name = 'L';
    }

    let world = {};
    const countriesLayer = [];

    if (globalStore.countryQuantity > 0 && countryStore.countries.length === globalStore.countryQuantity) {
      if (globalStore.houseView === 'house-world' && globalStore.map) {
        map.eachLayer(layer => map.removeLayer(layer));

        map.eachLayer(layer => {
          if (layer._arrowheads) {
            layer.remove();
          }
          allLayer.push(layer);
        });

        world = L.marker([44.96479793033104, -6.416015625000001], {
          icon: markerHouseWorldIcon("1", "WORLD"),
        }).addTo(map);
        map.zoomOut(2);
      }
      
      else if (globalStore.houseView === 'house-countries') {
        map.eachLayer(layer => {
          if (layer._arrowheads) {
            layer.remove();
          }
          // allLayer.push(layer);
        });
  
        map.eachLayer(layer => map.removeLayer(layer));
        if (globalStore.map) {
          countryStore.countries.forEach(country => {
            if (!country.name.codeName.includes('-99')) {
              const mainLand = getGeoMainLand(country.data[0]);
              const center = turf.center(turf.points(mainLand.features[0].geometry.coordinates[0])).geometry.coordinates;
              const countryMarker = L.marker(center.reverse(), {
                icon: markerHouseIconWithName('1', name ? `${name} ${index}` : country.name.codeName.toUpperCase()),
              }).addTo(map);
      
              countriesLayer.push(countryMarker);
      
              if (name) {
                index++;
              }
            }
          })
        }
        else {
          const mainLandCountry = getGeoMainLand(selectedData[0]);
  
          const center = turf.center(turf.points(mainLandCountry.features[0].geometry.coordinates[0])).geometry.coordinates;
  
          const countryMarker = L.marker(center.reverse(), {
            icon: markerHouseIconWithName('1', name ? `${name} ${index}` : selectedData[0].features[0].properties.CODE.toUpperCase()),
          }).addTo(map);
  
          countriesLayer.push(countryMarker);
        }
      }
      
      else if (globalStore.houseView === '') {
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
  }, [countryStore.countries, globalStore.countryQuantity, globalStore.map, globalStore.houseView, globalStore.countryName, selectedData]);

  return null;
}

export default observer(HouseView);

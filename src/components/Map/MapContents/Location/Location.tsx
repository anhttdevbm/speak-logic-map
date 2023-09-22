/* eslint-disable react-hooks/exhaustive-deps */
import { useCountryStore, useGlobalStore } from '@/providers/RootStoreProvider';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react'
import { useMap } from 'react-leaflet';
import * as turf from "@turf/turf";
import ICON_LOCATION from '@/assets/icons/location-icon.png';
import L from "leaflet";
import { CountryData, CountryName } from '@/pages/api/countries';
import { getGeoMainLand } from '@/utils/get_geo_mainland';

interface Props {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Location: React.FC<Props> = ({setIsLoading}: Props): null => {
  const globalStore = useGlobalStore();
  const countryStore = useCountryStore();
  const [geoJsonData, setGeoJsonData] = useState<CountryData[]>([]);
  const map = useMap();

  const fetchCountryFromCoordinates = async(lat: number, lng: number) => {
    setIsLoading(true);
    const response = await fetch(`api/countries/findCountry?lat=${lat}&lng=${lng}`);
    const data = await response.json();
    const name = data as CountryName;
    globalStore.changeCode(name.codeName);
  }

  useEffect(() => {
    if (globalStore.code !== '' && globalStore.dfLocationCoordinates.length == 0 && countryStore.countries.length > 0) {
      let country = countryStore.countries.find(country => country.name.codeName === globalStore.code)
      if (country) {
        setGeoJsonData(country.data);
      }
    }
  }, [countryStore.countries, globalStore.code])

  useEffect(() => {
    if (geoJsonData.length > 0) {
      const tempCentroid = turf.centroid(getGeoMainLand(geoJsonData[0]));
      tempCentroid.geometry.coordinates.reverse();
      if (globalStore.code === 'VNM') {
        tempCentroid.geometry.coordinates[0] += 4;
        tempCentroid.geometry.coordinates[1] -= 1;
      }
      else if (globalStore.code === 'GBR') {
        tempCentroid.geometry.coordinates[1] += 2;
      }
      globalStore.changeDefaultCoordinates(tempCentroid.geometry.coordinates); 
      map.setZoom(2);
    }
  }, [geoJsonData])

  useEffect(() => {
    
    let location: L.Marker | undefined = undefined;
    if (globalStore.dfLocationCoordinates.length > 0) {
      setIsLoading(true);
      location = L.marker(globalStore.dfLocationCoordinates as L.LatLngExpression, {
        icon: L.icon({
          iconUrl: ICON_LOCATION.src,
          iconAnchor: [20, 30],
          // @ts-ignore
          options: 'location',
        }),
      });

      location.addTo(map);
      if (globalStore.code === '') {
        fetchCountryFromCoordinates(globalStore.dfLocationCoordinates[0], globalStore.dfLocationCoordinates[1])
      }
      else {
        setIsLoading(false);
      }
    }
  
    return () => {
      location && map.removeLayer(location);
    }
  }, [globalStore.dfLocationCoordinates]);

  return null;
}

export default observer(Location)
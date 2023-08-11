/* eslint-disable react-hooks/exhaustive-deps */
import { CountryData, CountryName } from '@/pages/api/countries';
import React, { memo, useEffect, useState } from 'react'
import InfoOnMap from '../InfoOnMap/InfoOnMap';
import Map from '../Map/Map';
import Pallet from '../Pallet/Pallet';
import SunMoon from '../SunMoon/SunMoon';
import RearTools from '../Tools/RearTools/RearTools';
import TopTools from '../Tools/TopTools/TopTools';
import styles from './_HomePage.module.scss';
import { useCountryStore, useGlobalStore } from '@/providers/RootStoreProvider';
import { observer } from 'mobx-react-lite';
import Error from 'next/error';
import LoadingMain from '../Loading/LoadingMain';
import { CountryStoreData } from '@/stores/CountryStore';

const HomePage: React.FC = (): JSX.Element => {
  const globalStore = useGlobalStore();
  const countryStore = useCountryStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [countryNameList, setCountryNameList] = useState<CountryName[]>([]);

  // Get name of countries from API
  const fetchAPICountryName = async() => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/countries`);
      const data = await response.json();
      const dt = data as CountryName[];
      setCountryNameList(dt);
    }
    catch {
      setIsLoading(false);
      setIsError(true)
    }
  }

  // Get GeoJSON data of all countries from API
  const fetchAPICountryData = async(countryNameList: CountryName[]) => {
    setIsLoading(true);
    try {
      for (const name of countryNameList) {
        const response = await fetch(`/api/countries/${name.codeName}`);
        const data = await response.json();
        const dt = data as CountryData[];
        // console.log(name, dt);
        countryStore.setCountryData(name, dt);
      }
      
      // const response = await fetch('/api/countries/all');
      // const data = await response.json();
      // const dt = data as CountryStoreData[];
      // countryStore.setAllCountryData(dt);
    }
    catch {
      setIsLoading(false);
      setIsError(true)
    }
  }

  // After loading home page, get all countries name first
  useEffect(() => {
    fetchAPICountryName();
  }, [])

  // After got the list of countries name, fetch GeoJSON data of all countries in that name list
  useEffect(() => {
    let timeout = setTimeout(() => {
      if (countryNameList.length > 0 && countryStore.countries.length === 0) {
        globalStore.setCountryQuantity(countryNameList.length);
        fetchAPICountryData(countryNameList);
      }
    }, 3000)
    
    return () => clearTimeout(timeout);
  }, [countryNameList])

  // Check the length of data in country store to see if the store has all required data
  // and disable loading page if the length is equal to the length of name list
  useEffect(() => {
    if (
      countryNameList.length > 0 && countryStore.countries.length > 0 &&
      countryNameList.length === countryStore.countries.length
    ) {
      setIsLoading(false);
    }
  }, [countryNameList, countryStore.countries])

  // Check if any view is on
  // useEffect(() => {
  //   if (globalStore.houseView || globalStore.roomView || globalStore.floorPlanView || globalStore.boatView) {
  //     globalStore.toggleView(true);
  //   }
  //   else {
  //     globalStore.toggleView(false);
  //   }
  // }, [globalStore.houseView, globalStore.roomView, globalStore.floorPlanView, globalStore.boatView]);

  return (
    <div className={styles['home-wrap']}>
      {
        isLoading
        ? (
          <LoadingMain />
        )
        : isError 
        ? (
          <Error statusCode={500} />
        )
        : (
          <>
            <TopTools />
            <div className={styles['home-content']}>
              <div className={styles['side-bar']}>
                <RearTools />
              </div>
              <div className={styles['map']}>
                <Map />
                <Pallet />
                <InfoOnMap />
                <SunMoon />
              </div>
            </div>
          </>
        )
      }
    </div>
  )
}

export default observer(HomePage)
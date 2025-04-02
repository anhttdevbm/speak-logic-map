/* eslint-disable react-hooks/exhaustive-deps */
import { CountryName } from '@/pages/api/countries';
import { useCountryStore, useGlobalStore } from '@/providers/RootStoreProvider';
import React, { useEffect, useState } from 'react';
import styles from './_ModalContents.module.scss';
import { getLocation } from '@/utils/get_geolocation';

interface Props {
  setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const DefaultLocationM: React.FC<Props> = ({setToggleModal}: Props): JSX.Element => {
  const globalStore = useGlobalStore();
  const countryStore = useCountryStore();
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<CountryName | undefined>()
  const [geoLocationResult, setGeoLocationResult] = useState<string>('');

  const closeModal = (): void => {
    setToggleModal(false);
  }

  const setGeoLocation = () => {
    setGeoLocationResult('');
    setSelectedLocation(undefined);
    getLocation(globalStore.changeCode, globalStore.changeDefaultCoordinates, setGeoLocationResult);
  }

  const handleChangeLocation = () => {
    if (selectedLocation) {
      globalStore.changeDefaultCoordinates([]);
      globalStore.changeCode(selectedLocation.codeName);
      setToggleModal(false);
    }
  }

  useEffect(() => {
    if (geoLocationResult === 'OK') {
      closeModal();
    }
  }, [geoLocationResult])

  return (
    <div className={`${styles['location-wrap']}`} onClick={e => e.stopPropagation()}>
      <div className={`${styles['header']}`}>
        <h3>Choose your location</h3>
      </div>
      <div className={`${styles['content']}`}>
        <div className={`${styles['input']}`}>
          <input 
            type='text' 
            value={inputValue} 
            disabled={countryStore.countries.length > 0 ? false : true}
            placeholder={countryStore.countries.length > 0 ? 'Enter your country' : 'Loading data...'}
            onChange={e => setInputValue(e.target.value)}
          />
        </div>
        {countryStore.countries.length > 0 && inputValue && (
            <div className={`${styles['suggestion']}`}>
              {countryStore.countries.map((country, index) => (
                `${country.name.fullName} (${country.name.codeName})`.includes(inputValue) && (
                  <button 
                    key={index} 
                    onClick={() => {
                      setInputValue('');
                      setSelectedLocation(country.name);
                    }}
                  >
                    {`${country.name.fullName} (${country.name.codeName})`}
                  </button>
                )
              ))}
            </div>
          )}
      </div>
      <div className={`${styles['footer']}`}>
        <div className={`${styles['message']}`}>
          <button 
            type='button'
            // className={`${selectedLocation ? null : styles['disable']}`}
            onClick={setGeoLocation}
          >
            Set Your Current Location
          </button>
          {selectedLocation 
            ? (
              <p>You selected: <span>{`${selectedLocation.fullName} (${selectedLocation.codeName})`}</span></p>
            )
            : geoLocationResult && geoLocationResult !== 'OK' &&
            (
              <p className={`${styles['error-msg']}`}>{geoLocationResult}</p>
            )
          }
          </div>
        <div className={`${styles['btns']}`}>
          <button 
            disabled={selectedLocation ? false : true} 
            className={`${selectedLocation ? null : styles['disable']}`}
            onClick={handleChangeLocation}
          >
            OK
          </button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default DefaultLocationM
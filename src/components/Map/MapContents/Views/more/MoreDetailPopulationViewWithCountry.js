import React, {useEffect, useState} from 'react';
import styles from './MoreDetail.module.scss'
import Image from "next/image";
import ICON_USER from "@/assets/icons/user-icon.png";
import {useCountryStore, useGlobalStore} from "@/providers/RootStoreProvider";
import {useMap} from "react-leaflet";
import * as turf from "@turf/turf";
import {selectedList} from "@/components/Map/MapContents/Variables/Variables";
import {CountryName} from "@/pages/api/countries";
import {DetailItemPopulationView} from "@/components/Map/MapContents/Views/more/MoreDetailPopulationView";

const MoreDetailPopulationViewWithCountry = () => {

    const globalStore = useGlobalStore();
    const countryStore = useCountryStore();

    const [data, setData] = useState([]);

    const countriesToMoveToTop = ["CAN", "USA", "MEX"];

    useEffect(() => {
        let result = []
        if (globalStore.mapLayer.length > 0) {
            for (let i = 0; i < globalStore.mapLayer.length; i++) {
                let personName = globalStore.mapLayer[i].name
                if (personName?.startsWith('Person')) {
                    let lat = globalStore.mapLayer[i].lat;
                    let lng = globalStore.mapLayer[i].lng;

                    const point = turf.point([Number(lng), Number(lat)]);
                    countryStore.countries.forEach(country => {
                        let countryName = country.name

                        if (country.data[0].features[0].geometry.type === "MultiPolygon") {
                            country.data[0].features[0].geometry.coordinates.forEach(coordinate => {
                                const polygon = turf.polygon(coordinate)
                                if (turf.booleanPointInPolygon(point, polygon)) {
                                    result.push({
                                        country: countryName,
                                        personName: personName
                                    })
                                }
                            })
                        } else {
                            const polygon = turf.polygon(country.data[0].features[0].geometry.coordinates);
                            if (turf.booleanPointInPolygon(point, polygon)) {
                                result.push({
                                    country: countryName,
                                    personName: personName
                                })
                            }
                        }
                    })
                }
            }

        }
        setData(countNumberPersonOfEachCountry(result))

        console.log('data', data, result)
    }, []);

    const countNumberPersonOfEachCountry = (result) => {
        const x = result.reduce((accumulator, item) => {
            const existingCountry = accumulator.find(entry => entry.country.codeName === item.country.codeName);

            if (existingCountry) {
                existingCountry.numberPerson += 1;
            } else {
                accumulator.push({
                    "country": {
                        "fullName": item.country.fullName,
                        "codeName": item.country.codeName
                    },
                    "numberPerson": 1
                });
            }

            return accumulator;
        }, []);

        // Sort the result array to move specific countries to the front
        return x.sort((a, b) => {
            if (countriesToMoveToTop.includes(a.country.codeName)) return -1;
            if (countriesToMoveToTop.includes(b.country.codeName)) return 1;
            return 0;
        });
    }

    return (
        <div className={styles.rectIcon}>
            {data.length > 0 &&
                <div className={styles.rowItem}>
                    {data.map(item => <DetailItemCountryView key={item.country.codeName} countryInfo={item}/>)}
                </div>
            }
        </div>
    );
};

export default MoreDetailPopulationViewWithCountry;

export const DetailItemCountryView = ({countryInfo}) => {
    return (
        <div className={styles.rectangularList}>
            {() => {
                let rows = [];
                for (let i = 0; i < countryInfo.numberPerson; i++) {
                    rows.push(<DetailItemPopulationViewNoName key={i}/>)
                }
            }}
        </div>
    );
};

export const DetailItemPopulationViewNoName = ({population}) => {
    return (
        <div className={styles.moreItemPopulationView}>
            <Image src={ICON_USER.src} alt="User" width="50" height="50"/>
        </div>
    );
};

import React, {useEffect, useRef, useState} from 'react';
import styles from './RectView.module.scss'
import ICON_HOUSE from "@/assets/icons/house-icon.png";
import Image from "next/image";
import {useGlobalStore} from "@/providers/RootStoreProvider";
import {GeoJSON, MapContainer, Rectangle, TileLayer} from "react-leaflet";
import {getGeoMainLand} from "@/utils/get_geo_mainland";
import L from "leaflet";
import * as turf from "@turf/turf";
import 'leaflet/dist/leaflet.css';

const RectHouse = ({listCountry}) => {
    const globalStore = useGlobalStore()
    return (
        <div className={styles.rectIcon}>
            <div className={styles.rectangularList}>
                {listCountry.map(item => <RectangularItem key={item.name.codeName} country={item}/>)}
                <div className={styles.divPlus}>
                    <button className={styles.plus} onClick={() => {
                        globalStore.toggleModalInsertCountry();
                    }}>
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RectHouse;

export const RectangularItem = ({country}) => {
    const globalStore = useGlobalStore();
    const type = globalStore.rectangularView;
    return (
        <>
            {type === 'rect-name' ?
                <div className={styles.rectangularItem}>
                    <p>x</p>
                    <p className={styles.markerRectHouseName}>{country.name.fullName}</p>
                </div>
                : type === 'rect-house' ?
                    <div className={styles.rectangularItem}>
                        <button className={styles.closeButton} onClick={() => {
                            globalStore.removeCountryToRect(country.name.codeName)
                        }}>x
                        </button>
                        <Image src={ICON_HOUSE.src} alt="House" width="50" height="50"/>
                        <p className={styles.markerRectHouseName}>{country.name.fullName}</p>
                    </div>
                    : type === 'rect-house-no-border' ? <div className={styles.rectangularItem}>
                            <Image src={ICON_HOUSE.src} alt="House" width="50" height="50"/>
                            <p className={styles.markerRectHouseName}>{country.name.fullName}</p>
                        </div>
                        : <div className={styles.rectangularItem}>
                            <MapInRect country={country}/>
                            <p className={styles.markerRectHouseName}>{country.name.fullName}</p>
                        </div>
            }
        </>
    );
};

export const MapInRect = ({country}) => {

    const mapRef = useRef(null);

    const geoJsonMainLand = getGeoMainLand(country.data[0]);
    const center = turf.center(turf.points(geoJsonMainLand.features[0].geometry.coordinates[0])).geometry.coordinates;
    console.log('center', center)

    // useEffect(() => {
    //     console.log('effect', mapRef)
    //     if (mapRef && mapRef.current) {
    //         const map = mapRef.current;
    //
    //         // map.dragging.disable();
    //         // map.touchZoom.disable();
    //         // map.doubleClickZoom.disable();
    //         // map.scrollWheelZoom.disable();
    //         // map.eachLayer((layer) => {
    //         //     if (layer._arrowheads) {
    //         //         layer.remove();
    //         //     }
    //         // });
    //         //
    //         // map.eachLayer((layer) => map.removeLayer(layer));
    //         // console.log('geoJsonMainLand', geoJsonMainLand)
    //
    //         // Add your GeoJSON layer
    //         L.geoJSON(geoJsonMainLand).setStyle({color:'blue', weight: 2, fillColor: 'transparent'}).addTo(map);
    //         L.marker(center).addTo(map);
    //     }
    // }, []);

    // return (
    //     <MapContainer
    //         attributionControl={false}
    //         center={center}
    //         zoom={2}
    //         zoomControl={false}
    //         style={{ height: "100px", width: "100%" }}
    //         ref={mapRef}
    //     >
    //         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    //         {/*<GeoJSON data={geoJsonMainLand} style={{fillColor: 'transparent', color: 'blue', weight: 2}}/>*/}
    //     </MapContainer>
    // );

    //[
    //     -98.3110372410544,
    //     56.83561411850012
    // ]

    return (
        <MapContainer
            center={[0, 0]} // Initial map center coordinates
            zoom={1} // Initial zoom level
            style={{height: '80%', width: '100%'}}
            zoomControl={false}
            attributionControl={false}
            ref={mapRef}
        >
            {/* Add a TileLayer for the basemap */}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON data={geoJsonMainLand} style={{fillColor: 'transparent', color: 'blue', weight: 2}}/>
        </MapContainer>
    );
}

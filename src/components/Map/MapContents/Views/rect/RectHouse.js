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
import {Col, Row} from "antd";

const RectHouse = ({listCountry}) => {
    const globalStore = useGlobalStore()
    return (
        <div className={styles.rectIcon}>
            <Row>
                {listCountry.map((item, index) =>
                    <Col className={styles.rowItem} span={4} key={index}>
                        <RectangularItem key={item.name.codeName} country={item}/>
                    </Col>)
                }
                <Col span={4} className={styles.rowItem}>
                    <button className={styles.plus} onClick={() => {
                        globalStore.toggleModalInsertCountry();
                    }}>
                        +
                    </button>
                </Col>
            </Row>
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

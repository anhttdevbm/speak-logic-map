import React, {useEffect, useRef, useState} from 'react';
import styles from './RectView.module.scss'
import ICON_HOUSE from "@/assets/icons/house-icon.png";
import Image from "next/image";
import {useCountryStore, useGlobalStore} from "@/providers/RootStoreProvider";
import {GeoJSON, MapContainer, Marker, Polygon, Rectangle, TileLayer} from "react-leaflet";
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
                    <button className={styles.closeButton} onClick={() => {
                        globalStore.removeCountryToRect(country.name.codeName)
                    }}>x
                    </button>
                    <p className={styles.styleText}>{country.name.fullName}</p>
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
                        : <div className={styles.rectangularMapItem}>
                            <MapInRect country={country}/>
                            <p className={styles.markerRectHouseName}>{country.name.fullName}</p>
                        </div>
            }
        </>
    );
};

export const MapInRect = ({country}) => {

    const mapRef = useRef(null);
    let coordinates = country.data[0].features[0].geometry.coordinates;

    const geoJsonMainLand = getGeoMainLand(country.data[0]);
    const center = turf.center(turf.points(geoJsonMainLand.features[0].geometry.coordinates[0])).geometry.coordinates;

    console.log('center', center)

    const handleZoomEnd = (e) => {
        const z = e.target._zoom;
        console.log('zoom', z);
    };

    return (
        <MapContainer
            center={center} // Initial map center coordinates
            zoom={0} // Initial zoom level
            style={{backgroundColor: "white", width: "100%", height: "100%"}}
            zoomControl={false}
            attributionControl={false}
            onzoomend={handleZoomEnd}
            scrollWheelZoom={true}
            ref={mapRef}
        >
            {/* Add a TileLayer for the basemap */}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {coordinates.map((item, index) => <Polygon key={index} positions={item} color={'black'}/>)}
            {/*<Marker position={center}></Marker>*/}

        </MapContainer>
    );
}

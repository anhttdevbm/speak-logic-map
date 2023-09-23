import React, {useEffect, useState} from 'react';
import L from "leaflet";

const RectMap = ({selectedData, globalStore}) => {
    useEffect(() => {
        // Create a Leaflet map
        const map = L.map('custom-map').setView([51.505, -0.09], 13);

        // Add a tile layer (you can replace this with your preferred map layer)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);
    }, []);

    return (
        <div>
            <div id="custom-map" style={{ width: '100%', height: '80px' }}></div>
        </div>
    );
};

export default RectMap;

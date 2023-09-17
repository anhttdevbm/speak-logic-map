import React from 'react';
import { MapContainer, TileLayer, Rectangle } from 'react-leaflet';


const MyRectangle = () => {
    const rectangleBounds = [
        [51.5, -0.15], // Southwest coordinates
        [51.55, -0.1], // Northeast coordinates
    ];

    return <Rectangle bounds={rectangleBounds} />;
};

const CustomDivRectangle = () => {
    const divStyle = {
        position: 'absolute',
        top: 'calc(50% - 75px)', // Adjust these values based on your desired position
        left: 'calc(50% - 100px)', // Adjust these values based on your desired position
        width: '200px', // Adjust these values based on the rectangle's size
        height: '150px', // Adjust these values based on the rectangle's size
        backgroundColor: 'rgba(255, 0, 0, 0.5)', // Red with 50% opacity
        border: '2px solid red',
        borderRadius: '5px',
    };

    return <div style={divStyle}></div>;
};


const MapWithCustomContent = () => {
    return (
        <MapContainer
            center={[51.525, -0.125]}
            zoom={13}
            style={{ height: '400px', width: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MyRectangle />
            <CustomDivRectangle />
        </MapContainer>
    );
};

export default MapWithCustomContent;

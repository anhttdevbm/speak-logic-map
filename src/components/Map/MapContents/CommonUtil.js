import L from "leaflet";

export const findLastPoint = (point1, point2, point3) => {
    let pointA = map.latLngToContainerPoint(point1);
    let pointB = map.latLngToContainerPoint(point2);
    let pointC = map.latLngToContainerPoint(point3);
    let vectorAB = {x: pointB.x - pointA.x, y: pointB.y - pointA.y};
    let pointD = {x: pointC.x + vectorAB.x, y: pointC.y + vectorAB.y};
    return map.containerPointToLatLng(pointD);
}

export function computeDistanceBetweenTwoPoint(lat1, lng1, lat2, lng2) {
    const R = 6371000; // Radius of the earth in m
    const dLat = toRadians(lat2 - lat1); // deg2rad below
    const dLon = toRadians(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export const toRadians = (degrees) => {
    return (degrees * Math.PI) / 180;
};

export const checkBoundContainMarker = (bound, lat, lng) => {
    let pointToCheck = L.latLng(lat, lng);
    return bound.contains(pointToCheck);
}

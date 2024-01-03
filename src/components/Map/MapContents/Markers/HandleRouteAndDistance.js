import {unitDistance} from "@/components/Map/MapContents/Variables/Variables";

export const arcRouteInit = (lat, lng) => {
  const thetaOffset = Math.PI / 9;
  const latlng1 = [lat, lng];
  const latlng2 = [lat, lng + 10];
  const offsetX = latlng2[1] - latlng1[1];
  const offsetY = latlng2[0] - latlng1[0];
  const r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
  const theta = Math.atan2(offsetX, offsetY);
  const r2 = r / 2 / Math.cos(thetaOffset);
  const theta2 = theta + thetaOffset;
  const midpointX = r2 * Math.cos(theta2) + latlng1[1];
  const midpointY = r2 * Math.sin(theta2) + latlng1[0];

  const midpointLatLng = [midpointX, midpointY];
  const pathOptions = {
    color: 'transparent',
    weight: 3,
    type: 'arc',
    status: 'add',
  };

  return {latlng1, latlng2, midpointLatLng, pathOptions};
}

export const staticArcRouteInit = (lat1, lng1, lat2, lng2) => {
  const thetaOffset = Math.PI / 9;
  const latlng1 = [lat1, lng1];
  const latlng2 = [lat2, lng2];
  const offsetX = latlng2[1] - latlng1[1];
  const offsetY = latlng2[0] - latlng1[0];
  const r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
  const theta = Math.atan2(offsetX, offsetY);
  const r2 = r / 2 / Math.cos(thetaOffset);
  const theta2 = theta + thetaOffset;
  const midpointX = r2 * Math.cos(theta2) + latlng1[1];
  const midpointY = r2 * Math.sin(theta2) + latlng1[0];

  const midpointLatLng = [midpointX, midpointY];
  const pathOptions = {
    color: 'transparent',
    weight: 3,
    type: 'arc',
    status: 'add',
  };

  return {latlng1, latlng2, midpointLatLng, pathOptions};
}


export const resetAllColor = (layer) => {
  if (layer.options.type === 'distance') {
    if (layer.parentLine.options.color === 'blue') {
      layer.parentLine.setStyle({ color: "black" });
    }
    if (layer.parentArc.options.color === "blue") {
      layer.parentArc.setStyle({ color: "black" });
    }
  }
}

export function dragStartHandler(map, e) {
  map.eachLayer((layer) => {
    resetAllColor(layer);
  });

  if (e.target.parentLine.options.color === "black") {
    e.target.parentLine.setStyle({ color: "blue" });
  }
  if (e.target.parentArc.options.color === "black") {
    e.target.parentArc.setStyle({ color: "blue" });
  }
  //------------------
  const polyline = e.target.parentLine;
  const polyline_1 = e.target.parentLine_1;
  const polyArc = e.target.parentArc;

  const latlngMarker = e.target.getLatLng();

  const latlngPolyArc = polyArc.getLatLngs();
  for (let i = 0; i < latlngPolyArc.length; i++) {
    if (
      Array.isArray(latlngPolyArc[i]) &&
      latlngMarker.equals(latlngPolyArc[i])
    ) {
      e.target.polyArcLatlng = i;
    }
  }

  const latlngPolyLine = polyline.getLatLngs();
  for (let i = 0; i < latlngPolyLine.length; i++) {
    if (latlngMarker.equals(latlngPolyLine[i])) {
      e.target.polylineLatlng = i;
    }
  }

  const latlngPolyLine_1 = polyline_1.getLatLngs();
  for (let i = 0; i < latlngPolyLine.length; i++) {
    if (latlngMarker.equals(latlngPolyLine_1[i])) {
      e.target.polylineLatlng_1 = i;
    }
  }
}

export function dragHandlerLine(map, e) {
  let setText = e.target.parentLine.setText.bind(e.target.parentLine);
  let text = e.target.parentLine._text;

  // If line is hidden
  if (e.target.parentLine.options.color === "transparent") {
    setText = e.target.parentArc.setText.bind(e.target.parentArc);
    text = e.target.parentArc._text;
  }

  // Calculate angle
  const polyline = e.target.parentLine;
  const polyline_1 = e.target.parentLine_1;
  const polyArc = e.target.parentArc;

  const thetaOffset = Math.PI / 9;
  const thetaOffsetRev = Math.PI / -9;

  const latlngMarker = e.target.getLatLng();

  const tempLatlngPolyline = polyline.getLatLngs();
  const latlngPolyArc = polyArc.getLatLngs();

  let thetaOffsetData = tempLatlngPolyline[1].lng < tempLatlngPolyline[0].lng ? thetaOffsetRev : thetaOffset;
  
  const latlng1 = latlngPolyArc[1];
  const latlng2 = latlngPolyArc[4];

  const offsetX = latlng2[1] - latlng1[1];
  const offsetY = latlng2[0] - latlng1[0];

  const r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
  const theta = Math.atan2(offsetY, offsetX);
  
  const r2 = r / 2 / Math.cos(thetaOffsetData);
  const theta2 = theta + thetaOffsetData;
  
  const midPointX = r2 * Math.cos(theta2) + latlng1[1];
  const midPointY = r2 * Math.sin(theta2) + latlng1[0];
  const midpointLatLng = [midPointY, midPointX];

  latlngPolyArc.splice(e.target.polyArcLatlng, 1, [latlngMarker.lat, latlngMarker.lng]);

  latlngPolyArc.splice(3, 1, midpointLatLng);
  polyArc.setLatLngs(latlngPolyArc);

  // Arc arrow rotate
  const point = polyArc.trace([0, 0.1, 0.9, 1]);
  if (e.target.parentArcArrow && e.target.polyArcLatlng === 1) {
    e.target.parentArcArrow.setLatLngs([[point[1].lat, point[1].lng], latlngMarker]);
    e.target.parentArcArrow_1.setLatLngs([[point[2].lat, point[2].lng], [point[3].lat, point[3].lng]]);
  }
  else if (e.target.parentArcArrow_1 && e.target.polyArcLatlng === 4) {
    e.target.parentArcArrow_1.setLatLngs([[point[2].lat, point[2].lng],latlngMarker]);
    e.target.parentArcArrow.setLatLngs([[point[1].lat, point[1].lng],[point[0].lat, point[0].lng]]);
  }

  // Set line
  const latlngPolyline = polyline.getLatLngs();
  const latlngPolyline_1 = polyline_1.getLatLngs();
  latlngPolyline.splice(e.target.polylineLatlng, 1, latlngMarker);
  latlngPolyline_1.splice(e.target.polylineLatlng_1, 1, latlngMarker);
  
  polyline.setLatLngs(latlngPolyline);
  polyline_1.setLatLngs(latlngPolyline_1);

  let orientation = tempLatlngPolyline[1].lng < tempLatlngPolyline[0].lng ? 180 : 0;

  const distance = map.distance(
    L.latLng(tempLatlngPolyline[0].lat, tempLatlngPolyline[0].lng),
    L.latLng(tempLatlngPolyline[1].lat, tempLatlngPolyline[1].lng)
  );

  let customText = (text === 'Inter-route' || text === 'Arc-route' || text === 'Distance')
    ? text 
    : (unitDistance[0] === 'mile' ? `${(distance * 0.001 * 0.6214).toFixed()} ${unitDistance[0]}` : `${(distance * 0.001).toFixed()} ${unitDistance[0]}`);

  setText(null);
  setText(customText, {
    center: true,
    offset: -3,
    orientation: orientation,
  });
}

export function dragEndHandler(map) {
  delete map.polylineLatlng;
  delete map.polylineLatlng_1;
  delete map.polyArcLatlng;
}

export function clickLine(map, e, distancePoint, distancePoint2, name) {
  if (e.target.options.color !== 'transparent') {
    map.eachLayer(layer => {
      resetAllColor(layer);
    });
  
    e.target.setStyle({ color: 'blue' });
  
    const latLng = e.target.getLatLngs();
    const distance = map.distance(
      L.latLng(latLng[0].lat, latLng[0].lng),
      L.latLng(latLng[1].lat, latLng[1].lng)
    );

    let customText = (e.target._text === name)
      ? (unitDistance[0] === 'mile' ? `${(distance * 0.001 * 0.6214).toFixed()} ${unitDistance[0]}` : `${(distance * 0.001).toFixed()} ${unitDistance[0]}`)
      : name;
    
    let orientation = (distancePoint.getLatLng().lng < distancePoint2.getLatLng().lng) ? 0 : 180;
  
    e.target.setText(null);
    e.target.setText(customText, {
      center: true,
      offset: -3,
      orientation: orientation,
    });
  }
}

export function clickArc(map, e, distancePoint, distancePoint2, name) {
  if (e.target.options.color !== 'transparent') {
    map.eachLayer(layer => {
      resetAllColor(layer);
    });
  
    e.target.setStyle({ color: 'blue' }); 
  
    const latLng = distancePoint.parentLine.getLatLngs();
    const distance = map.distance(
      L.latLng(latLng[0].lat, latLng[0].lng),
      L.latLng(latLng[1].lat, latLng[1].lng)
    );

    let customText = (distancePoint.parentArc._text === name)
      ? (unitDistance[0] === 'mile' ? `${(distance * 0.001 * 0.6214).toFixed()} ${unitDistance[0]}` : `${(distance * 0.001).toFixed()} ${unitDistance[0]}`)
      : name;
    
    let orientation = (distancePoint.getLatLng().lng < distancePoint2.getLatLng().lng) ? 0 : 180;
  
    distancePoint.parentArc.setText(null);
    distancePoint.parentArc.setText(customText, {
      center: true,
      offset: -3,
      orientation: orientation,
    });
  }
}

export function clickArrow(map, distancePoint) {
  map.eachLayer(layer => {
    resetAllColor(layer);
  });

  if (distancePoint.parentLine.options.color === "black") {
    distancePoint.parentLine.setStyle({ color: "blue" });
  }
  if (distancePoint.parentArc.options.color === "black") {
    distancePoint.parentArc.setStyle({ color: 'blue' });
  }
}

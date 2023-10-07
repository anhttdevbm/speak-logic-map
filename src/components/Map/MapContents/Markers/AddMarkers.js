import L from 'leaflet';
import { toggleBoundaryFn } from './Markers';
import { addSelectedItem } from './HandleSelectItem';
import {
  markerPersonIcon, markerHouseIcon, markerNavigationSignIcon,
  markerFnIcon, markerDistancePointIcon, markerCountryFnIcon, markerMapElementIcon, markerRelateIcon, markerGivenSetIcon
} from './MarkerIcons';
import styles from '../_MapContents.module.scss';
import {
  groupPopup,
  functionPopup,
  routePopup,
  distancePopup,
  fnProblemPopup,
  fnCountryPopup,
  stopFnPopup,
  tempFnPopup,
  personPopup,
  mapElementPopup, givenSetPopup
} from '../Popups/Popups';
import { 
  groupFnLayoutPopupHTML, groupPersonLayoutPopupHTML, wrappingPopupHTML, 
  worldPopupHTML, housePopupHTML, welcomeSignPopupHTML
} from '../Popups/PopupHTMLs'

import { dragStartHandler, dragHandlerLine, dragEndHandler, arcRouteInit, 
  clickLine, clickArc, clickArrow, staticArcRouteInit 
} from './HandleRouteAndDistance';

export const addMarkerPerson = (map, lat, lng, index, isLocked, setModal, setModalType, setMapElementRelate, setMapElementSelected, setPositionOfMapElementSelected) => {
  let marker = L.marker([lat, lng], {
    target: {
      type: 'person',
      index: index,
      status: 'add',
    },
    draggable: !isLocked,
    icon: markerPersonIcon(styles['person'], `Person ${index}`)
  })
    .on('contextmenu', e => personPopup(map, marker, setModal, setModalType, isLocked, e, setMapElementRelate, setMapElementSelected, setPositionOfMapElementSelected))
    .on('click', e => addSelectedItem(e, map, isLocked))
    .addTo(map);
}


export const addMarkerFn = (container, lat, lng, index, isLocked, setModal, setModalType, name, customIndex, customClass,
                            setShapeOfMarkerFn, addMarkerProblemToList, setShapeOfMarkerPl) => {
  const fnMarker = L.marker([lat, lng], {
    target: {
      type: 'function',
      shape: 'rectangle',
      index: index,
      status: 'add',
    },
    icon: markerFnIcon(
      `${styles['rectangle-fn']} ${styles['fn--black']} ${customClass}`,
      `${name && customIndex ? `${name} ${customIndex[0]}` : (name ? `${name}` : `Function ${index}`)}` 
    ),
    draggable: !isLocked,
  })
    .on('contextmenu', e => functionPopup(container, setModal, setModalType, isLocked, e, setShapeOfMarkerFn, addMarkerProblemToList, setShapeOfMarkerPl))
    .on('click', e => addSelectedItem(e, container, isLocked))
    // .on('dblclick', e => toggleBoundaryFn(e))
    .addTo(container);

  return fnMarker;
}

export const addMarkerFnEllipse = (container, lat, lng, index, isLocked, setModal, setModalType, name, customIndex, customClass,
                                   setShapeOfMarkerFn, addMarkerProblemToList, setShapeOfMarkerPl) => {
  // console.log(lat, lng);
  const fnMarker = L.marker([lat, lng], {
    target: {
      type: 'function',
      shape: 'ellipse',
      index: index,
      status: 'add',
    },
    icon: markerFnIcon(
        `${styles['ellipse-fn']} ${styles['fn--black']} ${customClass}`,
        `${name && customIndex ? `${name} ${customIndex[0]}` : (name ? `${name}` : `Function ${index}`)}`
    ),
    draggable: !isLocked,
  })
      .on('contextmenu', e => functionPopup(container, setModal, setModalType, isLocked, e, setShapeOfMarkerFn, addMarkerProblemToList, setShapeOfMarkerPl))
      .on('click', e => addSelectedItem(e, container, isLocked))
      // .on('dblclick', e => toggleBoundaryFn(e))
      .addTo(container);

  return fnMarker;
}

export const addMarkerCountryFn = (map, lat, lng, name, countryName, isLocked, width = 200, height = 100, fontSize = 16, setModal, setModalType) => {
  L.marker([lat, lng], {
    target: {
      type: 'country-function',
      shape: 'ellipse',
      status: 'add',
    },
    icon: markerCountryFnIcon(
      `${styles['ellipse-fn']} ${styles['country-fn']} ${styles['fn--black']}`,
      countryName,
      name,
      width,
      height,
      fontSize,
    ),
    draggable: !isLocked,
  })
    .on('contextmenu', e => fnCountryPopup(map, e, setModal, setModalType))
    .addTo(map);
}

export const addMarkerCountryGroupFn = (map, lat, lng, name, countryName, group, isLocked, width = 200, height = 100, fontSize = 16, setModal, setModalType) => {
  L.marker([lat, lng], {
    draggable: !isLocked,
    target: {
      type: 'country-function',
    },
    group: {
      group: [...group],
      status: "add",
    },
    icon: markerCountryFnIcon(
      `${styles["ellipse-fn"]} ${styles["group-fn-border"]} ${styles['country-fn']}`,
      name,
      countryName,
      width,
      height,
      fontSize,
    ),
  })
    .addTo(map)
    .bindPopup(
      (e) => groupFnLayoutPopupHTML(e.options.group.group),
      {
        className: `${styles["group-ellipse"]}`,
        offset: L.point(30, -12),
        autoClose: false,
        closeOnClick: false,
      }
    )
    .on("contextmenu", (e) => fnCountryPopup(map, e, setModal, setModalType))
    .on("popupclose", (e) => e.target?._icon?.classList.add(`${styles["group-fn-border"]}`))
    .on("popupopen", (e) => e.target?._icon?.classList.remove(`${styles["group-fn-border"]}`))
    .openPopup();
}

export const addMarkerWelcomeSign = (map, lat, lng, isLocked) => {
  L.marker([lat, lng], {
    target: { status: 'add' },
    icon: markerNavigationSignIcon(),
    draggable: !isLocked,
  })
    .on('contextmenu', e => {
      const welcomePopup = L.popup()
        .setLatLng([lat, lng])
        .setContent(welcomeSignPopupHTML())
        .addTo(map);

      window.deleteWelcome = () => {
        map.removeLayer(e.target);
        map.removeLayer(welcomePopup);
      }
    })
    .addTo(map)
}

export const addHouseMarker = (map, lat, lng, isLocked) => {
  L.marker([lat, lng], {
    target: { status: 'add' },
    icon: markerHouseIcon(),
    draggable: !isLocked,
  })
    .on('contextmenu', e => {
      const housePopup = L.popup()
        .setLatLng([lat, lng])
        .setContent(housePopupHTML())
        .addTo(map);

      window.deleteHouse = () => {
        map.removeLayer(e.target);
        map.removeLayer(housePopup);
      }
    })
    .addTo(map)
}

export const addSoluOrProbFn = (map, lat, lng, isLocked, index, name, setModal, setModalType, setShapeOfMarkerPl) => {
  const formattedName = String(name).toLowerCase();
  const first = formattedName[0].toUpperCase();
  const remain = formattedName.slice(1, formattedName.length);

  L.marker([lat, lng], {
    draggable: !isLocked,
    type: {index: index, title: 'problem', status: 'add'},
    icon: markerFnIcon(
      `${styles['rectangle-fn']} ${formattedName === 'solution' ? styles['fn--green'] : styles['fn--red']}`,
      `${name ? `${first}${remain} ${index}` : `Function ${index}`}`
    ),
  })
    .addTo(map)
    .on('contextmenu', e => fnProblemPopup(map, e, setModal, setModalType, setShapeOfMarkerPl))
    .on('dblclick', e => {
      if (e.target.options.type.title === 'problem') {
        e.target.options.type.title = 'solution';
        e.target._icon.textContent = `Solution ${e.target.options.type.index}`;
        e.target._icon.classList.remove(styles['fn--red']);
        e.target._icon.classList.add(styles['fn--green']);
      }
      else {
        e.target.options.type.title = "problem";
        e.target._icon.textContent = `Problem ${e.target.options.type.index}`;
        e.target._icon.classList.remove(styles["fn--green"]);
        e.target._icon.classList.add(styles["fn--red"]);
      }
    });
}

export const addStopFn = (map, lat, lng, isLocked, index) => {
  L.marker([lat, lng], {
    draggable: !isLocked,
    type: {index: index, title: 'stop', status: 'add'},
    icon: markerFnIcon(
      `${styles['rectangle-fn']} ${styles['fn--black']}`,
      `<div class="${styles['stop-icon']}">STOP</div>`
    ),
  })
    .addTo(map)
    .on('contextmenu', e => stopFnPopup(map, e));
}

export const addTemporaryFn = (map, lat, lng, isLocked, index, name) => {
  L.marker([lat, lng], {
    draggable: !isLocked,
    type: {index: index, title: 'temporary', status: 'add'},
    icon: markerFnIcon(
      `${styles['rectangle-fn']} ${styles['fn--black']}`,
      `
        ${name}
        <div class="${styles['temp-icon']}">T</div>
      `
    ),
  })
    .addTo(map)
    .on('contextmenu', e => tempFnPopup(map, e));
}

export const addDistancePoint = (map, lat, lng, isLocked, type) => {
  const point = L.marker([lat, lng], {
      icon: markerDistancePointIcon(),
      draggable: !isLocked,
      options: {
        type: type ? type : 'distance',
      }
    })
      .on('dragstart', (e) => dragStartHandler(map , e))
      .on('drag', (e) => dragHandlerLine(map, e))
      .on('dragend', (e) => dragEndHandler(map))
      .addTo(map)

  return point;
}

export const addRoute = (map, lat, lng, isLocked) => {
  const lng2 = lng + 10;
  const distancePoint = addDistancePoint(map, lat, lng, isLocked);
  const distancePoint2 = addDistancePoint(map, lat, lng2, isLocked);

  const polyline_1 = new L.Polyline(
    [[lat, lng2], [lat, lng]],
    { color: 'transparent', status: 'add' }
  )
    .arrowheads({ size: '5%', color: 'black', type: 'arrow' })
    .addTo(map);

  const polyline = new L.Polyline(
    [[lat, lng], [lat, lng2]],
    { kind: 'inter-route', type: 'line', color: 'black', status: 'add' }
  )
    .setText("Inter-route", { center: true, offset: -3 })
    .arrowheads({ color: 'black', type: 'arrow', size: '5%' })
    .on('contextmenu', (e) => routePopup(map, distancePoint, distancePoint2, e))
    .on('click', (e) => clickLine(map, e, distancePoint, distancePoint2, 'Inter-route')
    )
    .addTo(map);

  distancePoint.parentLine = polyline;
  distancePoint2.parentLine = polyline;
  distancePoint.parentLine_1 = polyline_1;
  distancePoint2.parentLine_1 = polyline_1;

  const { latlng1, latlng2, midpointLatLng, pathOptions } = arcRouteInit(lat, lng);
  pathOptions.kind = 'inter-route';

  const curvedPath = L.curve(
    ['M', latlng1, 'Q', midpointLatLng, latlng2],
    pathOptions
  )
    .addTo(map)
    .on('contextmenu', (e) => routePopup(map, distancePoint, distancePoint2, e))
    .on('click', (e) => clickArc(map, e, distancePoint, distancePoint2, 'Arc-route'))
    
  
  curvedPath.setText = polyline.setText;
  distancePoint.parentArc = curvedPath;
  distancePoint2.parentArc = curvedPath;
  distancePoint.on('click', (e) => clickArrow(map, distancePoint));
  distancePoint2.on('click', (e) => clickArrow(map, distancePoint2));
}

export const addDistance = (map, lat, lng, isLocked) => {
  const lng2 = lng + 10;
  const distancePoint = addDistancePoint(map, lat, lng, isLocked);
  const distancePoint2 = addDistancePoint(map, lat, lng2, isLocked);

  const polyline_1 = new L.Polyline(
    [[lat, lng2], [lat, lng]],
    { color: 'transparent', status: 'add' }
  )
    .arrowheads({ size: '5%', color: 'black', type: 'arrow' })
    .addTo(map);

  const polyline = new L.Polyline(
    [[lat, lng], [lat, lng2]],
    { kind: 'distance', type: 'line', color: 'black', status: 'add' }
  )
    .setText("Distance", { center: true, offset: -3 })
    .arrowheads({ color: 'black', type: 'arrow', size: '5%' })
    .on('contextmenu', (e) => distancePopup(map, distancePoint, distancePoint2, e))
    .on('click', (e) => clickLine(map, e, distancePoint, distancePoint2, 'Distance')
    )
    .addTo(map);

  distancePoint.parentLine = polyline;
  distancePoint2.parentLine = polyline;
  distancePoint.parentLine_1 = polyline_1;
  distancePoint2.parentLine_1 = polyline_1;

  const { latlng1, latlng2, midpointLatLng, pathOptions } = arcRouteInit(lat, lng);
  pathOptions.kind = 'distance';

  const curvedPath = L.curve(
    ['M', latlng1, 'Q', midpointLatLng, latlng2],
    pathOptions
  )
    .addTo(map)
    .on('contextmenu', (e) => distancePopup(map, distancePoint, distancePoint2, e))
    .on('click', (e) => clickArc(map, e, distancePoint, distancePoint2, 'Distance'))
    
  
  curvedPath.setText = polyline.setText;
  distancePoint.parentArc = curvedPath;
  distancePoint2.parentArc = curvedPath;
  distancePoint.on('click', (e) => clickArrow(map, distancePoint));
  distancePoint2.on('click', (e) => clickArrow(map, distancePoint2));
}

const colors = ['darkred', 'darkgreen', 'darkblue', 'purple', 'black', 'darkorange', 'darkviolet', 'darkcyan', 'darkturquoise']

// Distance marker for 'Show Distance' option
export const addStaticDistance = (map, lat1, lng1, lat2, lng2, isLocked, type) => {
  const distancePoint = addDistancePoint(map, lat1, lng1, isLocked, type);
  const distancePoint2 = addDistancePoint(map, lat2, lng2, isLocked, type);

  const polyline_1 = new L.Polyline(
    [[lat2, lng2], [lat1, lng1]],
    { color: 'transparent', status: 'add' }
  )
    .arrowheads({ size: 0, color: 'black', type: 'arrow' })
    .addTo(map);
  
  let orientation = (distancePoint.getLatLng().lng < distancePoint2.getLatLng().lng) ? 0 : 180;

  const polyline = new L.Polyline(
    [[lat1, lng1], [lat2, lng2]],
    { kind: 'distance', type: 'line', color: 'black', status: 'add' }
  )
    
    .arrowheads({ color: 'black', type: 'arrow', size: 0 })
    .on('contextmenu', (e) => distancePopup(map, distancePoint, distancePoint2, e))
    .on('click', (e) => clickLine(map, e, distancePoint, distancePoint2, 'Distance')
    )
    .addTo(map);
  
    const latLng = polyline.getLatLngs();
    const distance = map.distance(
      L.latLng(latLng[0].lat, latLng[0].lng),
      L.latLng(latLng[1].lat, latLng[1].lng)
    );
    
    polyline.setText(`${(distance * 0.001).toFixed()} km`, { center: true, offset: -3, orientation: orientation, attributes: {fill: colors[Math.round(Math.random() * 10) % colors.length]}})

  distancePoint.parentLine = polyline;
  distancePoint2.parentLine = polyline;
  distancePoint.parentLine_1 = polyline_1;
  distancePoint2.parentLine_1 = polyline_1;

  const { latlng1, latlng2, midpointLatLng, pathOptions } = staticArcRouteInit(lat1, lng1, lat2, lng2);
  pathOptions.kind = 'distance';

  const curvedPath = L.curve(
    ['M', latlng1, 'Q', midpointLatLng, latlng2],
    pathOptions
  )
    .addTo(map)
    .on('contextmenu', (e) => distancePopup(map, distancePoint, distancePoint2, e))
    .on('click', (e) => clickArc(map, e, distancePoint, distancePoint2, 'Distance'))
    
  
  curvedPath.setText = polyline.setText;
  distancePoint.parentArc = curvedPath;
  distancePoint2.parentArc = curvedPath;
  distancePoint.on('click', (e) => clickArrow(map, distancePoint));
  distancePoint2.on('click', (e) => clickArrow(map, distancePoint2));
}

export const addMarkerMapElement = (map, lat, lng, isLocked, name, setMapElementRelate, setPositionOfMapElementSelected) => {
  setPositionOfMapElementSelected(lat, lng);
  L.marker([lat, lng], {
    draggable: !isLocked,
    type: {
      type: 'map-element',
      shape: 'rectangle',
      status: 'add',
    },
    icon: markerMapElementIcon(
        `${styles['rectangle-fn']} ${styles['map-element']}`,
        `${name}`
    ),
  }).addTo(map)
      .on('contextmenu', e => mapElementPopup(map, e, setMapElementRelate))
      .on('click', e => addSelectedItem(e, map, isLocked))
}

export const addMarkerGivenSet = (map, lat, lng, isLocked, name, setChooseGivenSet, setPositionOfHorizontalLine, resetPositionOfHorizontalLine) => {
  setPositionOfHorizontalLine(lat, lng);
  L.marker([lat, lng], {
    draggable: false,
    type: {
      type: 'the-given-set',
      shape: 'rectangle',
      status: 'add',
    },
    icon: markerGivenSetIcon(`${styles['main-set-icon']}`),
  }).addTo(map)
      .on('contextmenu', e => givenSetPopup(map, e, resetPositionOfHorizontalLine))
      .on('click', e => addSelectedItem(e, map, isLocked))
}

export const addRelateMarker = (map, lat, lng, isLocked) => {
  L.marker([lat, lng], {
    target: { status: 'add' },
    icon: markerRelateIcon(),
    draggable: !isLocked,
  })
      .on('contextmenu', e => {
        const housePopup = L.popup()
            .setLatLng([lat, lng])
            .setContent(housePopupHTML())
            .addTo(map);

        window.deleteHouse = () => {
          map.removeLayer(e.target);
          map.removeLayer(housePopup);
        }
      })
      .addTo(map)
}

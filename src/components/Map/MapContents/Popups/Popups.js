import styles from '../_MapContents.module.scss';
import L, {map, popup} from 'leaflet';
import '@elfalem/leaflet-curve';
import 'leaflet-textpath';
import 'leaflet-arrowheads';

import {
    markerFnIcon, markerFnCircleIcon, markerPersonIcon,
    markerCustomImgIcon, markerCustomAudioIcon, markerCustomVideoIcon,
    markerCountryFnIcon, markerRoomIcon
} from '../Markers/MarkerIcons';

import {handleName, markerFnIndex, markerProblemIndex, selectedList} from '../Variables/Variables';

import {
    fnPopupHTML, personPopupHTML,
    groupPopupHTML, problemPopupHTML,
    groupFnLayoutPopupHTML, routePopupHTML,
    distancePopupHTML, countryFnPopupHTML,
    stopFnPopupHTML, tempFnPopupHTML, mainsetPopupHTML,
    roomPopupHTML, worldPopupHTML, wrappingPopupHTML,
    imgBoundPopupHTML, audioBoundPopupHTML, videoBoundPopupHTML, mapElementPopupHTML
} from './PopupHTMLs';

import {removeTempList, setupGroup, setupMainSet, showDistance} from '../Markers/HandleSelectItem';

import {resetAllColor} from '../Markers/HandleRouteAndDistance';
import {addSoluOrProbFn, addStopFn, addTemporaryFn} from '../Markers/AddMarkers';
import {renderToString} from "react-dom/server";
import RectHouse from "@/components/Map/MapContents/Views/rect/RectHouse";
import {useGlobalStore} from "@/providers/RootStoreProvider";

// A function that execute whenever user right click on function marker
// Includes all custom window global functions

// Clear all visible popups on map
export const clearAllPopups = (map) => {
    map.eachLayer(layer => {
        if (layer instanceof L.Popup) {
            map.removeLayer(layer)
        }
    });
}

const clearWorldPopup = (map) => {
    map.eachLayer(layer => {
        if (layer instanceof L.Popup && layer.options.type === 'world_popup') {
            map.removeLayer(layer);
        }
    })
}

// Stop all features before changing function (boundary, flashing,...)
const stopFnRunningFeatures = (e) => {
    if (e.target.options.boundary) {
        e.target.options.boundary = false;
        e.target._icon.classList.remove(styles["boundary"]);
    }

    if (e.target.options.isFlashing) {
        e.target.options.isFlashing = false;
        for (let i = 0; i < 6; i++) {
            e.target._icon.classList.remove(styles[`simulation-animate${i}`]);
        }
    }
}

// ---------------------------------------------------------------------------------------------------------
// Popup shown when right-click on world map
export const worldPopup = (map, e, isMap, toggleHouseView, setMapElementRelate, setMapElementSelected) => {
    clearAllPopups(map);

    const popupWorld = L.popup();
    popupWorld.options.type = 'world_popup';

    if (isMap) {
        popupWorld
            .setLatLng([e.latlng.lat, e.latlng.lng])
            .setContent(worldPopupHTML())
            .addTo(map);

        const world = document.querySelector('.world');
        world.onclick = () => {
            toggleHouseView('house-world');
            map.closePopup();
        }

        const country = document.querySelector('.country');
        country.onclick = () => {
            toggleHouseView("house-countries");
            map.closePopup();
        }
    }

    window.handleSelectMapRelate = (value) => {
        setMapElementRelate(value);
    }

    window.handleSelectMapElement = (value) => {
        setMapElementSelected(value);
    }
}

// ---------------------------------------------------------------------------------------------------------
// Popup shown when right-click on function marker
export const functionPopup = (map, setModal, setModalType, isLocked, e) => {
    clearAllPopups(map);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // console.log(e.target)

    let type = false;

    let error = e.target.options.solution;
    if (!error) {
        error = e.target.options.problem;
    }
    let isFlashing = e.target.options.isFlashing;
    let hasBoundary = e.target.options.boundary;
    const name = e.target._icon.innerText;

    if (
        name.startsWith("Natural") || name.startsWith("Non-natural") ||
        name.startsWith("Existing") || name.startsWith("Added")
    ) {
        type = true;
    }

    const popup = L.popup([e.latlng.lat, e.latlng.lng], {
        content: fnPopupHTML(name, type, error, hasBoundary, isFlashing),
        offset: L.point(0, e.latlng.lat < 20 ? 0 : 440)
    });

    popup.addTo(map)

    window.openRenameModal = () => {
        setModalType('rename');
        setModal(true);
    };

    if (error) {
        window.problem = error;
    }
    ;

    window.handleToggleFlasingFn = () => {
        const random = Math.round(Math.random() * 10) % 6;
        if (!e.target.options.isFlashing) {
            e.target._icon.classList.add(styles[`simulation-animate${random}`]);
            e.target.options.isFlashing = true;
        } else {
            e.target.options.isFlashing = false;
            for (let i = 0; i < 6; i++) {
                e.target._icon.classList.remove(styles[`simulation-animate${i}`]);
            }
        }
        map.removeLayer(popup);
    }

    window.handleToggleBoundaryFn = () => {
        if (!e.target.options.boundary) {
            if (e.target.options.problem) {
                setModalType('boundary-problem');
                setModal(true);
            } else if (name.startsWith("Natural") || name.startsWith('h\nn\n(t)')) {
                setModalType('boundary-natural');
                setModal(true);
            } else {
                e.target._icon.classList.add(styles["boundary"]);
                e.target.options.boundary = true;
            }

        } else {
            e.target._icon.classList.remove(styles["boundary"]);
            e.target.options.boundary = false;
        }
        map.removeLayer(popup);
    }

    window.edittingItem = (
        color, name, index,
        currentColor = e.target._icon.classList[2],
        currentName = e.target._icon.innerText
    ) => {

        if (name === 'Function') {
            index = markerFnIndex;
        }

        if (!name || color) {
            e.target.options.solution && delete e.target.options.solution;
            e.target.options.problem && delete e.target.options.problem;
        }

        if (color === 'green' && !type) {
            e.target.options.solution = 'solution';
        } else if (color === 'red') {
            e.target.options.problem = 'problem';
        }

        if (!currentName.startsWith(name)) {
            stopFnRunningFeatures(e);

            if (e.target._icon.classList.contains(styles['circle-fn'])) {
                e.target.setIcon(
                    markerFnCircleIcon(
                        `${styles['circle-fn']} ${color ? styles['fn--' + color] : currentColor}`,
                        handleName(name, index, currentName)
                    )
                );
            } else if (e.target._icon.classList.contains(styles['rectangle-fn'])) {
                e.target.setIcon(
                    markerFnIcon(
                        `${styles['rectangle-fn']} ${color ? styles['fn--' + color] : currentColor}`,
                        handleName(name, index, currentName)
                    )
                );
            } else if (e.target._icon.classList.contains(styles['ellipse-fn'])) {
                e.target.setIcon(
                    markerFnIcon(
                        `${styles['ellipse-fn']} ${color ? styles['fn--' + color] : currentColor}`,
                        handleName(name, index, currentName)
                    )
                )
            }
        }

        map.removeLayer(popup);
    };

    window.fnAddImg = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const objectUrl = URL.createObjectURL(event.target.files[0]);

        if (e.target._popup) {
            e.target.closePopup();
        }

        e.target.bindPopup(
            (e) => imgBoundPopupHTML(objectUrl, undefined, 'Function'),
            {
                offset: L.point(0, 60),
                autoClose: false,
                closeOnClick: false,
                closeButton: false,
            }
        )
            .openPopup();
    }

    window.fnAddAudio = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const objectUrl = URL.createObjectURL(event.target.files[0]);

        if (e.target._popup) {
            e.target.closePopup();
        }

        e.target.bindPopup(
            (e) => audioBoundPopupHTML(objectUrl),
            {
                offset: L.point(0, 120),
                autoClose: false,
                closeOnClick: false,
                closeButton: false,
            }
        )
            .openPopup();
    }

    window.fnAddVideo = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const objectUrl = URL.createObjectURL(event.target.files[0]);

        if (e.target._popup) {
            e.target.closePopup();
        }

        e.target.bindPopup(
            (e) => videoBoundPopupHTML(objectUrl),
            {
                offset: L.point(0, 240),
                autoClose: false,
                closeOnClick: false,
                closeButton: false,
            }
        )
            .openPopup();
    }

    window.replaceFnWithImg = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const objectUrl = URL.createObjectURL(event.target.files[0]);

        e.target.setIcon(
            markerCustomImgIcon(`${styles['rectangle-fn']} ${styles['hide-text']}`, e.target._icon.outerText, objectUrl)
        );

        stopFnRunningFeatures(e);

        map.removeLayer(popup);
    }

    window.replaceFnWithAudio = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const objectUrl = URL.createObjectURL(event.target.files[0]);

        e.target.setIcon(
            markerCustomAudioIcon(`${styles['rectangle-fn']} ${styles['hide-text']}`, e.target._icon.outerText, objectUrl)
        );

        stopFnRunningFeatures(e);

        map.removeLayer(popup);
    }

    window.replaceFnWithVideo = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const objectUrl = URL.createObjectURL(event.target.files[0]);

        stopFnRunningFeatures(e);

        e.target.setIcon(
            markerCustomVideoIcon(`${styles['rectangle-fn']} ${styles['hide-text']}`, e.target._icon.outerText, objectUrl)
        );

        map.removeLayer(popup);
    }

    window.changeShape = (shape) => {
        let name = e.target.options.icon.options?.html;

        if (shape === 'circle') {
            e.target.setIcon(
                markerFnCircleIcon(
                    `${styles['circle-fn']} ${e.target._icon.classList[2]}`,
                    name
                )
            );
        } else if (shape === 'rectangle') {
            e.target.setIcon(
                markerFnIcon(
                    `${styles['rectangle-fn']} ${e.target._icon.classList[2]}`,
                    name
                )
            );
        } else if (shape === 'ellipse') {
            e.target.setIcon(
                markerFnIcon(
                    `${styles['ellipse-fn']} ${e.target._icon.classList[2]}`,
                    name
                )
            );
        }
        e.target.options.target.shape = shape;

        stopFnRunningFeatures(e);

        map.removeLayer(popup);
    }

    // // Group all selected function
    // window.makeGroup = () => {
    //   L.marker([e.latlng.lat, e.latlng.lng], {
    //     draggable: !isLocked,
    //     group: {
    //       group: [...functionSelected.sort()],
    //       index: groupFnIndex[0],
    //     },
    //     icon: markerFnIcon(
    //       `${styles['rectangle-fn']} ${styles['fn--black']}`,
    //       `Group function ${groupFnIndex[0]}`
    //     ),
    //   })
    //     .addTo(map)
    //     .bindPopup(e => groupFnLayoutPopupHTML(e.options.group.group), {
    //       className: styles['group-rectangle'],
    //       offset: L.point(30, -12),
    //       autoClose: false,
    //       closeOnClick: false,
    //     })
    //     .on('contextmenu', e => groupPopup(map, e))
    //     .openPopup();

    //   groupFnIndex[0]++;

    //   map.eachLayer(layer => {
    //     if (layer.options.index) {
    //       functionSelected.forEach(element => {
    //         if (element === layer.options.index) {
    //           layer.remove();
    //         }
    //       });
    //     }
    //   });
    //   functionSelected.splice(0, functionSelected.length);
    // }

    // Replace problem / solution
    window.handleAddProblem = (name) => {
        stopFnRunningFeatures(e);
        addSoluOrProbFn(map, e.latlng.lat, e.latlng.lng, isLocked, markerProblemIndex[0], name, setModal, setModalType)
        markerProblemIndex[0]++;
        map.removeLayer(e.target);
        map.removeLayer(popup);
    };

    window.deleteItem = () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        // const globalStore = useGlobalStore();
        //
        // globalStore.removeMarkerFnList(e.target.options.target.index)
        map.removeLayer(e.target);
        map.removeLayer(popup);
    }

    window.changeToStopFunction = () => {
        stopFnRunningFeatures(e);
        addStopFn(map, e.latlng.lat, e.latlng.lng, isLocked, e.target.options.target.index);
        map.removeLayer(e.target);
        map.removeLayer(popup);
    }

    window.changeToTemporaryFunction = () => {
        stopFnRunningFeatures(e);
        addTemporaryFn(map, e.latlng.lat, e.latlng.lng, isLocked, e.target.options.target.index, e.target._icon.innerText);
        map.removeLayer(e.target);
        map.removeLayer(popup);
    }
}

// ---------------------------------------------------------------------------------------------------------
// Popup shown when right-click on person marker
export const personPopup = (map, marker, setModal, setModalType, isLocked, e, setMapElementRelate, setMapElementSelected) => {
    clearAllPopups(map);
    const popup = L.popup([e.latlng.lat, e.latlng.lng], {
        content: personPopupHTML(),
        offset: L.point(0, e.latlng.lat < 20 ? -10 : 200)
    });
    popup.addTo(map);


    window.openRenameModal = () => {
        setModal(true);
        setModalType('rename');
    };

    window.setProfile = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const objectUrl = URL.createObjectURL(event.target.files[0]);

        e.target.setIcon(
            markerPersonIcon(styles['person'], e.target._icon.textContent, objectUrl)
        );

        map.removeLayer(popup);
    }

    window.edittingItem = (color, name) => {
        const img = e.target._icon.firstChild.currentSrc;
        e.target.setIcon(markerPersonIcon(styles['person'], name, img));
    }

    let path = L.polyline([], {color: 'blue'}).addTo(map);
    window.showMoveWithPath = () => {
        map.on('click', function (e) {
            let clickedLatLng = e.latlng;
            let currentLatLng = marker.getLatLng();

            let pathLatLngs = [currentLatLng, clickedLatLng];
            path.setLatLngs(pathLatLngs);
            marker.setLatLng(clickedLatLng);
        });
    }

    window.showMoveWithoutPath = () => {
        map.on('click', function (e) {
            let clickedLatLng = e.latlng;
            let currentLatLng = marker.getLatLng();

            let pathLatLngs = [currentLatLng, clickedLatLng];
            path.setLatLngs(pathLatLngs);
            marker.setLatLng(clickedLatLng);
        });
    }

    window.addRelatePerson = (value) => {
        setMapElementRelate(value);
        setMapElementSelected('Person');
    }

    window.deleteItem = () => {
        map.removeLayer(e.target);
        map.removeLayer(popup);
        map.removeLayer(path);
    }
}

// ---------------------------------------------------------------------------------------------------------
// Popup shown when right-click on problem/solution marker
export const fnProblemPopup = (map, e, setModal, setModalType) => {
    clearAllPopups(map);

    let hasBoundary = e.target.options.boundary;
    const name = e.target._icon.innerText;
    const popup = L.popup()
        .setLatLng([e.latlng.lat, e.latlng.lng])
        .setContent(problemPopupHTML(hasBoundary))
        .addTo(map)

    window.deleteItem = () => {
        map.removeLayer(e.target);
        map.removeLayer(popup);
    }

    window.handleToggleBoundaryFn = () => {
        if (!e.target.options.boundary) {
            if (name.startsWith('Problem')) {
                setModalType('boundary-problem');
                setModal(true);
            } else {
                e.target._icon.classList.add(styles["boundary"]);
                e.target.options.boundary = true;
            }

        } else {
            e.target._icon.classList.remove(styles["boundary"]);
            e.target.options.boundary = false;
        }
        map.removeLayer(popup);
    }

    window.changeShapeProblem = (shape) => {
        if (shape === "circle") {
            e.target._icon.classList.add(styles["circle-fn-1"]);
            e.target._icon.classList.remove(styles["rectangle-fn"]);
            e.target._icon.classList.remove(styles["ellipse-fn"]);
        } else if (shape === "rectangle") {
            e.target._icon.classList.remove(styles["circle-fn-1"]);
            e.target._icon.classList.add(styles["rectangle-fn"]);
            e.target._icon.classList.remove(styles["ellipse-fn"]);
        } else if (shape === "ellipse") {
            e.target._icon.classList.add(styles["ellipse-fn"]);
            e.target._icon.classList.remove(styles["circle-fn-1"]);
            e.target._icon.classList.remove(styles["rectangle-fn"]);
        }
        map.removeLayer(popup);
    }
}

export const wrappingPopup = (map, lat, lng, isLocked, selectedList, restrictPopup) => {
    clearAllPopups(map);
    console.log('selectedList', selectedList)
    const popupScan = L.popup()
        .setLatLng([lat, lng])
        .setContent(wrappingPopupHTML(restrictPopup))
        .addTo(map);

    // Cancel selection
    window.handleRemoveTempList = () => {
        removeTempList(selectedList);
        map.removeLayer(popupScan);
    }

    // Show distance between selected items
    window.handleShowDistance = () => {
        showDistance(selectedList, map, isLocked);
        map.removeLayer(popupScan);
    }

    // Add one person and one function to a main set
    window.addToMainSet = (_event) => {
        console.log('ADD NEW')
        _event.stopPropagation();
        _event.preventDefault();
        setupMainSet(selectedList, map, lat, lng, isLocked);
        map.removeLayer(popupScan);
    }

    // Group all selected items
    window.getSelectedList = (_event) => {
        _event.stopPropagation();
        _event.preventDefault();
        setupGroup(selectedList, map, lat, lng, isLocked);
        map.removeLayer(popupScan);
    };

    window.closePopupScan = () => {
        map.removeLayer(popupScan);
    }
}

// ---------------------------------------------------------------------------------------------------------
// Popup shown when right-click on group marker
export const groupPopup = (map, e) => {
    clearAllPopups(map);
    const popup = L.popup();

    popup
        .setLatLng([e.latlng.lat, e.latlng.lng])
        .setContent(groupPopupHTML())
        .addTo(map);

    window.changeShapeOption = (shape) => {
        if (shape === "rectangle") {
            e.target.getPopup()._container.classList.remove(styles["group-ellipse"]);
            e.target.getPopup()._container.classList.remove(styles["group-circle"]);
            e.target.getPopup()._container.classList.add(styles["group-rectangle"]);
            e.target._icon.classList.remove(styles["circle-fn-group"]);
            e.target._icon.classList.remove(styles["ellipse-fn-group"]);
            e.target._icon.classList.add(styles["rectangle-fn-group"]);
        } else if (shape === "ellipse") {
            e.target.getPopup()._container.classList.remove(styles["group-rectangle"]);
            e.target.getPopup()._container.classList.remove(styles["group-circle"]);
            e.target.getPopup()._container.classList.add(styles["group-ellipse"]);
            e.target._icon.classList.remove(styles["circle-fn-group"]);
            e.target._icon.classList.remove(styles["rectangle-fn-group"]);
            e.target._icon.classList.add(styles["ellipse-fn-group"]);
        } else if (shape === "circle") {
            e.target.getPopup()._container.classList.remove(styles["group-ellipse"]);
            e.target.getPopup()._container.classList.remove(styles["group-rectangle"]);
            e.target.getPopup()._container.classList.add(styles["group-circle"]);
            e.target._icon.classList.remove(styles["rectangle-fn-group"]);
            e.target._icon.classList.remove(styles["ellipse-fn-group"]);
            e.target._icon.classList.add(styles["circle-fn-group"]);
        }

        map.removeLayer(popup);
    };

    window.replaceGroupWithImg = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const objectUrl = URL.createObjectURL(event.target.files[0]);

        e.target.setIcon(
            markerCustomImgIcon(`${styles['rectangle-fn']} ${styles['group-fn-border']} ${styles['hide-text']}`, e.target._icon.outerText, objectUrl)
        );

        map.removeLayer(popup);
    }

    window.replaceGroupWithAudio = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const objectUrl = URL.createObjectURL(event.target.files[0]);

        e.target.setIcon(
            markerCustomAudioIcon(`${styles['rectangle-fn']} ${styles['group-fn-border']} ${styles['hide-text']}`, e.target._icon.outerText, objectUrl)
        );

        map.removeLayer(popup);
    }

    window.replaceGroupWithVideo = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const objectUrl = URL.createObjectURL(event.target.files[0]);

        e.target.setIcon(
            markerCustomVideoIcon(`${styles['rectangle-fn']} ${styles['group-fn-border']} ${styles['hide-text']}`, e.target._icon.outerText, objectUrl)
        );

        map.removeLayer(popup);
    }

    window.deleteGroup = () => {
        map.removeLayer(e.target);
        map.removeLayer(popup);
    }
}

// ---------------------------------------------------------------------------------------------------------
// Popup shown when right-click on mainset marker
export const mainsetPopup = (map, e) => {
    clearAllPopups(map);

    const popup = L.popup();

    popup
        .setLatLng([e.latlng.lat, e.latlng.lng])
        .setContent(mainsetPopupHTML())
        .addTo(map);

    window.deleteMainSet = () => {
        map.removeLayer(e.target);
        map.removeLayer(popup);
    }
}

export const routePopup = (map, distancePoint, distancePoint2, e) => {

    const popup = L.popup();
    // World popup will appear and override route popup
    // need to wait 10ms to get rid of world popup
    setTimeout(() => {
        clearAllPopups(map);
        popup
            .setLatLng([e.latlng.lat, e.latlng.lng])
            .setContent(routePopupHTML())
            .addTo(map);
    }, 10);


    window.deleteInterRoute = () => {
        map.removeLayer(distancePoint.parentLine);
        map.removeLayer(distancePoint.parentLine_1);
        map.removeLayer(distancePoint.parentArc);

        if (distancePoint.parentArcArrow) {
            map.removeLayer(distancePoint.parentArcArrow);
        }
        if (distancePoint.parentArcArrow_1) {
            map.removeLayer(distancePoint.parentArcArrow_1);
        }

        map.removeLayer(distancePoint);
        map.removeLayer(distancePoint2);
        map.removeLayer(popup);
    }

    window.changeRoute = () => {
        let direct = (distancePoint.getLatLng().lng < distancePoint2.getLatLng().lng) ? true : false;

        if (
            distancePoint.parentArc.options.color === 'blue' ||
            distancePoint.parentArc.options.color === 'black'
        ) {
            map.eachLayer((layer) => {
                resetAllColor(layer);
            });

            distancePoint.parentLine.setStyle({color: 'blue'});
            distancePoint.parentArc.setStyle({color: "transparent"});
            distancePoint.parentArcArrow.remove();
            distancePoint.parentArcArrow_1.remove();
            distancePoint.parentArc.setText(null);
            distancePoint.parentLine.setText('Inter-route', {
                center: true,
                offset: -3,
                orientation: !direct ? 180 : 0,
            });

            map.removeLayer(distancePoint.parentLine);
            map.removeLayer(distancePoint.parentLine_1);

            distancePoint.parentLine_1.arrowheads({
                color: 'black',
                type: 'arrow',
                size: '5%',
            }).addTo(map);
            distancePoint.parentLine.arrowheads({
                color: 'black',
                type: 'arrow',
                size: '5%',
            }).addTo(map);

        } else {
            const point = distancePoint.parentArc.trace([0.1, 0.9]);

            const arcArrow = L.polyline(
                [
                    [point[0].lat, point[0].lng],
                    [distancePoint.getLatLng().lat, distancePoint.getLatLng().lng]
                ],
                {color: 'transparent'}
            ).arrowheads({color: 'black'}).addTo(map);

            const arcArrow_1 = L.polyline(
                [
                    [point[1].lat, point[1].lng],
                    [distancePoint2.getLatLng().lat, distancePoint2.getLatLng().lng]
                ],
                {color: 'transparent'}
            ).arrowheads({color: 'black'}).addTo(map);

            distancePoint.parentArcArrow = arcArrow;
            distancePoint.parentArcArrow_1 = arcArrow_1;
            distancePoint2.parentArcArrow = arcArrow;
            distancePoint2.parentArcArrow_1 = arcArrow_1;

            map.eachLayer((layer) => {
                resetAllColor(layer);
            });

            distancePoint.parentArc.setStyle({color: 'blue'});
            distancePoint.parentLine.setStyle({color: 'transparent'});
            distancePoint.parentLine.setText(null);
            distancePoint.parentLine_1.deleteArrowheads();
            distancePoint.parentLine.deleteArrowheads();
            distancePoint.parentArc.setText("Arc-route", {
                center: true,
                offset: -3,
                orientation: !direct ? 180 : 0,
            })
        }
        map.removeLayer(popup);
    }
}

export const distancePopup = (map, distancePoint, distancePoint2, e) => {
    const popup = L.popup()

    // Looking for explainaion ? Read at routePopup func.
    setTimeout(() => {
        clearAllPopups(map);
        popup
            .setLatLng([e.latlng.lat, e.latlng.lng])
            .setContent(distancePopupHTML())
            .addTo(map);
    }, 10);


    window.deleteDistanceLine = () => {
        map.removeLayer(distancePoint.parentLine);
        map.removeLayer(distancePoint.parentLine_1);
        map.removeLayer(distancePoint.parentArc);
        if (distancePoint.parentArcArrow) {
            map.removeLayer(distancePoint.parentArcArrow);
        }
        if (distancePoint.parentArcArrow_1) {
            map.removeLayer(distancePoint.parentArcArrow_1);
        }
        map.removeLayer(distancePoint);
        map.removeLayer(distancePoint2);
        map.removeLayer(popup);
    };

    window.changeDistance = () => {
        let direct = false;
        let name = distancePoint.parentLine._text;
        if (!name) {
            name = distancePoint.parentArc._text;
        }
        if (distancePoint.getLatLng().lng < distancePoint2.getLatLng().lng) {
            direct = true;
        } else {
            direct = false;
        }

        if (
            distancePoint.parentArc.options.color === 'blue' ||
            distancePoint.parentArc.options.color === 'black'
        ) {
            map.eachLayer(layer => {
                resetAllColor(layer);
            });
            distancePoint.parentLine.setStyle({
                color: "blue",
            });

            distancePoint.parentArc.setStyle({color: "transparent"});
            distancePoint.parentArcArrow.remove();
            distancePoint.parentArcArrow_1.remove();
            distancePoint.parentArc.setText(null);
            distancePoint.parentLine.setText(name, {
                center: true,
                offset: -3,
                orientation: !direct ? 180 : 0,
            });

            map.removeLayer(distancePoint.parentLine);
            map.removeLayer(distancePoint.parentLine_1);

            distancePoint.parentLine_1.arrowheads({
                color: 'black',
                type: 'arrow',
                size: '5%',
            }).addTo(map);
            distancePoint.parentLine.arrowheads({
                color: 'black',
                type: 'arrow',
                size: '5%',
            }).addTo(map);
        } else {
            const point = distancePoint.parentArc.trace([0.1, 0.9]);

            const arcArrow = L.polyline(
                [
                    [point[0].lat, point[0].lng],
                    [distancePoint.getLatLng().lat, distancePoint.getLatLng().lng],
                ],
                {color: 'transparent'}
            ).arrowheads({color: 'black'}).addTo(map);

            const arcArrow_1 = L.polyline(
                [
                    [point[1].lat, point[1].lng],
                    [distancePoint2.getLatLng().lat, distancePoint2.getLatLng().lng],
                ],
                {color: 'transparent'}
            ).arrowheads({color: 'black'}).addTo(map);

            distancePoint.parentArcArrow = arcArrow;
            distancePoint.parentArcArrow_1 = arcArrow_1;
            distancePoint2.parentArcArrow = arcArrow;
            distancePoint2.parentArcArrow_1 = arcArrow_1;

            map.eachLayer(layer => {
                if (layer.options.type === "distance") {
                    layer.parentLine.options.color === "blue" &&
                    layer.parentLine.setStyle({color: "black"});
                    layer.parentArc.options.color === "blue" &&
                    layer.parentArc.setStyle({color: "black"});
                }
            });

            distancePoint.parentArc.setStyle({color: 'blue'});
            distancePoint.parentLine.setStyle({color: 'transparent'});

            distancePoint.parentLine_1.deleteArrowheads();
            distancePoint.parentLine.deleteArrowheads();

            map.invalidateSize();

            distancePoint.parentLine.setText(null);
            distancePoint.parentArc.setText(name, {
                center: true,
                offset: -3,
                orientation: !direct ? 180 : 0,
            });
        }

        map.removeLayer(popup);
    }
}

export const fnCountryPopup = (map, e, setModal, setModalType) => {
    clearAllPopups(map);
    // console.log(e.target)
    const popup = L.popup();
    popup
        .setLatLng([e.latlng.lat, e.latlng.lng])
        .setContent(countryFnPopupHTML())
        .addTo(map)

    window.openChangeSizeCountryModal = () => {
        let type = 'change-size-country';
        const size = e.target.options.icon.options.iconSize;
        // if (size && Array.isArray(size)) {
        //   type += `_${size[0]},${size[1]}`;
        // }
        setModal(true);
        setModalType(type);
        map.removeLayer(popup);
    }

    window.changeSizeCountryFn = (width, height) => {
        const icon = e.target.options.icon;
        icon.options.iconSize = [width, height];
        e.target.setIcon(icon);
        map.removeLayer(popup);
    }

    window.changeShapeCountryFn = (shape) => {
        if (shape === "circle") {
            e.target._icon.classList.remove(styles["rectangle-fn"]);
            e.target._icon.classList.remove(styles["ellipse-fn"]);
            e.target._icon.classList.add(styles["circle-fn-1"]);
            e.target.getPopup()?._container?.classList.remove(styles["group-ellipse"]);
            e.target.getPopup()?._container?.classList.remove(styles["group-rectangle"]);
            e.target.getPopup()?._container?.classList.add(styles["group-circle"]);
        } else if (shape === "rectangle") {
            e.target._icon.classList.remove(styles["circle-fn-1"]);
            e.target._icon.classList.remove(styles["ellipse-fn"]);
            e.target._icon.classList.add(styles["rectangle-fn"]);
            e.target.getPopup()?._container?.classList.remove(styles["group-ellipse"]);
            e.target.getPopup()?._container?.classList.remove(styles["group-circle"]);
            e.target.getPopup()?._container?.classList.add(styles["group-rectangle"]);
        } else if (shape === "ellipse") {
            e.target._icon.classList.remove(styles["circle-fn-1"]);
            e.target._icon.classList.remove(styles["rectangle-fn"]);
            e.target._icon.classList.add(styles["ellipse-fn"]);
            e.target.getPopup()?._container?.classList.remove(styles["group-rectangle"]);
            e.target.getPopup()?._container?.classList.remove(styles["group-circle"]);
            e.target.getPopup()?._container?.classList.add(styles["group-ellipse"]);
        }
        map.removeLayer(popup);
    }

    window.openRenameCountryModal = () => {
        let type = 'rename-country-fn'
        setModal(true);
        const rawName = e.target._icon.innerText;
        if (rawName && typeof rawName === 'string') {
            const names = rawName.split('\n');
            type += `_${names[0]},${names[names.length - 1]}`;
        }
        // console.log(type);
        setModalType(type);
        map.removeLayer(popup);
    }

    window.changeNameCountryFn = (firstName, secondName) => {
        const className = e.target.options.icon?.options?.className;
        const size = e.target.options.icon?.options?.iconSize;
        e.target.setIcon(
            markerCountryFnIcon(
                className, firstName, secondName, size[0], size[1]
            )
        );
    }

    window.deleteCountryFn = () => {
        map.setMaxZoom(16);
        map.removeLayer(e.target);
        map.removeLayer(popup);
    }

}

export const stopFnPopup = (map, e) => {
    clearAllPopups(map);

    const popup = L.popup();

    popup
        .setLatLng([e.latlng.lat, e.latlng.lng])
        .setContent(stopFnPopupHTML())
        .addTo(map)

    window.changeShapeStopFn = (shape) => {
        if (shape === "circle") {
            e.target._icon.classList.add(styles["circle-fn-1"]);
            e.target._icon.classList.remove(styles["rectangle-fn"]);
            e.target._icon.classList.remove(styles["ellipse-fn"]);
        } else if (shape === "rectangle") {
            e.target._icon.classList.remove(styles["circle-fn-1"]);
            e.target._icon.classList.add(styles["rectangle-fn"]);
            e.target._icon.classList.remove(styles["ellipse-fn"]);
        } else if (shape === "ellipse") {
            e.target._icon.classList.add(styles["ellipse-fn"]);
            e.target._icon.classList.remove(styles["circle-fn-1"]);
            e.target._icon.classList.remove(styles["rectangle-fn"]);
        }
        map.removeLayer(popup);
    }

    window.deleteStopFn = () => {
        map.removeLayer(e.target);
        map.removeLayer(popup);
    }
}

export const tempFnPopup = (map, e) => {
    clearAllPopups(map);

    const popup = L.popup();
    popup
        .setLatLng([e.latlng.lat, e.latlng.lng])
        .setContent(tempFnPopupHTML())
        .addTo(map)

    window.changeShapeTempFn = (shape) => {
        if (shape === "circle") {
            e.target._icon.classList.add(styles["circle-fn-1"]);
            e.target._icon.classList.remove(styles["rectangle-fn"]);
            e.target._icon.classList.remove(styles["ellipse-fn"]);
        } else if (shape === "rectangle") {
            e.target._icon.classList.remove(styles["circle-fn-1"]);
            e.target._icon.classList.add(styles["rectangle-fn"]);
            e.target._icon.classList.remove(styles["ellipse-fn"]);
        } else if (shape === "ellipse") {
            e.target._icon.classList.add(styles["ellipse-fn"]);
            e.target._icon.classList.remove(styles["circle-fn-1"]);
            e.target._icon.classList.remove(styles["rectangle-fn"]);
        }
        map.removeLayer(popup);
    }

    window.deleteTempFn = () => {
        map.removeLayer(e.target);
        map.removeLayer(popup);
    }
}

export const roomPopup = (map, e) => {
    clearAllPopups(map);
    console.log(e)
    const popup = L.popup();

    popup
        .setLatLng([e.latlng.lat, e.latlng.lng])
        .setContent(roomPopupHTML())
        .addTo(map)

    window.roomAddImg = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const objectUrl = URL.createObjectURL(event.target.files[0]);

        map.removeLayer(popup);

        e.target.bindPopup(
            (e) => imgBoundPopupHTML(objectUrl, 'Room'),
            {
                offset: L.point(0, 60),
                autoClose: false,
                closeOnClick: false,
                closeButton: false,
            }
        )
            .openPopup();
    }

    window.roomAddAudio = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const objectUrl = URL.createObjectURL(event.target.files[0]);

        map.removeLayer(popup);

        e.target.bindPopup(
            (e) => audioBoundPopupHTML(objectUrl),
            {
                offset: L.point(0, 120),
                autoClose: false,
                closeOnClick: false,
                closeButton: false,
            }
        )
            .openPopup();
    }

    window.roomAddVideo = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const objectUrl = URL.createObjectURL(event.target.files[0]);

        map.removeLayer(popup);

        e.target.bindPopup(
            (e) => videoBoundPopupHTML(objectUrl),
            {
                offset: L.point(0, 240),
                autoClose: false,
                closeOnClick: false,
                closeButton: false,
            }
        )
            .openPopup();
    }

    window.replaceRoomWithImg = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const objectUrl = URL.createObjectURL(event.target.files[0]);

        e.target.setIcon(
            markerCustomImgIcon(`${styles['rectangle-fn']} ${styles['hide-text']}`, e.target._icon.outerText, objectUrl)
        );

        // stopFnRunningFeatures(e);

        map.removeLayer(popup);
    }

    window.replaceRoomWithAudio = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const objectUrl = URL.createObjectURL(event.target.files[0]);

        e.target.setIcon(
            markerCustomAudioIcon(`${styles['rectangle-fn']} ${styles['hide-text']}`, e.target._icon.outerText, objectUrl)
        );

        // stopFnRunningFeatures(e);

        map.removeLayer(popup);
    }

    window.replaceRoomWithVideo = (event) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const objectUrl = URL.createObjectURL(event.target.files[0]);

        // stopFnRunningFeatures(e);

        e.target.setIcon(
            markerCustomVideoIcon(`${styles['rectangle-fn']} ${styles['hide-text']}`, e.target._icon.outerText, objectUrl)
        );

        map.removeLayer(popup);
    }

    // window.defaultRoom = () => {
    //   if(e.target.options.options?.name) {
    //     e.target.setIcon(
    //       markerRoomIcon(
    //         `${styles['room-icon']}`,
    //         e.target.options.options.name,
    //       )
    //     );
    //   }
    //   map.removeLayer(popup);
    // }
}

// Popup shown when right-click element map marker
export const mapElementPopup = (map, e) => {
    clearAllPopups(map);
    const popup = L.popup([e.latlng.lat, e.latlng.lng], {
        content: mapElementPopupHTML(),
        offset: L.point(0, e.latlng.lat < 20 ? -10 : 200)
    });
    popup.addTo(map);
}

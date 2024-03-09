// /* eslint-disable react-hooks/exhaustive-deps */
import L from 'leaflet';
import {observer} from 'mobx-react-lite';
import {useMap} from 'react-leaflet';
import {useEffect, useState} from 'react';
import {useGlobalStore} from '@/providers/RootStoreProvider';
import {
    annotationPalletPopup, imagePalletPopup,
} from "@/components/Map/MapContents/Popups/Popups";
import {addInputTextPallet} from "@/components/Map/MapContents/Markers/AddMarkers";

const PalletLineView = () => {
    const map = useMap();
    const globalStore = useGlobalStore();

    const LIST_COUNTRY = [
        {fullName: 'Canada', codeName: 'CAN'},
        {fullName: 'United States of America', codeName: 'USA'},
        {fullName: 'Mexico', codeName: 'MEX'},
    ]

    const [zoom, setZoom] = useState(map.getZoom());
    const [distance, setDistance] = useState(300);

    map.on('zoomend', () => {
        setZoom(map.getZoom());
    });

    useEffect(() => {
        globalStore.setListCountryInRect(LIST_COUNTRY)
    }, []);

    useEffect(() => {
        setDistance(globalStore.map ? 300 : 70)
    }, [globalStore.map]);

    useEffect(() => {
        if (globalStore.clear) {
            map.eachLayer(layer => {
                if (
                    layer.options.target?.status === 'add' || layer.options.status === 'add' ||
                    layer.options.type === 'distance' || layer.options.group?.status === 'add' ||
                    layer.options.type?.status === 'add' || layer.options.type === 'the-given-set'
                ) {
                    map.removeLayer(layer);
                }
            });

            globalStore.toggleClear();
        }
    }, [globalStore.clear]);

    const findLatLngPoint = (latLngElementSelected, latLngElementRelate, map) => {
        let pointElementSelected = map.latLngToContainerPoint(latLngElementSelected);
        let pointElementRelate = map.latLngToContainerPoint(latLngElementRelate);
        let centerX = (pointElementSelected.x + pointElementRelate.x) / 2;
        let centerY = (pointElementSelected.y + pointElementRelate.y) / 2;
        let centerPoint = {x: centerX, y: centerY};
        return map.containerPointToLatLng(centerPoint);
    }

    useEffect(() => {
        map.eachLayer(layer => {
            if (layer.options.target?.type === 'input-text' || layer.options?.attribution === 'imageTransform') {
                map.removeLayer(layer);
            }
        })
        for (let i = 0; i < globalStore.listPrincipleLine.length; i++) {
            globalStore.setStatusGivenSetForPrincipleLine(globalStore.listPrincipleLine[i].id, false);
        }

        for (let i = 0; i < globalStore.listPositionOfTextPallet.length; i++) {
            globalStore.setStatusTextPallet(globalStore.listPositionOfTextPallet[i].id, false)
        }

        for (let i = 0; i < globalStore.listPositionOfImagePallet.length; i++) {
            globalStore.setStatusImagePallet(globalStore.listPositionOfImagePallet[i].id, false)
        }

    }, [globalStore.map, globalStore.showDialogEditTextStyle])

    useEffect(() => {
        for (let i = 0; i < globalStore.listPositionOfPallet1.length; i++) {
            addPallet1(globalStore.listPositionOfPallet1[i].position, globalStore.listPositionOfPallet1[i].id);
        }
        for (let i = 0; i < globalStore.listPositionOfPallet2.length; i++) {
            addPallet2(globalStore.listPositionOfPallet2[i].position, globalStore.listPositionOfPallet2[i].id);
        }
        for (let i = 0; i < globalStore.listPositionOfPallet3.length; i++) {
            addPallet3(globalStore.listPositionOfPallet3[i].position, globalStore.listPositionOfPallet3[i].id);
        }
        for (let i = 0; i < globalStore.listPositionOfPallet4.length; i++) {
            addPallet4(globalStore.listPositionOfPallet4[i].position, globalStore.listPositionOfPallet4[i].id);
        }
        for (let i = 0; i < globalStore.listPositionOfTextPallet.length; i++) {
            if (!globalStore.listPositionOfTextPallet[i].status) {
                addTextPallet(globalStore.listPositionOfTextPallet[i].position, globalStore.listPositionOfTextPallet[i].id,
                    globalStore.listPositionOfTextPallet[i].style, globalStore.listPositionOfTextPallet[i].valueText);
            }
        }
        addImagePallet();
    }, [globalStore.map, globalStore.listPositionOfPallet4.length, globalStore.listPositionOfPallet1.length, globalStore.listPositionOfPallet2.length,
        globalStore.listPositionOfPallet3.length, globalStore.listPositionOfTextPallet.length, globalStore.listPositionOfImagePallet.length, globalStore.valueOfImage,
        globalStore.showDialogEditTextStyle]);

    const addPallet1 = (positionOfPallet1, id) => {
        let latLng1 = positionOfPallet1[0];
        let latLng2 = positionOfPallet1[1];
        L.polyline([[latLng1[0], latLng2[1]], latLng1], {
            weight: 2,
            color: 'black',
            status: 'add',
            index: id,
            type: 'pallet-1'
        })
            .arrowheads({size: '15px', color: 'red', type: 'arrow', status: 'add'})
            .on('contextmenu', e => annotationPalletPopup(map, e, globalStore.removeLinePallet1ById))
            .addTo(map);
        L.polyline([[latLng1[0], latLng2[1]], latLng2], {
            weight: 2,
            color: 'black',
            status: 'add',
            index: id,
            type: 'pallet-1'
        })
            .arrowheads({size: '15px', color: 'red', type: 'arrow', status: 'add'})
            .on('contextmenu', e => annotationPalletPopup(map, e, globalStore.removeLinePallet1ById))
            .addTo(map);
    }

    const addPallet2 = (positionOfPallet2, id) => {
        let latLng1 = positionOfPallet2[0];
        let latLng2 = positionOfPallet2[1];
        L.polyline([[latLng2[0], latLng1[1]], latLng1], {
            weight: 2,
            color: 'black',
            status: 'add',
            index: id,
            type: 'pallet-2'
        })
            .arrowheads({size: '15px', color: 'red', type: 'arrow', status: 'add'})
            .on('contextmenu', e => annotationPalletPopup(map, e, globalStore.removeLinePallet2ById))
            .addTo(map);
        L.polyline([[latLng2[0], latLng1[1]], latLng2], {
            weight: 2,
            color: 'black',
            status: 'add',
            index: id,
            type: 'pallet-2'
        })
            .arrowheads({size: '15px', color: 'red', type: 'arrow', status: 'add'})
            .on('contextmenu', e => annotationPalletPopup(map, e, globalStore.removeLinePallet2ById))
            .addTo(map);
    }

    const addPallet3 = (positionOfPallet3, id) => {
        let latLng1 = positionOfPallet3[0];
        let latLng2 = positionOfPallet3[1];
        let centerLatLng = findLatLngPoint(latLng1, [latLng1[0], latLng2[1]], map)
        L.polyline([[centerLatLng.lat, centerLatLng.lng], latLng1], {
            weight: 2,
            color: 'black',
            status: 'add',
            index: id,
            type: 'pallet-3'
        })
            .arrowheads({size: '15px', color: 'red', type: 'arrow', status: 'add'})
            .on('contextmenu', e => annotationPalletPopup(map, e, globalStore.removeLinePallet3ById))
            .addTo(map);
        L.polyline([[centerLatLng.lat, centerLatLng.lng], [latLng2[0], centerLatLng.lng]], {
            weight: 2,
            color: 'black',
            status: 'add',
            index: id,
            type: 'pallet-3'
        })
            .on('contextmenu', e => annotationPalletPopup(map, e, globalStore.removeLinePallet3ById))
            .addTo(map);
        L.polyline([[latLng2[0], centerLatLng.lng], latLng2], {
            weight: 2,
            color: 'black',
            status: 'add',
            index: id,
            type: 'pallet-3'
        })
            .arrowheads({size: '15px', color: 'red', type: 'arrow', status: 'add'})
            .on('contextmenu', e => annotationPalletPopup(map, e, globalStore.removeLinePallet3ById))
            .addTo(map);
    }

    const addPallet4 = (positionOfPallet4, id) => {
        let latLng1 = positionOfPallet4[0];
        let latLng2 = positionOfPallet4[1];
        let centerLatLng = findLatLngPoint(latLng2, [latLng1[0], latLng2[1]], map)
        L.polyline([[centerLatLng.lat, centerLatLng.lng], latLng2], {
            weight: 2,
            color: 'black',
            status: 'add',
            index: id,
            type: 'pallet-4'
        })
            .arrowheads({size: '15px', color: 'red', type: 'arrow', status: 'add'})
            .on('contextmenu', e => annotationPalletPopup(map, e, globalStore.removeLinePallet4ById))
            .addTo(map);
        L.polyline([[centerLatLng.lat, centerLatLng.lng], [centerLatLng.lat, latLng1[1]]], {
            weight: 2,
            color: 'black',
            status: 'add',
            index: id,
            type: 'pallet-4'
        })
            .on('contextmenu', e => annotationPalletPopup(map, e, globalStore.removeLinePallet4ById))
            .addTo(map);
        L.polyline([[centerLatLng.lat, latLng1[1]], latLng1], {
            weight: 2,
            color: 'black',
            status: 'add',
            index: id,
            type: 'pallet-4'
        })
            .arrowheads({size: '15px', color: 'red', type: 'arrow', status: 'add'})
            .on('contextmenu', e => annotationPalletPopup(map, e, globalStore.removeLinePallet4ById))
            .addTo(map);
    }

    const addTextPallet = (positionText, id, style, valueText) => {
        addInputTextPallet(map, positionText[0], positionText[1], id, globalStore.lock, globalStore.toggleShowDialogEditTextStyle,
            style, globalStore.setItemAnnotationStyling, globalStore.setValueTextPallet, valueText ? valueText : '',
            globalStore.removeTextPalletById, globalStore.updatePositionTextPalletById);
        globalStore.setStatusTextPallet(id, true);
    }

    const addImagePallet = () => {
        for (let i = 0; i < globalStore.listPositionOfImagePallet.length; i++) {
            let imagePalletObj = globalStore.listPositionOfImagePallet[i];
            if (imagePalletObj.position.length > 0 && !imagePalletObj.status && imagePalletObj.valueImage && imagePalletObj.valueImage !== '') {
                let value = imagePalletObj.valueImage;

                let imageBounds = [imagePalletObj.position, [imagePalletObj.position[0] - 20, imagePalletObj.position[1] + 50]];
                let bounds = L.latLngBounds(imageBounds);

                let latLngs = [
                    bounds.getSouthWest(),
                    bounds.getNorthWest(),
                    bounds.getNorthEast(),
                    bounds.getSouthEast()
                ];
                let imageTransform = L.imageOverlay.transform(value, latLngs, {
                    draggable: true,
                    scalable: true,
                    rotatable: false,
                    keepRatio: false,
                    fit: true,
                    attribution: 'imageTransform',
                    index: imagePalletObj.id
                }).on('contextmenu', e => imagePalletPopup(map, e, globalStore.removeImagePalletById));
                imageTransform.addTo(map);

                globalStore.setStatusImagePallet(imagePalletObj.id, true);
            }
        }
    }

    return null
}

export default observer(PalletLineView)

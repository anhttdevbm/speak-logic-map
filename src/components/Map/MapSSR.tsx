/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import {observer} from 'mobx-react-lite';
import {GeoJSON, MapContainer} from "react-leaflet";
import {useGlobalStore} from '@/providers/RootStoreProvider';
import {getLocation} from '@/utils/get_geolocation';
import {CountryData} from '@/pages/api/countries';
import stateContents from '@/data/countries.json';

import GridLayer from './MapContents/Grid/Grid';
import Location from './MapContents/Location/Location';
import Markers from './MapContents/Markers/Markers';
import ModalWrap from '../Modals/ModalWrap';
import WorldMode from './MapContents/WorldMode/WorldMode';
import CountryMode from './MapContents/CountryMode/CountryMode';
import Loading from '../Loading/LoadingMap';

import RenameM from '../Modals/ModalContents/RenameM';
import PopulatePropertyM from '../Modals/ModalContents/PopulatePropertyM';
import BoundaryMessageM from '../Modals/ModalContents/BoundaryMessageM';
import ChangeSizeCountryM from '../Modals/ModalContents/ChangeSizeCountryM';
import RenameCountryM from '../Modals/ModalContents/RenameCountryM';

import HouseView from './MapContents/Views/HouseView';
import RoomView from './MapContents/Views/RoomView';
import FloorPlanView from './MapContents/Views/FloorPlanView';
import BoatView from './MapContents/Views/BoatView';
import RectView from './MapContents/Views/RectView';
import TableView from './MapContents/Views/TableView';
import MoreView from "./MapContents/Views/MoreView";
import RelateView from "./MapContents/Views/RelateView";
import HorizontalLineView from "./MapContents/Views/HorizontalLineView";
import InsertCountryM from "@/components/Modals/ModalContents/InsertCountryM";

import ScrollFeature from "../Map/MapContents/ScrollFeature/ScrollFeature";
import ScrollFeatureViewM from '../Modals/ModalContents/ScrollFeatureViewM';
import TextPopupPallet from '../Pallet/PalletItem/TextPopupPallet'
import InsertPersonM from "@/components/Modals/ModalContents/InsertPersonM";
import {FeatureCollection} from "geojson";
import ChangeUnitDistanceM from "@/components/Modals/ModalContents/ChangeUnitDistanceM";
import {notification} from "antd";

const bounds = new L.LatLngBounds(
    new L.LatLng(85, -180),
    new L.LatLng(-100, 180)
);

const getSizeFromModalType = (type: string): number[] => {
    const cutString = type.split("_");
    const sizeInfo = cutString[cutString.length - 1];
    const sizeStringArray = sizeInfo.split(',');
    return sizeStringArray.map(num => Number(num));
}

const getNamesFromModalType = (type: string): string[] => {
    const cutString = type.split("_");
    const nameInfo = cutString[cutString.length - 1];
    return nameInfo.split(',');
}

const MapSSR: React.FC = (): JSX.Element => {
    const globalStore = useGlobalStore();
    const [modal, setModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<string>('');
    const [populateCountry, setPopulateCountry] = useState<string>('');
    const [selectedData, setSelectedData] = useState<CountryData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [geoLocationResult, setGeoLocationResult] = useState<string>('');
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (text: string) => {
        api.open({
            message: 'Warning',
            type: 'warning',
            duration: 3,
            description: text,
        });
    };

    useEffect(() => {
        if (globalStore.showErrorInsertFunction) {
            openNotification('You cannot drag and drop an item except the person into the view.');
            globalStore.setShowErrorInsertFunction(false);
        }
    }, [globalStore.showErrorInsertFunction]);

    useEffect(() => {
        if (globalStore.showErrorInsertPerson) {
            openNotification('You cannot drag and drop an item except the function into the view.')
            globalStore.setShowErrorInsertPerson(false)
        }
    }, [globalStore.showErrorInsertPerson])

    useEffect(() => {
        if (globalStore.showErrorInsertRelationship) {
            openNotification('You cannot insert relationship for this person.')
            globalStore.setShowErrorInsertRelationship(false)
        }
    }, [globalStore.showErrorInsertRelationship])

    const fetchData = async (code: string, type: string) => {
        setIsLoading(true);
        const response = await fetch(`api/${type}/${code}`);
        const data = await response.json();
        setSelectedData(data as CountryData[]);
        setIsLoading(false);
    }

    useEffect(() => {
        const defaultCoordinates = localStorage.getItem('dfLocationCoordinates');

        if (defaultCoordinates) {
            const coordinates: number[] = defaultCoordinates.split(',').map(item => Number(item))
            globalStore.changeDefaultCoordinates(coordinates);
            // if (globalStore.map) {
            //   globalStore.toggleMap();
            // }
        } else {
            getLocation(globalStore.changeCode, globalStore.changeDefaultCoordinates, setGeoLocationResult)
        }
    }, [])

    useEffect(() => {
        const selectedCode = globalStore.searchCode ? globalStore.searchCode : globalStore.code;
        if (selectedCode) {
            fetchData(selectedCode, globalStore.searchMode);
        }
    }, [globalStore.code, globalStore.searchCode, globalStore.searchMode])

    useEffect(() => {
        if (!modal) {
            setModalType('');
        }
    }, [modal]);

    const stateData = stateContents as FeatureCollection;

    return (
        <>
            {contextHolder}
            <MapContainer
                attributionControl={false}
                style={{backgroundColor: "#AAD3DF", width: "100%", height: "100%"}}
                center={[0, 0]}
                zoom={2}
                maxZoom={20}
                minZoom={2}
                maxBounds={bounds}
                maxBoundsViscosity={1}
            >
                <Location setIsLoading={setIsLoading}/>
                {
                    isLoading
                        ? (
                            <Loading/>
                        )
                        :
                        globalStore.map
                            ? (
                                <WorldMode stateData={stateData}/>
                            )
                            : selectedData.length > 0
                                ? (
                                    <CountryMode
                                        setModal={setModal} setModalType={setModalType}
                                        setPopulateCountry={setPopulateCountry} selectedData={selectedData}
                                    />
                                )
                                : <></>
                }
                <GridLayer showGrid={globalStore.grid}/>
                {
                    globalStore.positionOfScroll.length > 0 &&
                    <ModalWrap><ScrollFeatureViewM/></ModalWrap>
                    //     <ScrollFeature data = {[]}/>
                }
                {
                    globalStore.dataScroll && <ScrollFeature/>
                }
                {globalStore.positionOfTextPallet.length > 0 &&
                    <TextPopupPallet position={globalStore.positionOfTextPallet}/>}
                <Markers setModal={setModal} setModalType={setModalType}/>
                {modal && modalType && (
                    <ModalWrap setToggleModal={setModal}>
                        {modalType === 'populate' && populateCountry
                            ? (
                                <PopulatePropertyM
                                    setToggleModal={setModal}
                                    populateCountry={populateCountry}
                                    setPopulateCountry={setPopulateCountry}
                                />
                            )
                            : modalType === 'rename'
                                ? (
                                    <RenameM setToggleModal={setModal}/>
                                )
                                : modalType === 'boundary-problem'
                                    ? (
                                        <BoundaryMessageM type='problem' setToggleModal={setModal}/>
                                    )
                                    : modalType === 'boundary-natural'
                                        ? (
                                            <BoundaryMessageM type='natural' setToggleModal={setModal}/>
                                        )
                                        : modalType.startsWith('change-size-country')
                                            ? (
                                                <ChangeSizeCountryM setToggleModal={setModal}
                                                                    size={getSizeFromModalType(modalType)}/>
                                            )
                                            : modalType.startsWith('rename-country-fn')
                                                ? (
                                                    <RenameCountryM setToggleModal={setModal}
                                                                    names={getNamesFromModalType(modalType)}/>
                                                )
                                                : (
                                                    <></>
                                                )}
                    </ModalWrap>
                )}
                {/*<MapWithCustomContent />*/}
                {selectedData.length > 0 && (
                    <>
                        <HouseView selectedData={selectedData}/>
                        <RoomView selectedData={selectedData}/>
                        <FloorPlanView selectedData={selectedData}/>
                        {/*<BoatView selectedData={selectedData} setModal={setModal} setModalType={setModalType} />*/}
                        {globalStore.boatView !== '' &&
                            <BoatView selectedData={selectedData} setModal={setModal}
                                      setModalType={setModalType}/>}
                        {globalStore.tableView !== '' &&
                            <TableView selectedData={selectedData} setModal={setModal}
                                       setModalType={setModalType}/>}
                        {globalStore.rectangularView !== '' && <RectView selectedData={selectedData}/>}
                        {globalStore.moreName !== '' && <MoreView selectedData={selectedData}/>}
                        {/*<RectView />*/}
                        {/*<MoreView/>*/}
                    </>
                )}

                {globalStore.listPrincipleLine.length > 0
                    && <HorizontalLineView/>}

                {(globalStore.listMapElementSelected?.length > 0 && globalStore.listMapElementRelate?.length > 0)
                    && <RelateView setModal={setModal} setModalType={setModalType}/>}


            </MapContainer>

            {globalStore.rectangularView !== '' && globalStore.showModalInsertCountry && (
                <ModalWrap setToggleModal={setModal}>
                    <InsertCountryM/>
                </ModalWrap>
            )}
            {globalStore.moreName === 'world-as-function' && globalStore.showModalInsertNumberFunctionMoreView && (
                <ModalWrap>
                    <InsertPersonM
                        type={'function'}
                        setToggleModal={globalStore.toggleModalNumberFunctionMoreView}
                        setAction={globalStore.setNumberFunctionMoreView}
                    />
                </ModalWrap>
            )}
            {globalStore.moreName === 'population-view' && globalStore.showModalInsertNumberPersonMoreView && (
                <ModalWrap>
                    <InsertPersonM
                        type={'population-view'}
                        setToggleModal={globalStore.toggleModalNumberPersonMoreView}
                        setAction={globalStore.setNumberPersonMoreView}
                    />
                </ModalWrap>
            )}
            {
                globalStore.showModalInsertNumberPerson &&
                <ModalWrap>
                    <InsertPersonM
                        type={'person'}
                        setToggleModal={globalStore.toggleModalInsertNumberPerson}
                        setAction={globalStore.setNumberPersonForPrincipleLine}
                    />
                </ModalWrap>
            }
            {
                globalStore.showDialogSettingDistance &&
                <ModalWrap>
                    <ChangeUnitDistanceM
                        setToggleModal={globalStore.toggleShowDialogSettingDistance}
                    />
                </ModalWrap>
            }
        </>
    )
}

export default observer(MapSSR)

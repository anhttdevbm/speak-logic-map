import {Marker, Popup, useMap} from "react-leaflet";
import {observer} from 'mobx-react-lite';
import {useCountryStore, useGlobalStore} from "@/providers/RootStoreProvider";
import {useCallback, useEffect, useRef, useState} from "react";
import RectHouse from "@/components/Map/MapContents/Views/rect/RectHouse";
import {allLayer} from "@/components/Map/MapContents/Variables/Variables";
// import './index.css'
const RectView = () => {
    // const map = useMap();
    const globalStore = useGlobalStore();
    const countryStore = useCountryStore();
    const markerRef = useRef(null);
    const position = [44.96479793033104 - 20, -6.416015625000001];
    const [listCountry, setListCountry] = useState(globalStore.listCountryInRect);
    const [listCountrySelected, setListCountrySelected] = useState([]);
    const countryInStore = countryStore.countries;
    const VALUE_RECT_VIEW = ['rect-map', 'rect-name', 'rect-house', 'rect-house-no-border'];

    const LIST_COUNTRY = [
        {fullName: 'Canada', codeName: 'CAN'},
        {fullName: 'United States of America', codeName: 'USA'},
        {fullName: 'Mexico', codeName: 'MEX'},
    ]

    useEffect(() => {
        globalStore.setListCountryInRect(LIST_COUNTRY)
        setListCountry(globalStore.listCountryInRect);
        setListCountrySelected(mappingCountryCodeToInformationCountry(listCountry))
    }, []);

    // useEffect(() => {
    //     if (VALUE_RECT_VIEW.includes(globalStore.rectangularView)) {
    //         openPopup();
    //     }
    // }, [globalStore.rectangularView])

    useEffect(() => {
        if (!globalStore.showModalInsertCountry) {
            setListCountry(globalStore.listCountryInRect);
            let list = mappingCountryCodeToInformationCountry(listCountry);
            setListCountrySelected(list)
        }
    }, [globalStore.listCountryInRect, globalStore.showModalInsertCountry])

    const mappingCountryCodeToInformationCountry = (listCountry) => {
        let listCountryInfor = [];
        for (let i = 0; i < listCountry.length; i++) {
            let countryInfor = countryInStore.filter(item => item.name.codeName === listCountry[i].codeName);
            if (countryInfor.length > 0) {
                listCountryInfor.push(countryInfor[0]);
            }
        }
        return listCountryInfor;
    }

    if (globalStore.rectangularView !== '') {
        return (
            <RectHouse
                listCountry={listCountrySelected}
            />
        )
    }

    return null
}

export default observer(RectView);

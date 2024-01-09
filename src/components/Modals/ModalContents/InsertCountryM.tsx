import React, {useState} from 'react';
import styles from './_ModalContents.module.scss';
import Search from "@/components/Tools/TopTools/ToolItems/Search";
import SearchCountry from "@/components/Tools/TopTools/ToolItems/SearchCountry";
import {useGlobalStore} from "@/providers/RootStoreProvider";
import {CountryName} from "@/pages/api/countries";
import {notification} from "antd";

interface Props {
    setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const shortenName = (name: string): string => {
    let trimName = name.trim();
    return trimName.length > 6 ? `${trimName.slice(0, 6)}...` : trimName;
}

const InsertCountryM = () => {
    const globalStore = useGlobalStore();
    const [country, setCountry] = useState<any>(null);
    const [api, contextHolder] = notification.useNotification();

    const openNotification = () => {
        api.open({
            message: 'Warning',
            type: 'warning',
            duration: 3,
            description:
                'A country cannot be duplicated.  It is not possible to identify a duplicate country or a country twice.  The selected country is already added or in the map and cannot be added to the map or view again.  Please, select another country.',
        });
    };

    const closeModal = (): void => {
        globalStore.toggleModalInsertCountry();
    }

    const checkContainCountry = (country: any) => {
        for (let i = 0; i < globalStore.listCountryInRect.length; i++) {
            if (globalStore.listCountryInRect[i].codeName === country?.codeName) {
                return true;
            }
        }
        return false;
    }

    const handleAddCountry = () => {
        if (checkContainCountry(country)) {
            openNotification();
        } else {
            globalStore.addCountryToRect(country);
            globalStore.toggleModalInsertCountry();
        }
    }

    return (
        <>
            {contextHolder}
            <div className={`${styles['rename-wrap']}`} onClick={e => e.stopPropagation()}>
                <div className={`${styles['rename-header']}`} style={{marginBottom: '15px'}}>
                    <h3>Insert country</h3>
                </div>
                <div>
                    <SearchCountry setCountry={setCountry}/>
                </div>
                <div className={`${styles['rename-btns']}`}>
                    <button type='button' onClick={handleAddCountry}>
                        OK
                    </button>
                    <button type='button' onClick={closeModal}>
                        Cancel
                    </button>
                </div>
            </div>
        </>
    )
}

export default InsertCountryM

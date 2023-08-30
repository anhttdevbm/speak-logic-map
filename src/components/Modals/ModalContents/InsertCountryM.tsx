import React, {useState} from 'react';
import styles from './_ModalContents.module.scss';
import Search from "@/components/Tools/TopTools/ToolItems/Search";
import SearchCountry from "@/components/Tools/TopTools/ToolItems/SearchCountry";
import {useGlobalStore} from "@/providers/RootStoreProvider";

interface Props {
    setToggleModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const shortenName = (name: string): string => {
    let trimName = name.trim();
    return trimName.length > 6 ? `${trimName.slice(0, 6)}...` : trimName;
}

const InsertCountryM = () => {
    const globalStore = useGlobalStore();
    const [country, setCountry] = useState<string>('');

    const closeModal = (): void => {
        // setToggleModal(false);
        globalStore.toggleModalInsertCountry();
    }

    const handleAddCountry = () => {
        globalStore.addCountryToRect(country);
        globalStore.toggleModalInsertCountry();
        console.log('hjfkdnflkds', globalStore.listCountryInRect)
        // setToggleModal(false);
    }

    return (
        <div className={`${styles['rename-wrap']}`} onClick={e => e.stopPropagation()}>
            <div className={`${styles['rename-header']}`}>
                <h3>Insert country</h3>
            </div>
            <div>
                <SearchCountry setCountry={setCountry}/>
            </div>
            {/*<div className={`${styles['rename-input']}`}>*/}
            {/*    <Search/>*/}
            {/*</div>*/}
            <div className={`${styles['rename-btns']}`}>
                <button type='button' onClick={handleAddCountry}>
                    OK
                </button>
                <button type='button' onClick={closeModal}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default InsertCountryM
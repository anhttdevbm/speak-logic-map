/* eslint-disable react-hooks/exhaustive-deps */
import {SearchIcon} from '@/components/Icons/Icons';
import {CountryName} from '@/pages/api/countries';
import {useGlobalStore} from '@/providers/RootStoreProvider';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import styles from './_ToolItem.module.scss';

const searchModes = ['Countries', 'States', 'Cities'];

interface Props {
    setCountry: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchCountry = ({setCountry}) => {
    const globalStore = useGlobalStore();
    const [searchValue, setSearchValue] = useState<string>('');
    const [suggestedValues, setSuggestedValues] = useState<CountryName[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [searchModeIndex, setSearchModeIndex] = useState<number>(0);
    const [fetchedSearchData, setFetchedSearchData] = useState<CountryName[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [isHover, setIsHover] = useState<boolean>(false);
    const [isFocus, setIsFocus] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);

    const handleSearch = (code: string) => {
        // globalStore.addCountryToRect(code);
        setSearchValue(code)
        setCountry(code)
    }

    const fetchSuggestion = async (mode: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/${mode}`);
            const data = await response.json();
            const dt = data as CountryName[];
            setFetchedSearchData(dt);
            setIsLoading(false);
        } catch {
            setIsLoading(false);
            setIsError(true)
        }
    }

    useEffect(() => {
        const index = searchModes.findIndex(mode => mode.toLowerCase() === globalStore.searchMode);
        if (index !== -1 && index !== searchModeIndex) {
            setSearchModeIndex(index);
        }
    }, [globalStore.searchMode])

    // Fetch new data when change to another search mode
    useEffect(() => {
        fetchSuggestion(searchModes[searchModeIndex].toLowerCase());
    }, [searchModeIndex])

    // Set suggested values when search value is valid
    useEffect(() => {
        setIsError(false);
        if (searchValue) {
            setIsSearchLoading(true);
        }
        const timeout = setTimeout(() => {
            let tempSearchList: CountryName[] = [];
            if (searchValue && fetchedSearchData.length > 0) {
                fetchedSearchData.forEach(name => {
                    const fullName = `${name.fullName} (${name.codeName})`;
                    if (fullName.includes(searchValue)) {
                        tempSearchList.push(name);
                    }
                })
            }
            setSelectedIndex(0);
            setSuggestedValues(tempSearchList);
            setIsSearchLoading(false);
        }, 1000);

        return () => {
            clearTimeout(timeout);
        }
    }, [searchValue, fetchedSearchData]);

    // Determine if the search suggestion is active or not
    useEffect(() => {
        if (!isHover && !isFocus) {
            setIsActive(false);
        } else {
            setIsActive(true);
        }
    }, [isHover, isFocus])

    return (
        <div
            className={`${styles['search-wrap']}`}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <div className={`${styles['search']}`}>
                <input
                    type='text' placeholder='Search'
                    value={searchValue}
                    className={`${styles['input']}`}
                    onChange={e => setSearchValue(e.target.value)}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    disabled={isLoading}
                />
                <button
                    type='button' className={`${styles['search-btn']}`}
                    onClick={() => suggestedValues.length > 0 && handleSearch(suggestedValues[selectedIndex].fullName)}
                >
                    <SearchIcon className={`${styles['search-icon']}`}/>
                </button>
            </div>


            <div className={`${styles['search-suggestion']} ${isActive && styles['active']}`}>
                {isLoading
                    ? (
                        <div className={`${styles['search-loading']}`}>
                            Loading data...
                        </div>
                    )
                    : (
                        <>
                            {suggestedValues && (
                                <div className={`${styles['suggestion-results']}`}>
                                    {isError
                                        ? (
                                            <div className={`${styles['search-error']}`}>
                                                Unable to load data. Please try again!
                                            </div>
                                        )
                                        : isSearchLoading
                                            ? (
                                                <div
                                                    className={`${styles['search-loading']} ${styles['search-loading-insert-rect']}`}>
                                                    Searching...
                                                </div>
                                            )
                                            : suggestedValues.length > 0
                                                ? suggestedValues.map((name, index) => (
                                                    <button
                                                        className={`${styles['suggested-btn']} ${styles['suggested-btn-insert-rect']} ${selectedIndex === index ? styles['active'] : null}`}
                                                        key={index}
                                                        onClick={() => handleSearch(name.fullName)}
                                                        onMouseEnter={() => setSelectedIndex(index)}
                                                    >
                                                        {searchModeIndex === 0 ? `${name.fullName} (${name.codeName})` : name.fullName}
                                                    </button>
                                                ))
                                                : searchValue && (
                                                <div className={`${styles['search-error']}`}>
                                                    No result found!
                                                </div>
                                            )
                                    }
                                </div>
                            )}
                        </>
                    )
                }
            </div>
        </div>
    )
}

export default observer(SearchCountry);
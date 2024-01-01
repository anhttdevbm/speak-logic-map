import {CheckIcon, RightArrowIcon, SettingIcon} from '@/components/Icons/Icons';
import {useGlobalStore} from '@/providers/RootStoreProvider';
import {observer} from 'mobx-react-lite';
import React, {memo, useState} from 'react';
import styles from './_ToolItem.module.scss';

const Options: React.FC = (): JSX.Element => {
    const globalStore = useGlobalStore();

    const clearAll = () => {
        !globalStore.houseView && globalStore.toggleClear();
    }

    const turnOnAllLayer = () => {
        globalStore.toggleBlankMap();
    }

    const toggleMoreView = (name: string): void => {
        if (!globalStore.roomView
            && !globalStore.floorPlanView
            && !globalStore.boatView
            && !globalStore.rectangularView
            // && !globalStore.mapView
            && !globalStore.tableView
        ) {
            if (globalStore.moreName === name) {
                globalStore.toggleMoreName('');
                if (globalStore.map) {
                    globalStore.toggleMapView('map-world');
                } else {
                    globalStore.toggleMapView('map-countries');
                }
            } else {
                globalStore.toggleMoreName(name);
                globalStore.toggleMapView('')
            }
        }

    }

    return (
        <button type="button" className={`${styles['left-item-wrap']}`}>
            <SettingIcon/>
            <ul className={`${styles['sub-menu-list']}`}>
                <li>
                    Show Map Element
                    <RightArrowIcon className={`${styles['sub-icon']}`}/>
                    <ul className={`${styles['minor-list']}`}>
                        <li onClick={() => globalStore.changePosition('top')}>
                            Top
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.position !== 'top' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.changePosition('down')}>
                            Down
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.position !== 'down' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.changePosition('left')}>
                            Left
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.position !== 'left' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.changePosition('right')}>
                            Right
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.position !== 'right' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                    </ul>
                </li>
                <li
                    onClick={() => turnOnAllLayer()}>
                    Turn On All Layer
                    <CheckIcon
                        className={`${styles['sub-icon']} ${globalStore.blankMap ? styles['hide'] : styles['show']}`}
                    />
                </li>
                <li className={`${globalStore.map && styles['disable']}`}>
                    Country Mode
                    <ul className={`${styles['minor-list']}`}>
                        <li
                            onClick={() => globalStore.toggleMainLand(true)}
                        >
                            Show Mainland Only
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${!globalStore.mainLand ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.toggleMainLand(false)}>
                            Show All Areas
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.mainLand ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                    </ul>
                </li>
                {/* <li onClick={() => globalStore.toggleShowDistance()}>
          Show Distance
          <CheckIcon className={`
            ${styles['sub-icon']} 
            ${!globalStore.showDistance ? styles['hide'] : styles['show']}
          `}/>
        </li> */}
                <li className={`${!globalStore.houseView && styles['disable']}`}>
                    House View
                    <RightArrowIcon className={`${styles['sub-icon']}`}/>
                    <ul className={`${styles['minor-list']}`}>
                        <li onClick={() => globalStore.toggleCountryName('location')}>
                            Replace Name with &quot;Location + Index&quot;
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.countryName !== 'location' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.toggleCountryName('l')}>
                            Replace Name with &quot;L + Index&quot;
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.countryName !== 'l' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.toggleCountryName('')}>
                            Original Name
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.countryName !== '' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                    </ul>
                </li>
                <li className={`${!globalStore.roomView && styles['disable']}`}>
                    Room View
                    <RightArrowIcon className={`${styles['sub-icon']}`}/>
                    <ul className={`${styles['minor-list']}`}>
                        <li onClick={() => globalStore.toggleRoomDistance()}>
                            Show Distance between Rooms (Very Lag)
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${!globalStore.showRoomDistance ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.toggleRoomName('room')}>
                            Replace Name with &quot;Room + Index&quot;
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.roomName !== 'room' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.toggleRoomName('r')}>
                            Replace Name with &quot;R + Index&quot;
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.roomName !== 'r' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.toggleRoomName('')}>
                            Original Name
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.roomName !== '' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                    </ul>
                </li>
                <li className={`${!globalStore.floorPlanView && styles['disable']}`}>
                    Floor Plan View
                    <RightArrowIcon className={`${styles['sub-icon']}`}/>
                    <ul className={`${styles['minor-list']}`}>
                        <li onClick={() => globalStore.toggleFloorDistance()}>
                            Show Distance between Rooms (Very Lag)
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${!globalStore.showRoomDistance ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.toggleFPRoomName('room')}>
                            Replace Name with &quot;Room + Index&quot;
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.fpRoomName !== 'room' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.toggleFPRoomName('r')}>
                            Replace Name with &quot;R + Index&quot;
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.fpRoomName !== 'r' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.toggleFPRoomName('')}>
                            Original Name
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.fpRoomName !== '' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                    </ul>
                </li>
                <li className={`${!globalStore.boatView && styles['disable']}`}>
                    Boat View
                    <RightArrowIcon className={`${styles['sub-icon']}`}/>
                    <ul className={`${styles['minor-list']}`}>
                        <li onClick={() => globalStore.toggleBoatName('boat')}>
                            Replace Name with &quot;Boat + Index&quot;
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.boatName !== 'boat' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.toggleBoatName('b')}>
                            Replace Name with &quot;R + Index&quot;
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.boatName !== 'b' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.toggleBoatName('')}>
                            Original Name
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.boatName !== '' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.toggleBoatWave()}>
                            Show Boat Wave
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${!globalStore.showBoatWave ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                    </ul>
                </li>

                <li className={`${!globalStore.rectangularView && styles['disable']}`}>
                    Rectangular View
                    <RightArrowIcon className={`${styles['sub-icon']}`}/>
                    <ul className={`${styles['minor-list']}`}>
                        <li onClick={() => globalStore.toggleRectName('rect-non-linear')}>
                            Rectangle View Non-Linear
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.rectName !== 'rect-non-linear' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.toggleRectName('rect-map')}>
                            Show country with map
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.rectName !== 'rect-map' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.toggleRectName('rect-name')}>
                            Show country only name
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.rectName !== 'rect-name' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li className={`${!globalStore.rectangularView}`}>
                            Show country with house
                            <RightArrowIcon className={`${styles['sub-icon']}`}/>
                            <ul className={`${styles['minor-list']}`}>
                                <li onClick={() => globalStore.toggleRectName('rect-house')}>
                                    Show country as house inside rectangle
                                    <CheckIcon
                                        className={`
                        ${styles['sub-icon']} 
                        ${globalStore.rectName !== 'rect-house' ? styles['hide'] : styles['show']}
                      `}
                                    />
                                </li>
                                <li onClick={() => globalStore.toggleRectName('rect-house-no-border')}>
                                    Show country as house outside rectangle
                                    <CheckIcon
                                        className={`
                        ${styles['sub-icon']} 
                        ${globalStore.rectName !== 'rect-house-no-border' ? styles['hide'] : styles['show']}
                      `}
                                    />
                                </li>
                            </ul>
                        </li>
                        <li onClick={() => globalStore.toggleRectName('rect-distance')}>
                            Show distance between country
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.rectName !== 'rect-distance' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.toggleRectName('rect-shot-distance')}>
                            Show shot distance between country
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.rectName !== 'rect-shot-distance' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                    </ul>
                </li>

                <li>
                    More View
                    <RightArrowIcon className={`${styles['sub-icon']}`}/>
                    <ul className={`${styles['minor-list']}`}>
                        <li onClick={() => toggleMoreView('world-as-function')}>
                            World as Function
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.moreName !== 'world-as-function' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => toggleMoreView('population-view')}>
                            Population View
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.moreName !== 'population-view' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li>
                            Population View With Country
                            <RightArrowIcon className={`${styles['sub-icon']}`}/>
                            <ul className={`${styles['minor-list']}`}>
                                <li onClick={() => toggleMoreView('population-view-with-country')}>
                                    Show Population View With Country Original
                                    <CheckIcon className={`
                    ${styles['sub-icon']} 
                    ${globalStore.moreName !== 'population-view-with-country' ? styles['hide'] : styles['show']}
                  `}/>
                                </li>
                                <li onClick={() => toggleMoreView('population-view-principle-line')}>
                                    Show Principle Line With Population View
                                    <CheckIcon
                                        className={`
                        ${styles['sub-icon']} 
                        ${globalStore.moreName !== 'population-view-principle-line' ? styles['hide'] : styles['show']}
                      `}
                                    />
                                </li>
                            </ul>
                        </li>
                        <li onClick={() => toggleMoreView('world-problem-view')}>
                            World Problem View
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.moreName !== 'world-problem-view' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                    </ul>
                </li>

                <li>
                    Show Sun/Moon
                    <RightArrowIcon className={`${styles['sub-icon']}`}/>
                    <ul className={`${styles['minor-list']}`}>
                        <li onClick={() => globalStore.setSunMoon('sun')}>
                            Sun
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.sunMoon !== 'sun' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.setSunMoon('moon')}>
                            Moon
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.sunMoon !== 'moon' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.setSunMoon('')}>
                            None
                            <CheckIcon className={`
                ${styles['sub-icon']}
                ${globalStore.sunMoon ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                    </ul>
                </li>
                <li className={`${globalStore.addIcon !== 'mobility' && styles['disable']}`}>
                    Mobility
                    <RightArrowIcon className={`${styles['sub-icon']}`}/>
                    <ul className={`${styles['minor-list']}`}>
                        <li onClick={() => globalStore.setTypeMobility('path')}>
                            Show move with path
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${(globalStore.addIcon === 'mobility' && globalStore.typeMobility !== 'path') ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                        <li onClick={() => globalStore.setTypeMobility('no-path')}>
                            Show move without path
                            <CheckIcon className={`
                ${styles['sub-icon']} 
                ${(globalStore.addIcon === 'mobility' && globalStore.typeMobility) !== 'no-path' ? styles['hide'] : styles['show']}
              `}/>
                        </li>
                    </ul>
                </li>
                <li onClick={() => clearAll()}>
                    Clear All Elements
                </li>
            </ul>
        </button>
    )
};

export default observer(Options)

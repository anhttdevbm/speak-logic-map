import { CheckIcon, MenuIcon, RightArrowIcon, SimulationIcon, UserIcon } from '@/components/Icons/Icons';
import { useGlobalStore } from '@/providers/RootStoreProvider';
import { observer } from 'mobx-react-lite';
import React, { memo, useState } from 'react';
import styles from './_ToolItem.module.scss';

const Options: React.FC = (): JSX.Element => {
  const globalStore = useGlobalStore();

  const clearAll = () => {
    !globalStore.houseView && globalStore.toggleClear();
  }

  return (
    <button type="button" className={`${styles['left-item-wrap']}`}>
      <UserIcon />
      <ul className={`${styles['sub-menu-list']}`}>
        <li>
          Show Map Element
          <RightArrowIcon className={`${styles['sub-icon']}`} />
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
          <RightArrowIcon className={`${styles['sub-icon']}`} />
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
          <RightArrowIcon className={`${styles['sub-icon']}`} />
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
          <RightArrowIcon className={`${styles['sub-icon']}`} />
          <ul className={`${styles['minor-list']}`}>
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
          <RightArrowIcon className={`${styles['sub-icon']}`} />
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

        <li className={`${!globalStore.rectangularView}`}>
          Rectangular View
          <RightArrowIcon className={`${styles['sub-icon']}`} />
          <ul className={`${styles['minor-list']}`}>
            <li onClick={() => globalStore.toggleRectangularView('rect-map')}>
              Show country with map
              <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.rectangularView !== 'rect-map' ? styles['hide'] : styles['show']}
              `}/>
            </li>
            <li onClick={() => globalStore.toggleRectangularView('rect-name')}>
              Show country only name
              <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.rectangularView !== 'rect-name' ? styles['hide'] : styles['show']}
              `}/>
            </li>
            <li className={`${!globalStore.rectangularView}`}>
              Show country with house
              <RightArrowIcon className={`${styles['sub-icon']}`} />
              <ul className={`${styles['minor-list']}`}>
                <li onClick={() => globalStore.toggleRectangularView('rect-house')}>
                  Show country as house inside rectangle
                  <CheckIcon
                      className={`
                        ${styles['sub-icon']} 
                        ${globalStore.rectangularView !== 'rect-house' ? styles['hide'] : styles['show']}
                      `}
                  />
                </li>
                <li onClick={() => globalStore.toggleRectangularView('rect-house-no-border')}>
                  Show country as house outside rectangle
                  <CheckIcon
                      className={`
                        ${styles['sub-icon']} 
                        ${globalStore.rectangularView !== 'rect-house-no-border' ? styles['hide'] : styles['show']}
                      `}
                  />
                </li>
              </ul>
            </li>
          </ul>
        </li>

        <li className={`${!globalStore.rectangularView}`}>
          More View
          <RightArrowIcon className={`${styles['sub-icon']}`} />
          <ul className={`${styles['minor-list']}`}>
            <li onClick={() => globalStore.toggleMoreView('world-as-country')}>
              World as Function
              <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.rectangularView !== 'rect-map' ? styles['hide'] : styles['show']}
              `}/>
            </li>
            <li onClick={() => globalStore.toggleMoreView('population-view')}>
              Population View
              <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.rectangularView !== 'rect-name' ? styles['hide'] : styles['show']}
              `}/>
            </li>
            <li onClick={() => globalStore.toggleMoreView('population-view-with-map')}>
              Population View With Country
              <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.rectangularView !== 'rect-map' ? styles['hide'] : styles['show']}
              `}/>
            </li>
            <li onClick={() => globalStore.toggleMoreView('world-problem-view')}>
              World Problem View
              <CheckIcon className={`
                ${styles['sub-icon']} 
                ${globalStore.rectangularView !== 'rect-name' ? styles['hide'] : styles['show']}
              `}/>
            </li>
          </ul>
        </li>

        <li>
          Show Sun/Moon
          <RightArrowIcon className={`${styles['sub-icon']}`} />
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
        <li onClick={() => clearAll()}>
          Clear All Elements
        </li>
      </ul>
    </button>
  )
};

export default observer(Options)
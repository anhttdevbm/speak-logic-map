import React from 'react';
import L from 'leaflet';
import styles from '../_MapContents.module.scss';

import ICON_PERSON from '@/assets/icons/user-icon.png';
import ICON_WAVE from '@/assets/images/wave.png';
import ICON_NAVI_SIGN from '@/assets/icons/navigation-sign-icon.png';
import ICON_THREE_DOTs_ICON from '@/assets/icons/three-dots-icon.png';
import ICON_HOUSE from '@/assets/icons/house-icon.png';
import ICON_MAIN_SET from '@/assets/icons/main-set-icon.png';
import ICON_VERTICAL_PERSON from '@/assets/icons/icon-vertical-person.png';
import ICON_VERTICAL_ARROW from '@/assets/icons/vertical-arrow.png';
import ICON_RELATE from '@/assets/icons/related-icon.png';
import ICON_PLUS from '@/assets/icons/plus-icon.png';
import ICON_RELATE_ELEMENT from '@/assets/icons/img.png';
import SCROLL_ICON from '@/assets/icons/simulate-01.png';
import PRINCIPLE_LINE_ICON from '@/assets/icons/icon-priciple-line.png';
import {countryMapList} from '@/utils/country_map_list';
import {countryFlagList} from "@/utils/country_flag_list";

export const markerPersonIcon = (className: string, name: string, image: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [40, 40],
        iconAnchor: [20, 30],
        html: (
            `<img src="${image ? image : ICON_PERSON.src}" style="position: absolute; left: 50%; transform: translateX(-50%);" alt="Person" width="40" height="40" />
      <div class="${styles["marker-person-name"]}">${name}</div>`
        ),
    })
}

export const markerPersonWaveIcon = (className: string, name: string, image: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [40, 40],
        iconAnchor: [20, 30],
        html: (
            `<img src="${image ? image : ICON_PERSON.src}" style="position: absolute; left: 50%; transform: translateX(-50%);" alt="Person" width="40" height="40" />
             <div class="${styles["marker-person-name"]}">${name}</div>
            <img src="${ICON_WAVE.src}" style="margin-top: 30px; margin-left: -30px" width="100" height="100" alt="wave"/>`
        ),
    })
}

export const markerNavigationSignIcon = (className: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [80, 80],
        iconAnchor: [20, 30],
        html: `<img src=${ICON_NAVI_SIGN.src} alt="Naviagtion Sign" width="80" height="80" />`,
    });
}

export const markerPrincipleLineIcon = (className: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [120, 120],
        iconAnchor: [20, 30],
        html: `<img src=${PRINCIPLE_LINE_ICON.src} alt="Principle line" width="120" height="120" />`,
    });
}

export const markerThreeDotsIcon = (className: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [10, 10],
        iconAnchor: [20, 30],
        html: `<img src=${ICON_THREE_DOTs_ICON.src} alt="Group" width="10" height="10"/>`
    });
}

export const markerFnIcon = (className: string, name: string, width = 100, height = 50): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [width, height],
        iconAnchor: [width / 2, height / 2],
        html: name,
    });
}

export const markerCountryFnIcon = (className: string, firstName: string, secondName: string, width = 200, height = 100, fontSize = 16): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [width, height],
        iconAnchor: [width / 2, height / 2],
        html:
            `<div class="${styles["country-fn-name"]}">
      <p style="font-size: ${fontSize}px">${firstName}</p>
      <p style="font-size: ${fontSize}px">${secondName}</p>
    </div>`,
    });
}

export const markerCustomImgIcon = (className: string, name: string, image: string, width: number = 100, height: number = 50): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [width, height],
        iconAnchor: [width / 2, height / 2],
        html: image
            ? `<img src="${image}" style="position: absolute; left: 50%; transform: translateX(-50%); object-fit: cover; object-position: center; width: ${width - 2}px; height: ${height - 2}px;" alt="Function" /> ${name}`
            : name,
    });
}

export const markerCustomAudioIcon = (className: string, name: string, audio: string, width: number = 320, height: number = 75): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [width, height],
        iconAnchor: [width / 2, height / 2],
        html: audio
            ? `<audio controls><source src=${audio} type="audio/mpeg">Your browser does not support the audio tag.</audio>${name}`
            : name
    })
}

export const markerCustomVideoIcon = (className: string, name: string, video: string, width: number = 240, height: number = 135): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [width, height],
        iconAnchor: [width / 2, height / 2],
        html: video
            ? `<video width="${width}" height="${height}" controls><source src=${video} type="video/mp4">Your browser does not support the video tag.</video>${name}`
            : name
    })
}

export const markerFnCircleIcon = (className: string, name: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [80, 80],
        iconAnchor: [40, 40],
        html: name,
    });
}

export const markerHouseIcon = (className: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [50, 50],
        iconAnchor: [20, 30],
        html: `<img src=${ICON_HOUSE.src} alt="House" width="50" height="50" />`
    })
}

export const markerHouseIconWithName = (className: string, name: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [50, 50],
        iconAnchor: [20, 30],
        html: `<img src=${ICON_HOUSE.src} alt="House" width="50" height="50" />
    <div class="${styles["marker-house-name"]}">${name}</div>`
    })
}

export const markerBoatIconWithName = (image: string, className: string, name: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [50, 50],
        iconAnchor: [20, 30],
        html: `
    <img src=${image} alt="House" width="50" height="50" />
    <div class="${styles["marker-house-name"]}">${name}</div>
`
    })
}

export const markerHouseWorldIcon = (className: string, name: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [300, 300],
        // iconAnchor: [20, 30],
        html: (
            `<img src=${ICON_HOUSE.src} alt="House" width="300" height="300" />
      <div class="${styles["marker-house-name"]}">${name}</div>`
        )
    })
}

export const markerRoomIcon = (className: string, name: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [100, 50],
        iconAnchor: [50, 25],
        html: name,
    })
}

export const markerDistancePointIcon = (): L.DivIcon => {
    return L.divIcon({
        className: styles['dot-point-distance'],
    });
}

export const markerBoatWorldIcon = (className: string, name: string, imgSrc: string): L.DivIcon => {
    return L.divIcon({
        className: styles['boat-icon'],
        iconSize: [700, 250],
        html: (
            `<div class="${styles['boat-upper']}">
        <div class="${styles['boat-flag']}">
          <img src="${imgSrc}" alt="${name}"/>
        </div>
        <div class="${styles['boat-pole']}"></div>
      </div>
      <div class="${styles['boat-lower']}">
          <p>${name}</p>
          <div class="${styles['boat-body-horizontal']} ${styles['top']}"></div>
          <div class="${styles['boat-body-horizontal']} ${styles['bottom']}"></div>
          <div class="${styles['boat-body-vertical']} ${styles['left']}"></div>
          <div class="${styles['boat-body-vertical']} ${styles['right']}"></div>
      </div>`
        )
    })
}

export const markerMapElementIcon = (className: string, name: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [190, 70],
        iconAnchor: [50, 25],
        html: name,
    })
}

export const markerGivenSetIcon = (className: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [200, 100],
        iconAnchor: [50, 25],
        html: `<div>
                    <img src=${ICON_MAIN_SET.src} alt="House" width="150" height="150" />
               </div>`,
    })
}

export const markerVerticalPersonIcon = (className: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [200, 100],
        iconAnchor: [50, 25],
        html: `<div>
                    <img src=${ICON_VERTICAL_PERSON.src} alt="House" width="100" height="100" />
               </div>`,
    })
}

export const markerVerticalArrowIcon = (className: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [200, 100],
        iconAnchor: [50, 25],
        html: `<div>
                    <img src=${ICON_VERTICAL_ARROW.src} alt="House" width="100" height="100" />
               </div>`,
    })
}

export const markerRectHouseIcon = (className: string, name: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [100, 120],
        iconAnchor: [50, 25],
        html: `<div>
                    <img src=${ICON_HOUSE.src} alt="House" width="70" height="70" />
                    <div class="${styles["marker-house-name-rect"]}">${name}</div>
               </div>`
    })
}

export const markerRectBoatIcon = (className: string, name: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [100, 120],
        iconAnchor: [50, 25],
        html: `<div>
                    <img src=${ICON_HOUSE.src} alt="House" width="70" height="70" />
                    <div class="${styles["marker-house-name-rect"]}">${name}</div>
               </div>`
    })
}


export const markerRectNameIcon = (className: string, name: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [100, 120],
        iconAnchor: [50, 25],
        html: name,
    })
}

export const markerRelateIcon = (className: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [400, 400],
        iconAnchor: [50, 25],
        html: `<img src=${ICON_RELATE.src} alt="Group" width="100" height="100"/>`
    })
}

export const markerScrollIcon = (): L.DivIcon => {
    return L.divIcon({
        className: '',
        iconSize: [100, 100],
        iconAnchor: [50, 25],
        html: `<img src=${SCROLL_ICON.src} alt="Group" width="50" height="50"/>`
    })
}

export const markerPlusIcon = (className: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [80, 80],
        iconAnchor: [50, 25],
        html: `<img src=${ICON_PLUS.src} alt="Group" width="70" height="70"/>`
    })
}

export const markerPlusMoreViewIcon = (className: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [80, 80],
        iconAnchor: [50, 25],
        html: `<img src=${ICON_PLUS.src} alt="Group" width="30" height="30"/>`
    })
}

export const markerRelateElementIcon = (className: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [80, 80],
        iconAnchor: [50, 25],
        html: `<img src=${ICON_RELATE_ELEMENT.src} alt="Group" width="90" height="90"/>`
    })
}

export const markerMapCountryIcon = (className: string, name: string, code: string): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [100, 120],
        iconAnchor: [50, 25],
        html: `<div>
                    <img src=${countryMapList[code]} alt="House" style="width: 80px" width="80" height="80" />
                    <div class="${styles["marker-house-name-rect"]}">${name}</div>
               </div>`
    })
}

export const markerPopulationCountry = (className: string, name: string, numberPerson: number): L.DivIcon => {
    return L.divIcon({
        className: className,
        iconSize: [180, 100],
        iconAnchor: [20, 30],
        html: numberPerson == 1 ? (
            `<div>
                <div>
                    <img src="${ICON_PERSON.src}" style="transform: translateX(-50%); left: 20px" alt="Person" width="40" height="40" />
                    <img src="${ICON_THREE_DOTs_ICON.src}" style="transform: translateX(-50%);" alt="Dot" width="10" height="10" />
                </div>
                <div class="${styles["marker-house-name-rect"]}">${name}</div>
            </div>`
        ) : (
            `<div>
                <div style="margin-left: 20px">
                    <img src="${ICON_PERSON.src}" style="transform: translateX(-50%);" alt="Person" width="40" height="40" />
                    <img src="${ICON_PERSON.src}" style="transform: translateX(-50%);" alt="Person" width="40" height="40" />
                    <img src="${ICON_THREE_DOTs_ICON.src}" style="transform: translateX(-50%);" alt="Dot" width="10" height="10" />
                </div>
                <div class="${styles["marker-house-name-rect"]}">${name}</div>
            </div>`
        ),
    })
}

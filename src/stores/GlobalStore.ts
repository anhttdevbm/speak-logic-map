import {makeAutoObservable} from "mobx";
import L from "leaflet";
import {CountryName} from "@/pages/api/countries";
import {listMarkerFn} from "@/components/Map/MapContents/Variables/Variables";

export class GlobalStore {
    code: string = '';
    dfLocationCoordinates: number[] = [36.56068927909548, -91.15411382855584];
    searchCode: string = '';
    searchMode: 'countries' | 'cities' | 'states' = 'countries';
    map: boolean = true;
    showDistance: boolean = false;
    grid: boolean = true;
    mainLand: boolean = false;
    simulation: boolean = false;
    position: 'top' | 'down' | 'left' | 'right' = 'right';
    sunMoon: 'sun' | 'moon' | '' = '';
    addIcon: string = "";
    click: boolean = true;
    lock: boolean = false;
    isViewOn: boolean = false;
    houseView: 'house-world' | 'house-countries' | '' = '';
    roomView: 'room-countries' | '' = '';
    floorPlanView: 'floorplan-countries' | '' = '';
    boatView: 'boat-world' | 'boat-countries' | '' = '';
    rectangularView: 'rect-map' | 'rect-name' | 'rect-house' | 'rect-house-no-border' | '' = '';
    mapView: 'map-world' | 'map-countries' | '' = '';
    tableView: '' = '';
    moreView: 'world-as-country' | 'population-view' | 'population-view-with-map' | 'world-problem-view' | '' = '';
    countryName: 'location' | 'l' | '' = '';
    roomName: 'room' | 'r' | '' = '';
    fpRoomName: 'room' | 'r' | '' = '';
    boatName: 'boat' | 'b' | '' = '';
    boundaryMessage: 'problem' | 'natural' | '' = '';
    palletOption: 'pointer' | 'text' | 'line' | 'rectangle' | 'circle' | '' = '';
    clear: boolean = false;
    inAreaSelection: boolean = false;
    showRoomDistance: boolean = false;
    showFloorPlanDistance: boolean = false;
    showBoatWave: boolean = false;
    countryQuantity: number = 0;
    listCountryInRect: CountryName[] = [];
    showModalInsertCountry: boolean = false;
    listMarkerFunction: any[] = [];
    listMarkerPopulation: any[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    setCountryQuantity = (quantity: number) => {
        this.countryQuantity = quantity;
    }

    changeCode = (code: string): void => {
        this.code = code;
        this.searchCode = '';
        this.searchMode = 'countries';
        if (code !== '') {
            localStorage.setItem('dfCountryCode', `${code}`)
        }
    };

    changeDefaultCoordinates = (coordinates: number[]) => {
        this.dfLocationCoordinates = coordinates;
        if (coordinates.length > 0) {
            localStorage.setItem('dfLocationCoordinates', `${coordinates[0]},${coordinates[1]}`);
        }
    }

    changeSearchCode = (code: string): void => {
        this.searchCode = code;
    }

    changeSearchMode = (mode: 'countries' | 'cities' | 'states'): void => {
        this.searchMode = mode;
    }

    changeSearchData = (code: string, mode: 'countries' | 'cities' | 'states'): void => {
        this.searchCode = code;
        this.searchMode = mode;
    }

    changeActiveAreaSelection = (value: boolean): void => {
        this.inAreaSelection = value;
    }

    toggleGrid = (): void => {
        this.grid = !this.grid;
    }

    toggleMap = (): void => {
        this.map = !this.map;
        this.addIcon = "";
        // this.searchCode = "";
        // this.searchMode = 'countries';
    }

    toggleMainLand = (bool: boolean): void => {
        if (!this.map) {
            this.mainLand = bool;
        }
    }

    changeBoundaryMessage = (message: 'problem' | 'natural' | '') => {
        this.boundaryMessage = message;
    }

    changePosition = (position: 'top' | 'down' | 'left' | 'right'): void => {
        this.position = position;
    }

    addIconHandle = (value: string): void => {
        if (value === this.addIcon) {
            this.addIcon = '';
        } else {
            this.addIcon = value;
        }
    }

    toggleClick = (): void => {
        this.click = !this.click;
        this.addIcon = "";
    }

    toggleLock = (): void => {
        this.lock = !this.lock;
    }

    toggleView = (value: boolean): void => {
        this.isViewOn = value;
        console.log(value);
    }

    toggleHouseView = (value: 'house-world' | 'house-countries' | ''): void => {
        if (value === this.houseView) {
            this.houseView = '';
        } else {
            this.houseView = value;
        }
    }

    toggleCountryName = (value: 'location' | 'l' | ''): void => {
        this.countryName = value;
    }

    toggleSimulation = (): void => {
        this.simulation = !this.simulation;
    }

    toggleShowDistance = (): void => {
        this.showDistance = !this.showDistance;
    }

    toggleClear = (): void => {
        this.clear = !this.clear;
    }

    setSunMoon = (value: 'sun' | 'moon' | ''): void => {
        this.sunMoon = value;
    }

    toggleRoomView = (value: 'room-countries' | ''): void => {
        if (value === this.roomView) {
            this.roomView = '';
        } else {
            this.roomView = value;
        }
    }

    toggleRoomName = (value: 'room' | 'r' | ''): void => {
        this.roomName = value;
    }

    toggleRoomDistance = (): void => {
        this.showRoomDistance = !this.showRoomDistance;
    }

    toggleFloorPlanView = (value: 'floorplan-countries' | ''): void => {
        if (value === this.floorPlanView) {
            this.floorPlanView = '';
        } else {
            this.floorPlanView = value;
        }
    }

    toggleFPRoomName = (value: 'room' | 'r' | ''): void => {
        this.fpRoomName = value;
    }

    toggleBoatView = (value: 'boat-world' | 'boat-countries' | ''): void => {
        if (value === this.boatView) {
            this.boatView = '';
        } else {
            this.boatView = value;
        }
    }

    toggleBoatName = (value: 'boat' | 'b' | ''): void => {
        this.boatName = value;
    }

    toggleBoatWave = (): void => {
        this.showBoatWave = !this.showBoatWave;
    }

    toggleRectangularView = (value: 'rect-map' | 'rect-name' | 'rect-house' | 'rect-house-no-border' | ''): void => {
        if (value === this.rectangularView) {
            this.rectangularView = '';
        } else {
            this.rectangularView = value;
        }
    }

    toggleMapView = (value: 'map-world' | 'map-countries' | ''): void => {
        if (value === this.mapView) {
            this.mapView = '';
        } else {
            this.mapView = value;
        }
    }

    toggleMoreView = (value: 'world-as-country' | 'population-view' | 'population-view-with-map' | 'world-problem-view' | ''): void => {
        if (value === this.moreView) {
            this.moreView = '';
        } else {
            this.moreView = value;
        }
    }

    togglePalletOption = (value: 'pointer' | 'text' | 'line' | 'rectangle' | 'circle' | ''): void => {
        if (value === this.palletOption) {
            this.palletOption = '';
        } else {
            this.palletOption = value;
        }
    }

    toggleModalInsertCountry = (): void => {
        this.showModalInsertCountry = !this.showModalInsertCountry;
    }

    setListCountryInRect = (countries: CountryName[]): void => {
        this.listCountryInRect = countries;
    }

    addCountryToRect = (country: CountryName): void => {
        if (country && country.fullName !== '') {
            this.listCountryInRect.push(country)
        }
    }

    removeCountryToRect = (country: any): void => {
        this.listCountryInRect = this.listCountryInRect.filter((item: any) => item.codeName !== country);
    }

    addMarkerFnToList = (index: number): void => {
        this.listMarkerFunction.push({key: index, value: 'Function ' + index})
    }

    removeMarkerFnList = (index: number): void => {
        debugger
        this.listMarkerFunction = this.listMarkerFunction.filter((item: any) => item.key != index)
    }

    addMarkerPopulationToList = (index: number): void => {
        this.listMarkerPopulation.push({key: index, value: 'Function ' + index})
    }

    removeMarkerPopulationList = (index: number): void => {
        debugger
        this.listMarkerPopulation = this.listMarkerPopulation.filter((item: any) => item.key != index)
    }
}
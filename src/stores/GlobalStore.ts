
import {makeAutoObservable, values} from "mobx";
import L from "leaflet";
import {CountryName} from "@/pages/api/countries";

export class GlobalStore {
    code: string = '';
    dfLocationCoordinates: number[] = [36.56068927909548, -91.15411382855584];
    searchCode: string = '';
    searchMode: 'countries' | 'cities' | 'states' = 'countries';
    map: boolean = true;
    mapLayer: any[] = [];
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
    rectangularView: 'rect-country' | 'rect-world' | '' = '';
    mapView: 'map-world' | 'map-countries' | '' = 'map-world';
    tableView: 'table-world' | 'table-countries' | '' = '';
    moreView: 'more-world' | 'more-countries' | '' = '';
    moreName: 'world-as-function' | 'population-view' | 'population-view-with-country' | 'world-problem-view' | '' = '';
    countryName: 'location' | 'l' | '' = '';
    roomName: 'room' | 'r' | '' = '';
    fpRoomName: 'room' | 'r' | '' = '';
    rectName: 'rect-non-linear' | 'rect-map' | 'rect-name' | 'rect-house' | 'rect-house-no-border' | 'rect-distance' | 'rect-shot-distance' | '' = '';
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
    showModalInsertNumberFunctionMoreView: boolean = false;
    showModalInsertNumberPersonMoreView: boolean = false;
    showModalInsertNumberPerson: boolean = false;
    listMarkerFunction: any[] = [];
    listMarkerPopulation: any[] = [];
    listMarkerProblem: any[] = [];
    positionOfScroll: any[] = [];
    positionOfHorizontalLine: any[] = [];
    numberPersonInHorizontalLine = 0;
    numberFunctionMoreView = 0;
    numberPersonMoreView = 0;
    chooseGivenSet = false;
    dataScroll: any = null;
    positionOfTextPallet: any[] = [];
    mapElementSelected = '';
    mapElementRelate = '';
    positionOfMapElementSelected: any[] = [];
    typeMobility: 'path' | 'no-path' | '' = 'path';
    numberPersonMobility: any = 0;
    positionOfPreviewPerson: any = [];

    constructor() {
        makeAutoObservable(this);
    }

    setDataScroll = (value: any) => {
        this.dataScroll = value;
    }
    resetDataScroll = () => {
        this.dataScroll = null
    }

    setPositionOfScroll = (lat: number, lng: number) => {
        this.positionOfScroll = [lat, lng];
    }

    setPositionOfHorizontalLine = (lat: number, lng: number) => {
        this.positionOfHorizontalLine = [lat, lng];
    }

    resetPositionOfHorizontalLine = () => {
        this.positionOfHorizontalLine = [];
        this.numberPersonInHorizontalLine = 0;
        this.chooseGivenSet = false;
    }
    setNumberPersonInHorizontalLine = (value: number) => {
        this.numberPersonInHorizontalLine = value;
    }

    setNumberFunctionMoreView = (value: number) => {
        this.numberFunctionMoreView = value;
    }

    setNumberPersonMoreView = (value: number) => {
        this.numberPersonMoreView = value;
    }

    setPositionOfTextPallet = (lat: number, lng: number) => {
        this.positionOfTextPallet = [lat, lng];
    }

    resetPositionScroll = () => {
        this.positionOfScroll = [];
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
    }

    toggleHouseView = (value: 'house-world' | 'house-countries' | ''): void => {
        if (value === this.houseView) {
            this.houseView = '';
            this.mapView = 'map-world'
        } else {
            this.houseView = value;
            this.mapView = ''
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
            this.mapView = 'map-world'
        } else {
            this.roomView = value;
            this.mapView = ''
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
            this.mapView = 'map-world'
        } else {
            this.floorPlanView = value;
            this.mapView = ''
        }
    }

    toggleFPRoomName = (value: 'room' | 'r' | ''): void => {
        this.fpRoomName = value;
    }

    toggleBoatView = (value: 'boat-world' | 'boat-countries' | ''): void => {
        if (value === this.boatView) {
            this.boatView = '';
            this.mapView = 'map-world'
        } else {
            this.boatView = value;
            this.mapView = ''
        }
    }

    toggleBoatName = (value: 'boat' | 'b' | ''): void => {
        this.boatName = value;
    }

    toggleBoatWave = (): void => {
        this.showBoatWave = !this.showBoatWave;
    }

    toggleRectangularView = (value: 'rect-country' | 'rect-world' | ''): void => {
        if (value === this.rectangularView) {
            this.rectangularView = '';
            this.mapView = 'map-world'
        } else {
            this.rectangularView = value;
            this.mapView = ''
        }
    }

    toggleRectName = (value: 'rect-non-linear' | 'rect-map' | 'rect-name' | 'rect-house' | 'rect-house-no-border' | 'rect-distance' | 'rect-shot-distance' | ''): void => {
        if (value === this.rectName) {
            this.rectName = '';
        } else {
            this.rectName = value;
        }
    }

    toggleMapView = (value: 'map-world' | 'map-countries' | ''): void => {
        this.mapElementRelate = '';
        this.mapElementSelected = '';
        this.positionOfMapElementSelected = [];
        this.numberPersonMobility = 0;
        if (value === this.mapView) {
            this.mapView = '';
        } else {
            this.mapView = value;
            // this.mapElementSelected = '';
            // this.mapElementRelate = '';
        }
    }

    toggleTableView = (value: 'table-world' | 'table-countries' | ''): void => {
        if (value === this.tableView) {
            this.tableView = '';
            this.mapView = 'map-world'
        } else {
            this.tableView = value;
            this.mapView = ''
        }
    }

    toggleMoreView = (value: 'more-world' | 'more-countries' | ''): void => {
        if (value === this.tableView) {
            this.moreView = '';
            this.mapView = 'map-world'
        } else {
            this.moreView = value;
            this.mapView = ''
        }
    }

    toggleMoreName = (value: any): void => {
        if (value === this.moreName) {
            this.moreName = '';
            this.mapView = 'map-world'
        } else {
            this.moreName = value;
        }
    }

    togglePalletOption = (value: 'pointer' | 'text' | 'line' | 'rectangle' | 'circle' | ''): void => {
        if (value === this.palletOption) {
            this.palletOption = '';
        } else {
            this.palletOption = value;
        }
    }

    setTypeMobility = (value: 'path' | 'no-path'): void => {
        if (value === this.typeMobility) {
            this.typeMobility = '';
        } else {
            this.typeMobility = value;
        }
    }

    setNumberPersonMobility = (): void => {
        this.numberPersonMobility = this.numberPersonMobility + 1;
    }

    resetNumberPersonMobility = (): void => {
        this.numberPersonMobility = 0;
    }

    setPositionOfPreviewPerson = (lat: number, lng: number) => {
        this.positionOfPreviewPerson = [lat, lng];
    }

    toggleModalInsertCountry = (): void => {
        this.showModalInsertCountry = !this.showModalInsertCountry;
    }

    toggleModalNumberFunctionMoreView = (): void => {
        this.showModalInsertNumberFunctionMoreView = !this.showModalInsertNumberFunctionMoreView;
    }

    toggleModalNumberPersonMoreView = (): void => {
        this.showModalInsertNumberPersonMoreView = !this.showModalInsertNumberPersonMoreView;
    }
    toggleModalInsertNumberPerson = (): void => {
        this.showModalInsertNumberPerson = !this.showModalInsertNumberPerson;
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

    removeVerticalIcon = (): void => {
        this.numberPersonInHorizontalLine = this.numberPersonInHorizontalLine - 1;
    }

    setChooseGivenSet = (value: boolean): void => {
        this.chooseGivenSet = value;
    }

    removeHorizontalIcon = (): void => {
        this.positionOfHorizontalLine = [];
        this.numberPersonInHorizontalLine = 0;
    }

    addMarkerFnToList = (index: number): void => {
        if (this.listMarkerFunction.filter(item => item.key == index).length === 0) {
            this.listMarkerFunction.push({key: index, value: 'Function ' + index, shape: 'rectangle'})
        }
    }

    addMarkerFnToNearLast = (index: number): void => {
        if (this.listMarkerFunction.filter(item => item.key == index).length === 0) {
            let newElement = {key: index, value: 'Function ' + index, shape: 'rectangle'};
            let positionBeforeEnd = this.listMarkerFunction.length - 2;
            this.listMarkerFunction.splice(positionBeforeEnd, 0, newElement);
        }
    }

    addMarkerPersonToNearLast = (index: number): void => {
        if (this.listMarkerPopulation.filter(item => item.key == index).length === 0) {
            let newElement = {key: index, value: 'Person  ' + index};
            let positionBeforeEnd = this.listMarkerPopulation.length - 2;
            this.listMarkerPopulation.splice(positionBeforeEnd, 0, newElement);
        }
    }

    setShapeOfMarkerFn = (name: number, shape: string): void => {
        for (let i = 0; i < this.listMarkerFunction.length; i++) {
            if (this.listMarkerFunction[i].value === name) {
                this.listMarkerFunction[i].shape = shape;
            }
        }
    }
    setShapeOfMarkerPl = (name: number, shape: string): void => {
        for (let i = 0; i < this.listMarkerProblem.length; i++) {
            if (this.listMarkerProblem[i].value === name) {
                this.listMarkerProblem[i].shape = shape;
            }
        }
    }

    removeMarkerFnList = (index: number): void => {
        this.listMarkerFunction = this.listMarkerFunction.filter((item: any) => item.key != index)
    }

    addMarkerPopulationToList = (index: number): void => {
        this.listMarkerPopulation.push({key: index, value: 'Person  ' + index})
    }

    removeMarkerPopulationList = (index: number): void => {
        this.listMarkerPopulation = this.listMarkerPopulation.filter((item: any) => item.key != index)
    }

    addMarkerProblemToList = (index: number): void => {
        this.listMarkerProblem.push({key: index, value: 'Problem ' + index, shape: 'rectangle'})
    }

    setMapElementSelected = (value: any): void => {
        this.mapElementSelected = value;
    }

    setMapElementRelate = (value: any): void => {
        this.mapElementRelate = value;
    }

    setPositionOfMapElementSelected = (lat: number, lng: number) => {
        this.positionOfMapElementSelected = [lat, lng];
    }

    setMapLayer = (lat: any, lng: any, value: any, type: 'person' | 'function'): void => {
        this.mapLayer.push({lat: lat, lng: lng, name: value, type: type})
    }
}

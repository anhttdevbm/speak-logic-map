import { makeAutoObservable } from "mobx";

export interface SimulationSettingInterface {
  // General
  flashTime: number;
  fillTime: number;
  listShape: string;
  signalTypes: string;
  checkErrorFor: string;
  holderFlash: string;
  allShapeBlink: string;
  commAndAppMixTogether: string;
  commMixTogether: string;
  // Signal Travel
  stTypes: string;
  stTokenTravelTime: number;
  stShowSignal: string;
  transitionTime: number;
  discardTime: number;
  boundary: string;
  effectedFunction: string;
}

export class SimulationSettingStore implements SimulationSettingInterface {
  // General
  flashTime = 1000;
  fillTime = 2000;
  listShape = 'Yes';
  signalTypes = 'Green';
  checkErrorFor = 'Person';
  holderFlash = 'Signal Type';
  allShapeBlink = 'Yes';
  commAndAppMixTogether = 'Yes';
  commMixTogether = 'Yes';
  // Signal Travel
  stTypes = "Online";
  stTokenTravelTime = 5000;
  stShowSignal = 'Yes';
  transitionTime = 1000;
  discardTime = 1000;
  boundary = 'Yes';
  effectedFunction = 'Random';

  constructor() {
    makeAutoObservable(this);
  }

  saveSetting = (setting: SimulationSettingInterface): void => {
    this.flashTime = setting.flashTime;
    this.fillTime = setting.fillTime;
    this.listShape = setting.listShape
    this.signalTypes = setting.signalTypes
    this.checkErrorFor = setting.checkErrorFor
    this.holderFlash = setting.holderFlash;
    this.allShapeBlink = setting.allShapeBlink
    this.commAndAppMixTogether = setting.commAndAppMixTogether
    this.commMixTogether = setting.commMixTogether
    this.stTypes = setting.stTypes
    this.stTokenTravelTime = setting.stTokenTravelTime
    this.stShowSignal = setting.stShowSignal
  }
}
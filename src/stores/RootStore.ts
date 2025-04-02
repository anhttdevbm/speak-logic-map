import { CountryStore } from "./CountryStore";
import { GlobalStore } from "./GlobalStore";
import { SimulationSettingStore } from "./SimulationSettingStore";
import { UserStore } from "./UserStore";

export type RootStoreHydration = {};

export class RootStore {
  globalStore: GlobalStore;
  userStore: UserStore;
  simulationSettingStore: SimulationSettingStore;
  countryStore: CountryStore;

  constructor() {
    this.globalStore = new GlobalStore();
    this.userStore = new UserStore();
    this.simulationSettingStore = new SimulationSettingStore();
    this.countryStore = new CountryStore();
  }

  // hydrate(_data: RootStoreHydration) {
  //   console.log("hydrate");
  // }
}
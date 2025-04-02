import { makeAutoObservable } from "mobx";
import {CountryName, CountryData} from '@/pages/api/countries/index';

export interface CountryStoreData {
  name: CountryName;
  data: CountryData[];
}

export class CountryStore {
  countries: CountryStoreData[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setCountryData = (name: CountryName, data: CountryData[]) => {
    if (this.countries.length === 0 || this.countries[this.countries.length - 1].name.fullName !== name.fullName) {
      this.countries = [...this.countries, {name, data}];
      // console.log(name, data);
      // console.log(this.countries.length);
    }
  }

  setAllCountryData = (data: CountryStoreData[]) => {
    this.countries = data;
  }
}

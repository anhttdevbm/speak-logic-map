import { makeAutoObservable } from "mobx";

export class UserStore {
  username: string;
  password: string;

  constructor() {
    makeAutoObservable(this);
    this.username = '';
    this.password = '';
  }

  setUser = (un: string, pw: string): void => {
    this.username = un;
    this.password = pw;
  }
}

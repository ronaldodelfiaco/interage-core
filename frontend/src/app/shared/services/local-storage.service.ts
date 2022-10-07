import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private storage: Storage;

  constructor() { this.storage = window.localStorage; }

  public set(key: string, value: any) {
    if (this.storage) {
      if (value instanceof Date)
        this.storage.setItem(`${key}_date`, value.toString());
      else if (typeof value === 'object')
        this.storage.setItem(`${key}_object`, JSON.stringify(value));
      else
        this.storage.setItem(`${key}_string`, value);
      return true;
    }
    return false;
  }

  public get(key: string) {
    let retDate = this.storage.getItem(`${key}_date`)
    if (retDate)
      return new Date(retDate);

    let retObject = this.storage.getItem(`${key}_object`)
    if (retObject)
      return JSON.parse(retObject)
    return this.storage.getItem(`${key}_string`)
  }

  public clear() {
    if (this.storage) {
      this.storage.clear();
      return true;
    }
    return false;
  }

  public remove(key: string, value: string) {

    if (this.storage) {
      if (value == 'date')
        localStorage.removeItem(`${key}_date`)
      else if (value == 'object')
        localStorage.removeItem(`${key}_object`)
      else
        localStorage.removeItem(`${key}_string`)
    }
    return false;
  }
}

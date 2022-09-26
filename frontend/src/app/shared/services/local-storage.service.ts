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
        this.storage.setItem(`${key}`, value.toString());
      else if (typeof value === 'object')
        this.storage.setItem(`${key}`, JSON.stringify(value));
      else
        this.storage.setItem(`${key}`, value);
      return true;
    }
    return false;
  }

  public get(key: string) {
    let retDate = this.storage.getItem(`${key}`)
    if (retDate)
      return new Date(retDate);

    let retObject = this.storage.getItem(`${key}`)
    if (retObject)
      return JSON.parse(retObject)
    return this.storage.getItem(`${key}`)
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
        localStorage.removeItem(`${key}`)
      else if (value == 'object')
        localStorage.removeItem(`${key}`)
      else
        localStorage.removeItem(`${key}`)
    }
    return false;
  }
}

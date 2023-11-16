import { Injectable, Inject } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
  export class StorageService {
  
    constructor(@Inject('LOCAL_STORAGE') private storage: Storage) { }
  
    setItem(key: string, value: any) {
      this.storage.setItem(key, JSON.stringify(value));
    }
  
    getItem(key: string) {
      const value = this.storage.getItem(key);
      return value ? JSON.parse(value) : null;
    }
  
    removeItem(key: string) {
      this.storage.removeItem(key);
    }
  
    clear() {
      this.storage.clear();
    }
  }
  
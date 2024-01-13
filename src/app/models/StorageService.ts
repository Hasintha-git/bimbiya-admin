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
  
    
  get(key: string): any {
    return localStorage ? localStorage.getItem(key) : null;
  }

  set(key: string, value: any): void {
    if (localStorage) {
      localStorage.setItem(key, value);
    }
  }

  setSession(token: string): void {
    sessionStorage.setItem('session', token);
  }

  setRefreshToken(token: string): void {
    sessionStorage.setItem('refresh_token', token);
  }

  setUser(user: string): void {
    sessionStorage.setItem('user', user);
  }

  getUser(): string {
    return sessionStorage.getItem('user');

  }

  setPwd(pwd: string): void {
    sessionStorage.setItem('pwd', pwd);
  }

  getPwd(): string {
    return sessionStorage.getItem('pwd');
  }

  setActiveSection(activeSection: string): void {
    sessionStorage.setItem('activeSection', activeSection);
  }

  getActiveSection(): string {
    return sessionStorage.getItem('activeSection');
  }

  setActivePage(activePage: string): void {
    sessionStorage.setItem('activePage', activePage);
  }

  getActivePage(): string {
    return sessionStorage.getItem('activePage');
  }


  getRefreshToken():string {
    try {
      let session = sessionStorage.getItem('refresh_token');
      return session;
    } catch (ex) {
      return null;
    }
  }

  getSession():string {
    try {
      let session = sessionStorage.getItem('session');
      return session;
    } catch (ex) {
      return null;
    }
  }
    clear() {
      this.storage.clear();
    }
  }
  
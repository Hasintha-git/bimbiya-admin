export class Token {
    jwt: string;
    refreshToken: string;
  
    constructor(jwt: string, refreshToken: string) {
      this.jwt = jwt;
      this.refreshToken = refreshToken;
    }
  }
  
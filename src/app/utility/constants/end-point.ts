const HOST: string = 'localhost';
// const HOST: string = '104.152.222.98';
const PORT: string = '8080';
export const REGISTER: string = 'http://localhost:4200/register';

export const SECURE = false;

export const getEndpoint = (isHttps:any) => {
  return `${isHttps ? 'https' : 'http'}://${HOST}:${PORT}/admin`;
};

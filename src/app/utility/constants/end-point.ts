const HOST: string = 'localhost';
const PORT: string = '8066';
export const REGISTER: string = 'http://localhost:4200/register';

export const SECURE = false;

export const getEndpoint = (isHttps:any) => {
  return `${isHttps ? 'https' : 'http'}://${HOST}:${PORT}/admin`;
};

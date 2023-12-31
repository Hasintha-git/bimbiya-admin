const HOST: string = '104.152.222.98';
const PORT: string = '8066';
export const REGISTER: string = 'http://localhost:4200/register';

export const SECURE = true;

export const getEndpoint = (isHttps:any) => {
  return `${isHttps ? 'https' : 'http'}://${HOST}:${PORT}/admin`;
};

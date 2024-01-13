const HOST: string = 'localhost';

//production
// const HOST: string = 'bimbiya.com';

const PORT: string = '8080';

//production - true
export const SECURE = false;

export const getEndpoint = (isHttps:any) => {
  //production point
  // return `${isHttps ? 'https' : 'http'}://${HOST}/admin`;
  
  return `${isHttps ? 'https' : 'http'}://${HOST}:${PORT}/admin`;
};

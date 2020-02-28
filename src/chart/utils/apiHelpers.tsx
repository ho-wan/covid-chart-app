// getRequest object with credentials
export const getRequest = (): RequestInit => ({
  method: 'GET',
  mode: 'cors',
  credentials: 'include',
  headers: {
    Accept: '*/*',
  },
});

import axios, { Method } from 'axios';
import { API_URL } from '../config';
import queryString from 'query-string';

export default class ApiService {
  protected apiGet(url: string, params: object = {}): Promise<any> {
    return this.apiRun('get', url, null, params);
  }

  protected apiPost(
    url: string,
    body: any = null,
    params: object = {},
    baseURL?: string
  ): Promise<any> {
    return this.apiRun('post', url, body, params, baseURL);
  }

  protected apiPut(
    url: string,
    body: any = null,
    params: object = {}
  ): Promise<any> {
    return this.apiRun('put', url, body, params);
  }

  protected apiDelete(url: string, params: object = {}): Promise<any> {
    return this.apiRun('delete', url, null, params);
  }

  private apiRun(
    method: Method,
    url: string,
    body: any = null,
    params: object = {},
    baseURL: string = API_URL
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      axios({
        url,
        method,
        baseURL: `${baseURL}`,
        params,
        data: queryString.stringify(body),
        headers: {
          accept: 'application/json',
          'X-API-KEY': 'askr_dbfb6f33e7d3c6b6e334b2d420f81465',
        },
        timeout: 5000, // 2 seconds because we want immediate feedback when network is bad.
        timeoutErrorMessage: 'Request timed out',
      })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          const errorData =
            !error.response && !error.code ? undefined : error?.response?.data;
          reject(errorData);
        });
    });
  }
}

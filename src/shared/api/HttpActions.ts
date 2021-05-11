import {AxiosResponse} from 'axios';
import axios from './axios';

//export const address: string = `http://192.168.45.218:8082`;
export const address: string = `http://${location.hostname}:8082`;


class HttpActions {
  private request: any;

  constructor(baseURL: string) {
    this.request = axios(baseURL);

    this.request.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => response,
      (error: any) => {
        return Promise.reject(error.response.data.message)
    });
  }

  

  public get<T>(url: string, params?: Object, options?: Object) {
    const config= { params, ...options };
    return this.request.get(url, config);
  }

  public post<T>(url: string, data?: any, options?: Object) {
    return this.request.post(url, data, options);
  }

  public patch<T>(url: string, data: any, options?: Object) {
    return this.request.patch(url, data, options);
  }

  public del<T>(url: string, data?: any, params?: Object, options?: Object) {
    const config = { url, data, params, ...options };
    return this.request.delete(url, config);
  }

  public put<T>(url: string, data?: any, params?: Object, options?: Object) {
    return this.request.put(url, data, { params, ...options });
  }
}

export default HttpActions;

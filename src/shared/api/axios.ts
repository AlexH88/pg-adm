import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { push } from 'connected-react-router';
import { store } from '../../index';
import * as qs from 'qs';

import { address } from './HttpActions';

interface Token {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: 'all';
  token_type: 'bearer';
}

if (!localStorage.getItem('userCredentials')) {
  localStorage.setItem('userCredentials', JSON.stringify({ access_token: '', refresh_token: '' }));
}

const addBearerTokenInRequest = (request: AxiosRequestConfig): AxiosRequestConfig => {
  const userCredentials = localStorage.getItem('userCredentials');
  const token: Token = userCredentials ? JSON.parse(userCredentials) : '';
  request.headers.Authorization = `Bearer ${token.access_token}`;
  return request;
};

const refreshToken = async (error: AxiosError): Promise<any> => {

  if (
    error
    && error.response
    && error.response.status !== 401
    && error.response.data
    && error.response.data.error !== 'invalid_token'
  ) {
    throw error;
  }
  const userCredentials = localStorage.getItem('userCredentials');
  const token: Token = userCredentials ? JSON.parse(userCredentials) : '';
  
  if (!token.refresh_token.length) {
    //store.dispatch(setCurrentRole('guest'));
    store.dispatch(push('/login'));
    return;
  }
  
  try {
    const requestConfig = {
      auth: {
        username: 'secret_oauth_client',
        password: '2D98A93FE86A0EAA550AE2AD89264E39',
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };
    const body = qs.stringify({
      refresh_token: token.refresh_token,
      grant_type: 'refresh_token',
    });
    const response: AxiosResponse<Token> = await axios.post(
      `${address}/api/oauth/token`,
      body,
      requestConfig,
    );

    const {
      access_token,
      refresh_token
    }: Token = response.data;

    localStorage.setItem('userCredentials', JSON.stringify({ access_token, refresh_token }));
    error.config.headers.Authorization = `Bearer ${access_token}`;
    return axios(error.config);
  } catch (e) {
    localStorage.setItem('userCredentials', JSON.stringify({ refresh_token: '', access_token: '' }));
    //store.dispatch(setCurrentRole('guest'));
    store.dispatch(push('/login'));
  }
};

const createAxiosInstance = (baseUrl: string) => {
  const AxiosInstance = axios.create({
    baseURL: baseUrl,
    paramsSerializer: (params: any) => qs.stringify(params, {arrayFormat: 'repeat'})
  });

  AxiosInstance.interceptors.request.use(addBearerTokenInRequest);

  AxiosInstance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    refreshToken,
  );
  return AxiosInstance;
}

export default createAxiosInstance;

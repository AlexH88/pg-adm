import {IResource} from 'shared/types/app';

interface IAggregate {
  [index: string]: any;
  total_items: number;
}

interface IResourceResponse {
  data: IResource[];
  aggregate: IAggregate;
}

interface IResourceSyncData {
  sync: string[];
  unsync: string[];
}

interface IResponse {
  [page: number]: IResource[];
}


interface ISort {
  by?: string;
  order?: 'asc' | 'desc' | undefined;
}

type IPageResource = IResource[][];

interface IResourceReduxState {
  currentOperator: any;
  isLoading: boolean;
  data: IResource[][] | IResource[];
  prompt: any;
  short: any;
  gallery: any;
  aggregate: IAggregate;
  sort: ISort;
  currentPage: number;
  pages: 0;
  pullingData: boolean;
  headers: IHeader[];
  timerId: any;
  showSpinner: boolean;
}



interface IReduxState {
  [resource: string]: IResourceReduxState;
  alertData: any;
  short?: any;
}


interface IFailedResponse {
  error: string;
}

interface IHeader {
  title: string;
  value: string;
  isConnected?: boolean;
  isSortable?: boolean;
}

export {
  IReduxState,
  ISort,
  IResourceReduxState,
  IAggregate,
  IResourceResponse,
  IPageResource,
  IFailedResponse,
  IHeader,
  IResponse,
  IResourceSyncData
};

export * from './actionTypes';

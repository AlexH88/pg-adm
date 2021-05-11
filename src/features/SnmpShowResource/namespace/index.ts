import { IResource } from 'shared/types/app';

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

interface ISnmpResourceReduxState {
  currentOperator: any;
  isLoading: boolean;
  // data: IResource[][] | IResource[];
  data: any;
  prompt: any;
  short: any;
  gallery: any;
  aggregate: IAggregate;
  sort: ISort;
  currentPage: number;
  pages: any;
  pullingData: boolean;
  headers: IHeader[];
  timerId: any;
  showSpinner: boolean;
  picture: string;
  pictureId: any;
  printerSize: any;
  currentPageId: number;
  totalFloor: number;
  totalPrinter: number;
  printers: any,
  addPrinters: any,
  errorFloors: any
}

interface ISnmpReduxState {
  [resource: string]: ISnmpResourceReduxState;
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
  // IReduxState,
  ISnmpReduxState,
  ISort,
  // IResourceReduxState,
  ISnmpResourceReduxState,
  IAggregate,
  IResourceResponse,
  IPageResource,
  IFailedResponse,
  IHeader,
  IResponse,
  IResourceSyncData
};

export * from './actionTypes';

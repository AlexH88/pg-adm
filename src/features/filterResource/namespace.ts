import {IResource} from 'shared/types/app';

interface IAggregate {
  [index: string]: any;
  total_items: number;
}

interface IResourceResponse {
  data: IResource[];
  aggregate: IAggregate;
}

type FilterType = 'valueFilter' | 'multiFilter' | 'calendar' | 'selectFilter' | 'autocompleteFilter';

interface IFilter {
  name: string;
  type: FilterType;
  isConnected: boolean;
  title: string;
  values?: Array<{ id: number, name: string, label?: string }>;
}

interface IFilterRequest {
  param: string;
  type: FilterType;
  isConnected: boolean;
  title: string;
  values?: Array<{ id: any, name: string }>;
}

interface IFilterResponse {
  filters: IFilterRequest[];
}

interface ISearch {
  [page: number]: IResource[];
}


interface ISort {
  by?: string;
  order?: 'asc' | 'desc' | undefined;
}

interface IPageResource {
  [page: number]: IResource[];
}

interface IHeader {
  title: string;
  value: string;
  isConnected?: boolean;
  isSortable?: boolean;
}

type IFilterConfig = string | ICalendar | number | Array<string | number > | IFilterConfigs;
interface IFilterConfigs {
  [key: string]: IFilterConfig;
}

interface IResourceReduxState {
  headers: IHeader[];
  filters: IFilter[];
  filterConfigs: IFilterConfigs;
  filterOptions: any;
}

interface IReduxState {
  [resource: string]: IResourceReduxState;
  searchString?: any;
}

interface ICalendar {
  [index: string]: number;
  from: number;
  to: number;
}

export {
  IFilterConfigs,
  IFilterConfig,
  IHeader,
  IReduxState,
  ISort,
  IResourceReduxState,
  IAggregate,
  IPageResource,
  IFilter,
  IFilterResponse,
  IResourceResponse,
  FilterType,
  ICalendar,
  ISearch
};

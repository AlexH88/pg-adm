import {IInjectedResource} from 'shared/helpers/injectResource';

interface IInitResource extends IInjectedResource {
  type: 'FILTER_RESOURCE:INIT_RESOURCE';
}

interface ILoadFilters extends IInjectedResource {
  type: 'FILTER_RESOURCE:LOAD_FILTERS';
}

interface ILoadFiltersSuccessAction extends IInjectedResource {
  type: 'FILTER_RESOURCE:LOAD_FILTERS_SUCCESS';
}

interface ILoadFiltersFailedAction extends IInjectedResource {
  type: 'FILTER_RESOURCE:LOAD_FILTERS_FAILED';
}

interface IChooseFilters extends IInjectedResource {
  type: 'FILTER_RESOURCE:CHOOSE_FILTER';
}

interface IChangeFilter extends IInjectedResource {
  type: 'FILTER_RESOURCE:CHANGE_FILTER';
}

// interface IChangeSearch extends IInjectedResource {
//   type: 'FILTER_RESOURCE:CHANGE_SEARCH';
// }

interface IAcceptFilter extends IInjectedResource {
  type: 'FILTER_RESOURCE:ACCEPT_FILTER';
}

interface ISetCheckedTypeFilter extends IInjectedResource {
  type: 'FILTER_RESOURCE:SET_CHECKED_TYPEFILTER';
}

interface ISetCheckedIntervalFilter extends IInjectedResource {
  type: 'FILTER_RESOURCE:SET_CHECKED_INTERVALFILTER';
}

interface IInitFilters extends IInjectedResource {
  type: 'FILTER_RESOURCE:INIT_FILTERS';
}

interface IInitAddFilters extends IInjectedResource {
  type: 'FILTER_RESOURCE:INIT_ADDFILTERS';
}

interface ISaveInLocalStorage extends IInjectedResource {
  type: 'FILTER_RESOURCE:CHANGE_FILTER';
}

interface IGetFilterOptions extends IInjectedResource {
  type: 'FILTER_RESOURCE:GET_FILTER_OPTIONS';
}

interface IGetSearchOptions extends IInjectedResource {
  type: 'FILTER_RESOURCE:GET_SEARCH_OPTIONS';
}

interface IReloadTable extends IInjectedResource {
  type: 'FILTER_RESOURCE:GET_FILTER_OPTIONS';
}

export type FilterResourceActions =
  (
    | ILoadFilters
    | ILoadFiltersSuccessAction
    | IChooseFilters
    | IChangeFilter
    // | IChangeSearch
    | IAcceptFilter
    | ILoadFiltersFailedAction
    | IInitResource
    | ISetCheckedTypeFilter
    | ISetCheckedIntervalFilter
    | IInitFilters
    | IInitAddFilters
    | ISaveInLocalStorage
    | IGetFilterOptions
    | IGetSearchOptions
    | IReloadTable
  ) & IInjectedResource;

export {
  ILoadFilters,
  IChooseFilters,
  IChangeFilter,
  // IChangeSearch,
  IAcceptFilter,
  ILoadFiltersSuccessAction,
  ILoadFiltersFailedAction,
  IInitResource,
  ISetCheckedTypeFilter,
  ISetCheckedIntervalFilter,
  IInitFilters,
  IInitAddFilters,
  ISaveInLocalStorage,
  IGetFilterOptions,
  IGetSearchOptions,
  IReloadTable
}

import {
  IAcceptFilter,
  IChangeFilter,
  IChooseFilters,
  IInitResource,
  ILoadFilters,
  ILoadFiltersFailedAction,
  ILoadFiltersSuccessAction,
} from '../../actionTypes';
import {ICalendar, IResourceReduxState} from '../../namespace';
import {IConfigFilters} from 'shared/types/app';

function initResource(configs: Partial<IResourceReduxState>): IInitResource {
  return { type: 'FILTER_RESOURCE:INIT_RESOURCE', payload: configs };
}

function loadFilters(): ILoadFilters {
  return { type: 'FILTER_RESOURCE:LOAD_FILTERS' };
}

function loadFiltersSucces(filters: IConfigFilters[]): ILoadFiltersSuccessAction {
  return { type: 'FILTER_RESOURCE:LOAD_FILTERS_SUCCESS', payload: filters };
}

function loadFiltersFailed(message: string): ILoadFiltersFailedAction {
  return { type: 'FILTER_RESOURCE:LOAD_FILTERS_FAILED', payload: message };
}

function onChooseFilter(name: string, isCheck: boolean, presetOptions: any): IChooseFilters {
  return { type: 'FILTER_RESOURCE:CHOOSE_FILTER', payload: { name, isCheck, presetOptions } };
}

function onChangeFilter(
  name: string,
  value: string | number | Array<string | number> | ICalendar,
  searchString?: string
): IChangeFilter {
  return { type: 'FILTER_RESOURCE:CHANGE_FILTER', payload: { name, value, searchString } };
}

// function onChangeSearch(
//   value: string | number | Array<string | number> | ICalendar
// ): IChangeSearch {
//   return { type: 'FILTER_RESOURCE:CHANGE_SEARCH', payload: { value } };
// }

function acceptFilter(): IAcceptFilter {
  return { type: 'FILTER_RESOURCE:ACCEPT_FILTER' };
}

function setCheckedTypeFilter (data: any) {
  return { type: 'FILTER_RESOURCE:SET_CHECKED_TYPEFILTER', payload: data };
}

function setCheckedIntervalFilter (data: any) {
  return { type: 'FILTER_RESOURCE:SET_CHECKED_INTERVALFILTER', payload: data };
}

function initFilters(typeFilter: any, intervalFilter: any) {
  return { type: 'FILTER_RESOURCE:INIT_FILTERS', payload: { typeFilter , intervalFilter } };
}

function initAddFilters(initialAddFilters: any) {
  return { type: 'FILTER_RESOURCE:INIT_ADDFILTERS', payload: initialAddFilters };
}

function pushFilterConfig(data: any) {
  return { type: 'FILTER_RESOURCE:PUSH_FILTER_CONFIG', payload: data };
}

function getFilterOptions(searchString: string, filterType?: string) {
  return {
    type: 'FILTER_RESOURCE:GET_FILTER_OPTIONS',
    payload: {
      searchString,
      filterType
    }
  };
}

function setFilterOptions(filterOptions: any, filterType: string) {
  return {
    type: 'FILTER_RESOURCE:SET_FILTER_OPTIONS',
    payload: {
      filterOptions,
      filterType
    }
  };
}

function setSearchOptions(filterOptions: any, filterType: string) {
  return {
    type: 'FILTER_RESOURCE:SET_SEARCH_OPTIONS',
    payload: {
      filterOptions,
      filterType
    }
  };
}

function getSearchOptions(searchString: string) {
  return {
    type: 'FILTER_RESOURCE:GET_SEARCH_OPTIONS',
    payload: {
      searchString
    }
  };
}

function clearFilterOptions() {
  return { type: 'FILTER_RESOURCE:CLEAR_FILTER_OPTIONS' };
}

export {
  loadFilters,
  onChooseFilter,
  onChangeFilter,
  // onChangeSearch,
  acceptFilter,
  loadFiltersSucces,
  loadFiltersFailed,
  initResource,
  setCheckedTypeFilter,
  setCheckedIntervalFilter,
  initFilters,
  initAddFilters,
  pushFilterConfig,
  getFilterOptions,
  getSearchOptions,
  setFilterOptions,
  setSearchOptions,
  clearFilterOptions
};

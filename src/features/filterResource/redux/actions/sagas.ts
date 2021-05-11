import {IConfigFilters, IExtraArguments, IReduxState} from 'shared/types/app';
import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {IFilterResponse, ISearch} from '../../namespace';
import * as showResourceFeature from 'features/showResource';
import getErrorMsg from 'shared/helpers/getErrorMessage';
import {SagaIterator} from 'redux-saga';
import * as actionTypes from '../../actionTypes';
import injectResource, {IInjectedResource} from 'shared/helpers/injectResource';
import {IChooseFilters} from 'features/filterResource/actionTypes';
import {
  loadFiltersFailed,
  loadFiltersSucces,
  pushFilterConfig,
  setFilterOptions,
  setSearchOptions
} from './communication';
import {loadResourceSuccess} from '../../../showResource/redux/actions/communication';
import {getFiltersConfig} from 'shared/helpers/getConfig';
import convertFilters from 'shared/helpers/convertFilters';
import updateStorageWithFilters from 'shared/helpers/updateStorageWithFilters';
import convertFiltersShow from 'shared/helpers/convertFiltersShow';
import { loadSnmpResourceSuccess } from 'features/SnmpShowResource/redux/actions/communication';



function getSaga({ api }: IExtraArguments) {

  function* executeLoadFilters(action: IInjectedResource) {
    const resource = action.meta ? action.meta.resource : '';
    const storageSelectedFilters = localStorage.getItem(`${resource}Filters`);
    const selectedFilters = storageSelectedFilters ? JSON.parse(storageSelectedFilters) : [];

    for (const filter of selectedFilters) {
      yield put(injectResource(resource, pushFilterConfig)({
        name: filter.name,
        value: filter.value,
        display: filter.display
      }));
    }

    try {
      const configFilters: IConfigFilters[] = yield select((state: IReduxState) => getFiltersConfig(resource, state));

      const filters = configFilters.map((configFilter: IConfigFilters) => {

        const selectedFilter = selectedFilters.find((selectedFilter: any) => selectedFilter.name === configFilter.name);
        const isSelected = Boolean(selectedFilter);
        const filter: any = {
          ...configFilter,
          isConnected: isSelected,
          title: configFilter.view
        };

        return filter;
      });

      yield put(injectResource(resource, loadFiltersSucces)(filters || []));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(injectResource(resource, loadFiltersFailed)(message));
    }
  }

  function* executeInitAddFilters(action: any) {
    const resource = action.meta ? action.meta.resource : '';
    try {
      const response: IFilterResponse = yield call(api.loadFilters, resource);
      const initialAddFilters = action.payload;

      const readyFilters = initialAddFilters.map((initItem: any) => {
        const respItem = response.filters.find((respItem: any) => respItem.param === initItem.name);
        if (initItem.type === 'multi_filter' && respItem && respItem.values) {
          initItem.values = respItem.values.filter((item) =>  item.name !== null);
        }
        initItem.title = initItem.view;
        initItem.isConnected = false;

        return initItem;
      });

      yield put(injectResource(resource, loadFiltersSucces)(readyFilters ? readyFilters : []));
    } catch (error) {
      console.log('ERRON ON executeInitAddFilters', error);
      // yield put(injectResource(resource, loadFiltersFailed)(message));
    }
  }

  function* executeReloadTable(action: any ): SagaIterator {
    const resource = action.meta ? action.meta.resource : '';
    yield put(injectResource(resource, showResourceFeature.actions.loadResource)(false, false));
  }

  function* executeChooseFilter(action: IChooseFilters) {
    if (!action.payload.isCheck) {
      yield call(executeReloadTable, action);
    }
  }

  function* executeSaveInLocalStorage(action: any) {
    const { meta } = action; 
    const resource = meta ? meta.resource : '';
    const state = yield select();
    const {filterConfigs} = state.filterResource[resource];

    const filtersToLS: any[] = updateStorageWithFilters(filterConfigs);

    localStorage.setItem(`${resource}Filters`, JSON.stringify(filtersToLS));
  }

  function* executeParrallelChoiceFilter(action: IChooseFilters) {
    const { meta } = action;
    const resource = meta ? meta.resource : '';
    const state = yield select();
    const {filters, filterConfigs} = state.filterResource[resource];

    const lsData: any = localStorage.getItem(`${resource}Filters`);
    const filtersFromLS: any[] = JSON.parse(lsData) || [];

    const filtersToLS: any[] = updateStorageWithFilters(filterConfigs);

    filters.forEach((f: any) => {
      if (f.isConnected && !filtersFromLS.map(fLS => fLS.name).includes(f.name)) {
        filtersToLS.push({
          name: f.name,
          value: f.type === 'multiFilter' ? [] : ''
        })
      }
    });

    localStorage.setItem(`${resource}Filters`, JSON.stringify(filtersToLS));
    yield* executeChooseFilter(action);
  }

  function* executeGetFilterOptions(action: any) {
    const searchString = action.payload.searchString || '';
    const filterType = action.payload.filterType || '';
    const { resource } = action.meta ? action.meta : { resource: '' };

    const {filterSubgroup = '', filterParameter = ''} = convertFilters(resource, filterType);

    try {
      const filterOptions: any = yield call(api.loadFilterOptions, searchString, filterSubgroup, filterParameter, resource);

      yield put(injectResource(resource, setFilterOptions)(filterOptions, filterType));
    } catch (error) {
      console.log('ERRON ON getFilterOptions', error);
      // yield put(injectResource(resource, loadFiltersFailed)(message));
    }
  }

  function* executeGetSearchOptions(action: any ): SagaIterator {
    const searchString = action.payload.searchString || '';
    const { resource } = action.meta ? action.meta : { resource: '' };
    const state: IReduxState = yield select();
    const { sort, currentPage = 0 } = state.showResource[resource];

    const searchOptions: any = yield call(api.loadSearchOptions, searchString, currentPage, resource);

    const response: ISearch = {};
      // if (searchOptions[currentPage]) {
      //   response[currentPage] = searchOptions[currentPage].items;
      // }
      // if (searchOptions[currentPage + 1]) {
      //   response[currentPage + 1] = searchOptions[currentPage + 1].items;
      // }
      // if (searchOptions[currentPage - 1]) {
      //   response[currentPage - 1] = searchOptions[currentPage - 1].items;
      // }
    if(resource !== "floors") {
      response[currentPage] = searchOptions.items;
    } else {
      const { sort, currentPage = 0 } = state.showResource[resource];
      const filterResource = state.filterResource[resource];
      const filterConfigs: any = filterResource ? filterResource.filterConfigs : [];
      let modifiedFilterConfigs: any = convertFiltersShow(filterConfigs);
      const pages = yield call(api.loadResource, resource, currentPage, sort, modifiedFilterConfigs, false);
      const response = pages[0];
      const addPrinters = searchOptions
      yield put(injectResource(resource, loadSnmpResourceSuccess)(response, addPrinters));
    }


    // console.log('НАШ response', response[currentPage])

    
    yield put(injectResource(resource, setSearchOptions)(searchOptions, 'login'));
    yield put(injectResource(resource, loadResourceSuccess)(response));
    // yield put(injectResource(resource, showResourceFeature.actions.loadResource)(false, false));
    // yield call(executeSaveInLocalStorage, action);
    // yield call(executeReloadTable, action);
  }

  function* saga(): SagaIterator {
    const acceptFilter: actionTypes.IAcceptFilter   ['type'] = 'FILTER_RESOURCE:ACCEPT_FILTER';
    const loadFilters: actionTypes.ILoadFilters     ['type'] = 'FILTER_RESOURCE:LOAD_FILTERS';
    const initAddFilters: actionTypes.IInitAddFilters  ['type'] = 'FILTER_RESOURCE:INIT_ADDFILTERS';
    const chooseFilters: actionTypes.IChooseFilters ['type'] = 'FILTER_RESOURCE:CHOOSE_FILTER';
    const saveInLocalStorage: actionTypes.ISaveInLocalStorage ['type'] = 'FILTER_RESOURCE:CHANGE_FILTER';
    const getFilterOptions: actionTypes.IGetFilterOptions ['type'] = 'FILTER_RESOURCE:GET_FILTER_OPTIONS';
    const getSearchOptions: actionTypes.IGetSearchOptions ['type'] = 'FILTER_RESOURCE:GET_SEARCH_OPTIONS';

    yield all([
      takeLatest(acceptFilter, executeReloadTable),
      takeLatest(loadFilters, executeLoadFilters),
      takeLatest(chooseFilters, executeParrallelChoiceFilter),
      takeLatest(initAddFilters, executeInitAddFilters),
      takeLatest(saveInLocalStorage, executeSaveInLocalStorage),
      takeLatest(getFilterOptions, executeGetFilterOptions),
      takeLatest(getSearchOptions, executeGetSearchOptions)
    ]);
  }

  return saga;
}

export { getSaga };

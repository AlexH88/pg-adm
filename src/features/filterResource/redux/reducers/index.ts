import {fromJS, List, Map} from 'immutable';
import {FilterResourceActions} from '../../actionTypes';
import {IReduxState} from '../../namespace';
import {initialResource, initialState} from '../data/initial';

function mainReducer(state: IReduxState = initialState, action: FilterResourceActions & any): /*IReduxState*/any {
  const imState: Map<string, any> = fromJS(state);
  const resource = action.meta ? action.meta.resource : '';

  switch (action.type) {
  case 'FILTER_RESOURCE:INIT_RESOURCE':
    return imState.set(resource, { ...initialResource, ...action.payload }).toJS();

  case 'FILTER_RESOURCE:LOAD_FILTERS_SUCCESS':
    return imState.setIn([resource, 'filters'], action.payload).toJS();

  case 'FILTER_RESOURCE:CHOOSE_FILTER': {
    const { payload: { name, isCheck } } = action;
    return imState
      .updateIn(
        [resource, 'filters'],
        (filters: List<Map<string, any>>) => (
          filters.map((filter: Map<string, any>) => (
            name === filter.get('name') ? filter.set('isConnected', isCheck) : filter
          ))
        ),
      )
      .updateIn(
        [resource, 'filterConfigs'],
        (filterConfigs: Map<string, any>) => filterConfigs.delete(name),
      )
      .toJS();
  }

  case 'FILTER_RESOURCE:PUSH_FILTER_CONFIG': {
    const { payload: { name, value } } = action;
    return imState
      .setIn([resource, 'filterConfigs', name], value)
      .toJS();
  }

  case 'FILTER_RESOURCE:CHANGE_FILTER': {
    const { name, value, searchString } = action.payload;
    return imState
      .setIn([resource, 'filterConfigs', name], value)
      .toJS();
  }

  case 'FILTER_RESOURCE:SET_CHECKED_TYPEFILTER':
    return imState
    .updateIn(
      [resource, 'type_filter'],
      (type_filter) => type_filter.map((obj: any) => (
        action.payload === obj.get('name') ? obj.set('isChecked', true) : obj.set('isChecked', false)
      )),
    ).toJS();

  case 'FILTER_RESOURCE:SET_CHECKED_INTERVALFILTER':
    return imState
    .updateIn(
      [resource, 'interval_filter'],
      (interval_filter) => interval_filter.map((obj: any) => (
        action.payload === obj.get('name') ? obj.set('isChecked', true) : obj.set('isChecked', false)
      )),
    ).toJS();

  case 'FILTER_RESOURCE:INIT_FILTERS':
    return imState
      .setIn([resource, 'type_filter'], action.payload.typeFilter)
      .setIn([resource, 'interval_filter'], action.payload.intervalFilter)
      .toJS();

  case 'FILTER_RESOURCE:SET_FILTER_OPTIONS':
    const {filterOptions = [], filterType} = action.payload;
    const previousFilterOptions = state[resource]['filterOptions'][filterType] || [];
    let newFilterOptions = [...previousFilterOptions, ...filterOptions];

    return imState
      .setIn([resource, 'filterOptions', filterType], newFilterOptions)
      .toJS();

  case 'FILTER_RESOURCE:GET_SEARCH_OPTIONS':
    return imState.set('searchString', action.payload.searchString).toJS();

    return imState
      .setIn([resource, 'filterOptions', filterType], newFilterOptions)
      .toJS();

  case 'FILTER_RESOURCE:CLEAR_FILTER_OPTIONS':
    return imState
      .setIn([resource, 'filterOptions'], {})
      .setIn([resource, 'filterConfigs'], {})
      .toJS();

  default:
    return state;
  }
}

export default mainReducer;

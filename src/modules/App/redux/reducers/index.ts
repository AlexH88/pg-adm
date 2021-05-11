import {fromJS, Map} from 'immutable';
import initialState from '../data/initial';
import {IReduxState} from '../../namespace';
import {AppModuleActions} from '../../actionTypes';

function mainReducer(state: IReduxState = initialState, action: AppModuleActions): /*IReduxState*/any {
  const imState: Map<string, any> = fromJS(state);

  switch (action.type) {
  case 'APPLICATION-MODULE:CHANGE_CONFIG_STATUS':
    return imState.setIn(['status'], action.payload).toJS();

  case 'APPLICATION-MODULE:CREATE_RESOURCE_SUCCES':
    return imState.set('description', action.payload).toJS();

  default:
    return state;
  }
}

export default mainReducer;

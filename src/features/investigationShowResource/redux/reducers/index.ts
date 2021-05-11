import {fromJS, List, Map} from 'immutable';
import {IReduxState} from '../../namespace';
import { initialState} from '../data/initial';

function mainReducer(state: IReduxState = initialState, action: any): /*IReduxState*/any {
  const imState: Map<string, any> = fromJS(state);
  const { resource } = action.meta ? action.meta : { resource: '' };
  switch (action.type) {

    case 'SHOW_INVESTIGATION_RESOURCE:SWITCH_MODAL_STATUS':
      return imState.set('showModal', action.payload.status)
        .set('modalMode', action.payload.mode).toJS();

    case 'SHOW_INVESTIGATION_RESOURCE:GET_HASH_DATA_SUCCESS':
      return imState.set('result', action.payload)

    case 'SHOW_INVESTIGATION_RESOURCE:GET_HASH_DATA_ERROR':
      return imState.set('result', action.payload)

    default:
      return state;
  }
}

export default mainReducer;

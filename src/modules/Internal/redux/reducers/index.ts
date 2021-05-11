import {fromJS, Map} from 'immutable';
import initialState from '../data/initial';
import {IReduxState} from '../../namespace';

function mainReducer(state: IReduxState = initialState, action: /*PrinterModuleActions | */any): /*IReduxState*/any {
  const imState: Map<string, any> = fromJS(state);

  switch (action.type) {

  case 'INTERNAL_MODULE:CREATE_RESOURCE_SUCCESS':
    return imState.setIn(['created'], action.payload).toJS();

  case 'INTERNAL_MODULE:SWITCH_MODAL_STATUS':
    return imState
      .set('showModal', action.payload.status)
      .set('modalMode', action.payload.mode).toJS();

  case 'INTERNAL_MODULE:SWITCH_REMOVE_MODAL': {
    const showRemoveModal = imState.get('showRemoveModal');
    return imState.set('showRemoveModal', !showRemoveModal).toJS();
  }

  case 'INTERNAL_MODULE:START_DELETE_ENTRY' : {
    return imState.set('entryForDeletion', action.payload).toJS();
  }

  default:
    return state;
  }
}

export default mainReducer;

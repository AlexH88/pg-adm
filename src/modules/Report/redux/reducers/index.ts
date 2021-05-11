import {fromJS, Map} from 'immutable';
import initialState from '../data/initial';
import {IReduxState} from '../../namespace';

function mainReducer(state: IReduxState = initialState, action: any): /*IReduxState*/any {
  const imState: Map<string, any> = fromJS(state);

  switch (action.type) {

  case 'REPORT_MODULE:SWITCH_MODAL_STATUS': {
    return imState.set('showModal', action.payload.status)
    .set('modalMode', action.payload.mode).toJS();
  }

  case 'REPORT_MODULE:SWITCH_SAVE_MODAL': {
    const showSaveModal = imState.get('showSaveModal');
    return imState.set('showSaveModal', !showSaveModal).toJS();
  }

  case 'REPORT_MODULE:SET_SETTINGS_REPORT': {
    return imState.set('settings', action.payload)
  }

  case 'REPORT_MODULE:CLEAR_SETTINGS': {
    return imState.set('settings', null)
  }

  default:
    return state;
  }
}

export default mainReducer;

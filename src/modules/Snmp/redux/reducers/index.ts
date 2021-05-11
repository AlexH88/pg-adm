import {fromJS, Map} from 'immutable';
// import * as NS from '../../namespace';
import {IReduxState} from '../../namespace';
import {initialState} from '../data/initial';
import {StatusModuleActions} from "../../namespace/actionTypes";

function mainReducer(state: IReduxState = initialState, action: StatusModuleActions | any): /*IReduxState*/any {
  const imState: Map<string, any> = fromJS(state);

  switch (action.type) {

    case 'SNMP_MODULE:SWITCH_EDIT_MODAL' : {
      const showEditModal = imState.get('showEditModal');
      return imState.set('showEditModal', !showEditModal).toJS();
    }

    case 'SNMP_MODULE:SWITCH_REMOVE_MODAL' : {
      const showRemoveModal = imState.get('showRemoveModal');
      return imState.set('showRemoveModal', !showRemoveModal).toJS();
    }

    default:
    return state;
  }

}

export default mainReducer;

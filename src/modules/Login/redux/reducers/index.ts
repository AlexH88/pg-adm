import {fromJS, Map} from 'immutable';
// import * as NS from '../../namespace';
import {IReduxState} from '../../namespace';
import {initialState} from '../data/initial';
import {LoginModuleActions} from "../../namespace/actionTypes";

function mainReducer(state: IReduxState = initialState, action: LoginModuleActions): /*IReduxState*/any {
  const imState: Map<string, any> = fromJS(state);
  switch (action.type) {

    case 'LOGIN_MODULE:SET_SERVER_DATA' : {
      return imState.set('serverResponse', action.payload).toJS();
    }

    case 'LOGIN_MODULE:SET_ERROR_DATA' : {
      return imState.set('loginError', action.payload).toJS();
    }

    case 'LOGIN_MODULE:GET_AUTHORITIES_CURRENT' : {
      return imState.set('authoritiesCurrent', action.payload).toJS();
    }

    case 'LOGIN_MODULE:SWITCH_MODAL_STATUS' : {
      return imState.set('showModal', action.payload).toJS();
    }
    
    default: {
      return state;
    }
  }
}

export default mainReducer;

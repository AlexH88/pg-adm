import {fromJS, Map} from 'immutable';
import initialState from '../data/initial';
import {IReduxState, UserModuleActions} from '../../namespace';

function mainReducer(state: IReduxState = initialState, action: UserModuleActions): /*IReduxState*/any {
  const imState: Map<string, any> = fromJS(state);

  if (!1) console.log(imState, action);

  return state;
}

export default mainReducer;

import {fromJS, List, Map} from 'immutable';
import initialState from '../data/initial';
import {IReduxState} from '../../namespace';
import {EditUserGroups} from '../../actionTypes';

function mainReducer(state: IReduxState = initialState, action: EditUserGroups): /*IReduxState*/any {
  const imState: Map<string, any> = fromJS(state);

  switch (action.type) {
  case 'EDIT_GROUPS:SWITCH_GROUP_MODAL_STATUS':
    return imState.set('showUserGroupModal', action.payload).toJS();
  case 'EDIT_GROUPS:GROUPS_EDIT':
    return imState.set('user', action.payload).toJS();
  case 'EDIT_GROUPS:SAVE_ALL_GROUPS_WITH_STATUS':
    return imState.set('allGroups', action.payload).toJS();
  case 'EDIT_GROUPS:SWITCH_GROUPS_STATUS':
    return imState.update('allGroups', (groups: List<Map<string, any>>) => {
      return groups.map((group: Map<string, any>) => {
        if (group.get('id') === action.payload.id) {
          return group.set('isConnected', action.payload.isConected);
        }
        return group;
      });
    }).toJS();
  default:
    return state;
  }
}

export default mainReducer;

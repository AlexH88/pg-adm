import {fromJS, List, Map} from 'immutable';
import initialState from '../data/initial';
import {IReduxState, UserModuleActions} from '../../namespace';

function mainReducer(state: IReduxState = initialState, action: UserModuleActions): /*IReduxState*/any {
  const imState: Map<string, any> = fromJS(state);

  switch (action.type) {

    case 'USERS-MODULE:CREATE_RESOURCE_SUCCESS':
      return imState.setIn(['created', action.meta ? action.meta.resource : ''], action.payload).toJS();

    case 'USERS-MODULE:DELETE_RESOURCE_SUCCESS':
      return imState.setIn(['deleted', action.meta ? action.meta.resource : ''], action.payload).toJS();

    case 'USERS-MODULE:DELETE_USER_LOGIN':
      return imState.set('deleteResourceField', action.payload).toJS();

    case 'USERS-MODULE:SWITCH_REMOVE_MODAL_STATUS':
      return imState.set('showRemoveModal', action.payload).toJS();

    case 'USERS-MODULE:SWITCH_MODAL_STATUS':
      return imState.set('showModal', action.payload.status)
        .set('modalMode', action.payload.mode).toJS();

    case 'USERS-MODULE:SWITCH_MODAL_LOAD_FILE_STATUS':
      return imState.set('showModalLoadFile', action.payload).toJS();

    case 'USERS-MODULE:SWITCH_ALL_SELECTED_CHECKBOX_STATUS':
      return imState.set('isAllSelected', !imState.get('isAllSelected')).toJS();

    case 'USERS-MODULE:SWITCH_MULTI_EDIT_STATUS':
      if (imState.get('isMultiEdit')) {
        return imState
          .set('selectedUsers', [])
          .set('isMultiEdit', false)
          .toJS();
      }
      return imState.set('isMultiEdit', !imState.get('isMultiEdit')).toJS();

    case 'USERS-MODULE:CHECKED_USER_MULTI_EDIT':
      const checkedUsers = imState.get('selectedUsers') as List<Map<string, any>>;
      const foundUser = checkedUsers.findIndex(user => user ? user.get('id')  === action.payload.id : false);
      if (foundUser === -1) {
        return imState.set('selectedUsers', checkedUsers.insert(checkedUsers.count(), fromJS(action.payload))).toJS();
      } else {
        return imState.set('selectedUsers', checkedUsers.remove(foundUser)).toJS();
      }
      break;

    case 'USERS-MODULE:ERASE_SELECTED_USERS':
      return imState.set('selectedUsers', []).toJS();

    case 'USERS-MODULE:SEND_TEMP_CATALOG_DATA':
      return imState.set('sendingCatalogData', true).toJS();

    case 'USERS-MODULE:SEND_TEMP_CATALOG_DATA_SUCCESS':
      return imState.set('sendingCatalogData', false).toJS();

    case 'USERS-MODULE:SEND_TEMP_CATALOG_DATA_FAILED':
      return imState.set('sendingCatalogData', false).toJS();

    case 'USERS-MODULE:SWITCH_SYNC_MODAL':
      const showSyncModal = imState.get('showSyncModal');
      return imState.set('showSyncModal', !showSyncModal).toJS();

    case 'USERS-MODULE:SET_EDIT_CHOOSEN_CATALOG_NAME':
      return imState.set('choosenCatalogEditName', action.payload).toJS();

    case 'USERS-MODULE:SET_CATALOGS_LIST':
      return imState.set('availableCatalogs', action.payload).toJS();

    case 'USERS-MODULE:SET_CATALOG_GROUPS_LIST':
      return imState.setIn(['availableCatalogGroups', action.payload.id], action.payload.data).toJS();

    case 'USERS-MODULE:TEST_CONNECT_SUCCESS':
      return imState.set('success', action.payload).toJS();

    case 'USERS-MODULE:TEST_CONNECT_CLEAR':
      return imState.set('success', '').toJS();

    case 'USERS-MODULE:LOAD_FILE_ERROR':
      return imState.set('error', action.payload).toJS();

    case 'USERS-MODULE:LOAD_FILE_ERROR_CLEAR':
      return imState.set('error', '').toJS();

    case 'USERS-MODULE:LOAD_FILE_DATA_SUCCESS':
      return imState.set('usersOutsideDB', action.payload).toJS();

    case 'USERS-MODULE:LOAD_FILE_DATA_SUCCESS_CLEAR':
      return imState.set('usersOutsideDB', []).toJS();

    case 'USERS-MODULE:LOAD_FILE_DATA_STATUS':
      return imState.set('updateCardStatus', action.payload).toJS();

    default:
      return state;
  }
}

export default mainReducer;

import { Map, fromJS, List } from 'immutable';
import initialState from '../data/initial';
import { IReduxState } from '../../namespace';
import { UserModuleActions } from '../../namespace';

function mainReducer(state: IReduxState = initialState, action: UserModuleActions): /*IReduxState*/any {
  const imState: Map<string, any> = fromJS(state);

  switch (action.type) {

    case 'INTEGRATION-MODULE:CREATE_RESOURCE_SUCCESS':
      return imState.set('settingsIntegration', action.payload).toJS();

    case 'INTEGRATION-MODULE:SWITCH_MODAL_STATUS':
      return imState.set('showModal', action.payload.status)
        .set('modalMode', action.payload.mode).toJS();

    case 'INTEGRATION-MODULE:TEST_CONNECT_SUCCESS':
      return imState.set('success', action.payload).toJS();

    case 'INTEGRATION-MODULE:SET_CURRENT_STATUS':
      return imState.set('currentStatus', action.payload).toJS();

    case 'INTEGRATION-MODULE:TEST_CONNECT_CLEAR':
      return imState.set('success', '').toJS();

    case 'INTEGRATION-MODULE:SEND_TEMP_CATALOG_DATA':
      return imState.set('sendingCatalogData', true).toJS();

    case 'INTEGRATION-MODULE:SEND_TEMP_CATALOG_DATA_SUCCESS':
      return imState.set('sendingCatalogData', false).toJS();

    case 'INTEGRATION-MODULE:SEND_TEMP_CATALOG_DATA_FAILED':
      return imState.set('sendingCatalogData', false).toJS();

    case 'INTEGRATION-MODULE:SWITCH_SYNC_MODAL':
      const showSyncModal = imState.get('showSyncModal');
      return imState.set('showSyncModal', !showSyncModal).toJS();

    case 'INTEGRATION-MODULE:SET_EDIT_CHOOSEN_CATALOG_NAME':
      return imState.set('choosenCatalogEditName', action.payload).toJS();

    case 'INTEGRATION-MODULE:SET_CATALOGS_LIST':
      return imState.set('availableCatalogs', action.payload).toJS();

    case 'INTEGRATION-MODULE:SET_CATALOG_GROUPS_LIST':
      return imState.setIn(['availableCatalogGroups', action.payload.id], action.payload.data).toJS();

    case 'INTEGRATION-MODULE:TEST_CONNECT_SUCCESS':
      return imState.set('success', action.payload).toJS();

    case 'INTEGRATION-MODULE:SWITCH_REMOVE_MODAL_STATUS':
      return imState.set('showRemoveModal', action.payload).toJS();

    default:
      return state;
  }
}

export default mainReducer;

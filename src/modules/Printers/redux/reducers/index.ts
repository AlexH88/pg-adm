import {fromJS, Map} from 'immutable';
import initialState from '../data/initial';
import {IReduxState, PrinterModuleActions} from '../../namespace';

function mainReducer(state: IReduxState = initialState, action: PrinterModuleActions | any): /*IReduxState*/any {
  const imState: Map<string, any> = fromJS(state);

  switch (action.type) {

  case 'PRINTERS_MODULE:CREATE_RESOURCE_SUCCESS':
    return imState.setIn(['created'], action.payload).toJS();

  case 'PRINTERS_MODULE:SWITCH_MODAL_STATUS':
    return imState.set('showModal', action.payload).toJS();

  case 'PRINTERS_MODULE:SWITCH_MODAL_STATUS_MODE':
    return imState.set('showModal', action.payload.status)
        .set('modalMode', action.payload.mode).toJS();

  case 'PRINTERS_MODULE:SET_LOG_PRINTER_ID':
    return imState.set('logPrinterId', action.payload).toJS();

  case 'PRINTERS_MODULE:SWITCH_LOG_MODAL':
    const showLogModal = imState.get('showLogModal');
    return imState.set('showLogModal', !showLogModal).toJS();

  case 'PRINTERS_MODULE:SWITCH_REMOVE_MODAL': {
    const showRemoveModal = imState.get('showRemoveModal');
    return imState.set('showRemoveModal', !showRemoveModal).toJS();
  }

  case 'PRINTERS_MODULE:TRY_DELETE_RESOURCE_SUCCESS': {
    const { response } = action.payload;
    return imState.set('tryDeletingItemId', response.printer).toJS();
  }

  case 'PRINTERS_MODULE:START_DELETE_PRINTER_GROUP': {
    return imState.set('deletingGroupId', action.payload).toJS();
  }

  case 'PRINTERS_MODULE:SWITCH_SYNC_MODAL': {
    const showSyncModal = imState.get('showSyncModal');
    return imState.set('showSyncModal', !showSyncModal).toJS();
  }

  case 'PRINTERS_MODULE:SWITCH_HOST_GROUP_EDIT_MODAL': {
    const showHostGroupEditModal = imState.get('showHostGroupEditModal');
    return imState.set('showHostGroupEditModal', !showHostGroupEditModal).toJS();
  }

  case 'PRINTERS_MODULE:SET_EDIT_CHOOSEN_PRINT_SERVER_NAME' : {
    return imState.set('choosenPrintServerEditName', action.payload).toJS();
  }

  case 'PRINTERS_MODULE:START_DELETE_AGENT' : {
    return imState.set('deleteAgentId', action.payload).toJS();
  }

  case 'PRINTERS_MODULE:PRINTER_GROUPS_SWITCH' : {
    return imState.set('printerGroups', action.payload).toJS();
  }

  default:
    return state;
  }
}

export default mainReducer;

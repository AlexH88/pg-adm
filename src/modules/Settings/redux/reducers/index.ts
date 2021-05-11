import {fromJS, Map} from 'immutable';
import initialState from '../data/initial';
import {IReduxState, SettingsModuleActions} from '../../namespace';

function mainReducer(state: IReduxState = initialState, action: SettingsModuleActions): /*IReduxState*/any {
  const imState: Map<string, any> = fromJS(state);

  switch (action.type) {

  case 'SETTINGS_MODULE:SWITCH_MODAL_STATUS': {
    return imState.set('showModal', action.payload.status)
    .set('modalMode', action.payload.mode).toJS();
    // const showModal = imState.get('showModal');
    // return imState.set('showModal', !showModal).toJS();
  }

  case 'SETTINGS_MODULE:SWITCH_LICENSE_MODAL_STATUS': {
    return imState.set('showModal', action.payload.status)
    .set('modalMode', action.payload.mode)
    .set('editModalId', action.payload.licenseId).toJS();
  }

  case 'SETTINGS_MODULE:SWITCH_REMOVE_MODAL': {
    const showRemoveModal = imState.get('showRemoveModal');
    return imState.set('showRemoveModal', !showRemoveModal).toJS();
  }

  case 'SETTINGS_MODULE:SWITCH_ALERT_MODAL': {
    const showAlertModal = imState.get('showAlertModal');
    return imState.set('showAlertModal', !showAlertModal).toJS();
  }

  case 'SETTINGS_MODULE:SWITCH_SAVE_MODAL': {
    const showSaveModal = imState.get('showSaveModal');
    return imState.set('showSaveModal', !showSaveModal).toJS();
  }

  case 'SETTINGS_MODULE:START_DELETE_ROLE': {
    return imState.set('deletingRole', action.payload).toJS();
  }

  case 'SETTINGS_MODULE:LOAD_ROLES_TYPES_SUCCES': {
    return imState.set('rolesTypes', action.payload).toJS();
  }

  case 'SETTINGS_MODULE:LOAD_ROLE_DESCRIPTION_SUCCES': {
    return imState.set('ruleDescription', action.payload).toJS();
  }

  case 'SETTINGS_MODULE:SET_FEATURES_DATA': {
    return imState.set('featuresData', action.payload).toJS();
  }

  case 'SETTINGS_MODULE:SET_LOADING': {
    return imState.set('isLoading', action.payload).toJS();
  }

  case 'SETTINGS_MODULE:START_DELETE_BLOCKED_PRINTER': {
    return imState.set('deletingPrinter', action.payload).toJS();
  }

  case 'SETTINGS_MODULE:SET_CURRENT_VERSION': {
    return imState.set('currentVersion', action.payload).toJS();
  }

  case 'SETTINGS_MODULE:SET_AVAILABLE_VERSIONS': {
    return imState.set('availableVersions', action.payload).toJS();
  }

  case 'SETTINGS_MODULE:SWITCH_UPDATE_DIALOG': {
    const showUpdateDialog = imState.get('showUpdateDialog');
    return imState.set('showUpdateDialog', !showUpdateDialog).toJS();
  }

  case 'SETTINGS_MODULE:SWITCH_BLOCK_DIALOG': {
    const showUpdateDialog = imState.get('showBlockDialog');
    return imState.set('showBlockDialog', !showUpdateDialog).toJS();
  }

  case 'SETTINGS_MODULE:SWITCH_LICENSE_DIALOG': {
    const showLicenseDialog = imState.get('showLicenseDialog');
    return imState.set('showLicenseDialog', !showLicenseDialog).toJS();
  }

  case 'SETTINGS_MODULE:SET_LICENSE_DATA': {
    return imState.set('licenseData', action.payload).toJS();
  }

  case 'SETTINGS_MODULE:ACCEPT_DELETE_RESOURCE_FAILED': {
    return imState.set('error', action.payload.error).toJS();
  }

  case 'SETTINGS_MODULE:CLEAR_ERROR': {
    return imState.set('error', '').toJS();
  }

  case 'SETTINGS_MODULE:GET_AUTHORITIES_SUCCESS': {
    return imState.set('authorities', action.payload).toJS();
  }

  default:
    return state;
  }
}

export default mainReducer;

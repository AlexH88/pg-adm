import {fromJS, Map} from 'immutable';
import * as NS from '../../namespace';
import {IReduxState} from '../../namespace';
import {initialState} from '../data/initial';

function mainReducer(state: IReduxState = initialState, action: NS.PolicyModuleActions & any): /*IReduxState*/any {
  const imState: Map<string, any> = fromJS(state);
  switch (action.type) {

  case 'POLICY_MODULE:SWITCH_REMOVE_MODAL': {
    const showRemoveModal = imState.get('showRemoveModal');
    return imState.set('showRemoveModal', !showRemoveModal).toJS();
  }

  case 'POLICY_MODULE:SWITCH_SAVE_MODAL': {
    const showSaveModal = imState.get('showSaveModal');
    return imState.set('showSaveModal', !showSaveModal).toJS();
  }

  case 'POLICY_MODULE:SWITCH_MARK_MODAL': {
    const showMarkModal = imState.get('showMarkModal');
    return imState.set('showMarkModal', !showMarkModal).toJS();
  }

  case 'POLICY_MODULE:SWITCH_CONFIRM_MODAL': {
    const showConfirmModal = imState.get('showConfirmModal');
    return imState.set('showConfirmModal', !showConfirmModal).toJS();
  }

  case 'POLICY_MODULE:SWITCH_CREATE_EDIT_MODAL': {
    const showModal = imState.get('showCreateEditModal');
    return imState
      .set('showCreateEditModal', !showModal)
      .set('modalMode', action.payload.mode).toJS();
  }

  case 'POLICY_MODULE:SWITCH_WATERMARKS_MODAL': {
    const showModal = imState.get('showWatermarksSettingsModal');
    return imState.set('showWatermarksSettingsModal', !showModal).toJS();
  }

  case 'POLICY_MODULE:SWITCH_ADD_MODAL': { // #AddRule
    const showModal = imState.get('showAddModal');
    return imState.set('showAddModal', !showModal).toJS();
  }

  case 'POLICY_MODULE:SET_EDIT_POLICY': {
    const { payload } = action as NS.ISetEditPolicy;
    return  imState.set('choosenPolicyEdit', payload).toJS();
  }

  case 'POLICY_MODULE:SET_HOST_GROUPS': {
    const { payload } = action as any;
    return  imState.set('hostGroups', payload).toJS();
  }

  case 'POLICY_MODULE:SET_EDIT_MARK_POLICY': {
    const { payload } = action as NS.ISetMarkPolicyEdit;
    return imState.set('choosenMarkPolicyEdit', payload).toJS();
  }

  case 'POLICY_MODULE:SET_TEXT_LABELS_DATA': {
    const { payload } = action as NS.ISetTextLablesData;
    return imState.set('textLabelsData', payload).toJS();
  }
  
  case 'POLICY_MODULE:SET_IMAGE_ID': {
    const { payload } = action as NS.ISetImageId;
    return imState.set('imageId', payload).toJS();
  }
  
  case 'POLICY_MODULE:SWITCH_DECRYPT_MODAL': {
    const showDecryptModal = imState.get('showDecryptModal');
    return imState.set('showDecryptModal', !showDecryptModal).toJS();
  }
  
  case 'POLICY_MODULE:SET_DECRYPT_MESSAGE': {
    const { payload } = action as any;
    return imState.set('decryptMessage', payload).toJS();
  }

  case 'POLICY_MODULE:GET_GROUPS_SUCCESS': {
    const { payload: { userGroups, printerGroups } } = action as NS.IGetGroupsSuccess;
    return imState
      .set('userGroups', userGroups)
      .set('printerGroups', printerGroups)
      .toJS();
  }

  case 'SHOW_RESOURCE:CHANGE_ORDER_ITEMS' : { // # Доступность кнопки сохранить
    return imState.set('isPolicyEdit', true).toJS();
  }

  case 'POLICY_MODULE:SET_POLICY_NONE_EDIT' : { // # Доступность кнопки сохранить
    return imState.set('isPolicyEdit', false).toJS();
  }

  case 'POLICY_MODULE:SET_POLICY_EDIT' : { // # Доступность кнопки сохранить
    return imState.set('isPolicyEdit', true).toJS();
  }
  
  case 'POLICY_MODULE:SET_WATERMARKS' : {
    return imState.set('watermarkSettings', action.payload).toJS();
  }

  case 'POLICY_MODULE:SET_TOAST_WATERMARK' : {
    return imState.set('addWaterMark', action.payload).toJS();
  }

  case 'POLICY_MODULE:CLEAR_TOAST_WATERMARK' : {
    return imState.set('addWaterMark', { type: '', text: '', status: false}).toJS();
  }

  default:
    return state;
  }
}

export default mainReducer;

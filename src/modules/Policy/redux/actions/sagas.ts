import * as showResourceFeature from 'features/showResource';
import * as NS from '../../namespace';
import * as actions from './communication';
import {IExtraArguments,} from 'shared/types/app';
import {IPolicy,} from 'shared/types/policy';
//import { convertToRuleGroup } from 'shared/helpers/formatData';
import {all, call, put, select, take, takeLatest, delay} from 'redux-saga/effects';
import {SagaIterator} from 'redux-saga';
import {getFormValues, initialize, startSubmit, stopSubmit} from 'redux-form';
import getErrorMsg from 'shared/helpers/getErrorMessage';
import injectResource from 'shared/helpers/injectResource';
// import { browserHistory } from 'react-router';
//import {getRuleById, /*getPrinterGroups, getUserGroups,*/ getRuleData, getId} from './selectors';

//import { policyApi } from './../../api';

function getSaga({ api }: IExtraArguments) {


  function* executeActivateResource({ meta, payload }: NS.IActivateResource) {
    if (!meta) {
      throw Error('No meta');
    }
    try {
      const response = yield call(api.activateResource, meta.resource, payload);
      yield put(actions.activateResourceSuccess(response));
      yield put(injectResource(meta.resource, showResourceFeature.actions.loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.activateResourceFailed({ error: message }));
    }
  }

  function* executeDeactivateResource({ meta, payload }: NS.IDeactivateResource) {
    if (!meta) {
      throw Error('No meta');
    }
    try {
      const response = yield call(api.deactivateResource, meta.resource, payload);
      yield put(actions.deactivateResourceSuccess(response));
      yield put(injectResource(meta.resource, showResourceFeature.actions.loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.deactivateResourceFailed({ error: message }));
    }
  }

  function* executeDeleteResource({ meta, payload }: NS.IDeleteResource) {
    if (!meta) {
      throw Error('No meta');
    }
    try {
      yield take(actions.acceptDelete().type);
      const response = yield call(api.deleteResource, meta.resource, payload);
      yield put(actions.deleteResourceSuccess(response));
      yield put(actions.switchRemoveModal());
      yield put(injectResource(meta.resource, showResourceFeature.actions.loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.deleteResourceFailed({ error: message }));
    }
  }

  function* executeCreateResource({ meta }: NS.ICreateResource) {
    if (!meta) {
      throw Error('No meta');
    }
    const formName = 'addPolicy';

    try {
      let resource = meta ? meta.resource : '';
      

      yield put(startSubmit(formName));
      const data: IPolicy = yield select(getFormValues(formName));
      const newData: IPolicy = {...data};
      console.log('data', data)
      console.log('newData', newData)
      
      if (!newData.userGroups || newData.userGroups.length === 0) {
        newData.userGroups = ['1'];
      }
      if (!newData.printerGroups || newData.printerGroups.length === 0) {
        newData.printerGroups = ['1'];
      }
      newData.copies = null;

      yield call(api.createResource, resource, newData);
      yield put(stopSubmit(formName));
      yield put(actions.switchModalStatus({ status: false, mode: ''}));
      yield put(injectResource(meta.resource, showResourceFeature.actions.loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      console.log(message);
      yield put(stopSubmit(formName, { _error: message }));
    }
  }

  function* executeSaveResource({ meta }: NS.ICreateResource) {
    if (!meta) {
      throw Error('No meta');
    }
    try {
      let resource = meta ? meta.resource : '';
      
      const formName = 'addPolicy';

      yield put(startSubmit(formName));
      const data: IPolicy = yield select(getFormValues(formName));

      const newData: IPolicy = {...data};
      newData.documentFormatSet = data.documentFormatSet;
         
      if (!newData.userGroups || newData.userGroups.length === 0) {
        newData.userGroups = ['1'];
      }
      if (!newData.printerGroups || newData.printerGroups.length === 0) {
        newData.printerGroups = ['1'];
      }

      yield call(api.editResource, resource, newData);
      yield put(stopSubmit(formName));
      yield put(actions.switchModalStatus({ status: false, mode: ''}));
      yield put(injectResource(meta.resource, showResourceFeature.actions.loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      console.log(message);
    }
  }

  function* executeStartEditPolicy({ payload }: any) {
    try {
      if (payload === null) {
        yield put(initialize('addPolicy', {
          state: true,
          operator: 1,
          printerGroups: [],
          userGroups: [],
          documentFormatSet: [],
          name: '',
        }, true));
      } else {
        let newData: any = {...payload};
        newData.printerGroups = newData.printerGroups.filter((g: any) => g.name !== 'default').map((group: any) => group.id.toString());
        newData.userGroups = newData.userGroups.filter((g: any) => g.name !== 'default').map((group: any) => group.id.toString());
        yield put(initialize('addPolicy', newData, true));
      }
      yield put(actions.switchModalStatus({ status: true, mode: 'edit' }));
    } catch (error) {
      console.log(error);
    }
  }

  function* executeGetWatermarksSettings({ payload }) {
    try {
      const response = yield call(api.getWatermarksSettings, payload);
      yield put(actions.setWatermarks(response.watermarks));
    } catch (error) {
      console.log(error);
    }
  }

  function* executeSetWatermarksSettings({ payload }) {
    const state = yield select();
    try {
      yield call(api.setWatermarksSettings, payload.id, payload.data);
      yield put(actions.setWatermarks([]));
      yield put({type: 'POLICY_MODULE:SET_TOAST_WATERMARK', payload: {type: 'success', text: 'Настройки водяных знаков сохранены успешно', status: true}})
      yield delay(2000);
      yield put(actions.clearSetWatermarks())
    } catch (error) {
      yield put({type: 'POLICY_MODULE:SET_TOAST_WATERMARK', payload: {type: 'error', text: 'Ошибка при сохранении настроек', status: true}})
      yield put(actions.clearSetWatermarks())
      console.log(error);
    }
  }

  /*
  function* executeLoadGroups() {
    try {
      const [ userGroups, printerGroups ] =
        yield [
          call(api.loadRuleGroups, 'usergroups'),
          call(api.loadRuleGroups, 'printergroups'),
        ];
      yield put(actions.getGroupsSuccess(userGroups.data, printerGroups.data));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.getGroupsFailed({ error: message }));
    }
  }

  function* executeAddMarkPolicy(data: any) {
    console.log(data);
    debugger;
    yield null;
  }

  function* executeStartMarkPolicyEdit({ payload }: any) {
    yield put({ type: 'POLICY_MODULE:SET_EDIT_MARK_POLICY', payload });
    yield executeLoadGroups();
    yield put({ type: 'POLICY_MODULE:SWITCH_MARK_MODAL' });
  }

  function* executeLoadTextData() {
    try {
      const response = yield call(policyApi.fetchTextData);
      console.log(response);
      yield put({ type: 'POLICY_MODULE:SET_TEXT_LABELS_DATA', payload: response.data });
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.getGroupsFailed({ error: message }));
    }
  }

  function* executeUploadImage({ payload }: any) {
    try {
      const form = new FormData();
      form.append('file', payload);
      const response = yield call(policyApi.uploadFile, form);
      yield put({type: 'POLICY_MODULE:SET_IMAGE_ID', payload: response.response.id });
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.getGroupsFailed({ error: message }));
    }
  }

  function* executeSaveMarkPolicy({ payload }: any) {
    let mode = payload.id !== -1 ? 'edit' : 'create';
    console.log(payload);
    try {
      let newData = { ...payload };
      if (mode === 'edit') {
        yield call(policyApi.editMarkPolicy, newData, payload.id);
      } else {
        const state = yield select();
        newData.operator_id = state.showResource.currentOperator.id;
        delete newData.id;
        yield call(policyApi.createMarkPolicy, newData);
      }
      yield put(injectResource('label_policies', showResourceFeature.actions.loadResource)(false, false));
      yield put({ type: 'POLICY_MODULE:SWITCH_MARK_MODAL' });
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.getGroupsFailed({ error: message }));
    }
  }

  function* executeStartEditRule({ meta, payload: { id } }: NS.IStartEditRule) {
    if (!meta) {
      throw Error('No meta');
    }
    try {
      yield executeLoadGroups();
      const formName = `add_${meta.resource}`;
      const editedRule = yield select((state: IReduxState) => getRuleById(state, id));
      const copyEditedRule = { ...editedRule };
      copyEditedRule.printergroups = editedRule.printergroups.map((group: IRuleGroup) => group.id.toString());
      copyEditedRule.usergroups = editedRule.usergroups.map((group: IRuleGroup) => group.id.toString());
      yield put(initialize(formName, copyEditedRule, true));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.getGroupsFailed({ error: message }));
    }
  }

  function* executeStartAddRule({ meta }: NS.IStartEditRule) { // #AddRule
    if (!meta) {
      throw Error('No meta');
    }
    try {
      const formName = `add_${meta.resource}`;
      const state: IReduxState = yield select();
      const rulesData = getRuleData(state);

      yield executeLoadGroups();

      const newRule = yield {
        // id: getId(rulesData),
        policyId: state.policy.choosenPolicyEdit ? state.policy.choosenPolicyEdit.id : null,
        seq: getId(rulesData)-1,
        usergroups: [],
        printergroups: [],
        hours: '000000000000000000000000',
        days: '0000000',
        action: 'permit',
        alert: false,
        counter: 16,
      };
      const copyEditedRule = { ...newRule };
      copyEditedRule.printergroups = newRule.printergroups.map((group: IRuleGroup) => group.id.toString());
      copyEditedRule.usergroups = newRule.usergroups.map((group: IRuleGroup) => group.id.toString());
      yield put(initialize(formName, copyEditedRule, true));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.getGroupsFailed({ error: message }));
    }
  }

  function* executeChangeRuleData({ meta }: NS.IChangeRuleData) {
    if (!meta) {
      throw Error('No meta!');
    }
    try {
      const formName = `add_${meta.resource}`;
      const ruleFormData = yield select(getFormValues(formName));
      const printerGroups = yield select((state: IReduxState) => getPrinterGroups(state));
      const userGroups = yield select((state: IReduxState) => getUserGroups(state));
      const ruleData: IRule[] = yield select((state: IReduxState) => getRuleData(state));
      const copyRuleFormData = { ...ruleFormData };
      const index = ruleData.findIndex((rule: IRule) => copyRuleFormData.id === rule.id);
      copyRuleFormData.printergroups = convertToRuleGroup(printerGroups, copyRuleFormData.printergroups);
      copyRuleFormData.usergroups = convertToRuleGroup(userGroups, copyRuleFormData.usergroups);
      yield put(showResourceFeature.actions.editRuleResource(copyRuleFormData, index));
      yield put(actions.switchModalStatus());
      yield put(actions.setPolicyEdit()); // # Кнопка Сохранить
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.getGroupsFailed({ error: message }));
    }
  }

  function* executeAddRuleData({ meta }: NS.IChangeRuleData) { // #AddRule
    
    if (!meta) {
      throw Error('No meta!');
    }
    const state: IReduxState = yield select();
    const rulesData = getRuleData(state);

    try {
      const formName = `add_${meta.resource}`;
      const ruleFormData = yield select(getFormValues(formName));
      const printerGroups = yield select((state: IReduxState) => getPrinterGroups(state));
      const userGroups = yield select((state: IReduxState) => getUserGroups(state));
      const copyRuleFormData = { ...ruleFormData };
      copyRuleFormData.printergroups = convertToRuleGroup(printerGroups, copyRuleFormData.printergroups);
      copyRuleFormData.usergroups = convertToRuleGroup(userGroups, copyRuleFormData.usergroups);
      yield put(showResourceFeature.actions.editRuleResource(copyRuleFormData, getId(rulesData)-1));
      yield put(actions.switchAddModal()); // #AddRule
      yield put(actions.setPolicyEdit()); // # Кнопка Сохранить
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.getGroupsFailed({ error: message }));
    }
  }

  function* executeDeleteRule({ meta, payload: { id } }: NS.IStartDeleteRule) {
    if (!meta) {
      throw Error('No meta!');
    }
    try {
      yield take(actions.acceptDeleteRule().type);
      yield put(showResourceFeature.actions.deleteRule(id));
      yield put(actions.switchRemoveModal());
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.setProgrammErrorToRedux({ error: message }));
    }
  }

  function* executeSendRuleData() {
    try {
      const state: IReduxState = yield select();
      const rulesData = getRuleData(state);
      const policyId = state.policy.choosenPolicyEdit ? state.policy.choosenPolicyEdit.id : null;
      const response = yield call(api.sendPolicyRule, rulesData, policyId);
      yield put(actions.sendRuleDataSuccess(response));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.sendRuleDataFailed({ error: message }));
    }
  }

  function* executeLoadHostGroups() {
    try {
      const response = yield call(policyApi.loadHostGroups);
      yield put(actions.setHostGroups(response.data));
      console.log(yield select());
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.sendRuleDataFailed({ error: message }));
    }
  }

  function* executeStartEditCopyPolicy({ payload }: any) {
    try {
      console.log(payload);
      if (payload === null) {
        yield put(initialize('add_agent_policies', {
          state: true,
          hours: "0",
          days: "0",
          value: "true",
          operator_id: 1,
          hostgroups: [],
        }, true));
      } else {
        payload.value = String(payload.value);
        payload.hostgroups = payload.hostgroups.map((group: any) => String(group));
        yield put(initialize('add_agent_policies', payload, true));
      }
      yield put(actions.switchModalStatus());
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.sendRuleDataFailed({ error: message }));
    }
  }
  function* executeStartEditTextMark({ payload }: any) {
    try {
      yield put(initialize('add_text_labels', payload, true));
      yield put(actions.switchModalStatus());
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.sendRuleDataFailed({ error: message }));
    }
  }

  function* executeActivateAgentPolicy({ payload }: any) {
    try {
      const addAgentPoliciesFormData = yield select(getFormValues('add_agent_policies'));
      const id = addAgentPoliciesFormData.id;
      yield call(policyApi.switchAgentPolicyValue, id, payload);
      yield put(actions.switchModalStatus());
      yield put(injectResource('agent_policies', showResourceFeature.actions.loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.sendRuleDataFailed({ error: message }));
    }
  }
  function* executeDecrypt() {
    try {
      const decryptFormData = yield select(getFormValues('decrypt'));
      const response = yield call(policyApi.decrypt, decryptFormData.result);
      console.log(response);
      console.log(response.err_code === 'not found')
      if (response.err_code === 'not found') {
        yield put(actions.setDecryptMessage('Не найдено')); // TODO 
      } else if (response.err_code === 'too many results') {
        yield put(actions.setDecryptMessage('Введено недостаточно символов')); // TODO 
      } else {
        yield put(actions.setDecryptMessage(response.result)); // TODO 
      }
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.sendRuleDataFailed({ error: message }));
    }
  }

  function* executeSaveCopyPolicy() {
    try {
      const formData = yield select(getFormValues('addBackup'));
      const createMode = Boolean(formData.id);
      
      const id = formData.id;

      formData.userGroups = formData.userGroups.map((group: any) => Number(group));
      formData.printerGroups = formData.printerGroups.map((group: any) => Number(group));

      delete formData.owner;

      if (!createMode) {
        yield call(policyApi.createCopyPolicy, formData);
      } else {
        yield call(policyApi.saveCopyPolicy, id, formData);
      }
      yield put(actions.switchModalStatus());
      yield put(injectResource('backup_policy', showResourceFeature.actions.loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.sendRuleDataFailed({ error: message }));
    }
  }

  function* executeStartEditEconomyPolicy({ payload }: any) {
    try {
      if (payload === null) {
        yield put(initialize('add_economies', {
          state: true,
          operator_id: 1,
          printergroups: [],
          usergroups: [],
          name: '',
          bw: false,
          duplex: false,
          economical: false,
        }, true));
      } else {
        payload.printergroups = payload.printergroups.map((group: any) => String(group));
        payload.usergroups = payload.usergroups.map((group: any) => String(group));
        yield put(initialize('add_economies', {...payload,
          bw: payload.type.includes('bw'),
          duplex: payload.type.includes('duplex'),
          economical: payload.type.includes('economical'),
        }, true));
      }
      yield put(actions.switchModalStatus({ status: false, mode: '' }));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.sendRuleDataFailed({ error: message }));
    }
  }

  function* executeSaveEconomyPolicy() {
    try {
      const formData = yield select(getFormValues('add_economies'));
      const createMode = Boolean(formData.id);

      const id = formData.id;
      formData.type = `${formData.bw ? "bw" : ''},${formData.duplex ? "duplex" : ''},${formData.economical ? "economical" : ''}`
      delete formData.bw;
      delete formData.duplex;
      delete formData.economical;

      formData.usergroups = formData.usergroups.map((group: any) => Number(group));
      formData.printergroups = formData.printergroups.map((group: any) => Number(group));

      delete formData.owner;
      // console.log('formData: ', formData);

      if (!createMode) {
        yield call(policyApi.createEconomyPolicy, formData);
      } else {
        yield call(policyApi.saveEconomyPolicy, id, formData);
      }
      yield put(actions.switchModalStatus({ status: false, mode: '' }));
      yield put(injectResource('all_policies', showResourceFeature.actions.loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.sendRuleDataFailed({ error: message }));
    }
  }
  */

  function* saga(): SagaIterator {

    const activateResource:   NS.IActivateResource   ['type'] = 'POLICY_MODULE:ACTIVATE_RESOURCE';
    const deactivateResource: NS.IDeactivateResource ['type'] = 'POLICY_MODULE:DEACTIVATE_RESOURCE';
    const deleteResource:     NS.IDeleteResource     ['type'] = 'POLICY_MODULE:DELETE_RESOURCE';
    const createResource:     NS.ICreateResource     ['type'] = 'POLICY_MODULE:CREATE_RESOURCE';
    const saveResource:       NS.ISaveResource       ['type'] = 'POLICY_MODULE:SAVE_RESOURCE';
    const startEditPolicy:      any = 'POLICY_MODULE:START_EDIT_POLICY';
    const getWatermarksSettings: any = 'POLICY_MODULE:GET_WATERMARKS_SETTINGS';
    const setWatermarksSettings: any = 'POLICY_MODULE:SET_WATERMARKS_SETTINGS';
    //const loadGroups:         NS.IGetGroups          ['type'] = 'POLICY_MODULE:GET_GROUPS';
    //const startEditRule:      NS.IStartEditRule      ['type'] = 'POLICY_MODULE:START_EDIT_RULE';
    //const editRule:           NS.IChangeRuleData     ['type'] = 'POLICY_MODULE:CHANGE_RULE_DATA';
    //const addRule:            NS.IAddRuleData        ['type'] = 'POLICY_MODULE:ADD_RULE_DATA'; // #AddRule
    //const startAddRule:       NS.IStartAddRule       ['type'] = 'POLICY_MODULE:START_ADD_RULE'; // #AddRule
    //const startDeleteRule:    NS.IStartDeleteRule    ['type'] = 'POLICY_MODULE:START_DELETE_RULE';
    //const sendRuleData:       NS.ISendRuleData       ['type'] = 'POLICY_MODULE:SEND_RULE_DATA';
    //const addMarkPolicy:      NS.IAddMarkPolicy       ['type'] = 'POLICY_MODULE:ADD_MARK_POLICY';
    //const startMarkPolicyEdit:      any = 'POLICY_MODULE:SET_MARK_POLICY_EDIT';
    //const saveMarkPolicy:      any = 'POLICY_MODULE:SAVE_MARK_POLICY';
    //const loadTextData:      any = 'POLICY_MODULE:LOAD_TEXT_DATA';
    //const uploadImage:      any = 'POLICY_MODULE:UPLOAD_IMAGE';
    //const loadHostGroups:      any = 'POLICY_MODULE:LOAD_HOST_GROUPS';
    //const activateAgentPolicy:      any = 'POLICY_MODULE:ACTIVATE_AGENT_POLICY';
    //const startEditCopyPolicy:      any = 'POLICY_MODULE:START_EDIT_COPY_POLICY';
    //const startEditEconomyPolicy:      any = 'POLICY_MODULE:START_EDIT_ECONOMY_POLICY';
    //const saveCopyPolicy:      any = 'POLICY_MODULE:SAVE_COPY_POLICY';
    //const saveEconomyPolicy:      any = 'POLICY_MODULE:SAVE_ECONOMY_POLICY';
    //const decrypt:      any = 'POLICY_MODULE:DECRYPT';
    //const startEditTextMark:      any = 'POLICY_MODULE:START_EDIT_TEXT_MARK';

    yield all([
      takeLatest(activateResource, executeActivateResource),
      takeLatest(deactivateResource, executeDeactivateResource),
      takeLatest(deleteResource, executeDeleteResource),
      takeLatest(createResource, executeCreateResource),
      takeLatest(startEditPolicy, executeStartEditPolicy),
      takeLatest(saveResource, executeSaveResource),
      takeLatest(getWatermarksSettings, executeGetWatermarksSettings),
      takeLatest(setWatermarksSettings, executeSetWatermarksSettings),
      //takeLatest(loadGroups, executeLoadGroups),
      //takeLatest(startEditRule, executeStartEditRule),
      //takeLatest(editRule, executeChangeRuleData),
      //takeLatest(addRule, executeAddRuleData),
      //takeLatest(startAddRule, executeStartAddRule),
      //takeLatest(startDeleteRule, executeDeleteRule),
      //takeLatest(sendRuleData, executeSendRuleData),
      //takeLatest(addMarkPolicy, executeAddMarkPolicy),
      //takeLatest(startMarkPolicyEdit, executeStartMarkPolicyEdit),
      //takeLatest(saveMarkPolicy, executeSaveMarkPolicy),
      //takeLatest(loadTextData, executeLoadTextData),
      //takeLatest(uploadImage, executeUploadImage),
      //takeLatest(loadHostGroups, executeLoadHostGroups),
      //takeLatest(activateAgentPolicy, executeActivateAgentPolicy),
      //takeLatest(startEditCopyPolicy, executeStartEditCopyPolicy),
      //takeLatest(startEditEconomyPolicy, executeStartEditEconomyPolicy),
      //takeLatest(saveCopyPolicy, executeSaveCopyPolicy),
      //takeLatest(saveEconomyPolicy, executeSaveEconomyPolicy),
      //takeLatest(decrypt, executeDecrypt),
      //takeLatest(startEditTextMark, executeStartEditTextMark),
    ]);
  }

  return saga;
}

export default getSaga;

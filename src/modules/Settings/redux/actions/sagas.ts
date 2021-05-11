import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {SagaIterator} from 'redux-saga';
import {getFormValues, initialize, startSubmit, stopSubmit} from 'redux-form';
import {IExtraArguments, IOperator, IReduxState} from 'shared/types/app';
import {getErrorMsg, getResourceById, getResourceByTag} from 'shared/helpers';
import * as NS from '../../namespace';
import {IConvertedRole, IData, IRole, IRule, IRuleDescription} from '../../namespace';
import * as actions from './communication';
import injectResource from 'shared/helpers/injectResource';
import {loadResource, loadResourceFailed} from 'features/showResource/redux/actions/communication';
import {initDelay} from 'shared/api/converters/globalutils';
import {settingsApi} from './../../api';

import {saveAs} from 'file-saver';

function getSaga({ api }: IExtraArguments) {

  function* executeLoadFeatures(): any {
    try {
      const data = yield call(api.loadCurrentOperator);
      yield put({ type: 'SETTINGS_MODULE:SET_FEATURES_DATA', payload: data.features });
    } catch (error) {
      console.log('ERROR!'); // TODO Поправить
    }
  }

  function* executeSaveFeatures({ payload }: NS.ISaveFeatures) {
    try {
      yield put({ type: 'SETTINGS_MODULE:SET_LOADING', payload: true });
      yield call(api.saveFeatures, payload);
      yield initDelay(500);
      yield executeLoadFeatures();
    } catch (error) {
      console.log('ERROR!'); // TODO Поправить
    }
    yield put({ type: 'SETTINGS_MODULE:SET_LOADING', payload: false });
  }

  function* executeResourceDeleting({ meta, payload }: NS.IAcceptDeleteResource) {
    if (!meta) {
      throw Error('No meta');
    }
    try {
      const response = yield call(api.deleteResource, meta.resource, payload);
      yield put(actions.acceptDeleteResourceSuccess({ response }));
      yield put(actions.switchRemoveModal());
      yield put(injectResource(meta.resource, loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.acceptDeleteResourceFailed({ error: message }));
//      yield put(actions.switchRemoveModal());
//      yield put(actions.switchAlertModal());
    }
  }

  function* executeResourceEdit({ meta, payload }: NS.IEditResourceAction) {
    if (!meta) {
      throw Error('No meta');
    }
    const resource = meta.resource || '';
    const formName = `edit${resource.slice(0, 1).toUpperCase()}${resource.slice(1)}`;
    try {
      const editedRole: IRole = yield select((thisState: IReduxState) => getResourceById(meta.resource, thisState, payload));

      const accessRules: any = editedRole.access_rules;

      for (const key in accessRules) {
        if (accessRules.hasOwnProperty(key) && key.includes('.') && editedRole.access_rules) {
          const newKey = key.replace(/\./g, '--');
          editedRole.access_rules[newKey] = editedRole.access_rules[key];
          delete editedRole.access_rules[key];
        }
      }

      let authorities:any = []
      editedRole.authorities.forEach(function(item, i) {
        authorities.push(String(item['orderPosition']))
      });

      const convertedRole: IConvertedRole = {
        id: editedRole.id,
        name: editedRole.name,
        description: editedRole.description,
        authorities: authorities,
      };

      yield put(actions.switchModalStatus({ status: true, mode: 'edit' }));
      yield put(initialize(formName, convertedRole, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'SETTINGS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeOperatorsResourceEdit({ meta, payload }: NS.IEditOperatorsResourceAction) {
    if (!meta) {
      throw Error('No meta');
    }
    const resource = meta.resource || '';
    const formName = `edit${resource.slice(0, 1).toUpperCase()}${resource.slice(1)}`;
    try {
      const editedOperator: any = yield select((state: IReduxState) => (
        getResourceById(meta.resource, state, payload)
      ));
      yield put(actions.switchModalStatus({ status: true, mode: 'edit' }));
      yield put(initialize(formName, editedOperator, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'SETTINGS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeTemplatesResourceEdit({ meta, payload }: NS.IExecuteTemplatesResourceEdit) {
    if (!meta) {
      throw Error('No meta');
    }
    const resource = meta.resource || '';
    const formName = `edit${resource.slice(0, 1).toUpperCase()}${resource.slice(1)}`;
    try {
      let editedTemplate: any = null;
      if(payload !== null) {
        editedTemplate = yield select((state: IReduxState) => (
          getResourceByTag(meta.resource, state, payload)
        ));
      } else {
        let state = yield select();
        editedTemplate = state.showResource.templates.baseTemplate
      }
      yield put(actions.switchModalStatus({ status: true, mode: 'edit' }));
      yield put(initialize(formName, editedTemplate, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'SETTINGS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeSaveTemplate({ meta }: NS.ISaveTemplate) {
    if (!meta) {
      throw Error('No meta');
    }
    const resource = meta.resource || '';
    const formName = `edit${resource.slice(0, 1).toUpperCase()}${resource.slice(1)}`;
    const formValues: any = yield select(getFormValues(formName));
    try {
      yield call(api.saveTemplate, formValues, formValues.tag);
      yield put(actions.switchModalStatus({ status: false, mode: 'edit' }));
      yield put(injectResource(meta.resource, loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'SETTINGS_MODULE:SAVE_CHANGES_TEMPALTES_FAILED', payload: message });
      yield put(stopSubmit(formName, { _error: message }));
    }
  }

  function* executeSaveBaseTemplate({ meta }: NS.ISaveBaseTemplate) {
    if (!meta) {
      throw Error('No meta');
    }
    const resource = meta.resource || '';
    const formName = `edit${resource.slice(0, 1).toUpperCase()}${resource.slice(1)}`;
    const formValues: any = yield select(getFormValues(formName));
    try {
      yield call(api.saveBaseTemplate, formValues/*, formValues.key*/);
      yield put(actions.switchModalStatus({ status: false, mode: 'edit' }));
      yield put(injectResource(meta.resource, loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'SETTINGS_MODULE:SAVE_CHANGES_TEMPALTES_FAILED', payload: message });
      yield put(stopSubmit(formName, { _error: message }));
    }
  }

  function* executeAcceptChanges({ meta }: NS.IEditResourceAction) {
    if (!meta) {
      throw Error('No meta');
    }
    const resource = meta.resource || '';
    const formName = `edit${resource.slice(0, 1).toUpperCase()}${resource.slice(1)}`;
    try {
      const state = yield select();
      const formValues = yield select(getFormValues(formName));

      const rulesDescription = state.settings.ruleDescription;
      const accesRulesData: IRule = {};
      rulesDescription.forEach((rule: IRuleDescription) => accesRulesData[rule.name] = formValues[rule.name]);

      for (const key in accesRulesData) {
        if (key.includes('--')) {
          const newKey = key.replace(/--/g, '.');
          accesRulesData[newKey] = accesRulesData[key];
          delete accesRulesData[key];
        }
      }

      let authorities:any = [];
      formValues.authorities.map((el, i) => {
        if(typeof(el) == 'string'){
          state.settings.authorities.map((item) => {
            if(el == item.orderPosition) {
              let tag = {tag: item.tag}
              authorities.push(tag)
            }
          })
        } else {
          authorities.push(el)
        }
      })

      const dataRequest: IData = {
        name: formValues.name,
        description: formValues.description,
        authorities: authorities
      };
      
      yield call(api.changeRole, dataRequest, formValues.id);
      yield put(actions.switchModalStatus({ status: false, mode: 'edit' }));
      yield put(injectResource(resource, loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(stopSubmit(formName, { _error: message }));
      yield put({ type: 'SETTINGS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeCreateResource({ meta }: NS.IEditResourceAction) {
    if (!meta) {
      throw Error('No meta');
    }
    const resource = meta.resource || '';
    const formName = `edit${resource.slice(0, 1).toUpperCase()}${resource.slice(1)}`;
    try {
      const state = yield select();
      const formValues = yield select(getFormValues(formName));

      for (const key in formValues) {
        if (formValues.hasOwnProperty(key) && key.includes('--')) {
          const newKey = key.replace(/--/g, '.');
          formValues[newKey] = formValues[key];
          delete formValues[key];
        }
      }

      const rulesDescription = state.settings.ruleDescription;

      const mappedRulesDescription = rulesDescription.map((item: any) => ({
        displayName: item.displayName,
        name: item.name.replace(/--/g, '.'),
      }));

      const accessRulesData: IRule = {};
      mappedRulesDescription.forEach((rule: IRuleDescription) => (
        accessRulesData[rule.name] = formValues[rule.name]
      ));

      let authorities:any = [];
      formValues.authorities.map((el, i) => {
        state.settings.authorities.map((item) => {
          if(el == item.orderPosition) {
            let tag = {tag: item.tag}
            authorities.push(tag)
          }
        })
      })

      const dataRequest: IData = {
        name: formValues.name,
        description: formValues.description,
        authorities: authorities
      };

      const response = yield call(api.createRole, dataRequest);
      yield put({ type: 'SETTINGS_MODULE:CREATE_RESOURCE_SUCCESS', payload: response, meta });
      //yield put(stopSubmit(formName));
      yield put(actions.switchModalStatus({ status: false, mode: 'create' }));
      yield put(injectResource(resource, loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(stopSubmit(formName, { _error: message }));
      yield put({ type: 'SETTINGS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeDownloadReport({ meta }: NS.IDownloadReport){
    if (!meta) {
      throw Error('No meta');
    }
    try {
      const formValues: any = yield select(getFormValues("editReport"));
      const startIso = new Date(formValues.startDate).toISOString();
      const endIso = new Date(formValues.endDate).toISOString();

      const newValues = {
        ...formValues,
        startDate: startIso,
        endDate: endIso
      }

      let sd = startIso.slice(0,10)
      let ed = endIso.slice(0,10)
      let type = '';
      if(formValues.type == 'PRINTER'){
        type = "принтерам"
      }
      if(formValues.type == 'USER'){
        type = "пользователям"
      }
      if(formValues.type == 'USER_GROUP'){
        type = "группам пользователей"
      }

      if(formValues.type == 'PRINTER_GROUP'){
        type = "группам принтеров"
      }

      const response = yield call(api.dowloadReport, newValues);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      saveAs(url, `Printer_Guard_Отчёт_по_${type}_с_${sd}_по_${ed}.xls`);

      yield put(actions.switchModalStatus({ status: false, mode: 'create' }));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'SETTINGS_MODULE:CREATE_OPERATORS_FAILED', payload: message });
    }
  }

  function* executeCreateOperators({ meta }: NS.ICreateOperatorsResource) {
    if (!meta) {
      throw Error('No meta');
    }
    const resource = meta.resource || '';
    const formName = `edit${resource.slice(0, 1).toUpperCase()}${resource.slice(1)}`;
    const formValues: IOperator = yield select(getFormValues(formName));
    try {
      yield call(api.createOperators, formValues);
      yield put(actions.switchModalStatus({ status: false, mode: 'create' }));
      yield put(injectResource(meta.resource, loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'SETTINGS_MODULE:CREATE_OPERATORS_FAILED', payload: message });
      yield put(stopSubmit(formName, { _error: message }));
    }
  }

  function* executeSaveOperatorChanges({ meta }: NS.ICreateOperatorsResource) {
    if (!meta) {
      throw Error('No meta');
    }
    const resource = meta.resource || '';
    const formName = `edit${resource.slice(0, 1).toUpperCase()}${resource.slice(1)}`;
    const formValues: IOperator = yield select(getFormValues(formName));
    try {
      yield call(api.saveOperatorsChanges, formValues, formValues.id);
      yield put(actions.switchModalStatus({ status: false, mode: 'edit' }));
      yield put(injectResource(meta.resource, loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'SETTINGS_MODULE:SAVE_CHANGES_OPERATORS_FAILED', payload: message });
      yield put(stopSubmit(formName, { _error: message }));
    }
  }

  function* executeAddBlockedPrinter() {
    try {
      const formName = `add_blocked_printer`;
      const formValues: IOperator = yield select(getFormValues(formName));
      const response = yield call(api.addBlockedPrinter, formValues);
      yield put(actions.switchModalStatus({ status: false, mode: 'edit' }));
      yield put(injectResource('blockedprinters', loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.switchModalStatus({ status: false, mode: 'edit' }));
    }
  }

  function* executeRemoveBlockedPrinter({ payload  }: any) {
    try {
      yield call(api.deleteBlockedPrinter, payload);
      yield put(actions.switchRemoveModal());
      yield put(injectResource('blockedprinters', loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(injectResource('blockedprinters', loadResourceFailed)(message));
    }
  }

  function* executeFetchCurrentVersion() {
    try {
      const response = yield call(settingsApi.getCurrentVersion);
      yield put(actions.setCurrentVersion(response.response));
    } catch (error) {
      const message = getErrorMsg(error);
    }
  }

  function* executeFetchAllVersions() {
    try {
      const response = yield call(settingsApi.getAvailableVersions);
      console.log(response);
      yield put(actions.setAvailableVersions(response.response));
    } catch (error) {
      const message = getErrorMsg(error);
      console.error(message);
    }
  }

  function* executeUpload() {
    try {
      yield put(actions.switchUpdateModal());
      yield put(actions.switchBlockModal());

      let counter = 0;
      let currentOperatorResponse = null;

      yield call(settingsApi.runUpdate);

      while (!currentOperatorResponse && counter < 180) {
        try {
          currentOperatorResponse = yield call(api.loadCurrentOperator);
        } catch (error) {
          yield new Promise((res) => { setTimeout(res, 5000); } );
        }
      }

      yield executeFetchCurrentVersion();
      yield executeFetchAllVersions();
      yield put(actions.switchBlockModal());
    } catch (error) {
      console.error(getErrorMsg(error));
    }
  }

  function* loadSmtp() {
    try {
      const response = yield call(settingsApi.getSmtpConfig);
      yield put(initialize('smtp', response, false));
    } catch (error) {
      console.error(getErrorMsg(error));
    }
  }

  function* saveSmtp() {
    try {
      const formValues = yield select(getFormValues('smtp'));

      delete formValues.active; // TODO dirty
      yield call(settingsApi.setSmtpConfig, formValues);
      // const response = yield call(settingsApi.setSmtpConfig, formValues);
      // console.log(response);
      yield call(loadSmtp);
    } catch (error) {
      console.error(getErrorMsg(error));
    }
  }

  // function* saveLicense() {
  //   const formData = yield select(getFormValues('set_license_form'));
  //   try {
  //     yield call(settingsApi.setLicense, formData.key);
  //     // const response = yield call(settingsApi.setLicense, formData.key);
  //     // console.log("response: ", response);
  //     yield* getLicenseInfo();
  //     yield put(actions.switchLicenseModal());
  //   } catch (error) {
  //     const message = getErrorMsg(error);
  //     console.error(message);
  //     yield put({
  //       type: 'SHOW_RESOURCE:SHOW_ALERT',
  //       payload: {
  //         type: 'error',
  //         message: 'Некорректный ключ лицензии',
  //       },
  //     });
  //   }
  // }

  // function* executeStartEditLicense() {
  //   try {
  //     yield select();
  //     // const state = yield select();
  //     // console.log(state);
  //     yield put(actions.switchLicenseModal());
  //   } catch (error) {
  //     console.error(getErrorMsg(error));
  //   }
  // }

  // function* getLicenseInfo() {
  //   return; // Not functional at the moment
  //   try {
  //     const response = yield call(settingsApi.getLicenseInfo);
  //     yield put(actions.setLicenseData(response.data));
  //   } catch (error) {
  //     console.error(getErrorMsg(error));
  //   }
  // }

  function* executeAddLicense() {
    try {
      const formValues = yield select(getFormValues('addLicense'));
      const response = yield call(settingsApi.addLicense, formValues);
      console.log('response', response)
      yield put(actions.switchLicenseModalStatus({ status: false, mode: 'create', licenseId: null }));
      yield put(injectResource('licenses', loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(stopSubmit('addLicense', { _error: message }));
    }
  }

  function* executeEditLicense({ payload }: any) {

    console.log('EDIT', payload)
    const formName = 'addLicense'
    try {
      const editedResource = yield select((state: IReduxState) => (
        getResourceById('licenses', state, payload)),
      );

      yield put(actions.switchLicenseModalStatus({ status: true, mode: 'edit', licenseId: payload }));
      yield put(initialize(formName, editedResource, true));
      yield put(injectResource('licenses', loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'SETTINGS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executePushEditLicense({ payload }: any) {
    try {
      const formValues = yield select(getFormValues('addLicense'));
      console.log('formValues', formValues)
      const response = yield call(settingsApi.editLicense, payload, formValues);
      console.log('response', response)
      yield put(actions.switchLicenseModalStatus({ status: false, mode: 'create', licenseId: null }));
      yield put(injectResource('licenses', loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'SETTINGS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
      yield put(stopSubmit('addLicense', { _error: message }));
    }
  }

  function* getAuthorities() {
    try {
      const response = yield call(api.getAuthorities);
      yield put({ type: 'SETTINGS_MODULE:GET_AUTHORITIES_SUCCESS', payload: response });
    } catch (error) {
      console.error(getErrorMsg(error));
    }
  }

  function* saga(): SagaIterator {
    const deleteResourceType: NS.IAcceptDeleteResource ['type'] = 'SETTINGS_MODULE:ACCEPT_DELETE_ROLE';
    const editResourceType: NS.IEditResourceAction ['type'] = 'SETTINGS_MODULE:EDIT_RESOURCE';
    const editOperatorsResource: NS.IEditOperatorsResourceAction ['type'] = 'SETTINGS_MODULE:EDIT_OPERATORS_RESOURCE';
    const editTemplatesResource: NS.IExecuteTemplatesResourceEdit ['type'] = 'SETTINGS_MODULE:EDIT_TEMPLATES_RESOURCE';
    const acceptEditResourceChangesType: NS.ISaveChangeRole ['type'] = 'SETTINGS_MODULE:SAVE_CHANGE_ROLE';
    const createRoleType: NS.ICreateRole ['type'] = 'SETTINGS_MODULE:SAVE_CREATE_ROLE';
    const createOperatorsType: NS.ICreateOperatorsResource ['type'] = 'SETTINGS_MODULE:CREATE_OPERATORS_RESOURCE';
    const downloadReport: NS.IDownloadReport ['type'] = 'SETTINGS_MODULE:DOWNLOAD_REPORT';
    const saveOperatorChanges: NS.ISaveChangesOperatorsResource ['type'] = 'SETTINGS_MODULE:SAVE_CHANGES_OPERATORS_RESOURCE';
    const loadFeatures: NS.ILoadFeatures ['type'] = 'SETTINGS_MODULE:LOAD_FEATURES';
    const saveFeatures: NS.ISaveFeatures ['type'] = 'SETTINGS_MODULE:SAVE_FEATURES';
    const saveTemplate: NS.ISaveTemplate ['type'] = 'SETTINGS_MODULE:SAVE_TEMPLATE';
    const saveBaseTemplate: NS.ISaveBaseTemplate ['type'] = 'SETTINGS_MODULE:SAVE_BASE_TEMPLATE';
    const addBlockedPrinter: NS.IAddBlockedPrinter ['type'] = 'SETTINGS_MODULE:ADD_BLOCKED_PRINTER';
    const removeBlockedPrinter: NS.IRemoveBlockedPrinter ['type'] = 'SETTINGS_MODULE:REMOVE_BLOCKED_PRINTER';
    const upload: NS.IExecuteUpdate ['type'] = 'SETTINGS_MODULE:EXECUTE_UPDATE';
    const fetchCurrentVersion: NS.IGetCurrentVersion ['type'] = 'SETTINGS_MODULE:GET_CURRENT_VERSION';
    const fetchAllVersions: NS.IGetAvailableVersions ['type'] = 'SETTINGS_MODULE:GET_AVAILABLE_VERSIONS';
    const fetchLicenseInfo: NS.IGetLicenseInfo ['type'] = 'SETTINGS_MODULE:GET_LICENSE_INFO';
    const fetchAuthorities: NS.IGetAuthorities ['type'] = 'SETTINGS_MODULE:GET_AUTHORITIES';
    const saveLicenseInfo: NS.ISetLicenseInfo ['type'] = 'SETTINGS_MODULE:SET_LICENSE_INFO';
    const startEditLicense: NS.IStartEditLicenseInfo ['type'] = 'SETTINGS_MODULE:START_EDIT_LICENSE_INFO';
    const loadSmtpConfig = 'SETTING_MODULE:LOAD_SMTP';
    const saveSmtpConfig = 'SETTING_MODULE:SAVE_SMTP';
    const addLicense: NS.IAddLicense ['type'] = 'SETTINGS_MODULE:ADD_LICENSE';
    const editLicense: NS.IEditLicense ['type'] = 'SETTINGS_MODULE:EDIT_LICENSE';
    const pushEditLicense: NS.IPushEditLicense ['type'] = 'SETTINGS_MODULE:PUSH_EDIT_LICENSE';

    yield all([
      takeLatest(editResourceType, executeResourceEdit),
      takeLatest(editOperatorsResource, executeOperatorsResourceEdit),
      takeLatest(editTemplatesResource, executeTemplatesResourceEdit),
      takeLatest(deleteResourceType, executeResourceDeleting),
      takeLatest(acceptEditResourceChangesType, executeAcceptChanges),
      takeLatest(createRoleType, executeCreateResource),
      takeLatest(createOperatorsType, executeCreateOperators),
      takeLatest(downloadReport, executeDownloadReport),
      takeLatest(saveOperatorChanges, executeSaveOperatorChanges),
      takeLatest(loadFeatures, executeLoadFeatures),
      takeLatest(saveFeatures, executeSaveFeatures),
      takeLatest(saveTemplate, executeSaveTemplate),
      takeLatest(saveBaseTemplate, executeSaveBaseTemplate),
      takeLatest(addBlockedPrinter, executeAddBlockedPrinter),
      takeLatest(removeBlockedPrinter, executeRemoveBlockedPrinter),
      takeLatest(upload, executeUpload),
      takeLatest(fetchCurrentVersion, executeFetchCurrentVersion),
      takeLatest(fetchAllVersions, executeFetchAllVersions),
      takeLatest(loadSmtpConfig, loadSmtp),
      takeLatest(saveSmtpConfig, saveSmtp),
      // takeLatest(fetchLicenseInfo, getLicenseInfo),
      takeLatest(fetchAuthorities, getAuthorities),
      // takeLatest(saveLicenseInfo, saveLicense),
      // takeLatest(startEditLicense, executeStartEditLicense),
      takeLatest(addLicense, executeAddLicense),
      takeLatest(editLicense, executeEditLicense),
      takeLatest(pushEditLicense, executePushEditLicense)
    ]);
  }

  return saga;
}

export { getSaga };

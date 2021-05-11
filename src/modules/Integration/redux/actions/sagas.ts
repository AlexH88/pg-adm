import { put, call, select, takeLatest, take, takeEvery, delay, all } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import { startSubmit, stopSubmit, initialize, getFormValues } from 'redux-form';
import {
  getErrorMsg,
  getResourceById,
  IInjectedResource,
  formatByResource,
  checkFieldsCatalogForm,
} from 'shared/helpers';
import { IReduxState, IExtraArguments, IResource } from 'shared/types/app';
import { IUser } from 'shared/types/users';
import * as showResourceFeature from 'features/showResource';
import { 
  switchRemoveModalStatus,
  switchModalStatus,
  testPostConnection,
  setCatalogGroupsList,
  setCatalogsList,
  syncCatalogData,
  testCatalogConnection,
  testConnentClear
 } from './communication';
import * as actionTypes from '../../namespace';
import injectResource from 'shared/helpers/injectResource';
import * as CryptoJS from 'crypto-js';
import { getUserById, selectIsAllSelected } from 'modules/Users/redux/actions/selectors';
import actions from './index';
import {updateIndividualResourceItem} from 'features/showResource/redux/actions/communication';



function getSaga({ api }: IExtraArguments) {

  function* executeResourceCreates(action: actionTypes.ICreateResourceAction & IInjectedResource) {
//    const resource = `integration`;
//    const formName = `addSettingsPost`;

    const resource = action.meta ? action.meta.resource : '';
    const formName = `add${resource.slice(0, 1).toUpperCase()}${resource.slice(1)}`;

    try {
      yield put(startSubmit(formName));
/*      const newEntry: any = yield select(getFormValues(formName));
      const newEditedResource: any = {
        ...newEntry,
      };*/

      let response: any
      if(resource == 'integration'){
        let newEntry: any = yield select(getFormValues('addSettingsPost'));
        let newEditedResource: any = {
          ...newEntry,
        };
        response = yield call(api.savePostConnection, newEntry);
      } else {
        let newEntry: any = yield select(getFormValues(formName));
        let newEditedResource: any = {
          ...newEntry,
        };
        response = yield call(api.createResource, resource, formatByResource(resource, newEditedResource));
      }

      yield put({ type: 'INTEGRATION-MODULE:CREATE_RESOURCE_SUCCESS', payload: response });
      yield put(stopSubmit(formName));
      yield put(switchModalStatus({ status: false, mode: 'create' }));
      yield put(injectResource(resource, showResourceFeature.actions.loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'INTEGRATION-MODULE:EDIT_RESOURCE_FAILED', payload: message });
      yield put(stopSubmit(formName, { _error: message }));
    }
  }

  function* executeResourceEdits(action: actionTypes.IEditResourceAction & IInjectedResource) {
    const resource = action.meta ? action.meta.resource : '';
    let formName = `add${resource.slice(0, 1).toUpperCase()}${resource.slice(1)}`;

    if(resource == 'integration'){
      formName = 'addSettingsPost'
    }

    try {
      const editedResource: IResource = yield select((state: IReduxState) => (
        getResourceById(resource, state, action.payload.id)),
      );

      const newEditedResource = { ...editedResource };

      yield put(switchModalStatus({ status: true, mode: action.payload.mode }));
      yield put(initialize(formName, newEditedResource, true));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'INTEGRATION-MODULE:EDIT_RESOURCE_FAILED', payload: message });
      yield put(stopSubmit(formName, { _error: message }));
    }
  }


  function* executeTestPostConnection({ meta: { resource } = { resource: '' }, payload }: actionTypes.ITestPostConnection) {
    const formName = `addSettingsPost`;
    try {
      let testedIntegration: any;
      testedIntegration = yield select(getFormValues(formName));

      if(payload !== null) {
        testedIntegration = payload
      }

      const response = yield call(api.testMailConnection, testedIntegration);

      if (response.status === 200 && payload) {
        testedIntegration.connection = response.data.connectionResult.success;
        yield put(injectResource(resource, updateIndividualResourceItem)(testedIntegration));
      }

      if (response.data.connectionResult.success === true){
        yield put({ type: 'INTEGRATION-MODULE:TEST_CONNECT_SUCCESS', payload: "Соединение успешно установлено" });
      } else {
        yield put({ type: 'INTEGRATION-MODULE:TEST_CONNECT_SUCCESS', payload: "Соединение не установлено" });
      }
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'INTEGRATION-MODULE:EDIT_RESOURCE_FAILED', payload: message });
      yield put(stopSubmit(formName, { _error: message }));
    }
  }

  function* executeGetCurrentStatusIntegrations({ meta: { resource } = { resource: '' } }: actionTypes.IGetCurrentStatusIntegration) {
    try {
      const response = yield call(api.getCurrentStatusIntegration);
      if (response.status === 200 && response.data) {
        yield put({ type: 'INTEGRATION-MODULE:SET_CURRENT_STATUS', payload: response.data });
      }
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'INTEGRATION-MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeEnableIntegration({ meta: { resource } = { resource: '' }, payload }: actionTypes.IEnableIntegration) {
    const state: IReduxState = yield select();
    try {
      const response = yield call(api.enableIntegration);
      const { data } = state.showResource[resource];

      if (response.status === 202 && data && data[0]) {
        const updatedIntegration = data[0].find((item: any) => item.id === payload);
        if (updatedIntegration) {
          updatedIntegration.enabled = true;
          yield put(injectResource(resource, updateIndividualResourceItem)(updatedIntegration));
        }
      }

      yield put(injectResource(resource, testPostConnection)(data[0][0]));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'INTEGRATION-MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeDisableIntegration({ meta: { resource } = { resource: '' }, payload }: actionTypes.IDisableIntegration) {
    const state: IReduxState = yield select();
    try {
      const response = yield call(api.disableIntegration);
      const { data } = state.showResource.integration;

      if (response.status === 202 && data && data[0]) {
        const updatedIntegration = data[0].find((item: any) => item.id === payload);
        if (updatedIntegration) {
          updatedIntegration.enabled = false;
          updatedIntegration.connection = false;
          yield put(injectResource(resource, updateIndividualResourceItem)(updatedIntegration));
        }
      }
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'INTEGRATION-MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeEditedResourceSaving(action: actionTypes.ISaveEditResourceAction & IInjectedResource) {
    const resource = action.meta ? action.meta.resource : '';
    const formName = `add${resource.slice(0, 1).toUpperCase()}${resource.slice(1)}`;
    try {
      yield put(startSubmit(formName));
      const editedResource: IResource = yield select(getFormValues(formName));

      const newEditedResource = {
        ...editedResource,
      };
      delete newEditedResource.status;

      console.log('newEditedResource', newEditedResource)

      const response: IResource = yield call(api.editResource, resource, formatByResource(resource, newEditedResource));

      yield put({ type: 'INTEGRATION-MODULE:SAVE_EDIT_RESOURCE_SUCCESS', payload: response, meta: action.meta });
      yield put(injectResource(resource, showResourceFeature.actions.loadResource)(false, false));
      yield put(stopSubmit(formName));
      yield put(switchModalStatus({ status: false, mode: 'edit' }));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'INTEGRATION-MODULE:SAVE_EDIT_RESOURCE_FAILED', payload: message, meta: action.meta });
      yield put(stopSubmit(formName, { _error: message }));
    }
  }

  function* executeStartEditCatalogData({ meta, payload }: actionTypes.ISetEditChoosenCatalogName) {
    try {
      yield put({ type: 'SYNC_RESOURCE:SYNC_MODAL_ERROR', payload: false }); // Убрать текст ошибки
      const data = yield call(api.getCatalogsList, payload); // Получить данные с rest api
      yield put(actions.switchSyncModal()); // Открыть модальное окно

      yield put({ type: 'SYNC_RESOURCE:LOAD_SYNC_DATA_SUCCESS', payload: data.data, meta });
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'INTEGRATION-MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeSyncCatalogData({ payload }: actionTypes.ISyncCatalogData) {
    try {
      let status = true;
      yield call(api.catalogSyncStart, payload);

      while (status) {
        yield new Promise((res) => setTimeout(res, 3000));
        const response = yield call(api.catalogSyncStatus, payload);

        for (const key in response.data.log) {
          console.log(response.data.log[key]);
        }
        status = response.data.inProgress;
      }
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'INTEGRATION-MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeEnableCatalog({ meta: { resource } = { resource: '' }, payload }: actionTypes.IEnableCatalog) {
    const state: IReduxState = yield select();
    try {
      const response = yield call(api.enableCatalog, payload);
      const { data } = state.showResource[resource];

      if (response.status === 202 && data && data[0]) {
        const updatedCatalog = data[0].find((item: any) => item.id === payload);
        if (updatedCatalog) {
          updatedCatalog.enabled = true;
          yield put(injectResource(resource, updateIndividualResourceItem)(updatedCatalog));
        }
      }

      yield put(injectResource(resource, testCatalogConnection)(payload));
      yield put(injectResource(resource, syncCatalogData)(payload));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'INTEGRATION-MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeDisableCatalog({ meta: { resource } = { resource: '' }, payload }: actionTypes.IDisableCatalog) {
    const state: IReduxState = yield select();
    try {
      const response = yield call(api.disableCatalog, payload);
      const { data } = state.showResource.catalogs;

      if (response.status === 202 && data && data[0]) {
        const updatedCatalog = data[0].find((item: any) => item.id === payload);
        if (updatedCatalog) {
          updatedCatalog.enabled = false;
          updatedCatalog.connection = false;
          yield put(injectResource(resource, updateIndividualResourceItem)(updatedCatalog));
        }
      }
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'INTEGRATION-MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeTestCatalogConnection({ meta: { resource } = { resource: '' }, payload }: actionTypes.ITestCatalogConnection) {
    const formName = `add${resource.slice(0, 1).toUpperCase()}${resource.slice(1)}`;

    try {
      let testedCatalog: any;

      if (!payload) {
        testedCatalog = yield select(getFormValues(formName));
        testedCatalog.enabled = true;
      } else {
        const state: IReduxState = yield select();
        const { data } = state.showResource.catalogs;

        if (data && data[0]) {
          testedCatalog = data[0].find((item: any) => item.id === payload);
        }
      }
      const response = yield call(api.testCatalogConnection, testedCatalog);

      if (response.status === 200 && payload) {
        testedCatalog.connection = response.data.connectionResult.success;
        yield put(injectResource(resource, updateIndividualResourceItem)(testedCatalog));
      }

      if (response.data.connectionResult.success === true){
        yield put({ type: 'INTEGRATION-MODULE:TEST_CONNECT_SUCCESS', payload: "Соединение успешно установлено" });
      } else {
        yield put({ type: 'INTEGRATION-MODULE:TEST_CONNECT_SUCCESS', payload: "Соединение не установлено" });
      }
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'INTEGRATION-MODULE:EDIT_RESOURCE_FAILED', payload: message });
      yield put(stopSubmit(formName, { _error: message }));
    }
  }

  function* executeGetCatalogs({ meta: { resource } = { resource: '' } }: actionTypes.IGetCatalogs) {
    try {
      const response = yield call(api.getCatalogs);

      if (response.status === 200 && response.data) {
        const processed = response.data
          .filter((c: any) => c.settings.enabled)
          .filter((c: any) => c.connectionResult.success);
        yield put(injectResource(resource, setCatalogsList)(processed));
      }
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'INTEGRATION-MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeGetCatalogGroups({ meta: { resource } = { resource: '' }, payload }: actionTypes.IGetCatalogGroups) {
    try {
      const catalogGroups = yield call(api.getCatalogGroups, payload);

      if (catalogGroups.status === 200 && catalogGroups.data) {
        yield put(injectResource(resource, setCatalogGroupsList)(payload, catalogGroups.data));
      }
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'INTEGRATION-MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeUpdateCatalogGroups({ payload: { id, data } }: actionTypes.IGetCatalogGroups) {
    try {
      const response = yield call(api.updateCatalogGroups, id, data);

      if (response.status === 200) {
        console.log('K', response);
      }
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'INTEGRATION-MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeResourceDeleting({ meta, payload }: actionTypes.IDeleteResourceAction & IInjectedResource) {
    const resource = meta ? meta.resource : '';
    const state: IReduxState = yield select();
    const deleteUser = getUserById(state, payload, resource);
    const deleteUserLogin = deleteUser ? deleteUser : '';
    try {
      yield put({ type: 'INTEGRATION-MODULE:DELETE_USER_LOGIN', payload: deleteUserLogin });
      yield put(switchRemoveModalStatus(true));
      yield take('INTEGRATION-MODULE:ACCEPT_DELETE');
      const response: number = yield call(api.deleteResource, resource, payload);
      yield put({ type: 'INTEGRATION-MODULE:DELETE_RESOURCE_SUCCESS', payload: response, meta });
      yield put(switchRemoveModalStatus(false));
      yield put(injectResource(resource, showResourceFeature.actions.loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'INTEGRATION-MODULE:DELETE_RESOURCE_FAILED', payload: message, meta });
      yield put(switchRemoveModalStatus(false));
    }
  }

  function* saga(): SagaIterator {
    const createResourceType:           actionTypes.ICreateResourceAction['type']         = 'INTEGRATION-MODULE:CREATE_RESOURCE';
    const editResourceType:             actionTypes.IEditResourceAction['type']           = 'INTEGRATION-MODULE:EDIT_RESOURCE';
    const testPostConnection:           actionTypes.ITestPostConnection['type']           = 'INTEGRATION-MODULE:TEST_POST_CONNECTION';
    const getCurrentStatusIntegration:  actionTypes.IGetCurrentStatusIntegration['type']  = 'INTEGRATION-MODULE:GET_CURRENT_STATUS_INTEGRATION';
    const enableIntegration:            actionTypes.IEnableIntegration['type']            = 'INTEGRATION-MODULE:ENABLE_INTEGRATION';
    const disableIntegration:           actionTypes.IDisableIntegration['type']           = 'INTEGRATION-MODULE:DISABLE_INTEGRATION';
    const saveEditResourceType:         actionTypes.ISaveEditResourceAction['type']       = 'INTEGRATION-MODULE:SAVE_EDIT_RESOURCE';
    const deleteResourceType:           actionTypes.IDeleteResourceAction['type']         = 'INTEGRATION-MODULE:DELETE_RESOURCE';
    const editCatalogData:              actionTypes.ISetEditCatalogData['type']           = 'INTEGRATION-MODULE:SET_EDIT_CATALOG_DATA';
    const syncCatalogData:              actionTypes.ISyncCatalogData['type']              = 'INTEGRATION-MODULE:SYNC_CATALOG_DATA';
    const enableCatalog:                actionTypes.IEnableCatalog['type']                = 'INTEGRATION-MODULE:ENABLE_CATALOG';
    const disableCatalog:               actionTypes.IDisableCatalog['type']               = 'INTEGRATION-MODULE:DISABLE_CATALOG';
    const testCatalogConnection:        actionTypes.ITestCatalogConnection['type']        = 'INTEGRATION-MODULE:TEST_CATALOG_CONNECTION';
    const getCatalogs:                  actionTypes.IGetCatalogs['type']                  = 'INTEGRATION-MODULE:GET_CATALOGS';
    const getCatalogGroups:             actionTypes.IGetCatalogGroups['type']             = 'INTEGRATION-MODULE:GET_CATALOG_GROUPS';
    const updateCatalogGroups:          actionTypes.IUpdateCatalogGroups['type']          = 'INTEGRATION-MODULE:UPDATE_CATALOG_GROUPS';

    yield all([
      takeLatest(createResourceType, executeResourceCreates),
      takeLatest(editResourceType, executeResourceEdits),
      takeLatest(testPostConnection, executeTestPostConnection),
      takeLatest(getCurrentStatusIntegration, executeGetCurrentStatusIntegrations),
      takeLatest(enableIntegration, executeEnableIntegration),
      takeLatest(disableIntegration, executeDisableIntegration),
      takeLatest(saveEditResourceType, executeEditedResourceSaving),
      takeEvery(deleteResourceType, executeResourceDeleting),
      takeLatest(editCatalogData, executeStartEditCatalogData),
      takeLatest(syncCatalogData, executeSyncCatalogData),
      takeLatest(enableCatalog, executeEnableCatalog),
      takeLatest(disableCatalog, executeDisableCatalog),
      takeLatest(testCatalogConnection, executeTestCatalogConnection),
      takeLatest(getCatalogs, executeGetCatalogs),
      takeLatest(getCatalogGroups, executeGetCatalogGroups),
      takeLatest(updateCatalogGroups, executeUpdateCatalogGroups)
    ]);
  }

  return saga;
}

export default getSaga;

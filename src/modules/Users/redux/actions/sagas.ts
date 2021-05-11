import {all, call, delay, put, select, take, takeEvery, takeLatest} from 'redux-saga/effects';
import {SagaIterator} from 'redux-saga';
import {getFormValues, initialize, startSubmit, stopSubmit} from 'redux-form';
import {
  checkFieldsCatalogForm,
  formatByResource,
  getErrorMsg,
  getResourceById,
  IInjectedResource,
} from 'shared/helpers';
import {IExtraArguments, IReduxState, IResource} from 'shared/types/app';
import {IUser} from 'shared/types/users';
import * as showResourceFeature from 'features/showResource';
import {
  checkedUserMultiEdit,
  eraseSelectedUsers,
  setCatalogGroupsList,
  setCatalogsList,
  switchModalStatus,
  switchRemoveModalStatus,
  syncCatalogData,
  testCatalogConnection,
  testConnentClear,
  loadFileErrorClear
} from './communication';
import {updateIndividualResourceItem} from 'features/showResource/redux/actions/communication';
import * as actionTypes from '../../namespace';
import injectResource from 'shared/helpers/injectResource';
import * as CryptoJS from 'crypto-js';
import {clearFilterOptions} from 'features/filterResource/redux/actions/communication';
import {getUserById, selectIsAllSelected} from 'modules/Users/redux/actions/selectors';
import actions from './index';

function formatCurrencyToNumber(currency: string) { // TODO to utils
  return Math.round(Number(String(currency).replace('₽', '').split(',').join('')) * 100);
}

function getSaga({ api }: IExtraArguments) {
  function* executeResourceCreates(action: actionTypes.ICreateResourceAction & IInjectedResource) {
    const resource = action.meta ? action.meta.resource : '';
    const formName = `add${resource.slice(0, 1).toUpperCase()}${resource.slice(1)}`;
    try {
      yield put(startSubmit(formName));
      const newEntry: any = yield select(getFormValues(formName));

      const newEditedResource: any = {
        ...newEntry,
      };

      if (formName === 'addUsers') {
        newEditedResource.balance = formatCurrencyToNumber(newEditedResource.balance);
      }

      if(resource == 'usergroups') {
        if(!newEditedResource.accrualType) {
          newEditedResource.accrualType = 'UPDATE'
        }
      }

      const response: any = yield call(api.createResource, resource, formatByResource(resource, newEditedResource));

      yield put({ type: 'USERS-MODULE:CREATE_RESOURCE_SUCCESS', payload: response, meta: action.meta });

      yield put(stopSubmit(formName));
      yield put(switchModalStatus({ status: false, mode: 'create' }));
      yield put(injectResource(resource, clearFilterOptions)());
      yield put(injectResource(resource, showResourceFeature.actions.loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'USERS-MODULE:CREATE_RESOURCE_FAILED', payload: message, meta: action.meta });

      let errorMessage;
      switch (message) {
        case ('Request failed with status code 400'):
          errorMessage = 'Ограничение лицензии';
          break;
        case ('Request failed with status code 500'):
          errorMessage = 'Лицензия истекла';
          break;
        default: {
          errorMessage = message;
        }
      }
      // yield put(stopSubmit(formName, { _error: 'Невозможно создать нового пользователя' }));
      yield put(stopSubmit(formName, { _error: message }));
      yield yield put({
        type: 'SHOW_RESOURCE:SHOW_ALERT',
        payload: {
          type: 'error',
          message: errorMessage,
        },
      });
    }
  }

  function* executeResourceEdits(action: actionTypes.IEditResourceAction & IInjectedResource) {
    const resource = action.meta ? action.meta.resource : '';
    const formName = `add${resource.slice(0, 1).toUpperCase()}${resource.slice(1)}`;

    try {
      const editedResource: IResource = yield select((state: IReduxState) => (
        getResourceById(resource, state, action.payload.id)),
      );
      const newEditedResource = { ...editedResource };
      if (resource === 'users') {
        newEditedResource.balance /= 100;
      }
      yield put(switchModalStatus({ status: true, mode: action.payload.mode }));
      yield put(initialize(formName, newEditedResource, true));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'USERS-MODULE:EDIT_RESOURCE_FAILED', payload: message });
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

      if (resource !== 'catalogs') {
        newEditedResource.balance = formatCurrencyToNumber(newEditedResource.balance);
      }

      if(resource == 'usergroups') {
        if(!newEditedResource.accrualType) {
          newEditedResource.accrualType = 'UPDATE'
        }
      }

      const response: IResource = yield call(api.editResource, resource, formatByResource(resource, newEditedResource));

      yield put({ type: 'USERS-MODULE:SAVE_EDIT_RESOURCE_SUCCESS', payload: response, meta: action.meta });
      yield put(injectResource(resource, showResourceFeature.actions.loadResource)(false, false));
      yield put(stopSubmit(formName));
      yield put(switchModalStatus({ status: false, mode: 'edit' }));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'USERS-MODULE:SAVE_EDIT_RESOURCE_FAILED', payload: message, meta: action.meta });
      yield put(stopSubmit(formName, { _error: message }));
      // yield put(stopSubmit(formName, { _error: 'Пользователь с таким логином или email уже существует' }));

    }
  }

  function* executeResourceDeleting({ meta, payload }: actionTypes.IDeleteResourceAction & IInjectedResource) {
    const resource = meta ? meta.resource : '';
    const state: IReduxState = yield select();
    const deleteUser = getUserById(state, payload, resource);
    const deleteUserLogin = deleteUser ? deleteUser : '';
    try {
      yield put({ type: 'USERS-MODULE:DELETE_USER_LOGIN', payload: deleteUserLogin });
      yield put(switchRemoveModalStatus(true));
      yield take('USERS-MODULE:ACCEPT_DELETE');

      const response: number = yield call(api.deleteResource, resource, payload);
      yield put({ type: 'USERS-MODULE:DELETE_RESOURCE_SUCCESS', payload: response, meta });
      yield put(switchRemoveModalStatus(false));
      yield put(injectResource(resource, showResourceFeature.actions.loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'USERS-MODULE:DELETE_RESOURCE_FAILED', payload: message, meta });
      yield put(switchRemoveModalStatus(false));
    }
  }

  function* executeCheckedUsersDeleting(action: actionTypes.IDeleteCheckedUsersAction  & IInjectedResource) {
    const { resource } = action.meta ? action.meta : { resource: '' };
    const meta = action.meta;
    try {
/*
      const deleteUsers = action.payload.map((user: IUser) => (
        put(injectResource(resource, deleteResource)(user.id))
      ));

      yield deleteUsers;
*/
      let deleteUserLogin ='';
      let deleteUsers:any = []
      action.payload.map((user: IUser) => {
        deleteUserLogin += user.login + ' ';
        deleteUsers.push(user.id)
      });

      deleteUsers = JSON.stringify(deleteUsers)
      let data = JSON.parse(deleteUsers)
      yield put({ type: 'USERS-MODULE:DELETE_USER_LOGIN', payload: deleteUserLogin });
      yield put(switchRemoveModalStatus(true));
      yield take('USERS-MODULE:ACCEPT_DELETE');

      const response: number = yield call(api.deleteCheckedUsers, resource, data);
      yield put({ type: 'USERS-MODULE:DELETE_RESOURCE_SUCCESS', payload: response, meta });
      yield put(switchRemoveModalStatus(false));
      yield put(injectResource(resource, showResourceFeature.actions.loadResource)(false, false));

    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'USERS-MODULE:DELETE_CHACKED_USERS_FAILED', payload: message });
    }
  }

  function* executeChangeItemsSelect() {
    try {
      const state: IReduxState = yield select();
      const showResourceState = state.showResource.users;
      const allUsers = showResourceState
        ? Object.values(showResourceState.data).reduce((prev: IUser[], cur: IUser[]) => prev.concat(cur), [])
        : [];
      const isAllUserSelected = selectIsAllSelected(state, allUsers);
      yield put(eraseSelectedUsers());
      if (!isAllUserSelected) {
        for (const user of allUsers) {
          yield put(checkedUserMultiEdit(user));
        }
      }
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'USERS-MODULE:DELETE_CHACKED_USERS_FAILED', payload: message });
    }
  }

  function* sendDataAfterChangeFormField(action: actionTypes.IChangeCatalogFormField) {
    const { resource } = action.meta ? action.meta : { resource: '' };
    const fieldName = action.payload;
    const formName = `add${resource.slice(0, 1).toUpperCase()}${resource.slice(1)}`;
    const editedFields = ['url', 'password', 'user'];
    const { url, password, user } = yield select(getFormValues(formName));
    return; // TODO ниче не делаем
    try {
      if (editedFields.includes(fieldName) && checkFieldsCatalogForm({ url, password, user })) {
        const timestamp = new Date().getTime().toString();
        const encryptedPassword = CryptoJS.AES.encrypt(password, `some-salt-${timestamp}`).toString();
        const data = { url, pass: encryptedPassword, user, timestamp };
        yield delay(1000);
        yield put({ type: 'USERS-MODULE:SEND_TEMP_CATALOG_DATA' });
        yield call(api.checkChangedCatalogData, data);
        yield put({ type: 'USERS-MODULE:SEND_TEMP_CATALOG_DATA_SUCCESS' });
      }
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'USERS-MODULE:SEND_TEMP_CATALOG_DATA_FAILED', payload: message });
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
      yield put({ type: 'USERS-MODULE:EDIT_RESOURCE_FAILED', payload: message });
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
      yield put({ type: 'USERS-MODULE:EDIT_RESOURCE_FAILED', payload: message });
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
      yield put({ type: 'USERS-MODULE:EDIT_RESOURCE_FAILED', payload: message });
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
      yield put({ type: 'USERS-MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeTestCatalogConnection({ meta: { resource } = { resource: '' }, payload }: actionTypes.ITestCatalogConnection) {
    const formName = `add${resource.slice(0, 1).toUpperCase()}${resource.slice(1)}`;
    try {
      let testedCatalog: any;

      if (!payload) {
        // const formName = `add${resource.slice(0, 1).toUpperCase()}${resource.slice(1)}`;

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
//        response.data.connectionResult.success === true ? alert(true) : alert(false)
      }

      if (response.data.connectionResult.success === true){
        yield put({ type: 'USERS-MODULE:TEST_CONNECT_SUCCESS', payload: "Соединение успешно установлено" });
      } else {
        yield put({ type: 'USERS-MODULE:TEST_CONNECT_SUCCESS', payload: "Соединение не установлено" });
      }
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'USERS-MODULE:EDIT_RESOURCE_FAILED', payload: message });
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
      yield put({ type: 'USERS-MODULE:EDIT_RESOURCE_FAILED', payload: message });
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
      yield put({ type: 'USERS-MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeUpdateCatalogGroups({ payload: { id, data } }: actionTypes.IGetCatalogGroups) {
    try {
      const response = yield call(api.updateCatalogGroups, id, data);

      if (response.status === 200 /*&& response.data*/) {
        //const processed = response.data
        //  .filter((c: any) => c.settings.enabled)
        //  .filter((c: any) => c.connectionResult.success);
        console.log('K', response);
      }
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'USERS-MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeUpdateUsers({ meta: { resource } = { resource: '' }, payload }: actionTypes.IUpdateUsers) {
    const state: IReduxState = yield select();
    try {
      const response = yield call(api.updateUsers, payload);
      if(response.status === 200) {
        yield put(loadFileErrorClear());
        yield put({ type: 'USERS-MODULE:LOAD_FILE_DATA_SUCCESS', payload: response.data });
        yield put({ type: 'USERS-MODULE:LOAD_FILE_DATA_STATUS', payload: true });
        yield put(injectResource('users', showResourceFeature.actions.loadResource)(false, false));
      } else if(response.status === 404) {
        yield put({ type: 'USERS-MODULE:LOAD_FILE_ERROR', payload: 'Файл не найден' });
        yield put({ type: 'USERS-MODULE:LOAD_FILE_DATA_STATUS', payload: false });
      } else if(response.status === 422) {
        yield put({ type: 'USERS-MODULE:LOAD_FILE_ERROR', payload: 'Файл не имеет неверный формат' });
        yield put({ type: 'USERS-MODULE:LOAD_FILE_DATA_STATUS', payload: false });
      }
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'USERS-MODULE:LOAD_FILE_ERROR', payload: message });
    }
  }

  function* saga(): SagaIterator {
    const createResourceType:     actionTypes.ICreateResourceAction['type']       = 'USERS-MODULE:CREATE_RESOURCE';
    const editResourceType:       actionTypes.IEditResourceAction['type']         = 'USERS-MODULE:EDIT_RESOURCE';
    const saveEditResourceType:   actionTypes.ISaveEditResourceAction['type']     = 'USERS-MODULE:SAVE_EDIT_RESOURCE';
    const deleteResourceType:     actionTypes.IDeleteResourceAction['type']       = 'USERS-MODULE:DELETE_RESOURCE';
    const deleteCheckedUsers:     actionTypes.IDeleteCheckedUsersAction['type']   = 'USERS-MODULE:CHECKED_USERS_DELETE';
    const changeCatalogFormField: actionTypes.IChangeCatalogFormField['type']     = 'USERS-MODULE:CHANGE_CATALOG_FORM_FIELD';
    const changeAllItemsSelect:   actionTypes.IChangeAllItemsSelect['type']       = 'USERS-MODULE:CHANGE_ALL_ITEMS_SELECT';
    const editCatalogData:        actionTypes.ISetEditCatalogData['type']         = 'USERS-MODULE:SET_EDIT_CATALOG_DATA';
    const syncCatalogData:        actionTypes.ISyncCatalogData['type']            = 'USERS-MODULE:SYNC_CATALOG_DATA';
    const enableCatalog:          actionTypes.IEnableCatalog['type']              = 'USERS-MODULE:ENABLE_CATALOG';
    const disableCatalog:         actionTypes.IDisableCatalog['type']             = 'USERS-MODULE:DISABLE_CATALOG';
    const updateUsers:            actionTypes.IUpdateUsers['type']                = 'USERS-MODULE:UPDATE_USERS';
    const testCatalogConnection:  actionTypes.ITestCatalogConnection['type']      = 'USERS-MODULE:TEST_CATALOG_CONNECTION';
    const getCatalogs:            actionTypes.IGetCatalogs['type']                = 'USERS-MODULE:GET_CATALOGS';
    const getCatalogGroups:       actionTypes.IGetCatalogGroups['type']           = 'USERS-MODULE:GET_CATALOG_GROUPS';
    const updateCatalogGroups:    actionTypes.IUpdateCatalogGroups['type']        = 'USERS-MODULE:UPDATE_CATALOG_GROUPS';

    yield all([
      takeLatest(createResourceType, executeResourceCreates),
      takeLatest(editResourceType, executeResourceEdits),
      takeLatest(saveEditResourceType, executeEditedResourceSaving),
      takeLatest(changeCatalogFormField, sendDataAfterChangeFormField),
      takeLatest(deleteCheckedUsers, executeCheckedUsersDeleting),
      takeEvery(deleteResourceType, executeResourceDeleting),
      takeLatest(changeAllItemsSelect, executeChangeItemsSelect),
      takeLatest(editCatalogData, executeStartEditCatalogData),
      takeLatest(enableCatalog, executeEnableCatalog),
      takeLatest(disableCatalog, executeDisableCatalog),
      takeLatest(updateUsers, executeUpdateUsers),
      takeLatest(testCatalogConnection, executeTestCatalogConnection),
      takeLatest(getCatalogs, executeGetCatalogs),
      takeLatest(getCatalogGroups, executeGetCatalogGroups),
      takeLatest(updateCatalogGroups, executeUpdateCatalogGroups),
      takeLatest(syncCatalogData, executeSyncCatalogData)
    ]);
  }

  return saga;
}

export default getSaga;

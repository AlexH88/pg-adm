import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {SagaIterator} from 'redux-saga';
import {getFormValues, initialize, startSubmit, stopSubmit} from 'redux-form';
import {getErrorMsg, getResourceById} from 'shared/helpers';
import {IExtraArguments, IReduxState, IResource} from 'shared/types/app';
import injectResource from 'shared/helpers/injectResource';
import * as showResourceFeature from 'features/showResource';
import * as NS from '../../namespace';
import * as actions from './communication';
import {INormalizeResourceStatus} from 'shared/types/printers';
import {agentsApi} from './../../api';

function getSaga({ api }: IExtraArguments) {

  function* executeTryResourceDeleting({ meta, payload }: NS.ITryDeleteResource) {
    if (!meta) {
      throw Error('No meta!');
    }
    try {
      const response: { printer: string } = yield call(api.tryDeleteResource, meta.resource, payload);
      yield put(actions.tryDeleteResourceSuccess({ response, id: payload }));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.tryDeleteResourceFailed({ error: message }));
    }
  }

  function* executeResourceDeleting({ meta, payload }: NS.IAcceptDeleteResource) {
    if (!meta) {
      throw Error('No meta');
    }
    try {
      const response: number = yield call(api.deleteResource, meta.resource, payload);
      yield put(actions.acceptDeleteResourceSuccess({ response }));
      yield put(actions.switchRemoveModal());
      yield put(injectResource(meta.resource, showResourceFeature.actions.loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.acceptDeleteResourceFailed({ error: message }));
    }
  }

  function* executeCreatePrinterGroup(action: NS.ICreatePrinterGroup) {
    const { meta } = action;
    const resource = meta ? meta.resource : '';
    const formName = `add${resource.slice(0, 1).toUpperCase()}${resource.slice(1)}`;

    try {
      yield put(startSubmit(formName));
      const newPrinter: { name: string } = yield select(getFormValues(formName));
      const response = yield call(api.createResource, resource, newPrinter);
      yield put({ type: 'AGENTS_MODULE:CREATE_RESOURCE_SUCCESS', payload: response });
      yield put(stopSubmit(formName));
      yield put(actions.switchModalStatus(false));
      yield put(injectResource(resource, showResourceFeature.actions.loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'AGENTS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
      // yield put(stopSubmit('addHostgroups', { _error: message }));
      yield put(stopSubmit(formName, { _error: message }));
    }
  }

  function* executeResourceEdits({ meta, payload }: NS.IEditResourceAction) {
    if (!meta) {
      throw Error('No meta');
    }

    const formName = `edit_${meta.resource === 'printerslocal' || meta.resource === 'printersnetwork' ? 'printers' : meta.resource}`;

    try {

      const editedResource: IResource = yield select((state: IReduxState) =>
        getResourceById(meta.resource, state, payload));
      // yield put(actions.switchModalStatus(true));

      if(meta.resource === 'printers' || meta.resource === 'printerslocal' || meta.resource === 'printersnetwork') {
        const data: any = yield call(api.getSnmpFlag, editedResource.id);
        editedResource.snmp_active = data.snmp_active;
      }

      yield put(initialize(formName, editedResource, true));
      yield put({type: 'AGENTS_MODULE:SWITCH_MODAL_STATUS', payload: true});
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'AGENTS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeEditedResourceSaving({ meta }: NS.ISaveEditResourceAction) {
    if (!meta) {
      throw Error('No meta');
    }
    const newResource = meta.resource === 'printerslocal' || meta.resource === 'printersnetwork' ? 'printers' : meta.resource;
    
    yield put({type: 'SHOW_RESOURCE:TOGGLE_SPINNER', payload: true});
    const formName = `edit_${newResource}`;
    try {
      yield put(startSubmit(formName));
      const editedResource: IResource = yield select(getFormValues(formName));

      // TODO costyl
      if(formName === 'edit_printers') {
        delete editedResource.status;
      }

      const snmp: boolean = editedResource.snmp_active;
      delete editedResource.snmp_active;
      delete editedResource.type;

      const response1: INormalizeResourceStatus = yield call(api.editResource, newResource, editedResource);
      yield call(api.editSnmpFlag, editedResource.id, snmp);
      if (response1.statusCode === 1) {
        yield put(actions.switchModalStatus(false));
      } else {
        yield put(stopSubmit(formName, { _error: response1.statusCode }));
      }
      yield put(injectResource(meta.resource, showResourceFeature.actions.loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'AGENTS_MODULE:SAVE_EDIT_RESOURCE_FAILED', payload: message, meta });
      yield put(stopSubmit(formName, { _error: message }));
    }
    yield put({type: 'AGENTS_MODULE:SWITCH_MODAL_STATUS', payload: false });
    yield put({type: 'SHOW_RESOURCE:TOGGLE_SPINNER', payload: false });
  }

  function* executeStartEditPrintServerData({ meta, payload }: NS.ISetEditPrintServerData) {
    try {
      yield put({type: 'SYNC_RESOURCE:SYNC_MODAL_ERROR', payload: false}); // Убрать текст ошибки
      yield put({type: 'SYNC_RESOURCE:CLEAR_ALL_PROGRESSBAR' });
      const data = yield call(api.getPrintersList, payload); // Получить данные с rest api
      yield put(actions.switchSyncModal()); // Открыть модальное окно
      yield put({type: 'SYNC_RESOURCE:LOAD_SYNC_DATA_SUCCESS', payload: data.data, meta});
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'AGENTS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeDeleteAgent() {
    try {
      const state = yield select();
      const deleteAgentId = state.agents.deleteAgentId;
      const data = yield call(api.removeAgent, deleteAgentId); // Получить данные с rest api

      yield put(injectResource('hosts-local', showResourceFeature.actions.loadResource)(false, false));
      yield put(injectResource('hosts-network', showResourceFeature.actions.loadResource)(false, false));
      yield put(actions.switchRemoveModal());
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'AGENTS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeSyncPrintServerData({ meta }: NS.ISetEditPrintServerData) {
    const state: IReduxState = yield select();
    try {
      const response = yield call(api.syncPrinterData, state.agents.chosenHostId, state.syncResource.data);
      if(response.data.err_code === 'ok') {
        yield put(actions.switchSyncModal());
      } else {
        yield put({type: 'SYNC_RESOURCE:SYNC_MODAL_ERROR', payload: true});
        const data = yield call(api.getPrintersList, state.agents.chosenHostId);
        yield put({type: 'SYNC_RESOURCE:LOAD_SYNC_DATA_SUCCESS', payload: data.data, meta});
      }

      // if(!1) yield put({type: 'SYNC_RESOURCE:LOAD_SYNC_DATA_SUCCESS', payload: response.data, meta});
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'AGENTS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
      yield put({type: 'SYNC_RESOURCE:SYNC_MODAL_ERROR', payload: true});

      const data = yield call(api.getPrintersList, state.agents.chosenHostId);
      yield put({type: 'SYNC_RESOURCE:LOAD_SYNC_DATA_SUCCESS', payload: data.data, meta});
    }
  }

  function* startEditHostGroup({ payload }: any) {
    try {
      yield put(initialize('editHostgroups', payload, true));
      yield put(actions.switchHostGroupEditModal());
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'AGENTS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeEditHostGroup() {
    const formName = 'editHostgroups';
    try {
      const newData = yield select(getFormValues(formName));
      const { name, version, id } = newData;
      yield call(agentsApi.updateHostGroup, id, { name, version });
      yield put(injectResource('hostgroups', showResourceFeature.actions.loadResource)(false, false));
      yield put(actions.switchHostGroupEditModal());
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(stopSubmit(formName, { _error: message }));
      yield put({ type: 'AGENTS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeForceRestart() {
    try {
      const newData = yield select(getFormValues('editHostgroups'));
      const { id } = newData;
      yield call(agentsApi.forseRestart, id);
      yield put(injectResource('hostgroups', showResourceFeature.actions.loadResource)(false, false));
      yield put(actions.switchHostGroupEditModal());
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'AGENTS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeForceActivate({ payload }: any) {
    console.log(payload);
    try {
      const newData = yield select(getFormValues('editHostgroups'));
      const { id } = newData;
      yield call(agentsApi.forceActivate, id, payload);
      yield put(injectResource('hostgroups', showResourceFeature.actions.loadResource)(false, false));
      yield put(actions.switchHostGroupEditModal());
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'AGENTS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* startToLog({ payload }: any) {
    yield put(actions.setLogPrinterId(payload));
    yield put(actions.switchLogModal());
  }

  function* executeLog() {
    try {
      const state = yield select();
      const id = state.agents.logPrinterId.id;
      yield put(actions.switchLogModal());
      yield call(agentsApi.forceLog, id);
      yield put({type: 'SHOW_RESOURCE:SHOW_ALERT', payload: { type: 'info', message: 'Лог запрошен' }});
    } catch (error) {
      yield put({type: 'SHOW_RESOURCE:SHOW_ALERT', payload: { type: 'error', message: 'Ошибка при запросе лога' }});
    }
  }



  function* saga(): SagaIterator {
    const tryDeleteResourceType: NS.ITryDeleteResource      ['type'] = 'AGENTS_MODULE:TRY_DELETE_RESOURCE';
    const deleteResourceType:    NS.IAcceptDeleteResource   ['type'] = 'AGENTS_MODULE:ACCEPT_DELETE_RESOURCE';
    const editResourceType:      NS.IEditResourceAction     ['type'] = 'AGENTS_MODULE:EDIT_RESOURCE';
    const saveEditResourceType:  NS.ISaveEditResourceAction ['type'] = 'AGENTS_MODULE:SAVE_EDIT_RESOURCE';
    const createPrinterGroup:    NS.ICreatePrinterGroup     ['type'] = 'AGENTS_MODULE:CREATE_PRINTER_GROUP';
    const editPrintServerData:   NS.ISetEditPrintServerData ['type'] = 'AGENTS_MODULE:SET_EDIT_PRINT_SERVER_DATA';
    const syncPrintServerData:   NS.ISyncPrintServersData   ['type'] = 'AGENTS_MODULE:SYNC_PRINT_SERVER_DATA';
    const deleteAgent:           NS.IDeleteAgent            ['type'] = 'AGENTS_MODULE:DELETE_AGENT';
    const forceRestart:           any = 'AGENTS_MODULE:FORCE_RESTART';
    const forceActivate:           any = 'AGENTS_MODULE:FORCE_ACTIVATE';
    const editHostGroup:           any = 'AGENTS_MODULE:START_EDIT_HOST_GROUP';
    const runEditHostGroup:           any = 'AGENTS_MODULE:EDIT_HOST_GROUP';
    const startLog:                 any = 'AGENTS_MODULE:START_LOG';
    const runLog:                 any = 'AGENTS_MODULE:EXECUTE_LOG';

    yield all([
      takeLatest(tryDeleteResourceType, executeTryResourceDeleting),
      takeLatest(deleteResourceType, executeResourceDeleting),
      takeLatest(editResourceType, executeResourceEdits),
      takeLatest(saveEditResourceType, executeEditedResourceSaving),
      takeLatest(createPrinterGroup, executeCreatePrinterGroup),
      takeLatest(editPrintServerData, executeStartEditPrintServerData),
      takeLatest(syncPrintServerData, executeSyncPrintServerData),
      takeLatest(deleteAgent, executeDeleteAgent),
      takeLatest(forceRestart, executeForceRestart),
      takeLatest(forceActivate, executeForceActivate),
      takeLatest(editHostGroup, startEditHostGroup),
      takeLatest(runEditHostGroup, executeEditHostGroup),
      takeLatest(startLog, startToLog),
      takeLatest(runLog, executeLog)
    ]);
  }

  return saga;
}

export default getSaga;

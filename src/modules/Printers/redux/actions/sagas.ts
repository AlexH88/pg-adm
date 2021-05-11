import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {SagaIterator} from 'redux-saga';
import {getFormValues, initialize, startSubmit, stopSubmit} from 'redux-form';
import {formatByResource, getErrorMsg, getResourceById, IInjectedResource} from 'shared/helpers';
import {IExtraArguments, IReduxState, IResource} from 'shared/types/app';
import injectResource from 'shared/helpers/injectResource';
import * as showResourceFeature from 'features/showResource';
import * as NS from '../../namespace';
import * as actions from './communication';
import { SnmpLoadResource } from '../../../../features/SnmpShowResource/redux/actions/communication';
import { loadResource } from '../../../../features/showResource/redux/actions/communication';
import { loadSnmpResourceSuccess, SnmpChangeLoader, loadCurrentOperator } from '../../../../features/SnmpShowResource/redux/actions/communication';
import { INormalizeResourceStatus } from 'shared/types/printers';
import { printersApi } from './../../api';

function formatCurrencyToNumber(currency: string) { // TODO to utils
  return Math.round(Number(String(currency).replace('₽', '').split(',').join('')) * 100);
}

function formatPrinterLocalResource(resource: any) { // To utils
  const resourceData = { ...resource };
  if (
    resourceData.a3Price !== resourceData.a4Price
    || resourceData.a3Price !== resourceData.a5Price
    || resourceData.a4Price !== resourceData.a5Price
  ) {
    resourceData.formatPrice = true;
  }
  if (resourceData.colorCoeff !== 1) {
    resourceData.colorPrice = true;
  }
  if (resourceData.duplexCoeff !== 1) {
    resourceData.duplexPrice = true;
  }
  resourceData.price = resourceData.price / 100;
  resourceData.a3Price = resourceData.a3Price / 100;
  resourceData.a4Price = resourceData.a4Price / 100;
  resourceData.a5Price = resourceData.a5Price / 100;

  resourceData.uid = resourceData.rfid && resourceData.reader !== null ? resourceData.reader.uid : null;

  return resourceData;
}

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

  function* executeCreatePrinterGroup({ meta }: NS.ICreatePrinterGroup) {
    if (!meta) {
      throw Error('No meta');
    }
    const formName = `add_${meta.resource}`;
    try {
      // yield put(startSubmit(formName));
      const newPrinter: { name: string } = yield select(getFormValues(formName));
      const response = yield call(api.createResource, meta.resource, newPrinter);
      yield put({ type: 'PRINTERS_MODULE:CREATE_RESOURCE_SUCCESS', payload: response });
      // yield put(stopSubmit(formName));
      // yield put(actions.switchModalStatus(false));
      yield put(actions.switchModalStatusMode({ status: false, mode: 'create' }));
      yield put(injectResource(meta.resource, showResourceFeature.actions.loadResource)(false, false));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'PRINTERS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
      yield put(stopSubmit(`add_printergroups`, { _error: message }));
    }
  }

  function* executeCreatePlanFloor({ meta, payload: {id} }: NS.ICreatePlanFloor) {
    if (!meta) {
      throw Error('No meta');
    }
    try {
      const formName = 'addFloor';
      yield put(startSubmit(formName));
      const newFloor = yield select(getFormValues(formName));
      const { floorNumber } = newFloor
      const response = yield call(api.createResourceFloor, meta.resource, newFloor);
      const pages = yield call(api.loadResource, "floors", 0, {}, {}, false);
      const totalPages = pages[0];
      const addPrinters = yield call(api.loadAddPrinters);
      yield put(injectResource("floors", loadSnmpResourceSuccess)(totalPages, addPrinters));
      yield put({ type: 'PRINTERS_MODULE:CREATE_RESOURCE_SUCCESS', payload: response });
      yield put(stopSubmit(formName));
      yield put(actions.switchModalStatusMode({ status: false, mode: 'create' }));
      const resource = 'floors'
      yield call(loadCurrentOperator);
      // yield put(injectResource(resource, loadSnmpResourceSuccess)(response, addPrinters));
      let pictureId = id === null ? pages[0].floorNumbers[0] : id
      if(response && response.floorNumber) {
        pictureId = response.floorNumber
      }

      id === null ? id = pictureId : id = floorNumber
      const responsePicture = yield call(api.loadSnmpPicture, resource, pictureId);
      const img = responsePicture.floorPicture
      const printersArray = responsePicture.floorPrinters
      yield put({ type: 'SNMP_SHOW_RESOURCE:SET_PICTURE', payload: {img, resource, id, pictureId, printersArray, addPrinters} })
      localStorage.setItem("storageCurrentFloor", floorNumber);
      console.log('storageCurrentFloor',localStorage.getItem("storageCurrentFloor"))
      const pageses = yield call(api.loadResource, "floors", 0, {}, {}, false);
      const responses = pageses[0];
      yield put(injectResource(resource, loadSnmpResourceSuccess)(responses, addPrinters));
      yield put(injectResource(resource, SnmpChangeLoader)(false));
    } catch (error) {
      const message = getErrorMsg(error);
      if (message === 'Этаж с таким номером уже существует'){
        yield put(actions.switchRemoveModal());
      }
      // yield put({ type: 'PRINTERS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    } finally {
//      yield put(injectResource('floors', SnmpLoadResource)(false, false));
    }
  }


  function* executeEditPlanFloor(
    { meta, payload: {id} }: NS.IEditPlanFloor
    ) {
    if (!meta) {
      throw Error('No meta');
    }
    try {
      const formName = 'addFloor';
      const resource = 'floors'
      yield put(startSubmit(formName));
      const newFloor = yield select(getFormValues(formName));
      const { floorNumber } = newFloor
      const response = yield call(api.editFloorResource, meta.resource, newFloor);
      const pages = yield call(api.loadResource, "floors", 0, {}, {}, false);
      const totalPages = pages[0];
      const addPrinters = yield call(api.loadAddPrinters);
      yield put(injectResource("floors", loadSnmpResourceSuccess)(totalPages, addPrinters));
      yield put({ type: 'PRINTERS_MODULE:CREATE_RESOURCE_SUCCESS', payload: response });
      yield put(stopSubmit(formName));
      yield put(actions.switchModalStatusMode({ status: false, mode: 'create' }));
      yield put(actions.switchRemoveModal());
      // let pictureId = id == null ? pages[0].floorNumbers[0] : id
      // if(response && response.floorNumber) {
      //   pictureId = response.floorNumber
      // }
      let id = floorNumber
      const responsePicture = yield call(api.loadSnmpPicture, resource, id);
      const img = responsePicture.floorPicture
      const printersArray = responsePicture.floorPrinters
      yield put({ type: 'SNMP_SHOW_RESOURCE:SET_PICTURE', payload: {img, resource, id, printersArray, addPrinters} })
      localStorage.setItem("storageCurrentFloor", floorNumber);
      console.log('storageCurrentFloor',localStorage.getItem("storageCurrentFloor"))
      const pageses = yield call(api.loadResource, "floors", 0, {}, {}, false);
      const responses = pageses[0];
      yield put(injectResource(resource, loadSnmpResourceSuccess)(responses, addPrinters));
      yield put(injectResource(resource, SnmpChangeLoader)(false));
      // if(newFloor.floorNumber == id){
      //   console.log('СРАБОТАЛО')
      //   const resource = 'floors'
      //   console.log(response.floorPicture)
      //   const responsePicture = yield call(api.loadSnmpPicture, "floors", id);
      //   const img = responsePicture.floor.floorPicture
      //   const printersArray = responsePicture.floorPrinters
      //   // const img = Buffer.from(responsePicture, 'binary').toString('base64');
      //   const addPrinters = yield call(api.loadAddPrinters);
      //   yield put({ type: 'SNMP_SHOW_RESOURCE:SET_PICTURE', payload: {img, resource, id, printersArray, addPrinters} });
      // } else {
      //   console.log('НЕ СРАБОТАЛО')
      //   return null
      // }
    } catch (error) {
      const message = getErrorMsg(error);
      console.log('ошибка', message)
      // yield put({ type: 'PRINTERS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  // function* executeResourceEdits({ meta, payload }: NS.IEditResourceAction) {
  function* executeResourceEdits(action: NS.IEditResourceAction & IInjectedResource) {
    const resource = action.meta ? action.meta.resource : '';
    const newResource = resource === 'printers-local' || resource === 'printers-network' ? 'printers' : resource;
    const formName = resource === 'printergroups' ? 'add_printergroups' : `edit${newResource.slice(0, 1).toUpperCase()}${newResource.slice(1)}`;
    try {
      yield put(injectResource('readers', showResourceFeature.actions.loadShortResource)(resource !== 'printergroups' ? action.payload : action.payload.id));

      let editedResource: IResource = yield select((state: IReduxState) => (
        getResourceById(resource, state, action.payload))// удалили id из action.payload.id
      )
      if(resource === 'printergroups') {
        editedResource = yield select((state: IReduxState) => (
          getResourceById(resource, state, action.payload.id))
        )
      }

      // yield put(actions.switchModalStatus(true));

      const newEditedResource = { ...editedResource };
      if (resource === 'printergroups') {
        newEditedResource.balance /= 100;
      }
      yield put(actions.switchModalStatusMode({ status: true, mode: action.payload.mode }));
      //yield put(initialize(formName, newEditedResource, true));
      /*
      if (meta.resource === 'printers' || meta.resource === 'printerslocal' || meta.resource === 'printersnetwork') {
        const data: any = yield call(api.getSnmpFlag, editedResource.id);
        editedResource.snmp_active = data.snmp_active;
      }
      */

      editedResource.snmp_active = false; // Until snmp request is functional
      if (resource === 'printers-local' || resource === 'printers-network') {
         editedResource = formatPrinterLocalResource(editedResource);
      }
      yield put(initialize(formName, editedResource, true));
      // yield put({type: 'PRINTERS_MODULE:SWITCH_MODAL_STATUS', payload: true});
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'PRINTERS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeEditedResourceGroupSaving(action: NS.ISaveEditResourceGroupAction & IInjectedResource) {

    const resource = action.meta ? action.meta.resource : '';
    const formName = `add_printergroups`;
    try {
      yield put(startSubmit(formName));
      const editedResource: IResource = yield select(getFormValues(formName));
      delete editedResource.status; // Удаляем статус

      const newEditedResource = {
        ...editedResource,
      };

      // if (resource !== 'catalogs') {
      //   newEditedResource.balance = formatCurrencyToNumber(newEditedResource.balance);
      // }

      const response: IResource = yield call(api.editResource, resource, formatByResource(resource, newEditedResource));
      yield put({ type: 'USERS-MODULE:SAVE_EDIT_RESOURCE_SUCCESS', payload: response, meta: action.meta });
      yield put(injectResource(resource, showResourceFeature.actions.loadResource)(false, false));
      yield put(stopSubmit(formName));
      yield put(actions.switchModalStatusMode({ status: false, mode: 'edit' }));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'USERS-MODULE:SAVE_EDIT_RESOURCE_FAILED', payload: message, meta: action.meta });
      yield put(stopSubmit(formName, { _error: message }));
      // yield put(stopSubmit(formName, { _error: 'Пользователь с таким логином или email уже существует' }));

    }
  }

  function* executeEditedResourceSaving({ meta }: NS.ISaveEditResourceAction) {

    if (!meta) {
      throw Error('No meta');
    }
    const newResource = meta.resource === 'printers-local' || meta.resource === 'printers-network' ? 'printers' : meta.resource;

//    yield put({type: 'SHOW_RESOURCE:TOGGLE_SPINNER', payload: true});
    const formName = `edit${newResource.slice(0, 1).toUpperCase()}${newResource.slice(1)}`;

    try {
      yield put(startSubmit(formName));
      const editedResource: IResource = yield select(getFormValues(formName));

      if (formName === 'editPrinters') { // TODO costyl
        delete editedResource.status;
        const state = yield select();
        const readers = state.showResource.short.readers;

        const n = readers.items.find((r: any) => r.uid === editedResource.uid);

        editedResource.reader = n;
        delete editedResource.uid;

        editedResource.price = formatCurrencyToNumber(editedResource.price);
        editedResource.a3Price = formatCurrencyToNumber(editedResource.a3Price);
        editedResource.a4Price = formatCurrencyToNumber(editedResource.a4Price);
        editedResource.a5Price = formatCurrencyToNumber(editedResource.a5Price);

        if (!editedResource.formatPrice) {
          editedResource.a3Price = Number(editedResource.price);
          editedResource.a4Price = Number(editedResource.price);
          editedResource.a5Price = Number(editedResource.price);
        }

        if(editedResource.a3Price == 0) {editedResource.a3Price = Number(editedResource.price)}
        if(editedResource.a4Price == 0) {editedResource.a4Price = Number(editedResource.price)}
        if(editedResource.a5Price == 0) {editedResource.a5Price = Number(editedResource.price)}

        editedResource.colorCoeff = editedResource.colorCoeff || 1;
        editedResource.duplexCoeff = editedResource.duplexCoeff || 1;

        if(!editedResource.colorPrice){editedResource.colorCoeff = 1}
        if(!editedResource.duplexPrice){editedResource.duplexCoeff = 1}

        if(editedResource.rfid && editedResource.reader == undefined) {
          editedResource.rfid = false
          editedResource.reader = null
        }

        if(editedResource.printerIp == "...") {
          editedResource.printerIp = ""
        }

        if(!editedResource.rfid) {
          editedResource.reader = null
        }

        delete editedResource.colorPrice;
        delete editedResource.formatPrice;
        delete editedResource.duplexPrice;
      }

      const snmp: boolean = editedResource.snmp_active;
      delete editedResource.snmp_active;
      delete editedResource.type;

      const response: INormalizeResourceStatus = yield call(api.editResource, newResource, editedResource);

      if (response.statusCode === 1) {
        yield put(actions.switchModalStatus(false));
      } else {
        yield put(stopSubmit(formName, { _error: response.statusCode }));
      }
      yield put(injectResource(meta.resource, showResourceFeature.actions.loadResource)(false, false));
      yield put(stopSubmit(formName));
      yield put({type: 'PRINTERS_MODULE:SWITCH_MODAL_STATUS', payload: false });
//     yield put({type: 'SHOW_RESOURCE:TOGGLE_SPINNER', payload: false });
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'PRINTERS_MODULE:SAVE_EDIT_RESOURCE_FAILED', payload: message, meta });
      yield put(stopSubmit(formName, { _error: message }));
    }
//    yield put({type: 'PRINTERS_MODULE:SWITCH_MODAL_STATUS', payload: false });
//    yield put({type: 'SHOW_RESOURCE:TOGGLE_SPINNER', payload: false });
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
      yield put({ type: 'PRINTERS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeDeleteAgent({ meta, meta: {resource} }: any) {
    try {
      const state = yield select();
      const deleteAgentId = state.printers.deleteAgentId;
      
      if (meta && resource.includes('printers')) {
        yield call(api.deleteResource, 'printers', deleteAgentId);
      } else {
        yield call(api.removeAgent, deleteAgentId);
      }
      yield put(injectResource(resource, showResourceFeature.actions.loadResource)(false, false));

      yield put(actions.switchRemoveModal());
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'PRINTERS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }
/*
  function* executeSyncPrintServerData({ meta }: NS.ISetEditPrintServerData) {
    const state: IReduxState = yield select();
    try {
      const response = yield call(api.syncPrinterData, state.printers.choosenPrintServerEditName, state.syncResource.data);
      if(response.data.err_code === 'ok') {
        yield put(actions.switchSyncModal());
      } else {
        yield put({type: 'SYNC_RESOURCE:SYNC_MODAL_ERROR', payload: true});
        const data = yield call(api.getPrintersList, state.printers.choosenPrintServerEditName);
        yield put({type: 'SYNC_RESOURCE:LOAD_SYNC_DATA_SUCCESS', payload: data.data, meta});
      }

      // if(!1) yield put({type: 'SYNC_RESOURCE:LOAD_SYNC_DATA_SUCCESS', payload: response.data, meta});
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'PRINTERS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
      yield put({type: 'SYNC_RESOURCE:SYNC_MODAL_ERROR', payload: true});

      const data = yield call(api.getPrintersList, state.printers.choosenPrintServerEditName);
      yield put({type: 'SYNC_RESOURCE:LOAD_SYNC_DATA_SUCCESS', payload: data.data, meta});
    }
  }
  */

  function* startEditHostGroup({ payload }: any) {
    try {
      yield put(initialize('edit_hostgroups', payload, true));
      yield put(actions.switchHostGroupEditModal());
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'PRINTERS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeEditHostGroup() {
    try {
      const newData = yield select(getFormValues('edit_hostgroups'));
      const { name, version, id } = newData;
      yield call(printersApi.updateHostGroup, id, { name, version });
      yield put(injectResource('hostgroups', showResourceFeature.actions.loadResource)(false, false));
      yield put(actions.switchHostGroupEditModal());
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'PRINTERS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeForceRestart() {
    try {
      const newData = yield select(getFormValues('edit_hostgroups'));
      const { id } = newData;
      yield call(printersApi.forseRestart, id);
      yield put(injectResource('hostgroups', showResourceFeature.actions.loadResource)(false, false));
      yield put(actions.switchHostGroupEditModal());
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'PRINTERS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* executeForceActivate({ payload }: any) {
    try {
      const newData = yield select(getFormValues('edit_hostgroups'));
      const { id } = newData;
      yield call(printersApi.forceActivate, id, payload);
      yield put(injectResource('hostgroups', showResourceFeature.actions.loadResource)(false, false));
      yield put(actions.switchHostGroupEditModal());
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'PRINTERS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
    }
  }

  function* startToLog({ payload }: any) {
    yield put(actions.setLogPrinterId(payload));
    yield put(actions.switchLogModal());
  }

  function* executeLog() {
    try {
      const state = yield select();
      const id = state.printers.logPrinterId.id;
      yield put(actions.switchLogModal());
      yield call(printersApi.forceLog, id);
      yield put({type: 'SHOW_RESOURCE:SHOW_ALERT', payload: { type: 'info', message: 'Лог запрошен' }});
    } catch (error) {
      yield put({type: 'SHOW_RESOURCE:SHOW_ALERT', payload: { type: 'error', message: 'Ошибка при запросе лога' }});
    }
  }

  function* executeToggleWebInterface( 
    { meta, payload: {id, web} }: NS.IToggleWebInterface) {
    try {
      if(!web){
        yield call(api.webOff, id);
        yield put(injectResource('reader', loadResource)(false, false));
      } else {
        yield call(api.webOn, id);
        yield put(injectResource('reader', loadResource)(false, false));
      }
      
      
      
    } catch (error) {
    }
  }

  function* executeGetPrinterGroup() {
    try {
      const data = yield call(api.getPrinterGroup);

      if (data.items.length === 0){
        yield put({ type: 'PRINTERS_MODULE:PRINTER_GROUPS_SWITCH', payload: false });
      } else {
        yield put({ type: 'PRINTERS_MODULE:PRINTER_GROUPS_SWITCH', payload: true });
      }

    } catch (error) {
    }
  }

  

  

  function* saga(): SagaIterator {
    const tryDeleteResourceType: NS.ITryDeleteResource      ['type'] = 'PRINTERS_MODULE:TRY_DELETE_RESOURCE';
    const deleteResourceType:    NS.IAcceptDeleteResource   ['type'] = 'PRINTERS_MODULE:ACCEPT_DELETE_RESOURCE';
    const editResourceType:      NS.IEditResourceAction     ['type'] = 'PRINTERS_MODULE:EDIT_RESOURCE';
    const saveEditResourceType:  NS.ISaveEditResourceAction ['type'] = 'PRINTERS_MODULE:SAVE_EDIT_RESOURCE';
    const saveEditGroupType:     NS.ISaveEditResourceGroupAction ['type'] = 'PRINTERS_MODULE:SAVE_EDIT_RESOURCE_GROUP';
    const createPrinterGroup:    NS.ICreatePrinterGroup     ['type'] = 'PRINTERS_MODULE:CREATE_PRINTER_GROUP';
    const createPlanFloor:       NS.ICreatePlanFloor        ['type'] = 'PRINTERS_MODULE:CREATE_PLAN_FLOOR';
    const editPlanFloor:         NS.IEditPlanFloor          ['type'] = 'PRINTERS_MODULE:EDIT_PLAN_FLOOR';
    const editPrintServerData:   NS.ISetEditPrintServerData ['type'] = 'PRINTERS_MODULE:SET_EDIT_PRINT_SERVER_DATA';
    const syncPrintServerData:   NS.ISyncPrintServersData   ['type'] = 'PRINTERS_MODULE:SYNC_PRINT_SERVER_DATA';
    const deleteAgent:           NS.IDeleteAgent            ['type'] = 'PRINTERS_MODULE:DELETE_AGENT';
    const toggleWebInterface:    NS.IToggleWebInterface     ['type'] = 'PRINTERS_MODULE:TOGGLE_WEB_INTERFACE';
    const forceRestart:          any = 'PRINTERS_MODULE:FORCE_RESTART';
    const forceActivate:         any = 'PRINTERS_MODULE:FORCE_ACTIVATE';
    const editHostGroup:         any = 'PRINTERS_MODULE:START_EDIT_HOST_GROUP';
    const runEditHostGroup:      any = 'PRINTERS_MODULE:EDIT_HOST_GROUP';
    const startLog:              any = 'PRINTERS_MODULE:START_LOG';
    const runLog:                any = 'PRINTERS_MODULE:EXECUTE_LOG';
    const getPrinterGroup:       any = 'PRINTERS_MODULE:GET_PRINTER_GROUP';
    


    yield all([
      takeLatest(tryDeleteResourceType, executeTryResourceDeleting),
      takeLatest(deleteResourceType, executeResourceDeleting),
      takeLatest(editResourceType, executeResourceEdits),
      takeLatest(saveEditResourceType, executeEditedResourceSaving),
      takeLatest(createPrinterGroup, executeCreatePrinterGroup),
      takeLatest(toggleWebInterface, executeToggleWebInterface),
      takeLatest(editPrintServerData, executeStartEditPrintServerData),
      // takeLatest(syncPrintServerData, executeSyncPrintServerData),
      takeLatest(deleteAgent, executeDeleteAgent),
      takeLatest(forceRestart, executeForceRestart),
      takeLatest(forceActivate, executeForceActivate),
      takeLatest(editHostGroup, startEditHostGroup),
      takeLatest(runEditHostGroup, executeEditHostGroup),
      takeLatest(startLog, startToLog),
      takeLatest(runLog, executeLog),
      takeLatest(saveEditGroupType, executeEditedResourceGroupSaving),
      takeLatest(getPrinterGroup, executeGetPrinterGroup),
      takeLatest(createPlanFloor, executeCreatePlanFloor),
      takeLatest(editPlanFloor, executeEditPlanFloor)
    ]);
  }

  return saga;
}

export default getSaga;

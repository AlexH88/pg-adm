import {IExtraArguments, IReduxState} from 'shared/types/app';
import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {SagaIterator} from 'redux-saga';
import getErrorMsg from 'shared/helpers/getErrorMessage';
import * as AT from '../../namespace/actionTypes';
import {IInitLoadSyncData} from '../../namespace/actionTypes';
import * as actions from './communication';
import {initDelay} from "../../../../shared/api/converters/globalutils";

// import {initDelay} from "../../../../shared/api/converters/globalutils";

function getSaga({ api }: IExtraArguments) {

  function* executeLoadSyncData(action: IInitLoadSyncData) { // TODO ненужный запрос
    if(!1) console.log(action);
/*    const resource = action.payload;
    try {
      const response = yield call(api.loadSyncData, resource );
      yield put(actions.loadSyncDataSuccess(response));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.loadSyncDataFailed({ error: message }));
    }*/
    yield 1
  }

  function* executeTrySyncData({ meta }: AT.ITrySyncItems) {
    if (!meta) {
      throw Error('No meta!');
    }
    try {
      const state: IReduxState = yield select();
      let selectedItems = state.syncResource.selectedAsyncItems; // Выбранные элементы из массива несинхронизированных принтеров
      if(meta.resource === 'catalogs') {
        state.syncResource.data.sync = [ ...state.syncResource.data.sync, ...selectedItems ]; // Добавляем в массив с синхронными элементами - массив с перетаскиваемыми элементами
        selectedItems.forEach((item) => {
          state.syncResource.data.unsync.splice(state.syncResource.data.unsync.indexOf(item),1);
        });
        state.syncResource.selectedAsyncItems = [];
        // const data = { groups: selectedItems };
        // const response = yield call(api.trySyncItems, data, meta.resource);
        // yield put(actions.trySyncItemsSuccess(response));

      } else if(meta.resource === 'hosts-network') {
        state.syncResource.selectedAsyncItems = [];
        yield executeSyncHosts({
          action: 'sync',
          printers: selectedItems,
        });
      } else {
        console.error('Непонятный ресурс!');
      }

    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.trySyncItemsFailed({ error: message }));
    }
  }

  function* executeTryAsyncData({ meta }: AT.ITryUnsyncItems) {
    if (!meta) {
      throw Error('No meta!');
    }
    try {
      const state: IReduxState = yield select();
      let selectedItems = state.syncResource.selectedSyncItems; // Выбранные элементы из массива несинхронизированных принтеров
      if(meta.resource === 'catalogs') {
        /*
        state.syncResource.data.unsync = [ ...state.syncResource.data.unsync, ...selectedItems ]; // Добавляем в массив с синхронными элементами - массив с перетаскиваемыми элементами
        selectedItems.forEach((item) => {
          state.syncResource.data.sync.splice(state.syncResource.data.sync.indexOf(item),1);
        });
        state.syncResource.selectedSyncItems = [];
        */
      } else if(meta.resource === 'hosts-network') {
        state.syncResource.selectedSyncItems = [];

        yield executeSyncHosts({
          action: 'unsync',
          printers: selectedItems,
        });
      }
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.tryUnsyncItemsFailed({ error: message }));
    }
  }

  interface ISyncData {
    action: 'sync' | 'unsync';
    printers: string[];
  }

  function* runSyncItem(syncedData: any, syncAction: any) {
    const meta = { resource: 'hosts' };
    const state: IReduxState = yield select();

    yield put({type: 'SYNC_RESOURCE:DRAW_PROGRESSBAR', payload: syncedData.name});

    let response;
    try {
      if (syncAction === 'sync') {
        response = yield call(api.syncPrinterData, state.agents.chosenHostId, syncedData );
      } else {
        response = yield call(api.unsyncPrinterData, state.agents.chosenHostId, syncedData );
      }
    } catch(error) {
      yield put({type: 'SYNC_RESOURCE:HIDE_PROGRESSBAR', payload: syncedData.name});
      yield put({type: 'SYNC_RESOURCE:PRINTER_SYNC_ERROR', payload: syncedData.name});
      yield initDelay(1000);
      yield put({type: 'SYNC_RESOURCE:PRINTER_SYNC_ERROR_HIDE', payload: syncedData.name});
      return;
    }

    if (response.status === 200) {
      yield put({type: 'SYNC_RESOURCE:PROGRESSBAR_LOADED_TRUE', payload: syncedData.name});
      yield initDelay(400);
      console.log(syncedData.name + ' готов');
      yield put({type: 'SYNC_RESOURCE:HIDE_PROGRESSBAR', payload: syncedData.name});
      
      if (syncAction === 'sync') {
        const newArr = state.syncResource.data.unsync;
        newArr.splice(state.syncResource.data.unsync.indexOf(syncedData.name),1);
        yield put({type: 'SYNC_RESOURCE:SET_SYNC_ITEMS', payload: {sync: [ ...state.syncResource.data.sync, syncedData.name ], unsync: newArr}})
      } else {
        const newArr = state.syncResource.data.sync;
        newArr.splice(state.syncResource.data.sync.indexOf(syncedData.name),1);
        yield put({type: 'SYNC_RESOURCE:SET_SYNC_ITEMS', payload: {sync: newArr, unsync: [ ...state.syncResource.data.unsync, syncedData.name ]}})
      }
      
      const data = yield call(api.getPrintersList, state.agents.chosenHostId);
      yield put({type: 'SYNC_RESOURCE:LOAD_SYNC_DATA_SUCCESS', payload: data.data, meta});
    } else {
      yield put({type: 'SYNC_RESOURCE:HIDE_PROGRESSBAR', payload: syncedData.name});
      yield put({type: 'SYNC_RESOURCE:PRINTER_SYNC_ERROR', payload: syncedData.name});
      yield initDelay(1000);
      yield put({type: 'SYNC_RESOURCE:PRINTER_SYNC_ERROR_HIDE', payload: syncedData.name});
      const data = yield call(api.getPrintersList, state.agents.chosenHostId);
      yield put({type: 'SYNC_RESOURCE:LOAD_SYNC_DATA_SUCCESS', payload: data.data, meta});
    }
  }

  function* executeSyncHosts(syncData: ISyncData) {
    const meta = { resource: 'hosts-network' };

    const state: IReduxState = yield select();
    try {

      for(let i = 0; i < syncData.printers.length; i++) {
        const printerName = syncData.printers[i];
        yield runSyncItem(printerName, syncData.action);
      }

    } catch (error) {

      const message = getErrorMsg(error);
      yield put({ type: 'PRINTERS_MODULE:EDIT_RESOURCE_FAILED', payload: message });
      yield put({type: 'SYNC_RESOURCE:SYNC_MODAL_ERROR', payload: true});

      const data = yield call(api.getPrintersList, state.agents.chosenHostId);
      yield put({type: 'SYNC_RESOURCE:LOAD_SYNC_DATA_SUCCESS', payload: data.data, meta});
    }
  }

  function* executeSyncData({ meta }: AT.ISyncItems) {
    if (!meta) {
      throw Error('No meta!');
    }
    try {
      const state: IReduxState = yield select();
      const selectedItems = state.syncResource.selectedAsyncItems;
      const data = { groups: selectedItems };
      const response = yield call(api.syncItems, data, meta.resource);
      yield put(actions.syncItemsSuccess(response));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.syncItemsFailed({ error: message }));
    }
  }

  function* executeUnsyncData({ meta }: AT.IUnsyncItems) {
    if (!meta) {
      throw Error('No meta!');
    }
    try {
      const state: IReduxState = yield select();
      const selectedItems = state.syncResource.selectedSyncItems;
      const data = { groups: selectedItems };
      const response = yield call(api.unsyncItems, data, meta.resource);
      yield put(actions.unsyncItemsSuccess(response));
    } catch (error) {
      const message = getErrorMsg(error);
      yield put(actions.unsyncItemsFailed({ error: message }));
    }
  }

  function* saga(): SagaIterator {

    const loadSyncData:  AT.IInitLoadSyncData ['type'] = 'SYNC_RESOURCE:LOAD_SYNC_DATA';
    const trySyncData:   AT.ITrySyncItems     ['type'] = 'SYNC_RESOURCE:TRY_SYNC_ITEMS';
    const tryUnsyncData: AT.ITryUnsyncItems   ['type'] = 'SYNC_RESOURCE:TRY_ASYNC_ITEMS';
    const syncData:      AT.ISyncItems        ['type'] = 'SYNC_RESOURCE:SYNC_ITEMS';
    const unsyncData:    AT.IUnsyncItems      ['type'] = 'SYNC_RESOURCE:UNSYNC_ITEMS';

    yield all([
      takeLatest(loadSyncData, executeLoadSyncData),
      takeLatest(trySyncData, executeTrySyncData),
      takeLatest(tryUnsyncData, executeTryAsyncData),
      takeLatest(syncData, executeSyncData),
      takeLatest(unsyncData, executeUnsyncData),
    ]);
  }

  return saga;
}

export default getSaga;

import * as NS from '../../namespace';

function initLoadSyncData(resource: string): NS.IInitLoadSyncData {
  return { type: 'SYNC_RESOURCE:LOAD_SYNC_DATA', payload: resource };
}

function loadSyncDataSuccess(data: NS.ISyncData): NS.ILoadSyncDataSuccess {
  return { type: 'SYNC_RESOURCE:LOAD_SYNC_DATA_SUCCESS', payload: data };
}

function loadSyncDataFailed(data: NS.IFailedResponse): NS.ILoadSyncDataFailed {
  return { type: 'SYNC_RESOURCE:LOAD_SYNC_DATA_FAILED', payload: data };
}

function selectItemResource(id: any, data: any, type: string, value: boolean): NS.ISelectItemResource {
  return { type: 'SYNC_RESOURCE:SELECT_ITEM_RESOURCE', payload: { id, data, type, value } };
}

function trySyncItems(): NS.ITrySyncItems {
  return { type: 'SYNC_RESOURCE:TRY_SYNC_ITEMS' };
}

function trySyncItemsSuccess(data: NS.ISyncingItems): NS.ITrySyncItemsSuccess {
  return { type: 'SYNC_RESOURCE:TRY_SYNC_ITEMS_SUCCESS', payload: data };
}

function trySyncItemsFailed(data: NS.IFailedResponse): NS.ITrySyncItemsFailed {
  return { type: 'SYNC_RESOURCE:TRY_SYNC_ITEMS_FAILED', payload: data };
}

function tryUnsyncItems(): NS.ITryUnsyncItems {
  return { type: 'SYNC_RESOURCE:TRY_ASYNC_ITEMS' };
}

function tryUnsyncItemsSuccess(data: NS.ISyncingItems): NS.ITryUnsyncItemsSuccess {
  return { type: 'SYNC_RESOURCE:TRY_ASYNC_ITEMS_SUCCESS', payload: data };
}

function tryUnsyncItemsFailed(data: NS.IFailedResponse): NS.ITryUnsyncItemsFailed {
  return { type: 'SYNC_RESOURCE:TRY_ASYNC_ITEMS_FAILED', payload: data };
}

function syncItems(): NS.ISyncItems {
  return { type: 'SYNC_RESOURCE:SYNC_ITEMS' };
}

function syncItemsSuccess(data: NS.ISyncingItems): NS.ISyncItemsSuccess {
  return { type: 'SYNC_RESOURCE:SYNC_ITEMS_SUCCESS', payload: data };
}

function syncItemsFailed(data: NS.IFailedResponse): NS.ISyncItemsFailed {
  return { type: 'SYNC_RESOURCE:SYNC_ITEMS_FAILED', payload: data };
}

function unsyncItems(): NS.IUnsyncItems {
  return { type: 'SYNC_RESOURCE:UNSYNC_ITEMS' };
}

function unsyncItemsFailed(data: NS.IFailedResponse): NS.IUnsyncItemsFailed {
  return { type: 'SYNC_RESOURCE:UNSYNC_ITEMS_FAILED', payload: data };
}

function unsyncItemsSuccess(data: NS.ISyncingItems): NS.IUnsyncItemsSuccess {
  return { type: 'SYNC_RESOURCE:UNSYNC_ITEMS_SUCCESS', payload: data };
}

function switchSyncUsersModal(): NS.ISwitchSyncUsersModal {
  return { type: 'SYNC_RESOURCE:SWITCH_SYNC_ITEMS_MODAL' };
}

interface IType {
  type: 'sync' | 'unsync';
  data: string[];
  selectedItems: string[];
}

function selectAllPrinters(data: IType): NS.ISelectAllItemResource {
  return { type: 'SYNC_RESOURCE:SELECT_ALL_ITEM_RESOURCE', payload: data };
}

export {
  initLoadSyncData,
  selectItemResource,
  trySyncItems,
  tryUnsyncItems,
  switchSyncUsersModal,
  syncItems,
  unsyncItems,
  loadSyncDataSuccess,
  loadSyncDataFailed,
  trySyncItemsSuccess,
  trySyncItemsFailed,
  tryUnsyncItemsSuccess,
  tryUnsyncItemsFailed,
  syncItemsSuccess,
  syncItemsFailed,
  unsyncItemsFailed,
  unsyncItemsSuccess,
  selectAllPrinters,
};

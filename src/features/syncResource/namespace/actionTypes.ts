import {IInjectedResource} from 'shared/helpers';

interface IInitLoadSyncData extends IInjectedResource {
  type: 'SYNC_RESOURCE:LOAD_SYNC_DATA';
}

interface ILoadSyncDataSuccess extends IInjectedResource {
  type: 'SYNC_RESOURCE:LOAD_SYNC_DATA_SUCCESS';
}

interface ILoadSyncDataFailed extends IInjectedResource {
  type: 'SYNC_RESOURCE:LOAD_SYNC_DATA_FAILED';
}

interface ISelectItemResource extends IInjectedResource {
  type: 'SYNC_RESOURCE:SELECT_ITEM_RESOURCE';
}

interface ISelectAllItemResource extends IInjectedResource {
  type: 'SYNC_RESOURCE:SELECT_ALL_ITEM_RESOURCE';
}

interface ITrySyncItems extends IInjectedResource {
  type: 'SYNC_RESOURCE:TRY_SYNC_ITEMS';
}

interface ITrySyncItemsFailed extends IInjectedResource {
  type: 'SYNC_RESOURCE:TRY_SYNC_ITEMS_FAILED';
}

interface ITrySyncItemsSuccess extends IInjectedResource {
  type: 'SYNC_RESOURCE:TRY_SYNC_ITEMS_SUCCESS';
}

interface ITryUnsyncItems extends IInjectedResource {
  type: 'SYNC_RESOURCE:TRY_ASYNC_ITEMS';
}

interface ITryUnsyncItemsFailed extends IInjectedResource {
  type: 'SYNC_RESOURCE:TRY_ASYNC_ITEMS_FAILED';
}

interface ITryUnsyncItemsSuccess extends IInjectedResource {
  type: 'SYNC_RESOURCE:TRY_ASYNC_ITEMS_SUCCESS';
}

interface ISyncItems extends IInjectedResource {
  type: 'SYNC_RESOURCE:SYNC_ITEMS';
}

interface ISyncItemsSuccess extends IInjectedResource {
  type: 'SYNC_RESOURCE:SYNC_ITEMS_SUCCESS';
}

interface ISyncItemsFailed extends IInjectedResource {
  type: 'SYNC_RESOURCE:SYNC_ITEMS_FAILED';
}

interface IUnsyncItems extends IInjectedResource {
  type: 'SYNC_RESOURCE:UNSYNC_ITEMS';
}

interface IUnsyncItemsSuccess extends IInjectedResource {
  type: 'SYNC_RESOURCE:UNSYNC_ITEMS_SUCCESS';
}

interface IUnsyncItemsFailed extends IInjectedResource {
  type: 'SYNC_RESOURCE:UNSYNC_ITEMS_FAILED';
}

interface ISwitchSyncUsersModal extends IInjectedResource {
  type: 'SYNC_RESOURCE:SWITCH_SYNC_ITEMS_MODAL';
}

interface ISitchErrorMessage extends IInjectedResource {
  type: 'SYNC_RESOURCE:SYNC_MODAL_ERROR';
}

interface ISetSyncItems extends IInjectedResource {
  type: 'SYNC_RESOURCE:SET_SYNC_ITEMS';
}

interface IDrawProgressBar extends IInjectedResource {
  type: 'SYNC_RESOURCE:DRAW_PROGRESSBAR';
}

interface IHideProgressBar extends IInjectedResource {
  type: 'SYNC_RESOURCE:HIDE_PROGRESSBAR';
}

interface ILoadedTrue extends IInjectedResource {
  type: 'SYNC_RESOURCE:PROGRESSBAR_LOADED_TRUE';
}

interface IPrinterSyncError extends IInjectedResource {
  type: 'SYNC_RESOURCE:PRINTER_SYNC_ERROR';
}

interface IPrinterSyncErrorHide extends IInjectedResource {
  type: 'SYNC_RESOURCE:PRINTER_SYNC_ERROR_HIDE';
}

interface IClearAllProgressbar extends IInjectedResource {
  type: 'SYNC_RESOURCE:CLEAR_ALL_PROGRESSBAR';
}

interface IClearErrors extends IInjectedResource {
  type: 'PRINTERS_MODULE:SWITCH_SYNC_MODAL';
}

type SyncResourceActions = IInitLoadSyncData
  | ISelectItemResource
  | ITryUnsyncItems
  | ITrySyncItems
  | ISwitchSyncUsersModal
  | ISyncItems
  | IUnsyncItems
  | ILoadSyncDataSuccess
  | ITrySyncItemsSuccess
  | ITrySyncItemsFailed
  | ITryUnsyncItemsSuccess
  | ITryUnsyncItemsFailed
  | IUnsyncItemsFailed
  | IUnsyncItemsSuccess
  | ISyncItemsFailed
  | ISyncItemsSuccess
  | ISitchErrorMessage
  | ISetSyncItems
  | IDrawProgressBar
  | IHideProgressBar
  | ILoadedTrue
  | IPrinterSyncError
  | IPrinterSyncErrorHide
  | IClearAllProgressbar
  | ISelectAllItemResource
  | IClearErrors

export {
  SyncResourceActions,
  IInitLoadSyncData,
  ISelectItemResource,
  ITrySyncItems,
  ITryUnsyncItems,
  ISwitchSyncUsersModal,
  ISyncItems,
  IUnsyncItems,
  ITrySyncItemsSuccess,
  ILoadSyncDataSuccess,
  ITryUnsyncItemsSuccess,
  ILoadSyncDataFailed,
  ITrySyncItemsFailed,
  ITryUnsyncItemsFailed,
  IUnsyncItemsFailed,
  IUnsyncItemsSuccess,
  ISyncItemsFailed,
  ISyncItemsSuccess,
  ISitchErrorMessage,
  ISetSyncItems,
  IDrawProgressBar,
  IHideProgressBar,
  ILoadedTrue,
  IPrinterSyncError,
  IPrinterSyncErrorHide,
  IClearAllProgressbar,
  ISelectAllItemResource,
  IClearErrors,
}
